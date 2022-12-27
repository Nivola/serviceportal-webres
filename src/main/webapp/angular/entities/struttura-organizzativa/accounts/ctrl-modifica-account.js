/*-
 * ========================LICENSE_START=================================
 * Nivola Service Portal Web Resources
 * %%
 * Copyright (C) 2022 Regione Piemonte
 * %%
 * SPDX-FileCopyrightText: Copyright 2022 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
nivolaApp.controller('ModificaAccountController', [
    '$rootScope', '$scope', '$state', '$anchorScroll', '$location', '$timeout',
    '$stateParams', 'controllerValidator',
    'notificationManager',
    '$mdDialog',
    "utils", "$filter", 'entitiesRest', "AuthenticationService", "AuthLevel", '$translate','$q','loggers',
    function (
        $rootScope, $scope, $state, $anchorScroll, $location, $timeout,
        $stateParams, controllerValidator,
        notificationManager,
        $mdDialog,
        utils, $filter, entitiesRest, AuthenticationService, AuthLevel, $translate,$q,loggers
    ) {
        'use strict';

        var DettaglioAccount = entitiesRest.getEntity('DettaglioAccount');
        var Account = entitiesRest.getEntity('Account');
        var InfoRendicontazione = entitiesRest.getEntity('InfoRendicontazione');
        var Prezzario = entitiesRest.getEntity('Prezzario');
        var SharesNetappsAssociati = entitiesRest.getEntity('SharesNetappsAssociati');
        var StrumentiAmministrazione = entitiesRest.getEntity('StrumentiAmministrazione');
        var PricesHistory = entitiesRest.getEntity('PriceListHistory');
        var Infocosto = entitiesRest.getEntity('Infocosto');
        var InfoRemove = entitiesRest.getEntity('RemoveInfocosto');
        var Tipi = entitiesRest.getEntity('Tipi');
        var AccountWbs = entitiesRest.getEntity('AccountWbs');
        var RevocaAssociaWbs= entitiesRest.getEntity('RevocaAssociaWbs');
        
        var defer = $q.defer();
        
	var logger = loggers.get("ModificaAccountController");

        var AccountCapabilities = entitiesRest.getEntity('AccountCapabilities');
        var Listino = entitiesRest.getEntity('listaListini');
        $scope.acronimi = [];
        $scope.prezzari = [];
        $scope.listini = [];
        $scope.pricesHistory = [];
        $scope.tipiListino = [];

        $scope.formModificaAccount = {};

        $scope.organizzazioniDivisioni = [];
        $scope.categorie = [
            { nome: $translate.instant('organizzazioni.categoria.public'), value:'public' },
            { nome: $translate.instant('organizzazioni.categoria.csi'), value:'csi' },
            { nome: $translate.instant('organizzazioni.categoria.privata'), value:'private' }
        ];

        //info rendicontazione Account
        $scope.infoRendicontazioniAccount = [];

        $scope.selected = [];

       $scope.limitOptions = [ 10, 20, 30];

        $scope.filter = {
            options: {
                debounce: 500
            }
        };

        $scope.query = {
            order: "organizzazione_name",
            limit: 10,
            page: 1
        };

        $scope.options = {
            isDataLoaded: false,
            isCapabilitiesLoaded: false,
            isOrganizzazioneDivisioneSoloLettura: true,
            disabilitaModificaAcronimo: false,
            //aggiunti
            rowSelection: false,
            multiSelect: false,
            autoSelect: false,
            decapitate: false,
            largeEditDialog: false,
            boundaryLinks: false,
            limitSelect: true,
            pageSelect: true,
            editInfoRendicontazione: false,
            newInfoRendicontazione: false,
            detailsInfoRendicontazione: false,

        };

        $scope.iconStyle = {
        };
        $scope.account = {};

        $scope.gestione = {};

        $scope.capabilities = [];
        $scope.sharesAssociati = [];

        $scope.staticAccountData=null;

        $scope.pricesHistoryLoop=0;

        $scope.actions = {
            auth: {
                newInfoRendicontazione: $state.get("app.account.newinforendicontazione").requiredUC,
                newAssoShareAccount : $state.get("app.account.newAssoShareAccount").requiredUC,
            },
            refresh: function (event) {
                getAccountCapabilities();
            },
            aggiornaInfoRendicontazioni: function () {
                $scope.myDate=null
                getInfoRendicontazioniAccount();
            },
            aggiornaSharesAssociati: function () {
                getSharesAssociati(); 
            },
            invia: function (event) {
                event.stopPropagation();
                try {
                        $scope.accountAggiorna = angular.copy($scope.account);
                        $scope.accountAggiorna.divisioneNome =  angular.copy($scope.account.divisione.name);
                        $scope.accountAggiorna.organizzazioneNome = angular.copy($scope.account.organizzazione.name);
                        $scope.accountAggiorna.divisione =  null;
                        $scope.accountAggiorna.organizzazione = null;
                        $scope.accountAggiorna.creation = null;
                        $scope.accountAggiorna.modified = new Date();
                        
                        if ($scope.account.dataInizioConsumi) {
                            $scope.accountAggiorna.dataInizioConsumi = $scope.account.dataInizioConsumi.toISOString();
                        }
                        if ($scope.account.dataFineConsumi) {
                            $scope.accountAggiorna.dataFineConsumi = $scope.account.dataFineConsumi.toISOString();
                        }
                            Account.update($scope.accountAggiorna, function (data) {
                            if (!data && !data.data && data.status != 200) {
                                $scope.options.isDataLoaded = true;
                                notificationManager.showErrorPopup($translate.instant('accounts.modifica.error'));
                                return;
                            }

                            notificationManager.showSuccessPopup($translate.instant('accounts.modifica.success'));
                            getAccount();
                            //dopo salvataggio ritorno in testa
                            $location.hash('modificaAccount');
                            $anchorScroll('modificaAccount');
                            $scope.options.isDataLoaded = true;
                        }, function (onfail) {
                            notificationManager.showErrorPopup($translate.instant('accounts.modifica.fail'));
                            $scope.options.isDataLoaded = true;
                        });

                        return;
                } finally {
                    $scope.options.isDataLoaded = true;
                }
            },

           
            abilita: function (cap) {
                cap.pulsante = 'Abilitazione In Corso';
                $scope.promise = AccountCapabilities.save({ 'id': $scope.idAccount, 'uuidCapability': cap.uuid }).$promise;

                return $scope.promise.then(function (data) {
                    notificationManager.showSuccessPopup($translate.instant('accounts.modifica.abilitazione_required'));

                }, function (onfail) {
                    notificationManager.showErrorPopup($translate.instant('accounts.modifica.abilitazione_error'));
                }).finally(function () {
                    getAccountCapabilities();
                    $scope.options.isDataLoaded = true;
                });
            },
            //servizi
            nuovaInfoRendicontazione: function () {
                $state.go('app.account.newinforendicontazione', { idAccount: $scope.account.uuid ,accountName: $scope.account.name });
            },
            
            nuovaAssoShareAccount: function () {
                $state.go('app.account.newAssoShareAccount', { idAccount: $scope.account.uuid ,accountName: $scope.account.name });
            },
            modificaInfoRendizontazione: function (info) {
                $state.go('app.account.editinforendicontazione', { infoRendicontazione: info, idAccount: $scope.account.idAccount ,accountName: $scope.account.name });
            },
            modificaAssociazioneShareAccount: function (share) {
                $state.go('app.account.editassociazioneshareaccount', { shareNettapp: share, idAccount: $scope.account.idAccount ,accountName: $scope.account.name });
            },
            dettaglioInfoRendicontazione: function (info) {
                $scope.options.detailsInfoRendicontazione = true;
                $state.go('app.account.editinforendicontazione', { infoRendicontazione: info });

            },
            deleteInfoRendicontazione: function (info) {
                var confirm = $mdDialog
                .confirm()
                .title($translate.instant('accounts.info_rendicontazione.elimina.titolo') + ' ' + info.descrizioneMetrica)
                .htmlContent(" <md-dialog-content class='md-dialog-content ng-scope'> <div> <b class='ng-binding '>" + $translate.instant('accounts.info_rendicontazione.elimina.testo') + "</b><br><br><p class='ng-binding'>" + $translate.instant('accounts.info_rendicontazione.elimina.procedere')+ "</b> <br></div></md-dialog-content>")
                .targetEvent(event)
                .ok($translate.instant('conferma'))
                .cancel($translate.instant('annulla'))
            $mdDialog.show(confirm).then(function () {
                InfoRendicontazione.delete({ idMetrica: info.idValore,idAccount:info.accountUuid }, function (data) {
                    notificationManager.showSuccessPopup($translate.instant('accounts.info_rendicontazione.elimina.success'));
                    getInfoRendicontazioniAccount();
                }, function (onfail) {
                    notificationManager.showErrorPopup($translate.instant('accounts.info_rendicontazione.elimina.error') + ' ' + info.descrizioneMetrica);
                });
            });
            },
            ricalcoloCosti: function () {
                var titoloConfirm = 'Cancellazione costi singolo account';
                var contentConfirm = " <md-dialog-content class='md-dialog-content ng-scope'> <div> <b class='ng-binding '>Stai per eliminare i costi dell'account"+ $scope.account.name +"</b><br><br><p class='ng-binding'>" + $translate.instant('accounts.info_rendicontazione.elimina.procedere')+ "</b> <br></div></md-dialog-content>"
                var accountIdRimozione = $scope.idAccount;
                if ($scope.gestione.forzaTuttiAccount) {
                    var titoloConfirm = "Cancellazione costi TUTTI GLI account";
                    var contentConfirm = " <md-dialog-content class='md-dialog-content ng-scope'> <div style='color:red;!important'> <b>Stai per eliminare I COSTI DI TUTTI GLI ACCOUNT</b><br><br><p class='ng-binding'>" + $translate.instant('accounts.info_rendicontazione.elimina.procedere')+ "</b> <br></div></md-dialog-content>"    
                    accountIdRimozione= 'none';
                }

                var confirm = $mdDialog
                .confirm()
                .title(titoloConfirm)
                .htmlContent(contentConfirm)
                .targetEvent(event)
                .ok($translate.instant('conferma'))
                .cancel($translate.instant('annulla'));

                $mdDialog.show(confirm).then(function () {
                    //questo parametro è true quando il servizio mette lungo a rispondere
                    $rootScope.loadingElement =  true ; 
                   
                    $scope.promise =  StrumentiAmministrazione.delete({ 'uuidAccount': accountIdRimozione, 'data': $scope.gestione.dataInizioConsumi.toISOString().split('T')[0] }).$promise;
                    //$rootScope.loadingElement  = $scope.promise;  
                    //$scope.promise ? $rootScope.loadingElement = false : $rootScope.loadingElement = true
                    return $scope.promise.then(function (data) {
                        
                            notificationManager.showSuccessPopup($translate.instant('accounts.modifica.ricalcolo_success'));
                           
    
                        }, function (onfail) {
                            notificationManager.showErrorPopup($translate.instant('accounts.modifica.ricalcolo_error') +'<br/>'+  onfail.data.message);
                           
                        }



                    ).finally(function() {
                        $rootScope.loadingElement = false;
                    });
                });
            },
            
		associaWbs : function (ev) {
            $scope.selected=[];
            
            $mdDialog.show({
                locals: {
                    idAccount: $scope.idAccount
                    
                }, //C:\workspace-nivola\nivola-front-end\serviceportal-webres\src\main\webapp\angular\entities\struttura-organizzativa\accounts\tpl-dialog-associa-wbs.html
                controller: 'DialogAssociaWbs',
                templateUrl: 'angular/entities/struttura-organizzativa/accounts/tpl-dialog-associa-wbs.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: true	
            }).then(function (data) {
                console.log(data);
				getWbs(); 
            });;
        },

		revocaAssociaWbs : function (idwbs){

			var confirm = $mdDialog
			.confirm()
			.title($translate.instant('accounts.wbs.revoke_title'))
			.textContent($translate.instant('accounts.wbs.revoke_subtitle'))
			.targetEvent(event)
			.ok($translate.instant('accounts.wbs.revoke_options_yes'))
			.cancel($translate.instant('accounts.wbs.revoke_options_no'));
		$mdDialog.show(confirm).then(function () {
			
				RevocaAssociaWbs.delete({ accountId: $scope.idAccount , associazioneId : idwbs }, function (data) {
					//$rootScope.loadingElement = true;
					logger.info("SUCCESS", data);
					notificationManager.showSuccessPopup($translate.instant('accounts.wbs.revoke_success') +data.message);
				
					getAccount();
					getWbs(); 
				}, function (onfail) {
					logger.error("ERROR", onfail);
					
					if (onfail.data) {
						 notificationManager.showErrorPopup( $translate.instant('accounts.wbs.revoke_error'),+ onfail.data.message);
					} else if (onfail.data.messaggio){
						notificationManager.showErrorPopup($translate.instant('accounts.wbs.revoke_error'),   + onfail.data.messaggio);
					}else {
						notificationManager.showErrorPopup($translate.instant('accounts.wbs.revoke_error'),);
					}
				});
		
		});
			
		
		},
        };

        $scope.onChangeFiltroPeriodo= function () {
            if($scope.myDate!=null){
               var filteredList = $scope.infoRendicontazioniAccount.filter(element => {
                   return ( (new Date(element.dataDa).getTime()<= new Date($scope.myDate).getTime())  
                           &&( (new Date(element.dataA).getTime()>= new Date($scope.myDate).getTime()) || (element.dataA==null)  )
                           
                           );
                
               })
       
               $scope.infoRendicontazioniAccount= filteredList; 
            }
        };


        $scope.onAggiornaCostiGiornoChanged = function () {
            if($scope.account.aggiornaCostiGiorno===false){
                $scope.account.dataInizioConsumi= null ;
            }
            isSalvaready();
        };

        $scope.onChangeTuttiAccount = function () {
            if($scope.gestione.forzaTuttiAccount===true){
                document.getElementById('contenitoreSwitch').style ="color:red";
                document.getElementById('labelSwitch').style ="color:red";
            } else {
                document.getElementById('contenitoreSwitch').style ="color:black";
                document.getElementById('labelSwitch').style ="color:black";
            }
            isSalvaready();
        };

       function isSalvaready(){
            $scope.isSalvable=false
            if(  $scope.account.aggiornaCostiGiorno===true ){
                if( $scope.account.dataInizioConsumi && $scope.account.codicePrezzo){
                    $scope.isSalvable= true;
                }
            }else{
                $scope.isSalvable= true;
            }
       }

        $scope.onDateChanged = function () {
            isSalvaready();
        };


        $scope.isInfoTenant = function (info) {
            return info.nomeMetricaDefinizione.includes('tenant');
        };
        function getAccount() {
           
            $scope.idAccount = $stateParams.idAccount;
            $scope.options.isDataLoaded = false;
            if (!$scope.idAccount) {
                return;
            }
            $scope.promise = DettaglioAccount.get({ 'uuid': $scope.idAccount }).$promise;

            return $scope.promise.then(function (data) {
                
                $scope.account = angular.copy(data); 
                
                if(!$scope.account.idListinoSpecifico&&$scope.account.listino&&$scope.account.listino.id){
                    $scope.account.idListinoSpecifico=$scope.account.listino.id;
                    getListini();
                }
                console.log('ACCOUNT: ',$scope.account);
                $scope.account.listinoDefault=!$scope.account.idListinoSpecifico;   
                $scope.options.disabilitaModificaAcronimo = $scope.account && $scope.account.acronimo;
                $scope.account.dataInizioConsumi = $scope.account.dataInizioConsumi!=null? new Date(Date.parse($scope.account.dataInizioConsumi)) : null;
                
                
                $scope.staticAccountData = angular.copy(data); 
            }, function (onfail) {
                notificationManager.showErrorPopup($translate.instant('error.loading_account_anagrafica'));
            }).finally(function () {
                $scope.options.isDataLoaded = true;
                isSalvaready(); 
            });
        };

        function getAccountCapabilities() {
            $scope.options.isCapabilitiesLoaded = false;
           


            $scope.promise = AccountCapabilities.get({ 'id': $scope.idAccount }).$promise;

            return $scope.promise.then(function (data) {
               

                $scope.capabilities = angular.copy(data);
                for (var i = 0, len = $scope.capabilities.length; i < len; i++) {
                    $scope.capabilities[i].pulsante = $translate.instant('accounts.modifica.abilita');
                }
            }, function (onfail) {
                notificationManager.showErrorPopup($translate.instant('error.loading_capabilities'));
            }).finally(function () {
                $scope.options.isCapabilitiesLoaded = true;
            });
        };

        
        function getSharesAssociati() {
            $scope.options.isSharesLoaded = false;
           
            var queryString = {accountUuid : $stateParams.idAccount};
            $scope.promise = SharesNetappsAssociati.query(queryString).$promise;

            return $scope.promise.then(function (data) {
                $scope.sharesAssociati = angular.copy(data);
               

            }, function (onfail) {
                notificationManager.showErrorPopup($translate.instant('error.loading_shares_associati'));
            }).finally(function () {
                $scope.options.isSharesLoaded = true;
            });
        };


        $scope.checkAcronimo = function () {
            //acronimo 
            if (!$scope.formModificaAccount.$invalid && $scope.account.acronimo !== null && $scope.account.acronimo !== ''
                && $scope.acronimi.length > 0 && $scope.acronimi.findIndex(x => x.toLowerCase() == $scope.account.acronimo.toLowerCase()) !== -1) {
            
                var datiTesto = {
                    acronimo: $scope.account.acronimo
                }
                notificationManager.showErrorPopup($translate.instant('accounts.modifica.acronimo_usato', datiTesto));
                return;
            }
        };
        function formatDate(d) {
            let month = String(d.getMonth() + 1);
            let day = String(d.getDate());
            const year = String(d.getFullYear());

            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;

            return `${day}-${month}-${year}`;
        }


        function getInfoRendicontazioniAccount() {
            var queryString = {
                idAccount: $stateParams.idAccount
            };
            
            $scope.promise = InfoRendicontazione.query(queryString).$promise;


            return $scope.promise.then(function (data) {
              

                if (data) {
                    $scope.infoRendicontazioniAccount = data;
                }

            }, function (onfail) {
                if (onfail.body) {
                    if (onfail.body.data && onfail.body.data.message) {
                        notificationManager.showErrorPopup($translate.instant('error.loading_rendicontazioni_account') + ': ' + onfail.body.data.message);
                    } else {
                        notificationManager.showErrorPopup($translate.instant('error.loading_rendicontazioni_account'));
                    }
                } else {
                    notificationManager.showErrorPopup($translate.instant('error.loading_rendicontazioni_account'));
                }
            });
        };


        function getAccounts() {
            var queryString = {};
           
            $scope.options.isDataLoaded = false;
            $scope.promise = Account.query(queryString).$promise;

            return $scope.promise.then(function (data) {
               

                data.forEach(function (value) {
                    //acronimi
                    if (value.acronimo && $scope.acronimi.findIndex(x => x == value.acronimo) === -1) {
                        $scope.acronimi.push(value.acronimo);
                    }
                });
            }, function (onfail) {
                if (onfail.body) {
                    if (onfail.body.data && onfail.body.data.message) {
                        notificationManager.showErrorPopup($translate.instant('error.loading_divisioni') + ' ' + onfail.body.data.message);
                    } else {
                        notificationManager.showErrorPopup($translate.instant('error.loading_divisioni'));
                    }
                } else {
                    notificationManager.showErrorPopup($translate.instant('error.loading_divisioni'));
                }
            }).finally(function () {
                $scope.options.isDataLoaded = true;
            });
        };


        function getPrezzari() {
            var queryString = {};
            $scope.options.isDataLoaded = false;
           

            $scope.promise =    Prezzario.query(queryString).$promise; 
           
           return $scope.promise.then(function (data) {
             

               $scope.prezzari =  angular.copy(data);

           }, function (onfail) {
               notificationManager.showErrorPopup($translate.instant('error.loading_prezzari'));
           }).finally(function () {
               $scope.options.isDataLoaded = true;
           });
       };


    //    $scope.getPersons = function () {  
    //         getPersonIDs()
    //  };

        function decodePersonID(personid) {  
            var person =  $scope.persons.filter(function(item){
                return item.personId = personid; 
            });

            return person; 
          
     };  
        
        function getPersonIDs() {  
               /* var queryString = {};
                $scope.options.isDataLoaded = false;
                $scope.promise =    Persons.query(queryString).$promise; 
            
            return $scope.promise.then(function (data) {
                $scope.persons =  angular.copy(data);
               // $scope

            }, function (onfail) {
                notificationManager.showErrorPopup(onfail.data.message);
            }).finally(function () {
                $scope.options.isDataLoaded = true;
            });*/
        };    

        $scope.onLoadListiniDisponibili=function(firstLoad){
            $scope.loadListiniDisponibili(firstLoad.firstLoad)
        }
        
        $scope.loadListiniDisponibili=function(doLoad){
            if(doLoad){
            $scope.account.codicePrezzo  = null;
            $scope.options.isDataLoaded = false;
            $scope.prezzari=[];
            getListini();
            
        }else{
            $scope.listini=[];
            $scope.account.listino=null;
            getPrezzari();
            $scope.account.idListinoSpecifico=null;
            
        }
    }
    
    function getListini(){
        var queryString = {};
            $scope.promise =    Listino.query(queryString).$promise; 
            return $scope.promise.then(function (data) {
                $scope.listini=angular.copy(data);
            }, function (onfail) {
                notificationManager.showErrorPopup($translate.instant('error.loading_listini'));
            }).finally(function () {
                $scope.options.isDataLoaded = true;
            });
        }
        
        $scope.loadPrezzi=function(){
            var listaPrezziListino=$scope.listini.filter(el=>el.id===$scope.account.idListinoSpecifico)
            if(listaPrezziListino&&listaPrezziListino.length===1){
                $scope.prezzari=angular.copy(listaPrezziListino[0].tipiPrezzoAmmessi)
            }
        }

        function setPriceListData(list){
            const dayTime=86400000;
            var orderedList=list.sort((a, b) => new Date(Date.parse(a.dataInizioAssociazione)) - new Date(Date.parse(b.dataInizioAssociazione)));
            var defaultListino=angular.copy(list.filter(l=>l.usaListinoSpecifico==='N')[0]);

            return orderedList.reverse();
        }

        function getPriceListHistory(){
            var queryString = {};
            queryString.accountId=$scope.idAccount;
            $scope.promise =    PricesHistory.query(queryString).$promise; 
           
           return $scope.promise.then(function (data) {
            if(data.length===0){
                if($scope.pricesHistoryLoop>=10){
                    notificationManager.showErrorPopup($translate.instant('error.modifica.errors.price_lists'));
                    return;
                }
                saveMissingDefaultPriceSettings();
            }else{
                var ordedPricesHistory=setPriceListData(data)
                $scope.pricesHistory=angular.copy(ordedPricesHistory);  
                $rootScope.loadingElement = false;         
            }
            }, function (onfail) {
               notificationManager.showErrorPopup($translate.instant('error.modifica.errors.price_lists'));
           }).finally(function(){
                $rootScope.loadingElement = false;
           });

        }

        function saveMissingDefaultPriceSettings(){
            $scope.pricesHistoryLoop++;
            setTimeout(() => {
                if($scope.promise.$$state.status===0){
                    $rootScope.loadingElement = true;
                }
            }, 500);
            const infocosto={

            }

            $scope.promise = Infocosto.save(infocosto).$promise
           
           return $scope.promise.then(function (data) {
            notificationManager.showSuccessPopup($translate.instant('success.default_price_list'));
            
           }, function (onfail) {
               notificationManager.showErrorPopup($translate.instant('error.loading_prezzari'));
           }).finally(function () {
                getPriceListHistory();
           });
        }

        $scope.saveRendicontazione=function (data){
            setTimeout(() => {
                if($scope.promise.$$state.status===0){
                    $rootScope.loadingElement = true;
                }
            }, 500);
            const toUpdate=data.isUpdate;
            var infocosto=angular.copy(data.data);
            infocosto.dataInizioAssociazione = new Date(infocosto.dataInizioAssociazione.setHours(12)).toISOString();
            if (infocosto.dataFineAssociazione)
                infocosto.dataFineAssociazione = new Date(infocosto.dataFineAssociazione.setHours(12)).toISOString();
            var accountAggiornato=angular.copy($scope.account);
            accountAggiornato.listinoDefault=!infocosto.idListino
            accountAggiornato.idListinoSpecifico=infocosto.idListino;
            accountAggiornato.codicePrezzo=infocosto.tipoPrezzoCodice;
            accountAggiornato.modified=new Date();
            var multiPromise=[];
           
            if($scope.staticAccountData!==$scope.account){
                multiPromise.push( Account.update(accountAggiornato).$promise);
            }
            if (infocosto.tipoPrezzoCodice) {
               if (toUpdate) {
                  multiPromise.push(Infocosto.update(infocosto).$promise);
               } else {
                  multiPromise.push(Infocosto.save(infocosto).$promise);
               }
            }
            if(multiPromise.length>0){

                $q.all(multiPromise).then(function(data){
                    if (!data && !data.data && data.status != 200) {
                        $scope.options.isDataLoaded = false;
                        notificationManager.showErrorPopup($translate.instant('accounts.modifica.errors.price_list'));
                    
                    return;
                }
                
            notificationManager.showSuccessPopup($translate.instant('success.price_list_update'));
            }, function (onfail) {
                if (onfail.data) {
                    notificationManager.showErrorPopup($translate.instant('accounts.modifica.errors.price_list') + ': ' + onfail.data.message);
                } else {
                    notificationManager.showErrorPopup($translate.instant('accounts.modifica.errors.price_list'));
                }
            }).finally(function () {
                getPriceListHistory();
            });
        }
            
        }

        function getTipiListino() {
            var queryString = {};
            $scope.options.isDataLoaded = false;
            $scope.promise =    Tipi.query(queryString).$promise; 
           
           return $scope.promise.then(function (data) {
               $scope.tipiListino =  angular.copy(data);

           }, function (onfail) {
               notificationManager.showErrorPopup($translate.instant('accounts.errors.price_list_types'));
           }).finally(function () {
               $scope.options.isDataLoaded = true;
           });
       };

       $scope.cancelRendicontazione=function (idListino){
        setTimeout(() => {
            if($scope.promise.$$state.status===0){
                $rootScope.loadingElement = true;
            }
        }, 500);
        $scope.promise=InfoRemove.delete({ id: idListino.idListino }).$promise
        
        $scope.promise.then(function(data){
            if (!data && !data.data && data.status != 200) {
                $scope.options.isDataLoaded = false;
                notificationManager.showErrorPopup($translate.instant('accounts.modifica.errors.delete'));
                return;
            }
        }, function (onfail) {
            if (onfail.data) {
                notificationManager.showErrorPopup($translate.instant('accounts.modifica.errors.delete') + ': ' + onfail.data.message);
            } else {
                notificationManager.showErrorPopup($translate.instant('accounts.modifica.errors.delete'));
            }
        }).finally(function () {
            getPriceListHistory();
        });
        
    }

    function getWbs() {
		var queryString = {};
		var id =  $stateParams.idAccount;
		queryString.accountId = id;
		$scope.promise = AccountWbs.query(queryString).$promise;

		return $scope.promise.then(function (data) {
			logger.info("SUCCESS", data);
			$scope.elencoWbs = data;
		}, function (onfail) {
			logger.error("ERROR", onfail);
			if (onfail.body) {
				if (onfail.body.data && onfail.body.data.message) {
					notificationManager.showErrorPopup($translate.instant('error.loading_vpc') + ': ' + onfail.body.data.message);
				} else {
					notificationManager.showErrorPopup($translate.instant('error.loading_vpc'));
				}
			} else {
				notificationManager.showErrorPopup($translate.instant('error.loading_vpc'));
			}
		});
	};

        this.refresh=function(){
            $scope.status.tabIndex = 0;
            getPersonIDs() ;
            getAccount();
            getAccounts(); 
            getAccountCapabilities();
            getInfoRendicontazioniAccount();
            getPriceListHistory();
            getSharesAssociati(); 
            getWbs(); 
            $location.hash('modificaAccount');
            $anchorScroll('modificaAccount');
        }

        this.onInit = function () {
            $scope.status.tabIndex =$stateParams.tabIndex?$stateParams.tabIndex: 0;
            //$rootScope.loadingElement = null; 
            getPersonIDs() ;
            getAccount();
            getAccounts();
            getAccountCapabilities();
            getInfoRendicontazioniAccount();
            getPriceListHistory();
            getSharesAssociati(); 
            getPrezzari();
            getTipiListino();
            getWbs(); 
            
        };

        this.onExit = function () { 
            $stateParams.idAccount=null;
            $stateParams.idDivisione=null;
            $scope.staticAccountData=null;
        };

        controllerValidator.validate(this, $scope);
    }]);

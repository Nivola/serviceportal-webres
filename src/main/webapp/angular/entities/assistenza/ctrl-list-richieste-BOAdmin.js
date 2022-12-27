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
nivolaApp.controller('ListRichiesteBOAdminController',
    ["$scope", "$state", "$stateParams", "$filter", "$mdDialog", "$rootScope",
        "entitiesRest", "controllerValidator", "notificationManager", 'loggers', 'ReadthedocService',
        'AuthenticationService', 'AuthLevel', '$translate', '$q', '$timeout',
        function ($scope, $state, $stateParams, $filter, $mdDialog, $rootScope,
            entitiesRest, controllerValidator, notificationManager, loggers, ReadthedocService ,
            AuthenticationService, AuthLevel, $translate, $q, $timeout) {
            "use strict";

            var logger = loggers.get("ListRichiesteController");
           // var Messaggi = entitiesRest.getEntity('Messaggi');
            var Remedy = entitiesRest.getEntity('Remedy');
            var StatiRemedy = entitiesRest.getEntity('StatiRemedy');
            var Users = entitiesRest.getEntity('Users');

            $scope.rtdListTicketsBO=ReadthedocService.getUrlFromPath('/remedy/backoffice/tickets/elenco').docUrl;
            
            var richiesteInviate = null ; 

            $scope.richieste = [];
            $scope.selected = [];

            $scope.options = {
				rowSelection: true,
				multiSelect: false,
				autoSelect: false,
				decapitate: false,
				largeEditDialog: false,
				boundaryLinks: false,
				limitSelect: true,
				pageSelect: true,
                elencoVuoto : false
			};

            $scope.filtro = {
                flagAccName : null, 
				accountName: null,
				tipo_segnalazione: null,
				inviata_da: null,
				impatto: null,
				urgenza: null,
                stato : null
			};

            $scope.limitOptions = [10, 15, 20];

            $scope.filter = {
                options: {
                    debounce: 500
                }
            };

            $scope.query = {
                order:  [ "urgenza", "dataInvio"],
                limit: 10,
                page: 1
            };


            $scope.urgenze = ($translate.instant('assistenza.oggetti_impatto.vasto') + ' '+
                            $translate.instant('assistenza.oggetti_impatto.significativo') + ' '+
                            $translate.instant('assistenza.oggetti_impatto.moderato') + ' '+
                            $translate.instant('assistenza.oggetti_impatto.minimo'))
                            .split(' ').map(function (urgenza) { return { abbrev: urgenza }; });
  

            $scope.filterOptions = ($translate.instant('assistenza.elenco.accountName') + '-'+
                            $translate.instant('assistenza.elenco.tipo_segnalazione') + '-'+
                            $translate.instant('assistenza.elenco.oggetto') + '-'+
                            $translate.instant('assistenza.elenco.impatto') + '-'+
                            $translate.instant('assistenza.elenco.urgenza') + '-'+
                            $translate.instant('assistenza.elenco.inviata_da'))
                            .split('-').map(function (option) { return { abbrev: option }; });
  
           

            $scope.actions = {
				auth: {
					

					delete: [
						AuthLevel.SUPERADMIN,
						AuthLevel.BOADMIN,
						/*AuthLevel.BOMONITORING,*/
						AuthLevel.OrgAdminRole,
						AuthLevel.DivAdminRole,
						AuthLevel.AccountAdminRole
					].join(",")
				},

			
			
				view: function () {
                    var item = $scope.selected[0]; 

                    if(item.tipoSegnalazione=="AnomaliaServiziCloud"){
                        $state.go('app.dettaglioRichiesta',{
                            richiesta: $scope.selected[0],
                        });
                    }

                   
                    
                    if(item.tipoSegnalazione!="AnomaliaServiziCloud" /* && item.tipoSegnalazione!="AnomaliaConnessioneDiRete" */)
                    {
                        notificationManager.showErrorPopup("use case  "+ item.tipoSegnalazione+ " ToDo(Da implementare)");
                    }
					
				},

                refresh : function(){
                    getRemedy($stateParams.areRequestSent);
                },

                sceltaAccount: function (ev) {
					
                    if($scope.filtro.flagAccName==false){
                        $scope.filtro.accountName=null ; 
                    }else {

                 

					$mdDialog.show({
						
						controller: 'DialogFiltroAccountController',
						templateUrl: 'angular/entities/assistenza/tpl-dialog-filtro-account.html',
						parent: angular.element(document.body),
						targetEvent: ev,
                        closeByEscape: true,
                        
						clickOutsideToClose: true,
						fullscreen: true,	// Only for -xs, -sm breakpoints.
                        width: 600
					})
                 
                    .then(function (data) {
                       data ? $scope.filtro.accountName = data.result.name   : $scope.filtro.flagAccName=false; 
                       $scope.accountScelto =  data.result; 
                           
                      }, function () {
                        //$scope.status = 'You didn\'t name your dog.';
                      });

                    }
                      
				},


                
				
               

				
			}





          
                $scope.selectedItem  = null;
                $scope.searchText    = null;
                $scope.querySearch   = querySearch;
            
                // ******************************
                // Internal methods
                // ******************************
            
                /**
                 * Search for states... use $timeout to simulate
                 * remote dataservice call.
                 */
                function querySearch (query) {
                  $scope.getUtenti();
                //   var results = query ? $scope.utenti.filter(createFilterFor(query)) :  $scope.utenti /*  $scope.states */;
                //   var deferred = $q.defer();
                //   $timeout(function () { deferred.resolve(results); }, Math.random() * 1000, false);
                //   return deferred.promise;
                return  $scope.utenti ; 
                }
            
              


                function createFilterFor(query) {
                    var lowercaseQuery = query.toLowerCase();
              
                    return function filterFn(state) {
                      return (state.value.indexOf(lowercaseQuery) === 0);
                    };
              
                  }



            

            function decodeSeverity(sev){
               var severity = null;
               if(sev=="Critica"){
                severity=$translate.instant('assistenza.oggetti_urgenza.critica') ;
               }else
               if(sev=="Alta"){
                severity=$translate.instant('assistenza.oggetti_urgenza.alta') ;
               }else
               if(sev=="Media"){
                severity=$translate.instant('assistenza.oggetti_urgenza.media') ;
               }else
               if(sev=="Bassa"){
                severity=$translate.instant('assistenza.oggetti_urgenza.bassa') ;
               }else{
                severity = "N-D";
               }

                return severity; 

            }

            

          
                
            


            $scope.resetFilter = function () {
                $scope.filter.search = '';
                $scope.query.filter = '';

                if ($scope.filter.form.$dirty) {
                    $scope.filter.form.$setPristine();
                }
            };

            $scope.isFilterDirty = function () {

                if ($scope.filtro.accountName !=null || 
                    $scope.selectedItem !=null ||
                    $scope.filtro.stato !=null ) {
                     
                        return true; 
                }

                return false 
            };

            $scope.clearFilter = function () {
                //$scope.filtro = null
                $scope.selectedItem = null ; 
                $scope.filtro.stato = null ; 
                $scope.filtro.flagAccName = false; 
                $scope.filtro.accountName =null;
                $scope.filtro.tipo_segnalazione =null;
                $scope.filtro.inviata_da =null ;
                $scope.filtro.impatto =null ;
                $scope.filtro.urgenza =null;
                
                getRemedy($stateParams.areRequestSent);
               
            };

            $scope.unselectAll = function () {
                $scope.selected = [];
            };

            $scope.openCloseCardFiltri = function () {
                $scope.filtriAperto = !$scope.filtriAperto; 
                if(!$scope.filtriAperto &&  $scope.isFilterDirty()){
                    $scope.clearFilter(); 
                }
                
            };
            
            $scope.getStatiRemedy = function () {
				$scope.promise = StatiRemedy.query().$promise;	

				return $scope.promise.then(function (data) {
					$scope.statiRichieste = data;
					//$scope.numeroAttivi = $filter('filter')(data, { attivo: true }).length;
					//$scope.numeroDisattivi = $filter('filter')(data, { attivo: false }).length;
				}, function (onfail) {
					notificationManager.showErrorPopup("si è vrificato un errore durante il caricamento degli stati ");
				});
			};



            $scope.submitFilter = function(){
                if( !$scope.isFilterDirty()){
                    notificationManager.showErrorPopup($translate.instant('Impostare almeno un filtro'));
                    return ; 
                }
                //console.log(JSON.stringify($scope.selectedItem)); 
                //console.log($scope.filtro.accountName); 
                //console.log($scope.filtro.stato);
                //console.log(JSON.stringify($scope.accountScelto.uuid));  
                

                var queryString = {};
                queryString.userId=$scope.selectedItem ? $scope.selectedItem.id : null ;  // utente selezionato
                queryString.stato=$scope.filtro.stato ? $scope.filtro.stato : null ;
                queryString.accountId = $scope.accountScelto ? $scope.accountScelto.uuid : null; 



                $scope.promise = Remedy.query(queryString).$promise;

                return $scope.promise.then(function (data) {
                    logger.info("SUCCESS", data);
                    

                    var filtered= data.filter(function(item){
                        return ( item.inviato == true /*|| item.inviato == false*/ );         
                    })

                    filtered.forEach(function (value) {
                        value.dataUltimaModifica = value.dataUltimaModifica?  value.dataUltimaModifica : "N-D";
                        value.utenteUltimaModifica = value.utenteUltimaModifica?  value.utenteUltimaModifica : "N-D";
                        value.dataInvio = value.dataInvio?  value.dataInvio : "N-D";
                        value.utenteInvio = value.utenteInvio?  value.utenteInvio : "N-D";
                        value.impatto = value.impatto?  value.impatto : "N-D";
                        value.stato = value.stato?  value.stato : "N-D";
                        

                    
                        
                        value.urgenza = decodeSeverity(value.urgenza);
                        value.badge=  value.inviato == true ? "badge badge-success" : "badge badge-warning";
						value.inviato = value.inviato == true ? $translate.instant('YES') : $translate.instant('NO');
                        
					});

                    

                    $scope.richieste = filtered;
                    richiesteInviate= filtered; 
                    if($scope.richieste.length==0){
                        $scope.options.elencoVuoto = true 
                    }

                       
                }, function (onfail) {
                    logger.error("ERROR", onfail);
                    if (onfail) {
                        if (onfail.data &&  onfail.data.message) {
                            notificationManager.showErrorPopup($translate.instant('error.loading_remedy') + ': ' + onfail.data.message);
                        } else {
                            notificationManager.showErrorPopup($translate.instant('error.loading_remedy')+ ': ' + onfail.message);
                        }
                    } else {
                        notificationManager.showErrorPopup($translate.instant('error.loading_remedy'));
                    }
                });
                
            }




            $scope.getUtenti = function () {
                // if($scope.searchText .length<3){

                // }else{
                    var queryString = {};
               
                    queryString.startBy= $scope.searchText ;
    
    
                    $scope.promise = Users.query(queryString).$promise;	
    
                    return $scope.promise.then(function (data) {
                        $scope.utenti = data;
                        $scope.utenti.forEach(function (item) {
                            item.display = item.cognome+ " " + item.nome; 
                        }); 
                        //$scope.numeroAttivi = $filter('filter')(data, { attivo: true }).length;
                        //$scope.numeroDisattivi = $filter('filter')(data, { attivo: false }).length;
                    }, function (onfail) {
                        notificationManager.showErrorPopup("si è vrificato un errore durante il caricamento degli utenti ");
                    });
                //}
                
			};

            function getRemedy(filter) {
                // EK operazione lunga in corso 
                $rootScope.loadingElement =  true ; 
                
                $scope.promise = Remedy.query().$promise;
                
               
                return $scope.promise.then(function (data) {
                    // EK operazione terminata 
                    
                    logger.info("SUCCESS", data);
                    

                    var filtered= data.filter(function(item){
                        return ( item.inviato == true /*|| item.inviato == false*/ );         
                    })

                    filtered.forEach(function (value) {
                        value.dataUltimaModifica = value.dataUltimaModifica?  value.dataUltimaModifica : "N-D";
                        value.utenteUltimaModifica = value.utenteUltimaModifica?  value.utenteUltimaModifica : "N-D";
                        value.dataInvio = value.dataInvio?  value.dataInvio : "N-D";
                        value.utenteInvio = value.utenteInvio?  value.utenteInvio : "N-D";
                        value.impatto = value.impatto?  value.impatto : "N-D";
                        value.stato = value.stato?  value.stato : "N-D";
                        value.urgenza = decodeSeverity(value.urgenza); 
                        value.badge=  value.inviato == true ? "badge badge-success" : "badge badge-warning";
						value.inviato = value.inviato == true ? $translate.instant('YES') : $translate.instant('NO');
                        if(!value.assegnatario){value.assegnatario="N-D"}
					});

                    

                    $scope.richieste = filtered;
                    richiesteInviate= filtered; 
                    if($scope.richieste.length==0){
                        $scope.options.elencoVuoto = true 
                    }

                       
                }, function (onfail) {
                    logger.error("ERROR", onfail);
                    if (onfail) {
                        if (onfail.data &&  onfail.data.message) {
                            notificationManager.showErrorPopup($translate.instant('error.loading_remedy') + ': ' + onfail.data.message);
                        } else {
                            notificationManager.showErrorPopup($translate.instant('error.loading_remedy')+ ': ' + onfail.message);
                        }
                    } else {
                        notificationManager.showErrorPopup($translate.instant('error.loading_remedy'));
                    }
                }).finally(function() {
                    $rootScope.loadingElement = false;
                });;
            };


                
            this.onInit = function () {
                // Recupera i richieste
                //console.log("EK", $stateParams.areRequestSent);
                $scope.areRequestSent = $stateParams.areRequestSent; 
                $scope.filtriAperto = false; 
                getRemedy($stateParams.areRequestSent);
              
            };

            this.onExit = function () { };

            controllerValidator.validate(this, $scope);
        }
    ]); 
   

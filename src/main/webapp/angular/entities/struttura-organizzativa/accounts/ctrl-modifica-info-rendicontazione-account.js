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
nivolaApp.controller('ModificaInfoRendicontazioneAccountController', [
    '$rootScope', '$scope', '$state', '$anchorScroll', '$location',
    '$stateParams', 'controllerValidator',
    'notificationManager',
    '$timeout',
    "utils", "$filter", 'entitiesRest', "AuthenticationService", "AuthLevel", '$translate',
    function (
        $rootScope, $scope, $state, $anchorScroll, $location,
        $stateParams, controllerValidator,
        notificationManager,
        $timeout,
        utils, $filter, entitiesRest, AuthenticationService, AuthLevel, $translate
    ) {
        'use strict';

        var InfoRendicontazioneCodifiche = entitiesRest.getEntity('InfoRendicontazioneCodifiche');
        var InfoRendicontazione = entitiesRest.getEntity('InfoRendicontazione');
        
        $scope.formEditInfoRendicontazione = {};
        $scope.metriche = [];
        $scope.nomeAccount = '';
        $scope.idAccount = '';
        //nuovo InfoRendicontazione

        $scope.nInfoRendicontazione = {
            metrica: null,//{descrizione:'',metrica:''},
            dataInizio: null,
            dataFine: null,
            valore: '',
            livelloTenant: null,
            dataInizioMax: null,
            dataFineMin: null,
            dataModifica: null,
            idAccount:null
        };

        $scope.selected = [];

       $scope.limitOptions = [ 10, 20, 30];

        $scope.filter = {
            options: {
                debounce: 500
            }
        };

        $scope.query = {
            limit: 10,
            page: 1
        };

        $scope.options = {
            isDataLoaded: false,
            //aggiunti
            rowSelection: false,
            multiSelect: false,
            autoSelect: false,
            decapitate: false,
            limitSelect: true,
            pageSelect: true,
        };

        $scope.actions = {
            refresh: function (event) {
                resetForm();
            },
            salva: function (event) {
                let jsonData = {
                    idValore:$scope.nInfoRendicontazione.idValore,
                    nomeMetricaDefinizione: $scope.nInfoRendicontazione.metrica.metrica,
                    idAccount: $scope.nInfoRendicontazione.idAccount,
                    dataDa: $scope.nInfoRendicontazione.dataInizio,
                    dataA: $scope.nInfoRendicontazione.dataFine,
                    quantita: $scope.nInfoRendicontazione.valore |  $scope.nInfoRendicontazione.livelloTenant,

                };

                var procedere=true ; 
                //controllo se c'è gia una inforendicontazione con lo stesso nome nello stesso perioro 

                if($scope.infoRendicontazioniAccount.length > 0){
                    var filteredList = $scope.infoRendicontazioniAccount.filter(element => {
                        return ( element.nomeMetricaDefinizione==jsonData.nomeMetricaDefinizione && element.idValore!=jsonData.idValore );
                     
                    })
                    
                    filteredList.forEach(element => {
                            if(!element.dataA){
                                 procedere=false;
                            }else if(new Date(element.dataA).getTime()>= new Date(jsonData.dataDa).getTime()){
                                    procedere=false;
                            }
                    
                    })
                }
               
               

                if(procedere){
                    InfoRendicontazione.update(jsonData, function (data) {
                        notificationManager.showSuccessPopup($translate.instant('accounts.info_rendicontazione.modifica.success'));
                        resetForm();
                        window.history.back();
                       // getInfoRendicontazioniAccount();
                    }, function (err) {
                        if(err && err.data && err.data.message)
                            notificationManager.showErrorPopup($translate.instant('accounts.info_rendicontazione.modifica.error') + '<br>' + err.data.message);
                        else notificationManager.showErrorPopup($translate.instant('accounts.info_rendicontazione.modifica.error'));
    
                        }).$promise.finally(function () {
                    });
                }else{
                    notificationManager.showErrorPopup($translate.instant('accounts.info_rendicontazione.nuova.error_procedere'));
                    return 
                }
				


            },
            isSalvaAbilitata: function () {
                if ($scope.nInfoRendicontazione.metrica && !$scope.nInfoRendicontazione.metrica.metrica.includes('tenant') ) {
                    return $scope.nInfoRendicontazione.metrica && $scope.nInfoRendicontazione.metrica != null && $scope.nInfoRendicontazione.dataInizio && $scope.nInfoRendicontazione.valore;
                } else if ($scope.nInfoRendicontazione.metrica && $scope.nInfoRendicontazione.metrica.metrica.includes('tenant')) {
                    return $scope.nInfoRendicontazione.metrica && $scope.nInfoRendicontazione.metrica != null && $scope.nInfoRendicontazione.dataInizio  && $scope.nInfoRendicontazione.livelloTenant;

                }
            },

        };

        $scope.soloDataMaggioreDataInizio = function (dataFine) {
            if ($scope.nInfoRendicontazione.dataInizio) {
                return dataFine > $scope.nInfoRendicontazione.dataInizio;
            }
            return true;
        };

        $scope.onChangeDataInizio = function () {

        };

        $scope.onChangeDataFine = function () {

        };

        function resetForm(form) {
            //resetto i form
            $scope.formEditInfoRendicontazione.$setPristine(true);
            $scope.formEditInfoRendicontazione.$setUntouched(true);
            angular.forEach($scope.formEditInfoRendicontazione, function (ctrl, name) {
                if (name.indexOf('$') != 0) {
                    angular.forEach(ctrl.$error, function (value, name) {
                        ctrl.$setValidity(name, null);
                    });
                }
            });

        }
        function getCodificheInfoRendicontazioniAccount() {
            var queryString = {};
            $scope.promise = InfoRendicontazioneCodifiche.query(queryString).$promise;

            return $scope.promise.then(function (data) {
                //metriche
                if(data){
                   
                    Object.assign($scope.metriche,data);
                }

            }, function (err) {
                    if(err && err.data && err.data.messaggio)
					    notificationManager.showErrorPopup($translate.instant('error.loading_voci_di_costo') + '<br>'+err.data.messaggio);
                    else notificationManager.showErrorPopup($translate.instant('error.loading_voci_di_costo'));
            });
        };

        function getInfoCorrenti() {
            var queryString = {
                idAccount:  $stateParams.infoRendicontazione.accountUuid
            };
            // $scope.promise = Account.query(queryString).$promise;
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

  
        function getInfoRendicontazioniAccount() {
           
            var myInfo= $stateParams.infoRendicontazione;

            
            var queryString = {
                idAccount: $stateParams.infoRendicontazione.accountUuid,
                idMetrica:$stateParams.infoRendicontazione.nomeMetricaDefinizione,
            };
            $scope.promise = InfoRendicontazione.get(queryString).$promise;

            return $scope.promise.then(function (data) {
                //metriche
                if(data){
                    $scope.nInfoRendicontazione = {
                        metrica:null,
                        dataInizio:    new Date(Date.parse(myInfo.dataDa)),
                        dataFine:   myInfo.dataA !=null ? new Date(Date.parse(myInfo.dataA)) : null,
                        valore: parseInt(myInfo.quantita),
                        livelloTenant: null,
                        dataInizioMax: null,
                        dataModifica: myInfo.dataModifica !=null ? new Date(Date.parse(myInfo.dataA)) : null,
                        dataFineMin: null,
                        idAccount:myInfo.accountUuid,
                        idValore:myInfo.idValore,
                        elencoStorici:[]
                    };
                    $scope.nInfoRendicontazione.metrica=impostaMetrica(data.nomeMetricaDefinizione);
                    if(data.nomeMetricaDefinizione.includes('tenant')){
                        $scope.nInfoRendicontazione.livelloTenant = impostaLivelloTenant(parseInt(data.quantita))
                    }
                    if(data.elencoStorici !=null && data.elencoStorici.length>0){
                        $scope.nInfoRendicontazione.elencoStorici = data.elencoStorici;
                    }
                }


            }, function (err) {
                    if(err && err.data && err.data.messaggio)
					    notificationManager.showErrorPopup($translate.instant('error.loading_voci_di_costo') + '<br>' + err.data.messaggio);
                    else notificationManager.showErrorPopup($translate.instant('error.loading_voci_di_costo'));
            });
        };

        function impostaMetrica(codMetrica){
            if($scope.metriche.length > 0)
                return $scope.metriche.filter(metrica => {
                    return  metrica.metrica === codMetrica ;
            })[0];
            return null;
        }

        
        
        function impostaLivelloTenant(lTenant){
            if($scope.nInfoRendicontazione.metrica  && $scope.nInfoRendicontazione.metrica.elencoValoriAmmessi !=null && $scope.nInfoRendicontazione.metrica.elencoValoriAmmessi.length > 0)
                return $scope.nInfoRendicontazione.metrica.elencoValoriAmmessi.filter(livello => {
                    return  livello.codice == lTenant ;
            })[0].codice;
            return null;
        }
        $scope.isInfoTenant = function () {
            return $scope.nInfoRendicontazione.metrica.metrica.includes('tenant');
        };
        this.onInit = function () {
            $scope.accountName =$stateParams.accountName;
            getCodificheInfoRendicontazioniAccount();
            getInfoCorrenti();
            getInfoRendicontazioniAccount();

        };

        this.onExit = function () { };

        controllerValidator.validate(this, $scope);
    }]);

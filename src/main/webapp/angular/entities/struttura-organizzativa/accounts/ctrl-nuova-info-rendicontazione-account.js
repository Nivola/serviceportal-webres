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
nivolaApp.controller('NuovaInfoRendicontazioneAccountController', [
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

        var Account = entitiesRest.getEntity('Account');
        
        $scope.formNewInfoRendicontazione = {};
        $scope.metriche = [];
        $scope.nomeAccount = '';
        //nuovo InfoRendicontazione

        $scope.nInfoRendicontazione = {
            //nuova
            metrica: null,//{descrizione:'',metrica:''},
            dataInizio: null,
            dataFine: null,
            valore: '',
            livelloTenant: null,
            dataInizioMax: null,
            dataFineMin: null,
            idAccount:null
        };

        $scope.options = {
            isDataLoaded: false,
        };

        $scope.actions = {
            refresh: function (event) {
                resetForm();
            },
            salva: function (event) {

                let jsonData = {
                    idAccount: $scope.nInfoRendicontazione.idAccount,
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
                    InfoRendicontazione.save(jsonData, function (data) {
                        notificationManager.showSuccessPopup($translate.instant('accounts.info_rendicontazione.nuova.success'));
                        resetForm();
                        history.back();
                    }, function (err) {
                        if(err && err.data && err.data.messaggio)
                            notificationManager.showErrorPopup($translate.instant('accounts.info_rendicontazione.nuova.error') + '<br>' + err.data.messaggio);
                        else notificationManager.showErrorPopup($translate.instant('accounts.info_rendicontazione.nuova.error'));
    
                        }).$promise.finally(function () {
                        $scope.status.pending = false;
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
            $scope.formNewInfoRendicontazione.$setPristine(true);
            $scope.formNewInfoRendicontazione.$setUntouched(true);
            angular.forEach($scope.formNewInfoRendicontazione, function (ctrl, name) {
                if (name.indexOf('$') != 0) {
                    angular.forEach(ctrl.$error, function (value, name) {
                        ctrl.$setValidity(name, null);
                    });
                }
            });

        }
        function getInfoRendicontazioniAccount() {
            var queryString = {};
            $scope.promise = InfoRendicontazioneCodifiche.query(queryString).$promise;

            return $scope.promise.then(function (data) {

                // controllo sulle unita di ogni metrica 
                data.forEach(
                    element => { 
                        if(element.unita==="#" && element.metrica.includes("cpu")) element.unita = "Numero CPU" ;  
                        if(element.unita==="#" && !element.metrica.includes("cpu")) element.unita = "Quantità" ; 
                        //lisTags.push(element.key);
                        }
                );
                //metriche
                if(data){
                    Object.assign($scope.metriche,data);
                }

            }, function (onfail) {
                logger.error("ERROR", onfail);
                if (onfail.body) {
                    if (onfail.body.data && onfail.body.data.message) {
                        notificationManager.showErrorPopup($translate.instant('error.loading_accounts') + ': ' + onfail.body.data.message);
                    } else {
                        notificationManager.showErrorPopup($translate.instant('error.loading_accounts'));
                    }
                } else {
                    notificationManager.showErrorPopup($translate.instant('error.loading_accounts'));
                }
            });
        };


        function getInfoCorrenti() {
            var queryString = {
                idAccount: $stateParams.idAccount
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



        this.onInit = function () {
            $scope.accountName =$stateParams.accountName;
            $scope.nInfoRendicontazione.idAccount=$stateParams.idAccount;
            getInfoRendicontazioniAccount();
            getInfoCorrenti();
        };

        this.onExit = function () { };

        controllerValidator.validate(this, $scope);
    }]);

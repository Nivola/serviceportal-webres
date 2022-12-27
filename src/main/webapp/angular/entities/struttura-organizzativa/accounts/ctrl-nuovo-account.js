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
"use strict";

nivolaApp.controller('NuovoAccountController', [
    '$rootScope', '$scope', '$state', '$anchorScroll', '$location', 'ReadthedocService', 
    '$stateParams', 'controllerValidator',
    'notificationManager',
    '$timeout',
    "utils", "$filter", 'entitiesRest', "AuthenticationService", "AuthLevel",'$mdDialog', '$translate','$q',
    function (
        $rootScope, $scope, $state, $anchorScroll, $location, ReadthedocService, 
        $stateParams, controllerValidator,
        notificationManager,
        $timeout,
        utils, $filter, entitiesRest, AuthenticationService, AuthLevel, $mdDialog, $translate,$q
    ) {
        'use strict';

        var defer = $q.defer();
        $scope.rtdAccountNew=ReadthedocService.getUrlFromPath('/account/new').docUrl;
        var Account = entitiesRest.getEntity('Account');
        var Divisione = entitiesRest.getEntity('Divisione');
        var Organizzazione = entitiesRest.getEntity('Organizzazione');
        var Prezzario = entitiesRest.getEntity('Prezzario');
        var Listino = entitiesRest.getEntity('listaListini');
        var Infocosto = entitiesRest.getEntity('Infocosto');
        var Tipi = entitiesRest.getEntity('Tipi');

        $scope.formNuovoAccount = {};
        $scope.organizzazioniDivisioni = [];
        $scope.elencoDivisioni = [];
        $scope.elencoOrganizzazioni = [];
        $scope.divisioni = [];
        $scope.organizzazioni = [];
        $scope.prezzari = [];
        $scope.listini = [];
        $scope.tipiListino = [];
        

        $scope.acronimi = [];
        $scope.categorieAcc = [
            { nome: $translate.instant('organizzazioni.categoria.public'), value:'public' },
            { nome: $translate.instant('organizzazioni.categoria.csi'), value:'csi' },
            { nome: $translate.instant('organizzazioni.categoria.privata'), value:'private' }
        ];

        $scope.options = {
            isDataLoaded: false,
            isOrganizzazioneDivisioneSoloLettura: $stateParams.idDivisione && $stateParams.idDivisione !== '' ? true : false,
            isFirstLoading: true,
            showSteps: false
        };

        $scope.iconStyle = {
            // "color": "#4285f4"
        };

        $scope.newAccountSaved=false;

        $scope.actions = {
            invia: function () {
                        $scope.nuovoAccount.divisioneNome =  $scope.nuovoAccount.divisione.name;
                        $scope.nuovoAccount.organizzazioneNome = $scope.nuovoAccount.organizzazione.name;
                        $scope.nuovoAccount.dataInizioConsumi=null;
                        $scope.showModal=false;
                        setTimeout(() => {
                                if($scope.promise.$$state.status===0){
                                    $rootScope.loadingElement = true;
                                }
                            }, 1000);
                        $scope.promise = Account.save($scope.nuovoAccount).$promise;

                        return $scope.promise.then(function (data) {

                            if (!data && !data.data && data.status != 200) {
                                $scope.options.isDataLoaded = false;
                                notificationManager.showErrorPopup($translate.instant('accounts.nuovo.error'));
                                return;
                            }
                            $scope.newAccountSaved=true;
                            getAccounts(false);
                            notificationManager.showSuccessPopup($translate.instant('accounts.nuovo.success'));
                        }, function (onfail) {
                            $scope.newAccountSaved=false;

                            if (onfail.data) {
                                notificationManager.showErrorPopup($translate.instant('accounts.nuovo.fail') + ': ' + onfail.data.message);
                            } else {
                                notificationManager.showErrorPopup($translate.instant('accounts.nuovo.fail'));
                            }
                        }).finally(function() {
                            $rootScope.loadingElement = false;
                            $scope.showModal=$scope.newAccountSaved;

                        });
            }
        };

        $scope.onAggiornaCostiGiornoChanged = function () {
            if($scope.nuovoAccount.aggiornaCostiGiorno===false){
                $scope.nuovoAccount.dataInizioConsumi= null ;
            }
            
        };





        $scope.onDivisioneChange = function () {
            if (!$scope.options.isFirstLoading) {
                let organizzazione = $scope.nuovoAccount.organizzazione;
                let divisione = $scope.nuovoAccount.divisione;
                $scope.nuovoAccount.divisione = {};
                $scope.nuovoAccount.organizzazione = organizzazione;
                $scope.nuovoAccount.divisione = divisione;
                $scope.nuovoAccount.organization_id = organizzazione.uuid;
                $scope.nuovoAccount.division_id = divisione.uuid;
            }
            $scope.options.isFirstLoading = false;
            if ($scope.nuovoAccount.organizzazione && $scope.nuovoAccount.organizzazione.org_type) {
                $scope.nuovoAccount.categoriaAcc = $scope.categorieAcc
                    .filter(function (el) {
                        return el.value === $scope.nuovoAccount.organizzazione.org_type.toLowerCase();
                    })[0];
            }
            if ($scope.nuovoAccount.categoriaAcc && $scope.nuovoAccount.categoriaAcc !== null && $scope.nuovoAccount.categoriaAcc.value !== ''
                && $scope.nuovoAccount.division_id && $scope.nuovoAccount.division_id !== null && $scope.nuovoAccount.division_id !== ''
                && $scope.nuovoAccount.organization_id && $scope.nuovoAccount.organization_id !== null && $scope.nuovoAccount.organization_id !== '') {
                $scope.options.showSteps = true;
            }

        };

        $scope.onOrganizzazioneChange = function () {
            $scope.options.showSteps = false;
            //non saprei se caricare lista divisione per organizzazione
            if (!$scope.options.isFirstLoading) {
                let org_id = $scope.nuovoAccount.organization_id;
                let organizzazione = $scope.nuovoAccount.organizzazione;
                $scope.nuovoAccount.divisione = {};
                $scope.nuovoAccount.organization_id = org_id;
                $scope.nuovoAccount.organizzazione = organizzazione;
            }
            $scope.options.isFirstLoading = false;
            if ($scope.nuovoAccount.organizzazione && $scope.nuovoAccount.organizzazione.org_type) {
                $scope.nuovoAccount.categoriaAcc = $scope.categorieAcc
                    .filter(function (el) {
                        return el.value === $scope.nuovoAccount.organizzazione.org_type.toLowerCase();
                    })[0];

                $scope.divisioni = $scope.elencoDivisioni
                    .filter(function (el) {
                        return el.organizzazione.uuid === $scope.nuovoAccount.organizzazione.uuid;
                    });


            }
            if ($scope.nuovoAccount.categoriaAcc && $scope.nuovoAccount.categoriaAcc !== null && $scope.nuovoAccount.categoriaAcc.value !== ''
                && $scope.nuovoAccount.division_id && $scope.nuovoAccount.division_id !== null && $scope.nuovoAccount.division_id !== ''
                && $scope.nuovoAccount.organization_id && $scope.nuovoAccount.organization_id !== null && $scope.nuovoAccount.organization_id !== '') {
                $scope.options.showSteps = true;
            }
        };

        function getAccounts(init) {
            setTimeout(() => {
                if($scope.promise.$$state.status===0){
                    $rootScope.loadingElement = true;
                }
            }, 1000);
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
                if(!init){

                    $scope.nuovoAccount= data.sort((a,b)=>new Date(Date.parse(a.creation)).getTime()-new Date(Date.parse(b.creation)).getTime()).reverse()[0];
                }
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
                $rootScope.loadingElement = false;
                $scope.newAccountSaved=false;
            });
        };



        function getDivisioni() {
            var queryString = {};
            $scope.options.isDataLoaded = false;

            $scope.promise = Divisione.query(queryString).$promise;

            return $scope.promise.then(function (data) {
                $scope.elencoDivisioni = angular.copy(data);
                if ($stateParams.idDivisione && $stateParams.idDivisione !== '') {

                    $scope.nuovoAccount.organizzazioneDivisione = $scope.elencoDivisioni
                        .filter(function (el) {
                            return el.uuid === $stateParams.idDivisione;
                        })[0];
                    $scope.nuovoAccount.division_id = $scope.nuovoAccount.organizzazioneDivisione.uuid;
                    $scope.nuovoAccount.organization_id = $scope.nuovoAccount.organizzazioneDivisione.organizzazione.uuid;
                    $scope.nuovoAccount.categoriaAcc = $scope.categorieAcc
                        .filter(function (el) {
                            return el.value === $scope.nuovoAccount.organizzazioneDivisione.organizzazione.org_type.toLowerCase();
                        })[0];
                    $scope.nuovoAccount.organizzazione = $scope.nuovoAccount.organizzazioneDivisione.organizzazione;
                    $scope.nuovoAccount.divisione = $scope.nuovoAccount.organizzazioneDivisione;

                    $scope.options.showSteps = true;
                }

                if ($scope.nuovoAccount.organizzazione && $scope.nuovoAccount.organizzazione.uuid) {

                    $scope.divisioni = $scope.elencoDivisioni
                        .filter(function (el) {
                            return el.organizzazione.uuid === $scope.nuovoAccount.organizzazione.uuid;
                        });
                }
            }, function (onfail) {
                notificationManager.showErrorPopup($translate.instant('error.loading_divisioni'));
            }).finally(function () {
                $scope.options.isDataLoaded = true;
            });
        };



        function getOrganizzazioni() {
            var queryString = {};
            $scope.options.isDataLoaded = false;
            $scope.promise = Organizzazione.query(queryString).$promise;

            return $scope.promise.then(function (data) {
                $scope.organizzazioni = angular.copy(data);

            }, function (onfail) {
                notificationManager.showErrorPopup($translate.instant('error.loading_divisioni'));
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

        //Unused function?
        $scope.loadListiniDisponibili=function(data){
            if(data.firstLoad){
            $scope.nuovoAccount.codicePrezzo  = null;
            var queryString = {};
            $scope.options.isDataLoaded = false;
            $scope.promise =    Listino.query(queryString).$promise; 
           
           return $scope.promise.then(function (data) {
               $scope.listini=angular.copy(data);
               $scope.prezzari=[];
           }, function (onfail) {
               notificationManager.showErrorPopup($translate.instant('error.loading_listini'));
           }).finally(function () {
               $scope.options.isDataLoaded = true;
           });
        }else{
            $scope.nuovoAccount.listino=null;
            $scope.listini=[];
            getPrezzari();
            $scope.nuovoAccount.idListinoSpecifico=null;
            
        }
        }

        //Unused function?
        $scope.redirectToListAccounts=function(){
            $state.go("app.account")
        }

        //Unused function?
        $scope.redirectToUpdateBilling=function(){
            $state.go("app.account.change",{tabIndex:1,
						idDivisione: $scope.nuovoAccount.division_id,
						idAccount:$scope.nuovoAccount.uuid,})
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

       $scope.checkAcronimo = function () {
        if (!$scope.formNuovoAccount.$invalid && $scope.nuovoAccount.acronimo !== null && $scope.nuovoAccount.acronimo !== ''
            && $scope.acronimi.length > 0 && $scope.acronimi.findIndex(x => x.toLowerCase() == $scope.nuovoAccount.acronimo.toLowerCase()) !== -1) {
            var datiTesto = {
                acronimo: $scope.nuovoAccount.acronimo
            }
            notificationManager.showErrorPopup($translate.instant('accounts.nuovo.acronimo_usato', datiTesto));
            return;
        }
    };

        this.onInit = function () {
            $scope.tabIndex=0;
            getDivisioni();
            getOrganizzazioni();
            getAccounts(true);
            getPrezzari();
            getTipiListino();
        };

        this.onExit = function () { };

        controllerValidator.validate(this, $scope);
    }]);

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
nivolaApp.controller('NuovaDivisioneController', [
    '$scope', '$anchorScroll', '$location',
    '$stateParams', 'controllerValidator',
    'notificationManager','entitiesRest', '$http', 'conf', '$translate', 
    function (
        $scope, $anchorScroll, $location,
        $stateParams, controllerValidator,
        notificationManager, entitiesRest,  $http, conf, $translate
    ) {
        'use strict';


        var Divisione = entitiesRest.getEntity('Divisione');
        var Organizzazione = entitiesRest.getEntity('Organizzazione');

        $scope.formNuovaDivisione = {};

        $scope.organizzazioni = [];
        $scope.acronimi = [];
        $scope.categorieDiv = [
            { nome: $translate.instant('organizzazioni.categoria.public'), value:'public' },
            { nome: $translate.instant('organizzazioni.categoria.csi'), value:'csi' },
            { nome: $translate.instant('organizzazioni.categoria.privata'), value:'private' }
        ];

        var defaultForm = {
            //divisione/organizzazione
            organizzazione: {},
            categoriaDiv: {},
            organizzation_id: null,
            name: null,
            note: null,
            desc: null,
            postaladdress: null,
            email: null,
            contact: null,
        };

        $scope.options = {
            isDataLoaded: false,
            showSteps: false
        };

        $scope.iconStyle = {
            // "color": "#4285f4"
        };

        $scope.actions = {
            invia: function () {
                try {
                    if ($scope.formNuovaDivisione.$valid) {
                        $scope.nuovaDivisione.organization_id = $scope.nuovaDivisione.organizzazione.uuid;
                        Divisione.save($scope.nuovaDivisione, function (data) {
                            if (!data && !data.data && data.status != 200) {
                                $scope.options.isDataLoaded = true;
                                notificationManager.showErrorPopup($translate.instant('divisioni.nuova.error'));
                                return;
                            }

                            notificationManager.showSuccessPopup($translate.instant('divisioni.nuova.success'));
                            resetForm();
                            getOrganizzazioni();
                            //dopo salvataggio ritorno in testa
                            $location.hash('nuovaDivisione');
                            $anchorScroll('nuovaDivisione');
                        }, function (onfail) {
                            $scope.options.isDataLoaded = true;
                            if (onfail.data) {
                                notificationManager.showErrorPopup($translate.instant('divisioni.nuova.error') + ' ' + onfail.data);
                            } else {
                                notificationManager.showErrorPopup($translate.instant('divisioni.nuova.error'));
                            }
                        });

                        return;
                    }
                    //vuol dire il mio form non e' valido probabilmente mancano dei dati faccio scroll to
                    $location.hash($scope.formNuovaDivisione.$error.required[0]);
                    $anchorScroll($scope.formNuovaDivisione.$error.required[0]);
                } finally {
                    $scope.options.isDataLoaded = true;

                }
            }
        };

        $scope.cercaEnti = function (testo) {
            if (testo.length < 3) {
                return [];
            }
            return $http.get(conf.location.uaaApi + "/api/remedy/enti?ricerca="+testo).then(function(response) {
                return response.data;
              }, function () {
                return [];
              });
        };


        $scope.onOrganizzazioneChange = function () {
            if ($scope.nuovaDivisione.organizzazione && $scope.nuovaDivisione.organizzazione.org_type) {
                $scope.nuovaDivisione.categoriaDiv = $scope.categorieDiv
                    .filter(function (el) {
                        return el.value === $scope.nuovaDivisione.organizzazione.org_type.toLowerCase();
                    })[0];
                $scope.options.showSteps = true;
            }
        };


        function resetForm() {
            $scope.nuovaDivisione = angular.copy(defaultForm);

            if ($scope.formNuovaDivisione.$dirty) {
                $scope.formNuovaDivisione.$setPristine();
                $scope.formNuovaDivisione.$setUntouched();
            }
        }


        function getOrganizzazioni() {
            var queryString = {};
            $scope.options.isDataLoaded = false;
            $scope.promise = Organizzazione.query(queryString).$promise;

            return $scope.promise.then(function (data) {
                data.forEach(function (organizzazione) {
                    if (($stateParams.idOrganizzazione && $stateParams.idOrganizzazione !== '' && organizzazione.uuid === $stateParams.idOrganizzazione && organizzazione && $scope.organizzazioni.findIndex(x => x.uuid == organizzazione.uuid) === -1)
                        ||
                        ((!$stateParams.idOrganizzazione || $stateParams.idOrganizzazione === '') && organizzazione && $scope.organizzazioni.findIndex(x => x.uuid == organizzazione.uuid) === -1)
                    ) {
                        $scope.organizzazioni.push(organizzazione);
                    }
                }

                );
                if ($scope.organizzazioni.length === 1) {
                    $scope.nuovaDivisione.organizzazione = $scope.organizzazioni[0];
                    $scope.nuovaDivisione.categoriaDiv = $scope.categorieDiv
                        .filter(function (el) {
                            return el.value === $scope.nuovaDivisione.organizzazione.org_type.toLowerCase();
                        })[0];
                    $scope.options.showSteps = true;
                }
            }, function (onfail) {
                if (onfail.body) {
                    if (onfail.body.data && onfail.body.data.message) {
                        notificationManager.showErrorPopup($translate.instant('error.loading_divisioni') + ': ' + onfail.body.data.message);
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

        this.onInit = function () {
            resetForm();
            getOrganizzazioni();
        };

        this.onExit = function () { };

        controllerValidator.validate(this, $scope);
    }]);

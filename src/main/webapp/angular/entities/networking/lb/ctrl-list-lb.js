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
nivolaApp.controller('ListLbController',
    ["$scope", "$state", "$stateParams", "$filter", "$mdDialog",
        "entitiesRest", "controllerValidator", "notificationManager", 'loggers',
        'AuthenticationService', 'AuthLevel',
        function ($scope, $state, $stateParams, $filter, $mdDialog,
            entitiesRest, controllerValidator, notificationManager, loggers,
            AuthenticationService, AuthLevel) {
            "use strict";

            var logger = loggers.get("ListLbController");
            var Lb = entitiesRest.getEntity('Lb');

            $scope.servers = [];
            $scope.selected = [];

            // Proprietà data-table
            $scope.options = {
                rowSelection: true,
                multiSelect: false,
                autoSelect: true,
                decapitate: false,
                largeEditDialog: false,
                boundaryLinks: false,
                limitSelect: true,
                pageSelect: true
            };

           $scope.limitOptions = [ 10, 20, 30];

            $scope.filter = {
                options: {
                    debounce: 500
                }
            };

            $scope.query = {
                order: "name",
                limit: 10,
                page: 1
            };

            $scope.actions = {
                auth: {
                    new: $state.get("app.lb.new").requiredUC,
                    change: $state.get("app.lb.new").requiredUC,
                    delete: $state.get("app.lb.new").requiredUC
                },

                refresh: getLb,

                new: function () {
                    $state.go('app.formAssistenza', { object: "[" + $scope.accountName + "]" + " Richiesta di creazione LB" });
                },

                change: function () {

                },

                delete: function (event) {
                    $state.go('app.formAssistenza', { object: "[" + $scope.accountName + "]" + " Richiesta di rimozione LB" });
                }
            };

            $scope.resetFilter = function () {
                $scope.filter.search = '';
                $scope.query.filter = '';

                if ($scope.filter.form.$dirty) {
                    $scope.filter.form.$setPristine();
                }
            };

            $scope.unselectAll = function () {
                $scope.selected = [];
            };

            function getLb() {
                var queryString = {};
                if ($scope.accountUuid) {
                    queryString.accountUuid = $scope.accountUuid;
                }
                $scope.promise = Lb.query(queryString).$promise;

                return $scope.promise.then(function (data) {
                    logger.info("SUCCESS", data);
                    $scope.servers = data;
                }, function (onfail) {
                    logger.error("ERROR", onfail);
                    if (onfail.body) {
                        if (onfail.body && onfail.body.data && onfail.body.data.message) {
                            notificationManager.showErrorPopup('Si è verificato un errore durante il caricamento dei LB: ' + onfail.body.data.message);
                        } else {
                            notificationManager.showErrorPopup('Si è verificato un errore durante il caricamento dei LB!');
                        }
                    } else {
                        notificationManager.showErrorPopup('Si è verificato un errore durante il caricamento dei LB!');
                    }
                });
            };

            this.onInit = function () {
                var abilitazione = AuthenticationService.getUtente().abilitazioneSelezionata;
                logger.debug("Abilitazione corrente", abilitazione);

                // Recupero Uuid e Account Name dell'Account a cui l'agente appartiene
                // NOTE: filtro su accountUUID eseguito sul backend
                // $scope.accountUuid = abilitazione.accountUuid;
                $scope.accountName = abilitazione.accountName;

                // Recupera i LB
                getLb();
            };

            this.onExit = function () { };

            controllerValidator.validate(this, $scope);
        }
    ]);

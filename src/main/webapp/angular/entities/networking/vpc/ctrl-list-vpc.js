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
nivolaApp.controller('ListVpcController',
    ["$scope", "$state", "$stateParams", "$filter", "$mdDialog", "ReadthedocService",
        "entitiesRest", "controllerValidator", "notificationManager", 'loggers',
        'AuthenticationService', 'AuthLevel', '$translate', 
        function ($scope, $state, $stateParams, $filter, $mdDialog, ReadthedocService,
            entitiesRest, controllerValidator, notificationManager, loggers,
            AuthenticationService, AuthLevel, $translate) {
            "use strict";

            $scope.rtdVpcList=ReadthedocService.getUrlFromPath('/vpc/list').docUrl;
            var logger = loggers.get("ListVpcController");
            var Vpc = entitiesRest.getEntity('Vpc');

            $scope.vpcs = [];
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
                order: "nvlName",
                limit: 10,
                page: 1
            };

            $scope.actions = {
                auth: {
                    new: $state.get("app.vpc.new").requiredUC,
                    change: $state.get("app.vpc.new").requiredUC,
                    delete: $state.get("app.vpc.new").requiredUC
                },

                refresh: getVpcs,

                new: function () {
                    $state.go('app.formAssistenza', { object: "[" + $scope.accountName + "]" + " Risorse Elaborative" });
                },

                change: function () {

                },

                delete: function (event) {
                    $state.go('app.formAssistenza', { object: "[" + $scope.accountName + "]" + " Richiesta di rimozione VPC" });
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

            function getVpcs() {
                var queryString = {};
                if ($scope.accountUuid) {
                    queryString.accountUuid = $scope.accountUuid;
                }
                $scope.promise = Vpc.query(queryString).$promise;

                return $scope.promise.then(function (data) {
                    logger.info("SUCCESS", data);
                    $scope.vpcs = data;
                }, function (onfail) {
                    logger.error("ERROR", onfail);
                    if (onfail) {
                        if (onfail.data && onfail.data.message) {
                            notificationManager.showErrorPopup($translate.instant('error.loading_vpc')+ ': ' + onfail.data.message);
                        } else {
                            notificationManager.showErrorPopup($translate.instant('error.loading_vpc'));
                        }
                    } 
                });
            };

            this.onInit = function () {
                var abilitazione = AuthenticationService.getUtente().abilitazioneSelezionata;
                logger.debug("Abilitazione corrente", abilitazione);

                // Recupero Uuid e Account Name dell'Account a cui l'agente appartiene
                // NOTE: filtro su accountUUID eseguito sul backend
                $scope.accountUuid = abilitazione.accountUuid;
                $scope.accountName = abilitazione.accountName;

                // Recupera le VPC
                getVpcs();
            };

            this.onExit = function () { };

            controllerValidator.validate(this, $scope);
        }
    ]);

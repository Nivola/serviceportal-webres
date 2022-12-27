/*-
 * ========================LICENSE_START=================================
 * Nivola Service Portal Web Resources
 * %%
 * Copyright (C) 2022 CSI Piemonte
 * %%
 * SPDX-FileCopyrightText: Copyright 2022 | CSI Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
nivolaApp.controller('ListSnapshotsController',
    ["$scope", "$state", "$stateParams", "$filter", "$mdDialog",
        "entitiesRest", "controllerValidator", "notificationManager", 'loggers',
        'AuthenticationService', 'AuthLevel', 'ReadthedocService',
        function ($scope, $state, $stateParams, $filter, $mdDialog,
            entitiesRest, controllerValidator, notificationManager, loggers,
            AuthenticationService, AuthLevel, ReadthedocService) {
            "use strict";

            var logger = loggers.get("ListSnapshotsController");
            var Snapshot = entitiesRest.getEntity('snapshot');
            $scope.rtdkeypair = ReadthedocService.getUrlFromPath("/keypair").docUrl; 
            

            $scope.keypairs = [];
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
                pageSelect: true,
                elencoVuoto:false
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
                    new: $state.get("app.snapshots.new").requiredUC,
                    delete: $state.get("app.snapshots.delete").requiredUC,
                },

                refresh: getSnapshots(),

	
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

            function getSnapshots() {
                var queryString = {};
                if ($scope.accountUuid) {
                    queryString.accountId = $scope.accountUuid;
                }
                if($scope.instanceUuid){  // Uuid VM 
                    queryString.instanceId= $scope.instanceUuid;
                }
                $scope.promise = Snapshot.query(queryString).$promise;
/*                return $scope.promise.then(function (data) {
                    $scope.snapshots = data;
                    if(data.length === 0){
						$scope.options.elencoVuoto = true;
                    }else{
                        $scope.options.elencoVuoto = false;
                    }

                }, function (onfail) {
                    if (onfail.body) {
                        if (onfail.body.data && onfail.body.data.message) {
                            notificationManager.showErrorPopup('Si è verificato un errore durante il caricamento degli snapshots: ' + onfail.body.data.message);
                        } else {
                            notificationManager.showErrorPopup('Si è verificato un errore durante il caricamento degli snapshots!');
                        }
                    } else {
                        notificationManager.showErrorPopup('Si è verificato un errore durante il caricamento degli snapshots!');
                    }
                });

*/
                $scope.snapshots = [];

            };

            this.onInit = function () {
                var abilitazione = AuthenticationService.getUtente().abilitazioneSelezionata;
                $scope.accountUuid= abilitazione.accountUuid
                getSnapshots();
            };

            this.onExit = function () { };

            controllerValidator.validate(this, $scope);
        }
    ]);

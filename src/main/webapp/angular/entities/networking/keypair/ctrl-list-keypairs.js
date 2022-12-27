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
nivolaApp.controller('ListKeypairsController',
    ["$scope", "$state", "$stateParams", "$filter", "$mdDialog",
        "entitiesRest", "controllerValidator", "notificationManager", 'loggers',
        'AuthenticationService', 'AuthLevel', 'ReadthedocService', '$translate',
        function ($scope, $state, $stateParams, $filter, $mdDialog,
            entitiesRest, controllerValidator, notificationManager, loggers,
            AuthenticationService, AuthLevel, ReadthedocService, $translate) {
            "use strict";

            var logger = loggers.get("ListKeypairsController");
            var Keypair = entitiesRest.getEntity('Keypair');
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
                    new: $state.get("app.keypair.new").requiredUC,
                    delete: $state.get("app.keypair.delete").requiredUC,
                    import: $state.get("app.keypair.import").requiredUC,
                },

                refresh: getKeypairs,

				crea: function (event) {
					$mdDialog.show({
						locals: {
							Keypair: Keypair,
                            mdDialog: $mdDialog,
                            keypairs:$scope.keypairs
						},
						controller: 'DialogNuovaKeypairController',
						templateUrl: 'angular/entities/networking/keypair/tpl-dialog-nuova-keypair.html',
						parent: angular.element(document.body),
						targetEvent: event,
						clickOutsideToClose: true,
						fullscreen: true	// Only for -xs, -sm breakpoints.
					})
						.then(function () {
                            getKeypairs();
						}, function () {
							//ha cliccato annulla della dialog
						});
				},
				importa: function (event) {
					$mdDialog.show({
						locals: {
							Keypair: Keypair,
                            mdDialog: $mdDialog,
                            keypairs:$scope.keypairs
						},
						controller: 'DialogImportaKeypairController',
						templateUrl: 'angular/entities/networking/keypair/tpl-dialog-importa-keypair.html',
						parent: angular.element(document.body),
						targetEvent: event,
						clickOutsideToClose: true,
						fullscreen: true	// Only for -xs, -sm breakpoints.
					})
						.then(function () {
                            getKeypairs();
						}, function () {
							//ha cliccato annulla della dialog
						});
				},
                delete: function (event) {
                    var confirm = $mdDialog
                        .confirm()
                        .title($translate.instant('keypair.elimina.titolo'))
                        .textContent($translate.instant('keypair.elimina.info'))
                        .targetEvent(event)
                        .ok($translate.instant('si'))
                        .cancel($translate.instant('no'));
                    $mdDialog.show(confirm).then(function () {
                        $scope.selected.forEach(element => {
                            Keypair.delete({ nomeChiave: element.nome }, function (data) {
                                notificationManager.showSuccessPopup($translate.instant('keypair.elimina.success'));
                                // Reset lista
                                $scope.unselectAll();
                                $scope.resetFilter();
                                // Aggiorno lista VM
                                getKeypairs();
                                
                            }, function (onfail) {
                                if (onfail.data) {
                                	notificationManager.showErrorPopup($translate.instant('keypair.elimina.errore') + ": " + onfail.data.message);
                                } else {
                                    notificationManager.showErrorPopup($translate.instant('keypair.elimina.errore'));
                                }
                            });
                        });
                    });
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

            function getKeypairs() {
                var queryString = {};
                if ($scope.accountUuid) {
                    queryString.accountUuid = $scope.accountUuid;
                }
                $scope.promise = Keypair.query(queryString).$promise;
                return $scope.promise.then(function (data) {
                    $scope.keypairs = data;
                    if(data.length === 0){
						$scope.options.elencoVuoto = true;
                    }else{
                        $scope.options.elencoVuoto = false;
                    }

                }, function (onfail) {
                    if (onfail.data) {
                        notificationManager.showErrorPopup($translate.instant('keypair.elenco.errore') + ": " + onfail.data.message);
                    } else {
                        notificationManager.showErrorPopup($translate.instant('keypair.elenco.errore'));
                    }
                    
                });


            };

            this.onInit = function () {
                var abilitazione = AuthenticationService.getUtente().abilitazioneSelezionata;
                getKeypairs();
            };

            this.onExit = function () { };

            controllerValidator.validate(this, $scope);
        }
    ]);

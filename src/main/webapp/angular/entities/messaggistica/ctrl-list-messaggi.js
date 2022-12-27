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
nivolaApp.controller('ListMessaggiController',
    ["$scope", "$state", "$stateParams", "$filter", "$mdDialog",
        "entitiesRest", "controllerValidator", "notificationManager", 'loggers',
        'AuthenticationService', 'AuthLevel',
        function ($scope, $state, $stateParams, $filter, $mdDialog,
            entitiesRest, controllerValidator, notificationManager, loggers,
            AuthenticationService, AuthLevel) {
            "use strict";

            var logger = loggers.get("ListMessaggiController");
            var Messaggi = entitiesRest.getEntity('Messaggi');

            $scope.messaggi = [];
            $scope.selected = [];

            // Proprietà data-table
			$scope.options = {
				rowSelection: true,
				multiSelect: true,
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
                order: "dataPubblicazioneInizio",
                limit: 10,
                page: 1
            };


            $scope.hoverIn = function(){
                this.hoverExpand = true;
            };
        
            $scope.hoverOut = function(){
                this.hoverExpand = false;
            };

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

				//refresh: getUtenti,

			
				view: function () {
					$state.go('app.messaggistica.view',{
						idMessaggio: $scope.selected[0].id,
					});
				},
				
				

				delete: function (event) {
					var confirm = $mdDialog
						.confirm()
						.title("Confermi la cancellazione delle Notizie selezionate?")
						.textContent("le notizie verranno cancellate definitivamente.")
						.targetEvent(event)
						.ok("SI")
						.cancel("NO");
					$mdDialog.show(confirm).then(function () {
						$scope.selected.forEach(element => {
							Utente.delete({ id: element.id }, function (data) {
								console.log("success", data);
								notificationManager.showSuccessPopup('la Notizia  è stato eliminato correttamente');
								// Reset lista
								$scope.unselectAll();
								$scope.resetFilter();
								// Aggiorno lista utenti
								getUtenti();
							}, function (onfail) {
								console.error("deleteError", onfail);

								if (onfail.body) {
									if (onfail.body.data && onfail.body.data.message) {
										notificationManager.showErrorPopup('Si è verificato un errore durante l\'eliminazione dell\'utente: ' + onfail.body.data.message);
									} else {
										notificationManager.showErrorPopup('Si è verificato un errore durante l\'eliminazione dell\'utente!');
									}
								} else {
									notificationManager.showErrorPopup('Si è verificato un errore durante l\'eliminazione dell\'utente!');
								}
							});
						});
					});
				}
			}


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

            function getNotifications() {
                $scope.promise = Messaggi.query().$promise;

                return $scope.promise.then(function (data) {
                    logger.info("SUCCESS", data);
                    $scope.messaggi = data;
                }, function (onfail) {
                    logger.error("ERROR", onfail);
                    if (onfail.body) {
                        if (onfail.body.data && onfail.body.data.message) {
                            notificationManager.showErrorPopup('Si è verificato un errore durante il caricamento dei messaggi: ' + onfail.body.data.message);
                        } else {
                            notificationManager.showErrorPopup('Si è verificato un errore durante il caricamento dei messaggi!');
                        }
                    } else {
                        notificationManager.showErrorPopup('Si è verificato un errore durante il caricamento dei messaggi!');
                    }
                });
            };

            this.onInit = function () {
                // Recupera i messaggi
                getNotifications();
            };

            this.onExit = function () { };

            controllerValidator.validate(this, $scope);
        }
    ]);

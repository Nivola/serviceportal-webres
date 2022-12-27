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
"use strict";

angular.module('app')

	.controller('ListNotizieController', ['$mdDialog', '$scope', '$state',
		'AuthLevel', 'entitiesRest', 'controllerValidator', 
		'notificationManager', "$filter",  'loggers', 'conf','StringMap','AuthenticationService', '$translate',
		function ($mdDialog, $scope, $state,
			AuthLevel, entitiesRest, controllerValidator,
			notificationManager, $filter,  loggers, conf,StringMap,AuthenticationService, $translate) {
			'use strict';


			var logger = loggers.get("ListNotizieController");
			var Notizia = entitiesRest.getEntity('Notizia');

			$scope.notizie = [];
			$scope.selected = [];
			$scope.isBOAdmin=AuthenticationService.isGranted(AuthLevel.BOADMIN);

			$scope.advancedSearchState = false;

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

			$scope.actions = {
				auth: {
					add: $state.get("app.creaNotizia").requiredUC,

					advancedSearch: [
						AuthLevel.SUPERADMIN,
						AuthLevel.BOADMIN,
						/*AuthLevel.BOMONITORING,*/
						AuthLevel.OrgAdminRole,
						AuthLevel.DivAdminRole,
						AuthLevel.AccountAdminRole
					].join(","),

					delete: [
						AuthLevel.SUPERADMIN,
						AuthLevel.BOADMIN,
						/*AuthLevel.BOMONITORING,*/
						AuthLevel.OrgAdminRole,
						AuthLevel.DivAdminRole,
						AuthLevel.AccountAdminRole
					].join(",")
				},

				refresh: getNotizie,

				add: function () {
					$state.go('app.creaNotizia');
				},
				view: function () {
					$state.go('app.visualizzaNotizia',{
						idNotizia: $scope.selected[0].id,
					});
				},
				change: function () {
					$state.go('app.modificaNotizia',{
						idNotizia: $scope.selected[0].id,
					});
				},
				viewContenuto: function (notizia) {
					$scope.selected=[];
					
					$mdDialog.show({
						locals: {
							notiziaSelected: notizia,
							
						},
						controller: 'DialogNotizieContenutoController',
						templateUrl: 'angular/entities/notizie/tpl-dialog-notizie-contenuto.html',
						parent: angular.element(document.body),
						targetEvent: notizia,
						clickOutsideToClose: true,
						fullscreen: true	// Only for -xs, -sm breakpoints.
					});
				},
				
				
				
				advancedSearch: function (ev) {
					$mdDialog.show({
						locals: {
							actions: { auth: $scope.actions.auth.accredit, accredit: $scope.actions.accredit }
						},
						scope: $scope,        // use parent scope in template
						preserveScope: true,  // do not forget this if use parent scope
						// Since DialogAdvancedSearchCtrl is instantiated with ControllerAs syntax
						// AND we are passing the parent '$scope' to the dialog, we MUST
						// use 'ctrl.<xxx>' in the template markup
						controller: 'DialogAdvancedSearchCtrl',
						controllerAs: 'ctrl',
						templateUrl: 'angular/entities/notizia/tpl-dialog-advance-search-notizia.html',
						parent: angular.element(document.body),
						targetEvent: ev,
						clickOutsideToClose: true,
						fullscreen: true	// Only for -xs, -sm breakpoints.
					});
				},

				delete: function (event) {
					var confirm = $mdDialog
						.confirm()
						.title($translate.instant('notizie.elimina.titolo'))
						.textContent($translate.instant('notizie.elimina.testo'))
						.targetEvent(event)
						.ok($translate.instant('si'))
						.cancel($translate.instant('no'));
					$mdDialog.show(confirm).then(function () {
						$scope.selected.forEach(element => {
							Notizia.delete({ idNotizia: element.id }, function (data) {
								console.log("success", data);
								notificationManager.showSuccessPopup($translate.instant('notizie.elimina.success'));
								// Reset lista
								$scope.unselectAll();
								$scope.resetFilter();
								// Aggiorno lista notizie
								getNotizie();
							}, function (onfail) {
								console.error("deleteError", onfail);

								if (onfail.body) {
									if (onfail.body.data && onfail.body.data.message) {
										notificationManager.showErrorPopup($translate.instant('notizie.elimina.error') + ': ' + onfail.body.data.message);
									} else {
										notificationManager.showErrorPopup($translate.instant('notizie.elimina.error'));
									}
								} else {
									notificationManager.showErrorPopup($translate.instant('notizie.elimina.error'));
								}
							});
						});
					});
				}
			}

			

			$scope.showUserTabDetails = function (ev) {
				$mdDialog.show({
					locals: {
						userSelected: $scope.selected
					},
					controller: 'DialogDetailsController',
					templateUrl: 'angular/entities/notizia/tpl-dialog-tab-dettagli-notizia.html',
					parent: angular.element(document.body),
					targetEvent: ev,
					clickOutsideToClose: true,
					fullscreen: true	// Only for -xs, -sm breakpoints.
				});
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

			$scope.toggleLimitOptions = function () {
				$scope.limitOptions = $scope.limitOptions ? undefined : [5, 10, 15];
			};

			$scope.logItem = function (item) {
				logger.debug(item, 'was selected');
			};

			$scope.logOrder = function (order) {
				logger.debug('order: ', order);
			};

			$scope.logPagination = function (page, limit) {
				logger.debug('page: ', page);
				logger.debug('limit: ', limit);
			}

			$scope.hoverIn = function(notizia){
				
			   // this.hoverExpand = true;
			 
            };
        
            $scope.hoverOut = function(){
                this.hoverExpand = false;
            };

			function getNotizie() {
				$scope.promise = Notizia.query().$promise;

                return $scope.promise.then(function (data) {
                    logger.info("SUCCESS", data);
                    $scope.notizie = data;
                }, function (onfail) {
                    logger.error("ERROR", onfail);
                    if (onfail.body) {
                        if (onfail.body.data && onfail.body.data.message) {
                            notificationManager.showErrorPopup($translate.instant('error.loading_notizie') + ': ' + onfail.body.data.message);
                        } else {
                            notificationManager.showErrorPopup($translate.instant('error.loading_notizie'));
                        }
                    } else {
                        notificationManager.showErrorPopup($translate.instant('error.loading_notizie'));
                    }
                });
            };

			this.onInit = function () {
				// Aggiorno lista notizie
				getNotizie();
			};

			this.onExit = function () { };

			controllerValidator.validate(this, $scope);

		}]);

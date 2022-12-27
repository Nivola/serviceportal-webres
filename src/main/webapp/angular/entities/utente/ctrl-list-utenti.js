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

	.controller('ListUtentiController', ['$mdDialog', '$scope', '$state',
		'AuthLevel', 'entitiesRest', 'controllerValidator', 'ReadthedocService',
		'notificationManager', "$filter", 'loggers', '$translate',
		function ($mdDialog, $scope, $state,
			AuthLevel, entitiesRest, controllerValidator, ReadthedocService, 
			notificationManager, $filter, loggers, $translate) {
			'use strict';

			$scope.rtdUtentiList=ReadthedocService.getUrlFromPath('/utenti').docUrl;
			var logger = loggers.get("ListUtentiController");
			var Utente = entitiesRest.getEntity('Utente');

			$scope.users = [];
			$scope.selected = [];

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

			$scope.limitOptions = [10, 20,  30];

			$scope.filter = {
				options: {
					debounce: 500
				}
			};

			$scope.query = {
				order: 'matricolaCsi',
				limit: 10,
				page: 1
			};

			$scope.actions = {
				searchTable: function () {
					return $scope.filter.search;
				},
				auth: {
					add: $state.get("app.registraUtente").requiredUC,

					accredit: [
						AuthLevel.SUPERADMIN,
						AuthLevel.BOADMIN,
						/*AuthLevel.BOMONITORING,*/
						AuthLevel.OrgAdminRole,
						AuthLevel.DivAdminRole,
						AuthLevel.AccountAdminRole
					].join(","),

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

				refresh: getUtenti,

				add: function () {
					$state.go('app.registraUtente');
				},
				view: function () {
					$state.go('app.visualizzaUtente',{
						idUtente: $scope.selected[0].id,
					});
				},
				accredit: function (ev) {
					var selected = $scope.selected;

					if ($scope.advancedSearchState) {
						// Evito di selezionare l'elemento (che potrebbe non essere presente) nella data-table
						$scope.selected = [];
						$scope.advancedSearchState = false;
					}

					$mdDialog.show({
						locals: {
							userSelected: selected
						},
						controller: 'DialogAccreditController',
						templateUrl: 'angular/entities/utente/tpl-dialog-accredit-utente.html',
						parent: angular.element(document.body),
						targetEvent: ev,
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
						templateUrl: 'angular/entities/utente/tpl-dialog-advance-search-utente.html',
						parent: angular.element(document.body),
						targetEvent: ev,
						clickOutsideToClose: true,
						fullscreen: true	// Only for -xs, -sm breakpoints.
					});
				},

				delete: function (event) {
					var confirm = $mdDialog
						.confirm()
						.title($translate.instant('utente.elimina.titolo'))
						.textContent($translate.instant('utente.elimina.testo'))
						.targetEvent(event)
						.ok($translate.instant('si'))
						.cancel($translate.instant('no'));
					$mdDialog.show(confirm).then(function () {
						$scope.selected.forEach(element => {
							Utente.delete({ id: element.id }, function (data) {
								console.log("success", data);
								notificationManager.showSuccessPopup($translate.instant('utente.elimina.success'));
								// Reset lista
								$scope.unselectAll();
								$scope.resetFilter();
								// Aggiorno lista utenti
								getUtenti();
							}, function (onfail) {
								console.error("deleteError", onfail);

								if (onfail.body) {
									if (onfail.body.data && onfail.body.data.message) {
										notificationManager.showErrorPopup($translate.instant('utente.elimina.error') + ': ' + onfail.body.data.message);
									} else {
										notificationManager.showErrorPopup($translate.instant('utente.elimina.error'));
									}
								} else {
									notificationManager.showErrorPopup($translate.instant('utente.elimina.error'));
								}
							});
						});
					});
				}
			}

			$scope.showUserDetails = function (ev) {
				$mdDialog.show({
					locals: {
						userSelected: $scope.selected
					},
					controller: 'DialogDetailsController',
					templateUrl: 'angular/entities/utente/tpl-dialog-dettagli-utente.html',
					parent: angular.element(document.body),
					targetEvent: ev,
					clickOutsideToClose: true,
					fullscreen: true	// Only for -xs, -sm breakpoints.
				});
			};

			$scope.showUserTabDetails = function (ev) {
				$mdDialog.show({
					locals: {
						userSelected: $scope.selected
					},
					controller: 'DialogDetailsController',
					templateUrl: 'angular/entities/utente/tpl-dialog-tab-dettagli-utente.html',
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

			function getUtenti() {
				$scope.promise = Utente.query().$promise;	// TODO: caricare SOLO utenti visibili al ruolo corrente

				return $scope.promise.then(function (data) {
					$scope.users = data;
					$scope.numeroAttivi = $filter('filter')(data, { attivo: true }).length;
					$scope.numeroDisattivi = $filter('filter')(data, { attivo: false }).length;
				}, function (onfail) {
					notificationManager.showErrorPopup($translate.instant('error.loading_utenti'));
				});
			}

			this.onInit = function () {
				// Aggiorno lista utenti
				getUtenti();
			};

			this.onExit = function () { };

			controllerValidator.validate(this, $scope);

		}]);

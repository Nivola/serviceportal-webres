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

angular.module('app')

	.controller('ElencoListiniController', ['$mdDialog', '$scope', '$state',
		'AuthLevel', 'entitiesRest', 'controllerValidator', 'ReadthedocService',
		'notificationManager', "$filter", 'loggers', '$translate',
		function ($mdDialog, $scope, $state,
			AuthLevel, entitiesRest, controllerValidator, ReadthedocService, 
			notificationManager, $filter, loggers, $translate) {
			'use strict';

			$scope.rtdUtentiList=ReadthedocService.getUrlFromPath('/utenti').docUrl;
			var logger = loggers.get("ElencoListiniController");
			var Listini = entitiesRest.getEntity('Listini');

			$scope.listini = [];
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

			$scope.limitOptions = [10, 20, 30];

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

				refresh: getListini(),

				// add: function () {
				// 	$state.go('app.newListino');
				// }, serviceportal-webres\src\main\webapp\angular\entities\listini\tpl-dialog-nuovo-listino.html
				add: function (event) {
					$mdDialog.show({
						locals: {
							// Keypair: Keypair,
                             mdDialog: $mdDialog
                             //keypairs:$scope.keypairs    
						},
						controller: 'DialogNuovoListinoController',
						templateUrl: 'angular/entities/listini/tpl-dialog-nuovo-listino.html',
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
				view: function () {
					$state.go('app.visualizzaListino',{
						listino : $scope.selected[0],
					});
				},
				
				delete: function (event) {
					var confirm = $mdDialog
						.confirm()
						.title($translate.instant('listini.elimina.titolo'))
						.textContent($translate.instant('listini.elimina.testo'))
						.targetEvent(event)
						.ok($translate.instant('si'))
						.cancel($translate.instant('no'));
					$mdDialog.show(confirm).then(function () {
						$scope.selected.forEach(element => {
							Listini.delete({ id: element.id }, function (data) {
								console.log("success", data);
								notificationManager.showSuccessPopup($translate.instant('listini.elimina.success'));
								// Reset lista
								$scope.unselectAll();
								$scope.resetFilter();
								// Aggiorno lista utenti
								getListini();
							}, function (onfail) {
								
								if (onfail.data && onfail.data.message) {
									notificationManager.showErrorPopup($translate.instant('listini.elimina.error') + ': ' + onfail.data.message);
								} else {
									notificationManager.showErrorPopup($translate.instant('listini.elimina.error'));
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

			function getListini() {
				$scope.promise = Listini.query().$promise;	

				return $scope.promise.then(function (data) {
					$scope.listini = data;
				}, function (onfail) {
					notificationManager.showErrorPopup($translate.instant('error.loading_listini'));
				});
			}

			this.onInit = function () {
				// Aggiorno lista utenti
				getListini();
			};

			this.onExit = function () { };

			controllerValidator.validate(this, $scope);

		}]);

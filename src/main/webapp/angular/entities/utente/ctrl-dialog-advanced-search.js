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

	.controller('DialogAdvancedSearchCtrl', ['$mdDialog', '$scope', 'entitiesRest',
		'controllerValidator', 'notificationManager',
		'actions', 'loggers',
		function ($mdDialog, $scope, entitiesRest,
			controllerValidator, notificationManager,
			actions, loggers) {
			'use strict';

			var logger = loggers.get("DialogAdvancedSearchCtrl");

			var Utente = entitiesRest.getEntity('Utente');

			var self = this;
			self.users = [];
			self.isLoading = true;
			self.querySearch = querySearch;
			self.actions = actions;

			self.cancel = function ($event) {
				$mdDialog.cancel();
			};
			self.finish = function ($event) {
				if (!self.selectedItem) {
					notificationManager.showErrorPopup('Operazione non permessa!');
					return;
				}
				$scope.advancedSearchState = true;
				$mdDialog.hide();
				$scope.selected = [self.selectedItem.userObject];
				$scope.actions.accredit($event);
			};

			function querySearch(query) {
				return query ? self.users.filter(createFilterFor(query)) : self.users;
			}

			function createFilterFor(query) {
				var lowercaseQuery = angular.lowercase(query);
				return function filterFn(user) {
					return user.value.includes(lowercaseQuery);
				};
			}

			this.onInit = function () {
				Utente.query().$promise.then(function (data) {
					logger.info("SUCCESS", data);
					self.users = data.map(function (user) {
						return {
							value: user.firstName.toLowerCase() + " " + user.lastName.toLowerCase(),
							display: user.firstName + " " + user.lastName,
							userObject: user
						};
					});
				}, function (onfail) {
					logger.error("ERROR", onfail);
					if (onfail.body) {
						if (onfail.body.data && onfail.body.data.message) {
							notificationManager.showErrorPopup('Si è verificato un errore durante il caricamento degli utenti: ' + onfail.body.data.message);
						} else {
							notificationManager.showErrorPopup('Si è verificato un errore durante il caricamento degli utenti!');
						}
					} else {
						notificationManager.showErrorPopup('Si è verificato un errore durante il caricamento degli utenti!');
					}
					return;
				}).finally(function () {
					self.isLoading = false;
				});
			}

			this.onExit = function () { };

			controllerValidator.validate(this, $scope);
		}]);

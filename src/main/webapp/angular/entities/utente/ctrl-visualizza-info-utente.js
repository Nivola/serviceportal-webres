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

	.controller('VisualizzaInfoUtenteController', ['$mdDialog', '$scope', '$state', '$stateParams', '$timeout',
		'AuthLevel', 'entitiesRest', 'controllerValidator',
		'notificationManager', "$filter", 'loggers', 'conf', 'StringMap', 'AuthenticationService',
		function ($mdDialog, $scope, $state, $stateParams, $timeout,
			AuthLevel, entitiesRest, controllerValidator,
			notificationManager, $filter, loggers, conf, StringMap, AuthenticationService) {
			'use strict';

			var Utente = entitiesRest.getEntity('Utente');

			$scope.userDetails = {};

			// Proprietà data-table
			$scope.options = {
				isDettaglioLoaded: false,
			};

			$scope.actions = {
				auth: {
					accredit: [
						AuthLevel.SUPERADMIN,
						AuthLevel.BOADMIN,
						/*AuthLevel.BOMONITORING,*/
						AuthLevel.OrgAdminRole,
						AuthLevel.DivAdminRole,
						AuthLevel.AccountAdminRole
					].join(","),
				},

				refresh: function () {
					getUtente();
				},
				change: function () {
					$scope.options.showAccreditaUtente = true;
				}

			}


			function getUtente() {
				$scope.options.isDettaglioLoaded = false;
				$scope.userDetails = angular.copy(AuthenticationService.getUtente());
				let blankImage = conf.siteContext + "/img/utente-blank.svg"
				$scope.userDetails.imageUrl = $scope.userDetails.imageUrl || blankImage;
				$scope.options.isDettaglioLoaded = true;

			}

			this.onInit = function () {
				//carico dettaglio utente
				getUtente();
			};

			this.onExit = function () { };

			controllerValidator.validate(this, $scope);

		}]);

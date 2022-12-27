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

	.controller('DialogAttivitaContenutoController', ['$mdDialog', '$timeout', '$scope',
		'AuthenticationService', 'AuthLevel', 'controllerValidator',
		'notificationManager', 'utils', 'StringMap',
		'entitiesRest', 'attivita', 'loggers',
		function ($mdDialog, $timeout, $scope,
			AuthenticationService, AuthLevel, controllerValidator,
			notificationManager, utils, StringMap,
			entitiesRest, attivita, loggers) {
			'use strict';

			var logger = loggers.get("DialogAttivitaContenutoController");
			$scope.attivita=attivita; 
			$scope.closeDialog = function () {
				$mdDialog.hide();
				
			};

			

			this.onInit = function () {
				
			};

			this.onExit = function () { };

			controllerValidator.validate(this, $scope);
		}]);

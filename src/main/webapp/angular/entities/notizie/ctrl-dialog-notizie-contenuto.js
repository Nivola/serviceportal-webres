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

	.controller('DialogNotizieContenutoController', ['$mdDialog', '$timeout', '$scope',
		'AuthenticationService', 'AuthLevel', 'controllerValidator',
		'notificationManager', 'utils', 'StringMap',
		'entitiesRest', 'notiziaSelected', 'loggers',
		function ($mdDialog, $timeout, $scope,
			AuthenticationService, AuthLevel, controllerValidator,
			notificationManager, utils, StringMap,
			entitiesRest, notiziaSelected, loggers) {
			'use strict';

			var logger = loggers.get("DialogNotizieContenutoController");
			$scope.notizia=notiziaSelected; 
			$scope.closeDialog = function () {
				$mdDialog.hide();
				
			};

			

			this.onInit = function () {
				
			};

			this.onExit = function () { };

			controllerValidator.validate(this, $scope);
		}]);

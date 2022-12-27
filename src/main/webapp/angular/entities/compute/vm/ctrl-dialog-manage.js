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

	.controller('DialogManageVmController', ['$mdDialog', '$scope', 'entitiesRest',
		'controllerValidator', 'notificationManager', 'loggers',
		'vmSelected',
		function ($mdDialog, $scope, entitiesRest,
			controllerValidator, notificationManager, loggers,
			vmSelected) {
			'use strict';

			var logger = loggers.get("DialogManageVmController");

			// var Vm = entitiesRest.getEntity('Vm');

			if (vmSelected.length !== 1) {
				notificationManager.showErrorPopup('Selezionare solo una virtual machine!');
				$mdDialog.hide();
				return;
			}
			$scope.vmDetails = vmSelected[0];
			$scope.isRunning = $scope.vmDetails.status === 'running';

			$scope.iconStyle = {
				"color": "#4285f4",
			}

			$scope.getOsIcon = function (template) {
				var os = template.toLowerCase();
				var imgNames = [
					'osx', 'centos', 'debian',
					'freebsd', 'linux', 'redhat',
					'suse', 'ubuntu', 'windows'
				];

				for (var i in imgNames) {
					if (os.includes(imgNames[i])) {
						return imgNames[i];
					}
				}

				return 'os';
			}

			$scope.closeDialog = function () {
				$mdDialog.hide();
			};

			$scope.start = function() {
				console.log("VM START: ", $scope.vmDetails);
			}

			$scope.stop = function() {
				console.log("VM STOP: ", $scope.vmDetails);
			}

			this.onInit = function () {
			}

			this.onExit = function () { };

			controllerValidator.validate(this, $scope);
		}]);

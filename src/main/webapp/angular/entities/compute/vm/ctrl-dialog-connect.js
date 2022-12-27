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

	.controller('DialogConnectController', ['$mdDialog', '$scope', 'entitiesRest',
		'controllerValidator', 'notificationManager', 'loggers',
		'vmSelected',
		function ($mdDialog, $scope, entitiesRest,
			controllerValidator, notificationManager, loggers,
			vmSelected) {

				var logger = loggers.get("DialogConnectVmController");

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
	
			$scope.closeDialog = function () {
				$mdDialog.hide();
			};

		}]);

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

	.controller('DialogVolumesController', ['$mdDialog', '$scope', 'entitiesRest',
		'controllerValidator', 'notificationManager', 'loggers',
		'idVmSelected', 'readOnly',
		function ($mdDialog, $scope, entitiesRest,
			controllerValidator, notificationManager, loggers,
			idVmSelected, readOnly) {
			'use strict';

			var logger = loggers.get("DialogVolumesController");

			$scope.readOnly = readOnly;

			var index = $scope.$parent.vmList.istanze.findIndex(function (candidate) {
				return candidate.id == idVmSelected;
			});

			$scope.volumes = $scope.$parent.vmList.istanze[index].volumes;

			$scope.selectedVolumes = $.grep($scope.volumes, function (candidate) {
				return candidate.selected === true;
			});

			$scope.iconStyle = {
				"color": "#4285f4",
			}

			$scope.salvaConfigurazione = function () {
				if (!$scope.readOnly) {
					$scope.volumes.forEach(volume => {
						volume.selected = $scope.selectedVolumes.includes(volume);
					});
				}
				// notificationManager.showSuccessPopup('Volumi salvati correttamente');
				$scope.closeDialog();
			}

			$scope.closeDialog = function () {
				$mdDialog.hide();
			};

			this.onInit = function () {
			}

			this.onExit = function () { };

			controllerValidator.validate(this, $scope);
		}]);

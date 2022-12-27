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

	.controller('DialogDeleteSGController', ['mdDialog', '$scope','notificationManager', 
		'sgSelected','$timeout',
		function (mdDialog, $scope, notificationManager,sgSelected,$timeout) {

			var timeout = $timeout(function () { });

			$scope.securityGroupDetails = {};
			
			if (sgSelected.length !== 1) {
				notificationManager.showErrorPopup('Selezionare solo un security group');
				mdDialog.hide();
				return;
			}
			$scope.securityGroupDetails = sgSelected[0];
			$scope.title = "Cancellazione SecurityGroup "+$scope.securityGroupDetails.groupName;
			$scope.textConferma = "Confermi la cancellazione dell'istanza \"" + $scope.securityGroupDetails.groupName + "\" ?"
			$scope.textInfo = "L'istanza verrà cancellata definitivamente.";
			$scope.textProsegui = "Si vuole procedere con la cancellazione ?";

			

			$scope.closeDialog = function () {
				mdDialog.cancel();
			};

			$scope.procedi = function () {
				$scope.dbass.isShowInfo=false;
			};
			
		}]);

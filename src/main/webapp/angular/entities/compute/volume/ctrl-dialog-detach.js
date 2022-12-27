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

	.controller('DialogDetachController', ['mdDialog', '$scope','notificationManager', '$timeout', '$translate', 'volumeSelected', 'attachmentDetails',
		function (mdDialog, $scope, notificationManager,$timeout, $translate , volumeSelected, attachmentDetails) {

			var timeout = $timeout(function () { });

			$scope.volumeDetails = {};
			$scope.volume = {
				nome: null,
				errorNameNotMatching: false,
				isShowInfo:true,
				enableConferma:false,
			};
			$scope.volumeDetails = volumeSelected;
			var vmdetails= attachmentDetails;
			$scope.title = $translate.instant('volume.dialog.titoloDettach') + "  '" + $scope.volumeDetails['nvl-name'] + "'  "+$translate.instant('dalla') +"VM '"+ vmdetails.nomeIstanza + "'"
			$scope.textConferma = $translate.instant('volume.dialog.conferma') + " \"" + $scope.volumeDetails['nvl-name'] + "\" ?"
			$scope.textInfo = $translate.instant('volume.dialog.info');
			$scope.textProsegui = $translate.instant('volume.dialog.prosegui');

			$scope.nomeChange = function () {
				$timeout.cancel(timeout); //cancel the last timeout
				timeout = $timeout(function () {
					if ($scope.volume.nome === $scope.volumeDetails['nvl-name']) {
						$scope.volume.errorNameNotMatching = false;
						$scope.volume.enableConferma=true;
						$scope.volume.isShowInfo=false;

					} else {
						$scope.volume.errorNameNotMatching = true;
						$scope.volume.enableConferma=false;
					}
				}, 250);
			};

			$scope.closeDialog = function () {
				mdDialog.cancel();
			};

			$scope.procedi = function () {
				$scope.volume.isShowInfo=false;
			};
			$scope.elimina = function () {
				if($scope.volume.errorNameNotMatching){
					notificationManager.showErrorPopup($translate.instant('error.operazione_non_consentita'));
					mdDialog.hide();
					return;
				}
				mdDialog.hide();
			};

			
		}]);

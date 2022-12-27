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

	.controller('DialogDeleteStaasController', ['mdDialog', '$scope','notificationManager', 
		'staasSelected','$timeout', '$translate', 
		function (mdDialog, $scope, notificationManager,staasSelected,$timeout, $translate) {

			var timeout = $timeout(function () { });

			$scope.staasDetails = {};
			$scope.staas = {
				nome: null,
				errorNameNotMatching: false,
				proseguiConferma:false,
				enableConferma:false
			};

			if (staasSelected.length !== 1) {
				notificationManager.showErrorPopup($translate.instant('shares.elimina.selezione'));
				mdDialog.hide();
				return;
			}
			$scope.staasDetails = staasSelected[0];
			$scope.title = $translate.instant('shares.elimina.titolo') + " " + $scope.staasDetails.nome;
			$scope.textConferma = $translate.instant('shares.elimina.conferma') + " \"" + $scope.staasDetails.nome + "\" ?";
			$scope.textInfo = $translate.instant('shares.elimina.info');
			$scope.textProsegui = $translate.instant('shares.elimina.prosegui');

			$scope.nomeChange = function (event) {
				$timeout.cancel(timeout); //cancel the last timeout
				timeout = $timeout(function () {
					if ($scope.staas.nome === $scope.staasDetails.nome) {
						$scope.staas.errorNameNotMatching = false;
						$scope.staas.proseguiConferma=true;
						$scope.staas.enableConferma=true;
					} else {
						$scope.staas.errorNameNotMatching = true;
						$scope.staas.proseguiConferma=true;
						$scope.staas.enableConferma=false;


					}
					event.preventDefault();
				}, 250);
			};

			$scope.closeDialog = function () {
				mdDialog.cancel();
			};

			$scope.prosegui = function () {
				$scope.staas.proseguiConferma=true;
			};
			$scope.elimina = function () {
				$scope.staas.proseguiConferma=false;
				if($scope.staas.errorNameNotMatching){
					notificationManager.showErrorPopup($translate.instant('error.operazione_non_consentita'));
					mdDialog.hide();
					return;
				}
				mdDialog.hide();
			};

			
		}]);

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

	.controller('DialogDeleteController', ['mdDialog', '$scope','notificationManager', 
		'dbassSelected','$timeout', '$translate',
		function (mdDialog, $scope, notificationManager,dbassSelected,$timeout, $translate) {

			var timeout = $timeout(function () { });

			$scope.dbassDetails = {};
			$scope.dbass = {
				nome: null,
				errorNameNotMatching: false,
				isShowInfo:true,
				enableConferma:false,
			};

			if (dbassSelected.length !== 1) {
				notificationManager.showErrorPopup($translate.instant('dbaas.elimina.selezione'));
				mdDialog.hide();
				return;
			}
			$scope.dbassDetails = dbassSelected[0];
			$scope.title = $translate.instant('dbaas.elimina.titolo') + " " + $scope.dbassDetails.nome;
			$scope.textConferma = $translate.instant('dbaas.elimina.conferma') + " \"" + $scope.dbassDetails.nome + "\" ?"
			$scope.textInfo = $translate.instant('dbaas.elimina.info');
			$scope.textProsegui = $translate.instant('dbaas.elimina.prosegui');

			$scope.nomeChange = function () {
				$timeout.cancel(timeout); //cancel the last timeout
				timeout = $timeout(function () {
					if ($scope.dbass.nome === $scope.dbassDetails.nome) {
						$scope.dbass.errorNameNotMatching = false;
						$scope.dbass.enableConferma=true;
						$scope.dbass.isShowInfo=false;

					} else {
						$scope.dbass.errorNameNotMatching = true;
						$scope.dbass.enableConferma=false;
					}
				}, 250);
			};

			$scope.closeDialog = function () {
				mdDialog.cancel();
			};

			$scope.procedi = function () {
				$scope.dbass.isShowInfo=false;
			};
			$scope.elimina = function () {
				if($scope.dbass.errorNameNotMatching){
					notificationManager.showErrorPopup($translate.instant('error.operazione_non_consentita'));
					mdDialog.hide();
					return;
				}
				mdDialog.hide();
			};

			
		}]);

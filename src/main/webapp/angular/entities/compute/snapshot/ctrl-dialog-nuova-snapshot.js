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

	.controller('DialogNuovaSnapshotController', ['mdDialog', '$scope','notificationManager', 'controllerValidator',
		'Snapshot','snapshots','uuIdVM','$timeout','AuthenticationService', '$translate',
		function (mdDialog, $scope, notificationManager,controllerValidator,Snapshot,snapshots,uuIdVM,$timeout,AuthenticationService,
			$translate) {

			var timeout = $timeout(function () { });
			$scope.status = {
				pending: false,
			};
			$scope.snapshotNome = null;
			$scope.snapshots = snapshots;
			$scope.snapshot = {
				nome: null,
				errorNamePresente: false,
				enableCrea:false
			};
		

			$scope.title = $translate.instant('vm.snapshot.nuova.titolo');
			$scope.textInfo = "";

			
			$scope.onNomeChange = function () {
			
				$scope.snapshotFullName=$scope.snapshotNome+"-snp-"+AuthenticationService.getUtente().abilitazioneSelezionata.accountName.replace(/_/g,'-') ; 
				if($scope.snapshots && $scope.snapshots.length > 0){
					$scope.snapshot.enableCrea = false;
					var nomePresente = $scope.snapshots.filter(function (key) {
						return (key.snapshotName === $scope.snapshotNome || key.snapshotName === $scope.snapshotFullName  ) ; // TODO
					});
				 
					$scope.snapshot.errorNamePresente = (nomePresente !== undefined && nomePresente !=='' && nomePresente.length > 0)?true:false; 
					$scope.snapshot.enableCrea = !($scope.snapshot.errorNamePresente ||  $scope.snapshotNome===undefined || $scope.snapshotNome.length===0 || $scope.snapshotNome==='' ); 
				}else{
					$scope.snapshot.enableCrea = !( $scope.snapshotNome===undefined || $scope.snapshotNome.length===0 || $scope.snapshotNome==='' );
				}

			}


			$scope.closeDialog = function () {
				mdDialog.cancel();
			};

			$scope.crea = function () {

				if($scope.snapshot.errorNamePresente ){
					notificationManager.showErrorPopup($translate.instant('vm.snapshot.nuova.error_presente'));
					mdDialog.hide();
					return;
				}
				if($scope.snapshotNome ==undefined || $scope.snapshotNome.length < 8 || $scope.snapshotNome.length >100 ){
					return;
				}
				let snapshotRequest = {
					nomeSnapshot: $scope.snapshotFullName,
					accountId : AuthenticationService.getUtente().abilitazioneSelezionata.accountUuid,
					instanceId : uuIdVM
				}
				let requestBody = JSON.stringify(snapshotRequest);
				$scope.status.pending = true;
				Snapshot.save(requestBody, function (data) {
					notificationManager.showSuccessPopup($translate.instant('vm.snapshot.nuova.success'));
					mdDialog.hide();
				}, function (onfail) {
					if (onfail) {
						if (onfail.data && onfail.data.message) {
							notificationManager.showErrorPopup($translate.instant('vm.snapshot.nuova.error') + ' ' + onfail.data.message);
						} else {
							notificationManager.showErrorPopup($translate.instant('vm.snapshot.nuova.error'));
						}
					} else {
						notificationManager.showErrorPopup($translate.instant('vm.snapshot.nuova.error'));
					}
				}).$promise.finally(function () {
					$scope.status.pending = false;
				});;

			};

           
			controllerValidator.validate(this, $scope);
		}]);

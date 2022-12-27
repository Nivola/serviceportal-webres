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

	.controller('DialogImportaKeypairController', ['mdDialog', '$scope','notificationManager', 'controllerValidator',
		'Keypair','keypairs','$timeout','AuthenticationService', '$translate', 
		function (mdDialog, $scope, notificationManager,controllerValidator,Keypair,keypairs,$timeout, AuthenticationService, $translate) {

			var timeout = $timeout(function () { });
			$scope.status = {
				pending: false,
			};
			$scope.keypairNome = null;
			$scope.keypairs = keypairs;
			$scope.chiaveDaImportare = null;
			$scope.keypair = {
				nome: null,
				chiaveDaImportare:null,
				errorNamePresente: false,
				enableCrea:false
			};

			$scope.title = $translate.instant('keypair.importa.titolo');
			$scope.textInfo = $translate.instant('keypair.importa.info');

			$scope.onNomeChange = function () {
				
				
				$scope.keypairFullName=$scope.keypairNome+"-key-"+AuthenticationService.getUtente().abilitazioneSelezionata.accountName.replace(/_/g,'-') ; 
				if($scope.keypairs && $scope.keypairs.length > 0){
					$scope.keypair.enableCrea = false;
					var nomePresente = $scope.keypairs.filter(function (key) {
						return (key.nome === $scope.keypairNome || key.nome === $scope.keypairFullName  ) ;
					});
				 
					$scope.keypair.errorNamePresente = (nomePresente !== undefined && nomePresente !=='' && nomePresente.length > 0)?true:false; 
					$scope.keypair.enableCrea = !($scope.keypair.errorNamePresente ||  $scope.keypairNome===undefined || $scope.keypairNome.length===0 || $scope.keypairNome===''
														||  $scope.chiaveDaImportare===undefined ||  $scope.chiaveDaImportare==='' || $scope.chiaveDaImportare===null ); 
				}else{
					$scope.keypair.enableCrea = !( $scope.keypairNome===undefined || $scope.keypairNome.length===0 || $scope.keypairNome===''
							||  $scope.chiaveDaImportare===undefined ||  $scope.chiaveDaImportare==='' || $scope.chiaveDaImportare===null ); 
				}

			}


			$scope.closeDialog = function () {
				mdDialog.cancel();
			};

			$scope.importa = function () {

				if($scope.keypair.errorNamePresente ){
					notificationManager.showErrorPopup($translate.instant('keypair.errore_nome_presente'));
					mdDialog.hide();
					return;
				}
				if($scope.keypairNome ==undefined || $scope.keypairNome.length < 8 || $scope.keypairNome.length >100 ){
					return;
				}
				if($scope.chiaveDaImportare ==undefined ){
					return;
				}
				let keypairRequest = {
					nome:$scope.keypairFullName,
					chiaveDaImportare:$scope.chiaveDaImportare
				}
				let requestBody = JSON.stringify(keypairRequest);
				$scope.status.pending = true;
				Keypair.update(requestBody, function (data) {
					notificationManager.showSuccessPopup($translate.instant('keypair.importa.success'));
					mdDialog.hide();
				}, function (onfail) {
						if (onfail.data) {
							notificationManager.showErrorPopup($translate.instant('keypair.importa.errore') + ": " + onfail.data.message);
						} else {
							notificationManager.showErrorPopup($translate.instant('keypair.importa.errore'));
						}
				}).$promise.finally(function () {
					$scope.status.pending = false;
				});

			};


			controllerValidator.validate(this, $scope);
		}]);

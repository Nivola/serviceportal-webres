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

	.controller('DialogNuovaKeypairController', ['mdDialog', '$scope','notificationManager', 'controllerValidator',
		'Keypair','keypairs','$timeout','AuthenticationService', '$translate', 
		function (mdDialog, $scope, notificationManager,controllerValidator,Keypair,keypairs,$timeout,AuthenticationService, $translate) {

			var timeout = $timeout(function () { });
			$scope.status = {
				pending: false,
			};
			$scope.keypairNome = null;
			$scope.keypairs = keypairs;
			$scope.keypair = {
				nome: null,
				errorNamePresente: false,
				enableCrea:false
			};
		

			$scope.title = $translate.instant('keypair.nuova.titolo');
			$scope.textInfo = $translate.instant('keypair.nuova.info');

			
			$scope.onNomeChange = function () {
			
				$scope.keypairFullName=$scope.keypairNome+"-key-"+AuthenticationService.getUtente().abilitazioneSelezionata.accountName.replace(/_/g,'-') ; 
				if($scope.keypairs && $scope.keypairs.length > 0){
					$scope.keypair.enableCrea = false;
					var nomePresente = $scope.keypairs.filter(function (key) {
						return (key.nome === $scope.keypairNome || key.nome === $scope.keypairFullName  ) ;
					});
				 
					$scope.keypair.errorNamePresente = (nomePresente !== undefined && nomePresente !=='' && nomePresente.length > 0)?true:false; 
					$scope.keypair.enableCrea = !($scope.keypair.errorNamePresente ||  $scope.keypairNome===undefined || $scope.keypairNome.length===0 || $scope.keypairNome==='' ); 
				}else{
					$scope.keypair.enableCrea = !( $scope.keypairNome===undefined || $scope.keypairNome.length===0 || $scope.keypairNome==='' );
				}

			}


			$scope.closeDialog = function () {
				mdDialog.cancel();
			};

			$scope.crea = function () {

				if($scope.keypair.errorNamePresente ){
					notificationManager.showErrorPopup($translate.instant('keypair.errore_nome_presente'));
					mdDialog.hide();
					return;
				}
				if($scope.keypairNome ==undefined || $scope.keypairNome.length < 8 || $scope.keypairNome.length >100 ){
					return;
				}
				let keypairRequest = {
					nome: $scope.keypairFullName,
				}
				let requestBody = JSON.stringify(keypairRequest);
				$scope.status.pending = true;
				Keypair.save(requestBody, function (data) {
					notificationManager.showSuccessPopup($translate.instant('keypair.nuova.success'));
					if(data.valoriAggiuntivi.material && data.valoriAggiuntivi.material.length>0 )
						downloadFile(data.valoriAggiuntivi);
					mdDialog.hide();
				}, function (onfail) {
					if (onfail.data) {
						notificationManager.showErrorPopup($translate.instant('keypair.nuova.errore') + ": " + onfail.data.message);
					} else {
						notificationManager.showErrorPopup($translate.instant('keypair.nuova.errore'));
					}
					
				}).$promise.finally(function () {
					$scope.status.pending = false;
				});;

			};

            function componiNomeFile () {
                return $scope.keypairNome + "-key.pem";
            };


			function downloadFile(keypairCreated) {
                let filename = componiNomeFile();

				  if (window.navigator.msSaveBlob) { // IE 10+
					  let currentBlob = new Blob([keypairCreated.material]);
					  window.navigator.msSaveOrOpenBlob(currentBlob, filename);
				  } else {
					  try {
						  var link = document.createElement('a'); //create link download file
						  let currentBlob = new Blob([keypairCreated.material]);

						  link.href = window.URL.createObjectURL(currentBlob); // set url for link download
						//   link.href = window.URL.createObjectURL(b64toBlob(keypairCreated.pem, 'application/pdf')); // set url for link download
						  link.setAttribute('download', filename); //set attribute for link created
						  document.body.appendChild(link);
						  link.click();
						  document.body.removeChild(link);
					  } catch (ex) {
						  notificationManager.showErrorPopup($translate.instant('error.errore_download'));
					  }
				  }


            };	
			controllerValidator.validate(this, $scope);
		}]);

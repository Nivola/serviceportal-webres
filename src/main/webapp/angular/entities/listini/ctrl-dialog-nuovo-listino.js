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

	.controller('DialogNuovoListinoController', ['mdDialog', '$scope','notificationManager', 'controllerValidator',
		'Listini','$timeout','AuthenticationService', '$translate', 'entitiesRest',
		function (mdDialog, $scope, notificationManager,controllerValidator,Listini,$timeout,AuthenticationService, $translate, entitiesRest) {

			var timeout = $timeout(function () { });
			$scope.status = {
				pending: false,
			};
			// $scope.keypairNome = null;
			// $scope.keypairs = keypairs;
			var Tipi = entitiesRest.getEntity('Tipi');
			$scope.listino = {
				nome: null,
				tipoListino: null,
				descrizione:null,
				dataFineValidita: null,
				dataInizioValidita: null
			};

			$scope.actions ={
				loadTipi: function (event) {

					var queryString = {};
                
                $scope.promise = Tipi.query(queryString).$promise;
                return $scope.promise.then(function (data) {
                    $scope.tipi_litino = data;
                    // if(data.length === 0){
					// 	$scope.options.elencoVuoto = true;
                    // }else{
                    //     $scope.options.elencoVuoto = false;
                    // }

                }, function (onfail) {
                    if (onfail.data) {
                        notificationManager.showErrorPopup($translate.instant('listini.tipiErrore') + ": " + onfail.data.message);
                    } else {
                        notificationManager.showErrorPopup($translate.instant('listini.tipiErrore'));
                    }
                    
                });
				}
			}


		

			
		

			$scope.title = $translate.instant('listini.nuovo.titolo');
			$scope.textInfo = $translate.instant('keypair.nuova.info');

			
		


			$scope.closeDialog = function () {
				mdDialog.cancel();
			};

			$scope.crea = function () {

				// if($scope.keypair.errorNamePresente ){
				// 	notificationManager.showErrorPopup($translate.instant('keypair.errore_nome_presente'));
				// 	mdDialog.hide();
				// 	return;
				// }
				if($scope.listino.nome ==null || $scope.listino.nome < 8 || $scope.listino.nome >100 ){
					return;
				}
				
				let toSubmit = {
					nome: $scope.listino.nome,
					tipoListino: $scope.listino.tipoListino,
					descrizione: $scope.listino.nome,
					dataFineValidita: $scope.listino.dataFineValidita,
					dataInizioValidita: $scope.listino.dataInizioValidita
				}
				let requestBody = JSON.stringify(toSubmit);
				$scope.status.pending = true;
				Listini.save(requestBody, function (data) {
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

           
			controllerValidator.validate(this, $scope);
		}]);

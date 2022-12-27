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

angular.module('app').controller('ModificaOrganizzazioneController', [
	'$scope', '$state', '$anchorScroll', '$location', '$stateParams', 
	'controllerValidator', 'loggers', 'notificationManager', 'utils', 'OrganizzazioneRestClient', 'AuthenticationService', 'AuthLevel',
	'$http', 'conf', '$translate',
	function (
		$scope, $state, $anchorScroll, $location, $stateParams,
		controllerValidator, loggers, notificationManager, utils, OrganizzazioneRestClient,AuthenticationService,AuthLevel,  
		$http, conf, $translate
	) {
		var logger = loggers.get("ModificaOrganizzazioneController");
		
		$scope.isDataLoaded = false;
		$scope.isDataError = false;
		$scope.enteRemedy = '';
		$scope.organizzazione = {};
		$scope.enteSelezionato = null;

		$scope.categorie = [
			{ id: 1, nome: $translate.instant('organizzazioni.categoria.public'), value:'public' },
			{ id: 2, nome: $translate.instant('organizzazioni.categoria.csi'), value:'csi' },
			{ id: 3, nome: $translate.instant('organizzazioni.categoria.privata'), value:'private' }
		];
		$scope.formModificaOrganizzazione = {};
		$scope.actions = {
			salvaDati: function () {
				
				if ($scope.formModificaOrganizzazione.$valid) {
					$scope.organizzazione.org_type = $scope.categoriaSelezionata.value;
					if($scope.organizzazione.legalemail ==='' || $scope.organizzazione.legalemail ===undefined 
						&& ($scope.organizzazione.email ==='' || $scope.organizzazione.email === undefined) ){
							notificationManager.showErrorPopup("Specificare al meno una mail");
							return;
					}
					OrganizzazioneRestClient.updateOrganizzazioneUsingPUT({ OrganizzazioneDto: $scope.organizzazione })
						.then(function (data, status, headers, config) {
							if(!data && !data.data  && data.status !=200){
								$scope.isDataLoaded = false;
								notificationManager.showErrorPopup($translate.instant('organizzazioni.modifica.error'));
								return;
							}
							notificationManager.showSuccessPopup($translate.instant('organizzazioni.modifica.success'));
							caricaOrganizzazione();
							window.history.back();
						})
						.catch(function (data, status, headers, config) {
							notificationManager.showErrorPopup(data.body.data);
						});

					return;
				}
			},
			mostraDivisioni : function() {
				$state.go('app.divisione',{
					idOrganizzazione:$scope.organizzazione.uuid
				});
			},
			indietro: function () {
				$state.go('app.organizzazioni');
			}
		};

		
	$scope.cercaEnti = function (testo) {
		if (testo.length < 3) {
			return [];
		}
		return $http.get(conf.location.uaaApi + "/api/remedy/enti?ricerca="+testo).then(function(response) {
			return response.data;
		  }, function () {
			return [];
		  });
	};

		function caricaOrganizzazione() {
			OrganizzazioneRestClient.getOrganizzazioneUsingGET({ id: $stateParams.idOrganizzazione })
				.then(function (data, status, headers, config) {
					if(!data && !data.data  && data.status !=200){
						$scope.isDataLoaded = false;
						notificationManager.showErrorPopup($translate.instant('organizzazioni.visualizza.error'));
						return;
					}
					if(data.data.length <=0){
						$scope.isDataLoaded = false;
						notificationManager.showErrorPopup($translate.instant('organizzazioni.visualizza.no_data'));
						return;
					}
					$scope.organizzazione = data.data;
					if ($scope.organizzazione.elencoAttributi != null && $scope.organizzazione.elencoAttributi.length >0) {
						$scope.ricercaEnte = $scope.organizzazione.elencoAttributi[0].valore;
					}
					impostaCategoria();
					$scope.isDataLoaded = true;

				})
				.catch(function (data, status, headers, config) {
					notificationManager.showErrorPopup(data.body.data);
				});

		};
		function impostaCategoria(){
			if ($scope.organizzazione.org_type) {
				switch ($scope.organizzazione.org_type.toLowerCase()) {
					case 'public':
						$scope.categoriaSelezionata = $scope.categorie[0];
						break;
					case 'private':
						$scope.categoriaSelezionata = $scope.categorie[1];
						break;
					default:
						$scope.categoriaSelezionata = $scope.categorie[2];
						break;
				}
			}
		}
		function resetForm() {
			$scope.formModificaOrganizzazione.$setPristine();
			$scope.formModificaOrganizzazione.$setUntouched();
		}
		this.onInit = function () {
			$scope.categoriaSelezionata = {};
			caricaOrganizzazione();
		};

		this.onExit = function () { };

		controllerValidator.validate(this, $scope);
	}]);

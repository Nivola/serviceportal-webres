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

angular.module('app').controller('VisualizzaOrganizzazioneController', [
	'$scope', '$state','$stateParams',
	'controllerValidator', 'loggers', 'entitiesRest',
	'notificationManager',"AuthenticationService","AuthLevel","utils","OrganizzazioneRestClient", '$translate', 
function (
	$scope, $state,$stateParams,
	controllerValidator, loggers, entitiesRest,
	notificationManager,AuthenticationService,AuthLevel,utils,OrganizzazioneRestClient, $translate
	 )
{
	var logger = loggers.get("VisualizzaOrganizzazioneController");
	var ConsumiNonRendicontati = entitiesRest.getEntity('ConsumiNonRendicontatiOrganizzazione');

	$scope.isDataLoaded = false;
	$scope.isDataError = false;

	$scope.organizzazione = {};

	$scope.consumiNonRendicontati = {};

	$scope.categorie = [
		{ id: 1, nome: $translate.instant('organizzazioni.categoria.public') },
		{ id: 2, nome: $translate.instant('organizzazioni.categoria.csi')},
		{ id: 3, nome: $translate.instant('organizzazioni.categoria.privata') }
	  ];

	$scope.categoriaSelezionata = {  };
	
	$scope.actions = {
		mostraDivisioni : function() {
			$state.go('app.divisione',{
				idOrganizzazione:$scope.organizzazione.uuid
			});
		},
		indietro : function() {
			$state.go('app.organizzazioni');
		},
		caricaOrganizzazione : function() {
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
					impostaCategoria();
					$scope.isDataLoaded = true;
					if ($stateParams.new) {
						notificationManager.showSuccessPopup($translate.instant('organizzazioni.nuova.success'));
					}
				})
			;
		},
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




	this.onInit = function() {
		$scope.idOrganizzazione=$stateParams.idOrganizzazione
		$scope.actions.caricaOrganizzazione();
	
	};

	this.onExit = function() {};
	
	controllerValidator.validate(this, $scope);
}]);

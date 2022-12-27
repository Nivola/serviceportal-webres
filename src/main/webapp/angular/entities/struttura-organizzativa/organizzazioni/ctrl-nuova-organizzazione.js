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

angular.module('app').controller('NuovaOrganizzazioneController', [
	'$rootScope', '$scope', '$state', '$anchorScroll','$location',
	'$stateParams','controllerValidator',
	'loggers','notificationManager',
	'$timeout',
	"utils","$filter","OrganizzazioneRestClient","AuthenticationService","AuthLevel", '$http', 'conf', '$translate', 
	function (
		$rootScope, $scope, $state,$anchorScroll,$location,
		$stateParams, controllerValidator,
		loggers, notificationManager,
		$timeout,
		utils,$filter,OrganizzazioneRestClient,AuthenticationService,AuthLevel,  $http, conf, $translate
	) {
	var logger = loggers.get("NuovaOrganizzazioneController");
	$scope.options = {
		//mostra tabella
		isDataLoaded: false,
	};
	$scope.categorie = [
		{ id: 1, nome: $translate.instant('organizzazioni.categoria.public'), value:'public' },
		{ id: 2, nome: $translate.instant('organizzazioni.categoria.csi'), value:'csi' },
		{ id: 3, nome: $translate.instant('organizzazioni.categoria.privata'), value:'private' }
	  ];
	$scope.formNuovaOrganizzazione ={};
	$scope.actions = {
		salvaDati : function() {
			if ($scope.formNuovaOrganizzazione.$valid) {
				//utils.loadSpinnerOverlay("Salvataggio dei dati in corso...");
				$scope.nuovaOrganizzazione.org_type = $scope.categoriaSelezionata.value;
				OrganizzazioneRestClient.createOrganizzazioneUsingPOST({ OrganizzazioneDto: $scope.nuovaOrganizzazione })
					.then(function (data, status, headers, config) {
						//utils.hideSpinnerOverlay();
						if(!data && !data.data  && data.status !=200){
							$scope.options.isDataLoaded = false;
							notificationManager.showErrorPopup($translate.instant('organizzazioni.nuova.error'));
							return;
						}
						$state.go('app.visualizzaOrganizzazione',{
							idOrganizzazione:data.data,
							new:true
						});
					})
					.catch(function (data, status, headers, config) {
						//utils.hideSpinnerOverlay();
						notificationManager.showErrorPopup(data.body.data);

					});
					return ;
			}
			//vuol dire il mio form non e' valido probabilmente mancano dei dati faccio scroll to
			$location.hash($scope.formNuovaOrganizzazione.$error.required[0]);
			$anchorScroll($scope.formNuovaOrganizzazione.$error.required[0]);
		},
		indietro : function() {
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


	function clearField() {
		$scope.nuovaOrganizzazione = {
			name:null,
			desc:null, 
			org_type :null, 
			ext_anag_id:null, 
			active:true, 
			attributes:null,
			hasvat:false, 
			partner:false,
			referent:null,
			email:null,
			legalemail:null, 
			postaladdress:null,
		};
		$scope.categoriaSelezionata = {};

	}
	function resetForm(){
		// $scope.formNuovaOrganizzazione = {};
		// $scope.formNuovaOrganizzazione.$submitted = true;
		$scope.formNuovaOrganizzazione.$setPristine();
		$scope.formNuovaOrganizzazione.$setUntouched();
	}

	$scope.scrollToAnchor = function (anchor) {
		if (anchor !== null) {
			$location.hash(anchor);
			$anchorScroll(anchor);
		}
	 }

	this.onInit = function() {
		clearField();
		$scope.categoriaSelezionata = {};
	};

	this.onExit = function() {};
	
	controllerValidator.validate(this, $scope);
}]);

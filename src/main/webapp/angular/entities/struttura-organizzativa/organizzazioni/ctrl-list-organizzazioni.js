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
nivolaApp.controller('ListOrganizzazioniController', ['$mdDialog', '$scope','$rootScope', '$state', "$filter",
		'entitiesRest', 'controllerValidator',  'notificationManager', 'loggers', 'OrganizzazioneRestClient', '$translate',
	function ($mdDialog, $scope,$rootScope, $state, $filter, 
		entitiesRest, controllerValidator, notificationManager, loggers, OrganizzazioneRestClient, $translate) {
	'use strict';

	var logger = loggers.get("listOrganizzazioniController");
	
	var Organizzazione = entitiesRest.getEntity('Organizzazione');

	$scope.organizzazioni = [];
	$scope.selected = [];

	// Proprietà data-table
	$scope.options = {
		rowSelection: true,
		multiSelect: false,
		autoSelect: true,
		decapitate: false,
		largeEditDialog: false,
		boundaryLinks: false,
		limitSelect: true,
		pageSelect: true
	};

	$scope.limitOptions = [ 10, 20 , 30];

	$scope.filter = {
		options: {
			debounce: 500
		}
	};

	$scope.query = {
		order: 'name',
		limit: 10,
		page: 1
	};

	function success(organizzazioni) {
		
		$rootScope.loadingElement=false;
		organizzazioni.forEach(function (value) {
			var orgType = Organizzazione.findTipoCategoriaByKey(value.org_type);
			value.org_type = {
				name : value.org_type,
				descrizione : orgType.name,
				badge_class : orgType.badge_class
			};
			value.partner = {
				flag : value.partner,
				color : value.partner ? 'green': 'red',
				icon : value.partner ? 'mood': 'mood_bad'
			};
			value.stato ={
				flag : value.active,
				color : value.active ? 'green': 'red',
				icon : value.active ? 'check_box' : 'check_box_outline_blank'
			};
		});
		$scope.organizzazioni = organizzazioni;
		$scope.numeroAttive = $filter('filter')(organizzazioni, { active: true }).length;
		$scope.numeroDisattive = $filter('filter')(organizzazioni, { active: false }).length;
	};
	
	function error() {
		
		$rootScope.loadingElement=false;
		notificationManager.showErrorPopup($translate.instant('error.loading_organizzazioni'));
	};

	function getOrganizzazioni() {
		$scope.promise = Organizzazione.query(success, error).$promise;
		setTimeout(() => {
			if(!$scope.promise)
			$rootScope.loadingElement=true;
		}, 1000); 
	};

	$scope.actions = {
		auth : {
			new : $state.get('app.nuovaOrganizzazione').requiredUC,
			delete : $state.get('app.nuovaOrganizzazione').requiredUC,
			modify : $state.get('app.modificaOrganizzazione').requiredUC
		},

		refresh : getOrganizzazioni,
		
		view : function() {
			$state.go('app.visualizzaOrganizzazione',{
				idOrganizzazione:$scope.selected[0].uuid
			});
		},
		
		add : function() { 
			$state.go('app.nuovaOrganizzazione'); 
		},
		
		modify : function() {
			$state.go('app.modificaOrganizzazione',{
				idOrganizzazione : $scope.selected[0].uuid
			});
		},
		
		delete : function(event) {
			var confirm = $mdDialog.confirm()
				.title($translate.instant('organizzazioni.elimina.titolo'))
				.textContent($translate.instant('organizzazioni.elimina.testo'))
				.targetEvent(event)
				.ok($translate.instant('si'))
				.cancel($translate.instant('no'));
			$mdDialog.show(confirm).then(function () {
				OrganizzazioneRestClient.deleteOrganizzazioneUsingDELETE({ id: $scope.selected[0].uuid}, function(data){
					logger.info("SUCCESS", data);
					var datiTesto = {
						name: $scope.selected[0].name
					}
					notificationManager.showSuccessPopup($translate.instant('organizzazioni.elimina.error', datiTesto));
					$scope.aggiornaLista();

				}, function(onfail){
					logger.error("ERROR", onfail);
					if (onfail.data && onfail.data.message) {
						 notificationManager.showErrorPopup($translate.instant('organizzazioni.elimina.error') + ': ' + onfail.data.message);
					}else {
						notificationManager.showErrorPopup($translate.instant('organizzazioni.elimina.error'));
					}


				})

			});
		}
	}

	$scope.resetFilter = function () {
		$scope.filter.show = false;
		$scope.query.filter = '';
	};

	this.onInit = function () {

		getOrganizzazioni();
	};

	this.onExit = function () { };

	controllerValidator.validate(this, $scope);

}]);

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
nivolaApp.controller('ListUtentiAccountsController',
	["$scope", "$state", "$stateParams", "$filter",'loggers', "$mdDialog", "ReadthedocService",
		"entitiesRest", "controllerValidator", "notificationManager",  "AuthenticationService", "AuthLevel", '$translate',
		function ( $scope, $state,$stateParams, $filter, loggers, $mdDialog, ReadthedocService, 
			entitiesRest, controllerValidator, notificationManager, AuthenticationService, AuthLevel, $translate
			) {
		'use strict';

		$scope.rtdUtentiList=ReadthedocService.getUrlFromPath('/utenti').docUrl;

		var logger = loggers.get("ListUtentiAccountsController");
		
		var UtentiAccount = entitiesRest.getEntity('UtentiAccount');      
		
		$scope.account={};
		$scope.utenti=[];
		$scope.selected = [];

		$scope.options={
			isErrorGeneric:false,
			isErrorDettaglio:false,
			isErrorWidget:false,
			isErrorUtenti:false,
			isErrorConsumi:false,
			isDettaglioLoaded:false,
			isUtentiLoaded:false,
			rowSelection: true,
			multiSelect: false,
			autoSelect: true,
			decapitate: false,
			boundaryLinks: false,
			limitSelect: true,
			pageSelect: true,
		};

		


		$scope.limitOptions = [10, 20 , 30];
		$scope.filter = {
			options: {
				debounce: 500
			}
		};
		$scope.query = {
			order: "ruolo",
			limit: 10,
			page: 1
		};

		$scope.unselectAll = function () {
			$scope.selected = [];
		};
		
		$scope.actions = {
			auth: {
				change: $state.get("app.account.change").requiredUC,
				accredit:  AuthLevel.AccountAdminRole
			},
			change: function () {
				$state.go("app.account.change", {
					idAccount:$scope.idAccount
				});
			},
			refresh: function(){
				getDettaglioAccount();
				//loadWidgetVisualizzaAccount();
				getUtentiAccount();
			},
			dettaglioUtente:function(utenteAccount){
				$state.go("app.visualizzaUtente", {
					idUtente:utenteAccount.id
					
				});
			},
			registraUtente:function(){
				$state.go("app.registraUtente");
			},
			navigateToOrganizzazione:function(){
				$state.go("app.visualizzaOrganizzazione", {
					idOrganizzazione:$scope.account.organizzazione.uuid
				});
			},
			navigateToDivisione:function(){
				$state.go("app.divisione.view", {
					idDivisione:$scope.account.divisione.uuid
				});
			},
			AccNewUser:function(){
				$state.go("app.listUtenti.accredit", {
					
				});
			},
			accredit: function (ev) {
				var selected = $scope.selected;

				if ($scope.advancedSearchState) {
					// Evito di selezionare l'elemento (che potrebbe non essere presente) nella data-table
					$scope.selected = [];
					$scope.advancedSearchState = false;
				}

				$mdDialog.show({
					locals: {
						userSelected: selected
					},
					controller: 'DialogAccreditController',
					templateUrl: 'angular/entities/utente/tpl-dialog-accredit-utente.html',
					parent: angular.element(document.body),
					targetEvent: ev,
					clickOutsideToClose: true,
					fullscreen: true	// Only for -xs, -sm breakpoints.
				});
			},
		};
	
		$scope.resetFilter = function () {
			$scope.filter.search = '';
			$scope.query.filter = '';
	
			if ($scope.filter.form.$dirty) {
				$scope.filter.form.$setPristine();
			}
		};

	
	
	
	
		function getUtentiAccount() {
			$scope.account ={};
			$scope.idAccount = AuthenticationService.getUtente().abilitazioneSelezionata.accountUuid; 
			$scope.options.isUtentiLoaded=false;
			if(!$scope.idAccount){
				$scope.options.isErrorGeneric =  true;
				return;
			}
			$scope.promise = UtentiAccount.get({ 'uuid': $scope.idAccount }).$promise;
	
			return $scope.promise.then(function (data) {
				logger.info('SUCCESS', data);
				$scope.utenti = angular.copy(data);
			}, function (onfail) {
				notificationManager.showErrorPopup($translate.instant('error.loading_utenti'));
				logger.info('ERROR', onfail);
			}).finally(function() {
				$scope.options.isUtentiLoaded=true;
			});
		};
	
		
	
	
		this.onInit = function () {
			getUtentiAccount();
		

		};
	
		this.onExit = function () { };
		controllerValidator.validate(this, $scope);
	
	
	}]);

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
nivolaApp.controller('QuoteAccountsController',
	["$scope", "$state", "$stateParams", "$filter", "$mdDialog", "AuthLevel",
		"entitiesRest", "controllerValidator", "notificationManager", 'loggers', "AuthenticationService",
		function ($scope, $state, $stateParams, $filter, $mdDialog, AuthLevel, 
			entitiesRest, controllerValidator, notificationManager, loggers, AuthenticationService) {
			"use strict";

			var logger = loggers.get("QuoteAccountsController");
			var Quote = entitiesRest.getEntity('Quote');  
			$scope.quoteServiziSelezionata=null; 
		
			var abilitazioneSelezionata =AuthenticationService.getUtente().abilitazioneSelezionata;
			
			// Proprietà data-table
			$scope.options = {
				rowSelection: false,
				multiSelect: false,
				autoSelect: false,
				decapitate: false,
				largeEditDialog: false,
				boundaryLinks: false,
				limitSelect: true,
				pageSelect: true
			};

			$scope.limitOptions = [10, 20, 30];

			$scope.filter = {
				options: {
					debounce: 500
				}
			};

			$scope.query = {
				order: "organizzazione_name",
				limit: 10,
				page: 1
			};

			$scope.actions = {
				auth: {
					
				},

				refresh: getQuoteAccount,

			};

			$scope.resetFilter = function () {
				$scope.filter.search = '';
				$scope.query.filter = '';

				if ($scope.filter.form.$dirty) {
					$scope.filter.form.$setPristine();
				}
			};

			$scope.unselectAll = function () {
				$scope.selected = [];
			};

			$scope.tabQuoteSelected = function () {
				switch ($scope.quoteServiziSelezionata) {
					case 'all':
						getQuoteAccount();
					case 'vm':
						quoteCompute();
					break;
					case 'db':
						quoteDbaas();
					break;
					case 'staas':
						quoteVolumes();
					break;
				}
			};

			function quoteDbaas(){
				//getQuoteAccount();
				$scope.quote = $scope.quoteDbaas;
			}
		
			function quoteCompute(){
				//getQuoteAccount();
				$scope.quote = $scope.quoteCompute
			}
		
			function quoteVolumes(){
				//getQuoteAccount();
				$scope.quote = $scope.quoteStaas
			}
		
			

			

			function getQuoteAccount() {
				
				$scope.quoteServiziSelezionata="all"; 
				// tornare alla lista degli account se l'utente fa il refresh della lista attivita e quindi vengono persi gli elementi del $stateparams
				if(!$stateParams.accountName  && abilitazioneSelezionata.userRole===AuthLevel.BOADMIN){
					$state.go("app.account"); 
					return 
				}
			
					$scope.promise = Quote.query({ "uuid" : abilitazioneSelezionata.accountUuid}).$promise;
				
					
					return $scope.promise.then(function (data) {
						logger.info("SUCCESS", data);
						
						$scope.quote=[]; 
						$scope.quoteCompute = [];
						$scope.quoteDbaas = [];
						$scope.quoteStaas = [];
						var qCompute = data.quoteCompute; 
						var qDbaas = data.quoteDb;
						var qStaas = data.quoteStorage; 
						qCompute.forEach(function(value){

							let used= value.valori[0].usato;
							let totale= value.valori[0].limite;
							let percent= Math.floor(used* 100 /totale); 
							if(percent > 70) 
								value.colore= "md-warn md-hue-10"; 
							else value.colore= "md-primary md-hue-10";
		
							value.percent=percent;
							value.used=used;
							value.totale=totale;
							value.servizio="compute"; 
							$scope.quoteCompute.push(value); 
							$scope.quote.push(value); 
						});

						qDbaas.forEach(function(value){

							let used= value.valori[0].usato;
							let totale= value.valori[0].limite;
							let percent= Math.floor(used* 100 /totale); 
							if(percent > 70) 
								value.colore= "md-warn md-hue-10"; 
							else value.colore= "md-primary md-hue-10";
		
							value.percent=percent;
							value.used=used;
							value.totale=totale;
							value.servizio="dbaas";
							$scope.quoteDbaas.push(value);
							$scope.quote.push(value); 
						});

						qStaas.forEach(function(value){

							let used= value.valori[0].usato;
							let totale= value.valori[0].limite;
							let percent= Math.floor(used* 100 /totale); 
							if(percent > 70) 
								value.colore= "md-warn md-hue-10"; 
							else value.colore= "md-primary md-hue-10";
		
							value.percent=percent;
							value.used=used;
							value.totale=totale;
							value.servizio="staas";
							$scope.quoteStaas.push(value); 
							$scope.quote.push(value); 
						});

						
					
					
					}, function (onfail) {
						logger.error("ERROR", onfail);
						if (onfail.data && onfail.data.message) {
								notificationManager.showErrorPopup('Si è verificato un errore durante il caricamento delle quote : ' + onfail.data.message);
						} else {
								notificationManager.showErrorPopup('Si è verificato un errore durante il caricamento delle quote !');
						}
						
					});

					

				}; 

				
				
            

			this.onInit = function () {
				getQuoteAccount(); 
				
			};

			this.onExit = function () { };

			controllerValidator.validate(this, $scope);
		}
	]);

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
nivolaApp.controller('ListiniAccountsController',
	["$scope", "$state", "$stateParams", "$filter", "$mdDialog", "AuthLevel",
		"entitiesRest", "controllerValidator", "notificationManager", 'loggers', "AuthenticationService",
		function ($scope, $state, $stateParams, $filter, $mdDialog, AuthLevel, 
			entitiesRest, controllerValidator, notificationManager, loggers, AuthenticationService) {
			"use strict";

			var logger = loggers.get("ListiniAccountsController");
			var ListiniAccount = entitiesRest.getEntity('ListiniAccount');  
			$scope.quoteServiziSelezionata=null; 
			$scope.dettagliListini = [];
		
			var abilitazioneSelezionata =AuthenticationService.getUtente().abilitazioneSelezionata;
			$scope.nomeAcc = abilitazioneSelezionata.accountName; 
			
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

				refresh: getListinoAccount(),

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

		

		
			

			

			function getListinoAccount() {
				
				// $scope.quoteServiziSelezionata="all"; 
				// // tornare alla lista degli account se l'utente fa il refresh della lista attivita e quindi vengono persi gli elementi del $stateparams
				// if(!$stateParams.accountName  && abilitazioneSelezionata.userRole===AuthLevel.BOADMIN){
				// 	$state.go("app.account"); 
				// 	return 
				// }
			
					$scope.promise = ListiniAccount.get({ "accountId" : abilitazioneSelezionata.accountUuid}).$promise;
				
					
					return $scope.promise.then(function (data) {
						logger.info("SUCCESS", data);
						
						data.elencoDettagli.forEach(dettaglio => {

							$scope.dettagliListini.push(
								{
									servizio: dettaglio.servizio ,
									voce: dettaglio.voce,
									udm: dettaglio.udm,
									qta: dettaglio.qta,
									
									importoAnnuo: dettaglio.elencoPrezzo[0].importoAnnuo
								}
							);
							
							
						});

						$scope.litino = data;
					
					
					
					}, function (onfail) {
						logger.error("ERROR", onfail);
						if (onfail.data && onfail.data.message) {
								notificationManager.showErrorPopup('Si è verificato un errore durante il caricamento dei listini : ' + onfail.data.message);
						} else {
								notificationManager.showErrorPopup('Si è verificato un errore durante il caricamento dei listini !');
						}
						
					});

					

				}; 

				
				
            

			this.onInit = function () {
				getListinoAccount(); 
				
			};

			this.onExit = function () { };

			controllerValidator.validate(this, $scope);
		}
	]);

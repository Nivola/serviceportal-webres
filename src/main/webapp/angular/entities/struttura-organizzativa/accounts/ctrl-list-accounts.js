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
nivolaApp.controller('ListAccountsController',
	["$scope", "$state", "$stateParams", "$filter", "$mdDialog", "$rootScope",
		"entitiesRest", "controllerValidator", "notificationManager", 'loggers', "AuthenticationService", '$translate',
		function ($scope, $state, $stateParams, $filter, $mdDialog, $rootScope,
			entitiesRest, controllerValidator, notificationManager, loggers, AuthenticationService, $translate) {
			"use strict";

			var logger = loggers.get("ListAccountsController");
			var Account = entitiesRest.getEntity('Account');
			var Divisione = entitiesRest.getEntity('Divisione');
			var AttivitaAccount = entitiesRest.getEntity('AttivitaAccount');

			$scope.accounts = [];
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

			$scope.limitOptions = [30, 40, 50];

			$scope.filter = {
				options: {
					debounce: 500
				}
			};

			$scope.query = {
				order: "organizzazione_name",
				limit: 30,
				page: 1
			};

			$scope.actions = {
				auth: {
					new: $state.get("app.account.new").requiredUC,
					delete: $state.get("app.account.new").requiredUC,
					change: $state.get("app.account.change").requiredUC
				},

				refresh: getAccounts,

				view: function () {
					$state.go("app.account.view", {
						idDivisione: $scope.selected[0].id,
						idAccount:$scope.selected[0].uuid
					});
				},

				add: function () {
					$state.go("app.account.new", {
						idDivisione: $stateParams.idDivisione,
					});
				},

				change: function () {
					$state.go("app.account.change", {
						//idDivisione: $scope.selected[0].division_id,
						idAccount:$scope.selected[0].uuid,
					});
				},

				gotoAzioni : function (){

					// getAttivitaAccount(); 	
					// var newArray = $scope.listAttivita.filter(function (el) {
					// 	return el.account == $scope.selected[0].name; // filtro le attivita per tenere solo quelle appartenenti all'account selezionato
					// });

					$state.go("app.attivitaAccount", {
						//ArrayAttivita: newArray, 
						accountName : $scope.selected[0].name
	
					});

					//$scope.listAttivita = newArray; 
					
				},

				delete: function (event) {
					/*	var confirm = $mdDialog
							.confirm()
							.title("Confermi la cancellazione l'organizzazione selezionata?")
							.textContent("L'organizzazione verrà cancellata definitivamente.")
							.targetEvent(event)
							.ok("SI")
							.cancel("NO");
						$mdDialog.show(confirm).then(function() {
							OrganizzazioneRestClient.deleteOrganizzazioneUsingDELETE({ id: $scope.selected[0].id })
								.then(function(data) {
									if (!data && !data.data && data.status != 200) {
										notificationManager.showErrorPopup("Non è stato possibile eliminare l'organizzazione selezionata");
										return;
									}
									notificationManager.showSuccessPopup(
										"l'organizzazione " + $scope.selected[0].name + " è stata eliminata con successo"
									);
									$scope.aggiornaLista();
								})
								.catch(function(data) {
									notificationManager.showErrorPopup(data.body.data);
								});
						});*/
				}
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


			// function getAttivitaAccount() {
			// 	//$scope.listAttivita = mockup; 
			// 	$scope.promise = AttivitaAccount.query().$promise;

            //     return $scope.promise.then(function (data) {
            //         logger.info("SUCCESS", data);
			// 		data.forEach(function (value) {
            //             if (value.parametri) {
			// 				value.parametri=value.parametri.replace(/,/g, " , ");
			// 			}
			// 			if (!value.username) {
			// 				value.username="Non definito";
			// 			}
			// 			if (!value.indirizzoIp) {
			// 				value.indirizzoIp="Non definito";
			// 			}
			// 		});
			// 		$scope.listAttivita = data; 
					
            //     }, function (onfail) {
            //         logger.error("ERROR", onfail);
            //         if (onfail.body) {
            //             if (onfail.body.data && onfail.body.data.message) {
            //                 notificationManager.showErrorPopup('Si è verificato un errore durante il caricamento di attivita: ' + onfail.body.data.message);
            //             } else {
            //                 notificationManager.showErrorPopup('Si è verificato un errore durante il caricamento di attivita!');
            //             }
            //         } else {
            //             notificationManager.showErrorPopup('Si è verificato un errore durante il caricamento di attivita!');
            //         }
            //     });
            // };

			function getAccounts() {
				setTimeout(() => {
						if($scope.promise.$$state.status===0){
							$rootScope.loadingElement = true;
						}
					}, 1000);
				var queryString = {};
				var divUuid = null; 
				// controllo se l'utente puo vedere tutti gli accouns o se puo vedere soltante quelli sotto la sua divisione
				if(AuthenticationService.getUtente()){
					var abilitazioneSelezionata =AuthenticationService.getUtente().abilitazioneSelezionata;
					divUuid = abilitazioneSelezionata.divUuid; 
					if (divUuid && divUuid!==null) {
						queryString.divisionId = divUuid;
						Divisione.get({'id': divUuid}).$promise.then(function(divisione) {
							$scope.divisione = divisione.name;
						});
					}
				}
				if ($stateParams.idDivisione) {
					queryString.divisionId = $stateParams.idDivisione;

					Divisione.get({'id': $stateParams.idDivisione}).$promise.then(function(divisione) {
						$scope.divisione = divisione.name;
					});
				}
				$scope.promise = Account.query(queryString).$promise;

				return $scope.promise.then(function (data) {
					logger.info("SUCCESS", data);
					data.forEach(function (value) {
						value.organizzazione_name = value.organizzazione.name;
						value.divisione_name = value.divisione.name;
						value.stato = {
							flag: value.active,
							color: value.active ? "green" : "red",
							icon: value.active ? "check_box" : "check_box_outline_blank"
						};
					});
					$scope.accounts = data;
					$scope.numeroAttivi = $filter("filter")(data, { active: true }).length;
					$scope.numeroDisattivi = $filter("filter")(data, { active: false }).length;
				}, function (onfail) {
					logger.error("ERROR", onfail);
					if (onfail.body) {
						if (onfail.body.data && onfail.body.data.message) {
							notificationManager.showErrorPopup($translate.instant('error.loading_accounts') + ': ' + onfail.body.data.message);
						} else {
							notificationManager.showErrorPopup($translate.instant('error.loading_accounts'));
						}
					} else {
						notificationManager.showErrorPopup($translate.instant('error.loading_accounts'));
					}
				}).finally(function() {
					console.log('end')
                    $rootScope.loadingElement = false;
					//off()
                });
			};

			this.onInit = function () {
				console.log($scope);

				getAccounts();
				//getAttivitaAccount(); 
			};

			this.onExit = function () { 
				$stateParams.idDivisione=null;
			};

			controllerValidator.validate(this, $scope);
		}
	]);

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
nivolaApp.controller("ListDivisioniController", 
	["$scope",	"$state",	"$stateParams", "$filter", "$mdDialog", "$q",
		"entitiesRest", "controllerValidator", "notificationManager", "loggers", "AuthenticationService", '$translate', 
	function($scope, $state, $stateParams, $filter, $mdDialog, $q,
			entitiesRest, controllerValidator, notificationManager, loggers, AuthenticationService, $translate) {
		"use strict";




	
			



		var logger = loggers.get("listOrganizzazioniController");
		var Organizzazione = entitiesRest.getEntity('Organizzazione');
		var Divisione = entitiesRest.getEntity('Divisione');

		$scope.divisioni = [];
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

		$scope.limitOptions = [10, 20,  30];

		$scope.filter = {
			options: {
				debounce: 500
			}
		};

		$scope.query = {
			order: "organizzazione",
			limit: 10,
			page: 1
		};

		function success(divisioni) {
			divisioni.forEach(function(value) {
				value.organizzazione_name = value.organizzazione.name;
				value.stato = {
					flag: value.active,
					color: value.active ? "green" : "red",
					icon: value.active ? "check_box" : "check_box_outline_blank"
				};
			});
			$scope.divisioni = divisioni;
			$scope.numeroAttive = divisioni.filter(function(div) {return div.active}).length;
			$scope.numeroDisattive = divisioni.length - $scope.numeroAttive;
		}

		function error() {
			notificationManager.showErrorPopup($translate.instant("divisioni.elenco.error"));
		}

		function getDivisioni() {
			var queryString = {};
			var orgUuid= null; 
			// controllo se l'utente puo vedere tutte le divisioni o se puo vedere soltante quelle sotto la sua organisation
			if(AuthenticationService.getUtente()){
				var abilitazioneSelezionata =AuthenticationService.getUtente().abilitazioneSelezionata;
				orgUuid = abilitazioneSelezionata.orgUuid; 
				if (orgUuid && orgUuid!==null) {
					queryString.organizationId = orgUuid;
					Organizzazione.get({'id': orgUuid}).$promise.then(function(organizzazione) {
						$scope.organizzazione = organizzazione;
					});
				}
			}
			
			
			if ($stateParams.idOrganizzazione) {
				queryString.organizationId = $stateParams.idOrganizzazione;
				Organizzazione.get({'id': $stateParams.idOrganizzazione}).$promise.then(function(organizzazione) {
					$scope.organizzazione = organizzazione;
				});
			}
			$scope.promise = Divisione.query(queryString , success, error).$promise;
		};

		$scope.actions = {
			auth: {
				new: $state.get("app.divisione.new").requiredUC,
				delete: $state.get("app.divisione.new").requiredUC,
				modify: $state.get("app.divisione.change").requiredUC
			},

			refresh: getDivisioni,

			gotoAccount: function() {},

			view: function(event) {

				$state.go("app.divisione.view", {
					idDivisione: $scope.selected[0].uuid
				});
			},

			add: function() {
				$state.go("app.divisione.new",{
					idOrganizzazione:$stateParams.idOrganizzazione ? $stateParams.idOrganizzazione :undefined
				});
			},

			modify: function() {
				$state.go("app.divisione.change", {
					idDivisione: $scope.selected[0].uuid,
					idOrganizzazione:$stateParams.idOrganizzazione ? $stateParams.idOrganizzazione :undefined

				});
			},

			delete: function(event) {
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

		$scope.resetFilter = function() {
			$scope.filter.show = false;
			$scope.query.filter = "";
		};

		this.onInit = function() {
			getDivisioni();
		};

		this.onExit = function() {};

		controllerValidator.validate(this, $scope);
	}
]);

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

	.controller('DialogFiltroAccountController', ['$mdDialog', '$timeout', '$scope',
		'AuthenticationService', 'AuthLevel', 'controllerValidator',
		'notificationManager', 'utils', 'StringMap',
		'entitiesRest',  'loggers', '$translate',
		function ($mdDialog, $timeout, $scope,
			AuthenticationService, AuthLevel, controllerValidator,
			notificationManager, utils, StringMap,
			entitiesRest,  loggers, $translate) {
			'use strict';

			var logger = loggers.get("DialogAccreditController");

			
			var Account = entitiesRest.getEntity('Account');
			var Divisione = entitiesRest.getEntity('Divisione');
			var Organizzazione = entitiesRest.getEntity('Organizzazione');
			
		

			$scope.iconStyle = {
				"color": "#4285f4",
			}

			$scope.roleSelected = null;
			$scope.roles = [];
			$scope.firstLevelEntityIcon = null;
			$scope.secondLevelEntityIcon = null;
			$scope.thirdLevelEntityIcon = null;
			$scope.firstLevelEntitySelected = null;
			$scope.secondLevelEntitySelected = null;
			$scope.thirdLevelEntitySelected = null;

			$scope.firstLevelPlaceholder="";
			$scope.secondLevelPlaceholder="";
			$scope.thirdLevelPlaceholder="";
			$scope.firstLevelEntities = [];
			$scope.secondLevelEntities = [];
			$scope.secondLevelEnabled = false;
			$scope.thirdLevelEntities = [];
			$scope.thirdLevelEnabled = false;
			$scope.readyToAccredit = false;

			// Usa un servizio per tradurre le stringhe da visualizzare a video
			$scope.print = StringMap;

			$scope.loadRoles = function () {
				$scope.roles = [];

				return $timeout(function () {
					$scope.roles = getAvailableRoles();
				}, 650);
			};

			$scope.onRoleSelectedChange = function () {
				$scope.firstLevelEntities = [];
				$scope.secondLevelEntities = [];
				$scope.firstLevelEntitySelected = null;
				$scope.isBORoleSelected = false;
				$scope.isOrgRoleSelected = false;
				$scope.isDivRoleSelected = false;
				$scope.isAccountRoleSelected = false;

				$scope.isBORoleSelected = $scope.roleSelected === AuthLevel.BOADMIN;
				$scope.isBORoleSelected |= $scope.roleSelected === AuthLevel.BOMONITORING;

				$scope.isOrgRoleSelected = $scope.roleSelected === AuthLevel.OrgAdminRole;
				$scope.isOrgRoleSelected |= $scope.roleSelected === AuthLevel.OrgViewerRole;
				$scope.isOrgRoleSelected |= $scope.roleSelected === AuthLevel.OrgOperatorRole;

				$scope.isDivRoleSelected = $scope.roleSelected === AuthLevel.DivAdminRole;
				$scope.isDivRoleSelected |= $scope.roleSelected === AuthLevel.DivViewerRole;
				$scope.isDivRoleSelected |= $scope.roleSelected === AuthLevel.DivOperatorRole;

				$scope.isAccountRoleSelected = $scope.roleSelected === AuthLevel.AccountAdminRole;
				$scope.isAccountRoleSelected |= $scope.roleSelected === AuthLevel.AccountViewerRole;
				$scope.isAccountRoleSelected |= $scope.roleSelected === AuthLevel.AccountOperatorRole;

				$scope.firstLevelEntitySelected = null;
				$scope.secondLevelEntitySelected = null;
				$scope.thirdLevelEntitySelected = null;

				setLevelEntityIcons();
				checkForLevelEnabling();
			};

		

			$scope.onFirstLevelEntitySelectedChange = function () {
				$scope.secondLevelEntitySelected = null;
				$scope.thirdLevelEntitySelected = null;

				//checkForLevelEnabling();
			};

			$scope.onSecondLevelEntitySelectedChange = function () {
				$scope.thirdLevelEntitySelected = null;

				//checkForLevelEnabling();
			};

			$scope.onThirdLevelEntitySelectedChange = function () {
				//$scope.thirdLevelEntitySelected = null;

				//checkForLevelEnabling();
			};

			

			//
			// loadEntities
			// riceve come parametro : 'firstLevelEntity', 'secondLevelEntity', 'thirdLevelEntity'.
			//

			$scope.loadOrganisations = function () {
				$scope.promise = Organizzazione.query().$promise;
				return $scope.promise.then(function (data) {
					if (Array.isArray(data)) {
						data = data.map(e => {
							e.nome = e.desc ? e.desc : e.name;
							return e;
						})
						$scope.firstLevelEntities = Array.isArray(data) ? data : [data];
					}
					// se il ruole corrente è master di account , assegno a firstlevelentity i dati dell'account corrente 
					if ($scope.isAgenteAccountAdmin){
						var accountInfo = [{
							nome : data.desc ? data.desc : data.name ,
							uuid: data.uuid
						}]; 
						$scope.firstLevelEntities = accountInfo; 
					}
					
				}, function (onfail) {
					if (onfail.body) {
						if (onfail.body.data && onfail.body.data.message) {
							notificationManager.showErrorPopup($translate.instant('error.loading_entita') + ': ' + onfail.body.data.message);
						} else {
							notificationManager.showErrorPopup($translate.instant('error.loading_entita'));
						}
					} else {
						notificationManager.showErrorPopup($translate.instant('error.loading_entita'));
					}
				});
			}; 


			$scope.loadDivisions = function () {
				$scope.promise = Divisione.query({ organizationId: $scope.firstLevelEntitySelected }).$promise;

				return $scope.promise.then(function (data) {
					if (Array.isArray(data)) {
						data = data.map(e => {
							e.nome = e.desc ? e.desc : e.name;
							return e;
						})
					}
					$scope.secondLevelEntities = Array.isArray(data) ? data : [data];
				}, function (onfail) {
					if (onfail.body) {
						if (onfail.body.data && onfail.body.data.message) {
							notificationManager.showErrorPopup($translate.instant('error.loading_entita') + ': ' + onfail.body.data.message);
						} else {
							notificationManager.showErrorPopup($translate.instant('error.loading_entita'));
						}
					} else {
						notificationManager.showErrorPopup($translate.instant('error.loading_entita'));
					}
				});

			};




			$scope.loadAccounts = function () {
				$scope.promise = Account.query({ divisionId: $scope.secondLevelEntitySelected }).$promise;

				return $scope.promise.then(function (data) {
					if (Array.isArray(data)) {
						data = data.map(e => {
							e.nome = e.desc ? e.desc : e.name;
							return e;
						})
					}
					$scope.thirdLevelEntities = Array.isArray(data) ? data : [data];
				}, function (onfail) {
					if (onfail.body) {
						if (onfail.body.data && onfail.body.data.message) {
							notificationManager.showErrorPopup($translate.instant('error.loading_entita') + ': ' + onfail.body.data.message);
						} else {
							notificationManager.showErrorPopup($translate.instant('error.loading_entita'));
						}
					} else {
						notificationManager.showErrorPopup($translate.instant('error.loading_entita'));
					}
				});

			}; 

			
			


			$scope.impostaAccount = function(){
				$mdDialog.hide({ result: $scope.thirdLevelEntitySelected });
			}; 

			$scope.closeDialog = function () {
				$mdDialog.hide(/*{ result: $scope.thirdLevelEntitySelected }*/);
			};

			function checkForLevelEnabling() {
				if ($scope.isBORoleSelected) {
					$scope.secondLevelEnabled = false;
					$scope.thirdLevelEnabled = false;
					$scope.readyToAccredit = true;
				} else if ($scope.isAccountRoleSelected) {
					if ($scope.firstLevelEntitySelected) {
						// Abilito il secondo livello solo se:
						// 1) il ruolo selezionato per l'utente è definito a livello di Account,
						// 2) è già stato selezionata un'entità di primo livello,
						// 3) e l'agente è un BOADMIN o un Master di Organizzazione
						$scope.secondLevelEnabled = $scope.isAgenteBOAdmin;
						$scope.secondLevelEnabled |= $scope.isAgenteOrgAdmin;

						if ($scope.secondLevelEntitySelected) {
							// Abilito il terzo livello solo se:
							// 1) il ruolo selezionato per l'utente è definito a livello di Account,
							// 2) sono già state selezionate le entità di primo e secondo livello,
							// 3) e l'agente è un BOADMIN
							$scope.thirdLevelEnabled = $scope.isAgenteBOAdmin;

							$scope.readyToAccredit = !$scope.thirdLevelEnabled;
						} else {
							$scope.thirdLevelEnabled = false;
							$scope.readyToAccredit = !$scope.secondLevelEnabled;
						}
					} else {
						$scope.secondLevelEnabled = false;
						$scope.thirdLevelEnabled = false;
						$scope.readyToAccredit = false;
					}
				} else if ($scope.isDivRoleSelected) {
					if ($scope.firstLevelEntitySelected) {
						// Abilito il secondo livello solo se:
						// 1) il ruolo selezionato per l'utente è definito a livello di Divisione,
						// 2) è già stato selezionata un'entità di primo livello,
						// 3) e l'agente è un BOADMIN
						$scope.secondLevelEnabled = $scope.isAgenteBOAdmin;

						if ($scope.secondLevelEntitySelected) {
							$scope.thirdLevelEnabled = false;
							$scope.readyToAccredit = $scope.secondLevelEntitySelected;
						} else {
							$scope.readyToAccredit = !$scope.secondLevelEnabled;
						}
					} else {
						$scope.secondLevelEnabled = false;
						$scope.readyToAccredit = false;
					}
				} else if ($scope.isOrgRoleSelected) {
					$scope.secondLevelEnabled = false;
					$scope.thirdLevelEnabled = false;
					$scope.readyToAccredit = $scope.firstLevelEntitySelected;
				} else {
					notificationManager.showErrorPopup($translate.instant('utente.accredita.ruolo_selezionato_non_valido'));
					return;
				}
			}

			



			this.onInit = function () {
				$scope.isAgenteBOAdmin = AuthenticationService.isGranted(AuthLevel.SUPERADMIN);
				$scope.isAgenteBOAdmin |= AuthenticationService.isGranted(AuthLevel.BOADMIN);
				$scope.isAgenteOrgAdmin = AuthenticationService.isGranted(AuthLevel.OrgAdminRole);
				$scope.isAgenteDivAdmin = AuthenticationService.isGranted(AuthLevel.DivAdminRole);
				$scope.isAgenteAccountAdmin = AuthenticationService.isGranted(AuthLevel.AccountAdminRole);
				var abilitazione = AuthenticationService.getUtente().abilitazioneSelezionata;

				// Recupero Uuid dell'entità di cui l'agente è Master
				if ($scope.isAgenteBOAdmin) {

				} else if ($scope.isAgenteOrgAdmin) {
					$scope.entityUuid = abilitazione.orgUuid;
				} else if ($scope.isAgenteDivAdmin) {
					$scope.entityUuid = abilitazione.divUuid;
				} else if ($scope.isAgenteAccountAdmin) {
					$scope.entityUuid = abilitazione.accountUuid;
					
					

				} else {
					notificationManager.showErrorPopup($translate.instant('utente.accredita.operazione_non_permessa_per_ruolo'));
					return;
				}

			}

			this.onExit = function () { };

			controllerValidator.validate(this, $scope);
		}]);

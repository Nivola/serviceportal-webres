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
"use strict";

angular.module('app')

	.controller('VisualizzaUtenteController', ['$mdDialog', '$scope', '$state', '$stateParams','$timeout','ReadthedocService', 
		'AuthLevel', 'entitiesRest', 'controllerValidator', 
		'notificationManager', "$filter", 'loggers', 'conf','StringMap','AuthenticationService', '$translate',
		function ($mdDialog, $scope, $state, $stateParams, $timeout,ReadthedocService, 
			AuthLevel, entitiesRest, controllerValidator, 
			notificationManager, $filter, loggers, conf,StringMap,AuthenticationService, $translate) {
			'use strict';
		

			$scope.rtdUtentiView=ReadthedocService.getUrlFromPath('/utenti/view').docUrl;
			var Utente = entitiesRest.getEntity('Utente');

			$scope.userDetails = {};

			// Proprietà data-table
			$scope.options = {
				rowSelection: true,
				multiSelect: true,
				autoSelect: true,
				decapitate: false,
				largeEditDialog: false,
				boundaryLinks: false,
				limitSelect: true,
				pageSelect: true,
				isDettaglioLoaded:false,
				showAccreditaUtente:false
			};

			$scope.limitOptions = [10, 20, 30];

			$scope.filter = {
				options: {
					debounce: 500
				}
			};

			$scope.query = {
				order: 'matricolaCsi',
				limit: 10,
				page: 1
			};

			$scope.actions = {
				auth: {
					accredit: [
						AuthLevel.SUPERADMIN,
						AuthLevel.BOADMIN
						/*AuthLevel.BOMONITORING,*/
						//AuthLevel.OrgAdminRole,
						//AuthLevel.DivAdminRole,
						//AuthLevel.AccountAdminRole
					].join(","),
					edit: [
						AuthLevel.SUPERADMIN,
						AuthLevel.BOADMIN,
						//AuthLevel.AccountAdminRole,
						AuthLevel.DivAdminRole
					].join(","),
				},

				refresh: function(){
					getUtente();
					preparaAccreditamento();
				},
				change: function(){
					//$scope.options.showAccreditaUtente =true;
					console.log($scope.idUtente);
					$state.go('app.aggiornaUtente',{
						idUtente: $scope.idUtente,
					});
				}

			}


			//$scope.isAgenteOrgAdmin = AuthenticationService.isGranted(AuthLevel.OrgAdminRole);
			//$scope.isAgenteDivAdmin = AuthenticationService.isGranted(AuthLevel.DivAdminRole);
			//$scope.isAgenteAccountAdmin = AuthenticationService.isGranted(AuthLevel.AccountAdminRole);

			function getUtente() {
				$scope.options.isDettaglioLoaded=false;
				$scope.idUtente = $stateParams.idUtente;
				$scope.promise = Utente.get({ id: $scope.idUtente }).$promise;

				$scope.promise.then(function (userDto) {
					$scope.userDetails = angular.copy(userDto);
					
					// filtra le abilitazioni per mostrare solo quelle della struttura selezionata 
					var abilitazione = AuthenticationService.getUtente().abilitazioneSelezionata;
					AuthLevel.BOADMIN;
					if((abilitazione.userRole==AuthLevel.OrgAdminRole)){
						$scope.userDetails.elencoAbilitazioni = userDto.elencoAbilitazioni.filter(function(item){
							return item.orgUuid == abilitazione.orgUuid;         
						})
					}

					if((abilitazione.userRole==AuthLevel.DivAdminRole)){
						$scope.userDetails.elencoAbilitazioni = userDto.elencoAbilitazioni.filter(function(item){
							return item.divUuid == abilitazione.divUuid;         
						})
					}

					if((abilitazione.userRole==AuthLevel.AccountAdminRole)){
						$scope.userDetails.elencoAbilitazioni = userDto.elencoAbilitazioni.filter(function(item){
							return item.accountUuid == abilitazione.accountUuid;         
						})
					}

					
					let blankImage = conf.siteContext + "/img/utente-blank.svg"
					$scope.userDetails.imageUrl = $scope.userDetails.imageUrl || blankImage;
					$scope.userDetails.dataCreazione = formatDate(new Date($scope.userDetails.dataCreazione));
					$scope.uuidUtente = userDto.uuidUtente;

				}, function (onfail) {
					if (onfail.body) {
						if (onfail.body.data && onfail.body.data.message) {
							notificationManager.showErrorPopup('Si è verificato un errore durante il caricamento delle informazioni dell\'utente: ' + onfail.body.data.message);
						} else {
							notificationManager.showErrorPopup('Si è verificato un errore durante il caricamento delle informazioni dell\'utente!');
						}
					} else {
						notificationManager.showErrorPopup('Si è verificato un errore durante il caricamento delle informazioni dell\'utente!');
					}
					return;
				}).finally(function() {
					$scope.options.isDettaglioLoaded=true;
				});


				function formatDate(d) {
					let month = String(d.getMonth() + 1);
					let day = String(d.getDate());
					const year = String(d.getFullYear());

					if (month.length < 2) month = '0' + month;
					if (day.length < 2) day = '0' + day;

					return `${day}-${month}-${year}`;
				}
			};

			// parte mergata da ctrl dialog accredit accreditamento
			var Account = entitiesRest.getEntity('Account');
			var Divisione = entitiesRest.getEntity('Divisione');
			var Organizzazione = entitiesRest.getEntity('Organizzazione');

			var AccreditamentoBackoffice = entitiesRest.getEntity('AccreditamentoBackoffice');
			var AccreditamentoAccount = entitiesRest.getEntity('AccreditamentoAccount');
			var AccreditamentoDivisione = entitiesRest.getEntity('AccreditamentoDivisione');
			var AccreditamentoOrganizzazione = entitiesRest.getEntity('AccreditamentoOrganizzazione');

			// TODO: DA MODIFICARE LATO BACK-END!!!
			var AccreditamentoAccount_TOBECHANGED = entitiesRest.getEntity('AccreditamentoAccount_TOBECHANGED');
			var AccreditamentoDivisione_TOBECHANGED = entitiesRest.getEntity('AccreditamentoDivisione_TOBECHANGED');
			var AccreditamentoOrganizzazione_TOBECHANGED = entitiesRest.getEntity('AccreditamentoOrganizzazione_TOBECHANGED');

			var icone = {
				backoffice: "settings_system_daydream",
				organizzazione: "account_balance",
				divisione: "group_work",
				account: "account_circle"
			};

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
			$scope.firstLevelEntities = [];
			$scope.secondLevelEntities = [];
			$scope.secondLevelEnabled = false;
			$scope.thirdLevelEntities = [];
			$scope.thirdLevelEnabled = false;
			$scope.readyToAccredit = false;
			$scope.selected = [];

			// Usa un servizio per tradurre le stringhe da visualizzare a video
			$scope.print = StringMap;

			$scope.loadRoles = function () {
				$scope.roles = [];

				// return $timeout(function () {
					$scope.roles = getAvailableRoles();
				// }, 450);
			};


			$scope.onRoleSelectedChange = function () {
				$scope.firstLevelEntities = [];
				$scope.secondLevelEntities = [];
				$scope.firstLevelEntitySelected = null;
				$scope.isBORoleSelected = false;
				$scope.isOrgRoleSelected = false;
				$scope.isDivRoleSelected = false;
				$scope.isAccountRoleSelected = false;
				$scope.secondLevelEntitySelected = null;
				$scope.thirdLevelEntitySelected = null;

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

		
			function setLevelEntityIcons() {
				if ($scope.isBORoleSelected) {
					$scope.firstLevelEntityIcon = icone.backoffice;
					$scope.secondLevelEntityIcon = null;
					$scope.thirdLevelEntityIcon = null;
				} else if ($scope.isOrgRoleSelected) {
					$scope.firstLevelEntityIcon = icone.organizzazione;
					$scope.secondLevelEntityIcon = null;
					$scope.thirdLevelEntityIcon = null;

					$scope.firstLevelPlaceholder=$translate.instant('utente.seleziona_organizzazione');
				} else if ($scope.isDivRoleSelected) {
					if ($scope.isAgenteBOAdmin) {
						$scope.firstLevelEntityIcon = icone.organizzazione;
						$scope.secondLevelEntityIcon = icone.divisione;
						$scope.thirdLevelEntityIcon = null;

						$scope.firstLevelPlaceholder=$translate.instant('utente.seleziona_organizzazione');
						$scope.secondLevelPlaceholder=$translate.instant('utente.seleziona_divisione');
					} else {
						$scope.firstLevelEntityIcon = icone.divisione;
						$scope.secondLevelEntityIcon = null;
						$scope.thirdLevelEntityIcon = null;

						$scope.firstLevelPlaceholder=$translate.instant('utente.seleziona_divisione');
					}
				} else if ($scope.isAccountRoleSelected) {
					if ($scope.isAgenteBOAdmin) {
						$scope.firstLevelEntityIcon = icone.organizzazione;
						$scope.secondLevelEntityIcon = icone.divisione;
						$scope.thirdLevelEntityIcon = icone.account;

						$scope.firstLevelPlaceholder=$translate.instant('utente.seleziona_organizzazione');
						$scope.secondLevelPlaceholder=$translate.instant('utente.seleziona_divisione');
						$scope.thirdLevelPlaceholder=$translate.instant('utente.seleziona_account');
					} else if ($scope.isAgenteOrgAdmin) {
						$scope.firstLevelEntityIcon = icone.divisione;
						$scope.secondLevelEntityIcon = icone.account;
						$scope.thirdLevelEntityIcon = null;

						$scope.firstLevelPlaceholder=$translate.instant('utente.seleziona_divisione');
						$scope.secondLevelPlaceholder=$translate.instant('utente.seleziona_account');
					} else {
						$scope.firstLevelEntityIcon = icone.account;
						$scope.secondLevelEntityIcon = null;
						$scope.thirdLevelEntityIcon = null;

						$scope.firstLevelPlaceholder=$translate.instant('utente.seleziona_account');
					}
				} else {
					notificationManager.showErrorPopup($translate.instant('utente.ruolo_corrente_non_valido'));
					return;
				}
			}


			$scope.onFirstLevelEntitySelectedChange = function () {
				$scope.secondLevelEntitySelected = null;
				$scope.thirdLevelEntitySelected = null;

				checkForLevelEnabling();
			};

			$scope.onSecondLevelEntitySelectedChange = function () {
				$scope.thirdLevelEntitySelected = null;

				checkForLevelEnabling();
			};

			$scope.loadEntities = function (entity) {

				if ($scope.isOrgRoleSelected) {
					// Organizzazioni
					if (entity === "firstLevelEntity") {
						$scope.firstLevelEntities = [];

						if ($scope.isAgenteBOAdmin) {
							// Carica tutte le organizzazioni
							$scope.promise = Organizzazione.query().$promise;
						} else if ($scope.isAgenteOrgAdmin) {
							// Carica la sola organizzazione dell'agente
							$scope.promise = Organizzazione.get({ id: $scope.entityUuid }).$promise;
						} else {
							notificationManager.showErrorPopup($translate.instant('utente.operazione_non_permessa_per_ruolo'));
							return;
						}

						return $scope.promise.then(function (data) {
							if (Array.isArray(data)) {
								data = data.map(e => {
									e.nome = e.desc ? e.desc : e.name;
									return e;
								})
							}
							$scope.firstLevelEntities = Array.isArray(data) ? data : [data];
						}, function (onfail) {
							if (onfail.body) {
								if (onfail.body.data && onfail.body.data.message) {
									notificationManager.showErrorPopup($translate.instant('error.loading_entita') + ' ' + onfail.body.data.message);
								} else {
									notificationManager.showErrorPopup($translate.instant('error.loading_entita'));
								}
							} else {
								notificationManager.showErrorPopup($translate.instant('error.loading_entita'));
							}
						});
					} else {
						notificationManager.showErrorPopup('Livello non valido!');
						return;
					}
				} else if ($scope.isDivRoleSelected) {
					if (entity === "firstLevelEntity") {
						$scope.firstLevelEntities = [];

						if ($scope.isAgenteBOAdmin) {
							// Carica tutte le organizzazioni
							$scope.promise = Organizzazione.query().$promise;
						} else if ($scope.isAgenteOrgAdmin) {
							// Carico tutte le divisioni appartenenti all'organizzazione dell'agente
							$scope.promise = Divisione.query({ organizationId: $scope.entityUuid }).$promise;
						} else if ($scope.isAgenteDivAdmin) {
							// Carico la sola divisione dell'agente
							$scope.promise = Divisione.get({ id: $scope.entityUuid }).$promise;
						} else {
							notificationManager.showErrorPopup('Operazione non permessa per ruolo corrente!');
							return;
						}

						return $scope.promise.then(function (data) {
							if (Array.isArray(data)) {
								data = data.map(e => {
									e.nome = e.desc ? e.desc : e.name;
									return e;
								})
							}
							$scope.firstLevelEntities = Array.isArray(data) ? data : [data];
						}, function (onfail) {
							if (onfail.body) {
								if (onfail.body.data && onfail.body.data.message) {
									notificationManager.showErrorPopup($translate.instant('error.loading_entita') + ' ' + onfail.body.data.message);
								} else {
									notificationManager.showErrorPopup($translate.instant('error.loading_entita'));
								}
							} else {
								notificationManager.showErrorPopup($translate.instant('error.loading_entita'));
							}
						});
					} else if (entity === "secondLevelEntity") {
						$scope.secondLevelEntities = [];

						if ($scope.isAgenteBOAdmin) {
							// Carico tutte le divisioni appartenenti all'organizzazione selezionata dall'agente
							$scope.promise = Divisione.query({ organizationId: $scope.firstLevelEntitySelected }).$promise;
						} else {
							notificationManager.showErrorPopup('Operazione non permessa per ruolo corrente!');
							return;
						}

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
									notificationManager.showErrorPopup($translate.instant('error.loading_entita') + ' ' + onfail.body.data.message);
								} else {
									notificationManager.showErrorPopup($translate.instant('error.loading_entita'));
								}
							} else {
								notificationManager.showErrorPopup($translate.instant('error.loading_entita'));
							}
						});
					} else {
						notificationManager.showErrorPopup('Livello non valido!');
						return;
					}
				} else if ($scope.isAccountRoleSelected) {
					if (entity === "firstLevelEntity") {
						$scope.firstLevelEntities = [];

						if ($scope.isAgenteBOAdmin) {
							// Carica tutte le organizzazioni
							$scope.promise = Organizzazione.query().$promise;
						} else if ($scope.isAgenteOrgAdmin) {
							// Carico tutte le divisioni appartenenti all'organizzazione dell'agente
							$scope.promise = Divisione.query({ organizationId: $scope.entityUuid }).$promise;
						} else if ($scope.isAgenteDivAdmin) {
							// Carico tutti gli account appartenenti alla divisione dell'agente
							$scope.promise = Account.query({ divisionId: $scope.entityUuid }).$promise;
						} else if ($scope.isAgenteAccountAdmin) {
							// Carica il solo account dell'agente
							$scope.promise = Account.get({ id: $scope.entityUuid }).$promise;
						} else {
							notificationManager.showErrorPopup('Operazione non permessa per ruolo corrente!');
							return;
						}

						return $scope.promise.then(function (data) {
							if (Array.isArray(data)) {
								data = data.map(e => {
									e.nome = e.desc ? e.desc : e.name;
									return e;
								})
							}
							$scope.firstLevelEntities = Array.isArray(data) ? data : [data];
						}, function (onfail) {
							if (onfail.body) {
								if (onfail.body.data && onfail.body.data.message) {
									notificationManager.showErrorPopup($translate.instant('error.loading_entita') + ' ' + onfail.body.data.message);
								} else {
									notificationManager.showErrorPopup($translate.instant('error.loading_entita'));
								}
							} else {
								notificationManager.showErrorPopup($translate.instant('error.loading_entita'));
							}
						});
					} else if (entity === "secondLevelEntity") {
						$scope.secondLevelEntities = [];

						if ($scope.isAgenteBOAdmin) {
							// Carico tutte le divisioni appartenenti all'organizzazione selezionata dall'agente
							$scope.promise = Divisione.query({ organizationId: $scope.firstLevelEntitySelected }).$promise;
						} else if ($scope.isAgenteOrgAdmin) {
							// Carico tutti gli account appartenenti alla divisione selezionata dall'agente
							$scope.promise = Account.query({ divisionId: $scope.firstLevelEntitySelected }).$promise;
						} else {
							notificationManager.showErrorPopup('Operazione non permessa per ruolo corrente!');
							return;
						}

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
									notificationManager.showErrorPopup($translate.instant('error.loading_entita') + ' ' + onfail.body.data.message);
								} else {
									notificationManager.showErrorPopup($translate.instant('error.loading_entita'));
								}
							} else {
								notificationManager.showErrorPopup($translate.instant('error.loading_entita'));
							}
						});
					} else if (entity === "thirdLevelEntity") {
						if ($scope.isAgenteBOAdmin) {
							// Carico tutti gli account appartenenti alla divisione selezionata dall'agente
							$scope.promise = Account.query({ divisionId: $scope.secondLevelEntitySelected }).$promise;
						} else {
							notificationManager.showErrorPopup('Operazione non permessa per ruolo corrente!');
							return;
						}

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
									notificationManager.showErrorPopup($translate.instant('error.loading_entita') + ' ' + onfail.body.data.message);
								} else {
									notificationManager.showErrorPopup($translate.instant('error.loading_entita'));
								}
							} else {
								notificationManager.showErrorPopup($translate.instant('error.loading_entita'));
							}
						});
					} else {
						notificationManager.showErrorPopup('Livello non valido!');
						return;
					}
				} else {
					notificationManager.showErrorPopup('Operazione non permessa per ruolo corrente!');
					return;
				}
			};

			$scope.accreditaUtente = function () {
				try {
					var uuidEntity;
					var role;

					var isAdminRoleSelected = $scope.roleSelected === AuthLevel.OrgAdminRole;
					isAdminRoleSelected |= $scope.roleSelected === AuthLevel.DivAdminRole;
					isAdminRoleSelected |= $scope.roleSelected === AuthLevel.AccountAdminRole;

					var isOperatorRoleSelected = $scope.roleSelected === AuthLevel.OrgOperatorRole;
					isOperatorRoleSelected |= $scope.roleSelected === AuthLevel.DivOperatorRole;
					isOperatorRoleSelected |= $scope.roleSelected === AuthLevel.AccountOperatorRole;

					var isViewerRoleSelected = $scope.roleSelected === AuthLevel.OrgViewerRole;
					isViewerRoleSelected |= $scope.roleSelected === AuthLevel.DivViewerRole;
					isViewerRoleSelected |= $scope.roleSelected === AuthLevel.AccountViewerRole;

					// Recupero ruolo
					if ($scope.isBORoleSelected) {
						role = $scope.roleSelected;
					} else if (isAdminRoleSelected) {
						role = "master";
					} else if (isOperatorRoleSelected) {
						role = "operator";
					} else if (isViewerRoleSelected) {
						role = "viewer";
					} else {
						notificationManager.showErrorPopup('Ruolo selezionato non valido!');
						return;
					}

					// Recupero uuidEntity
					if ($scope.thirdLevelEnabled) {
						uuidEntity = $scope.thirdLevelEntitySelected;
					} else if ($scope.secondLevelEnabled) {
						uuidEntity = $scope.secondLevelEntitySelected;
					} else {
						uuidEntity = $scope.firstLevelEntitySelected;
					}

					if ($scope.isBORoleSelected) {
						// Crea accreditamento su Backoffice
						$scope.promise = AccreditamentoBackoffice.save({ uuidUtente: $scope.idUtente, ruolo: role }).$promise;
					} else if ($scope.isAccountRoleSelected) {
						// Crea accreditamento su Account
						$scope.promise = AccreditamentoAccount_TOBECHANGED.save({ uuidAssegnazione: uuidEntity, uuidUtente: $scope.uuidUtente, ruolo: role }).$promise;
					} else if ($scope.isDivRoleSelected) {
						// Crea accreditamento su Divisione
						$scope.promise = AccreditamentoDivisione_TOBECHANGED.save({ uuidAssegnazione: uuidEntity, uuidUtente: $scope.uuidUtente, ruolo: role }).$promise;
					} else if ($scope.isOrgRoleSelected) {
						// Crea accreditamento su Organizzazione
						$scope.promise = AccreditamentoOrganizzazione_TOBECHANGED.save({ uuidAssegnazione: uuidEntity, uuidUtente: $scope.uuidUtente, ruolo: role }).$promise;
					} else {
						notificationManager.showErrorPopup('Ruolo selezionato non valido!');
						return;
					}

					return $scope.promise.then(function (data) {
						notificationManager.showSuccessPopup($translate.instant('utente.accredita.success'));
						// Aggiorna lista abilitazioni
						Utente.get({ id: $scope.userDetails.id },
							function (userDto) {
								// Recupera elenco abilitazioni aggiornata
								$scope.userDetails.elencoAbilitazioni = userDto.elencoAbilitazioni;
							}, function (onfail) {
								if (onfail.body) {
									if (onfail.body.data && onfail.body.data.message) {
										notificationManager.showErrorPopup($translate.instant('error.loading_entita') + ' ' + onfail.body.data.message);
									} else {
										notificationManager.showErrorPopup($translate.instant('error.loading_entita'));
									}
								} else {
									notificationManager.showErrorPopup($translate.instant('error.loading_entita'));
								}
							});
					}, function (onfail) {
						if (onfail.body) {
							if (onfail.body.data && onfail.body.data.message) {
								notificationManager.showErrorPopup($translate.instant('utente.accredita.error') + ': ' + onfail.body.data.message);
							} else {
								notificationManager.showErrorPopup($translate.instant('utente.accredita.error'));
							}
						} else {
							notificationManager.showErrorPopup($translate.instant('utente.accredita.error'));
						}
					});
				} finally {
					// utils.hideSpinnerOverlay();
					
				}
			};

			$scope.revocaEnabled = function (accreditamento) {
				var revocaEnabled = false;

				// NOTE: l'ogetto accreditamento ha le seguenti caratteristiche:
				// 	- se fa riferimento ad un permesso a livello di Account, avrà:
				//		> orgUuid valorizzato
				//		> divUuid valorizzato
				//		> accountUuid valorizzato
				// 	- se fa riferimento ad un permesso a livello di Divisione, avrà:
				//		> orgUuid valorizzato
				//		> divUuid valorizzato
				//		> accountUuid non valorizzato
				// 	- se fa riferimento ad un permesso a livello di Organizzazione, avrà:
				//		> orgUuid valorizzato
				//		> divUuid non valorizzato
				//		> accountUuid non valorizzato				

				// Abilito la revoca a livello di Account se:
				// l'agente è un BOAdmin;
				// l'agente è un Master di Organizzazione
				// e l'account dell'accreditamento appartiene all'organizzazione dell'agente;
				// l'agente è un Master di Divisione
				// e l'account dell'accreditamento appartiene alla divisione dell'agente;
				// l'agente è un Master di Account
				// e l'account dell'accreditamento è l'account dell'agente.

				// Abilito la revoca a livello di Divisione se:
				// l'agente è un BOAdmin;
				// l'agente è un Master di Organizzazione
				// e la divisione dell'accreditamento appartiene all'organizzazione dell'agente;
				// l'agente è un Master di Divisione
				// e l'account dell'accreditamento è l'account dell'agente.

				// Abilito la revoca a livello di Organizzazione se:
				// l'agente è un BOAdmin;
				// l'agente è un Master di Organizzazione
				// e l'organizzazione dell'accreditamento è l'account dell'agente.

				// Abilito la revoca a livello di Backoffice se:
				// l'agente è un BOAdmin.

				if ($scope.isAgenteBOAdmin) {
					revocaEnabled = true;
				} else {
					var isBORole = accreditamento.userRole === AuthLevel.BOADMIN;
					isBORole |= accreditamento.userRole === AuthLevel.BOMONITORING;

					if (isBORole) {
						revocaEnabled = false;
					} else if ($scope.isAgenteOrgAdmin) {
						revocaEnabled = accreditamento.orgUuid && accreditamento.orgUuid === $scope.entityUuid;
					} else if ($scope.isAgenteDivAdmin) {
						revocaEnabled = accreditamento.divUuid && accreditamento.divUuid === $scope.entityUuid;
					} else if ($scope.isAgenteAccountAdmin) {
						revocaEnabled = accreditamento.accountUuid && accreditamento.accountUuid === $scope.entityUuid;
					} else {
						notificationManager.showErrorPopup($translate.instant('utente.accredita.operazione_non_permessa_per_ruolo'));
						revocaEnabled = false;
					}
				}

				return revocaEnabled;
			}

			$scope.revocaAccreditamento = function (accreditamento) {
				try {
					var role;

					if (!$scope.revocaEnabled(accreditamento)) {
						notificationManager.showErrorPopup($translate.instant('utente.accredita.operazione_non_permessa'));
						return;
					}


					var isBORole = accreditamento.userRole === AuthLevel.BOADMIN;
					isBORole |= accreditamento.userRole === AuthLevel.BOMONITORING;

					var isAdminRole = accreditamento.userRole === AuthLevel.OrgAdminRole;
					isAdminRole |= accreditamento.userRole === AuthLevel.DivAdminRole;
					isAdminRole |= accreditamento.userRole === AuthLevel.AccountAdminRole;

					var isOperatorRole = accreditamento.userRole === AuthLevel.OrgOperatorRole;
					isOperatorRole |= accreditamento.userRole === AuthLevel.DivOperatorRole;
					isOperatorRole |= accreditamento.userRole === AuthLevel.AccountOperatorRole;

					var isViewerRole = accreditamento.userRole === AuthLevel.OrgViewerRole;
					isViewerRole |= accreditamento.userRole === AuthLevel.DivViewerRole;
					isViewerRole |= accreditamento.userRole === AuthLevel.AccountViewerRole;

					// Recupero ruolo
					if (isBORole) {
						role = accreditamento.userRole;
					} else if (isAdminRole) {
						role = "master";
					} else if (isOperatorRole) {
						role = "operator";
					} else if (isViewerRole) {
						role = "viewer";
					} else {
						notificationManager.showErrorPopup($translate.instant('utente.accredita.ruolo_selezionato_non_valido'));
						return;
					}

					// NOTE: è necessario mantenere il seguente ordine per il controllo
					if (isBORole) {
						// Revoca su Backoffice
						$scope.promise = AccreditamentoBackoffice.delete({ uuidUtente: $scope.uuidUtente, id: role }).$promise;
					} else if (accreditamento.accountUuid) {
						// Revoca su Account
						$scope.promise = AccreditamentoAccount.delete({ uuidEntity: accreditamento.accountUuid, uuidUtente: $scope.uuidUtente, id: role }).$promise;
					} else if (accreditamento.divUuid) {
						// Revoca su Divisione
						$scope.promise = AccreditamentoDivisione.delete({ uuidEntity: accreditamento.divUuid, uuidUtente: $scope.uuidUtente, id: role }).$promise;
					} else if (accreditamento.orgUuid) {
						// Revoca su Organizzazione
						$scope.promise = AccreditamentoOrganizzazione.delete({ uuidEntity: accreditamento.orgUuid, uuidUtente: $scope.uuidUtente, id: role }).$promise;
					} else {
						notificationManager.showErrorPopup($translate.instant('utente.accredita.ruolo_selezionato_non_valido'));
						return;
					}

					return $scope.promise.then(function (data) {
						notificationManager.showSuccessPopup($translate.instant('utente.accredita.revoca_success'));
						// Aggiorna lista permessi
						Utente.get({ id: $scope.userDetails.id },
							function (userDto) {
								// Recupera elenco abilitazioni aggiornata
								$scope.userDetails.elencoAbilitazioni = userDto.elencoAbilitazioni;
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
					}, function (onfail) {
						if (onfail.body) {
							if (onfail.body.data && onfail.body.data.message) {
								notificationManager.showErrorPopup($translate.instant('utente.accredita.revoca_error') + ': ' + onfail.body.data.message);
							} else {
								notificationManager.showErrorPopup($translate.instant('utente.accredita.revoca_error'));
							}
						} else {
							notificationManager.showErrorPopup($translate.instant('utente.accredita.revoca_error'));
						}
					});

				} finally {}
			}

			$scope.closeDialog = function () {
				$mdDialog.hide();
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


			function getAvailableRoles() {
				var availableRoles = [AuthLevel.AccountAdminRole, AuthLevel.AccountViewerRole /*, AuthLevel.AccountOperatorRole*/];
				if ($scope.isAgenteAccountAdmin) {
					return availableRoles;
				}

				availableRoles.unshift(AuthLevel.DivAdminRole/*, AuthLevel.DivViewerRole, AuthLevel.DivOperatorRole*/);
				if ($scope.isAgenteDivAdmin) {
					return availableRoles;
				}

				availableRoles.unshift(AuthLevel.OrgAdminRole/*, AuthLevel.OrgViewerRole, AuthLevel.OrgOperatorRole*/);
				if ($scope.isAgenteOrgAdmin) {
					return availableRoles;
				}

				availableRoles.unshift(AuthLevel.BOADMIN, AuthLevel.BOMONITORING);
				if (!$scope.isAgenteBOAdmin) {
					notificationManager.showErrorPopup($translate.instant('utente.accredita.operazione_non_permessa_per_ruolo'));
					return [];
				}

				return availableRoles;
			}

			function preparaAccreditamento(){
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

				// Recupera ruoli disponibili
				$scope.roles = getAvailableRoles();

			}
			// fine parte mergata 






			this.onInit = function () {
				//carico dettaglio utente
				getUtente();
				preparaAccreditamento();
			};

			this.onExit = function () { };

			controllerValidator.validate(this, $scope);

		}]);

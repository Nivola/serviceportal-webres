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

angular.module('app').controller('RegistraAccreditaUtenteOrgController', [
	'$rootScope', '$scope', '$state', '$stateParams', '$timeout', 'AuthLevel', 'ReadthedocService',
	'controllerValidator', 'loggers', 'notificationManager', 'StringMap', 
	'entitiesRest', "utils", "$mdDialog", "AuthenticationService", '$translate',
	function ($rootScope ,$scope, $state,$stateParams, $timeout, AuthLevel, ReadthedocService, 
		controllerValidator, loggers, notificationManager,StringMap,
		entitiesRest, utils, $mdDialog,AuthenticationService, $translate) {
		'use strict';

		$scope.rtdUtentiAcc=ReadthedocService.getUrlFromPath('/utenti/acc').docUrl;
		var logger = loggers.get("RegistraAccreditaUtenteOrgController");

		var Utente = entitiesRest.getEntity('Utente');
		var Account = entitiesRest.getEntity('Account');
		var Divisione = entitiesRest.getEntity('Divisione');
		var Organizzazione = entitiesRest.getEntity('Organizzazione');

		var AccreditamentoBackoffice = entitiesRest.getEntity('AccreditamentoBackoffice');
		var AccreditamentoAccount = entitiesRest.getEntity('AccreditamentoAccount');
		var AccreditamentoDivisione = entitiesRest.getEntity('AccreditamentoDivisione');
		var AccreditamentoOrganizzazione = entitiesRest.getEntity('AccreditamentoOrganizzazione');
		var AccreditamentoNewUtente = entitiesRest.getEntity('AccreditamentoNewUtente');

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

		$scope.actions = {
			
			controlla: function () {
				if ($scope.utenteInserimento.codiceFiscale) {
					$scope.disabledform= false ; 
					resetInserted(); 
					$scope.uuidUtente = null;
					Utente.get({ "cf": $scope.utenteInserimento.codiceFiscale },
						function (data) {
							logger.info("SUCCESS", data);
							if (!utils.isEmpty(data) && data.hasOwnProperty("id")) {	// WORKAROUND: fino a che il backend non restituisce 404
								notificationManager.showSuccessPopup($translate.instant('utente.codice_fiscale_duplicated'));
								$scope.utenteInserimento.nome = data.firstName;
								$scope.utenteInserimento.cognome = data.lastName;
								$scope.utenteInserimento.email = data.email;
								$scope.utenteInserimento.matricolaCsi= data.matricolaCsi; 
								$scope.userDetails  = data ; 
								getAccreditamentiUtente(data.id);
								
								
								$scope.disabledform= true ; 
								$scope.userForm.cf.$setValidity("cfAllowed", true);
							} else {
								$scope.userForm.cf.$setValidity("cfAllowed", true); // TODO
								
							}
						}, function (onfail) {
							logger.error("ERROR", onfail);
						});
				}
			}
		};

		function getAccreditamentiUtente( idUser) {
		

			Utente.get({ id: idUser },
				function (userDto) {
				
					$scope.elencoAbilitazioni = userDto.elencoAbilitazioni;
					$scope.uuidUtente = userDto.uuidUtente;
					
				
					
				}, function (onfail) {
					if (onfail.body) {
						if (onfail.body.data && onfail.body.data.message) {
							notificationManager.showErrorPopup($translate.instant('error.loading_utente') + ' ' + onfail.body.data.message);
						} else {
							notificationManager.showErrorPopup($translate.instant('error.loading_utente'));
						}
					} else {
						notificationManager.showErrorPopup($translate.instant('error.loading_utente'));
					}
				});
		}
	

		function resetInserted(){
			$scope.utenteInserimento.nome = null;
			$scope.utenteInserimento.cognome =null;
			$scope.utenteInserimento.email = null;
			$scope.utenteInserimento.matricolaCsi=null; 
		}

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

					$scope.firstLevelPlaceholder=$translate.instant('utente.seleziona_organizzazione');;
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
				notificationManager.showErrorPopup($translate.instant('utente.seleziona_account'));
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

		//
		// loadEntities
		// riceve come parametro : 'firstLevelEntity', 'secondLevelEntity', 'thirdLevelEntity'.
		//
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
				var struttOganizzativa;


				logger.debug('accreditaUtente', $scope.utenteInserimento);

				var codiceFiscale = $scope.utenteInserimento.codiceFiscale;
				if (!codiceFiscale || typeof codiceFiscale !== 'string' || (codiceFiscale.trim && codiceFiscale.trim() === '')) {
					notificationManager.showErrorPopup('Il codice fiscale è obbligatorio.');
					return;
				}

				if (!$scope.userForm.cf.$valid) {
					notificationManager.showErrorPopup($translate.instant('utente.codice_fiscale_duplicated'));
					return;
				}

				var nome = $scope.utenteInserimento.nome;
				if (!nome || typeof nome !== 'string' || (nome.trim && nome.trim() === '')) {
					notificationManager.showErrorPopup('Il nome è obbligatorio.');
					return;
				}

				var cognome = $scope.utenteInserimento.cognome;
				if (!cognome || typeof cognome !== 'string' || (cognome.trim && cognome.trim() === '')) {
					notificationManager.showErrorPopup('Il cognome è obbligatorio.');
					return;
				}

				var email = $scope.utenteInserimento.email;
				if (!email || typeof email !== 'string' || (email.trim && email.trim() === '')) {
					notificationManager.showErrorPopup('L\'email è obbligatorio.');
					return;
				}

				if (!$scope.userForm.$valid) {
					notificationManager.showErrorPopup('Campi non validi');
					return;
				}

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
				if (isAdminRoleSelected) {
					role = "master";
				} else if (isOperatorRoleSelected) {
					role = "operator";
				} else if (isViewerRoleSelected) {
					role = "viewer";
				} else {
					notificationManager.showErrorPopup('Ruolo selezionato non valido!');
					return;
				}


				//Recupero uuidEntity
				if ($scope.thirdLevelEnabled) {
					uuidEntity = $scope.thirdLevelEntitySelected;
				} else if ($scope.secondLevelEnabled) {
					uuidEntity = $scope.secondLevelEntitySelected;
				} else {
					uuidEntity = $scope.firstLevelEntitySelected;
				}

				// Recupero strutturaOrganizzativa
				//var abilitazione = AuthenticationService.getUtente().abilitazioneSelezionata;

				// Recupero struttura organizzativa
				if ($scope.roleSelected === AuthLevel.DivAdminRole) {
					struttOganizzativa = "DIVISION";
				} else if ($scope.roleSelected === AuthLevel.AccountAdminRole) {
					struttOganizzativa = "ACCOUNT";
				} else if ( $scope.roleSelected === AuthLevel.AccountViewerRole) {
					struttOganizzativa = "ACCOUNT";
				} else {
					notificationManager.showErrorPopup('Ruolo selezionato non valido!');
					return;
				}
				

				
				
			
				var toSubmit = {
					nome: $scope.utenteInserimento.nome,
					cognome: $scope.utenteInserimento.cognome,
					codiceFiscale: $scope.utenteInserimento.codiceFiscale,
					matricolaCsi: $scope.utenteInserimento.matricolaCsi,
					email: $scope.utenteInserimento.email,
					attivo: true,
					attivoCMP: false,
					uuidAssegnazione: uuidEntity,
					uuidUtente: $scope.uuidUtente,
					ruolo: role,
					strutturaOrganizzativa : struttOganizzativa,
					usaCredenziali : true
				};
				
				

				$scope.promise = AccreditamentoNewUtente.save(toSubmit).$promise;
				

				return $scope.promise.then(function (data) {
					notificationManager.showSuccessPopup($translate.instant('utente.accredita.success'));
					// Aggiorna lista abilitazioni
					Utente.get({ id: $scope.userDetails.id },
						function (userDto) {
							// Recupera elenco abilitazioni aggiornata
							$scope.elencoAbilitazioni = userDto.elencoAbilitazioni;
							getAccreditamentiUtente(userDto.id);
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
							notificationManager.showErrorPopup($translate.instant('utente.accredita.error') + ' ' + onfail.body.data.message);
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
					notificationManager.showErrorPopup('Operazione non permessa per ruolo corrente!');
					revocaEnabled = false;
				}
			}

			return revocaEnabled;
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
				notificationManager.showErrorPopup('Ruolo selezionato non valido!');
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

			

			return availableRoles;
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
				notificationManager.showErrorPopup('Operazione non permessa per ruolo corrente!');
				return;
			}

			// Recupera ruoli disponibili
			$scope.roles = getAvailableRoles();

		}

		this.onExit = function () { };

		controllerValidator.validate(this, $scope);
	}])
	.directive('uncapitalize', function() {
		return {
		  require: 'ngModel',
		  link: function(scope, element, attrs, modelCtrl) {
			var uncapitalize = function(inputValue) {
			  if (inputValue == undefined) inputValue = '';
			  var uncapitalized = inputValue.toLowerCase();
			  if (uncapitalized !== inputValue) {
				// see where the cursor is before the update so that we can set it back
				var selection = element[0].selectionStart;
				modelCtrl.$setViewValue(uncapitalized);
				modelCtrl.$render();
				// set back the cursor after rendering
				//element[0].selectionStart = selection;
				//element[0].selectionEnd = selection;
			  }
			  return uncapitalized;
			}
			modelCtrl.$parsers.push(uncapitalize);
			uncapitalize(scope[attrs.ngModel]); // uncapitalize initial value
		  }
		};
	});

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

angular.module('app').controller('RegistraAccreditaUtenteController', [
	'$rootScope', '$scope', '$state', '$stateParams', '$timeout', 'AuthLevel', 'ReadthedocService',
	'controllerValidator', 'loggers', 'notificationManager', 'StringMap', 
	'entitiesRest', "utils", "$mdDialog", "AuthenticationService", '$translate',
	function (
		$rootScope, $scope, $state, $stateParams, $timeout, AuthLevel, ReadthedocService, 
		controllerValidator, loggers, notificationManager, StringMap, 
		entitiesRest, utils, $mdDialog , AuthenticationService, $translate
	) {
		'use strict';

		$scope.rtdUtentiNew=ReadthedocService.getUrlFromPath('/utenti/new').docUrl;
		var logger = loggers.get("RegistraAccreditaUtenteController");

		var Utente = entitiesRest.getEntity('Utente');
		var Account = entitiesRest.getEntity('Account');
		var AccreditamentoNewUtente = entitiesRest.getEntity('AccreditamentoNewUtente');
		var DettaglioAccount =  entitiesRest.getEntity('DettaglioAccount');
		var DettaglioDivisione =  entitiesRest.getEntity('DettaglioDivisione');

		var defaultForm = {
			nome: null,
			cognome: null,
			codiceFiscale: null,
			matricolaCsi: null,
			email: null,
			attivo: true,
			attivoCMP: false
		};

		$scope.iconStyle = {
			// "color": "#4285f4"
		};

		var icone = {
			backoffice: "settings_system_daydream",
			organizzazione: "account_balance",
			divisione: "group_work",
			account: "account_circle"
		};

		
		$scope.cliCheckboxEnabled = false;

		$scope.userForm = {};

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

		function resetInserted(){
			$scope.utenteInserimento.nome = null;
			$scope.utenteInserimento.cognome =null;
			$scope.utenteInserimento.email = null;
			$scope.utenteInserimento.matricolaCsi=null; 
		}
		// Usa un servizio per tradurre le stringhe da visualizzare a video
		$scope.print = StringMap;

		$scope.loadRoles = function () {
			$scope.roles = [];

			return $timeout(function () {
				$scope.roles = getAvailableRoles();
				console.log($scope.roles); 
			}, 650);
		};


		function getAvailableRoles() {
			var availableRoles = [AuthLevel.AccountAdminRole, AuthLevel.AccountViewerRole /*AuthLevel.AccountOperatorRole*/];
			if ($scope.isAgenteAccountAdmin) {
				return availableRoles;
			}

			availableRoles.unshift(AuthLevel.DivAdminRole/*, AuthLevel.DivViewerRole, AuthLevel.DivOperatorRole*/);
			if ($scope.isAgenteDivAdmin) {
				return availableRoles;
			}
			return availableRoles;
		}
		

		
		$scope.onRoleSelectedChange = function () {
			$scope.firstLevelEntities = [];
			$scope.secondLevelEntities = [];
			$scope.firstLevelEntitySelected = null;
			$scope.isBORoleSelected = false;
			$scope.isOrgRoleSelected = false;
			$scope.isDivRoleSelected = false;
			$scope.isAccountRoleSelected = false;
			$scope.readyToAccredit = false; 

			// $scope.isBORoleSelected = $scope.roleSelected === AuthLevel.BOADMIN;
			// $scope.isBORoleSelected |= $scope.roleSelected === AuthLevel.BOMONITORING;

			// $scope.isOrgRoleSelected = $scope.roleSelected === AuthLevel.OrgAdminRole;
			// $scope.isOrgRoleSelected |= $scope.roleSelected === AuthLevel.OrgViewerRole;
			// $scope.isOrgRoleSelected |= $scope.roleSelected === AuthLevel.OrgOperatorRole;

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
			//checkForLevelEnabling();
		};
		function setLevelEntityIcons() {
			if ($scope.isDivRoleSelected) {
				
					$scope.firstLevelEntityIcon = icone.divisione;
					$scope.secondLevelEntityIcon = null;
					$scope.thirdLevelEntityIcon = null;

					$scope.firstLevelPlaceholder=$translate.instant('utente.seleziona_divisione');
				
			} else if ($scope.isAccountRoleSelected) {
				 if ($scope.isAgenteOrgAdmin) {
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
		

		$scope.loadEntities = function (entity) {
			if($scope.isAgenteDivAdmin ){
				if($scope.isDivRoleSelected){
					// Carico la sola divisione dell'agente
					//$scope.promise = Divisione.get({ id: $scope.entityUuid }).$promise;
					$scope.divUuid= AuthenticationService.getUtente().abilitazioneSelezionata.divUuid;
					$scope.promise = DettaglioDivisione.get({ uuid: $scope.divUuid }).$promise;

					return $scope.promise.then(function (data) {
							var divisioneInfo = [{
								nome : data.desc ? data.desc : data.name ,
								uuid: data.uuid
							}]; 
							$scope.firstLevelEntities = divisioneInfo; 
						
					}, function (onfail) {
						if (onfail.body) {
							if (onfail.body.data && onfail.body.data.message) {
								notificationManager.showErrorPopup($translate.instant('error.loading_entita') + ' ' + onfail.body.data.message);
							} else {
								notificationManager.showErrorPopup($translate.instant('error.loading_entita'));
							}
						} else {
							notificationManager.showErrorPopup($translate.instant('error.loading_entita'));
							return; 
						}
					});
					

				}else if($scope.isAccountRoleSelected){

					$scope.promise = Account.query({ divisionId: $scope.divUuid }).$promise;
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
							return; 
						}
					});
				}else {
					notificationManager.showErrorPopup($translate.instant('error.loading_entita'));
					return; 
				}
				
			
			}else if($scope.isAgenteAccountAdmin){
				$scope.accUuid = AuthenticationService.getUtente().abilitazioneSelezionata.accountUuid;
				$scope.promise = DettaglioAccount.get({ uuid: $scope.accUuid }).$promise;
				return $scope.promise.then(function (data) {
					var accountInfo = [{
								nome : data.desc ? data.desc : data.name ,
								uuid: data.uuid
							}]; 

					$scope.firstLevelEntities = accountInfo; 
				}, function (onfail) {
					if (onfail.data) {
						if (onfail.data && onfail.data.message) {
							notificationManager.showErrorPopup($translate.instant('error.loading_entita') + ' ' + onfail.data.message);
						} else {
							notificationManager.showErrorPopup($translate.instant('error.loading_entita'));
						}
					} else {
						notificationManager.showErrorPopup($translate.instant('error.loading_entita'));
						return; 
					}
				});
			
			}
			else {
				notificationManager.showErrorPopup($translate.instant('error.loading_entita'));
			}
			
		};

		

		function getAccreditamentiUtente( idUser) {
			

			Utente.get({ id: idUser },
				function (userDto) {
				
					$scope.elencoAbilitazioni = userDto.elencoAbilitazioni;
					$scope.elencoAbilitazioniNonFiltrate = userDto.elencoAbilitazioni;
					$scope.uuidUtente = userDto.uuidUtente;

					// filter and show only for selected division 
					var divId= AuthenticationService.getUtente().abilitazioneSelezionata.divId;
					var orgId= AuthenticationService.getUtente().abilitazioneSelezionata.divId;
					if(divId!=null && orgId!=null ){// filter at division level 
						$scope.elencoAbilitazioni= userDto.elencoAbilitazioni.filter(function(item){
							return item.divId == divId;         
						});
					} 

					if(divId=="" && orgId!=null ){// filter at organization level 
						$scope.elencoAbilitazioni= userDto.elencoAbilitazioni.filter(function(item){
							return item.orgId == orgId;         
						});
					} 
			
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
				});
		}

		

		function resetForm() {
			$scope.utenteInserimento = angular.copy(defaultForm);

			if ($scope.userForm.$dirty) {
				$scope.userForm.$setPristine();
				$scope.userForm.$setUntouched();
			}
		}

		$scope.uncapitalize= function () {
				$scope.utenteInserimento.email = $scope.utenteInserimento.email.toLowerCase() ;
		
		}


		$scope.accreditaUtente = function () {
			try {
				var uuidEntity;
				var role;
				var struttOganizzativa;



				logger.debug('accreditaUtente', $scope.utenteInserimento);

				//utils.loadSpinnerOverlay("Registrazione utente in corso...");
	 
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

				// utils.loadSpinnerOverlay("Accreditamento utente in corso...");

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


				// Recupero strutturaOrganizzativa
				var abilitazione = AuthenticationService.getUtente().abilitazioneSelezionata;
				

				uuidEntity = $scope.firstLevelEntitySelected;
				if($scope.isDivRoleSelected){
					struttOganizzativa = "DIVISION"
				} else {
					struttOganizzativa = "ACCOUNT";
				}
				

				//EK begin   if((value.userRole == AuthLevel.AccountAdminRole)  && (value.accountUuid==uuidEntity))
				var isAlreadyAccountAdmin= false ;
				var isAlreadyAccountViewer = false; 
				$scope.elencoAbilitazioni.forEach(function (value) {
					if((value.userRole == AuthLevel.AccountAdminRole)  && (value.accountUuid==uuidEntity))
						isAlreadyAccountAdmin= true ; 
					if((value.userRole ==  AuthLevel.AccountViewerRole) && (value.accountUuid==uuidEntity))
						isAlreadyAccountViewer= true ; 
				});

				if(role== "master" &&  isAlreadyAccountViewer){
					notificationManager.showErrorPopup('L\'utente è gia accreditato come VIEWER  su lo stesso Account. revocare prima di proccedere ');
					return;
				}
				if(role== "master" &&  isAlreadyAccountAdmin){
					notificationManager.showErrorPopup('L\'utente è gia accreditato come MASTER  su lo stesso Account');
					return;
				}
				if(role== "viewer" &&  isAlreadyAccountViewer){
					notificationManager.showErrorPopup('L\'utente è gia accreditato come VIEWER  su lo stesso Account. ');
					return;
				}
				if(role== "viewer" &&  isAlreadyAccountAdmin){
					notificationManager.showErrorPopup('L\'utente è gia accreditato come MASTER  su lo stesso Account. revocare prima di proccedere ');
					return;
				}
	
	
		// EK END
			
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
							//$scope.userDetails.elencoAbilitazioni = userDto.elencoAbilitazioni;
							$scope.elencoAbilitazioni = userDto.elencoAbilitazioni;
							getAccreditamentiUtente(userDto.id);
							if($scope.isAgenteDivAdmin )
								$state.go("app.listUtenti.divisione");
							if($scope.isAgenteAccountAdmin)
								$state.go("app.listUtenti.account");
						}, function (onfail) {
							if (onfail) {
								if (onfail.data && onfail.data.message) {
									notificationManager.showErrorPopup($translate.instant('error.loading_entita') + ' ' + onfail.data.message);
								} else {
									notificationManager.showErrorPopup($translate.instant('error.loading_entita'));
								}
							} else {
								notificationManager.showErrorPopup($translate.instant('error.loading_entita'));
							}
						});
				}, function (onfail) {
					if (onfail) {
						if (onfail.data && onfail.data.message) {
							notificationManager.showErrorPopup($translate.instant('utente.accredita.error') + ': ' + onfail.data.message);
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





		this.onInit = function () {
			resetForm();
			$scope.isAgenteDivAdmin = AuthenticationService.isGranted(AuthLevel.DivAdminRole);
			$scope.isAgenteAccountAdmin = AuthenticationService.isGranted(AuthLevel.AccountAdminRole);
			var abilitazione = AuthenticationService.getUtente().abilitazioneSelezionata;
			$scope.divisioneName=abilitazione.divName; 
			$scope.divUuid = abilitazione.divUuid; 
			
		};




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
	

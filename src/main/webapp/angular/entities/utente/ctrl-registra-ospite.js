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

angular.module('app').controller('RegistraOspiteController', [
	'$rootScope', '$scope', '$state', '$stateParams',
	'controllerValidator', 'loggers', 'notificationManager',
	'entitiesRest', "utils", "$mdDialog", "AuthenticationService", "ReadthedocService", '$translate',
	function (
		$rootScope, $scope, $state, $stateParams,
		controllerValidator, loggers, notificationManager,
		entitiesRest, utils, $mdDialog, AuthenticationService, ReadthedocService, $translate
	) {
		'use strict';

		var logger = loggers.get("RegistraOspiteController");
		
        $scope.rtdSelfRegistrazione=ReadthedocService.getUrlFromPath('/utenti/self').docUrl;


		var SelfRegistrazioneGuest = entitiesRest.getEntity('SelfRegistrazioneGuest');

		var defaultForm = {
			nome: null,
			cognome: null,
			codiceFiscale: null,
			matricolaCsi: null,
			email: null,
			attivo: true,
			attivoCMP: false,
			note: "" 
		};

		$scope.iconStyle = {
			// "color": "#4285f4"
		};

		$scope.cliCheckboxEnabled = false;

		$scope.userForm = {};

		$scope.actions = {
			invia: function () {
				try {
					logger.debug('invia', $scope.utenteInserimento);

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

					var email = $scope.utenteInserimento.email;
					if (!(email.includes('@csi.it') || email.includes('@consulenti.csi.it')) ) {
						notificationManager.showErrorPopup('L\'email non è di un dominio CSI.');
						return;
					}


					if( $scope.utenteInserimento.matricolaCsi===null){
						notificationManager.showErrorPopup('Inserire la matricola csi');
						return;
					}

					if( $scope.utenteInserimento.policy===false){
						notificationManager.showErrorPopup('Accettare le condizioni di utilizzo');
						return;
					}

					if (!$scope.userForm.$valid) {
						notificationManager.showErrorPopup('Verificare i dati inseriti. Alcune informazioni non sono valide. I dati non corretti sono evidenziati (in rosso) ');
						return;
					}

					SelfRegistrazioneGuest.save($scope.utenteInserimento, function (data) {
						logger.info("SUCCESS", data);
						notificationManager.showSuccessPopup('richiesta registrazione inviata correttamente');
						resetForm();
					}, function (onfail) {
						logger.error('ERROR', onfail);
						
						if (onfail.body) {
							if (onfail.body && onfail.body.data) {
								notificationManager.showErrorPopup('Si è verificato un errore durante il tentativo di registrazione: ' + onfail.body.data.message);
							} else {
								notificationManager.showErrorPopup('Si è verificato un errore durante il tentativo di registrazione');
							}
						} else if(onfail.data && onfail.data.message){
							notificationManager.showErrorPopup('Si è verificato un errore durante il tentativo di registrazione  : ' + onfail.data.message);
						}else {
							notificationManager.showErrorPopup('Si è verificato un errore durante il tentativo di registrazione');
						}
					});
				} finally {}
			},
			
		};

		function DialogController($scope, $mdDialog, userRetrieved) {
			if (utils.isEmpty(userRetrieved)) {
				$mdDialog.hide();
			}
			$scope.userDetails = userRetrieved;

			$scope.closeDialog = function () {
				$mdDialog.hide();
			};
		}

		function resetForm() {
			$scope.utenteInserimento = angular.copy(defaultForm);

			if ($scope.userForm.$dirty) {
				$scope.userForm.$setPristine();
				$scope.userForm.$setUntouched();
			}
		}

		function initializeGuestForm( guest) {
			$scope.utenteInserimento = {
				nome: guest.firstName,
				cognome:guest.lastName,
				codiceFiscale: guest.login,
				matricolaCsi: null,
				email: null,
				attivo: true,
				attivoCMP: false,
				policy: false
			};

		}


		$scope.uncapitalize= function () {
			
				$scope.utenteInserimento.email = $scope.utenteInserimento.email.toLowerCase() ;
		}


		this.onInit = function () {
			resetForm();
			var guest = AuthenticationService.getUtente();
		 	initializeGuestForm( guest)
		

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

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

angular.module('app').controller('ModificaUtenteController', [
	'$rootScope', '$scope', '$state', '$stateParams',
	'controllerValidator', 'loggers', 'notificationManager',
	'entitiesRest', "utils", "$mdDialog",
	function (
		$rootScope, $scope, $state, $stateParams,
		controllerValidator, loggers, notificationManager,
		entitiesRest, utils, $mdDialog
	) {
		'use strict';

		var logger = loggers.get("ModificaUtenteController");

		var Utente = entitiesRest.getEntity('Utente');
		var UpdateUtente = entitiesRest.getEntity('UpdateUtente');

		$scope.iconStyle = {
			// "color": "#4285f4"
		};

		$scope.options = {
			isDettaglioLoaded:false,
			showAccreditaUtente:false
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

					UpdateUtente.update($scope.utenteInserimento, function (data) {
						logger.info("SUCCESS", data);
						notificationManager.showSuccessPopup('L\'utente è stato aggiornato  correttamente');
						//resetForm();
						$state.go('app.listUtenti');
					}, function (onfail) {
						logger.error('ERROR', onfail);
						if (onfail.data) {
							if (onfail.data && onfail.data.message) {
								notificationManager.showErrorPopup('Si è verificato un errore durante il tentativo di aggiornare l\'utente: ' + onfail.data.message);
							} else {
								notificationManager.showErrorPopup('Si è verificato un errore durante il tentativo di aggiornare l\'utente!');
							}
						} else if(onfail.message) {
							notificationManager.showErrorPopup('Si è verificato un errore durante il tentativo di registrare l\'utente! : ' + onfail.message);
						} else {
							notificationManager.showErrorPopup('Si è verificato un errore durante il tentativo di registrare l\'utente!');
						}
					});
				} finally {}
			},

		};

		



		function getUtente() {
			$scope.options.isDettaglioLoaded=false;
			$scope.idUtente = $stateParams.idUtente;
			$scope.promise = Utente.get({ id: $scope.idUtente }).$promise;
			
			$scope.promise.then(function (userDto) {
				$scope.userDetails = angular.copy(userDto);
				
				$scope.utenteInserimento = {
					nome: userDto.firstName,
					cognome: userDto.lastName,
					codiceFiscale: userDto.codiceFiscale,
					matricolaCsi: userDto.matricolaCsi,
					email: userDto.email,
					attivo: userDto.attivo,
					//attivoCMP: userDto.attivoCMP,
					id: userDto.id,
					usaRemedy : userDto.usaRemedy,
					usaCredenziali : true
				};

				

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



		$scope.uncapitalize= function () {
				$scope.utenteInserimento.email = $scope.utenteInserimento.email.toLowerCase() ;
			
		}

		this.onInit = function () {
			
			getUtente();
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
				
			  }
			  return uncapitalized;
			}
			modelCtrl.$parsers.push(uncapitalize);
			uncapitalize(scope[attrs.ngModel]); // uncapitalize initial value
		  }
		};
	});

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

angular.module('app').controller('RegistraUtenteController', [
	'$rootScope', '$scope', '$state', '$stateParams',
	'controllerValidator', 'loggers', 'notificationManager',
	'entitiesRest', "utils", "$mdDialog", '$translate',
	function (
		$rootScope, $scope, $state, $stateParams,
		controllerValidator, loggers, notificationManager,
		entitiesRest, utils, $mdDialog, $translate
	) {
		'use strict';

		var logger = loggers.get("RegistraUtenteController");

		var Utente = entitiesRest.getEntity('Utente');

		var defaultForm = {
			nome: null,
			cognome: null,
			codiceFiscale: null,
			matricolaCsi: null,
			email: null,
			attivo: true,
			attivoCMP: false,
			usaRemedy : false
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
						notificationManager.showErrorPopup($translate.instant('utente.codice_fiscale_required'));
						return;
					}

					if (!$scope.userForm.cf.$valid) {
						notificationManager.showErrorPopup($translate.instant('utente.codice_fiscale_duplicated'));
						return;
					}

					var nome = $scope.utenteInserimento.nome;
					if (!nome || typeof nome !== 'string' || (nome.trim && nome.trim() === '')) {
						notificationManager.showErrorPopup($translate.instant('utente.nome_required'));
						return;
					}

					var cognome = $scope.utenteInserimento.cognome;
					if (!cognome || typeof cognome !== 'string' || (cognome.trim && cognome.trim() === '')) {
						notificationManager.showErrorPopup($translate.instant('utente.cognome_required'));
						return;
					}

					var email = $scope.utenteInserimento.email;
					if (!email || typeof email !== 'string' || (email.trim && email.trim() === '')) {
						notificationManager.showErrorPopup($translate.instant('utente.email_required'));
						return;
					}

					if (!$scope.userForm.$valid) {
						notificationManager.showErrorPopup($translate.instant('campi_non_validi'));
						return;
					}

					Utente.save($scope.utenteInserimento, function (data) {
						logger.info("SUCCESS", data);
						notificationManager.showSuccessPopup($translate.instant('utente.nuovo.success'));
						resetForm();
						$state.go('app.listUtenti');
					}, function (onfail) {
						logger.error('ERROR', onfail);
						if (onfail.data) {
							if (onfail.data && onfail.data.message) {
								notificationManager.showErrorPopup($translate.instant('utente.nuovo.error') + ': ' + onfail.data.message);
							} else {
								notificationManager.showErrorPopup($translate.instant('utente.nuovo.error'));
							}
						} else {
							notificationManager.showErrorPopup($translate.instant('utente.nuovo.error'));
						}
					});
				} finally {}
			},

			controlla: function () {
				if ($scope.utenteInserimento.codiceFiscale) {
					Utente.get({ "cf": $scope.utenteInserimento.codiceFiscale },
						function (data) {
							logger.info("SUCCESS", data);
							if (!utils.isEmpty(data) && data.hasOwnProperty("id")) {	// WORKAROUND: fino a che il backend non restituisce 404
								notificationManager.showErrorPopup($translate.instant('utente.codice_fiscale_duplicated'));
								$mdDialog.show({
									locals: { userRetrieved: data },
									controller: DialogController,
									// templateUrl: 'angular/entities/utente/tpl-dialog-dettagli-utente.html',
									templateUrl: 'angular/entities/utente/tpl-dialog-tab-dettagli-utente.html',
									parent: angular.element(document.body),
									clickOutsideToClose: true,
									fullscreen: true	// Only for -xs, -sm breakpoints.
								});
								$scope.userForm.cf.$setValidity("cfAllowed", false);
							} else {
								$scope.userForm.cf.$setValidity("cfAllowed", true);
							}
						}, function (onfail) {
							logger.error("ERROR", onfail);
						});
				}
			}
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



		$scope.uncapitalize= function () {
			
				$scope.utenteInserimento.email = $scope.utenteInserimento.email.toLowerCase() ;
		
				
		}

		$scope.checkRemedy=function(){
			$scope.utenteInserimento.usaRemedy=($scope.utenteInserimento.email.includes('@csi.it') || $scope.utenteInserimento.email.includes('@consulenti.csi.it'));
		}

		$scope.remedyDefault =function(){
			if($scope.utenteInserimento.usaRemedy)	$scope.utenteInserimento.usaRemedy=false;
		}

		this.onInit = function () {
			resetForm();
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

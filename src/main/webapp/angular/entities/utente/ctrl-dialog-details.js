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

	.controller('DialogDetailsController', ['$mdDialog', '$scope', 'entitiesRest',
		'controllerValidator', 'notificationManager', 'loggers',
		'userSelected',
		function ($mdDialog, $scope, entitiesRest,
			controllerValidator, notificationManager, loggers,
			userSelected) {
			'use strict';

			var logger = loggers.get("DialogDetailsController");

			var Utente = entitiesRest.getEntity('Utente');

			if (userSelected.length !== 1) {
				notificationManager.showErrorPopup('Selezionare solo un utente!');
				$mdDialog.hide();
				return;
			}
			$scope.userDetails = userSelected[0];

			$scope.iconStyle = {
				"color": "#4285f4",
			}

			$scope.closeDialog = function () {
				$mdDialog.hide();
			};

			this.onInit = function () {
				Utente.get({ id: $scope.userDetails.id },
					function (userDto) {
						logger.info("SUCCESS", userDto);
						// Recupera elenco abilitazioni da servizi CMP
						logger.debug("Utente selezionato", userDto);
						$scope.userDetails.elencoAbilitazioni = userDto.elencoAbilitazioni;
					}, function (onfail) {
						logger.error("ERROR", onfail);
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
					});
			}

			this.onExit = function () { };

			controllerValidator.validate(this, $scope);
		}]);

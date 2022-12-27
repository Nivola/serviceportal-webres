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
nivolaApp.controller('NuovoGrantController',
	["$scope", "$state", "$stateParams", "$filter",'$window', 'ReadthedocService'
,		"entitiesRest", "controllerValidator", "notificationManager", 'loggers',
		'VmIstanzeService', '$q', 'AuthenticationService', '$translate', 
		function ($scope, $state, $stateParams, $filter,$window, ReadthedocService, 
			entitiesRest, controllerValidator, notificationManager, loggers,
			VmIstanzeService, $q, AuthenticationService, $translate) {
			'use strict';

			var Staas = entitiesRest.getEntity('StaasGrant');
			$scope.rtdStaasGrant=ReadthedocService.getUrlFromPath('/staas/grant').docUrl;

			$scope.volumeId = null;
			$scope.grant = {
				accessLevel: null,
				accessTo: null,
				accessType: null,
				state: null,
				id: $stateParams.volumeId
			};
			
			$scope.elencoLivelliAccesso = [
				{ code : 'rw', description : $translate.instant('shares.autorizzazioni.livelli.lettura_scrittura'), order : 1 },
				{ code : 'ro', description : $translate.instant('shares.autorizzazioni.livelli.sola_lettura'), order : 2 }
				];
			
			$scope.elencoTipiAccesso = [
				{ code : 'ip', description : $translate.instant('shares.autorizzazioni.nuova.indirizzo_ip'), order : 1 }/*,
				{ code : 'cert', description : 'Cert', order : 2 },
				{ code : 'user', description : 'Utente', order : 3 }*/
				];
			
			$scope.elencoStati = [
				{ code : 'ip', description : $translate.instant('shares.autorizzazioni.stati.indirizzo_ip'), order : 1 },
				{ code : 'cert', description : $translate.instant('shares.autorizzazioni.stati.cert'), order : 2 },
				{ code : 'user', description : $translate.instant('shares.autorizzazioni.stati.utente'), order : 3 }
				];
			
			
			$scope.submit = function () {
				$scope.status.pending = true;
				var grantLocal = {
						access_level: $scope.grant.accessLevel,
						access_to: $scope.grant.accessTo,
						access_type: $scope.grant.accessType,
						state: null,
						id: $stateParams.volumeId
					};
				
				Staas.save(grantLocal, function (data) {
					notificationManager.showSuccessPopup($translate.instant('shares.autorizzazioni.nuova.success'));
					$state.go('app.volumes.change', {volumeId : $stateParams.volumeId	});
				}, function (onfail) {
					if (onfail.body) {
						if (onfail.body && onfail.body.data && onfail.body.data.message) {
							notificationManager.showErrorPopup($translate.instant('shares.autorizzazioni.nuova.error') + ": " + onfail.body.data.message);
						} else {
							notificationManager.showErrorPopup($translate.instant('shares.autorizzazioni.nuova.error'));
						}
					} else {
						notificationManager.showErrorPopup($translate.instant('shares.autorizzazioni.nuova.error'));
					}
				}).$promise.finally(function () {
					$scope.status.pending = false;
				});
			
			};
		}
	]);

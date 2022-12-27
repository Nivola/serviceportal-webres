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
nivolaApp.run([
	'loggers', '$rootScope', '$state', '$location', 'AuthenticationService', 'notificationManager', 'conf', '$translate',
function(
	loggers, $rootScope, $state, $location, serviceUtente, notificationManager, conf, $translate
) {
	
	var logger = loggers.get("role-interceptor");

	var getAlberoStati = function(endLeafName) {
		logger.debug('ST endLeafName:', endLeafName);
		var albero = [];
		var stato;
		while (true) {
			stato = $state.get(endLeafName);
			if (stato) {
				albero.push(stato);
				if (endLeafName.indexOf(".") >= 0) {
					endLeafName = endLeafName.substring(0, endLeafName.lastIndexOf("."));
				} else {
					break;
				}
			} else {
				break;
			}
		}
		return albero;
	}

	
	$rootScope.$on('$stateChangeStart',
		function(event, toState, toParams, fromState, fromParams, options) {
			logger.debug('ST toState:', toState);
			logger.debug('ST toParams:', toParams);
			logger.debug('ST fromState:', fromState);
			logger.debug('ST fromParams:', fromParams);
			logger.debug('ST options:', options);
			
			// build inherited data
			var inheritedData = {};
			var alberoStati = getAlberoStati(toState.name);
			for (var i = 0; i < alberoStati.length; i++) {
				if (alberoStati[i].data) {
					inheritedData = $.extend({}, alberoStati[i].data, inheritedData);
				}
			}
			toState.data = inheritedData;
		
			// check role
			
			// check requireUC
			if (toState) {
				
				var granted = true;
				$.each(alberoStati, function(i, stato) {
					if (stato && stato.requiredUC && !serviceUtente.isGranted(stato.requiredUC)) {
						if (stato.name != toState.name) {
							logger.warn("richiesto switching non autorizzato a " + toState.name + " - blocco da parent state " + stato.name);
						} else {
							logger.warn("richiesto switching non autorizzato a " + toState.name);
						}							
						granted = false;
						return false;
					}
				});
				
				// commentare per test costi organizzazione
				if (!granted && conf.enableUCStateRestriction) {
					notificationManager.showErrorPopup($translate.instant('error.non_autorizzato'));
					
				 	$rootScope.$broadcast("stateChangeCanceled", {cause : "requiredUCMissing", requiredUC : toState.requiredUC});
				 	event.preventDefault();

				 	$state.go('app.home');
				 	return;
				}
			}
		}
	);

	$rootScope.presentaImportoLocalizzato = function(importo, lang) {
		if (Number.isNaN(parseFloat(importo))) {
			return 0;
		}
        return parseFloat(parseFloat(importo).toFixed(2)).toLocaleString(lang);
    };
	
}]);

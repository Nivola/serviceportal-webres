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
nivolaApp.service('costiDataProviderService',
	['$interval', 'entitiesRest', 'AuthenticationService', '$translate',
		function ($interval, entitiesRest, AuthenticationService, $translate) {

			var service = this;
			var refreshInterval = 10 * 60 * 1000; // 5 minuti

			function defaultData(orig) {
				var res = {
					refreshAutomatico: false
				};
				if (orig) {
					if (orig.refreshAutomatico !== undefined) {
						res.refreshAutomatico = orig.refreshAutomatico;
					}
				}
				return res;
			}
			service.provide = function (widget) {
				// INIZIALIZZATION
				widget.data = defaultData(widget.data);
				widget.loading = true;
				widget.failed = false;
				widget.datinondisponibili=false;
				// LOAD DATA
				widget.loadData = function () {
					var utente = AuthenticationService.getUtente();

					// INVOCA SERVIZIO REST
					var entity = entitiesRest.getEntity('dashboardAccountCosti');
					entity.get({ 'id': utente.abilitazioneSelezionata.accountUuid }).$promise
						.then(function (data) {
							temp = {};
							if (data) {
								temp.costoDellaGiornata = data.costoDellaGiornata ? angular.copy(parseFloat(data.costoDellaGiornata).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')):null;
								temp.costoMeseInCorso = data.costoMeseInCorso ? angular.copy( parseFloat(data.costoMeseInCorso).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')):null;
								temp.valuta =  angular.copy({nome:'Euro',code:"€"});
								
								var day = data.giornoRiferimento.match(/\d+/)[0]; 
							
								temp.meseRiferimento =  new Date(data.annoRiferimento , data.meseRiferimento - 1, 1).toLocaleString($translate.use(), {month:"long"});
								temp.annoRiferimento =  angular.copy(data.annoRiferimento);
								temp.giornoRiferimento = day + ' '+ temp.meseRiferimento + ' ' + temp.annoRiferimento; 
								if(!temp.costoMeseInCorso && !temp.costoDellaGiornata){
									widget.datinondisponibili=true;							
								}
							}
							// IMPOSTA DATI
							widget.data = temp;
							widget.loading = false;
						}).catch(function () {
							widget.data = {};
							widget.loading = false;
							widget.failed = true;
						});
				};

				// FUNCTION CALLBACKS
				//widget.callbacks = {
				//};
				if (widget.data.refreshAutomatico) {
					service.intervalHandler = $interval(widget.loadData, refreshInterval);
				}
				widget.loadData();
			};

			//service.eventCallback = function(e, widget){};

			service.finalize = function () {
				if (service.intervalHandler) {
					$interval.cancel(service.intervalHandler);
				}
			};
		}]);

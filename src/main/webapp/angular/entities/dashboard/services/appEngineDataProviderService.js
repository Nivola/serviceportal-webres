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
nivolaApp.service( 'appEngineDataProviderService',
    ['$interval', 'entitiesRest', 'AuthenticationService', '$translate',
    function($interval, entitiesRest, AuthenticationService, $translate) {

    var service = this;
    var refreshInterval = 10 * 60 * 1000; // 10 minuti

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
    service.provide = function(widget) {
		// INIZIALIZZATION
		widget.data = defaultData(widget.data);;
		widget.loading = true;
		widget.failed = false;

		// LOAD DATA
		widget.loadData = function() {
            var utente = AuthenticationService.getUtente();

			// INVOCA SERVIZIO REST
			var entity = entitiesRest.getEntity('dashboardAccountActiveServices');
    		entity.getOneService({'id':utente.abilitazioneSelezionata.accountUuid, 'tipoServizio': entity.tipiServizi.AppEngineService}).$promise
                .then(function(data) {
                    temp = {};
					if (data && data[0].stato === "ACTIVE") {
						temp.appEngine = {
							isActive : true,
							stato : $translate.instant('homepage.servizio_attivo'),
							numeroIstanze : data[0].numeroIstanze
						};
					} else {
						temp.appEngine = {
							isActive : false,
							stato : $translate.instant('homepage.nessun_servizio_attivo')
						};
					}
				    // IMPOSTA DATI
				    widget.data = temp;
				    widget.loading = false;
			    }).catch(function() {
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

	service.finalize = function() {
		if (service.intervalHandler) {
			$interval.cancel(service.intervalHandler);
		}
    };
}]);

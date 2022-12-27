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
nivolaApp.service( 'portafoglioDivisioneDataProviderService',
    ['$interval', 'entitiesRest', 'AuthenticationService', '$translate',
    function($interval, entitiesRest, AuthenticationService, $translate) {

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
    service.provide = function(widget) {
		// INIZIALIZZATION
		widget.data = defaultData(widget.data);
		widget.loading = true;
		widget.failed = false;

		// LOAD DATA
		widget.loadData = function() {
            var utente = AuthenticationService.getUtente();
            var dataCorrente = new Date();

			// INVOCA SERVIZIO REST
			var entity = entitiesRest.getEntity('dashboardDivisioneCosti');
    		entity.get({'id':utente.abilitazioneSelezionata.divUuid, 'anno': dataCorrente.getFullYear()}).$promise
                .then(function(data) {
                    temp = {
                        //creditoTotale : data.creditoTotale,
                        //costiTotali : data.costiTotali,
                        //costiRendicontatiAnno : data.costiRendicontatiAnno,
                        //costiNonRendicontati : data.costiNonRendicontati,
						//creditoResiduo : data.creditoResiduo,
						costoMeseInCorso : data.costoMeseInCorso,
						meseRiferimento : new Date(data.annoRiferimento , data.meseRiferimento - 1, 1).toLocaleString($translate.use(), {month:"long"}),
						annoRiferimento : data.annoRiferimento
                    };
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

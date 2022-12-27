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
nivolaApp.service( 'avviso&NotificheDataProviderService', ['$interval', function($interval) {

    var service = this;
    var refreshInterval = 10 * 60 * 1000; // 10 minuti


    service.provide = function(widget) {
		// INIZIALIZZATION
		widget.data = {};
		widget.loading = true;
		widget.failed = false;

		// LOAD DATA
		widget.loadData = function() {
			var data = {};


			// INVOCA SERVIZIO REST
			//	SystemStatusService.getServicesStatus().then(function(data) {
				//carica dati: widget.data <- data
	
				// IMPOSTA DATI
				widget.data = data;
				widget.loading = false;
			//}).catch(function() {
			// widget.data = [];
			// widget.loading = false;
			// widget.failed = true;
			//});
		};
		
		// FUNCTION CALLBACKS
		//widget.callbacks = {
		//};

		//service.intervalHandler = $interval(widget.loadData, refreshInterval);
		widget.loadData();
	};
	
	//service.eventCallback = function(e, widget){};

	service.finalize = function() {
		if (service.intervalHandler) {
			$interval.cancel(service.intervalHandler);
		}
    };
}]);

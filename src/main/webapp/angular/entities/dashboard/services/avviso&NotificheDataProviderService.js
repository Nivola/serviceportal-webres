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
    var refreshInterval = 0.5 * 60 * 1000; // 5 minuti


    service.provide = function(widget) {
		// INIZIALIZZATION
		widget.data = [];
		widget.loading = true;
		widget.failed = false;

		// LOAD DATA
		widget.loadData = function() {
			var data = [];


		
				widget.data = data;
				widget.loading = false;
				//}).catch(function() {
			// widget.data = [];
			// widget.loading = false;
			// widget.failed = true;
			//});
		};
		
		// CALLBACKS
		widget.callbacks = {
			onAvvisoClick : function(item) {
				alert("Premuto su avviso di " + item.sender + " del " + item.date.getDate() + "/" + (item.date.getMonth()+1) + "/" + item.date.getFullYear() );
			}
		};

		service.intervalHandler = $interval(widget.loadData, refreshInterval);
		widget.loadData();
	};
	
	//service.eventCallback = function(e, widget){};

	service.finalize = function() {
		if (service.intervalHandler) {
			$interval.cancel(service.intervalHandler);
		}
    };
}]);

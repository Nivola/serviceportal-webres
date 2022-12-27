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
nivolaApp.service( 'statoUtilizzatoriDataProviderService', ['$interval', 'entitiesRest', function( $interval, entitiesRest ) {

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
		widget.data = defaultData(widget.data);
		widget.loading = true;
		widget.failed = false;

		// LOAD DATA
		widget.loadData = function() {

			// INVOCA SERVIZIO REST
		var entity = entitiesRest.getEntity('dashBoardStatoUtilizzatori');
    		entity.get().$promise
                .then(function(data) {
                    temp = {};
					if (data) {
						 temp.totaleAccount =angular.copy(data.totaleAccount);
						 temp.totaleDivisioni =angular.copy(data.totaleDivisioni);
						 temp.totaleOrganizzazioni =angular.copy(data.totaleOrganizzazioni);
						 temp.totaleUtenti =angular.copy(data.totaleUtenti);
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

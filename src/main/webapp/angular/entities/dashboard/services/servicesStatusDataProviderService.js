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
nivolaApp.service( 'servicesStatusDataProviderService', ['$interval', 'SystemStatusService', function( $interval, SystemStatusService ) {

	var service = this;
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
	service.eventCallback = function(e, widget) {
		if (e == 'refresh') {
    		if (!widget.data.loading) {
	    		widget.data.loading = true;
	    		widget.data.failed = false;
	    		widget.data.vm = [];
	    		service.refresh();
    		}
    	}
    };

    service.provide = function(widget) {
		widget.data = defaultData(widget.data) || {};
		
        widget.callbacks = {};
        
        widget.data.loading = true;
        widget.data.numeroOk = 0;
        widget.data.numeroNonOk = 0;
        widget.data.tuttiOk = true;

        service.refresh = function() {
    		SystemStatusService.getServicesStatus().then(function(data) {
    			var dataList = [];
    			$.each(data, function(k, v) {
    				dataList.push(v);
    			});
					
					// Aggiunge in modo surrettizio stato delle AZ.
					// LG 26.04.2019
					// FIXME!
					var az1 = {
						priority: 10,
						code:	'it.csi.nivola.nivolasp.restapi',
						displayName:	'Servizi Availability Zone Torino01',
						status:	true,
						message:	'Availabiity Zone disponibile' 
					};
					dataList.push(az1);

					var az2 = {
						priority: 10,
						code:	'it.csi.nivola.nivolasp.restapi',
						displayName:	'Servizi Availability Zone Torino02',
						status:	true,
						message:	'Availabiity Zone disponibile' 
					};
					dataList.push(az2);

					var az3 = {
						priority: 10,
						code:	'it.csi.nivola.nivolasp.restapi',
						displayName:	'Servizi Availability Zone Vercelli',
						status:	true,
						message:	'Availabiity Zone disponibile' 
					};
					dataList.push(az3);

    			data = dataList;
    			
    			widget.data.vm = data;
    			
    			widget.data.numeroOk = $.grep(data, function(candidate) {
    				return candidate.status;
    			}).length;
    			
    			widget.data.numeroNonOk = $.grep(data, function(candidate) {
    				return !candidate.status;
    			}).length;

    			widget.data.tuttiOk = (widget.data.numeroNonOk < 1); 
    			
    			$.each(data, function(i, e) {
    				if (e.status) {
    					if (!e.message) {
    						e.message = "servizio regolarmente attivo";
    					}
    				} else {
    					if (!e.message) {
    						e.message = "qualcosa non va";
    					}
    				}
    			});
    			
    			widget.data.loading = false;
    			widget.data.failed = false;
    		}, function() {
    			widget.data.loading = false;
    			widget.data.failed = true;
    		})
    	}
    	
		if (widget.data.refreshAutomatico) {
			service.intervalHandler = $interval(widget.loadData, refreshInterval);
		}
    	service.refresh();
	};

	service.finalize = function() {
        $interval.cancel(service.intervalHandler);
    };
}]);

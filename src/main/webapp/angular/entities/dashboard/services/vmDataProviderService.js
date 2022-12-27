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
nivolaApp.service( 'vmDataProviderService', ['$interval', 'VmIstanzeService', function( $interval, vmIstanzeService ) {

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
    service.provide = function(widget) {

		widget.callbacks = {};
		widget.data = defaultData(widget.data) || {};

        widget.data.loading = true;
        widget.data.MAX_INSTANCES = 5;
        widget.data.MAX_CPU = 10;
        
    	function refresh() {
    		vmIstanzeService.getEc2Instances().then(function(data) {
    			data = data || [];
    			
    			widget.data.vm = data;

    			widget.data.numIstanze = data.length;

    			widget.data.numIstanzeAttive = $.grep(data, function(candidate) {
    				return candidate.state.code == 16;
    			}).length;

    			widget.data.numIstanzeNonAttive = $.grep(data, function(candidate) {
    				return candidate.state.code != 16;
    			}).length;
    			
    			widget.data.loading = false;
    			widget.data.failed = false;
    		}, function() {
    			widget.data.loading = false;
    			widget.data.failed = true;
    		})
    	}
		
		                    
		if (widget.data.refreshAutomatico) {
			service.intervalHandler = $interval(function () {
				refresh();
			}, 60 * 1000);
		}
        refresh();
	};

	service.finalize = function() {
        $interval.cancel(service.intervalHandler);
    };

}]);

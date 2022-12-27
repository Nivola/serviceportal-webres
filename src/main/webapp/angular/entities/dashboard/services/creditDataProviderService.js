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
nivolaApp.service( 'creditDataProviderService', ['$interval', function($interval) {

    this.provide = function(widget) {

        widget.callbacks = {};
        widget.callbacks.notImplemented = serviceMock.notImplemented;
        widget.data = widget.data || {};

    	widget.data.totalFatt = 123.45;

        $interval(function() {
            //widget.data.totalFatt += Math.random() * 0.085;
        }, 1000);
	};

    this.finalize = function() {
        console.warn("SHOULD STOP RUNNING $INTERVAL(...)");
    };

}]);

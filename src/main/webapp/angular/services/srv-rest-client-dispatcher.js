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
angular.module('app')
    .service('RestClientDispatcher', [
	'$q', '$http', '$rootScope', 'AuthenticationService', 'loggers', 'conf', 'utils',
function(
   	$q, $http, $rootScope, AuthenticationService, loggers, conf, utils) {
    	
    	var logger = loggers.get("service-dispatcher");
    	
    	this.dispatch = function(options) {

    		var httpConfig = options;

			if (!httpConfig.headers) {
                httpConfig.headers = {};
			}

            if (logger.isTraceEnabled()) {
                logger.trace("dispatching requested for " + httpConfig.url);
            }

            httpConfig.url = conf.location.api + "/" + httpConfig.url;

			if (logger.isTraceEnabled()) {
                logger.trace("dispatching to " + httpConfig.url);
            }

            return $http(httpConfig);
			
        };
        
    }]);

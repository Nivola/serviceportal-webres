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
// nivolaApp.config(['$httpProvider', function($httpProvider) {
	
// 	var eventHandler = function(response, rootScope, logger, events) {
		
// 		var headers = response.headers("x-event-signaling"); 
// 		if (headers) {
// 			logger.debug("received event signaling:", headers);
			
// 			if (headers == "sessionExpired") {
// 				logger.info("received sessionExpired event from proxy, broadcasting to app");
// 				rootScope.$broadcast(events.SESSION_EXPIRED);
// 			}
// 			else {
// 				logger.error("unknown event signaling:", headers);
// 			}
// 		}
// 		else {
// 			logger.trace("no event signaling attached to response");
// 		}
// 	};
	
// 	$httpProvider.interceptors.push(['$q', '$rootScope', 'loggers', 'events', function($q, $rootScope, loggers, events) {

// 		var logger = loggers.get("http-event-signaling");
		
// 		return {
// 			'response' : function(response) {
// 				eventHandler(response, $rootScope, logger, events);
// 				return response;
// 			},

// 			'responseError' : function(response) {
// 				eventHandler(response, $rootScope, logger, events);
// 				return $q.reject(response);
// 			}
// 		};
// 	}]);
	
// }]);

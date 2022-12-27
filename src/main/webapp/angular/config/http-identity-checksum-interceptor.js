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
    
//     var eventHandler = function(response, rootScope, utenteService, logger, events) {
        
//         var checksum = response.headers("x-identity-checksum");
        
//         if (checksum) {
//             logger.trace("received identity checksum:", checksum);
            
//             if (checksum == "null") {
//                 checksum = null;
//             }
//             var u = utenteService.getUtente();
//             if (u && u.checksum) {
//                 setTimeout(function(){
//                     u = utenteService.getUtente();
//                     if (u) {
//                         if (u.checksum !== checksum) {
//                             logger.info("identity checksum changed, broadcasting session expired event");
                            
//                             // TODO verificare come gestire
//                             utenteService.setUtente(null);
//                             // window.location.href = conf.homeContext + "/sessioneScaduta";
//                             rootScope.$broadcast(events.SESSION_EXPIRED);
//                         }
//                         else {
//                             logger.trace("still matching current user:", u.checksum);
//                         }
//                     }
//                 }, 500);
//             }
//             else {
//                 logger.trace("current user has no checksum:", u ? u.checksum : "user is null");
//             }
//         }
//         else {
//             logger.trace("no identity checksum attached to response");
//         }
//     };
    
//     $httpProvider.interceptors.push(['$q', '$rootScope', 'utenteService', 'loggers', 'events', function($q, $rootScope, utenteService, loggers, events) {

//         var logger = loggers.get("http-identity-checksum");
        
//         return {
//             'response' : function(response) {
//                 console.error("siamo belli");
//                 eventHandler(response, $rootScope, utenteService, logger, events);
//                 return response;
//             },

//             'responseError' : function(response) {
//                 console.error("siamo brutti");
//                 eventHandler(response, $rootScope, utenteService, logger, events);
//                 return $q.reject(response);
//             }
//         };
//     }]);
    
// }]);

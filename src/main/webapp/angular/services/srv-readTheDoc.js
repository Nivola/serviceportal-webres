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
/*
*	@FF 02/10/2017
*	servizio di autenticazione utente
*/
angular.module('app').service('ReadthedocService',
	['$http', '$rootScope', 'loggers', 'browserStorage', 'events', 'conf', 'AuthLevel', 'notificationManager','entitiesRest', '$translate', 
	function(
		$http, $rootScope, loggers, browserStorage, events, conf, AuthLevel,notificationManager,entitiesRest, $translate
) {

	var self = this;
	var logger = loggers.get("srv-readthedoc");

    var ReadTheDocs = entitiesRest.getEntity('ReadTheDocs'); 

	self.getUrlFromPath = function(path) {
		var lang = $translate.use();
		return self.getUrlFromPathWithLang(path, lang);
	}

	self.getUrlFromPathWithLang = function(path, lang){
		var readthedocs= [];
		
		// i18n use lang in routeLabel to search doc_url
		console.log("lang: ", lang);
		
		if (window.localStorage['readTheDocs'] != null) {
			readthedocs=JSON.parse(window.localStorage['readTheDocs']) ;
			
			// cerco con il prefisso "lang"
			var routeLabelToFind = lang + path;
			for(var i = 0 ; i< readthedocs.length; i++){
				if(readthedocs[i].routeLabel==routeLabelToFind){
					return readthedocs[i]; 
				}
			}

			// cerco senza il prefisso "lang" (routeLabel di default)
			for(var i = 0 ; i< readthedocs.length; i++){
				if(readthedocs[i].routeLabel==path){
					return readthedocs[i]; 
				}
			}
		} 
		
		return [];
	}
}]);

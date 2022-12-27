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
nivolaApp.config(['$httpProvider', function($httpProvider) {
	
	$httpProvider.interceptors.push(['$q', 'loggers','$injector','$window', function($q, loggers,$injector,$window) {
		var logger = loggers.get("http");

		function isDataSessioneScaduta(dataRejection){
			if(dataRejection && dataRejection['messaggioSessioneScaduta'] && dataRejection['messaggioSessioneScaduta'].length>0){
				return true;
			}
			return false;
		}

		var getMdDialog = ()=>{
			var dialog = $injector.get('$mdDialog');
			return dialog;
		}

		var getAuthenticationService= ()=>{
			var authS = $injector.get('AuthenticationService');
			return authS;
		}
		
		return {
			'request' : function(config) {
				
				config._logging = {
					startTime : new Date()
				};
				
				var logUrl = config.url;
				if (config && config.data && config.data.uri) {
					logUrl = config.data.uri + " (proxed by " + config.url + ")";
				}
				
				logger.groupCollapsedDebug("request start : " + config.method + " " + logUrl);
				logger.debug(config);
				logger.groupEndDebug();
				
				return config;
			},

			'requestError' : function(rejection) {
				
				logger.groupError("request error ");
				logger.error(rejection);
				logger.groupEndError();
				
				return $q.reject(config);
			},

			'response' : function(response) {

				var config = response.config;
				var logUrl = config.url;
				if (config && config.data && config.data.uri) {
					logUrl = config.data.uri + " (proxed by " + config.url + ")";
				}
				
				logger.groupCollapsedDebug(
					"response success (" + response.status + " " + response.statusText + ", " + 
					(new Date() - response.config._logging.startTime) + " ms) " +
					logUrl);
				logger.debug(response);
				logger.groupEndDebug();
				return response;
			},

			'responseError' : function(rejection) {

				if(rejection && rejection.data && rejection.status===401 && isDataSessioneScaduta(rejection.data)){
					var confirm = getMdDialog()
					.confirm()
					.title("Attenzione Sessione Scaduta ! ")
					.textContent(rejection.data['messaggioSessioneScaduta'])
					.targetEvent(event)
					.ok("OK")
					;
				getMdDialog().show(confirm).then(function () {

					getAuthenticationService().doSessionLogoutPerSessioneScaduta();
					window.location.href = rejection.data['urlLogin'];
					return $q.reject(rejection);
				});
				}
				logger.groupError("response error");
				logger.error(rejection);
				logger.groupEndError();
				
				return $q.reject(rejection);
			}
		};
	}]);
	
}]);

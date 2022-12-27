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
angular.module('app').service('AuthenticationService',
	['$http', '$rootScope', 'loggers', 'browserStorage', 'events', 'conf', 'AuthLevel', 'notificationManager','entitiesRest',
	function(
		$http, $rootScope, loggers, browserStorage, events, conf, AuthLevel,notificationManager,entitiesRest
) {

	var self = this;
	var logger = loggers.get("srv-authentication");
	var AccountPortal = entitiesRest.getEntity('AccountPortal');
	var keyLocalStorageUtente = conf.codeName + "_utentecorrente";

	var utente = null;
	//self.granted = []; --> utente.abilitazioneSelezionata.userRole
	// self.memoryBucket = browserStorage.getSession().getBucket(keyLocalStorageUtente);
	self.memoryBucket = browserStorage.getLocal().getBucket(keyLocalStorageUtente);

	
		self.getSessionLogin = function () {
			//1-richiedo l'utente al back-end 
			//2-verifico quello che ho in sessione se sono uguali ==> imposto abilitazione selezionata come quello della sessione
			//3-se sono diversi carico quello della chiamata rest 
			var utentePortal = {};
			const utenteCorrente = self.memoryBucket.get();
			const url = conf.location.uaaApi + "/api/account";

			var request = new XMLHttpRequest();
			if (request != null) {
				request.onreadystatechange = function () {
					if (request.readyState == 4) {// 4 = "loaded"
						if (request.status == 200) {// 200 = OK
							angular.copy(JSON.parse(request.responseText), utentePortal);
							// self.setUtente(JSON.parse(request.responseText));
						} else {
							notificationManager.showErrorPopup('Si è verificato un errore durante il caricamento del profilo utente ');
							self.setUtente(null);
							logger.trace("La richiesta per " + url + "ha restituito codice " + request.status + " (" + request.statusText + ")");
						}
					}
				};
				request.open('GET', url, false);  // `false` makes the request synchronous !!!!!!!!!!!!!!!!!
				request.send(null);

				var shibsession_current = self.getCookie('_shibsession_');
				var shibsession_storage = window.localStorage['shibsession'];

				if (utenteCorrente !== undefined && (
						utenteCorrente.abilitazioneSelezionata 
						&& angular.equals(utenteCorrente.abilitazioneSelezionata, {}) 
						|| utenteCorrente.abilitazioneSelezionata === undefined) && utenteCorrente.elencoAbilitazioni.length > 0) {
					utenteCorrente.abilitazioneSelezionata = utenteCorrente.elencoAbilitazioni[0];
				}

				if (utenteCorrente && utenteCorrente !== undefined 
					&& utentePortal && utentePortal !== undefined 
					&& utenteCorrente.login !== utentePortal.login 
					&& utenteCorrente.marker && utentePortal.marker && utenteCorrente.marker != utentePortal.marker) {
					self.setUtente(utentePortal);

				} else if (utenteCorrente && utenteCorrente !== undefined 
					&& utenteCorrente.abilitazioneSelezionata 
					&& utenteCorrente.login === utentePortal.login 
					// fv - per ripristinare il profilo al reload della pagina commentare
					// && ( utenteCorrente.marker && utentePortal.marker && utenteCorrente.marker === utentePortal.marker)
					&& (shibsession_current && shibsession_storage && shibsession_current == shibsession_storage)
					) {
					self.changeAbil(utenteCorrente.abilitazioneSelezionata.id);
					self.setUtente(utenteCorrente);

				} else {
					self.setUtente(utentePortal);
				}

				if (shibsession_current) {
					window.localStorage['shibsession'] = shibsession_current;
				}

				// fv
				$rootScope.$broadcast(events.USER_CHANGED);
			}else{
				self.setUtente(null);
				notificationManager.showErrorPopup('Non è stato possibile caricare il  profilo utente ');
			}

			//ho provato in data 13/09/2019 a standardizzare il codice di invocazione come nelle altre chiamate 
			//non funge bene partono piu chiamata ecc 
			// AccountPortal.get({}).$promise.then(function (data) {
			// 	logger.info("SUCCESS", data);
			// 	angular.copy(data, utentePortal);
			// }, function (onfail) {
			// 	logger.error("ERROR", onfail);
			// 	self.setUtente(null);
			// 	notificationManager.showErrorPopup('Si è verificato un errore durante il caricamento del profilo utente ');
			// }).finally(function () {
			// 	if (utenteCorrente !== undefined && (utenteCorrente.abilitazioneSelezionata && angular.equals(utenteCorrente.abilitazioneSelezionata, {}) || utenteCorrente.abilitazioneSelezionata === undefined) && utenteCorrente.elencoAbilitazioni.length > 0) {
			// 		utenteCorrente.abilitazioneSelezionata = utenteCorrente.elencoAbilitazioni[0];
			// 	}

			// 	if (utenteCorrente && utenteCorrente !== undefined && utentePortal && utentePortal !== undefined && utenteCorrente.login !== utentePortal.login) {
			// 		utenteCorrente = utentePortal;
			// 		self.setUtente(utenteCorrente);
			// 	} else if (utenteCorrente && utenteCorrente !== undefined && utenteCorrente.abilitazioneSelezionata && utenteCorrente.login === utentePortal.login) {
			// 		self.changeAbil(utenteCorrente.abilitazioneSelezionata.id);
			// 		self.setUtente(utenteCorrente);
			// 	} else {
			// 		self.setUtente(utentePortal);
			// 	}
			// });

			
		};

	// useless
	// 	self.doSessionLogin = function (username, password) {
    // 	var url = conf.location.uaaApi + "/api/authentication";

    // 	var data = {
    // 		j_username : username,
    // 		j_password : password
    // 	};

    // 	var data = "j_username=" + encodeURIComponent(username) + "&j_password=" + encodeURIComponent(password);
    	
    // 	return $http.post(url, data, {
    // 		headers: {
	// 		    "Content-Type": "application/x-www-form-urlencoded",
	// 		    "Cache-Control": "no-cache"
	// 		  }
    // 	}).then(function(response){
    // 		logger.info("login successful", response.data);
    // 		return self.getSessionLogin();
    // 	});

    // };

	self.getCookie = function getCookie(cname) {
		// var name = cname + "=";
		var decodedCookie = decodeURIComponent(document.cookie);
		var ca = decodedCookie.split(';');
		for (var i = 0; i <ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) == ' ') {
				c = c.substring(1);
			}

			if (c.startsWith(cname)) {
				var iEq = c.indexOf("=");
				if (iEq > 0) {
					return c.substring(iEq, c.length);
				}
			}
		}
		return "";
	};
    
    self.doSessionLogout = function() {
		logger.trace("logging out current user");
		var url = utente.urlLogout;		
		$rootScope.utente = null;
		//se si vuole cancella tutto lo storage 
		// browserStorage.getLocal().clear();
		browserStorage.getLocal().getBucket(keyLocalStorageUtente).remove();

		$http.get(conf.location.uaaApi + "/api/logout");
	    return url;
    };
	
	self.doSessionLogoutPerSessioneScaduta = function() {
		$rootScope.utente = null;
		//se si vuole cancella tutto lo storage 
		// browserStorage.getLocal().clear();
		browserStorage.getLocal().getBucket(keyLocalStorageUtente).remove();
    };

    self.changeAbil = function(id) {
		logger.trace("Cambio di abilitazione");	
		$http.get(conf.location.uaaApi + "/api/account/changeAbil?id="+id);
	    return;
    };
		
	function testRuolo(abilitazione) {
		return Object.values(AuthLevel).some(function(role) {return role == abilitazione.userRole})
	}

	self.setUtente = function(user) {
		logger.trace("setting current user", user);

		// Verifica ruolo utente, se non è tra quelli previsti lo cancello.
		if (user.elencoAbilitazioni && user.elencoAbilitazioni.length > 0) {
			user.elencoAbilitazioni = user.elencoAbilitazioni.filter(testRuolo);
			if(user.abilitazioneSelezionata && !testRuolo(user.abilitazioneSelezionata)) {
				abilitazioneSelezionata = null;
			}
		}

		self.memoryBucket.set(user);
		$rootScope.utente = utente = user ? angular.copy(user) : null;
		
		$rootScope.$broadcast(events.USER_CHANGED);
	};
	
	
	
	self.ripristinaUtente = function() {
		/*var saved = self.memoryBucket.get();

		if (saved) {
			logger.info("ripristino utente salvato");
			self.setUtente(saved);
			
			self.getSessionLogin().then(function(data) {
				if (data.id != saved.id) {
					logger.info("deferred saved user invalidation");
					self.doSessionLogout();
					$state.go("app.login");
				}
			}, function(onfail) {
				logger.info("saved user invalidation");
				self.doSessionLogout();
				$state.go("app.login");
			});
		}*/
	};
	
    self.isPublic = function() {
        return !utente;
    };

    self.isLoggedIn = function() {
		return !!utente;
    };

	self.getUtente = function() {
		//ST: UTENTE_MOCK COMMENTARE prima di committare!!!
		//self.setUtente (MockService.getUserRolesNEWMock() ); 

		logger.info("chiedo utente!" + utente);
		if (!utente) {
			//logger.info("utente non trovato, richiesta :" + utente);
			self.getSessionLogin();
			return true;
		}
		return utente;
	};

	self.isGranted = function(exp) {
		var found = (""+exp).split(',').some(
			function (uc) {
				//return self.granted.some(
				//	function(grant) {
				//		return ("" + uc).trim() == ("" + grant);
				//});
				return uc.trim() === utente.abilitazioneSelezionata.userRole; 
		});
		//logger.trace("isGranted : ", exp, found);
		return found;
	};

}]);

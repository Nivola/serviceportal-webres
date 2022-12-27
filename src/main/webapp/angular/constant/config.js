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
nivolaApp.constant("conf", (function() {
	var loggerLevel = {
		LEVEL_EVERYTHING : { code : "every ",  priority :   0, printFunction : null },
		LEVEL_TRACE      : { code : "trace ",  priority :   1, printFunction : console.log },
		LEVEL_DEBUG      : { code : "debug ",  priority :   5, printFunction : console.log },
		LEVEL_INFO       : { code : "info  ",  priority :  10, printFunction : console.info },
		LEVEL_WARNING    : { code : "WARN  ",  priority :  20, printFunction : console.warn },
		LEVEL_ERROR      : { code : "ERROR ",  priority :  50, printFunction : console.error },
		LEVEL_CRITICAL   : { code : "CRITIC",  priority : 100, printFunction : console.error },
		LEVEL_SHUT_UP    : { code : "nothing", priority : 999, printFunction : null }
	};

	var profiliApplicativi = {};

	profiliApplicativi.ROOT = {
		loggerRootName : 	"nivolasp",
		codeName : 			"nivolasp",
		
		environment : "${webapp.profiles.active}",
		siteContext : "${webapp.context}",
		restContext : "RESTPROXY/",
		homeContext : "",

		location : {
			api : "",//api endpoint
			uaaApi : "",//endpoint authentication
			helpChat : "",//endpoint chat/helpcenter
			idToChat :"",//id for chat
			urlShibbCsi : "",//url for access through Shibb
			urlShibbRupar : "",//url for access through Shibb Rupar
			urlSpid : "",//url for access through SPID
			urlShibbSisp : "",//url for access through Shibb Sisp
			urlShibbCsiLogout : "",//url for logout through company
			urlShibbRuparLogout : "",//url for logout  through Shibb Rupar
			urlSpidLogout : "",//url for logout  through SPID
			urlShibbSispLogout : "",//url for logout  through Shibb SisP
			urlPhpMyAdmin:'',//phpMyAdmin
			urlPhpPgAdmin:'',//phpPgAdmin
			urlAdminer:''//adminer
		},
		
		envName : "ambiente generico (non parametrizzato)",
		isDev : false,
		forceRoleSelection : true,
		enableUCViewRestriction : true,
		enableUCStateRestriction : true,
		monitorGatewayConnection : false,
		gatewayIntervalPingWhenOnline : 60 * 1000,
		gatewayIntervalPingWhenOffline : 30 * 1000,
		
		/* root level : ereditato per i logger non configurati esplicitamente */
		"logger.nivolasp.level" : 						loggerLevel.LEVEL_ERROR,
		
		/* =========================================================================== */
		"logger.nivolasp.configuration.level": 					loggerLevel.LEVEL_ERROR,
		"logger.nivolasp.controller.level": 					loggerLevel.LEVEL_ERROR,
		"logger.nivolasp.controller-validator.level": 			loggerLevel.LEVEL_ERROR,
		"logger.nivolasp.dashboard-manager.level":				loggerLevel.LEVEL_ERROR,
		"logger.nivolasp.entitytransformer.level": 				loggerLevel.LEVEL_ERROR,
		"logger.nivolasp.http.level": 							loggerLevel.LEVEL_ERROR,		
		"logger.nivolasp.http-event-signaling.level": 			loggerLevel.LEVEL_ERROR,
		"logger.nivolasp.http-identity-checksum.level": 		loggerLevel.LEVEL_ERROR,
		"logger.nivolasp.listOrganizzazioniController.level":	loggerLevel.LEVEL_ERROR,
		"logger.nivolasp.logging.level":	 					loggerLevel.LEVEL_ERROR,
		"logger.nivolasp.mock-service.level": 					loggerLevel.LEVEL_ERROR,
		"logger.nivolasp.operation-queue.level": 				loggerLevel.LEVEL_ERROR,
		"logger.nivolasp.proxy.level":	 						loggerLevel.LEVEL_ERROR,
		"logger.nivolasp.resource-locator-service.level":		loggerLevel.LEVEL_ERROR,
		"logger.nivolasp.role-interceptor.level":	 			loggerLevel.LEVEL_ERROR,
		"logger.nivolasp.routing.level":	 					loggerLevel.LEVEL_ERROR,
		"logger.nivolasp.scrolling.level": 						loggerLevel.LEVEL_ERROR,
		"logger.nivolasp.service.level": 						loggerLevel.LEVEL_ERROR,
		"logger.nivolasp.service-dispatcher.level":				loggerLevel.LEVEL_ERROR,
		"logger.nivolasp.service-utente.level": 				loggerLevel.LEVEL_ERROR,
		"logger.nivolasp.sezioneMenuSp.level":					loggerLevel.LEVEL_ERROR,
		"logger.nivolasp.srv-authentication.level": 			loggerLevel.LEVEL_ERROR,
		"logger.nivolasp.srv-rest-client-factory.level":		loggerLevel.LEVEL_ERROR,
		"logger.nivolasp.srv-utente.level":                 	loggerLevel.LEVEL_ERROR,
		"logger.nivolasp.storage.level":	 					loggerLevel.LEVEL_ERROR,
		"logger.nivolasp.system-status.level": 					loggerLevel.LEVEL_ERROR,
		"logger.nivolasp.ListVmController.level": 				loggerLevel.LEVEL_ERROR,
		"logger.nivolasp.ListDbaasController.level": 			loggerLevel.LEVEL_ERROR,
		"logger.nivolasp.ListVolumesController.level":			loggerLevel.LEVEL_ERROR,
		"logger.nivolasp.ManageSgController.level": 			loggerLevel.LEVEL_ERROR,
		"logger.nivolasp.ListSgController.level": 				loggerLevel.LEVEL_ERROR,
		"logger.nivolasp.srv-readthedoc.level":					loggerLevel.LEVEL_ERROR

		/* =========================================================================== */
	};

	/* ===========================================================================
	 * 03.10.2019
	 * Aggiungo dei profili specifici per i tre pod di deploy to1, to2, vc	
	=========================================================================== */
	
	//profili specifici

	// costruisci facendo merging dei parent
	var buildConfiguration = function () {
		// prendo profilo da ambiente globale
		var nomeProfilo = profiliApplicativi.ROOT.environment;
		var configurationQueue = [];
		while (nomeProfilo) {
			profiloApplicativo = profiliApplicativi[nomeProfilo];
			configurationQueue.push(profiloApplicativo);
			nomeProfilo = profiloApplicativo.parent;
		}
		var configuration = {};
		while (configurationQueue.length > 0) {
			angular.extend(configuration, configurationQueue.pop());
		}
		delete configuration.parent;
		return configuration;
	}

	var appConf = buildConfiguration();
	appConf.loggerLevel = loggerLevel;

	return appConf;
})());
//GIT REFACTOR togliere https?

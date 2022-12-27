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
nivolaApp.service( 'serviziAccountDataProviderService', 
    ['$interval', 'entitiesRest', 'AuthenticationService', '$translate',
    function($interval, entitiesRest, AuthenticationService, $translate) {

    var service = this;
    var refreshInterval = 10 * 60 * 1000; // 5 minuti

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
		// INIZIALIZZATION
		widget.data = defaultData(widget.data);
		widget.loading = true;
		widget.failed = false;

		// LOAD DATA
		widget.loadData = function() {
            var utente = AuthenticationService.getUtente();

            // INVOCA SERVIZIO REST
			var entity = entitiesRest.getEntity('dashboardAccountActiveServices');
    		entity.get({'id':utente.abilitazioneSelezionata.accountUuid}).$promise
                .then(function(data) {
					temp = {
						computeService : {
							isActive : false,
							stato : $translate.instant('homepage.nessun_servizio_attivo')
						},
						dbaas : {
							isActive : false,
							stato : $translate.instant('homepage.nessun_servizio_attivo')
						},
						staas : {
							isActive : false,
							stato : $translate.instant('homepage.nessun_servizio_attivo')
						},
						appEngine : {
							isActive : false,
							stato : $translate.instant('homepage.nessun_servizio_attivo')
						}
					};
					// SERVIZI
					data.forEach(function(service){
						if (service.stato !== "ACTIVE") {
							return;
						}
						switch (service.tipoServizio) {
							case "ComputeService":
								temp.computeService = {
									isActive : true,
									stato : $translate.instant('homepage.servizio_attivo'),
									numeroIstanze : service.numeroIstanze
								};
								service.elencoMetriche.forEach(function(metriche){
									switch (metriche.metrica) {
									case "cores":
										temp.computeService.cpu = angular.copy(metriche);
										break;
									case "ram":
										temp.computeService.ram = angular.copy(metriche);
										break;
									case "blocks":
										temp.computeService.disco = angular.copy(metriche);
										break;
									case "floatingips":
										temp.computeService.ip = angular.copy(metriche);
										break;
									}
								});
								break;
							case "DatabaseService":
								temp.dbaas = {
									isActive : true,
									stato : $translate.instant('homepage.servizio_attivo'),
									// numeroIstanze : service.numeroIstanze
									
								};
								service.elencoMetriche.forEach(function(metriche){
									switch (metriche.metrica) {
									case "cores":
										temp.dbaas.cpu = angular.copy(metriche);
										break;
									case "ram":
										temp.dbaas.ram = angular.copy(metriche);
										break;
									case "db_numero_istanze_tot":
										temp.dbaas.numeroIstanze = angular.copy(metriche.valore);
										break;
									}
								});
								break;
							case "StorageService":
								temp.staas = {
									isActive : true,
									stato : $translate.instant('homepage.servizio_attivo'),
									numeroIstanze : service.numeroIstanze
								};
								service.elencoMetriche.forEach(function(metriche){
									switch (metriche.metrica) {
									case "blocks":
										temp.staas.disco = angular.copy(metriche);
										break;
									case "sd_gdisk_low":
										temp.staas.spazioDisco = angular.copy(metriche.valore);
										break;
									}
								});
								break;
							case "AppEngineService":
								temp.appEngine = {
									isActive : true,
									stato : $translate.instant('homepage.servizio_attivo'),
									numeroIstanze : service.numeroIstanze
								};
								service.elencoMetriche.forEach(function(metriche){
									switch (metriche.metrica) {
									case "vcore":
										temp.appEngine.cpu = angular.copy(metriche);
										break;
									case "Ram":
										temp.appEngine.ram = angular.copy(metriche);
										break;
									case "Disco":
										temp.appEngine.disco = angular.copy(metriche);
										break;
									}
								});
								break;
						}	
					});							

					widget.data = temp;
				    widget.loading = false;
			    }).catch(function() {
			        widget.data = {};
			        widget.loading = false;
			        widget.failed = true;
                });
		};
		
		// FUNCTION CALLBACKS
		//widget.callbacks = {
		//};
		if (widget.data.refreshAutomatico) {
			service.intervalHandler = $interval(widget.loadData, refreshInterval);
		}
		widget.loadData();
	};
	
	//service.eventCallback = function(e, widget){};

	service.finalize = function() {
		if (service.intervalHandler) {
			$interval.cancel(service.intervalHandler);
		}
    };
}]);

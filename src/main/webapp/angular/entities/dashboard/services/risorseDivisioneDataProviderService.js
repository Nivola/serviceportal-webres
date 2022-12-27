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
nivolaApp.service( 'risorseDivisioneDataProviderService',
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
			var entity = entitiesRest.getEntity('dashboardDivisioneRisorse');
    		entity.get({'id':utente.abilitazioneSelezionata.divUuid}).$promise
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

                    // Accounts
                    temp.numeroAccounts = data.numeroAccounts;
					// SERVIZI
					data.elencoServizi.forEach(function(service){
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
									case "vm_vcpu_tot":
										temp.computeService.cpu = angular.copy(metriche);
										break;
									case "vm_gbram_tot":
										temp.computeService.ram = angular.copy(metriche);
										break;
									case "vm_numero_vm_tot":
										temp.computeService.vm = angular.copy(metriche);
										break;
									// case "Public_Ip":
									// 	temp.computeService.ipPubblici = angular.copy(metriche);
									// 	break;
									// case "Windows licence":
									// 	temp.computeService.windows = angular.copy(metriche);
									// 	break;
									}
								});
								break;
							case "DatabaseService":
								temp.dbaas = {
									isActive : true,
									stato : $translate.instant('homepage.servizio_attivo'),
									numeroIstanze : service.numeroIstanze
								};
								service.elencoMetriche.forEach(function(metriche){
									switch (metriche.metrica) {
									case "db_numero_istanze_tot":
										temp.dbaas.istanze = angular.copy(metriche);
										break;
									case "db_gbram_tot":
										temp.dbaas.ram = angular.copy(metriche);
										break;
									case "db_gbdisk_tot":
										temp.dbaas.disco = angular.copy(metriche);
										break;
									}
								});
								break;
							case "StorageService":
								temp.staas = {
									isActive : true,
									stato : $translate.instant('homepage.servizio_attivo'),
									numeroIstanze : service.numeroIstanze,
									disco : service.elencoMetriche.length > 0 ? angular.copy(service.elencoMetriche[0]) : null
								};
								
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
					// IMPOSTA DATI
					
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

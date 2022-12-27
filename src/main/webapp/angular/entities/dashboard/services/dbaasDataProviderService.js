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
nivolaApp.service( 'dbaasDataProviderService',
    ['$interval', 'entitiesRest', 'AuthenticationService', 'AuthLevel', '$translate',
    function($interval, entitiesRest, AuthenticationService,AuthLevel, $translate) {

    var service = this;
    var refreshInterval = 10 * 60 * 1000; // 10 minuti

	function defaultData(orig) {
		var res = {
			idDivisione: undefined,
			accountUuid: AuthenticationService.getUtente().abilitazioneSelezionata.accountUuid,
			refreshAutomatico: false,
			requiredUC: [AuthLevel.AccountViewerRole, AuthLevel.AccountOperatorRole, AuthLevel.AccountAdminRole].join(),
			dettaglioRoute: 'app.dbaas'
		};
		if (orig) {
			if (orig.accountUuid !== undefined) {
				res.accountUuid = orig.accountUuid;
				res.requiredUC = [AuthLevel.AccountViewerRole, AuthLevel.AccountOperatorRole, AuthLevel.AccountAdminRole].join(),
					res.dettaglioRoute = 'app.dbaas'
			}
			if (orig.refreshAutomatico !== undefined) {
				res.refreshAutomatico = orig.refreshAutomatico;
			}
			//vuole dire voglio avere il compute della divisione
			if (orig.divisioneUuid !== undefined) {
				res.divisioneUuid = orig.divisioneUuid;
				res.accountUuid = undefined;
				//non e' chiaro ancora il tasto come e quando abilitarlo per ora setto undefined requiredUC per disabilitarlo
				res.requiredUC = [AuthLevel.DivViewerRole, AuthLevel.DivOperatorRole, AuthLevel.DivAdminRole].join(),
				res.dettaglioRoute = 'app.dbaas',
				res.requiredUC = undefined
			}
			if (orig.requiredUC !== undefined) {
				res.requiredUC = orig.requiredUC;
			}
		}
		return res;
	}


	function loadDataAccount(widget) {
			// INVOCA SERVIZIO REST
			var entity = entitiesRest.getEntity('dashboardAccountActiveServices');
    		entity.getOneService({'id':widget.data.accountUuid, 'tipoServizio': entity.tipiServizi.DatabaseService}).$promise
                .then(function(data) {
                    temp = {};
					if (data && data[0].stato === "ACTIVE") {
						temp.dbaas = {
							isActive : true,
							stato : $translate.instant('homepage.servizio_attivo'),
							numeroIstanze : data[0].numeroIstanze
						};
						data[0].elencoMetriche.forEach(function(metriche){
							switch (metriche.metrica) {
								// case "cores":
								// 	temp.dbaas.cpu = angular.copy(metriche);
								// 	break;
								// case "ram":
								// 	temp.dbaas.ram = angular.copy(metriche);
								// 	break;
								case "db_vcpu_tot":
									temp.dbaas.cpu = angular.copy(metriche);
									break;
								case "db_gbram_tot":
									temp.dbaas.ram = angular.copy(metriche);
									break;
								case "db_gbdisk_tot":
									temp.dbaas.disco = angular.copy(metriche);
									break;
								case "db_numero_istanze_tot":
									temp.dbaas.numero_istanze = angular.copy(metriche);
									break;
							}
						});
					} else {
						temp.dbaas = {
							isActive : false,
							stato : $translate.instant('homepage.nessun_servizio_attivo')
						};
					}								

				    // IMPOSTA DATI
				    widget.data = temp;
				    widget.loading = false;
				    
			    }).catch(function() {
			        widget.data = {};
			        widget.loading = false;
			        widget.failed = true;
                });
	};

	function loadDataDivisione(widget) {
		// INVOCA SERVIZIO REST
		var entity = entitiesRest.getEntity('dashboardDivisioneRisorse');
		entity.get({ 'id': widget.conf.divisioneUuid }).$promise
			.then(function (data) {
				temp = {
					computeService: {
						isActive: false,
						stato: $translate.instant('homepage.nessun_servizio_attivo')
					}
				};
				// SERVIZI
				
				data.elencoServizi.forEach(function (service) {
					if (service.stato !== "ACTIVE") {
						return;
					}
					if(service.tipoServizio.toLowerCase() === "databaseservice"){
							temp.dbaas = {
								isActive: true,
								stato: $translate.instant('homepage.servizio_attivo'),
								numeroIstanze: service.numeroIstanze
							};
							service.elencoMetriche.forEach(function (metriche) {
								switch (metriche.metrica.toLowerCase()) {
									case "cores":
										temp.dbaas.cpu = angular.copy(metriche);
										break;
									case "db_numero_istanze_tot":
										temp.dbaas.numeroIstanze = metriche.valore;
										break;
									case "db_gbram_tot":
										temp.dbaas.ram = angular.copy(metriche);
										break;
									case "db_gbdisk_tot":
										temp.dbaas.disco = angular.copy(metriche);
										break;
										
								}
							});
					}

				});
				// IMPOSTA DATI
				widget.data = temp;
				widget.loading = false;
			}).catch(function () {
				widget.data = {};
				widget.loading = false;
				widget.failed = true;
			});
	};

	service.provide = function (widget) {
		// INIZIALIZZATION
		widget.conf = widget.data = defaultData(widget.data);
		widget.loading = true;
		widget.failed = false;

		// LOAD DATA
		widget.loadData = function () {
			if (widget.data.accountUuid) {
				loadDataAccount(widget);
			} else {
				loadDataDivisione(widget);
			}
		};

		if (widget.data.refreshAutomatico) {
			service.intervalHandler = $interval(widget.loadData, refreshInterval);
		}
		widget.loadData();
	};

	service.finalize = function() {
		if (service.intervalHandler) {
			$interval.cancel(service.intervalHandler);
		}
    };
}]);

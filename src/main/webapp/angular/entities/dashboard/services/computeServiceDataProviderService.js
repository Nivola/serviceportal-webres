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
nivolaApp.service('computeServiceDataProviderService',
	['$interval', 'entitiesRest', 'AuthenticationService', 'AuthLevel', '$translate',
		function ($interval, entitiesRest, AuthenticationService, AuthLevel, $translate) {

			var service = this;
			var refreshInterval = 10 * 60 * 1000; // 5 minuti

			function defaultData(orig) {
				var res = {
					idDivisione: undefined,
					accountUuid: AuthenticationService.getUtente().abilitazioneSelezionata.accountUuid,
					refreshAutomatico: false,
					requiredUC: [AuthLevel.AccountViewerRole, AuthLevel.AccountOperatorRole, AuthLevel.AccountAdminRole].join(),
					dettaglioRoute: 'app.vm'
				};
				if (orig) {
					
					if(res.accountUuid){
						orig.accountUuid=undefined; 
					}
					if (orig.accountUuid !== undefined) {
						res.accountUuid = orig.accountUuid;
						res.requiredUC = [AuthLevel.AccountViewerRole, AuthLevel.AccountOperatorRole, AuthLevel.AccountAdminRole].join(),
							res.dettaglioRoute = 'app.vm'
							
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
						res.dettaglioRoute = 'app.vm',
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
				entity.getOneService({ 'id': widget.data.accountUuid, 'tipoServizio': entity.tipiServizi.ComputeService }).$promise
					.then(function (data) {
					console.log("function loadDataAccount(widget)   computeServicedataProviderService"); 
						temp = {};
						if (data && data[0].stato === "ACTIVE") {
							temp.computeService = {
								isActive: true,
								stato: $translate.instant('homepage.servizio_attivo'),
								numeroIstanze: data[0].numeroIstanze
							};
							data[0].elencoMetriche.forEach(function (metriche) {
								switch (metriche.metrica.toLowerCase()) {
									case "vm_vcpu_tot":
										temp.computeService.cpu = angular.copy(metriche);
										break;
									case "vm_gbram_tot":
										temp.computeService.ram = angular.copy(metriche);
										break;
									case "vm_gbdisk_tot":
										temp.computeService.disco = angular.copy(metriche);
										break;
									case "floatingips":
										temp.computeService.ip = angular.copy(metriche);
										break;
								}
							});
						} else {
							temp.computeService = {
								isActive: false,
								stato: $translate.instant('homepage.nessun_servizio_attivo')
							};
						};								

						// IMPOSTA DATI
						widget.data = temp;
						widget.loading = false;


						
						
					}).catch(function () {
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
							
							if(service.tipoServizio.toLowerCase() === "computeservice"){
									temp.computeService = {
										isActive: true,
										stato: $translate.instant('homepage.servizio_attivo'),
										numeroIstanze: service.numeroIstanze
									};
									service.elencoMetriche.forEach(function (metriche) {
										switch (metriche.metrica.toLowerCase()) {
											case "vm_vcpu_tot":
												temp.computeService.cpu = angular.copy(metriche);
												break;
											case "vm_gbram_tot":
												temp.computeService.ram = angular.copy(metriche);
												break;
											case "vm_gbdisk_tot":
												temp.computeService.disco = angular.copy(metriche);
												break;
											case "vm_numero_vm_tot":
												temp.computeService.numeroIstanze = metriche.valore;
												break;
											case "floatingips":
												temp.computeService.ip = angular.copy(metriche);
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

				// FUNCTION CALLBACKS
				//widget.callbacks = {
				//};

				if (widget.data.refreshAutomatico) {
					service.intervalHandler = $interval(widget.loadData, refreshInterval);
				}
				widget.loadData();
			};

			//service.eventCallback = function(e, widget){};

			service.finalize = function () {
				if (service.intervalHandler) {
					$interval.cancel(service.intervalHandler);
				}
			};
		}]);

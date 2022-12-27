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
nivolaApp.controller('ListDbaasController',
	["$scope", "$state", "$stateParams", "$filter", "$mdDialog", 'ReadthedocService',
		"entitiesRest", "controllerValidator", "notificationManager", 'loggers', 'AuthenticationService', '$translate',"$rootScope",
		function ($scope, $state, $stateParams, $filter, $mdDialog, ReadthedocService,
			entitiesRest, controllerValidator, notificationManager, loggers, AuthenticationService, $translate,$rootScope) {
			"use strict";

			var logger = loggers.get("ListDbaasController");
			var Dbaas = entitiesRest.getEntity('Dbaas');
			var ReportcsvDB = entitiesRest.getEntity('ReportcsvDB');
			
			
			$scope.rtdDbaasList=ReadthedocService.getUrlFromPath('/dbaas/list').docUrl;  
			
			$scope.dbaas = [];
			
			$scope.selected = [];

			// Proprietà data-table
			$scope.options = {
				rowSelection: true,
				multiSelect: false,
				autoSelect: true,
				decapitate: false,
				largeEditDialog: false,
				boundaryLinks: false,
				limitSelect: true,
				pageSelect: true
			};

			$scope.limitOptions = [ 10, 20, 30];

			$scope.filter = {
				options: {
					debounce: 500
				}
			};

			$scope.query = {
				order: "nome",
				limit: 10,
				page: 1
			};

			$scope.actions = {
				auth: {
					new: $state.get("app.dbaas.new").requiredUC,
					manage: $state.get("app.dbaas.manage").requiredUC,
					delete: $state.get("app.dbaas.new").requiredUC,
					connect: $state.get("app.dbaas.new").requiredUC,
					change: $state.get("app.dbaas.change").requiredUC,
				},

				refresh: getDbaas,

				manage: function () {
					$state.go("app.dbaas.manage", { 
						dbaasId: $scope.selected[0].instanceId

					});
				},

				add: function () {
					$state.go("app.dbaas.new");
				},

				change: function () {
					$state.go("app.dbaas.change", {

					});
				},

				connect: function (ev) {
					$mdDialog.show({
						locals: {
							vmSelected: $scope.selected
						},
						controller: 'DialogConnectDbaasController',
						templateUrl: 'angular/entities/compute/dbaas/tpl-dialog-connect-db.html',
						parent: angular.element(document.body),
						targetEvent: ev,
						clickOutsideToClose: true,
						fullscreen: true	// Only for -xs, -sm breakpoints.
					});
				},
				delete: function (event) {
					$mdDialog.show({
						locals: {
							dbassSelected: $scope.selected,
							mdDialog: $mdDialog,
						},
						controller: 'DialogDeleteController',
						templateUrl: 'angular/entities/compute/dbaas/tpl-dialog-delete-db.html',
						parent: angular.element(document.body),
						targetEvent: event,
						clickOutsideToClose: true,
						fullscreen: true	// Only for -xs, -sm breakpoints.
					})
						.then(function () {
							//ha cliccato conferma della dialog
							Dbaas.delete({ id: $scope.selected[0].instanceId }, function (data) {
								logger.info("SUCCESS", data);

								var datiTesto = {
									nome: $scope.selected[0].nome
								}
								notificationManager.showSuccessPopup($translate.instant('dbaas.elimina.success', datiTesto));

								$mdDialog.hide();
								// Reset lista
								$scope.unselectAll();
								$scope.resetFilter();
								// Aggiorno lista istanze
								getDbaas();
							}, function (onfail) {
								logger.error("ERROR", onfail);
								
								if (onfail.data && onfail.data.message) {
									notificationManager.showErrorPopup($translate.instant('dbaas.elimina.error') + ': ' + onfail.data.message);
								} else {
									notificationManager.showErrorPopup($translate.instant('dbaas.elimina.error'));
								}
							});
						}, function () {
							//ha cliccato annulla della dialog
						});
				}, 

				
                downloadCSV:  function (event) {
					setTimeout(() => {
						if($scope.promise.$$state.status===0){
							$rootScope.loadingElement = true;
						}
					}, 1000);
                    event.preventDefault();
                    
                   
                   
                    $scope.promise = ReportcsvDB.get().$promise;
            
                    $scope.promise.then(function (data) {
                    //lo trasformo in arrayBuffer
                    console.log(data)
                        var binary_string =  window.atob(data.report);
                        var filename = data.nomeFile;
                        var len = binary_string.length;
                        var bytes = new Uint8Array( len );
                        for (var i = 0; i < len; i++)        {
                            bytes[i] = binary_string.charCodeAt(i);
                        }
            
                        if (window.navigator.msSaveBlob) { // IE 10+
                            let currentBlob = new Blob([bytes.buffer], {type: 'text/csv'});
                            window.navigator.msSaveOrOpenBlob(currentBlob, filename);
                        } else {
                            try {
                                var link = document.createElement('a'); //create link download file
                                let currentBlob = new Blob([bytes.buffer], {type: 'text/csv'});
                                link.href = window.URL.createObjectURL(currentBlob); // set url for link download
                                link.setAttribute('download', filename); //set attribute for link created
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                            } catch (ex) {
                                notificationManager.showErrorPopup($translate.instant("error.download_file"));
                            }
                        }
                    }, function (onfail) {
                        logger.error("ERROR", onfail);
                        notificationManager.showErrorPopup($translate.instant("error.loading_allegato"));
                    }).finally(function() {
						$rootScope.loadingElement = false;
						//off()
					});
            
            
                },
		
			};

			$scope.resetFilter = function () {
				$scope.filter.search = '';
				$scope.query.filter = '';

				if ($scope.filter.form.$dirty) {
					$scope.filter.form.$setPristine();
				}
			};

			$scope.unselectAll = function () {
				$scope.selected = [];
			};

			

			function getDbaas() {
				setTimeout(() => {
					if($scope.promise.$$state.status===0){
						$rootScope.loadingElement = true;
					}
				}, 1000);
				var queryString = {};
				if ($scope.accountUuid) {
					queryString.accountUuid = $scope.accountUuid;
				}

				$scope.promise = Dbaas.query(queryString).$promise;

				return $scope.promise.then(function (data) {
					logger.info("SUCCESS", data);
					data.forEach(function (value) {
						value.cpu_ram = '';
						if (value.cpu != null && value.ram != null) {
							value.cpu_ram = value.cpu + ' CPU, ';
						}
						if (value.ram != null) {
							value.cpu_ram = value.cpu_ram + value.ram + ' RAM';
						}

						value.tags='';
						if(value.elencoTag && value.elencoTag.length!=0){
							value.elencoTag.forEach(function (v) {
								value.tags=  value.tags+"  "+v.key; 
							});
						}
						value.region_az = value.region + ' - ' + value.az;

						var  sBadge = null; 
                        var  sStato = null; 

                        if(value.status !== null){
                            if (value.status.toLowerCase() === "available") {
                                sBadge= "badge badge-success";
                                sStato =$translate.instant('dbaas.statoText.available');

                            } else if (value.status.toLowerCase() === "pending") {
                                sBadge= "badge badge-warning";
                                sStato =$translate.instant('dbaas.statoText.pending');

                            }else if (value.status.toLowerCase() === "stopped") {
                                sBadge= "badge badge-secondary";
                                sStato =$translate.instant('dbaas.statoText.stopped');

                            }else if (value.status.toLowerCase() === "error") {
                                sBadge= "badge badge-danger";
                                sStato =$translate.instant('dbaas.statoText.errore');

                            }
                            else if (value.status.toLowerCase() === "unknown") {
                                sBadge= "badge badge-warning";
                                sStato =$translate.instant('dbaas.statoText.unknow');

                            }
                            else{
                                sBadge= "badge badge-light";
                                sStato =value.status ;
                            }
                        }

						value.stato = {
							badge: sBadge,
							stato: sStato
						};

					});

					$scope.dbaas = data;

					$scope.numeroAttivi = $filter("filter")(data, { status: 'attivo' }).length;
					$scope.numeroDisattivi = $filter("filter")(data, { status: 'sospeso' }).length;
				}, function (onfail) {
					logger.error("ERROR", onfail);
					if (onfail.data && onfail.data.message) {
						notificationManager.showErrorPopup($translate.instant('error.loading_istanze') + ': ' + onfail.data.message);
					} else {
						notificationManager.showErrorPopup($translate.instant('error.loading_istanze'));
					}
				}).finally(function() {
					 $rootScope.loadingElement = false;
				});
			};



			


			this.onInit = function () {
				var abilitazione = AuthenticationService.getUtente().abilitazioneSelezionata;
				logger.debug("Abilitazione corrente", abilitazione);

				// Recupero Uuid dell'Account a cui l'agente appartiene
				// NOTE: filtro su accountUUID eseguito sul backend
				// $scope.accountUuid = abilitazione.accountUuid;

				getDbaas();
				
			};

			this.onExit = function () { };

			controllerValidator.validate(this, $scope);
		}
	]);

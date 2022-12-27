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
nivolaApp.controller('NuovoVolumeController',
	["$scope", "$state", "$stateParams", "$filter",'$window', 'ReadthedocService',
		"entitiesRest", "controllerValidator", "notificationManager", 'loggers',
		'VmIstanzeService', '$q', 'AuthenticationService', '$translate', 
		function ($scope, $state, $stateParams, $filter,$window, ReadthedocService,
			entitiesRest, controllerValidator, notificationManager, loggers,
			VmIstanzeService, $q, AuthenticationService, $translate) {
			'use strict';

		
			var logger = loggers.get("NuovoVolumeController");
			var Staas = entitiesRest.getEntity('Staas');
			var Subnet = entitiesRest.getEntity('Subnet');
			var StaasTypes = entitiesRest.getEntity('StaasTypes');
			var AvailabilityZone = entitiesRest.getEntity('AvailabilityZone');
			var StimaCostiStaas = entitiesRest.getEntity('StimaCostiStaas');
			
			$scope.rtdStaasNew=ReadthedocService.getUrlFromPath('/staas/new').docUrl;

			$scope.accountUuid = null;
			$scope.staas = {
				//staas
				staas: null,
				availableStaasTypes: [],
				availableStaasSizings: [20 , 30 , 40, 50, 75 , 100 , 125 , 150 , 175 , 200 , 250 ,300 , 350 , 400 ,450, 500],
				
				selectedIndex: null,
				selectedStaasName:null,
				selectedStaasSize: null,
				selectedStaasType: null,

			};
			$scope.subnet={
				availableSubnets: [],
				availableProtocol: ["nfs","cifs"],
                availableRegions: [],
				availableAvailabilityZones: [],
				selectedRegion: null,
				selectedAvailabilityZone: null,
				selectedSubnet: null,
				selectedProtocol:"NFS"

			};

			$scope.status = {
				tagsReadOnly: false,
				tagsRemovable: true,
				tabIndex: 0
			};

			$scope.actions = {
				gotoTab: null
			};
			
			$scope.actions.onTabSelected = function (index) {
                
                setTimeout(function(){getCostiStimati();  }, 1000);
                
			};

			function getCostiStimati() {
				 var params = {

					dimensione: parseInt($scope.staas.selectedStaasSize),
					accountId :  AuthenticationService.getUtente().abilitazioneSelezionata.accountUuid,

				 }; 
					$scope.promise = StimaCostiStaas.get(params).$promise;
				
					
					return $scope.promise.then(function (data) {
						logger.info("SUCCESS", data);
						console.log(JSON.stringify(data)); 
						$scope.costi = data; 
						//calculate costi dischi vari 
						$scope.costoTotDischi = 0; 
						
		
		
					}, function (onfail) {
						logger.error("ERROR", onfail);
						if (onfail.body && onfail.body.data && onfail.body.data.message) {
							notificationManager.showErrorPopup($translate.instant('error.loading_costi') + ': ' + onfail.body.data.message);
						} else if (onfail.data.messaggio){
							notificationManager.showErrorPopup($translate.instant('error.loading_costi') + ': ', onfail.data.messaggio);
						}else{
							notificationManager.showErrorPopup($translate.instant('error.loading_costi'));
						}
					});
			};
			
		 




			$scope.actions.gotoTab = function (index) {
				$scope.status.tabIndex = index;
			};

			$scope.historyBack = function(){
				$window.history.back();
			}


			$scope.submit = function () {
				var requestBody = {
					name: $scope.staas.selectedStaasName,
					dimensione: parseInt($scope.staas.selectedStaasSize),
					tipo: $scope.staas.selectedStaasType,
					protocolloShare: angular.lowercase($scope.subnet.selectedProtocol),
					subnetId: $scope.fromIdToObj($scope.subnet.availableSubnets, $scope.subnet.selectedSubnet).subnetId,
				}
				$scope.requestBody = JSON.stringify(requestBody);

				 $scope.status.pending = true;
				Staas.save(requestBody, function (data) {
					logger.info('SUCCESS', data);
					notificationManager.showSuccessPopup($translate.instant('shares.nuova.success') + ':' + data.message);
					$state.go('app.volumes');
	
				}, function (onfail) {

					if (onfail.body && onfail.body.data && onfail.body.data.message) {
						notificationManager.showErrorPopup($translate.instant('shares.nuova.error') + ': ' + onfail.body.data.message);
					} else if (onfail.data.messaggio){
						notificationManager.showErrorPopup($translate.instant('shares.nuova.error'), onfail.data.messaggio);
					}else{
						notificationManager.showErrorPopup($translate.instant('shares.nuova.error'));
					}

					
				}).$promise.finally(function () {
					$scope.status.pending = false;
				});
			
			};


			function getStaasTypes() {
				var queryString = {};

				$scope.promise = StaasTypes.query(queryString).$promise;

				return $scope.promise.then(function (data) {
					
					$scope.staas.availableStaasTypes=data;
				 
				}, function (onfail) {
						notificationManager.showErrorPopup($translate.instant('error.loading_staas'));
				});
			};
			$scope.azToSite = function (az) {
				switch (az) {
					case "SiteTorino01":
						return "site01";
					case "SiteTorino02":
						return "site02";
					case "SiteVercelli01":
						return "site03";
					default:
						return az;
				}
			};
            
			function getSubnets() {
				var queryString = {};
				if ($scope.accountUuid) {
					queryString.accountUuid = $scope.accountUuid;
				}
				$scope.promise = Subnet.query(queryString).$promise;

				return $scope.promise.then(function (data) {

					data.forEach(subnet => {
						$scope.subnet.availableSubnets.push(
							{
								id: subnet.id ? subnet.id : $scope.subnet.availableSubnets.length + 1,
								subnetId:subnet.subnetId,
								availabilityZone: subnet.availabilityZone,
								vpcId: subnet.vpcId,
								description: subnet.nvlName,
								default: subnet.defaultForAz
							}
						);
					});
				}, function (onfail) {

					if (onfail.body && onfail.body.data && onfail.body.data.message) {
						notificationManager.showErrorPopup($translate.instant('error.loading_subnet') + ': ' + onfail.body.data.message);
					} else if (onfail.data.messaggio){
						notificationManager.showErrorPopup($translate.instant('error.loading_subnet'), onfail.data.messaggio);
					}else{
						notificationManager.showErrorPopup($translate.instant('error.loading_subnet'));
					}

					
				});
			};
			$scope.fromIdToObj = function (list, id) {
				var filtered = list.filter(obj => { return obj.id == id; });
				return filtered ? filtered[0] : None;
			};
            
            function getAvailabilityZones() {
				var queryString = {};
				if ($scope.accountUuid) {
					queryString.accountUuid = $scope.accountUuid;
				}
				$scope.promise = AvailabilityZone.query(queryString).$promise;
				return $scope.promise.then(function (data) {
					logger.info("SUCCESS", data);
					
					data.forEach(region => {
						
						$scope.subnet.availableRegions.push(
							{
								id: region.regionUuid ? region.regionUuid : $scope.subnet.availableRegions.length + 1,
								// code: region.code,
								description: region.regionName,
								default: true
							}
						);

						region.elencoAz.forEach(az => {
							$scope.subnet.availableAvailabilityZones.push(
								{
									id: az.zoneUuid ? az.zoneUuid : $scope.subnet.availableAvailabilityZones.length + 1,
									regionName: region.regionName,
									// code: az.code,
									site: az.site ? az.site : $scope.azToSite(az.zoneName),
									description: az.zoneName,
									default: $scope.azToSite(az.zoneName) === "site01"
								}
							);
						});
					});
				}, function (onfail) {
					logger.error("ERROR", onfail);

					if (onfail.body && onfail.body.data && onfail.body.data.message) {
						notificationManager.showErrorPopup($translate.instant('error.loading_zone') + ': ' + onfail.body.data.message);
					} else if (onfail.data.messaggio){
						notificationManager.showErrorPopup($translate.instant('error.loading_zone'), onfail.data.messaggio);
					}else{
						notificationManager.showErrorPopup($translate.instant('error.loading_zone'));
					}

				});
			};


			this.onInit = function () {
				var abilitazione = AuthenticationService.getUtente().abilitazioneSelezionata;
				$scope.accountUuid = abilitazione.accountUuid;
				getSubnets();
				getStaasTypes() ;
				//FIX ME - LG 29.10.2019 da rimuovere quando le AZ torneranno disponibili!!!
				// $scope.subnet.availableRegions.push(
				// {
				// 	id: $scope.subnet.availableRegions.length + 1,
				// 	description: "RegionPiemonte01",
				// 	default: true
				// });
				// $scope.subnet.selectedRegion = $scope.subnet.availableRegions[0].id ;
				
				// $scope.subnet.availableAvailabilityZones.push(
				// {
				// 	id: $scope.subnet.availableAvailabilityZones.length + 1,
				// 	regionName: "RegionPiemonte01",
				// 	site: "site01",
				// 	description: "SiteTorino01",
				// 	default: true
				// });
				// $scope.subnet.availableAvailabilityZones.push(
				// {
				// 	id: $scope.subnet.availableAvailabilityZones.length + 1,
				// 	regionName: "RegionPiemonte01",
				// 	site: "site02",
				// 	description: "SiteTorino02",
				// 	default: false
				// });
				// $scope.subnet.availableAvailabilityZones.push(
				// {
				// 	id: $scope.subnet.availableAvailabilityZones.length + 1,
				// 	regionName: "RegionPiemonte01",
				// 	site: "site03",
				// 	description: "SiteVercelli01",
				// 	default: false
				// });
				// FIX ME
				
				
				getAvailabilityZones().then(
					function (onSuccess) {
						$scope.subnet.selectedRegion = $.grep($scope.subnet.availableRegions, function (candidate) {
							return candidate.default === true;
						})[0].id;

						$scope.subnet.selectedAvailabilityZone = $.grep($scope.subnet.availableAvailabilityZones, function (candidate) {
							return candidate.default === true;
						})[0].id;
					}
				);

				

			};

			this.onExit = function () {
			};

			controllerValidator.validate(this, $scope);
		}
	]);

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
"use strict";

angular.module('app')

	.controller('NewVolumeController', ['$mdDialog', '$scope', '$state', '$q','ReadthedocService',
		'AuthLevel', 'entitiesRest', 'controllerValidator', 'VmIstanzeService',
		'notificationManager', "$filter",  'loggers', 'conf','StringMap','AuthenticationService', '$translate',
		function ($mdDialog, $scope, $state, $q,ReadthedocService, 
			AuthLevel, entitiesRest, controllerValidator, VmIstanzeService,
			notificationManager, $filter,  loggers, conf,StringMap,AuthenticationService, $translate) {
			'use strict';

		
			var logger = loggers.get("NewVolumeController");
			
			$scope.rtdnewVolume=ReadthedocService.getUrlFromPath('/index').docUrl;
			var AvailabilityZone = entitiesRest.getEntity('AvailabilityZone');
			var ComputeVolumesTypes = entitiesRest.getEntity('ComputeVolumesTypes');
			var ComputeVolumes = entitiesRest.getEntity('ComputeVolumes');

			$scope.actions ={
				
				invia: function () {
					$scope.newVol.encrypted = "true" ? true : false
					$scope.newVol.multiAttachEnabled = "true" ? true : false
					console.log(JSON.stringify($scope.newVol)); 
					ComputeVolumes.save($scope.newVol, function (data) {
						logger.info('SUCCESS', data);
						notificationManager.showSuccessPopup($translate.instant('volume.nuovo.success'));
						$state.go('app.volume');
					}, function (onfail) {
						logger.error('ERROR', onfail);
						if (onfail.body) {
							if (onfail.body && onfail.body.data && onfail.body.data.message) {
								notificationManager.showErrorPopup($translate.instant('volume.nuovo.error') + ': ' + onfail.body.data.message);
							} else {
								notificationManager.showErrorPopup($translate.instant('volume.nuovo.error'));
							}
						} else if (onfail.data.message){
							notificationManager.showErrorPopup($translate.instant('volume.nuovo.error'), onfail.data.message);
						}else{
							notificationManager.showErrorPopup($translate.instant('volume.nuovo.error'));
						}
					}).$promise.finally(function () {
						$scope.status.pending = false;
					});
				},

			}

			var utente = AuthenticationService.getUtente(); //.abilitazioneSelezionata
			
			$scope.volume = {
				availableSizings: [],
				availableSecurityGroups: [],
				availableDiskSizings: [],
				availableRegions: [],
				availableAvailabilityZones: [],
				selectedVmName: null,
				selectedSize: [],
				selectedDiskSize: null,
				selectedDiskType: null,
				selectedRegion: null,
				selectedAvailabilityZone: null,
				selectedSubnet: null,
				
			};

			$scope.newVol = {
				name:null,
				availabilityZone :null,
				size : null,
				hypervisor : "OPENSTACK",
				volumeType : null,
				encrypted : "false",
				multiAttachEnabled : "false",
				accountId : utente.abilitazioneSelezionata.accountUuid,
				volumeOwnerAlias: null,
				snapshotId : null,
				status : null ,
			};
$scope.readyTosubmit= ($scope.newVol.name !=null && $scope.newVol.availabilityZone !=null  && $scope.newVol.size !=null
						&& $scope.newVol.hypervisor !=null && $scope.newVol.volumeType !=null && $scope.newVol.encrypted !=null 
						&& $scope.newVol.multiAttachEnabled !=null && $scope.newVol.accountId !=null && $scope.newVol.volumeOwnerAlias !=null 
						&& $scope.newVol.snapshotId !=null && $scope.newVol.status !=null); 
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
		

			function getAvailabilityZones() {
			
				var queryString = {};
				if ($scope.accountUuid) {
					queryString.accountUuid = $scope.accountUuid;
				}
				$scope.promise = AvailabilityZone.query(queryString).$promise;
				
				return $scope.promise.then(function (data) {
					
					logger.info("SUCCESS", data);
					data.forEach(region => {
						$scope.volume.availableRegions.push(
							{
								id: region.regionUuid ? region.regionUuid : $scope.volume.availableRegions.length + 1,
								// code: region.code,
								description: region.regionName,
								default: true
							}
						);
		
						region.elencoAz.forEach(az => {
							console.log(az);
							$scope.volume.availableAvailabilityZones.push(
								{
									id: az.zoneUuid ? az.zoneUuid : $scope.volume.availableAvailabilityZones.length + 1,
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
					if (onfail.body) {
						if (onfail.body && onfail.body.data && onfail.body.data.message) {
							notificationManager.showErrorPopup($translate.instant('error.loading_zone') + ': ' + onfail.body.data.message);
						} else {
							notificationManager.showErrorPopup($translate.instant('error.loading_zone'));
						}
					} else if(onfail.data.message ){
						notificationManager.showErrorPopup($translate.instant('error.loading_zone') + ' ' + onfail.data.message);
					}else {
						notificationManager.showErrorPopup($translate.instant('error.loading_zone'));
					}
					
					//FIX ME - LG 19.11.2019 da rimuovere quando le AZ torneranno disponibili in staging!!!
					
					$scope.volume.availableRegions.push(
					{
						id: $scope.volume.availableRegions.length + 1,
						description: "RegionPiemonte01",
						default: true
					});
					$scope.volume.selectedRegion = $scope.volume.availableRegions[0].id ;
					
					$scope.volume.availableAvailabilityZones.push(
					{
						id: $scope.volume.availableAvailabilityZones.length + 1,
						regionName: "RegionPiemonte01",
						site: "site01",
						description: "SiteTorino01",
						default: true
					});
					$scope.volume.availableAvailabilityZones.push(
					{
						id: $scope.volume.availableAvailabilityZones.length + 1,
						regionName: "RegionPiemonte01",
						site: "site02",
						description: "SiteTorino02",
						default: false
					});
					$scope.volume.availableAvailabilityZones.push(
					{
						id: $scope.volume.availableAvailabilityZones.length + 1,
						regionName: "RegionPiemonte01",
						site: "site03",
						description: "SiteVercelli01",
						default: false
					});
					// FIX ME
					
					
				});
			};

			$scope.onInfoVmChanged = function (selector) {
				switch (selector) {
					case "region":
						$scope.volume.selectedAvailabilityZone = undefined;
					case "az":
						$scope.volume.selectedSubnet = undefined;
					case "subnet":
						$scope.volume.selectedSecurityGroup = undefined;
						break;
					default:
						break;
				}
			};


			function getVolumesTpes() {

				$scope.promise = ComputeVolumesTypes.get().$promise;

                return $scope.promise.then(function (data) {
                    logger.info("SUCCESS", data);
					$scope.volumTypes =data.elencoTipiVolume;
                }, function (onfail) {
                    logger.error("ERROR", onfail);
                    if (onfail.body) {
                        if (onfail.body.data && onfail.body.data.message) {
                            notificationManager.showErrorPopup($translate.instant('error.loading_volumi') + ': ' + onfail.body.data.message);
                        } else {
                            notificationManager.showErrorPopup($translate.instant('error.loading_volumi'));
                        }
                    } else {
                        notificationManager.showErrorPopup($translate.instant('error.loading_volumi'));
                    }
                });
            };
		



			this.onInit = function () {

				getVolumesTpes();
				getAvailabilityZones().then(
					function (onSuccess) {
						$scope.volume.selectedRegion = $.grep($scope.volume.availableRegions, function (candidate) {
							return candidate.default === true;
						})[0].id;
	
						$scope.volume.selectedAvailabilityZone = $.grep($scope.volume.availableAvailabilityZones, function (candidate) {
							return candidate.default === true;
						})[0].id;
					}
				);


				$q.all([

					VmIstanzeService.getAvailableDiskSizing().then(function (data) {
						$scope.volume.availableDiskSizings = data;
					}),
	
					// VmIstanzeService.getAvailableDiskTypes().then(function (data) {
					// 	$scope.vm.availableDiskTypes = data;
					// 	$scope.vm.selectedDiskType = data[0].id;
					// }),
	
	
				]).then(function (onSuccess) {
					$scope.status.loaded = true;
				}, function (onFail) {
					$scope.status.failed = false;
				}).finally(function () {
					$scope.status.loading = false;
				});
	
			
			

				
				
			};

			this.onExit = function () { };

			controllerValidator.validate(this, $scope);

		}]);

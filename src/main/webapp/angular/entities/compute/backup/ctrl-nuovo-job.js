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
nivolaApp.controller('NuovoJobController',
	["$scope", "$state", "$stateParams", "$filter", "$mdDialog",
		"entitiesRest", "controllerValidator", "notificationManager", 'loggers',
		'VmIstanzeService', '$q', 'AuthenticationService',
		function ($scope, $state, $stateParams, $filter, $mdDialog,
			entitiesRest, controllerValidator, notificationManager, loggers,
			VmIstanzeService, $q, AuthenticationService) {
			'use strict';

			var logger = loggers.get("NuovoJobController");
			var Job = entitiesRest.getEntity('Job');
			var AvailabilityZone = entitiesRest.getEntity('AvailabilityZone');

			var data = [];

			$scope.vmList = {
				istanze: [],
				dataTable: {
					// Proprietà data-table
					options: {
						rowSelection: true,
						multiSelect: true,
						autoSelect: false,
						decapitate: false,
						largeEditDialog: false,
						boundaryLinks: false,
						limitSelect: true,
						pageSelect: true
					},

					limitOptions: [10, 20, 30],

					filter: {
						options: {
							debounce: 500
						}
					},

					query: {
						order: "name",
						limit: 10,
						page: 1
					}
				}
			}

			$scope.vmSelectedList = {
				dataTable: {
					// Proprietà data-table
					options: {
						rowSelection: true,
						multiSelect: true,
						autoSelect: true,
						decapitate: false,
						largeEditDialog: false,
						boundaryLinks: false,
						limitSelect: true,
						pageSelect: true
					},

					limitOptions: [10, 20, 30],

					filter: {
						options: {
							debounce: 500
						}
					},

					query: {
						order: "name",
						limit: 10,
						page: 1
					}
				}
			}

			$scope.vm = {
				vm: null,
				availableSizings: [],
				availableSecurityGroups: [],
				availableDiskSizings: [],
				availableDiskTypes: [],
				availableRegions: [],
				availableAvailabilityZones: [],
				availableSubnets: [],
				availableVirtualizationOptions: [],
				availableRestorePoints: [7, 14, 30, 60, 180],
				availableBackupPeriod: ['giornaliera', 'settimanale', 'mensile'],
				availableTimeSlot: ['06:00 - 14:00', '14:00 - 22:00', '22:00 - 06:00'],

				selectedIndex: null,
				selectedJobName: null,
				selectedVMs: [],
				selectedTemplate: null,
				selectedSize: [],
				selectedDiskSize: null,
				selectedDiskType: null,
				additionalStorages: 0,
				selectedAdditionalStoragesSize: [],
				selectedAdditionalStoragesType: [],
				selectedRegion: null,
				selectedAvailabilityZone: null,
				selectedSubnet: null,
				tags: [],
				selectedVirtualizationOption: null,
				selectedRestorePoints: null,
				selectedBackupPeriod: null,
				selectedTimeSlot: null,
			};

			$scope.collapsed = true;

			$scope.status = {
				tabIndex: 0
			};

			$scope.iconStyle = {
				// "color": "#4285f4"
			};

			$scope.actions = {
				gotoTab: null
			};

			$scope.actions.gotoTab = function (index) {
				$scope.status.tabIndex = index;
			};

			$scope.unselectAll = function () {
				$scope.vm.selectedVMs = [];
			};

			$scope.resetFilter = function () {
				$scope.filter.search = '';
				$scope.query.filter = '';

				if ($scope.filter.form.$dirty) {
					$scope.filter.form.$setPristine();
				}
			};

			$scope.getOsIcon = function (template) {
				var os = template.name.toLowerCase();
				var imgNames = [
					'osx', 'centos', 'debian',
					'freebsd', 'linux', 'redhat',
					'suse', 'ubuntu', 'windows'
				];

				for (var i in imgNames) {
					if (os.includes(imgNames[i])) {
						return imgNames[i];
					}
				}

				return 'os';
			}

			$scope.onImageSelected = function (template, index, event) {
				if ($scope.vm.selectedIndex === null) {
					$scope.vm.selectedIndex = index;
					$scope.vm.selectedTemplate = template;
				}
				else if ($scope.vm.selectedIndex === index) {
					$scope.vm.selectedIndex = null;
					$scope.vm.selectedTemplate = null;
				}
				else {
					$scope.vm.selectedIndex = index;
					$scope.vm.selectedTemplate = template;
				}
			};

			$scope.onAdditionalStorageAdded = function () {
				$scope.vm.additionalStorages += 1;
				$scope.vm.selectedAdditionalStoragesSize.push($scope.vm.availableDiskSizings[0]);
				$scope.vm.selectedAdditionalStoragesType.push($scope.vm.availableDiskTypes[0].id);
			};

			$scope.onAdditionalStorageRemoved = function (index) {
				$scope.vm.additionalStorages -= 1;
				$scope.vm.selectedAdditionalStoragesSize.splice(index, 1);
				$scope.vm.selectedAdditionalStoragesType.splice(index, 1);
			};

			$scope.submit = function () {
				logger.debug("SUBMIT", $scope.vm);
			};

			$scope.fromIdToObj = function (list, id) {
				var filtered = list.filter(obj => { return obj.id == id; });
				return filtered ? filtered[0] : None;
			};

			$scope.selectVolumes = function (id, ev, readOnly = false) {
				$mdDialog.show({
					locals: {
						idVmSelected: id,
						readOnly: readOnly
					},
					scope: $scope.$new(true, $scope),	// create a new scope that maintain a correct prototypical inheritance
					// The parent scope will be accessible by means of the $parent of the newly created scope
					controller: 'DialogVolumesController',
					templateUrl: 'angular/entities/compute/backup/tpl-dialog-volumes.html',
					parent: angular.element(document.body),
					targetEvent: ev,
					clickOutsideToClose: true,
					fullscreen: true	// Only for -xs, -sm breakpoints.
				});
			};

			function getIstanze() {
			};

			// 	var queryString = {};
			// 	if ($scope.accountUuid) {
			// 		queryString.accountUuid = $scope.accountUuid;
			// 	}
			// 	$scope.promise = Region.query(queryString).$promise;

			// 	return $scope.promise.then(function (data) {
			// 		logger.info("SUCCESS", data);
			// 		$scope.vm.availableRegions = data;
			// 	}, function (onfail) {
			// 		logger.error("ERROR", onfail);
			// 		if (onfail.body) {
			// 			if (onfail.body && onfail.body.data && onfail.body.data.message) {
			// 				notificationManager.showErrorPopup('Si è verificato un errore durante il caricamento delle regioni: ' + onfail.body.data.message);
			// 			} else {
			// 				notificationManager.showErrorPopup('Si è verificato un errore durante il caricamento delle regioni!');
			// 			}
			// 		} else {
			// 			notificationManager.showErrorPopup('Si è verificato un errore durante il caricamento delle regioni!');
			// 		}
			// 	});
			// };

			function getAvailabilityZones() {
				var queryString = {};
				if ($scope.accountUuid) {
					queryString.accountUuid = $scope.accountUuid;
				}
				$scope.promise = AvailabilityZone.query(queryString).$promise;

				return $scope.promise.then(function (data) {
					logger.info("SUCCESS", data);
					data.forEach(region => {
						$scope.vm.availableRegions.push(
							{
								id: region.regionUuid ? region.regionUuid : $scope.vm.availableRegions.length + 1,
								// code: region.code,
								description: region.regionName,
								default: true
							}
						);

						region.elencoAz.forEach(az => {
							$scope.vm.availableAvailabilityZones.push(
								{
									id: az.zoneUuid ? az.zoneUuid : $scope.vm.availableAvailabilityZones.length + 1,
									// code: az.code,
									site: az.site ? az.site : az.zoneName,
									description: az.zoneName,
									default: true
								}
							);
						});
					});
				}, function (onfail) {
					logger.error("ERROR", onfail);
					if (onfail.body) {
						if (onfail.body && onfail.body.data && onfail.body.data.message) {
							notificationManager.showErrorPopup('Si è verificato un errore durante il caricamento delle availability zone: ' + onfail.body.data.message);
						} else {
							notificationManager.showErrorPopup('Si è verificato un errore durante il caricamento delle availability zone!');
						}
					} else {
						notificationManager.showErrorPopup('Si è verificato un errore durante il caricamento delle availability zone!');
					}
				});
			};

			this.onInit = function () {
				var abilitazione = AuthenticationService.getUtente().abilitazioneSelezionata;
				logger.debug("Abilitazione corrente", abilitazione);

				// Recupero Uuid dell'Account a cui l'agente appartiene
				// NOTE: filtro su accountUUID eseguito sul backend
				// $scope.accountUuid = abilitazione.accountUuid;

				getIstanze();
				getAvailabilityZones().then(
					function (onSuccess) {
						$scope.vm.selectedRegion = $.grep($scope.vm.availableRegions, function (candidate) {
							return candidate.default === true;
						})[0].id;

						$scope.vm.selectedAvailabilityZone = $.grep($scope.vm.availableAvailabilityZones, function (candidate) {
							return candidate.default === true;
						})[0].id;
					}
				);

				$q.all([
					VmIstanzeService.getAvailableSizing().then(function (data) {
						$scope.vm.availableSizings = data;
					}),

					VmIstanzeService.getAvailableDiskSizing().then(function (data) {
						$scope.vm.availableDiskSizings = data;
						$scope.vm.selectedDiskSize = data[0];
					}),

					VmIstanzeService.getAvailableDiskTypes().then(function (data) {
						$scope.vm.availableDiskTypes = data;
						$scope.vm.selectedDiskType = data[0].id;
					}),

					VmIstanzeService.getAvailableSubnets().then(function (data) {
						$scope.vm.availableSubnets = data;
						$scope.vm.selectedSubnet = $.grep(data, function (candidate) {
							return candidate.code == '13';
						})[0].id;
					}),

					VmIstanzeService.getAvailableVirtualizationOptions().then(function (data) {
						$scope.vm.availableVirtualizationOptions = data;
						$scope.vm.selectedVirtualizationOption = $.grep(data, function (candidate) {
							return candidate.code == 'OpenStack';
						})[0].id;
					}),

					VmIstanzeService.get().then(function (data) {
						var o = data[0];

						o.name = "Nuova VM";
						o.id++;
						o.code = o.id;
						o.notes = "";

						$scope.vm.vm = o;
					})

				]);

				$scope.vm.tags = ["TEST", "COD-PRODOTTO"];

				$scope.vm.availableSecurityGroups = [
					{ id: 1, name: "Default", description: "Gruppo di sicurezza di default (autogenerato)" },
					{ id: 2, name: "CUS-1", description: "Gruppo di sicurezza custom 1" },
					{ id: 3, name: "CUS-2", description: "Gruppo di sicurezza custom 2" },
				];

				$scope.vm.selectedSecurityGroup = $scope.vm.availableSecurityGroups[0].id;
			};

			this.onExit = function () {
			};

			controllerValidator.validate(this, $scope);
		}
	]);

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
nivolaApp.controller('NuovoDbaasController',
	["$scope", "$state", "$stateParams", "$filter", "$mdDialog", 'ReadthedocService',
		"entitiesRest", "controllerValidator", "notificationManager", 'loggers', '$window', 
		'DBaaSIstanzeService', '$q', 'AuthenticationService', '$translate',
		function ($scope, $state, $stateParams, $filter, $mdDialog, ReadthedocService,
			entitiesRest, controllerValidator, notificationManager, loggers, $window , 
			DBaaSIstanzeService, $q, AuthenticationService, $translate) {
			'use strict';

			var logger = loggers.get("NuovoDbaasController");
			var Dbaas = entitiesRest.getEntity('Dbaas');
			var Engine = entitiesRest.getEntity('Engine');
			var DiskSizeLimit = entitiesRest.getEntity('DbDiskSizeLimit');
			var Flavour = entitiesRest.getEntity('DbFlavour');
			var AvailabilityZone = entitiesRest.getEntity('AvailabilityZone');
			var Subnet = entitiesRest.getEntity('Subnet');
			var SecurityGroup = entitiesRest.getEntity('SecurityGroup');
			var StimaCostiDbass = entitiesRest.getEntity('StimaCostiDbass');
			
			var Assistenza = entitiesRest.getEntity('Assistenza');


			$scope.rtdDbaasnew=ReadthedocService.getUrlFromPath('/dbaas/new').docUrl;
			
			// LG 27.02.2020
			// Il nome dell'account diventa parte del nome dell'istanza del DBAAS
			// Rimpiazza gli eventuali carratteri di undercore '_' con '-'
			// 
			var accountNameCorretto = AuthenticationService.getUtente().abilitazioneSelezionata.accountName.replace(/_/g,'-');
			
			$scope.nomeVM = {
				partdbs : 'dbs',
				partType :  "" , //$scope.vm.selectedTemplate,
				partAccount : accountNameCorretto,
				partambiente : "prd",
				partProgressivo : "000",
			}; 

			$scope.validName= false; 
			$scope.ambienti = [
				{ codice: 'prd', name: $translate.instant('ambienti.prd') },
				{ codice: 'tst', name: $translate.instant('ambienti.tst') },
				{ codice: 'dev', name: $translate.instant('ambienti.dev') },
				{ codice: 'col', name: $translate.instant('ambienti.col') }
			  ];

			$scope.parteFissaNome=null; 
			$scope.vm = {
				vm: null,

				availableTemplates: [],
				availableMulticastTemplates: [],
				availableSizings: [],
				availableSecurityGroups: [],
				availableDiskSizings: [],
				availableDiskTypes: [],
				availableRegions: [],
				availableAvailabilityZones: [],
				availableSubnets: [],

				isDBaaSMulticast: false,

				minDiskSizing: null,
				maxDiskSizing: null,

				additionalAvailabilityZones: 0,
				selectedAdditionalRegions: [],
				selectedAdditionalAvailabilityZones: [],
				selectedAdditionalSubnets: [],

				availableVirtualizationOptions: [],

				price: {
					type: 74.40,
					disk: 0.40
				},

				selectedIndex: null,
				selectedVmName: null, 
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
			};



			$scope.status = {
				loading: true,
				loaded: false,
				failed: false,

				tagsReadOnly: false,
				tagsRemovable: true,
				tabIndex: 0
			};

			$scope.additionalStorageEnabled = false;

			// Proprietà data-table
			$scope.options = {
				rowSelection: true,
				multiSelect: false,
				autoSelect: true,
				decapitate: false,
				largeEditDialog: false,
				boundaryLinks: false,
				limitSelect: false,
				pageSelect: false
			};

			$scope.query = {
				order: ["vcpus", "ram", "disco"],
				search: "db."
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

			$scope.getEngineIcon = function (template) {
				var engine = template.name.toLowerCase();
				var engineNames = [
					'oracle', 'mysql',
					'postgres', 'sqlserver'
				];

				for (var i in engineNames) {
					if (engine.includes(engineNames[i])) {
						return engineNames[i];
					}
				}

				return 'db';
			}

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

			$scope.onImageSelected = function (template, index, event) {
				
				
				if(template.engine.toLowerCase().includes('mysql')){
					$scope.vm.istanza.defaultPort =3306;
					// $scope.nomeVM.partType="mys"; 
					$scope.nomeVM.partType="m";
					
				}
				if(template.engine.toLowerCase().includes('postgres')){
					// $scope.nomeVM.partType="pos"; 
					$scope.nomeVM.partType="p";
					
				}
				if(template.engine.toLowerCase().includes('oracle')){
					// $scope.nomeVM.partType="ora";
					$scope.nomeVM.partType="o";
					
				}
				if(template.engine.toLowerCase().includes('sqlserver')){
					// $scope.nomeVM.partType="sql"; 
					$scope.nomeVM.partType="s";
					
				}
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
				$scope.buildName(); 
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

			$scope.onAdditionalAvailabilityZoneAdded = function () {
				$scope.vm.additionalAvailabilityZones += 1;
				$scope.vm.selectedAdditionalRegions.push($scope.vm.availableRegions[0].id);

				for (let index = 0; index < $scope.vm.availableAvailabilityZones.length; index++) {
					if (!$scope.vm.selectedAdditionalAvailabilityZones.includes($scope.vm.availableAvailabilityZones[index].id)
						&& $scope.vm.selectedAvailabilityZone != $scope.vm.availableAvailabilityZones[index].id) {
						$scope.vm.selectedAdditionalAvailabilityZones.push($scope.vm.availableAvailabilityZones[index].id);
						break;
					}
				}

				$scope.vm.selectedAdditionalSubnets.push($scope.vm.availableSubnets[0].id);
			};

			$scope.onInfoDbChanged = function (selector) {
				switch (selector) {
					case "region":
						$scope.vm.selectedAvailabilityZone = undefined;
					case "az":
						$scope.vm.selectedSubnet = undefined;
					case "subnet":
						$scope.vm.selectedSecurityGroup = undefined;
						break;
					default:
						break;
				}
			};

			$scope.azFilter = function (item) {
				// FIXME: false se già selezionato nelle ALTRE combo-box
				return ($scope.vm.selectedAdditionalAvailabilityZones.indexOf(item.id) === $scope.vm.selectedAdditionalAvailabilityZones.length - 1 || $scope.vm.selectedAdditionalAvailabilityZones.indexOf(item.id) === -1)
					&& ($scope.vm.selectedAvailabilityZone != item.id);
			};

			$scope.onAdditionalAvailabilityZoneRemoved = function (index) {
				$scope.vm.additionalAvailabilityZones -= 1;
				$scope.vm.selectedAdditionalRegions.splice(index, 1);
				$scope.vm.selectedAdditionalAvailabilityZones.splice(index, 1);
				$scope.vm.selectedAdditionalSubnets.splice(index, 1);
			};

			$scope.submit = function () {


				var storageSize = parseInt($scope.vm.selectedDiskSize);
				var additionalStorages = [];

				for (let index = 0; index < $scope.vm.additionalStorages; index++) {
					var size = $scope.vm.selectedAdditionalStoragesSize[index];
					var type = $scope.vm.selectedAdditionalStoragesType[index];
					additionalStorages.push(
						{
							"dimensioneDisco": parseInt(size),
							"tipoDisco": $scope.fromIdToObj($scope.vm.availableDiskTypes, type).description
						}
					);
					storageSize += size;
				}

				var vmJson = {
					nome: $scope.vm.selectedVmName,
					descrizione: "",
					// accountId: $scope.accountUuid,
					engine: $scope.vm.selectedTemplate.engine,
					versione: $scope.vm.selectedTemplate.version,
					chiaveSSH: "",
					identificativoIstanza: "",
					flavourName: $scope.vm.selectedSize[0].uuid,
					// flavourUuid: $scope.vm.selectedDiskSize,
					spazioAllocazione: storageSize.toString(),
					// dischiAggiuntivi: additionalStorages,
					region: $scope.fromIdToObj($scope.vm.availableRegions, $scope.vm.selectedRegion).description,
					az: $scope.fromIdToObj($scope.vm.availableAvailabilityZones, $scope.vm.selectedAvailabilityZone).description,
					subnet: $scope.vm.selectedSubnet,
					securityGroup: $scope.fromIdToObj($scope.vm.availableSecurityGroups, $scope.vm.selectedSecurityGroup).id,
					schemaName: $scope.vm.istanza.schema,
					//tags: $scope.vm.tags.slice(0),
					adminPassword: "",
					porta: $scope.vm.istanza.defaultPort,
				};

				// console.log("JSON: ", vmJson);
				// return;

				if (vmJson.selectedDiskSize < $scope.vm.minDiskSizing || vmJson.selectedDiskSize > $scope.vm.maxDiskSizing) {
					notificationManager.showErrorPopup($translate.instant('dbaas.nuova.errore_disksize'));
					return;
				}

				$scope.status.pending = true;
				if (vmJson.engine == 'postgres') {
					// vmJson.adminPassword = "pgsqlpwd0";
					vmJson.adminPassword = "passw0rd";
				}  
				if (vmJson.engine == 'mysql') {
					// vmJson.adminPassword = "mysqlpwd0";
					vmJson.adminPassword = null;   // LG 09/04/2020 Per mySQL la password deve essere null!!!
					
				}  
					
				setTimeout(() => {
					if($scope.promise.$$state.status===0){
						$rootScope.loadingElement = true;
					}
				}, 1000);
				console.log("vm JAson", vmJson); 
				Dbaas.save(vmJson, function (data) {
					logger.info('SUCCESS', data);
					notificationManager.showSuccessPopup($translate.instant('dbaas.nuova.success'));

					// invio mail all'assistenza 
					informaAssistenza(); 
					// LG 25.04.2019 Al termine della creazione si ritorna alla lista delle VM
					$state.go('app.dbaas');
				}, function (onfail) {
					logger.error('ERROR', onfail);
					if (onfail.data && onfail.data.message) {
						notificationManager.showErrorPopup($translate.instant('dbaas.nuova.error') + ': ' + onfail.data.message);
					} else {
						notificationManager.showErrorPopup($translate.instant('dbaas.nuova.error'));
					}
				}).$promise.finally(function () {
					$scope.status.pending = false;
					$rootScope.loadingElement = false;
				});
			};

			$scope.historyBack = function(){
				$window.history.back();
			}

			$scope.fromIdToObj = function (list, id) {
				var filtered = list.filter(obj => { return obj.id == id; });
				return filtered ? filtered[0] : None;
			};

			$scope.onFlavourSelected = function (item) {
				if ($scope.vm.selectedDiskSize === null || parseInt($scope.vm.selectedDiskSize) < parseInt(item.disco.replace('GB', '')))
					$scope.vm.selectedDiskSize = Math.min.apply(Math, $scope.vm.availableDiskSizings.filter(function (currentValue) {
						return currentValue >= parseInt(item.disco.replace('GB', ''));
					}));
			};

			$scope.greaterThan = function (item) {
				return $scope.vm.selectedSize.length ? item >= parseInt($scope.vm.selectedSize[0].disco.replace('GB', '')) : true;
			};

			function getEngines() {
				
				setTimeout(() => {
					if($scope.promise.$$state.status===0){
						$rootScope.loadingElement = true;
					}
				}, 1000);
				var queryString = {};
				if ($scope.accountUuid) {
					queryString.accountUuid = $scope.accountUuid;
				}
				$scope.promise = Engine.query(queryString).$promise;

				return $scope.promise.then(function (data) {
					data.forEach(function (value) {
						value.name = value.engine + " " + value.version;
					});
					logger.info("SUCCESS", data);
					$scope.vm.availableTemplates = data;
				}, function (onfail) {
					logger.error("ERROR", onfail);
					if (onfail.body && onfail.body.data) {
						notificationManager.showErrorPopup($translate.instant('error.loading_engines') + ': ' + onfail.body.data.message);
					} else if (onfail.data.message){
						notificationManager.showErrorPopup($translate.instant('error.loading_engines') + ': ', onfail.data.message);
					}else{
						notificationManager.showErrorPopup($translate.instant('error.loading_engines'));
					}

				}).finally(function() {
					$rootScope.loadingElement = false;
			   });
			};

		

			function getFlavours() {
				var queryString = {};
				if ($scope.accountUuid) {
					queryString.accountUuid = $scope.accountUuid;
				}
				$scope.promise = Flavour.query(queryString).$promise;

				return $scope.promise.then(function (data) {
					logger.info("SUCCESS", data);
					$scope.vm.availableSizings=$scope.convertValues(data);
				}, function (onfail) {
					logger.error("ERROR", onfail);
					if (onfail.body && onfail.body.data) {
						notificationManager.showErrorPopup($translate.instant('error.loading_flavour') + ': ' + onfail.body.data.message);
					} else if (onfail.data.message){
						notificationManager.showErrorPopup($translate.instant('error.loading_flavour') + ': ', onfail.data.message);
					}else{
						notificationManager.showErrorPopup($translate.instant('error.loading_flavour'));
					}

				});
			};



			$scope.convertValues=function(data){
				var values=data; 
				var temp=[];
				angular.forEach(values, function(data, index){
					var tempObj={};
					tempObj.ramOrderBy=parseInt(data.ram);
					tempObj.cpusOrderBy=data.vcpus
					tempObj.item=data;
					temp.push(tempObj);
				});
				return temp; 
		};

			function informaAssistenza(){
				var abilitazione = AuthenticationService.getUtente().abilitazioneSelezionata;
				var objToBeSend = {
						oggetto : "Database as a Service",
						messaggio : "e' stata increata la seguente istanza:\nOrganizzazione: " + abilitazione.orgName + 
						"\nDivisione: " + abilitazione.divName + "\nAccount: " + abilitazione.accountName + "\nNome istanza: " + $scope.vm.selectedVmName,
					 }; 
				
				Assistenza.save(objToBeSend, function (data) {
					logger.info('SUCCESS', data);
					notificationManager.showSuccessPopup($translate.instant('dbaas.nuova.assistenza.success'));
				
				}, function (onfail) {
					logger.error('ERROR', onfail);
					if (onfail.body && onfail.body.data) {
						notificationManager.showErrorPopup($translate.instant('dbaas.nuova.assistenza.error') + ': ' + onfail.body.data.message);
					} else if (onfail.data.message){
						notificationManager.showErrorPopup($translate.instant('dbaas.nuova.assistenza.error') + ': ', onfail.data.message);
					}else{
						notificationManager.showErrorPopup($translate.instant('dbaas.nuova.assistenza.error'));
					}

				});
			}

			function getDiskSizeLimits() {
				$scope.promise = DiskSizeLimit.get().$promise;

				return $scope.promise.then(function (data) {
					logger.info("SUCCESS", data);
					$scope.vm.minDiskSizing = data.limiteMin;
					$scope.vm.maxDiskSizing = data.limiteMax;
				}, function (onfail) {
					logger.error("ERROR", onfail);
					if (onfail.body) {
						if (onfail.body && onfail.body.data) {
							notificationManager.showErrorPopup($translate.instant('error.loading_regioni') + ': ' + onfail.body.data.message);
						} else {
							notificationManager.showErrorPopup($translate.instant('error.loading_regioni'));
						}
					} else {
						notificationManager.showErrorPopup($translate.instant('error.loading_regioni'));
					}
				});
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
					if (onfail.body && onfail.body.data) {
						notificationManager.showErrorPopup($translate.instant('error.loading_zone') + ': ' + onfail.body.data.message);
					} else if (onfail.data.message){
						notificationManager.showErrorPopup($translate.instant('error.loading_zone') + ': ', onfail.data.message);
					}else{
						notificationManager.showErrorPopup($translate.instant('error.loading_zone'));
					}

					//FIX ME - LG 19.11.2019 da rimuovere quando le AZ torneranno disponibili in staging!!!
					$scope.vm.availableRegions.push(
					{
						id: $scope.vm.availableRegions.length + 1,
						description: "RegionPiemonte01",
						default: true
					});
					$scope.vm.selectedRegion = $scope.vm.availableRegions[0].id ;
					
					$scope.vm.availableAvailabilityZones.push(
					{
						id: $scope.vm.availableAvailabilityZones.length + 1,
						regionName: "RegionPiemonte01",
						site: "site01",
						description: "SiteTorino01",
						default: true
					});
					$scope.vm.availableAvailabilityZones.push(
					{
						id: $scope.vm.availableAvailabilityZones.length + 1,
						regionName: "RegionPiemonte01",
						site: "site02",
						description: "SiteTorino02",
						default: false
					});
					$scope.vm.availableAvailabilityZones.push(
					{
						id: $scope.vm.availableAvailabilityZones.length + 1,
						regionName: "RegionPiemonte01",
						site: "site03",
						description: "SiteVercelli01",
						default: false
					});
					// FIX ME
					
				});
			};

			function getSubnets() {
				var queryString = {};
				if ($scope.accountUuid) {
					queryString.accountUuid = $scope.accountUuid;
				}
				$scope.promise = Subnet.query(queryString).$promise;

				return $scope.promise.then(function (data) {
					logger.info("SUCCESS", data);

					data.forEach(subnet => {
						$scope.vm.availableSubnets.push(
							{
								id: subnet.subnetId ? subnet.subnetId : $scope.vm.availableSubnets.length + 1,
								availabilityZone: subnet.availabilityZone,
								vpcId: subnet.vpcId,
								description: subnet.nvlName,
								default: subnet.defaultForAz
							}
						);
					});
				}, function (onfail) {
					logger.error("ERROR", onfail);
					if (onfail.body && onfail.body.data) {
						notificationManager.showErrorPopup($translate.instant('error.loading_subnet') + ': ' + onfail.body.data.message);
					} else if (onfail.data.message){
						notificationManager.showErrorPopup($translate.instant('error.loading_subnet') + ': ', onfail.data.message);
					}else{
						notificationManager.showErrorPopup($translate.instant('error.loading_subnet'));
					}

				});
			};






			

			 $scope.buildName = function () {
				$scope.validName= true; 
				// $scope.vm.selectedVmName = $scope.nomeVM.partdbs+"-"+$scope.nomeVM.partType+"-"+$scope.nomeVM.partAccount+"-"
				//	+$scope.nomeVM.partambiente+"-"+$scope.nomeVM.partProgressivo;
				var newPartAccount = $scope.nomeVM.partAccount.replace("-preprod","");
				newPartAccount = newPartAccount.replace("preprod","");
			
				var fullname= $scope.nomeVM.partdbs+
				                           "-"+newPartAccount+"-"+
					                       $scope.nomeVM.partambiente+
										   "-"+$scope.nomeVM.partProgressivo+$scope.nomeVM.partType;
				$scope.vm.selectedVmName = fullname.toLowerCase();
				
					if(!$scope.nomeVM.partAccount || !$scope.nomeVM.partType || !$scope.nomeVM.partambiente || !$scope.nomeVM.partProgressivo){
						$scope.validName= false; 
					}
			 }

			//  $scope.onChangeNomeDbaas = function () {
			// 	if(( ($scope.vm.selectedVmName).length < $scope.parteFissaNome.length )  ||  ( ($scope.vm.selectedVmName).length > ($scope.parteFissaNome.length +3) ) ){
			// 		return false 
			// 	}
			// 	return true; 
			//  }
			 

			$scope.actions.onTabSelected = function (index) {
                
                setTimeout(function(){getCostiStimati();  }, 1000);
                
			   };
			   
			   
     function getCostiStimati() {
        let totStorageBase = 0; 
        let totStoragePres = 0; 
        // controllo se il tipo di disco è prestazionale o meno 
        $scope.vm.selectedDiskType == 1 ? totStoragePres +=  parseInt($scope.vm.selectedDiskSize) : totStorageBase+= parseInt($scope.vm.selectedDiskSize); 
        // for (let index = 0; index < $scope.vm.additionalStorages; index++) {
        //     var size = $scope.vm.selectedAdditionalStoragesSize[index];
        //     var type = $scope.vm.selectedAdditionalStoragesType[index]; 
        //     type == 1 ? totStoragePres +=  parseInt(size) : totStorageBase+= parseInt(size); 
        //   
        // }
         var params = {
            numCpu: $scope.vm.selectedSize[0].vcpus,
            gbRam: parseInt($scope.vm.selectedSize[0].ram),
            gbDiscoBase :  parseInt(totStorageBase), // parseInt($scope.vm.selectedSize[0].disco), 
            gbDiscoPrestazionale :  parseInt(totStoragePres),
           // licenzaCommerciale :    $scope.isTemplateWindows(),
			accountId :  AuthenticationService.getUtente().abilitazioneSelezionata.accountUuid,
			engineType : $scope.vm.selectedTemplate.engine


         }; 
            $scope.promise = StimaCostiDbass.get(params).$promise;
        
            
            return $scope.promise.then(function (data) {
                logger.info("SUCCESS", data);
                console.log(JSON.stringify(data)); 
                $scope.costi = data; 
                //calculate costi dischi vari 
                $scope.costoTotDischi = 0; 
                // $scope.vm.selectedDiskType == 1 ? $scope.vm.selectedDiskPrice =data.costoUnitarioDiscoPrestazionale *  parseInt($scope.vm.selectedDiskSize) 
                //                                 : $scope.vm.selectedDiskPrice=data.costoUnitarioDiscoBase * parseInt($scope.vm.selectedDiskSize); 
                //     $scope.costoTotDischi += $scope.vm.selectedDiskPrice; 
                //     for (let index = 0; index < $scope.vm.additionalStorages; index++) {
                //     var size = $scope.vm.selectedAdditionalStoragesSize[index];
                //     var type = $scope.vm.selectedAdditionalStoragesType[index]; 
                //     type == 1 ?  $scope.vm.selectedAdditionalStoragesPrice[index] =data.costoUnitarioDiscoPrestazionale * parseInt(size) 
                //               :  $scope.vm.selectedAdditionalStoragesPrice[index] =data.costoUnitarioDiscoBase * parseInt(size); 
                //     $scope.costoTotDischi+= $scope.vm.selectedAdditionalStoragesPrice[index]; 
                //               // totAdditionalStorages += parseInt(size); 
                // }


            }, function (onfail) {
				logger.error("ERROR", onfail);
				if (onfail.body && onfail.body.data) {
					notificationManager.showErrorPopup($translate.instant('error.loading_costi') + ': ' + onfail.body.data.message);
				} else if (onfail.data.message){
					notificationManager.showErrorPopup($translate.instant('error.loading_costi') + ': ', onfail.data.message);
				}else{
					notificationManager.showErrorPopup($translate.instant('error.loading_costi'));
				}
            });
    };
    
 
        


			function getSecurityGroups() {
				var queryString = {};
				if ($scope.accountUuid) {
					queryString.accountUuid = $scope.accountUuid;
				}
				$scope.promise = SecurityGroup.query(queryString).$promise;

				return $scope.promise.then(function (data) {
					logger.info("SUCCESS", data);

					data.forEach(sg => {
						if (sg.nvlState === 'AVAILABLE') {
							$scope.vm.availableSecurityGroups.push(
								{
									id: sg.groupId ? sg.groupId : $scope.vm.availableSecurityGroups.length + 1,
									// id: sg.id ? sg.id : $scope.vm.availableSecurityGroups.length + 1,
									vpcId: sg.vpcId,
									description: sg.groupDescription,
									default: true
								}
							);
						}

					});
				}, function (onfail) {
					logger.error("ERROR", onfail);
					if (onfail.body && onfail.body.data) {
						notificationManager.showErrorPopup($translate.instant('error.loading_security_group') + ': ' + onfail.body.data.message);
					} else if (onfail.data.message){
						notificationManager.showErrorPopup($translate.instant('error.loading_security_group') + ': ', onfail.data.message);
					}else{
						notificationManager.showErrorPopup($translate.instant('error.loading_security_group'));
					}

				});
			};

			this.onInit = function () {
				var abilitazione = AuthenticationService.getUtente().abilitazioneSelezionata;
				logger.debug("Abilitazione corrente", abilitazione);

				// Recupero Uuid dell'Account a cui l'agente appartiene
				// NOTE: filtro su accountUUID eseguito sul backend
				// $scope.accountUuid = abilitazione.accountUuid;

				getEngines();
				getAvailabilityZones();
				// then(
				// 	function (onSuccess) {
				// 		$scope.vm.selectedRegion = $.grep($scope.vm.availableRegions, function (candidate) {
				// 			return candidate.default === true;
				// 		})[0].id;

				// 		$scope.vm.selectedAvailabilityZone = $.grep($scope.vm.availableAvailabilityZones, function (candidate) {
				// 			return candidate.default === true;
				// 		})[0].id;
				// 	}
				// );
				getFlavours();
				getDiskSizeLimits();
				getSubnets();
				// then(
				// 	function (onSuccess) {
				// 		$scope.vm.selectedSubnet = $.grep($scope.vm.availableSubnets, function (candidate) {
				// 			return candidate.default === true;
				// 		})[0].id;
				// 	}
				// );
				getSecurityGroups();
				// then(
				// 	function (onSuccess) {
				// 		$scope.vm.selectedSecurityGroup = $.grep($scope.vm.availableSecurityGroups, function (candidate) {
				// 			return candidate.default === true;
				// 		})[0].id;
				// 	}
				// );

				$q.all([

					DBaaSIstanzeService.getAvailableDbTemplates().then(function (data) {
						// var dbNames = ["PostgreSQL 9.6", "PostgreSQL 11.1", "PostgreSQL 10", "PostgreSQL 9.2", "MySQL 5.5", "MySQL 5.7.9"];
						var dbMulticastNames = ["MySQL 5.7.9", "PostgreSQL 10", "PostgreSQL 9.2"];

						// var dbObjs = [];
						var dbMulticastObjs = [];

						// dbNames.forEach(function (value) {
						// 	var uid = Math.round(Math.random() * 1000);
						// 	var obj = {
						// 		code: uid,
						// 		id: uid,
						// 		name: value,   // + " - template " + uid,
						// 		description: value + " template with code " + uid,
						// 		softwareDescription: "preconfigurato"
						// 	}

						// 	dbObjs.push(obj)
						// });

						dbMulticastNames.forEach(function (value) {
							var uid = Math.round(Math.random() * 1000);
							var obj = {
								code: uid,
								id: uid,
								name: value,   // + " - template " + uid,
								description: value + " template with code " + uid,
								softwareDescription: "preconfigurato"
							}

							dbMulticastObjs.push(obj)
						});

						// $scope.vm.availableTemplates = dbObjs;
						$scope.vm.availableMulticastTemplates = dbMulticastObjs;
					}),

					DBaaSIstanzeService.getAvailableDiskSizing().then(function (data) {
						$scope.vm.availableDiskSizings = data;
					}),

					DBaaSIstanzeService.getAvailableDiskTypes().then(function (data) {
						$scope.vm.availableDiskTypes = data;
						$scope.vm.selectedDiskType = data[0].id;
					}),

					DBaaSIstanzeService.getAvailableVirtualizationOptions().then(function (data) {
						$scope.vm.availableVirtualizationOptions = data;
						$scope.vm.selectedVirtualizationOption = $.grep(data, function (candidate) {
							return candidate.code == 'OpenStack';
						})[0].id;
					}),

					DBaaSIstanzeService.get().then(function (data) {
						var o = data[0];

						o.name = "Nuova istanza DBAAS";
						o.id++;
						o.code = o.id;
						o.notes = "";

						o.schema = "mainschema";
						o.defaultPort = 5432;
						o.rootPassword = null;
						o.checkPassword = null;

						$scope.vm.istanza = o;
						$scope.status.loaded = true;
					})

				]).then(function (onSuccess) {
					$scope.status.loaded = true;
				}, function (onFail) {
					$scope.status.failed = false;
				}).finally(function () {
					$scope.status.loading = false;
				});

				$scope.vm.tags = ["TEST", "COD-PRODOTTO"];
			};

			this.onExit = function () {
				// nop
			};

			controllerValidator.validate(this, $scope);

		}
	]);

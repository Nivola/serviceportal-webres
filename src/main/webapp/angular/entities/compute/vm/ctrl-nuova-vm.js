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
angular.module('app').controller('NuovaVmController', [
    '$scope', '$state', '$mdToast','$mdDialog', 'controllerValidator', 'notificationManager',
    'loggers', '$interval', 'VmIstanzeService', 'ReadthedocService', '$rootScope',
    '$q', 'entitiesRest', 'AuthenticationService', '$window', '$translate', 
    function (
        $scope, $state, $mdToast,$mdDialog, controllerValidator, notificationManager,
        loggers, $interval, VmIstanzeService, ReadthedocService, $rootScope,
        $q, entitiesRest, AuthenticationService, $window, $translate ) {

        var logger = loggers.get("NuovaVmController");
        var Vm = entitiesRest.getEntity('Vm');
        var DettaglioAccount = entitiesRest.getEntity('DettaglioAccount');
        var Template = entitiesRest.getEntity('Template');
        var Flavour = entitiesRest.getEntity('VmFlavour');
        var AvailabilityZone = entitiesRest.getEntity('AvailabilityZone');
        var Subnet = entitiesRest.getEntity('Subnet');
        var SecurityGroup = entitiesRest.getEntity('SecurityGroup');
        var Keypair = entitiesRest.getEntity('Keypair');
        var StimaCostiVm = entitiesRest.getEntity('StimaCostiVm');

        $scope.rtdVMNew=ReadthedocService.getUrlFromPath('/vm/new').docUrl;
        $scope.account={};


        $scope.formFlags = {
            showpass: false,
            minpasslength: 6,
            tempPass: ''
        };

        $scope.sicurezza = {
           showpass: false,
           password: '',
           confermapwd : '',
           matchPwd : false
        };

        $scope.vm = {
            vm: null,
            availableTemplates: [],
            availableSizings: [],
            availableSecurityGroups: [],
            availableDiskSizings: [],
            availableDiskTypes: [],
            availableRegions: [],
            availableAvailabilityZones: [],
            availableSubnets: [],
            availableVirtualizationOptions: [],
            availableKeypairs:[],

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
            selectedAdditionalStoragesPrice : [], 
            selectedRegion: null,
            selectedAvailabilityZone: null,
            selectedSubnet: null,
            tags: [],
            selectedVirtualizationOption: null,
            selectedKeypair:[]
        };

        $scope.status = {
            loading: true,
            loaded: false,
            failed: false,

            pending: false,

            tagsReadOnly: false,
            tagsRemovable: true,
            tabIndex: 0
        };

        // Proprietà data-table
        $scope.options = {
            rowSelection: true,
            multiSelect: false,
            autoSelect: true,
            decapitate: false,
            largeEditDialog: false,
            boundaryLinks: false,
            limitSelect: false,
            pageSelect: false,
            elencoKeypairsVuoto:false,
            rowKeypairSelection:true,
            multiSelectKeypair:false
        };

        $scope.query = {
            order: ["vcpus", "ram", "disco"],
            search: "vm."
        };
        
        $scope.queryKeypair = {
            order: ["nome", "impronta"],
            search: "vm."
        };

        $scope.iconStyle = {
            // "color": "#4285f4"
        };

        $scope.actions = {
            gotoTab: null,
            auth: {
                newKeypair: $state.get("app.keypair.new").requiredUC,
                import: $state.get("app.keypair.import").requiredUC,
            },
            navigateToListSSH:function(){
                $state.go("app.keypair");
            },
            crea: function (event) {
                $mdDialog.show({
                    locals: {
                        Keypair: Keypair,
                        mdDialog: $mdDialog,
                        keypairs:$scope.keypairs
                    },
                    controller: 'DialogNuovaKeypairController',
                    templateUrl: 'angular/entities/networking/keypair/tpl-dialog-nuova-keypair.html',
                    parent: angular.element(document.body),
                    targetEvent: event,
                    clickOutsideToClose: true,
                    fullscreen: true	// Only for -xs, -sm breakpoints.
                })
                    .then(function () {
                        getKeypairs();
                    }, function () {
                        //ha cliccato annulla della dialog
                    });
            },
            importa: function (event) {
                $mdDialog.show({
                    locals: {
                        Keypair: Keypair,
                        mdDialog: $mdDialog,
                        keypairs:$scope.keypairs
                    },
                    controller: 'DialogImportaKeypairController',
                    templateUrl: 'angular/entities/networking/keypair/tpl-dialog-importa-keypair.html',
                    parent: angular.element(document.body),
                    targetEvent: event,
                    clickOutsideToClose: true,
                    fullscreen: true	// Only for -xs, -sm breakpoints.
                })
                    .then(function () {
                        getKeypairs();
                    }, function () {
                        //ha cliccato annulla della dialog
                    });
            },
        };

      
        $scope.actions.gotoTab = function (index) {
           
            $scope.status.tabIndex = index;
        };

        $scope.actions.onTabSelected = function (index) {
                
                setTimeout(function(){getCostiStimati();  }, 1000);
                
        };
        

        $scope.startsWith = function (actual, expected) {
            var lowerStr = (actual + "").toLowerCase();
            return lowerStr.indexOf(expected.toLowerCase()) === 0;
        };

        $scope.mostraPass= function(){
             $scope.sicurezza.showpass=true;  
        };

        $scope.nascondiPass= function(){
            $scope.sicurezza.showpass=false;  
       };

        $scope.isTemplateWindows= function(){
            if ($scope.vm.selectedTemplate!==null){
                const nameTemplate= $scope.vm.selectedTemplate.name.toLowerCase(); 
               return (nameTemplate.includes("windows") || nameTemplate.includes("microsoft") || nameTemplate.includes("window")); 
            }
          
        };


        $scope.len = function(){
            if ($scope.vm.selectedTemplate!==null){
                const nameTemplate= $scope.vm.selectedTemplate.name.toLowerCase(); 
               if((nameTemplate.includes("windows") || nameTemplate.includes("microsoft") || nameTemplate.includes("window") || nameTemplate.includes("SQLServer"))) 
                        return (15 - ($scope.vm.acronimoAccount.length) ); 
                else return 50; 
            }
            return 50; 
        };

       $scope.checkPwd= function(){
           if($scope.sicurezza.password===$scope.sicurezza.confermapwd ){
            $scope.sicurezza.matchPwd=true; 
           } else{
            $scope.sicurezza.matchPwd=false;
           }
        
     };
     


// // nome: $scope.vm.selectedVmName + $scope.vm.acronimoAccount ,
// nome: $scope.vm.selectedVmName,
// descrizione: "",
// // accountId: $scope.accountUuid,
// templateUuid: $scope.vm.selectedTemplate.imageId,
// flavurUuid: $scope.vm.selectedSize[0].uuid,
// discobase: {
//     "dimensioneDisco": parseInt($scope.vm.selectedDiskSize),
//     "tipoDisco": $scope.fromIdToObj($scope.vm.availableDiskTypes, $scope.vm.selectedDiskType).description
// },
// dischiAggiuntivi: additionalStorages,
// region: $scope.fromIdToObj($scope.vm.availableRegions, $scope.vm.selectedRegion).description,
// az: $scope.fromIdToObj($scope.vm.availableAvailabilityZones, $scope.vm.selectedAvailabilityZone).description,
// subnet: $scope.vm.selectedSubnet,
// securityGroup: $scope.fromIdToObj($scope.vm.availableSecurityGroups, $scope.vm.selectedSecurityGroup).id,
// //tags: $scope.vm.tags.slice(0),
// adminPassword: ($scope.sicurezza.password!==null ? $scope.sicurezza.password : ""),
// hypervisor: $scope.vm.selectedVirtualizationOption ,//$scope.fromIdToObj($scope.vm.availableVirtualizationOptions, $scope.vm.selectedVirtualizationOption).code.toLowerCase(),
// nomeChiave:(   $scope.vm.selectedKeypair.length>0 ? $scope.vm.selectedKeypair[0].nome : null)  //$scope.vm.selectedKeypair[0].nome



     function getCostiStimati() {
        let totStorageBase = 0; 
        let totStoragePres = 0; 
        // controllo se il tipo di disco è prestazionale o meno 
        $scope.vm.selectedDiskType == 1 ? totStoragePres +=  parseInt($scope.vm.selectedDiskSize) : totStorageBase+= parseInt($scope.vm.selectedDiskSize); 
        for (let index = 0; index < $scope.vm.additionalStorages; index++) {
            var size = $scope.vm.selectedAdditionalStoragesSize[index];
            var type = $scope.vm.selectedAdditionalStoragesType[index]; 
            type == 1 ? totStoragePres +=  parseInt(size) : totStorageBase+= parseInt(size); 
           // totAdditionalStorages += parseInt(size); 
        }
         var params = {
            numCpu: $scope.vm.selectedSize[0].vcpus,
            gbRam: parseInt($scope.vm.selectedSize[0].ram),
            gbDiscoBase :  parseInt(totStorageBase), // parseInt($scope.vm.selectedSize[0].disco), 
            gbDiscoPrestazionale :  parseInt(totStoragePres),
            licenzaCommerciale :    $scope.isTemplateWindows(),
            accountId :  AuthenticationService.getUtente().abilitazioneSelezionata.accountUuid


         }; 
            $scope.promise = StimaCostiVm.get(params).$promise;
        
            
            return $scope.promise.then(function (data) {
                logger.info("SUCCESS", data);
                console.log(JSON.stringify(data)); 
                $scope.costi = data; 
                //calculate costi dischi vari 
                $scope.costoTotDischi = 0; 
                $scope.vm.selectedDiskType == 1 ? $scope.vm.selectedDiskPrice =data.costoUnitarioDiscoPrestazionale *  parseInt($scope.vm.selectedDiskSize) 
                                                : $scope.vm.selectedDiskPrice=data.costoUnitarioDiscoBase * parseInt($scope.vm.selectedDiskSize); 
                    $scope.costoTotDischi += $scope.vm.selectedDiskPrice; 
                    for (let index = 0; index < $scope.vm.additionalStorages; index++) {
                    var size = $scope.vm.selectedAdditionalStoragesSize[index];
                    var type = $scope.vm.selectedAdditionalStoragesType[index]; 
                    type == 1 ?  $scope.vm.selectedAdditionalStoragesPrice[index] =data.costoUnitarioDiscoPrestazionale * parseInt(size) 
                              :  $scope.vm.selectedAdditionalStoragesPrice[index] =data.costoUnitarioDiscoBase * parseInt(size); 
                    $scope.costoTotDischi+= $scope.vm.selectedAdditionalStoragesPrice[index]; 
                              // totAdditionalStorages += parseInt(size); 
                }


            }, function (onfail) {
                logger.error("ERROR", onfail);
                if (onfail.data) {
                    notificationManager.showErrorPopup($translate.instant('error.loading_costi') + ': ' + onfail.data.message);
                } else {
                    notificationManager.showErrorPopup($translate.instant('error.loading_costi'));
                }
            });
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

        

        function resetTabSicurezza(){
            $scope.vm.selectedKeypair=[]; 
            $scope.sicurezza.password=''; 
            $scope.sicurezza.confermapwd=''; 
            $scope.sicurezza.matchPwd= false; 
          
        }


        $scope.onImageSelected = function (template, index, event) {
             $scope.vm.selectedTemplate = null;
             $scope.vm.selectedVmName = null;
             resetTabSicurezza()
            if ($scope.vm.selectedIndex === null) {
                $scope.vm.selectedIndex = index;
                $scope.vm.selectedTemplate = template;
                $scope.vm.availableVirtualizationOptions=template.hypervisor;
                $scope.vm.selectedVirtualizationOption = template.hypervisor[0]; 
                //$scope.isTemplateWindows()

            }
            else if ($scope.vm.selectedIndex === index) {
                $scope.vm.selectedIndex = null;
                $scope.vm.selectedTemplate = null;
                resetTabSicurezza(); 
            }
            else {
                $scope.vm.selectedIndex = index;
                $scope.vm.selectedTemplate = template;
                $scope.vm.availableVirtualizationOptions=template.hypervisor;
                $scope.vm.selectedVirtualizationOption = template.hypervisor[0];
               // $scope.isTemplateWindows() 

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

        $scope.onInfoVmChanged = function (selector) {
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

        $scope.submit = function () {

                //blocca lo schermo dopo 1 secondo di attesa risposta chiamata al servizio 
				setTimeout(() => {
					if($scope.promise.$$state.status===0){
						$rootScope.loadingElement = true;
					}
				}, 1000);
            console.log("SUBMIT", $scope.vm);

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
            }

           
            var vmJson = {
                // nome: $scope.vm.selectedVmName + $scope.vm.acronimoAccount ,
            	nome: $scope.vm.selectedVmName,
                descrizione: "",
                // accountId: $scope.accountUuid,
                templateUuid: $scope.vm.selectedTemplate.imageId,
                flavurUuid: $scope.vm.selectedSize[0].uuid,
                discobase: {
                    "dimensioneDisco": parseInt($scope.vm.selectedDiskSize),
                    "tipoDisco": $scope.fromIdToObj($scope.vm.availableDiskTypes, $scope.vm.selectedDiskType).description
                },
                dischiAggiuntivi: additionalStorages,
                region: $scope.fromIdToObj($scope.vm.availableRegions, $scope.vm.selectedRegion).description,
                az: $scope.fromIdToObj($scope.vm.availableAvailabilityZones, $scope.vm.selectedAvailabilityZone).description,
                subnet: $scope.vm.selectedSubnet,
                securityGroup: $scope.fromIdToObj($scope.vm.availableSecurityGroups, $scope.vm.selectedSecurityGroup).id,
                //tags: $scope.vm.tags.slice(0),
                adminPassword: ($scope.sicurezza.password!==null ? $scope.sicurezza.password : ""),
                hypervisor: $scope.vm.selectedVirtualizationOption ,//$scope.fromIdToObj($scope.vm.availableVirtualizationOptions, $scope.vm.selectedVirtualizationOption).code.toLowerCase(),
                nomeChiave:(   $scope.vm.selectedKeypair.length>0 ? $scope.vm.selectedKeypair[0].nome : null)  //$scope.vm.selectedKeypair[0].nome
           
            };

            console.log("SUBMIT JSON", JSON.stringify (vmJson));


            $scope.status.pending = true;
            Vm.save(vmJson, function (data) {
                logger.info('SUCCESS', data);
                notificationManager.showSuccessPopup($translate.instant('vm.nuova.success'));
                // LG 25.04.2019 Al termine della creazione si ritorna alla lista delle VM
                $state.go('app.vm');
            }, function (onfail) {
                logger.error('ERROR', onfail);
                if (onfail.body) {
                    if (onfail.body && onfail.body.data && onfail.body.data.message) {
                        notificationManager.showErrorPopup($translate.instant('vm.nuova.error') + ': ' + onfail.body.data.message);
                    } else {
                        notificationManager.showErrorPopup($translate.instant('vm.nuova.error'));
                    }
                } else if (onfail.data.message){
                    notificationManager.showErrorPopup($translate.instant('vm.nuova.error'), onfail.data.message);
                }else{
                    notificationManager.showErrorPopup($translate.instant('vm.nuova.error'));
                }
            }).finally(function() {
                $rootScope.loadingElement = false;
                
            });
        };

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

        function getTemplates() {
            var queryString = {};
            if ($scope.accountUuid) {
                queryString.accountUuid = $scope.accountUuid;
            }
            $scope.promise = Template.query(queryString).$promise;

            return $scope.promise.then(function (data) {
                logger.info("SUCCESS", data);
                
                for(var i in data){
                    if(data[i].hypervisor){
                        data[i].hypervisor=data[i].hypervisor.split(",");
                    }
                
                }
                $scope.vm.availableTemplates = data;
               
               
            }, function (onfail) {
                logger.error("ERROR", onfail);
                if (onfail.data) {
                    if (onfail.data && onfail.data.message) {
                        notificationManager.showErrorPopup($translate.instant('error.loading_template') + ': ' + onfail.data.message);
                    } else {
                        notificationManager.showErrorPopup($translate.instant('error.loading_template'));
                    }
                } else {
                    notificationManager.showErrorPopup($translate.instant('error.loading_template'));
                }
            });
        };

        $scope.historyBack = function(){
            $window.history.back();
        }

        function getFlavours() {
            var queryString = {};
            if ($scope.accountUuid) {
                queryString.accountUuid = $scope.accountUuid;
            }
            $scope.promise = Flavour.query(queryString).$promise;

            return $scope.promise.then(function (data) {
                logger.info("SUCCESS", data);
                
                $scope.vm.availableSizings=$scope.convertValues(data)

            }, function (onfail) {
                logger.error("ERROR", onfail);
                if (onfail.body) {
                    if (onfail.body && onfail.body.data && onfail.body.data.message) {
                        notificationManager.showErrorPopup($translate.instant('error.loading_flavour') + ': ' + onfail.body.data.message);
                    } else {
                        notificationManager.showErrorPopup($translate.instant('error.loading_flavour'));
                    }
                } else if(onfail.data.message ){
                    notificationManager.showErrorPopup($translate.instant('error.loading_flavour'));
                }
                
                else {
                    notificationManager.showErrorPopup($translate.instant('error.loading_flavour'),  onfail.data.message);
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
				//console.log(JSON.stringify(temp, undefined, 2));
				return temp; 
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
                if (onfail.body) {
                    if (onfail.body && onfail.body.data && onfail.body.data.message) {
                        notificationManager.showErrorPopup($translate.instant('error.loading_subnet') + ': ' + onfail.body.data.message);
                    } else {
                        notificationManager.showErrorPopup($translate.instant('error.loading_subnet'));
                    }
                }else if (onfail.data.message)  {
                    notificationManager.showErrorPopup($translate.instant('error.loading_subnet') + ' ' + onfail.data.message);
                }else {
                    notificationManager.showErrorPopup($translate.instant('error.loading_subnet'));
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
                if (onfail.body) {
                    if (onfail.body && onfail.body.data && onfail.body.data.message) {
                        notificationManager.showErrorPopup($translate.instant('error.loading_security_group') + ': ' + onfail.body.data.message);
                    } else {
                        notificationManager.showErrorPopup($translate.instant('error.loading_security_group'));
                    }
                }  else if (onfail.data.message){
                    notificationManager.showErrorPopup($translate.instant('error.loading_security_group') + ' ' + onfail.data.message);
                } else {
                    notificationManager.showErrorPopup($translate.instant('error.loading_security_group'));
                }
            });
        };

        function getAccount() {
            var abilitazione = AuthenticationService.getUtente().abilitazioneSelezionata;
			$scope.options.isDataLoaded=false;
			$scope.promise = DettaglioAccount.get({ 'uuid': abilitazione.accountUuid }).$promise;
	
			return $scope.promise.then(function (data) {
                $scope.account = angular.copy(data);
                $scope.vm.acronimoAccount = data &&  data.acronimo ? '-'+data.acronimo:'';
			}, function (onfail) {
                if(onfail.data.message)
                    notificationManager.showErrorPopup($translate.instant('error.loading_account') + ' ' + onfail.data.message);
                else 
                    notificationManager.showErrorPopup($translate.instant('error.loading_account'));
			}).finally(function() {
				$scope.options.isDataLoaded=true;
			});
        };
        

        function getKeypairs() {
            var queryString = {};
            if ($scope.accountUuid) {
                queryString.accountUuid = $scope.accountUuid;
            }
            $scope.promise = Keypair.query(queryString).$promise;
            return $scope.promise.then(function (data) {
                $scope.vm.availableKeypairs = data;
                if(data.length === 0){
                    $scope.options.elencoKeypairsVuoto = true;
                }else{
                    $scope.options.elencoKeypairsVuoto = false;
                }

            }, function (onfail) {
                if (onfail.body) {
                    if (onfail.body && onfail.body.data && onfail.body.data.message) {
                        notificationManager.showErrorPopup($translate.instant('error.loading_chiavi') + ': ' + onfail.body.data.message);
                    } else {
                        notificationManager.showErrorPopup($translate.instant('error.loading_chiavi'));
                    }
                } else if (onfail.data.message){
                    notificationManager.showErrorPopup($translate.instant('error.loading_chiavi') + ' ' + onfail.data.message);
                }else{
                    notificationManager.showErrorPopup($translate.instant('error.loading_chiavi'));
                }
            });


        };



        this.onInit = function () {
           
            getAccount();
            getTemplates();
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
            getFlavours();
            getSubnets();
            getSecurityGroups();
            getKeypairs();
            $q.all([

                VmIstanzeService.getAvailableDiskSizing().then(function (data) {
                    $scope.vm.availableDiskSizings = data;
                }),

                VmIstanzeService.getAvailableDiskTypes().then(function (data) {
                    $scope.vm.availableDiskTypes = data;
                    $scope.vm.selectedDiskType = data[0].id;
                }),


                VmIstanzeService.get().then(function (data) {
                    var o = data[0];

                    o.name = "Nuova VM";
                    o.id++;
                    o.code = o.id;
                    o.notes = "";

                    $scope.vm.vm = o;
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
    }]);

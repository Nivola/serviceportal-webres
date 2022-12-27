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

	.controller('DialogModificaFlavourController', ['$mdDialog', '$scope', 'entitiesRest','$state',
		'controllerValidator', 'notificationManager', 'loggers', 'vmDetails', '$translate', 
		
		function ($mdDialog, $scope, entitiesRest,$state,
			controllerValidator, notificationManager, loggers, vmDetails, $translate
			) {
			'use strict';

			var logger = loggers.get("DialogModificaFlavourController");

			$scope.vmDetails = vmDetails;
		
			$scope.isSelected= false; 
			var Flavour = entitiesRest.getEntity('VmFlavour');
			var Vm = entitiesRest.getEntity('Vm');
			$scope.FlavourSelected = null; 
			//$scope.status.pending = false;

			$scope.iconStyle = {
				"color": "#4285f4",
			}

			$scope.options = {
				rowSelection: true,
				multiSelect: false,
				autoSelect: true,
				decapitate: true,
				largeEditDialog: false,
				boundaryLinks: false,
				limitSelect: false,
				pageSelect: false
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
				selectedRegion: null,
				selectedAvailabilityZone: null,
				selectedSubnet: null,
				tags: [],
				selectedVirtualizationOption: null,
				selectedKeypair:[]
			};

		
			
			$scope.onDeselect = function(){
				$scope.isSelected=false;
			}

			$scope.criteriaMatch = function() {
				// il filtro adesso scarta dalla lista il record che ha lo stesso type del flavour attualmente montato sulla VM 
				return function( v ) {
				  return v.item.nome !== $scope.vmDetails.instanceType;
				};
			  };

		
			 $scope.onFlavourSelected = function (item) {
				$scope.convertValues(); 
				$scope.FlavourSelected=item; 
				$scope.isSelected=true;					
			 };

			
			
			function getFlavours() {
				var queryString = {};
				if ($scope.accountUuid) {
					queryString.accountUuid = $scope.accountUuid;
				}
				$scope.promise = Flavour.query(queryString).$promise;
	
				return $scope.promise.then(function (data) {
					logger.info("SUCCESS", data);
				
					//$scope.vm.availableSizings = data;
					$scope.vm.availableSizings=$scope.convertValues(data);
	
				}, function (onfail) {
					logger.error("ERROR", onfail);
					if (onfail.data) {
						notificationManager.showErrorPopup($translate.instant('vm.modifica_flavour.errore_caricamento') + ': ' + onfail.data.message);
					} else {
						notificationManager.showErrorPopup($translate.instant('vm.modifica_flavour.errore_caricamento'));
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


		$scope.showConfirm = function(ev) {
			// Appending dialog to document.body to cover sidenav in docs app

			var datiTesto = {
				nome: $scope.FlavourSelected.nome,
				vcpus: $scope.FlavourSelected.vcpus,
				ram: $scope.FlavourSelected.ram
			};

			var confirm = $mdDialog.confirm()
				  .title($translate.instant('vm.modifica_flavour.conferma'))
				  .textContent($translate.instant('vm.modifica_flavour.testo', datiTesto))
				  .ariaLabel('Lucky day')
				  .targetEvent(ev)
				  .ok($translate.instant('conferma'))
				  .cancel($translate.instant('annulla'));
		
			$mdDialog.show(confirm).then(function() {
			  $scope.conferma =true;
			  $scope.submit();
			}, function() {
			  $scope.conferma =false;
			});
		  };






			
			$scope.submit = function confirm() {
				
				var vmJson = {
					
					flavourUuid:  $scope.FlavourSelected.uuid,
					instanceUuid : $scope.vmDetails.instanceId
				};
	
				$mdDialog.hide(); 
			
				Vm.update(vmJson, function (data) {
					logger.info('SUCCESS', data);
					notificationManager.showSuccessPopup($translate.instant('vm.modifica_flavour.success'));
					// LG 25.04.2019 Al termine della creazione si ritorna alla lista delle VM
					
					$state.go('app.vm');
					
				}, function (onfail) {
					logger.error('ERROR', onfail);
					if (onfail.data) {
						notificationManager.showErrorPopup($translate.instant('vm.modifica_flavour.errore') + ': ' + onfail.data.message);
					} else {
						notificationManager.showErrorPopup($translate.instant('vm.modifica_flavour.errore'));
					}
				}).$promise.finally(function () {
					$mdDialog.hide(); 
				});
			};


			
			$scope.hide = function() {
				$scope.isSelected=false; 
				$mdDialog.hide();
			};

			$scope.cancel = function() {
				$scope.isSelected=false; 
				$mdDialog.cancel();
			};
		

			
			
			this.onInit = function () {
				getFlavours(); 
		
			}

			this.onExit = function () { };

			controllerValidator.validate(this, $scope);
		}]);

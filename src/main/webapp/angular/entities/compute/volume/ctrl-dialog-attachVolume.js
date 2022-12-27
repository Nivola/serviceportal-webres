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

	.controller('DialogAttachVolumeController', ['$mdDialog', '$scope', 'entitiesRest','$state', 'AuthenticationService',
		'controllerValidator', 'notificationManager', 'loggers', 'volumeDetails', '$translate', '$filter',
		
		function ($mdDialog, $scope, entitiesRest,$state, AuthenticationService,
			controllerValidator, notificationManager, loggers, volumeDetails, $translate, $filter
			) {
			'use strict';

			var logger = loggers.get("DialogAttachVolumeController");

			$scope.volumeDetails = volumeDetails;
		
			$scope.isSelected= false; 
			var Vm = entitiesRest.getEntity('Vm');
			var AttachVolune = entitiesRest.getEntity('AttachVolune');
			$scope.FlavourSelected = null; 
			//$scope.status.pending = false;

			$scope.iconStyle = {
				"color": "#4285f4",
			}

			
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

			$scope.selectedVM = []; 
			
			$scope.onDeselect = function(){
				$scope.isSelected=false;
			}

		

		
			 $scope.onVMSelected = function (item) {
				$scope.VMSelected=item; 
				$scope.isSelected=true;
			
			 };

		

		$scope.showConfirm = function(ev) {
			// Appending dialog to document.body to cover sidenav in docs app

			

			var confirm = $mdDialog.confirm()
				  .title($translate.instant('volume.dialog.confermaAttach'))
				  .textContent($translate.instant('volume.dialog.testoAttach', {"nomevol": $scope.volumeDetails['nvl-name'], "nomevm":  $scope.VMSelected.name}))
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


		  function getIstanze() {
			var queryString = {};
			var abilitazione = AuthenticationService.getUtente().abilitazioneSelezionata;
			queryString.accountUuid = abilitazione.accountUuid;
			
			$scope.promise = Vm.query(queryString).$promise;

			return $scope.promise.then(function (data) {
				logger.info("SUCCESS", data);
				data.forEach(function (value) {
					value.cpu_ram = '';
					if (value.cpu != null && value.ram != null) {
						value.cpu_ram = value.cpu + ' CPU, ';
					}
					if (value.ram != null) {
						value.cpu_ram = value.cpu_ram + value.ram + 'MB RAM';
					}
					value.region_az = '';
					if (value.region != null) {
						value.region_az = value.region;
						if (value.az != null) {
							value.region_az = value.region_az + ' - ' + value.az;
						}
					}

				 
					value.tags='';
					if(value.elencoTag && value.elencoTag.length>0 ){
						value.elencoTag.forEach(function (tag) {
							if(value.tags!='')
								 value.tags= value.tags +'-'+tag.key; 
							else
								 value.tags=tag.key; 
						})
					}

					value.secGroup='';
					if(value.securityGroup && value.securityGroup.length>0 ){
						value.securityGroup.forEach(function (sg) {
							if(value.secGroup!='')
								 value.secGroup= value.secGroup +' , '+sg.groupName; 
							else
							value.secGroup=sg.groupName; 
						})
					}


					var sColor = null;
					var sIcon = null;
					var sTooltip = null;
					if (value.status !== null) {
						if (value.status.toLowerCase() === "running") {
							sColor = "green";
							sIcon = "power_settings_new";
							sTooltip = $translate.instant('vm.stato.running');
						} else if (value.status.toLowerCase() === "pending") {
							sColor = "orange";
							sIcon = "av_timer";
							sTooltip = $translate.instant('vm.stato.pending');
						} else if (value.status.toLowerCase() === "stopped") {
							sColor = "red";
							sIcon = "power_settings_new ";
							sTooltip = $translate.instant('vm.stato.stopped');
						} else {
							sColor = "grey";
							sIcon = "warning";
							sTooltip = $translate.instant('vm.stato.value') + " " + value.status;
						}
					} else {
						sColor = "grey";
						sIcon = "warning";
						sTooltip = $translate.instant('vm.stato.undefined');
					}
					value.stato = {
						flag: value.status,
						color: sColor,
						icon: sIcon,
						tooltip: sTooltip
					};
				});
				$scope.istanze = data;
				$scope.numeroAttivi = $filter("filter")(data, { status: 'running' }).length;
				$scope.numeroDisattivi = $filter("filter")(data, { status: 'error' }).length;
			}, function (onfail) {
				logger.error("ERROR", onfail);
				if (onfail.data && onfail.data.message) {
					notificationManager.showErrorPopup($translate.instant('error.loading_vm') + ': ' + onfail.data.message);
				} else {
					notificationManager.showErrorPopup($translate.instant('error.loading_vm'));
				}
			});
		};




			
			$scope.submit = function confirm() {
				
				var attachJson = {
					
					instanceId:  $scope.selectedVM[0].instanceId,
					volumeId : $scope.volumeDetails.volumeId,
					
				};
	
				$mdDialog.hide(); 
			
				AttachVolune.update(attachJson, function (data) {
					logger.info('SUCCESS', data);
					notificationManager.showSuccessPopup($translate.instant('volume.dialog.success'));
					// LG 25.04.2019 Al termine della creazione si ritorna alla lista delle VM
					
					$state.go('app.volume');
					
				}, function (onfail) {
					logger.error('ERROR', onfail);
					if (onfail.data) {
						notificationManager.showErrorPopup($translate.instant('volume.dialog.erroreA') + ': ' + onfail.data.message);
					} else {
						notificationManager.showErrorPopup($translate.instant('volume.dialog.erroreA'));
					}
				}).$promise.finally(function () {
					//$scope.status.pending = false;
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
				getIstanze(); 
		
			}

			this.onExit = function () { };

			controllerValidator.validate(this, $scope);
		}]);

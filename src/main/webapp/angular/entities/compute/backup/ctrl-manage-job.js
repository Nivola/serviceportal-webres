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
nivolaApp.controller('ManageJobController',
	["$scope", "$state", "$stateParams", "$filter", "$mdDialog","$rootScope",
		"entitiesRest", "controllerValidator","AuthenticationService", "notificationManager", 'loggers', '$translate','$q',
		function ($scope, $state, $stateParams, $filter, $mdDialog, $rootScope,
			entitiesRest, controllerValidator,AuthenticationService, notificationManager, loggers, $translate,$q) {
			"use strict";

			var defer = $q.defer();
			var logger = loggers.get("ManageJobController");
			var RestorePoints = entitiesRest.getEntity('JobRestorePoints');
			var JobDetail = entitiesRest.getEntity('Job');
			var Vm = entitiesRest.getEntity('Vm');

			$scope.accountUuid=AuthenticationService.getUtente().abilitazioneSelezionata.accountUuid;

			$scope.query = {
				order: "name",
				limit: 10,
				page: 1,
				reverse:false
			};
			
			$scope.jobDetails = {};
			$scope.jobRestorePoints = [];
			$scope.loadingJob=false;
			$scope.loadingRP=false;

			function setJobData() {
					getJob($stateParams.jobId);
					getEnabledTooltipMessage();
			};
			
			function getEnabledTooltipMessage(){
				const tooltipBaseString='job.dettaglio.enable_status_tooltip.';
				const tooltipStatusString=$scope.jobDetails.enabled?'active':'stopped';
				const finalTooltipString= tooltipBaseString.concat(tooltipStatusString);
				$scope.jobDetails.enabledTooltip=$translate.instant(finalTooltipString);
			}

			function getRestorePoints(){
				$scope.loadingRP=true;
				setTimeout(() => {
				if($scope.promise.$$state.status===0){
					$rootScope.loadingElement = true;
				}
			}, 1000);
					var queryString = {};
					if ($scope.accountUuid) {
						queryString.accountId = $scope.accountUuid;
					}
					queryString.jobId = $stateParams.jobId;
					$scope.promise = RestorePoints.get(queryString).$promise;
		
					return $scope.promise.then(function (data) {
						logger.info("SUCCESS", data);

						$scope.jobRestorePoints=data.risultati;
					   					   
					}, function (onfail) {
						logger.error("ERROR", onfail);
						if (onfail.data) {
							if (onfail.data && onfail.data.message) {
								notificationManager.showErrorPopup($translate.instant('job.errors.loading_restore_points') + ': ' + onfail.data.message);
							} else {
								notificationManager.showErrorPopup($translate.instant('job.errors.loading_restore_points'));
							}
						} else {
							notificationManager.showErrorPopup($translate.instant('job.errors.loading_restore_points'));
						}
					}).finally(function() {
						loadRestorePoints();
					});
				};

				function getJob(idJob){
					$scope.loadingJob=true;
					setTimeout(() => {
						if($scope.promise.$$state.status===0){
							$rootScope.loadingElement = true;
						}
					}, 1000);
					var queryString = {};
					if ($scope.accountUuid) {
						queryString.accountId = $scope.accountUuid;
					}
					queryString.jobId=idJob;
					$scope.promise = JobDetail.get(queryString).$promise;
		
					return $scope.promise.then(function (data) {
						logger.info("SUCCESS", data);
						if(!!data.risultati&&!!data.risultati.length){

							$scope.jobDetails=data.risultati.filter(el=>el.jobId===$stateParams.jobId)[0];
						}
						$scope.jobDetails.instanceNum=data.instanceNum?data.instanceNum:data.elencoIstanze?data.elencoIstanze.length:0;
					}, function (onfail) {
						logger.error("ERROR", onfail);
						if (onfail.data) {
							if (onfail.data && onfail.data.message) {
								notificationManager.showErrorPopup($translate.instant('job.errors.reloading_detail_job') + ': ' + onfail.data.message);
							} else {
								notificationManager.showErrorPopup($translate.instant('job.errors.reloading_detail_job'));
							}
						} else {
							notificationManager.showErrorPopup($translate.instant('job.errors.reloading_detail_job'));
						}
					}).finally(function() {
						$scope.loadingJob=false;
						if(!$scope.loadingRP) $rootScope.loadingElement = false;
					});
				};

				$scope.loadVms=function(vms,id){
					if(vms&&vms.length){
						
					var multiPromise=[];
					
					vms.forEach((vm)=>{					
						multiPromise.push( Vm.get({ id: vm.codice }).$promise);
					})
					if(multiPromise.length>0){
						
					$rootScope.loadingElement = true;
					$q.all(multiPromise).then(function(data){
						$scope.jobRestorePoints.filter(rp=>rp.id===id)[0].vmList=data;
					}, function (onfail) {
						logger.error("ERROR", onfail);
						if (onfail.data) {
							if (onfail.data && onfail.data.message) {
								notificationManager.showErrorPopup($translate.instant('job.errors.loading_associated_vms') + ': ' + onfail.data.message);
							} else {
								notificationManager.showErrorPopup($translate.instant('job.errors.loading_associated_vms'));
							}
						} else {
							notificationManager.showErrorPopup($translate.instant('job.errors.loading_associated_vms'));
						}
					}).finally(function() {
						$rootScope.loadingElement = false;
					});
				}
			}
					
				}

				function loadRestorePoints(){
					var multiPromise=[];

					var queryString = {};
					if ($scope.accountUuid) {
						queryString.accountId = $scope.accountUuid;
					}
					queryString.jobId = $stateParams.jobId;
					$scope.jobRestorePoints.forEach((point)=>{						  
						queryString.restorePointId = point.id;
						multiPromise.push( RestorePoints.get(queryString).$promise);
					})

					$q.all(multiPromise).then(function(data){
						$scope.jobRestorePoints=data.map((res)=>({...res.risultati[0],vmList:[]}));
					}, function (onfail) {
						logger.error("ERROR", onfail);
						if (onfail.data) {
							if (onfail.data && onfail.data.message) {
								notificationManager.showErrorPopup($translate.instant('job.errors.loading_restore_points_detail') + ': ' + onfail.data.message);
							} else {
								notificationManager.showErrorPopup($translate.instant('job.errors.loading_restore_points_detail'));
							}
						} else {
							notificationManager.showErrorPopup($translate.instant('job.errors.loading_restore_points_detail'));
						}
					}).finally(function() {
						$scope.loadingRP=false;
						if(!$scope.loadingJob) $rootScope.loadingElement = false;
					});
			}

			$scope.resetToRestorePoint=function(idRp,idVm,nameVm){
				setTimeout(() => {
					if($scope.promise.$$state.status===0){
						$rootScope.loadingElement = true;
					}
				}, 1000);
						var queryString = {};
						if ($scope.accountUuid) {
							queryString.accountId = $scope.accountUuid;
						}
						queryString.instanceId = $stateParams.idVm;
						queryString.restorePointId = $stateParams.idVm;
						queryString.instanceName = $stateParams.idVm;
						$scope.promise = RestoreVM.post(queryString).$promise;
			
						return $scope.promise.then(function (data) {
							logger.info("SUCCESS", data);
							
							$state.go("app.jobs");
												  
						}, function (onfail) {
							logger.error("ERROR", onfail);
							if (onfail.data) {
								if (onfail.data && onfail.data.message) {
									notificationManager.showErrorPopup($translate.instant('vm.errors.restore_vm_ko') + ': ' + onfail.data.message);
								} else {
									notificationManager.showErrorPopup($translate.instant('vm.errors.restore_vm_ko'));
								}
							} else {
								notificationManager.showErrorPopup($translate.instant('vm.errors.restore_vm_ko'));
							}
						}).finally(function() {
							loadRestorePoints();
						});
					}

			this.onInit = function () {
				setJobData();
				getRestorePoints();
			};
			
			this.onExit = function () {
				$scope.status.tabIndex=0;
			};

			controllerValidator.validate(this, $scope);
}]);

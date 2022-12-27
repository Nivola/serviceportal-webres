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
nivolaApp.controller('GestioneVolumeController',
    ["$scope", "$state", "$stateParams", "$filter", "$mdDialog", '$translate',
        "entitiesRest", "controllerValidator", "notificationManager", 'loggers',
        'AuthenticationService', 'AuthLevel', 'ReadthedocService',
        function ($scope, $state, $stateParams, $filter, $mdDialog, $translate,
            entitiesRest, controllerValidator, notificationManager, loggers,
            AuthenticationService, AuthLevel,ReadthedocService) {
            "use strict";

			$scope.rtdmanageVolumi=ReadthedocService.getUrlFromPath('/index').docUrl;
            var logger = loggers.get("GestioneVolumeController");
			var DettachVolune = entitiesRest.getEntity('DettachVolune');

            $scope.messaggi = [];
            $scope.selected = [];

           
			$scope.options = {
				rowSelection: true,
				multiSelect: true,
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
                order: "dataPubblicazioneInizio",
                limit: 10,
                page: 1
            };

			


            $scope.actions = {
				auth: {
					

					delete: [
						AuthLevel.SUPERADMIN,
						AuthLevel.BOADMIN,
						/*AuthLevel.BOMONITORING,*/
						AuthLevel.OrgAdminRole,
						AuthLevel.DivAdminRole,
						AuthLevel.AccountAdminRole
					].join(",")
				},

				//refresh: getUtenti,

			
				view: function () {
					$state.go('app.messaggistica.view',{
						idMessaggio: $scope.selected[0].id,
					});
				},
				
				detach: function (VolumeDetails, item) {
					$mdDialog.show({
						locals: {
							volumeSelected: VolumeDetails,
							attachmentDetails : item,
							mdDialog: $mdDialog,
						},
						controller: 'DialogDetachController',
						templateUrl: 'angular/entities/compute/volume/tpl-dialog-detach.html',
						parent: angular.element(document.body),
						targetEvent: VolumeDetails,
						clickOutsideToClose: true,
						fullscreen: true	// Only for -xs, -sm breakpoints.
					})
						.then(function () {
							//ha cliccato conferma della dialog
							$scope.submit(item); 
						}, function () {
							//ha cliccato annulla della dialog
						});
				}, 

				

				
			}

           


			$scope.AttachVolume = function (ev) {
				$scope.selected=[];
				
				$mdDialog.show({
					locals: {
						volumeDetails: $scope.VolumeDetails
						
					},
					controller: 'DialogAttachVolumeController',
					templateUrl: 'angular/entities/compute/volume/tpl-dialog-attachVolume.html',
					parent: angular.element(document.body),
					targetEvent: ev,
					clickOutsideToClose: true,
					fullscreen: true	
				}).then(function (data) {
					console.log(data);
				});;
			}; 


		


			  $scope.submit = function confirm(attachmentDetails) {
				
				var detachJson = {
					
					instanceId:  attachmentDetails.instanceId,
					volumeId : 	 attachmentDetails.volumeId,
					device : "/dev/sdh"
					
				};
	
				$mdDialog.hide(); 
			
				DettachVolune.update(detachJson, function (data) {
					logger.info('SUCCESS', data);
					notificationManager.showSuccessPopup($translate.instant('volume.dialog.successD'));
					
					
					$state.go('app.volume');
					
				}, function (onfail) {
					logger.error('ERROR', onfail);
					if (onfail.data) {
						notificationManager.showErrorPopup($translate.instant('volume.dialog.erroreD') + ': ' + onfail.data.message);
					} else {
						notificationManager.showErrorPopup($translate.instant('volume.dialog.erroreD'));
					}
				}).$promise.finally(function () {
					//$scope.status.pending = false;
					$mdDialog.hide(); 
				});
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

			$scope.actions.gotoTab = function (index) {
				$scope.status.tabIndex = index;
			};

            this.onInit = function () {
                $scope.VolumeDetails = $stateParams.volume;
				$scope.status.tabIndex = $stateParams.tabIndex;

				//EK if refresh , force manage page  to go back to list page 
				if(!$stateParams.volume ||( Object.keys($stateParams.volume).length === 0 && $stateParams.volume.constructor === Object) ){
					$state.go('app.volume');
				}
               
            
               
            };

            this.onExit = function () { };

            controllerValidator.validate(this, $scope);
        }
    ]);

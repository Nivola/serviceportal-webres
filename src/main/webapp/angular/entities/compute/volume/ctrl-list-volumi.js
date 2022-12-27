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

	.controller('ListVolumiController', ['$mdDialog', '$scope', '$state','ReadthedocService', '$rootScope',
		'AuthLevel', 'entitiesRest', 'controllerValidator', '$timeout',
		'notificationManager', "$filter",  'loggers', 'conf','StringMap','AuthenticationService', '$translate',
		function ($mdDialog, $scope, $state,ReadthedocService, $rootScope, 
			AuthLevel, entitiesRest, controllerValidator,$timeout,
			notificationManager, $filter,  loggers, conf,StringMap,AuthenticationService, $translate) {
			'use strict';

			$scope.rtdlistVolumi=ReadthedocService.getUrlFromPath('/volume').docUrl;
			var logger = loggers.get("ListVolumiController");
			var ComputeVolumes = entitiesRest.getEntity('ComputeVolumes');
			var DeleteVolume =  entitiesRest.getEntity('DeleteVolume');
			var ReportcsvVolumi =  entitiesRest.getEntity('ReportcsvVolumi');
			

			$scope.notizie = [];
			$scope.selected = [];
			$scope.isBOAdmin=AuthenticationService.isGranted(AuthLevel.BOADMIN);

			$scope.advancedSearchState = false;

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
                order: "dataPubblicazioneInizio",
                limit: 10,
                page: 1
            };

			$scope.actions = {
				auth: {
					add: $state.get("app.volume").requiredUC,
					manage : $state.get("app.volume.manage").requiredUC,

					advancedSearch: [
						AuthLevel.SUPERADMIN,
						AuthLevel.BOADMIN,
						/*AuthLevel.BOMONITORING,*/
						AuthLevel.OrgAdminRole,
						AuthLevel.DivAdminRole,
						AuthLevel.AccountAdminRole
					].join(","),

					delete: [
						AuthLevel.SUPERADMIN,
						AuthLevel.BOADMIN,
						/*AuthLevel.BOMONITORING,*/
						AuthLevel.OrgAdminRole,
						AuthLevel.DivAdminRole,
						AuthLevel.AccountAdminRole
					].join(",")
				},

				refresh: getVolumi,


				add: function () {
						$state.go("app.volume.nuovo");
				},

				view: function () {
					
					$state.go('app.volume.manage',{
						volume: $scope.selected[0] , idVolume : $scope.selected[0].volumeId
					});
				 },

				 delete: function (event) {
					 if($scope.selected[0].status=="in-use"){
						notificationManager.showErrorPopup($translate.instant('volume.delete.errorInUse') );
						//$scope.unselectAll();
						return 
					 }
                    var confirm = $mdDialog
                        .confirm()
                        .title($translate.instant('volume.delete.titolo'))
                        .textContent($translate.instant('volume.delete.testo'))
                        .targetEvent(event)
                        .ok($translate.instant('si'))
                        .cancel($translate.instant('no'));
                    $mdDialog.show(confirm).then(function () {
                        $scope.selected.forEach(element => {
                            DeleteVolume.delete({ volumeId: element.volumeId }, function (data) {
                                logger.info("SUCCESS", data);
                                notificationManager.showSuccessPopup($translate.instant('volume.delete.success'));
                                // Reset lista
                                $scope.unselectAll();
                                $scope.resetFilter();
                                // Aggiorno lista VM
                                getVolumi();
                            }, function (onfail) {
                                logger.error("ERROR", onfail);
                                
                                if (onfail.data) {
                                     notificationManager.showErrorPopup($translate.instant('volume.delete.error') + ': ' + onfail.data.message);
                                } else if (onfail.data.messaggio){
                                    notificationManager.showErrorPopup($translate.instant('volume.delete.error') + ': ' + onfail.data.messaggio);
                                }else {
                                    notificationManager.showErrorPopup($translate.instant('volume.delete.error'));
                                }
                            });
                        });
                    });
                }, 

				downloadCSV:  function (event) {
                    setTimeout(() => {
                        if($scope.promise.$$state.status===0){
                            $rootScope.loadingElement = true;
                        }
                    }, 1000);
                    event.preventDefault();
                    
                   
                   
                    $scope.promise = ReportcsvVolumi.get().$promise;
            
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
                    });;
            
            
                },
           

		
			}

			//conta il numero di collegamenti attivi sul volume
			function setCollegamenti(){
				if($scope.volumi && $scope.volumi.length!=0){
					$scope.volumi.forEach(volume => {
						var filteredAttachmentSet = volume.attachmentSet.filter(obj => { return obj.status == "attached"; });
						volume.collegamenti=filteredAttachmentSet.length;
					});
				}
				
			}

		


            $scope.AttachVolume = function (ev) {
				//$scope.selected=[];
				if($scope.selected[0].status!="available"){
					notificationManager.showErrorPopup($translate.instant('volume.attachError') );
					//$scope.unselectAll();
					return 
				 }

				$mdDialog.show({
					locals: {
						volumeDetails: $scope.selected[0]
						
					},
					controller: 'DialogAttachVolumeController',
					templateUrl: 'angular/entities/compute/volume/tpl-dialog-attachVolume.html',
					parent: angular.element(document.body),
					targetEvent: ev,
					clickOutsideToClose: true,
					fullscreen: true	
				}).then(function (data) {
					console.log(data);
				}).finally(function() {
                    $scope.selected = []; 
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

			$scope.toggleLimitOptions = function () {
				$scope.limitOptions = $scope.limitOptions ? undefined : [5, 10, 15];
			};

			$scope.logItem = function (item) {
				logger.debug(item, 'was selected');
			};

			$scope.logOrder = function (order) {
				logger.debug('order: ', order);
			};

			$scope.logPagination = function (page, limit) {
				logger.debug('page: ', page);
				logger.debug('limit: ', limit);
			}

			$scope.hoverIn = function(notizia){
				
			   // this.hoverExpand = true;
			 
            };
        
            $scope.hoverOut = function(){
                this.hoverExpand = false;
            };

			function getVolumi() {

				
				//$scope.volumi = mockupResponse.elencoVolumi;
				$rootScope.loadingElement =  true ; 
				var queryString = {};
                if ($scope.accountUuid) {
                    queryString.accountId = $scope.accountUuid;
                }

				$scope.promise = ComputeVolumes.get(queryString).$promise;

                return $scope.promise.then(function (data) {
                    logger.info("SUCCESS", data);
					$scope.volumi =data.elencoVolumi;



					data.elencoVolumi.forEach( function(value){
						
                        var  sBadge = null; 
                        var  sStato = null; 

                        if(value.status !== null){
                            if (value.status.toLowerCase() === "in-use") {
                                sBadge= "badge badge-success";
                                sStato =$translate.instant('volume.statoText.inuse');

                            } else if (value.status.toLowerCase() === "pending") {
                                sBadge= "badge badge-warning";
                                sStato =$translate.instant('volume.statoText.pending');

                            }else if (value.status.toLowerCase() === "stopped") {
                                sBadge= "badge badge-secondary";
                                sStato =$translate.instant('volume.statoText.stopped');

                            }else if (value.status.toLowerCase() === "error") {
                                sBadge= "badge badge-danger";
                                sStato =$translate.instant('volume.statoText.error');

                            }
                            else if (value.status.toLowerCase() === "unknown") {
                                sBadge= "badge badge-warning";
                                sStato =$translate.instant('volume.statoText.unknow');

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

				




					// conta il numero di collegamenti attivi sul ogni volume 
					setCollegamenti(); 
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
                }).finally(function() {
                    $rootScope.loadingElement = false;
					//off()
                });
            };

			this.onInit = function () {
				var abilitazione = AuthenticationService.getUtente().abilitazioneSelezionata;
                logger.debug("Abilitazione corrente", abilitazione);
                $scope.accountUuid = abilitazione.accountUuid;

				getVolumi();
			};

			this.onExit = function () { };

			controllerValidator.validate(this, $scope);

		}]);

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
nivolaApp.controller('ListVolumesController',
	["$scope", "$state", "$stateParams", "$filter", "$mdDialog", 'ReadthedocService',
		"entitiesRest", "controllerValidator", "notificationManager", 'loggers', '$translate', 
		function ($scope, $state, $stateParams, $filter, $mdDialog, ReadthedocService, 
			entitiesRest, controllerValidator, notificationManager, loggers, $translate) {
			"use strict";

			$scope.rtdStaas=ReadthedocService.getUrlFromPath('/staas').docUrl;
			var logger = loggers.get("ListVolumesController");
			var Staas = entitiesRest.getEntity('Staas');
			var ReportcsvShare = entitiesRest.getEntity('ReportcsvShare');

			
					 
			
			$scope.volumes = [];
			$scope.selected = [];

			// Proprietà data-table
			$scope.options = {
				rowSelection: true,
				multiSelect: false,
				autoSelect: true,
				decapitate: false,
				largeEditDialog: false,
				boundaryLinks: false,
				limitSelect: true,
				pageSelect: true,
				elencoVuoto:false
			};

			$scope.limitOptions = [ 10, 20, 30];


			$scope.filter = {
				options: {
					debounce: 500
				}
			};

			$scope.query = {
				order: "name",
				limit: 10,
				page: 1
			};

			$scope.actions = {
				auth: {
					new: $state.get("app.volumes.new").requiredUC,
					manage: $state.get("app.volumes.manage").requiredUC,
					delete: $state.get("app.volumes.new").requiredUC,
					change: $state.get("app.volumes.change").requiredUC
				},

				refresh: getVolumes,

				manage: function () {
					var v = getVolumeSelezionato($scope.selected[0].accountId, $scope.selected[0].fileSystemId);
					$state.go("app.volumes.manage", {
					
						volume: v
					
					});
				},

				downloadCSV:  function (event) {
                    setTimeout(() => {
                        if($scope.promise.$$state.status===0){
                            $rootScope.loadingElement = true;
                        }
                    }, 1000);
                    event.preventDefault();
                    
                   
                   
                    $scope.promise = ReportcsvShare.get().$promise;
            
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
						if(onfail.data){
							notificationManager.showErrorPopup($translate.instant("error.loading_allegato") + ":"+ onfail.data.message );
						}else{
							notificationManager.showErrorPopup($translate.instant("error.loading_allegato"));
						}
                       
                    }).finally(function() {
                        $rootScope.loadingElement = false;
                    });
            
            
                },

				add: function () {
					$state.go("app.volumes.new");
				},

				change: function () {
					var canGrant = $scope.selected[0].nvlCapabilities.includes("grant");
					if(!canGrant){
						notificationManager.showErrorPopup($translate.instant('shares.autorizzazioni.grant'));
						return;
					}
					$state.go("app.volumes.change", {volumeId : $scope.selected[0].fileSystemId , 	nvlCapabilities: $scope.selected[0].nvlCapabilities

					});
					
				},

				delete: function (event) {
					$mdDialog.show({
						locals: {
							staasSelected: $scope.selected,
							mdDialog: $mdDialog,
						},
						controller: 'DialogDeleteStaasController',
						templateUrl: 'angular/entities/storage/volumi/tpl-dialog-delete-staas.html',
						parent: angular.element(document.body),
						targetEvent: event,
						clickOutsideToClose: true,
						fullscreen: true	// Only for -xs, -sm breakpoints.
					})
						.then(function () {
							//ha cliccato conferma della dialog
							Staas.delete({ id: $scope.selected[0].fileSystemId }, function (data) {
								var datiTesto = {
									nome: $scope.selected[0].nome
								}
								notificationManager.showSuccessPopup($translate.instant('shares.elimina.success', datiTesto));
								$mdDialog.hide();
								// Reset lista
								$scope.unselectAll();
								$scope.resetFilter();
								// Aggiorno lista istanze
								getVolumes();
							}, function (onfail) {

								if (onfail.data && onfail.data.message) {
									notificationManager.showErrorPopup($translate.instant('shares.elimina.error') + ' ' + onfail.data.message);
								} else if (onfail.data.messaggio){
									notificationManager.showErrorPopup($translate.instant('shares.elimina.error') + ': ', onfail.data.messaggio);
								}else{
									notificationManager.showErrorPopup($translate.instant('shares.elimina.error'));
								}

							});
						}, function () {
							//ha cliccato annulla della dialog
						});
				}
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






			function getVolumeSelezionato( accID, FSID) {
				 var  volumeSelezionato= $scope.volumes.filter(function(item) {
					return item.accountId ===accID &&  item.fileSystemId ===FSID;
				  });
				 
				  return volumeSelezionato && volumeSelezionato.length>0 ? volumeSelezionato[0]: {};
			};




			function getVolumes() {
                var queryString = {};
 
				$scope.promise = Staas.query(queryString).$promise;
                return $scope.promise.then(function (data) {
					if(data.length ===0){
						$scope.options.elencoVuoto = true;
					}
                    $scope.volumes = data;
                }, function (onfail) {
					if (onfail.data && onfail.data.message) {
						notificationManager.showErrorPopup($translate.instant('error.loading_shares') + ': ' + onfail.data.message);
					} else if (onfail.data.messaggio){
						notificationManager.showErrorPopup($translate.instant('error.loading_shares') + ': ', onfail.data.messaggio);
					}else{
						notificationManager.showErrorPopup($translate.instant('error.loading_shares'));
					}

				}).finally(function(){
					$scope.volumes = $scope.volumes.map(e => {
						e.dataCreazione = formatDate(new Date(e.dataCreazione));
						e.throughput = getThroughput(e.provisionedThroughputInMibps, e.throughputMode);
						e.dimensione = getDimensione(e.dimensioneInByte, 2);
						e.stato = getStatoFS(e.statoFileSystem);
						e.mountTargetsIds = getMountTargetsIds(e.mountTargets);
						e.tags = getTags (e.elencoTag); 
						e.ipAddresses = getIpAddresses(e.mountTargets);
						e.protocols = getProtocols(e.mountTargets);
						return e;
				});
				});

			};

			function getStatoFS(stato){
				let htmlStato = '';
				
				switch (stato) {
					case 'creating':
					case 'deleting':
						htmlStato = '<span class="badge badge-warning" >' + stato + '</span>';
						break;
					case 'available':
						htmlStato = '<span class="badge badge-success" >' + stato + '</span>';
						break;
					case 'deleted':
						htmlStato = '<span class="badge badge-danger" >' + stato + '</span>';
						break;
					case 'error':
						htmlStato = '<span class="badge badge-danger" >' + stato + '</span>';
						break;
					default :
						htmlStato = '<span class="badge badge-warning" >' + stato + '</span>';
						break;
				}
				return htmlStato;
			}

			function getDimensione(bytes, decimals = 2) {
				if (bytes === 0) return '0 Bytes';
			
				const k = 1024;
				const dm = decimals < 0 ? 0 : decimals;
				const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
			
				const i = Math.floor(Math.log(bytes) / Math.log(k));
			
				return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
			}

			function getMountTargetsIds(mountTargets){
				let htmlmountTargets = '<span class="md-caption" >';
				if(mountTargets && mountTargets.length > 0){
					mountTargets.forEach(target => {
						if(target['MountTargetId']){
							htmlmountTargets +=target['MountTargetId'];
						}
					});
				}
				htmlmountTargets+='</span>';
				return htmlmountTargets;
			}

			function getTags(tags){
				let htmlTags = '<span class="md-caption" >';
				if(tags && tags.length > 0){
					tags.forEach(tag => {
						if(tag['key']){
							htmlTags +=tag['key']+', ';
						}
					});
				}
				htmlTags+='</span>';
				return htmlTags;
			}

			function getIpAddresses(mountTargets){
				let htmlIpAddresses = '<span class="md-caption" >';
				if(mountTargets && mountTargets.length > 0){
					mountTargets.forEach(target => {
						if(target['IpAddress']){
							htmlIpAddresses +=target['IpAddress'];
						}
					});
				}
				htmlIpAddresses+='</span>';
				return htmlIpAddresses;
			}

			function getProtocols(mountTargets){
				let htmlProtocol = '<span class="md-caption" >';
				if(mountTargets && mountTargets.length > 0){
					mountTargets.forEach(target => {
						if(target['protocol']){
							htmlProtocol +=target['protocol'];
						}
					});
				}
				htmlProtocol+='</span>';
				return htmlProtocol;
			}
			
			function getThroughput(valore,mode){
				let htmlThroughput = '<span class="md-caption" >';
				if(mode && mode !==null && mode !==''){
					htmlThroughput +=mode;
				}
				if(valore && valore !==null){
					htmlThroughput+=' <b>'+valore+' MiB/S</b>'
				}
				htmlThroughput+='</span>';
				return htmlThroughput;
			}

            function formatDate(d) {
                let month = String(d.getMonth() + 1);
                let day = String(d.getDate());
                const year = String(d.getFullYear());
              
                if (month.length < 2) month = '0' + month;
                if (day.length < 2) day = '0' + day;
              
                return `${day}-${month}-${year}`;
              }
			this.onInit = function () {
				getVolumes();
			};

			this.onExit = function () { };

			controllerValidator.validate(this, $scope);
		}
	]);

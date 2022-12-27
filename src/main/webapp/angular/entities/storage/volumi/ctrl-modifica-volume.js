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
nivolaApp.controller('ModificaVolumeController',
	["$scope", "$state", "$stateParams", "$filter", "$mdDialog", 'ReadthedocService',
		"entitiesRest", "controllerValidator", "notificationManager", 'loggers', '$translate', 
		function ($scope, $state, $stateParams, $filter, $mdDialog, ReadthedocService, 
			entitiesRest, controllerValidator, notificationManager, loggers, $translate) {
			"use strict";
		
			$scope.rtdStaasGrant=ReadthedocService.getUrlFromPath('/staas/grant').docUrl;
			$scope.grants = [];
			$scope.selected = [];
			$scope.deletedIDs= []; 
			
			$scope.volumeId;

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

			$scope.actions = {
				auth: {
					newAuth: $state.get("app.volumes.newgrant").requiredUC,
					delete: $state.get("app.volumes.newgrant").requiredUC
				},
			}
			
			$scope.filter = {
					options: {
						debounce: 500
					}
			};

			$scope.query = {
				order: "name",
				limit: 100,
				page: 1
			};

			$scope.decodificaStato = function(stato){
				let htmlStato = '';
				stato = stato.toLowerCase();
				switch (stato) {
					case 'creating':
					case 'deleting':
						htmlStato = '<span class="badge badge-warning" >' + stato + '</span>';
						break;
					case 'available':
					case 'active':
					case 'attivo':
					case 'valido':
						htmlStato = '<span class="badge badge-success" >' + stato + '</span>';
						break;
					case 'deleted':
					case 'error':
					case 'errore':
						htmlStato = '<span class="badge badge-danger" >' + stato + '</span>';
						break;
					default :
						htmlStato = '<span class="badge badge-warning" >' + stato + '</span>';
						break;
				}
				return htmlStato;
			}


			
			function getGrants () {
				var Staas = entitiesRest.getEntity('StaasGrant');
				var queryString = {};
				
				$scope.promise = Staas.query({'id':$scope.volumeId ,'idGrant':''}).$promise;
                return $scope.promise.then(function (data) {
                	console.log(data);
					if(data.length ===0){
						$scope.options.elencoVuoto = true;
					}else{
						$scope.options.elencoVuoto = false;
					}
                    $scope.grants = data;
                }, function (onfail) {
					if (onfail.body && onfail.body.data && onfail.body.data.message) {
						notificationManager.showErrorPopup($translate.instant('error.loading_autorizzazioni') + ': ' + onfail.body.data.message);
					} else if (onfail.data.messaggio){
						notificationManager.showErrorPopup($translate.instant('error.loading_autorizzazioni'), onfail.data.messaggio);
					}else{
						notificationManager.showErrorPopup($translate.instant('error.loading_autorizzazioni'));
					}
				}).finally(function(){
					$scope.volumes = $scope.volumes.map(e => {
						e.dataCreazione = formatDate(new Date(e.dataCreazione));
						e.throughput = getThroughput(e.provisionedThroughputInMibps, e.throughputMode);
						e.dimensione = getDimensione(e.dimensioneInByte, 2);
						e.stato = getStatoFS(e.statoFileSystem);
						e.mountTargetsIds = getMountTargetsIds(e.mountTargets);
						e.ipAddresses = getIpAddresses(e.mountTargets);
						e.protocols = getProtocols(e.mountTargets);
						return e;
				});
				});

			};
			
			$scope.init = function () {
				$scope.volumeId = $stateParams.volumeId;
				//$scope.canGrant = $stateParams.nvlCapabilities.includes("grant");
				console.log($stateParams.nvlCapabilities)
				getGrants();
			};
			
			$scope.unselectAll = function () {
				$scope.selected = [];
			};
			
			
			$scope.refresh = function () {
				$scope.options.elencoVuoto = false;
				getGrants();
			};
			
			$scope.add = function () {
				$state.go("app.volumes.newgrant", {volumeId : $scope.volumeId});
			}

			$scope.filterArray = function(grant) {
				return ($scope.deletedIDs.indexOf(grant.id) === -1);
			};
			
			
			$scope.eliminaGrant = function (grant) {
                
                $scope.status.pending = true;
            	$scope.selected[0].id
            	var Staas = entitiesRest.getEntity('StaasGrant');
            	
            	Staas.delete({'id': $scope.volumeId, 'idGrant': $scope.selected[0].id}, function (data) {
                    
					notificationManager.showSuccessPopup($translate.instant('shares.autorizzazioni.elimina.success'));
					$scope.deletedIDs.push($scope.selected[0].id); 
					$scope.selected = [];
				
					
					getGrants();
                   

                }, function (onfail) {
					if (onfail.body && onfail.body.data && onfail.body.data.message) {
						notificationManager.showErrorPopup($translate.instant('shares.autorizzazioni.elimina.error') + ': ' + onfail.body.data.message);
					} else if (onfail.data.messaggio){
						notificationManager.showErrorPopup($translate.instant('shares.autorizzazioni.elimina.error'), onfail.data.messaggio);
					}else{
						notificationManager.showErrorPopup($translate.instant('shares.autorizzazioni.elimina.error'));
					}

                }).$promise.finally(function () {
                    $scope.status.pending = false;
                });

            };
			
			$scope.init();
			
		}
		
	]);

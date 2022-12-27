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
nivolaApp.controller('ManageDbaasController',
[
    '$mdDialog','$scope', '$state', '$stateParams', 'controllerValidator', 'notificationManager','ReadthedocService',
    'loggers', 'entitiesRest', 'AuthenticationService', '$translate','$rootScope',
    function (
        $mdDialog, $scope, $state, $stateParams, controllerValidator, notificationManager, ReadthedocService,
        loggers, entitiesRest, AuthenticationService, $translate, $rootScope) {
	
			$scope.rtdDbaasManage=ReadthedocService.getUrlFromPath('/dbaas/manage').docUrl;
			var logger = loggers.get("ManageVmController");
			var DBAAS = entitiesRest.getEntity('Dbaas');
			var DbaasUtente = entitiesRest.getEntity('DbaasUtente');
			var TagsManage = entitiesRest.getEntity('TagsManage');
			var TagsRemove = entitiesRest.getEntity('TagsRemove');
			$scope.dbaasDetails={};
			$scope.iconStyle = {
				"color": "#4285f4",
			}
			var myCopy= [];
			// $scope.$watch('utentiForm.nome.$error.required || utentiForm.nome.$error.pattern', function() {
				
			// 	$scope.colors.colorDis = 'red' ; 
			// });
		
		
	
			// Proprietà data-table

			

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

			$scope.formNotValid = true; 

			$scope.user = {
				name: '',
				note: '', 
				tipologia : ''
			  };

			$scope.actions = {
				auth: {
					createDisUser: $state.get("app.dbaas.change").requiredUC,
				}
			}
		

			  $scope.tipologie = [
				  {
					codice : "Solo Lettura",
					nome : $translate.instant('dbaas.manage.utenti.tipologia.sola_lettura')
				  },
				  {
					codice : "Lettura e Scrittura",
					nome : $translate.instant('dbaas.manage.utenti.tipologia.lettura_scrittura')
				  },
				  {
					codice : "Amministrativa",
					nome : $translate.instant('dbaas.manage.utenti.tipologia.amministrativa')
				  }
			];



			$scope.dbaas = {
				dbaasDetails: null,
				dbaasDNS : null, 
				VpcSecurityGroups: [],
				StatusInfos: [],
				Endpoint: [],
				DBSubnetGroup: [],
				
			};

	
			$scope.query = {
				order: "description"
			};
	
			$scope.status = {
				pending: false,
	
				tabIndex: 0,
				tagsReadOnly: false,
				tagsRemovable: true,
				tabIndex: 0
			
			};
	

			function azToSite(az) {
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



			 //EK BEGGIN TAGS SESSION 
			 $scope.tags = [];

			 $scope.readonly = false;
			 $scope.updateTags = function() {
             
				if (myCopy.length > $scope.dbaas.dbaasDetails.elencoTag.length) {
					var tagR = tagRemmoved(myCopy, $scope.dbaas.dbaasDetails.elencoTag); 
					myCopy= angular.copy($scope.dbaas.dbaasDetails.elencoTag); 
					 
					item= {
					  resourceId : $scope.dbaas.dbaasDetails.instanceId, 
					  tagKey : tagR
   
					 }
					 deleteTag(item); 
					 
	 
				 }else {
					

					 var tagA = tagAdded (myCopy, $scope.dbaas.dbaasDetails.elencoTag);

					var stringa= "^[A-Za-z-_]{1}[A-Za-z0-9-_ ]{1,64}$"; 
					var regex = new RegExp( stringa, 'g' );
					if(!tagA.match(regex)){
						notificationManager.showErrorPopup($translate.instant('error.tag_save_error'));
						return 
					}

					 myCopy= angular.copy($scope.dbaas.dbaasDetails.elencoTag); 
					 //console.log(" EK tag added " + tagA );
	 
					 var tagDTO = [{
						 codice: tagA,
						 valore : tagA
					 }];
	 
					 jsonTag = {
						 tags : tagDTO,
						 accountId : AuthenticationService.getUtente().abilitazioneSelezionata.accountId, 
						 risorsaId : $scope.dbaas.dbaasDetails.DBInstanceIdentifier
	 
					 }
					 //console.log("EK jasonTag ", JSON.stringify(jsonTag)); 
					 saveTag(jsonTag); 
					 
				 }
				
	 
			 };

			 function saveTag(item){

				
				
				TagsManage.save(item, function (data) {
						logger.info('SUCCESS', data);
						notificationManager.showSuccessPopup($translate.instant('tags.save_success'));
					}, function (onfail) {
						logger.error('ERROR', onfail);
						logger.error('ERROR', onfail);
						if (onfail.message) {
								notificationManager.showErrorPopup($translate.instant('tags.save_error') + ': ' + onfail.message);
						} else {
							notificationManager.showErrorPopup($translate.instant('tags.save_error'));
						}
					}).$promise.finally(function () {
						$scope.status.pending = false;
					});
			}; 




			function deleteTag(item){

				$scope.promise = TagsRemove.delete({ resourceId: item.resourceId, tagKey: item.tagKey }).$promise;
	
				return $scope.promise.then(function (data) {
					notificationManager.showSuccessPopup($translate.instant('tags.elimina_success'));
				  
				}, function (onfail) {
					logger.error('ERROR', onfail);
					if (onfail.message) {
							notificationManager.showErrorPopup($translate.instant('tags.elimina_error') + ': ' + onfail.message);
					} else {
						notificationManager.showErrorPopup($translate.instant('tags.elimina_error'));
					}
				});
				
			}
	
	
	   

			 function tagAdded(old, reccent){
				var added; 
				reccent.forEach(
						element => { 
							if(!old.includes(element))
								added = element; 
							   
							}
					);
				return added;
			}



			function tagRemmoved(old, reccent){
				var removed; 
				old.forEach(
						element => { 
							if(!reccent.includes(element))
								removed = element; 
							   
							}
					);
				return removed;
			}
			 // EK END TAGS SESSION 


			 


























			function getDbDetails() {
				
				setTimeout(() => {
					if($scope.promise.$$state.status===0){
						$rootScope.loadingElement = true;
					}
				}, 1000);

				$scope.promise = DBAAS.get({ id: $stateParams.dbaasId }).$promise;
	
				return $scope.promise.then(function (data) {
					logger.info("SUCCESS", data);
					
					setStatus(data);
					if(data.az!==null){
						$scope.dbaas.dbaasDNS = data.nome.toLowerCase()+'.'+azToSite(data.az).toLowerCase()+'.nivolapiemonte.it';  
					}
					
					$scope.dbaas.dbaasDetails = data;
					$scope.dbaas.VpcSecurityGroups = data.VpcSecurityGroups[0].VpcSecurityGroupMembership; 
					$scope.dbaas.StatusInfos = data.StatusInfos;
					$scope.dbaas.Endpoint = data.Endpoint ; 
					$scope.dbaas.DBSubnetGroup = data.DBSubnetGroup; 
				
					
					//var lisTags = ['uno', 'due', 'tre']; 
					var lisTags = []
					if (data.elencoTag)
					data.elencoTag.forEach(
						element => { 
							lisTags.push(element.key);
							}
					);
					$scope.dbaas.dbaasDetails.elencoTag=lisTags; 
					myCopy= angular.copy($scope.dbaas.dbaasDetails.elencoTag); 

				   
				}, function (onfail) {
					$scope.isRunning = false;
					logger.error('ERROR', onfail);
					if (onfail.body && onfail.body.data && onfail.body.data.message) {
						notificationManager.showErrorPopup($translate.instant('dbaas.lista.error') + ': ' + onfail.body.data.message);
					} else if (onfail.data.messaggio){
						notificationManager.showErrorPopup($translate.instant('dbaas.lista.error') + ': ' + onfail.data.messaggio);
					}else{
						notificationManager.showErrorPopup($translate.instant('dbaas.lista.error'));
					}
					return;
				}).finally(function() {
					 $rootScope.loadingElement = false;
				});
			};

			



			$scope.submitCrea = function () {

		
				var utenteJson = {
					nome: $scope.user.name,
					note: $scope.user.note,
					tipo:$scope.user.tipologia,
					id : $stateParams.dbaasId ,
					
				};

				
				$scope.status.pending = true;
				DbaasUtente.save(utenteJson, function (data) {
					logger.info('SUCCESS', data);
					notificationManager.showSuccessPopup($translate.instant('dbaas.manage.utenti.creazione.success'));
					$state.go('app.dbaas');
				}, function (onfail) {
					logger.error('ERROR', onfail);
					if (onfail.body && onfail.body.data && onfail.body.data.message) {
						notificationManager.showErrorPopup($translate.instant('dbaas.manage.utenti.creazione.error') + ': ' + onfail.body.data.message);
					} else if (onfail.data.messaggio){
						notificationManager.showErrorPopup($translate.instant('dbaas.manage.utenti.creazione.error') + ': ' + onfail.data.messaggio);
					}else{
						notificationManager.showErrorPopup($translate.instant('dbaas.manage.utenti.creazione.error'));
					}

				}).$promise.finally(function () {
					$scope.status.pending = false;
				});
			};


			$scope.submitRevoca = function(event) {
				
				var utenteJson = {
					nome: $scope.user.name,
					note: $scope.user.note,
					tipo:$scope.user.tipologia,
					id : $stateParams.dbaasId ,
					
				};

				var confirm = $mdDialog
					.confirm()
					.title($translate.instant('dbaas.manage.utenti.elimina.titolo'))
					.textContent($translate.instant('dbaas.manage.utenti.elimina.testo'))
					.targetEvent(event)
					.ok($translate.instant('si'))
					.cancel($translate.instant('no'))
				$mdDialog.show(confirm).then(function () {
					
					DbaasUtente.dismetti(utenteJson, function (data) {
							console.log("success", data);
							notificationManager.showSuccessPopup($translate.instant('dbaas.manage.utenti.elimina.success'));
							$state.go('app.dbaas');
						}, function (onfail) {
							console.error("deleteError", onfail);

							if (onfail.body && onfail.body.data && onfail.body.data.message) {
								notificationManager.showErrorPopup($translate.instant('dbaas.manage.utenti.elimina.error') + ': ' + onfail.body.data.message);
							} else if (onfail.data.messaggio){
								notificationManager.showErrorPopup($translate.instant('dbaas.manage.utenti.elimina.error') + ': ' + onfail.data.messaggio);
							}else{
								notificationManager.showErrorPopup($translate.instant('dbaas.manage.utenti.elimina.error'));
							}
						});
					
				});
			}






			function setStatus (value) {

				var  sBadge = null; 
                var  sStato = null; 

                        if(value.status !== null){
                            if (value.status.toLowerCase() === "available") {
                                sBadge= "badge badge-success";
                                sStato =$translate.instant('dbaas.statoText.available');

                            } else if (value.status.toLowerCase() === "pending") {
                                sBadge= "badge badge-warning";
                                sStato =$translate.instant('dbaas.statoText.pending');

                            }else if (value.status.toLowerCase() === "stopped") {
                                sBadge= "badge badge-secondary";
                                sStato =$translate.instant('dbaas.statoText.stopped');

                            }else if (value.status.toLowerCase() === "error") {
                                sBadge= "badge badge-danger";
                                sStato =$translate.instant('dbaas.statoText.errore');

                            }
                            else if (value.status.toLowerCase() === "unknown") {
                                sBadge= "badge badge-warning";
                                sStato =$translate.instant('dbaas.statoText.unknow');

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


			}

	
			this.onInit = function () {
			
				getDbDetails();
			
				
			   
			};
	
			this.onExit = function () {
	
			};
	
			controllerValidator.validate(this, $scope);
		}]);

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




angular.module('app').controller('ManageVolumeController', [
    '$scope', '$state', '$stateParams', 'controllerValidator', 'notificationManager',
    'loggers', 'entitiesRest', 'AuthenticationService', 'ReadthedocService', '$translate', 
    function (
        $scope, $state, $stateParams, controllerValidator, notificationManager,
        loggers, entitiesRest, AuthenticationService, ReadthedocService, $translate) {

        var logger = loggers.get("ManageVolumeController");
		
        var Staas = entitiesRest.getEntity('Staas');
        var TagsManage = entitiesRest.getEntity('TagsManage');
        var TagsRemove = entitiesRest.getEntity('TagsRemove');
        $scope.rtdStaasManage=ReadthedocService.getUrlFromPath('/staas/manage').docUrl;

        $scope.volume={};
        $scope.iconStyle = {
            "color": "#4285f4",
        }
        $scope.resize= false; 

        $scope.staas = {
          
            availableStaasSizings: [20 , 30 , 40, 50, 75 , 100 , 125 , 150 , 175 , 200 , 250 ,300 , 350 , 400 ,450, 500],

        };

        var myCopy= [];

        $scope.actions = {
            auth: {
                editDim: $state.get("app.volumes.newgrant").requiredUC,
            },
        }


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

        $scope.query = {
            order: "description"
        };

        $scope.status = {
            pending: false,

            tabIndex: 0
        };

        $scope.volumeResized = {
            dimensione : 0,
            fileSystemId :  $scope.volume.fileSystemId
        }

        $scope.change = function () {
            $scope.resize= true; 
        }

        $scope.annula= function () {
            $scope.resize= false; 
        }


        $scope.submit = function () {
            var requestBody = {
                //name: $scope.staas.selectedStaasName,
                nuovaDimensione : parseInt($scope.volumeResized.dimensione),
                fileSystemId :  $scope.volumeResized.fileSystemId, 
                //tipo: $scope.staas.selectedStaasType,
                //protocolloShare: angular.lowercase($scope.subnet.selectedProtocol),
                //subnetId: $scope.fromIdToObj($scope.subnet.availableSubnets, $scope.subnet.selectedSubnet).subnetId,
            }
       
            $scope.requestBody = JSON.stringify(requestBody);

             $scope.status.pending = true;
            Staas.update(requestBody, function (data) {
                logger.info('SUCCESS', data);
                notificationManager.showSuccessPopup($translate.instant('shares.manage.success'));
                $state.go('app.volumes');

            }, function (onfail) {
                if (onfail.body) {
                    if (onfail.body && onfail.body.data && onfail.body.data.message) {
                        notificationManager.showErrorPopup($translate.instant('shares.manage.error') + ' ' + onfail.body.data.message);
                    } else {
                        notificationManager.showErrorPopup($translate.instant('shares.manage.error'));
                    }
                } else {
                    notificationManager.showErrorPopup($translate.instant('shares.manage.error'));
                }
            }).$promise.finally(function () {
                $scope.status.pending = false;
                $scope.resize= false; 
            });
        
        };



     
			 //EK BEGGIN TAGS SESSION 
			 $scope.tags = [];

			 $scope.readonly = false;
			 $scope.updateTags = function() {
             
				if (myCopy.length >$scope.volume.elencoTag.length) {
					var tagR = tagRemmoved(myCopy,$scope.volume.elencoTag); 
					myCopy= angular.copy($scope.volume.elencoTag); 
					item= {
					  resourceId : $scope.volume.fileSystemId, 
					  tagKey : tagR
   
					 }
					 deleteTag(item); 
					 
	 
				 }else {
					

					 var tagA = tagAdded (myCopy,$scope.volume.elencoTag);

					var stringa= "^[A-Za-z-_]{1}[A-Za-z0-9-_ ]{1,64}$"; 
					var regex = new RegExp( stringa, 'g' );
					if(!tagA.match(regex)){
						notificationManager.showErrorPopup($translate.instant('tags.save_error_pattern'));
						return 
					}

					 myCopy= angular.copy($scope.volume.elencoTag); 
	 
					 var tagDTO = [{
						 codice: tagA,
						 valore : tagA
					 }];
	 
					 jsonTag = {
						 tags : tagDTO,
						 accountId : AuthenticationService.getUtente().abilitazioneSelezionata.accountId, 
						 risorsaId : $scope.volume.fileSystemId
	 
					 }
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

        
   
      

        this.onInit = function () {

            //EK if refresh , force manage page  to go back to list page 
            if(!$stateParams.volume ||( Object.keys($stateParams.volume).length === 0 && $stateParams.volume.constructor === Object) ){
                $state.go('app.volumes');
            }else{


                $scope.volume = $stateParams.volume;
                $scope.volumeResized.fileSystemId =  $scope.volume.fileSystemId;
                $scope.canResize = $scope.volume.nvlCapabilities.includes("resize");
                var lisTags = []
                if ($scope.volume.elencoTag)
                $scope.volume.elencoTag.forEach(
                    element => { 
                        lisTags.push(element.key);
                        }
                );
                $scope.volume.elencoTag=lisTags; 
                myCopy= angular.copy($scope.volume.elencoTag); 

            }

            

           
         
        };

        this.onExit = function () {

        };

        controllerValidator.validate(this, $scope);
    }]);

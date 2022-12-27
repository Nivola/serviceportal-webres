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
angular.module('app').controller('ManageVmController', 
[
    '$mdDialog','$scope', '$state', '$stateParams', 'controllerValidator', 'notificationManager', '$window',
    'loggers', 'entitiesRest', 'AuthenticationService','ReadthedocService','AuthLevel','$timeout', '$translate', '$rootScope',
    function (
        $mdDialog, $scope, $state, $stateParams, controllerValidator, notificationManager, $window,
        loggers, entitiesRest, AuthenticationService, ReadthedocService, AuthLevel, $timeout, $translate, $rootScope) {

        var logger = loggers.get("ManageVmController");
        var Vm = entitiesRest.getEntity('Vm');
        var TagsManage = entitiesRest.getEntity('TagsManage');
        var TagsRemove = entitiesRest.getEntity('TagsRemove');
        var Snapshot = entitiesRest.getEntity('Snapshot');
        var RevertSnapshot = entitiesRest.getEntity('RevertSnapshot');
        var DettachVolune = entitiesRest.getEntity('DettachVolune');
        var ComputeVolumes = entitiesRest.getEntity('ComputeVolumes');
		var rebootVm= entitiesRest.getEntity('rebootVm');
        var RestorePoints = entitiesRest.getEntity('JobRestorePoints');
        var RestoreVM = entitiesRest.getEntity('RestoreVM');

        
        
        var SecurityGroup = entitiesRest.getEntity('SecurityGroup');
        $scope.rtdVMmanage=ReadthedocService.getUrlFromPath('/vm/manage').docUrl;
        $scope.vmDetails={};
        $scope.iconStyle = {
            "color": "#4285f4",
        }
        $scope.editFlavour= false; 
        $scope.editSG= false; 
        var myCopy= []; 
       

        $scope.vm={
            selectedSg:null
        }


        $scope.vmRestorePoints=[];

        //EK BEGGIN TAGS SESSION 
        $scope.tags = [];
        $scope.readonly = false;
        $scope.updateTags = function() {
            console.log('The model has changed to ' + $scope.tags + '.');
        };
  
        // EK END TAGS SESSION 

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

        $scope.queryRP = {
            order: "created",
            limit: 10,
            page: 1,
            reverse:true
        };


        $scope.actions = {
            auth: {
                new: $state.get("app.vm.new").requiredUC,
                connect: $state.get("app.vm.new").requiredUC,
                delete: $state.get("app.vm.new").requiredUC, 
                editShare:  AuthLevel.AccountAdminRole,
                editSecGroup:  AuthLevel.AccountAdminRole,
                startStopVm :  AuthLevel.AccountAdminRole
            },

            newSecG : function(){
                if(!$scope.shownewsgCard){
                    $scope.shownewsgCard= true ; 
                }else{
                    $scope.shownewsgCard= false ; 
                }
               
            }, 

            saveNewSecG : function (){
       //         console.log($scope.vmDetails.securityGroup[0].groupName+" secgroup updated to :"+ $scope.vm.selectedSg.groupId);
                var arrAdd = new Array();
                var arrDel = new Array();
                arrAdd.push($scope.vm.selectedSg.groupId);
               // $scope.vmDetails.securityGroup.forEach(element => arrDel.push(element.groupId));
                var vmJson = {
                    flavourUuid:  '',
                    instanceUuid : $scope.vmDetails.instanceId,
                    elencoGruppiAggiungere : arrAdd,
                    elencoGruppiEliminare : arrDel
                };
                console.log(JSON.stringify(vmJson));
                Vm.update(vmJson, function (data) {
                    logger.info('SUCCESS', data);
                    notificationManager.showSuccessPopup($translate.instant('vm.manage.success_newsg'));
                   // $window.location.reload();
                    // LG 25.04.2019 Al termine della creazione si ritorna alla lista delle VM
                    //$state.go('app.vm');
                    
                }, function (onfail) {
                    logger.error('ERROR', onfail);
                    if (onfail.data) {
                        notificationManager.showErrorPopup($translate.instant('vm.manage.error_newsg') + ': ' + onfail.data.message);
                    } else {
                        notificationManager.showErrorPopup($translate.instant('vm.manage.error_newsg'));
                    }
                }).$promise.finally(function () {
                    $scope.shownewsgCard = false;
                  
                   
                });
            },

            removeSecgroup : function (secGroup){
                //console.log($scope.vmDetails.securityGroup[0].groupName+" secgroup updated to :"+ $scope.vm.selectedSg.groupId);
                var arrAdd = new Array();
                var arrDel = new Array();
               
                arrDel.push(secGroup.groupId)
                
                var vmJson = {
                    flavourUuid:  '',
                    instanceUuid : $scope.vmDetails.instanceId,
                    elencoGruppiAggiungere : arrAdd,
                    elencoGruppiEliminare : arrDel
                };
                console.log(JSON.stringify(vmJson));
                Vm.update(vmJson, function (data) {
                    logger.info('SUCCESS', data);
                    notificationManager.showSuccessPopup($translate.instant('vm.manage.success_deletesg'));
                   
                }, function (onfail) {
                    logger.error('ERROR', onfail);
                    if (onfail.data) {
                        notificationManager.showErrorPopup($translate.instant('vm.manage.error_deleteSG') + ': ' + onfail.data.message);
                    } else {
                        notificationManager.showErrorPopup($translate.instant('vm.manage.error_deleteSG'));
                    }
                }).$promise.finally(function () {
                    $scope.shownewsgCard = false;
                  
                   
                });
            },

            // deleteSnapshot: function (snapshot) {
            //    $state.go('app.snapshots.delete', { snapshot: snapshot, idAccount: $scope.account.idAccount ,accountName: $scope.account.name });
            // },

            deleteSnapshot: function (snapshot) {
                var confirm = $mdDialog
                .confirm()
                .title($translate.instant('vm.snapshot.elimina.titolo') + ' " ' +  snapshot.snapshotName + ' " ')
                .htmlContent(" <md-dialog-content class='md-dialog-content ng-scope'> <div> <b class='ng-binding '>" + $translate.instant('vm.snapshot.elimina.testo') + "</b><br><br><p class='ng-binding'>" + $translate.instant('vm.snapshot.elimina.procedere')+ "</b> <br></div></md-dialog-content>")
                .targetEvent(event)
                .ok($translate.instant('conferma'))
                .cancel($translate.instant('annulla'))
                $mdDialog.show(confirm).then(function () {
                    Snapshot.update({ nomeSnapshot: snapshot.snapshotName, 
                                      accountId : AuthenticationService.getUtente().abilitazioneSelezionata.accountUuid,
                                      instanceId : $stateParams.idVm,
                                    idSnapshot : snapshot.snapshotId}, function (data) {
                    notificationManager.showSuccessPopup($translate.instant('vm.snapshot.elimina.success'));
                    getSnapshots();
                    }, function (onfail) {
                        notificationManager.showErrorPopup($translate.instant('vm.snapshot.elimina.error') + ' : '+ onfail.data.message );
                    });
                });

            },

            
            revertSnapshot: function (snapshot) {
                var confirm = $mdDialog
                .confirm()
                .title($translate.instant('vm.snapshot.revert.titolo') + ' " ' +  snapshot.snapshotName + ' " ')
                .htmlContent(" <md-dialog-content class='md-dialog-content ng-scope'> <div> <b class='ng-binding '>" + $translate.instant('vm.snapshot.revert.testo') + "</b><br><br><p class='ng-binding'>" + $translate.instant('vm.snapshot.revert.procedere')+ "</b> <br></div></md-dialog-content>")
                .targetEvent(event)
                .ok($translate.instant('conferma'))
                .cancel($translate.instant('annulla'))
                $mdDialog.show(confirm).then(function () {
                    RevertSnapshot.update({ nomeSnapshot: snapshot.snapshotName, 
                                      accountId : AuthenticationService.getUtente().abilitazioneSelezionata.accountUuid,
                                      instanceId : $stateParams.idVm,
                                      idSnapshot : snapshot.snapshotId }, function (data) {
                    notificationManager.showSuccessPopup($translate.instant('vm.snapshot.revert.success'));
                    getSnapshots();
                    }, function (onfail) {
                        notificationManager.showErrorPopup($translate.instant('vm.snapshot.revert.error') + ' : '+ onfail.data.message );
                    });
                });

            },

       

            creaSnapshot: function (event) {
                $mdDialog.show({
                    locals: {
                        Snapshot: Snapshot,
                        mdDialog: $mdDialog,
                        snapshots:$scope.snapshots,
                        uuIdVM: $stateParams.idVm
                    },
                    controller: 'DialogNuovaSnapshotController',
                    templateUrl: 'angular/entities/compute/snapshot/tpl-dialog-nuova-snapshot.html',
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

            refresh : function (event){
                getSnapshots();
            },

            refreshDettaglioVM : function (event){
                getVmDetails();
            }


        }

        
        $scope.query = {
            order: "description"
        };

        $scope.status = {
            pending: false,

            tagsReadOnly: false,
            tagsRemovable: true,
            tabIndex: 0
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

        $scope.getOsIcon = function (template) {
            var os = template.toLowerCase();
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

        // $scope.manageFlavour=  function () {
        //     $state.go("app.flavour.manage", {
        //         vm: $scope.vmDetails
        //     });
        // };

        


        $scope.manageFlavour = function (ev) {
            $scope.selected=[];
            
            $mdDialog.show({
                locals: {
                    vmDetails: $scope.vmDetails
                    
                },
                controller: 'DialogModificaFlavourController',
                templateUrl: 'angular/entities/compute/vm/tpl-dialog-modifica-flavour.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: true	
            }).then(function (data) {
                console.log(data);
            });;
        }; 


      


        $scope.loadSecurityGroups = function() {
            return $timeout(function() {

                $scope.Secgroups= $scope.groups; 
                $scope.Secgroups.forEach(function (value) {
					value.isDisabled=false;
				});
                
                
                if($scope.vmDetails.securityGroup[0]){
                    for (index=0 ; index<$scope.Secgroups.length; index++){
                    
                        if($scope.Secgroups[index].groupId==$scope.vmDetails.securityGroup[0].groupId){
                            $scope.Secgroups[index].isDisabled=true; 
                        }
                    }

                }
               
          
              }, 650);
        };


       function getSecurityGroups(){
        
        setTimeout(() => {
            if($scope.promise.$$state.status===0){
                $rootScope.loadingElement = true;
            }
        }, 1000);
        var queryString = {};
               
        queryString.accountUuid = AuthenticationService.getUtente().abilitazioneSelezionata.accountUuid;
      
        $scope.promise = SecurityGroup.query(queryString).$promise;

        return $scope.promise.then(function (data) {
            logger.info("SUCCESS", data);
            $scope.groups = data;
        }, function (onfail) {
            logger.error("ERROR", onfail);
            if (onfail.data && onfail.data.message) {
                notificationManager.showErrorPopup($translate.instant('error.loading_security_group') + ': ' + onfail.data.message);
            } else {
                notificationManager.showErrorPopup($translate.instant('error.loading_security_group'));
            }
        
        }).finally(function() {
            $rootScope.loadingElement = false;
        });

       }


       
			$scope.dettachVolume = function(item) {
				// Appending dialog to document.body to cover sidenav in docs app
	
				
	
				var confirm = $mdDialog.confirm()
					  .title($translate.instant('volume.dialog.confermaAttach'))
					  .textContent($translate.instant('volume.dialog.testoDettach', {"nomevol": item.deviceName, "nomevm":   $scope.vmDetails.name}))
					  .ariaLabel('Lucky day')
					  .targetEvent(item)
					  .ok($translate.instant('conferma'))
					  .cancel($translate.instant('annulla'));
			
				$mdDialog.show(confirm).then(function() {
				  $scope.conferma =true;
				  $scope.submit(item);
				}, function() {
				  $scope.conferma =false;
				});
			  };


              $scope.submit = function confirm(item) {
				
				var detachJson = {
					
					instanceId:  $scope.vmDetails.instanceId,
					volumeId : 	 item.ebs.volumeId,
					device : "/dev/sdh"
					
				};
	
				$mdDialog.hide(); 
			
				DettachVolune.update(detachJson, function (data) {
					logger.info('SUCCESS', data);
					notificationManager.showSuccessPopup($translate.instant('volume.dialog.successD'));
					// LG 25.04.2019 Al termine della creazione si ritorna alla lista delle VM
					
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

	




        $scope.start = function () {
            $scope.promise = Vm.update({ id: $stateParams.idVm, action: "accensione" }).$promise;

            $scope.status.pending = true;
            return $scope.promise.then(function (onsuccess) {
                logger.info('SUCCESS', onsuccess);
                notificationManager.showSuccessPopup($translate.instant('vm.avvia.success'));
                $scope.isRunning = true;
                // LG 24.04.2019 Forza il rientro al pagina precedente (Lista VM)
                $state.go('app.vm');
            }, function (onfail) {
                logger.error('ERROR', onfail);
                if (onfail.data) {
                    notificationManager.showErrorPopup($translate.instant('vm.avvia.error'), onfail.data.message);
                } else{
                    notificationManager.showErrorPopup($translate.instant('vm.avvia.error'));
                }
                
            }).finally(function () {
                $scope.status.pending = false;
            });
        }




        $scope.restart = function () {
            // console.log("VM RESTART: ", $scope.vmDetails);
 			var confirm = $mdDialog
                        .confirm()
                        .title($translate.instant('vm.reboot.titolo'))
                        .textContent($translate.instant('vm.reboot.testo'))
                        .targetEvent(event)
                        .ok($translate.instant('si'))
                        .cancel($translate.instant('no'));
			$mdDialog.show(confirm).then(function () {
            	rebootVm.save({ instanceId: $stateParams.idVm }, function (data) {
                	logger.info("SUCCESS", data);
                    notificationManager.showSuccessPopup($translate.instant('vm.reboot.success'));
	                
					// LG 06.10.2020 Forza il rientro al pagina precedente (Lista VM)
    	            $state.go('app.vm');

                }, function (onfail) {
                	logger.error("ERROR", onfail);
                                
                    if (onfail.data) {
                                     notificationManager.showErrorPopup($translate.instant('vm.reboot.error') + ': ' + onfail.data.message);
                    } else if (onfail.data.messaggio){
                                    notificationManager.showErrorPopup($translate.instant('vm.reboot.error') + ': ' + onfail.data.messaggio);
                    }else {
                                    notificationManager.showErrorPopup($translate.instant('vm.reboot.error'));
                    }
                });
				
			});
        }

        $scope.stop = function () {
			console.log("VM STOP: ", $scope.vmDetails);
			$scope.promise = Vm.remove({ id: $stateParams.idVm, action: "accensione" }).$promise;
            // $scope.promise = Vm.remove({ id: $stateParams.idVm, action: "arresto" }).$promise;

            $scope.status.pending = true;
            return $scope.promise.then(function (onsuccess) {
                logger.info('SUCCESS', onsuccess);
                notificationManager.showSuccessPopup($translate.instant('vm.arresto.success'));
                $scope.isRunning = false;
                // LG 24.04.2019 Forza il rientro al pagina precedente (Lista VM)
                $state.go('app.vm');
            }, function (onfail) {
                logger.error('ERROR', onfail);
                if (onfail.data) {
                    notificationManager.showErrorPopup($translate.instant('vm.arresto.error'), onfail.data.message);
                } else{
                    notificationManager.showErrorPopup($translate.instant('vm.arresto.error'));
                }
            }).finally(function () {
                $scope.status.pending = false;
            });
        }

      

        function getVolumeFromList(vol) {

            $scope.volumi.filter(function(item){
                return item.volumeId == vol.ebs.volumeId;         
            })
        }
        
			function getVolumi() {

				var queryString = {};
                queryString.accountId = AuthenticationService.getUtente().abilitazioneSelezionata.accountUuid;
				$scope.promise = ComputeVolumes.get(queryString).$promise;

                return $scope.promise.then(function (data) {
                    logger.info("SUCCESS", data);
					$scope.volumi =data.elencoVolumi;

					
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
                });
            };


        function getVmDetails() {
           // getVolumi();
           setTimeout(() => {
            if($scope.promise.$$state.status===0){
                $rootScope.loadingElement = true;
            }
        }, 1000);
            $scope.promise = Vm.get({ id: $stateParams.idVm }).$promise;

            return $scope.promise.then(function (data) {
                logger.info("SUCCESS", data);
                data.cpu_ram = '';
                if (data.cpu != null && data.ram != null) {
                    data.cpu_ram = data.cpu + ' CPU, ';
                }
                if (data.ram != null) {
                    data.cpu_ram = data.cpu_ram + data.ram + 'MB RAM';
                }
                data.region_az = '';
                if (data.region != null) {
                    data.region_az = data.region;
                    if (data.az != null) {
                        data.region_az = data.region_az + ' - ' + data.az;
                    }
                }



                data.site = data.site ? data.site : $scope.azToSite(data.az);
                $scope.vmDetails = data;
                
              //volumi associati
                data.blockDeviceMapping.forEach (e =>{
                    //var vol = getVolumeFromList(e);
                    e.ebs.status == "attached" ?  e.ebs.badge_class = 'badge-success' :  e.ebs.badge_class = 'badge-warning';
                   
                })

                var lisTags = []; 
                data.elencoTag.forEach(
                    element => { 
                        lisTags.push(element.key);
                        }
                );
                $scope.vmDetails.elencoTag=lisTags; 

                myCopy= angular.copy($scope.vmDetails.elencoTag); 
                $scope.vmDetails.additionalStorages= data.blockDeviceMapping; 
               
                $scope.isRunning = $scope.vmDetails.status === 'running';
                $scope.editFlavour= true; 
                $scope.editSG= true;
               
                $scope.isTabSnapshotActive = $scope.vmDetails.hypervisor.toLowerCase() === "openstack" ? false : true;





                var sColor = null;
                var sIcon = null;
                var sTooltip = null;
                var  sBadge = null; 
                var  sStato = null; 

                if(data.status !== null){
                    if (data.status.toLowerCase() === "running") {
                        sTooltip = $translate.instant('vm.stato.running');
                        sBadge= "badge badge-success";
                        sStato =$translate.instant('vm.statoText.running');

                    } else if (data.status.toLowerCase() === "pending") {
                        sTooltip = $translate.instant('vm.stato.pending');
                        sBadge= "badge badge-warning";
                        sStato =$translate.instant('vm.statoText.pending');

                    }else if (data.status.toLowerCase() === "stopped") {
                        sTooltip = $translate.instant('vm.stato.stopped');
                        sBadge= "badge badge-secondary";
                        sStato =$translate.instant('vm.statoText.stopped');

                    }else if (data.status.toLowerCase() === "error") {
                        sTooltip = $translate.instant('vm.stato.errore');
                        sBadge= "badge badge-danger";
                        sStato =$translate.instant('vm.statoText.errore');

                    }
                    else if (data.status.toLowerCase() === "unknown") {
                        sTooltip = $translate.instant('vm.stato.unknow');
                        sBadge= "badge badge-warning";
                        sStato =$translate.instant('vm.statoText.unknow');

                    }
                    else{
                        sTooltip = $translate.instant('vm.stato.value') + " " + data.status;
                        sBadge= "badge badge-light";
                        sStato =data.status ;
                    }
                }


             
              

                $scope.vmDetails.stato = {
                    flag: data.status,
                    color: sColor,
                    icon: sIcon,
                    tooltip: sTooltip,
                    badge: sBadge,
                    stato: sStato
                };

                

            }, function (onfail) {
                $scope.isRunning = false;
                logger.error('ERROR', onfail);
                if (onfail.data) {
                	notificationManager.showErrorPopup($translate.instant('vm.manage.error') + ': ' + onfail.data.message);
                } else{
                	notificationManager.showErrorPopup($translate.instant('vm.manage.error'));
                }
                return;
            }).finally(function() {
                $rootScope.loadingElement = false;
            });
        };

        function saveTag(item){
            TagsManage.save(item, function (data) {
					logger.info('SUCCESS', data);
					notificationManager.showSuccessPopup($translate.instant('tags.save_success'));
				}, function (onfail) {
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

        
      

          //EK BEGGIN TAGS SESSION 
       
          $scope.readonly = false;
          $scope.updateTags = function() {
             
             if (myCopy.length > $scope.vmDetails.elencoTag.length) {
                  var tagR = tagRemmoved(myCopy, $scope.vmDetails.elencoTag); 
                  myCopy= angular.copy($scope.vmDetails.elencoTag); 
                  //console.log(" EK tag removed " +  tagR); 
                  item= {
                    resourceId : $scope.vmDetails.instanceId, 
                    tagKey : tagR

                  }
                  deleteTag(item); 
                  
  
              }else {
                  var tagA = tagAdded (myCopy, $scope.vmDetails.elencoTag);

                  var stringa= "^[A-Za-z-_]{1}[A-Za-z0-9-_ ]{1,64}$"; 
					var regex = new RegExp( stringa, 'g' );
					if(!tagA.match(regex)){
						notificationManager.showErrorPopup($translate.instant('error.tag_save_error'));
						return 
					}

                  myCopy= angular.copy($scope.vmDetails.elencoTag); 
                  //console.log(" EK tag added " + tagA );
  
                  var tagDTO = [{
                      codice: tagA,
                      valore : tagA
                  }];
  
                  jsonTag = {
                      tags : tagDTO,
                      accountId : AuthenticationService.getUtente().abilitazioneSelezionata.accountId, 
                      risorsaId : $scope.vmDetails.instanceId
  
                  }
                  //console.log("EK jasonTag ", JSON.stringify(jsonTag)); 
                  saveTag(jsonTag); 
                  
              }
             
  
          };
  
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
  

          
          function getSnapshots() {
            var queryString = {};
          
            queryString.accountId = AuthenticationService.getUtente().abilitazioneSelezionata.accountUuid;   
            queryString.instanceId= $stateParams.idVm;
            
            $scope.promise = Snapshot.query(queryString).$promise;
                return $scope.promise.then(function (data) {
                 
                    data.forEach (e =>{
                        e.snapshotStatus == "available" ? e.badge_class = 'badge-success' : e.badge_class = 'badge-warning'

                    })
               
                $scope.snapshots = data;
                if(data.length === 0){
                    $scope.options.elencoVuoto = true;
                }else{
                    $scope.options.elencoVuoto = false;
                }

            }, function (onfail) {
               
                    if (onfail.data && onfail.data.message) {
                        notificationManager.showErrorPopup($translate.instant('error.loading_snapshot') + ': ' + onfail.data.message);
                    } else 
                        if(onfail.message) {
                        notificationManager.showErrorPopup($translate.instant('error.loading_snapshot'), onfail.message);
                    }else{
                        notificationManager.showErrorPopup($translate.instant('error.loading_snapshot'));
                    }
               
            });


 
        };
        
        $scope.onTabSelected = function() {
            $scope.showAddButton=true;
            getSnapshots();
        }

        $scope.onTabDeselected = function() {
            $scope.showAddButton=false;
        }
        
        function getRestorePoints (){
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
					$scope.promise = RestorePoints.get(queryString).$promise;
		
					return $scope.promise.then(function (data) {
						logger.info("SUCCESS", data);
						
						$scope.vmRestorePoints=data.risultati;
					   					   
					}, function (onfail) {
						logger.error("ERROR", onfail);
						if (onfail.data) {
							if (onfail.data && onfail.data.message) {
								notificationManager.showErrorPopup($translate.instant('vm.errors.loading_restore_points') + ': ' + onfail.data.message);
							} else {
								notificationManager.showErrorPopup($translate.instant('vm.errors.loading_restore_points'));
							}
						} else {
							notificationManager.showErrorPopup($translate.instant('vm.errors.loading_restore_points'));
						}
					}).finally(function() {
                        loadRestorePoints();
					});;
        }

        $scope.loadVms=function(vms,id){
            if(vms&&vms.length){
                
            var multiPromise=[];
            
            vms.forEach((vm)=>{					
                multiPromise.push( Vm.get({ id: vm.codice }).$promise);
            })
            if(multiPromise.length>0){
                
            $rootScope.loadingElement = true;
            $q.all(multiPromise).then(function(data){
                $scope.vmRestorePoints.filter(rp=>rp.id===id)[0].vmList=data;
            }, function (onfail) {
                logger.error("ERROR", onfail);
                if (onfail.data) {
                    if (onfail.data && onfail.data.message) {
                        notificationManager.showErrorPopup($translate.instant('vm.errors.loading_associated_vms') + ': ' + onfail.data.message);
                    } else {
                        notificationManager.showErrorPopup($translate.instant('vm.errors.loading_associated_vms'));
                    }
                } else {
                    notificationManager.showErrorPopup($translate.instant('vm.errors.loading_associated_vms'));
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
            queryString.instanceId = $stateParams.idVm;
            $scope.vmRestorePoints.forEach((point)=>{						  
                queryString.restorePointId = point.id;
                multiPromise.push( RestorePoints.get(queryString).$promise);
            })

            $q.all(multiPromise).then(function(data){
                $scope.vmRestorePoints=data.map((res)=>({...res.risultati[0],vmList:[]}));
            }, function (onfail) {
                logger.error("ERROR", onfail);
                if (onfail.data) {
                    if (onfail.data && onfail.data.message) {
                        notificationManager.showErrorPopup($translate.instant('vm.errors.loading_restore_points_detail') + ': ' + onfail.data.message);
                    } else {
                        notificationManager.showErrorPopup($translate.instant('vm.errors.loading_restore_points_detail'));
                    }
                } else {
                    notificationManager.showErrorPopup($translate.instant('vm.errors.loading_restore_points_detail'));
                }
            }).finally(function() {
                 $rootScope.loadingElement = false;
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
                    
                    $state.go("app.vm");
                                          
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
            var abilitazione = AuthenticationService.getUtente().abilitazioneSelezionata;
            $scope.accountUuid = abilitazione.accountUuid;
           // getVolumi();
            getVmDetails();
            getRestorePoints();
           
           
            $scope.vmDetails.acronimoAccount = abilitazione.acronimo ? '-'+abilitazione.acronimo:'';
           
            abilitazione.userRole==AuthLevel.AccountViewerRole? $scope.isViewer= true : $scope.isViewer= false; 
            getSecurityGroups(); 
        };

        this.onExit = function () {

        };
    
        controllerValidator.validate(this, $scope);
    }]);

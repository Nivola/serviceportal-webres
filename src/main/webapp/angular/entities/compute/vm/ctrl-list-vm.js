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
nivolaApp.controller('ListVmController',
    ["$scope", "$state", "$stateParams", "$filter", "$mdDialog", "$rootScope",
        "entitiesRest", "controllerValidator", "notificationManager", 'loggers',
        'AuthenticationService', 'AuthLevel', 'ReadthedocService', '$translate', 
        function ($scope, $state, $stateParams, $filter, $mdDialog,$rootScope,
            entitiesRest, controllerValidator, notificationManager, loggers,
            AuthenticationService, AuthLevel, ReadthedocService, $translate) {
            "use strict";

            var logger = loggers.get("ListVmController");
            var Vm = entitiesRest.getEntity('Vm');
            var ReportcsvVM = entitiesRest.getEntity('ReportcsvVM');
            var rebootVm= entitiesRest.getEntity('rebootVm');
            
            $scope.rtdVMList=ReadthedocService.getUrlFromPath('/vm/list').docUrl;
            $scope.rtdVMConnect=ReadthedocService.getUrlFromPath('/vm/connetti').docUrl;
            $scope.istanze = [];
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
                pageSelect: true
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
                    new: $state.get("app.vm.new").requiredUC,
                    change: $state.get("app.vm.change").requiredUC,
                    manage: $state.get("app.vm.manage").requiredUC,
                    duplicate: $state.get("app.vm.change").requiredUC,
                    connect: $state.get("app.vm.new").requiredUC,
                    delete: $state.get("app.vm.new").requiredUC, 
                    editShare:  AuthLevel.AccountAdminRole,
                    startStopVm :  AuthLevel.AccountAdminRole
                },

                refresh: getIstanze,

                change: function () {
                    $state.go("app.vm.change", {
                        idVm: $scope.selected[0].id
                    });
                },

                manage: function (ev) {
                    $mdDialog.show({
                        locals: {
                            vmSelected: $scope.selected
                        },
                        controller: 'DialogManageVmController',
                        templateUrl: 'angular/entities/compute/vm/tpl-dialog-manage-vm.html',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        clickOutsideToClose: true,
                        fullscreen: true	// Only for -xs, -sm breakpoints.
                    });
                },

                duplicate: function () {

                },

                recoveryPoint: function () {
                    notificationManager.showErrorPopup("Work in progress..."+ String.fromCodePoint(0x1F92F) + " "+ String.fromCodePoint(0x1F91E));
                },

                // connect VM  old version . (adesso c'è un link che porta direttamente al readthedoc)
                connect: function (ev) {
                    $mdDialog.show({
                        locals: {
                            vmSelected: $scope.selected
                        },
                        controller: 'DialogConnectController',
                        templateUrl: 'angular/entities/compute/vm/tpl-dialog-connect-vm.html',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        clickOutsideToClose: true,
                        fullscreen: true	// Only for -xs, -sm breakpoints.
                    });
                },

                reboot: function (event) {
                    var confirm = $mdDialog
                        .confirm()
                        .title($translate.instant('vm.reboot.titolo'))
                        .textContent($translate.instant('vm.reboot.testo'))
                        .targetEvent(event)
                        .ok($translate.instant('si'))
                        .cancel($translate.instant('no'));
                    $mdDialog.show(confirm).then(function () {
                        $scope.selected.forEach(element => {
                            rebootVm.save({ instanceId: element.instanceId }, function (data) {
                                logger.info("SUCCESS", data);
                                notificationManager.showSuccessPopup($translate.instant('vm.reboot.success'));
                                // Reset lista
                                $scope.unselectAll();
                                $scope.resetFilter();
                                // Aggiorno lista VM
                                getIstanze();
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
                    });
                },



                delete: function (event) {
                    var confirm = $mdDialog
                        .confirm()
                        .title($translate.instant('vm.elimina.titolo'))
                        .textContent($translate.instant('vm.elimina.testo'))
                        .targetEvent(event)
                        .ok($translate.instant('si'))
                        .cancel($translate.instant('no'));
                    $mdDialog.show(confirm).then(function () {
                        $scope.selected.forEach(element => {
                            Vm.delete({ id: element.instanceId }, function (data) {
                                logger.info("SUCCESS", data);
                                notificationManager.showSuccessPopup($translate.instant('vm.elimina.success'));
                                // Reset lista
                                $scope.unselectAll();
                                $scope.resetFilter();
                                // Aggiorno lista VM
                                getIstanze();
                            }, function (onfail) {
                                logger.error("ERROR", onfail);
                                
                                if (onfail.data) {
                                     notificationManager.showErrorPopup($translate.instant('vm.elimina.error') + ': ' + onfail.data.message);
                                } else if (onfail.data.messaggio){
                                    notificationManager.showErrorPopup($translate.instant('vm.elimina.error') + ': ' + onfail.data.messaggio);
                                }else {
                                    notificationManager.showErrorPopup($translate.instant('vm.elimina.error'));
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
                    
                   
                   
                    $scope.promise = ReportcsvVM.get().$promise;
            
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
                    });
            
            
                },
		
            };

            $scope.resetFilter = function () {
                $scope.filter.search = '';
                $scope.query.filter = '';
            };

            $scope.unselectAll = function () {
                $scope.selected = [];
            };

            function getIstanze() {
                setTimeout(() => {
					if($scope.promise.$$state.status===0){
						$rootScope.loadingElement = true;
					}
				}, 1000);

                var queryString = {};
                if ($scope.accountUuid) {
                    queryString.accountUuid = $scope.accountUuid;
                }
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
                        var  sBadge = null; 
                        var  sStato = null; 

                        if(value.status !== null){
                            if (value.status.toLowerCase() === "running") {
                                sTooltip = $translate.instant('vm.stato.running');
                                sBadge= "badge badge-success";
                                sStato =$translate.instant('vm.statoText.running');

                            } else if (value.status.toLowerCase() === "pending") {
                                sTooltip = $translate.instant('vm.stato.pending');
                                sBadge= "badge badge-warning";
                                sStato =$translate.instant('vm.statoText.pending');

                            }else if (value.status.toLowerCase() === "stopped") {
                                sTooltip = $translate.instant('vm.stato.stopped');
                                sBadge= "badge badge-secondary";
                                sStato =$translate.instant('vm.statoText.stopped');

                            }else if (value.status.toLowerCase() === "error") {
                                sTooltip = $translate.instant('vm.stato.errore');
                                sBadge= "badge badge-danger";
                                sStato =$translate.instant('vm.statoText.errore');

                            }
                            else if ((value.status.toLowerCase() === "unknown") || (value.status == null) ) {
                                sTooltip = $translate.instant('vm.stato.unknow');
                                sBadge= "badge badge-warning";
                                sStato =$translate.instant('vm.statoText.unknow');

                            }
                            else{
                                sTooltip = $translate.instant('vm.stato.value') + " " + value.status;
                                sBadge= "badge badge-light";
                                sStato =value.status ;
                            }
                        }


                        value.stato = {
                            flag: value.status,
                            color: sColor,
                            icon: sIcon,
                            tooltip: sTooltip,
                            badge: sBadge,
                            stato: sStato
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
                }).finally(function() {
                    $rootScope.loadingElement = false;
					//off()
                });
            };


            this.onInit = function () {
                var abilitazione = AuthenticationService.getUtente().abilitazioneSelezionata;
                logger.debug("Abilitazione corrente", abilitazione);

                // Recupero Uuid dell'Account a cui l'agente appartiene
                // NOTE: filtro su accountUUID eseguito sul backend
                // $scope.accountUuid = abilitazione.accountUuid;

                // Recupera le istanze
                getIstanze();
            };

            this.onExit = function () { };

            controllerValidator.validate(this, $scope);
        }
    ]);

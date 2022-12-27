/*-
 * ========================LICENSE_START=================================
 * Nivola Service Portal Web Resources
 * %%
 * Copyright (C) 2022 Regione Piemonte
 * %%
 * SPDX-FileCopyrightText: Copyright 2022 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
nivolaApp.controller('NuovoSgController',
    ["$scope", "$state", "$stateParams", "$filter", "$mdDialog", 'ReadthedocService',
        "entitiesRest", "controllerValidator", "notificationManager", 'loggers',
        'AuthenticationService', 'AuthLevel', '$translate',
        function ($scope, $state, $stateParams, $filter, $mdDialog, ReadthedocService, 
            entitiesRest, controllerValidator, notificationManager, loggers,
            AuthenticationService, AuthLevel, $translate) {
            "use strict";


            
            $scope.rtdSGnew=ReadthedocService.getUrlFromPath('/sg/new').docUrl;
            var logger = loggers.get("NuovoSgController");
            var SecurityGroupTemplates = entitiesRest.getEntity('SecurityGroupTemplates');
            var Vpc = entitiesRest.getEntity('Vpc');
            var SecurityGroup = entitiesRest.getEntity('SecurityGroup');

            
            $scope.templates=[];
            $scope.vpcs=[];
            $scope.selectedVPC = [];
            $scope.isTemplateSelected = false; 
            $scope.isVPCSelected=false ;

            $scope.newSg = {
                nome:null,
                descrizione:null,
                uuidTemplate:null,
                selectedIndex: null,
                selectedTemplate: null,         
                vpcId:null
            };

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
                order: "nvlName",
                limit: 10,
                page: 1
            };

            $scope.getSGIcon = function (template, index) {
                 
				return index !== undefined ? 'sg-template-'+(index+1):'sg-template-nd';
			}
            
            $scope.onTemplateSelected = function (template, index, event) {
               
                if ($scope.newSg.selectedIndex === null) {
                    $scope.newSg.selectedIndex = index;
                    $scope.newSg.selectedTemplate = template;
                    $scope.isTemplateSelected = true; 
                    //$scope.isVPCSelected = true; 
                }
                else if ($scope.newSg.selectedIndex === index) {
                    $scope.newSg.selectedIndex = null;
                    $scope.newSg.selectedTemplate = null;
                    $scope.isTemplateSelected = false; 
                    //$scope.isVPCSelected = false; 
                }
                else {
                    $scope.newSg.selectedIndex = index;
                    $scope.newSg.selectedTemplate = template;
                }

            };
            
            $scope.onVpcSelected = function(){
                $scope.isVPCSelected = true; 
            }; 

            $scope.onVpcDeselect = function(){
                $scope.isVPCSelected = false; 
            }; 


            $scope.actions = {
                auth: {
                    new: $state.get("app.sg.new").requiredUC
                },

                refresh: function(){
                    getTemplates();
                    getElencoVpc();
                },
                creaSecurityGroup:function(event,nuovoSgForm){

                    if($scope.selectedVPC.length <=0){
                        notificationManager.showErrorPopup($translate.instant('security_group.nuovo.vpc_selezionare'));
                        return;
                    }else{
                        $scope.newSg.vpcId =  $scope.selectedVPC[0]['vpcId'];
                    }

                    $scope.newSg.uuidTemplate = $scope.newSg.selectedTemplate.uuid;
                    if ($scope.newSg.nome === null ||
                       // $scope.newSg.descrizione === null ||
                        $scope.newSg.uuidTemplate  === null ||
                        $scope.newSg.vpcId  === null ) {
                        notificationManager.showErrorPopup($translate.instant('security_group.nuovo.error_campi'));
                        return;
                    }

                    SecurityGroup.save($scope.newSg, function (data) {
                        notificationManager.showSuccessPopup($translate.instant('security_group.nuovo.success'));

                        event.preventDefault();
                        nuovoSgForm.$setPristine(true);
                        nuovoSgForm.$setUntouched(true);
                        $scope.templates=[];
                        $scope.vpcs=[];
                        $scope.selectedVPC = [];
            
                        $scope.newSg = {
                            nome:null,
                            descrizione:null,
                            uuidTemplate:null,
                            selectedIndex: null,
                            selectedTemplate: null,         
                            vpcId:null
                        };
                        //$scope.actions.refresh();
                        $state.go("app.sg");

                    }, function (onfail) {
                       
                        if (onfail.data && onfail.data.message) {
                            notificationManager.showErrorPopup($translate.instant('security_group.nuovo.error') + ': ' + onfail.data.message);
                        } else if (onfail.data.messaggio) {
                            notificationManager.showErrorPopup($translate.instant('security_group.nuovo.error'), onfail.data.messaggio);
                        } else {
                            notificationManager.showErrorPopup($translate.instant('security_group.nuovo.error'));
                        }
                    }).$promise.finally(function () {
                        $scope.status.pending = false;
                    });


                },
              };

            function getTemplates() {
                var queryString = {};
                $scope.promise = SecurityGroupTemplates.query(queryString).$promise;

                return $scope.promise.then(function (data) {
                    $scope.templates = data;
                }, function (onfail) {
                    if (onfail.body && onfail.body.data.message) {
                        notificationManager.showErrorPopup($translate.instant('error.loading_templates') + ': ' + onfail.body.data.message);
                    } else if (onfail.data.messaggio) {
                        notificationManager.showErrorPopup($translate.instant('error.loading_templates'), onfail.data.messaggio);
                    } else {
                        notificationManager.showErrorPopup($translate.instant('error.loading_templates'));
                    }

                });
            };


            function getElencoVpc() {
                var queryString = {};
                if ($scope.accountUuid) {
                    queryString.accountUuid = $scope.accountUuid;
                }
                $scope.promise = Vpc.query(queryString).$promise;

                return $scope.promise.then(function (data) {
                    $scope.vpcs = data;
                }, function (onfail) {
                    if (onfail.body && onfail.body.data.message) {
                        notificationManager.showErrorPopup($translate.instant('error.loading_vpc') + ': ' + onfail.body.data.message);
                    } else if (onfail.data.messaggio) {
                        notificationManager.showErrorPopup($translate.instant('error.loading_vpc'), onfail.data.messaggio);
                    } else {
                        notificationManager.showErrorPopup($translate.instant('error.loading_vpc'));
                    }

                });
            };   

            this.onInit = function () {
                getTemplates();
                getElencoVpc();
            };

            this.onExit = function () { };

            controllerValidator.validate(this, $scope);


        }
    ]);

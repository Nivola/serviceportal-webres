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
nivolaApp.controller('ListSgController',
    ["$scope", "$state", "$stateParams", "$filter", "$mdDialog", 'ReadthedocService',
        "entitiesRest", "controllerValidator", "notificationManager", 'loggers',
        'AuthenticationService', 'AuthLevel', '$translate',
        function ($scope, $state, $stateParams, $filter, $mdDialog, ReadthedocService, 
            entitiesRest, controllerValidator, notificationManager, loggers,
            AuthenticationService, AuthLevel, $translate) {
            "use strict";


            $scope.rtdsecuritygroup=ReadthedocService.getUrlFromPath('/securityGroup').docUrl;
            var logger = loggers.get("ListSgController");
            var SecurityGroup = entitiesRest.getEntity('SecurityGroup');
            var DeleteSG =  entitiesRest.getEntity('DeleteSG');
            var ReportcsvSG =  entitiesRest.getEntity('ReportcsvSG');
            

            $scope.groups = [];
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
                order: "groupName",
                limit: 10,
                page: 1
            };

            $scope.actions = {
                auth: {
                    new: $state.get("app.sg.new").requiredUC,
                    details: $state.get("app.sg.details").requiredUC,
                    change: $state.get("app.sg.change").requiredUC,
                    delete: $state.get("app.sg.new").requiredUC
                },

                refresh: getSecurityGroups,

                new: function () {
                    $state.go('app.sg.new');
                },

                details: function () {
                    if ($scope.selected.length !== 1) {
                        notificationManager.showErrorPopup($translate.instant('security_group.elenco.seleziona'));
                        return;
                    }

                    $state.go('app.sg.details', { idSecurityGroup: $scope.selected[0].groupId});
                },

                change: function () {
                    if ($scope.selected.length !== 1) {
                        notificationManager.showErrorPopup($translate.instant('security_group.elenco.seleziona'));
                        return;
                    }
                    $state.go('app.sg.change', { idSecurityGroup: $scope.selected[0].groupId});
                },

                // delete: function (event) {
                //     $state.go('app.formAssistenza', { object: "[" + $scope.accountName + "]" + " Richiesta di rimozione Security Group" });
                    
                // }
                delete: function (event) {
					var confirm = $mdDialog
						.confirm()
						.title($translate.instant('security_group.elimina.conferma') + " " + $scope.selected[0].groupName+ "?")
						.textContent($translate.instant('security_group.elimina.testo'))
						.targetEvent(event)
						.ok($translate.instant('si'))
						.cancel($translate.instant('no'))
					$mdDialog.show(confirm).then(function () {
                        //ha cliccato conferma della dialog
                        DeleteSG.delete({ nome: $scope.selected[0].groupName }, function (data) {
                            logger.info("SUCCESS", data);
                            var datiTesto = {
                                nome: $scope.selected[0].groupName
                            }
                            notificationManager.showSuccessPopup($translate.instant('security_group.elimina.success', datiTesto));
                            $mdDialog.hide();
                            // Reset lista
                            $scope.unselectAll();
                            $scope.resetFilter();
                            // Aggiorno lista istanze
                            getSecurityGroups();
                        }, function (onfail) {
                            logger.error("ERROR", onfail);
                            if (onfail.body && onfail.body.data) {
                                notificationManager.showErrorPopup($translate.instant('security_group.elimina.error') + ': ' + onfail.body.data.message);
                            } else if (onfail.data.messaggio){
                                notificationManager.showErrorPopup($translate.instant('security_group.elimina.error') + ': ', onfail.data.messaggio);
                            }else{
                                notificationManager.showErrorPopup($translate.instant('security_group.elimina.error'));
                            }
                          
                            
                        });
                    }, function () {
                        //ha cliccato annulla della dialog
                    });
                }, 
                

                
                downloadCSV:  function (event) {
                    setTimeout(() => {
                        if($scope.promise.$$state.status===0){
                            $rootScope.loadingElement = true;
                        }
                    }, 1000);
                    event.preventDefault();
                    
                    var queryString = {};
                   
                    $scope.promise = ReportcsvSG.get().$promise;
            
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

                if ($scope.filter.form.$dirty) {
                    $scope.filter.form.$setPristine();
                }
            };

            $scope.unselectAll = function () {
                $scope.selected = [];
            };

            function getSecurityGroups() {
                var queryString = {};
                if ($scope.accountUuid) {
                    queryString.accountUuid = $scope.accountUuid;
                }
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
                
                });
            };

            this.onInit = function () {
                var abilitazione = AuthenticationService.getUtente().abilitazioneSelezionata;
                logger.debug("Abilitazione corrente", abilitazione);

                // Recupero Uuid e Account Name dell'Account a cui l'agente appartiene
                // NOTE: filtro su accountUUID eseguito sul backend
                // $scope.accountUuid = abilitazione.accountUuid;
                $scope.accountName = abilitazione.accountName;

                // Recupera i Security Group
                getSecurityGroups();
            };

            this.onExit = function () { };

            controllerValidator.validate(this, $scope);


        }
    ]);

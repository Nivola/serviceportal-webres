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
angular.module('app').controller('ManageSgController', [
    '$scope', '$state', '$stateParams', '$rootScope',
     '$timeout','$location','$anchorScroll', '$http',
     'controllerValidator', 'notificationManager', '$mdEditDialog', 'ReadthedocService',
    'loggers', 'entitiesRest', 'AuthenticationService', '$translate',
    function (
        $scope, $state, $stateParams, $rootScope,
        $timeout,$location,$anchorScroll, $http, 
        controllerValidator, notificationManager, $mdEditDialog, ReadthedocService,
        loggers, entitiesRest, AuthenticationService, $translate) {


        $scope.rtdsecGroupManage=ReadthedocService.getUrlFromPath('/secGroup/manage').docUrl;
        var logger = loggers.get("ManageSgController");
        var SecurityGroup = entitiesRest.getEntity('SecurityGroup');
        var SecurityRule = entitiesRest.getEntity('SecurityRule');

        $scope.iconStyle = {
            "color": "#4285f4",
        }

        // Proprietà data-table
        $scope.options = {
            rowSelection: true,
            multiSelect: false,
            autoSelect: true,
            decapitate: true,
            largeEditDialog: false,
            dialogClickOutsideCallback:true,
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


        $scope.optionsRules = {
            types: [
                {
                    view: 'Ingress',
                    value: 'INGRESSO'
                },
                {
                    view: 'Egress',
                    value: 'USCITA'
                }
            ],
            domainTypes: ['CIDR', 'SG'],
           
        };

        function getSgDetails() {
            $scope.ingressRules = [];
            $scope.egressRules = [];
            $scope.groupNames =[];
            $scope.promise = SecurityGroup.get({ id: $stateParams.idSecurityGroup }).$promise;
          
            return $scope.promise.then(function (data) {
                logger.info('SUCCESS', data);
                $scope.groupName = data.groupName;

                data.ipPermissions.forEach(rule => {
                    var rules = [];

                    // mapping protocolo in base al file json
                    // var item = $scope.optionsRules.protocols.filter(function (el) {
                    //     return ( rule.fromPort==el.fromPort && rule.toPort==el.toPort);
                        
                    // })[0];

                    if(rule.fromPort == 80 && rule.toPort == 80 && rule.ipProtocol.toLowerCase()=="tcp"){
                        rule.ipProtocol = $scope.optionsRules.protocols.filter(p=>p.value===rule.ipProtocol.toLowerCase())[0].view;; 
                    }

                    if(rule.fromPort == 22 && rule.toPort == 22 && rule.ipProtocol.toLowerCase()=="tcp"){
                        rule.ipProtocol = $scope.optionsRules.protocols.filter(p=>p.value===rule.ipProtocol.toLowerCase())[0].view;; 
                    }

                   
                    // fine mapping 

                    if (rule.groups && rule.groups.length === 0) {
                        rule.securityGroup = "";
                        rule.groupId="";
                    }

                    if (rule.ipRanges && rule.ipRanges.length === 0) {
                        rule.cidr = "";
                    }

                    if (rule.groups && rule.groups.length > 0) {
                        rule.groups.forEach(group => {
                            var tmp = angular.copy(rule);
                            tmp.securityGroup = group.groupName;
                            tmp.groupId = group.groupId;
                            tmp.nvlUsername = group['nvl-userName']; 
                            rules.push(tmp);
                        });
                    }

                    if (rule.ipRanges && rule.ipRanges.length > 0) {
                        rule.ipRanges.forEach(ipRange => {

                            if (rules.length !== 0) {
                                rules.forEach(element => {
                                    var tmp = angular.copy(element);
                                    tmp.cidr = ipRange.cidrIp;
                                    tmp.descrizione = ipRange.description;
                                    rules.push(tmp);
                                });
                            } else {
                                var tmp = angular.copy(rule);
                                tmp.cidr = ipRange.cidrIp;
                                tmp.descrizione = ipRange.description;
                                rules.push(tmp);
                            }
                        });
                    }

                    if (rule.ipv6Ranges && rule.ipv6Ranges.length > 0) {
                        rule.ipv6Ranges.forEach(ipRange => {

                            if (rules.length !== 0) {
                                rules.forEach(element => {
                                    var tmp = angular.copy(element);
                                    tmp.cidrIpV6 = ipRange.CidrIpv6;
                                    tmp.descrizioneV6 = ipRange.description;
                                    rules.push(tmp);
                                });
                            } else {
                                var tmp = angular.copy(rule);
                                tmp.cidrIpV6 = ipRange.CidrIpv6;
                                tmp.descrizioneV6 = ipRange.description;
                                rules.push(tmp);
                            }
                        });
                    }


                    if (rule.prefixListIds && rule.prefixListIds.length > 0) {
                        rule.prefixListIds.forEach(prefixId => {

                            if (rules.length !== 0) {
                                rules.forEach(element => {
                                    var tmp = angular.copy(element);
                                    tmp.prefixListId = prefixId.prefixListId;
                                    tmp.descrizionePrefix = prefixId.description;
                                    rules.push(tmp);
                                });
                            } else {
                                var tmp = angular.copy(rule);
                                tmp.prefixListId = prefixId.prefixListId;
                                tmp.descrizionePrefix = prefixId.description;
                                rules.push(tmp);
                            }
                        });
                    }


                    if (rules.length === 0) {
                        rule['nvl-state'] = {
                            flag: rule['nvl-state'],
                            color: rule['nvl-state'] === "ACTIVE" ? "green" : "red",
                            icon: rule['nvl-state'] === "ACTIVE" ? "check_box" : "report"
                        };
                        rule.type = 'INGRESSO';
                        $scope.ingressRules.push(rule);
                    } else {
                        rules.forEach(element => {
                            element['nvl-state'] = {
                                flag: element['nvl-state'],
                                color: element['nvl-state'] === "ACTIVE" ? "green" : "red",
                                icon: element['nvl-state'] === "ACTIVE" ? "check_box" : "report"
                            };
                            element.type = 'INGRESSO';
                            $scope.ingressRules.push(element);
                        });
                    }
                });

                data.ipPermissionsEgress.forEach(rule => {
                    var rules = [];

                    // mapping protocolo in base al file json
                    var item = $scope.optionsRules.protocols.filter(function (el) {
                        return ( rule.fromPort==el.fromPort && rule.toPort==el.toPort);
                        
                    })[0];

                    if(item ){
                        rule.ipProtocol = item.view; 
                    }
                    // fine mapping 

                    if (rule.groups && rule.groups.length === 0) {
                        rule.securityGroup = "";
                        rule.groupId="";
                    }

                    if (rule.ipRanges && rule.ipRanges.length === 0) {
                        rule.cidr = "";
                    }

                    if (rule.groups && rule.groups.length > 0) {
                        rule.groups.forEach(group => {
                            var tmp = angular.copy(rule);
                            tmp.securityGroup = group.groupName;
                            tmp.groupId = group.groupId;
                            tmp.nvlUsername = group['nvl-userName']; 
                            rules.push(tmp);
                            console.log(JSON.stringify(group));
                            console.log(tmp);  
                        });
                    }

                    if (rule.ipRanges && rule.ipRanges.length > 0) {
                        rule.ipRanges.forEach(ipRange => {

                            if (rules.length !== 0) {
                                rules.forEach(element => {
                                    var tmp = angular.copy(element);
                                    tmp.cidr = ipRange.cidrIp;
                                    tmp.descrizione = ipRange.description;
                                    rules.push(tmp);
                                });
                            } else {
                                var tmp = angular.copy(rule);
                                tmp.cidr = ipRange.cidrIp;
                                tmp.descrizione = ipRange.description;
                                rules.push(tmp);
                            }
                        });
                    }

                    if (rule.ipv6Ranges && rule.ipv6Ranges.length > 0) {
                        rule.ipv6Ranges.forEach(ipRange => {

                            if (rules.length !== 0) {
                                rules.forEach(element => {
                                    var tmp = angular.copy(element);
                                    tmp.cidrIpV6 = ipRange.CidrIpv6;
                                    tmp.descrizioneV6 = ipRange.description;
                                    rules.push(tmp);
                                });
                            } else {
                                var tmp = angular.copy(rule);
                                tmp.cidrIpV6 = ipRange.CidrIpv6;
                                tmp.descrizioneV6 = ipRange.description;
                                rules.push(tmp);
                            }
                        });
                    }

                    if (rule.prefixListIds && rule.prefixListIds.length > 0) {
                        rule.prefixListIds.forEach(prefixId => {

                            if (rules.length !== 0) {
                                rules.forEach(element => {
                                    var tmp = angular.copy(element);
                                    tmp.prefixListId = prefixId.prefixListId;
                                    tmp.descrizionePrefix = prefixId.description;
                                    rules.push(tmp);
                                });
                            } else {
                                var tmp = angular.copy(rule);
                                tmp.prefixListId = prefixId.prefixListId;
                                tmp.descrizionePrefix = prefixId.description;
                                rules.push(tmp);
                            }
                        });
                    }
                    if (rules.length === 0) {
                        rule['nvl-state'] = {
                            flag: rule['nvl-state'],
                            color: rule['nvl-state'] === "ACTIVE" ? "green" : "red",
                            icon: rule['nvl-state'] === "ACTIVE" ? "check_box" : "report"
                        };
                        rule.type = 'USCITA';
                        $scope.egressRules.push(rule);
                    } else {
                        rules.forEach(element => {
                            element['nvl-state'] = {
                                flag: element['nvl-state'],
                                color: element['nvl-state'] === "ACTIVE" ? "green" : "red",
                                icon: element['nvl-state'] === "ACTIVE" ? "check_box" : "report"
                            };
                            element.type = 'USCITA';
                            $scope.egressRules.push(element);
                        });
                    }
                });

            }, function (onfail) {
                logger.error('ERROR', onfail);
                if (onfail.body && onfail.body.data && onfail.body.data.message) {
                    notificationManager.showErrorPopup($translate.instant('error.loading_security_group_info') + ': ' + onfail.body.data.message);
                } else if (onfail.data.messaggio) {
                    notificationManager.showErrorPopup($translate.instant('error.loading_security_group_info'), onfail.data.messaggio);
                } else {
                    notificationManager.showErrorPopup($translate.instant('error.loading_security_group_info'));
                }

            });
        };

        this.onInit = function () {
            $http.get("angular/entities/networking/sg/servizi_protocolli_sg_rules.json").success(function(data) {
                $scope.optionsRules.protocols = data;
            });

            $scope.readOnly = $state.is('app.sg.details');
            $scope.accountName = AuthenticationService.getUtente().abilitazioneSelezionata.accountName;

            getSgDetails();

            logger.debug("Ingress: ", $scope.ingressRules);
            logger.debug("Egress: ", $scope.egressRules);

            if (!$scope.readOnly) {
                //popola lista nomi security groups
                getSecurityGroupsNames();

                $scope.newRule = {
                    type: null,
                    domainType: null,
                    domain: null,
                    protocol: null,
                    fromPort: null,
                    toPort: null,
                    reserved: true,
                    description: null
                };

               
            

                $scope.onProtocoleChange = function(){
                    $scope.isPorteditable = true; 
                    $scope.newRule.fromPort = null;
                    $scope.newRule.toPort = null;
                    var selectedProtocol = $scope.optionsRules.protocols.filter(function (el) {
                        return $scope.newRule.protocol==el.value;
                        
                    })[0];

                    $scope.isPorteditable = selectedProtocol.isPorteditable; 
                    $scope.newRule.fromPort = selectedProtocol.fromPort;
                    $scope.newRule.toPort = selectedProtocol.toPort;

                    // tutti i protocolli tranne quello UDP hanno valore tcp quando inviato al BE

                    //$scope.newRule.protocol != "udp" ? $scope.newRule.protocol = "tcp" : null ; 
                    
                }; 

                $scope.editDescription = function (event, rule) {
                    // if auto selection is enabled you will want to stop the event
                    // from propagating and selecting the row
                    event.stopPropagation();
                    var editDialog = {
                        // messages: {
                        //   test: 'I don\'t like tests!'
                        // },
                        modelValue: rule.descrizione,
                        placeholder: 'Aggiungi una descrizione',
                        save: function (input) {
                            rule.descrizione = input.$modelValue;
                        },
                        validators: {
                            'md-maxlength': 30,
                            'id':"descGroup",
                             required:''
                        },
                        clickOutsideToClose: true,
                        clickOutsideCallback: function () {
                            var descGInput = angular.element('#descGroup');
                            rule.descrizione = descGInput.val() ;
                          },
                        targetEvent: event
                    };

                    var promise;

                    if ($scope.options.largeEditDialog) {
                        promise = $mdEditDialog.large(editDialog);
                    } else {
                        promise = $mdEditDialog.small(editDialog);
                    }

                    promise.then(function (ctrl) {
                        logger.debug("Aggiungi descrizione", ctrl);
                        // var input = ctrl.getInput();

                        // input.$viewChangeListeners.push(function () {
                        //     input.$setValidity('test', input.$modelValue !== 'test');
                        // });
                    });
                };

                $scope.actions = {
                    addRule: function (event,ruleForm) {
                        $scope.btnDisabled=true; 
                        logger.debug("addRule", "");

                        if ($scope.newRule.type === null ||
                            $scope.newRule.domainType === null ||
                            $scope.newRule.domain === null ||
                            $scope.newRule.protocol === null ||
                            $scope.newRule.fromPort === null ||
                            $scope.newRule.toPort === null ||
                            $scope.newRule.reserved === null 
                           // ||$scope.newRule.descrizione === null
                           ) {
                            notificationManager.showErrorPopup('Regola non valida: tutti i campi devono essere valorizzati!');
                            return;
                        }
                        if($scope.newRule.fromPort==='*' || $scope.newRule.toPort==='*'){
                            if(($scope.newRule.fromPort==='*' && $scope.newRule.toPort!=='*')
                            ||($scope.newRule.toPort==='*' && $scope.newRule.fromPort!=='*') ){
                             notificationManager.showErrorPopup('Range di porte non valido');
                             return;
                         }}else{
                            if (parseInt($scope.newRule.fromPort) > parseInt($scope.newRule.toPort)) {
                                notificationManager.showErrorPopup('Range di porte non valido!');
                                return;
                            }
                        }

                       
                        var jsonRule = {
                            gruppoAppartenenza: $stateParams.idSecurityGroup,
                            daPorta: $scope.newRule.fromPort==='*'? '-1':$scope.newRule.fromPort,
                            aPorta: $scope.newRule.toPort==='*'? '-1':$scope.newRule.toPort,
                            //protocollo: $scope.newRule.protocol,
                            protocollo:  $scope.newRule.protocol !== "udp" ?  "tcp" : "udp", 
                            cidrIp: $scope.newRule.domainType === "CIDR" ? $scope.newRule.domain : "",
                            descrizione: null , // $scope.newRule.descrizione,
                            cidrIpV6: "",
                            descrizioneV6: "",
                            prefixListId: "",
                            descrizionePrefix: "",
                            gruppoDestinazione: $scope.newRule.domainType === "SG" ? $scope.newRule.domain : "",
                            tipoRegola: $scope.newRule.type
                        };

                        $rootScope.loadingElement =  true ; 
                        SecurityRule.save(jsonRule, function (data) {
                            logger.info('SUCCESS', data);
                            notificationManager.showSuccessPopup($translate.instant('security_group.regole.crea.success'));

                            $scope.newRule = {
                                type: null,
                                domainType: null,
                                domain: null,
                                protocol: null,
                                fromPort: null,
                                toPort: null,
                                descrizione:null,
                                reserved: true
                            };
                            event.preventDefault();
                            ruleForm.$setPristine(true);
                            ruleForm.$setUntouched(true);
    
                            $timeout( function(){
                                $scope.btnDisabled=false; 
                                getSgDetails();
                                //dopo salvataggio scrollo verso la lista aggiornata 
                                if(jsonRule.tipoRegola =='USCITA'){
                                    $location.hash('regoleUscita');
                                    $anchorScroll('regoleUscita');
                                }else{
    
                                    $location.hash('regoleIngresso');
                                    $anchorScroll('regoleIngresso');
                                }
                                getSecurityGroupsNames();
                              
                            }, 2500 );
                            $scope.status.pending = true;
                        }, function (onfail) {
                            logger.error('ERROR', onfail);
                            if (onfail.data && onfail.data.message) {
                                notificationManager.showErrorPopup($translate.instant('security_group.regole.crea.error') + ': ' + onfail.data.message);
                            } else if (onfail.data.messaggio) {
                                notificationManager.showErrorPopup($translate.instant('security_group.regole.crea.error'), onfail.data.messaggio);
                            } else {
                                notificationManager.showErrorPopup($translate.instant('security_group.regole.crea.error'));
                            }

                        }).$promise.finally(function () {
                            $scope.status.pending = false;
                            $rootScope.loadingElement =  false ; 
                        });


                    },

                    removeRule: function (rule) {
                        $scope.DeleteSecGroupBTNDisabled= true; 
                    	console.log('REGOLA:');
                    	console.log(rule);
                        var protocol = rule.ipProtocol; 
                        if(rule.ipProtocol== "HTTP" || rule.ipProtocol== "SSH") {
                            protocol = "tcp"; 
                        }
                        jsonRule = {
                            gruppoAppartenenza: $stateParams.idSecurityGroup,
                            daPorta: rule.fromPort,
                            aPorta: rule.toPort,
                            protocollo: protocol, //rule.ipProtocol,
                            cidrIp: rule.cidr,
                            descrizione: rule.descrizione,
                            cidrIpV6: rule.cidrIpV6,
                            descrizioneV6: rule.descrizioneV6,
                            prefixListId: rule.prefixListId,
                            descrizionePrefix: rule.descrizionePrefix,
                            gruppoDestinazione: rule.groups[0] ? rule.groups[0].groupId : "",
                            tipoRegola: rule.type
                        };
                        $scope.status.pending = true;
                        
                        SecurityRule.update(jsonRule, function (data) {
                            notificationManager.showSuccessPopup($translate.instant('security_group.regole.elimina.success'));
                        $timeout( function(){
                            $scope.DeleteSecGroupBTNDisabled= false; 
                                getSgDetails();
                            }, 2500 );

                        }, function (onfail) {
                            $scope.DeleteSecGroupBTNDisabled= false; 
                            if (onfail.data.messaggio) {
                                notificationManager.showErrorPopup($translate.instant('security_group.regole.elimina.error'), onfail.data.messaggio);
                            } else {
                                notificationManager.showErrorPopup($translate.instant('security_group.regole.elimina.error'));
                            }
                        }).$promise.finally(function () {
                            $scope.status.pending = false;
                        });

                    },
                    refresh: function () {
                        getSgDetails();
                        getSecurityGroupsNames();
                    }
                };
            }
        };
        $scope.checkFromPort = function (){
            if($scope.newRule && $scope.newRule.fromPort && $scope.newRule.fromPort==='*'){
                $scope.newRule.toPort = "*";
            }
        }
        $scope.checkToPort = function (){
            if($scope.newRule && $scope.newRule.toPort && $scope.newRule.toPort==='*'){
                $scope.newRule.fromPort="*";
            }
        }
        $scope.codificaReserved = function(reservedB){
            return reservedB ? $translate.instant('si') : $translate.instant('no')
        };
        this.onExit = function () {
        };


        function getSecurityGroupsNames() {
            var queryString = {};
            if ($scope.accountUuid) {
                queryString.accountUuid = $scope.accountUuid;
            }
            queryString.usaTuttiAccount = true;
            return SecurityGroup.query(queryString).$promise.then(function (data) {
                //console.log("EK", data); 
                data.forEach(sg => {
                    // aggiungo elenco group che non e' il corrente 

                        //metto in testa i groupi di questo utente 
                        if($scope.accountName === sg.nvlSgOwnerAlias){
                            $scope.groupNames.unshift({
                                id: sg.groupId ,
                                description: sg.groupDescription,
                                name: sg.groupName,
                                account: sg.nvlSgOwnerAlias
                                
                            });
                        }else{
                            $scope.groupNames.push({
                                id: sg.groupId ,
                                description: sg.groupDescription,
                                name: sg.groupName,
                                account: sg.nvlSgOwnerAlias
                                
                            });
                        }
                });
                if(angular.equals([], $scope.groupNames)){
                    //error 
                    //list SG VUOTA  
                    
                }
 
            }, function (onfail) {
                logger.error("ERROR", onfail);
                if (onfail.body) {
                    if (onfail.body && onfail.body.data && onfail.body.data.message) {
                        notificationManager.showErrorPopup($translate.instant('error.loading_security_group') + ': ' + onfail.body.data.message);
                    } else {
                        notificationManager.showErrorPopup($translate.instant('error.loading_security_group'));
                    }
                } else {
                    notificationManager.showErrorPopup($translate.instant('error.loading_security_group'));
                }
            });
        };
        controllerValidator.validate(this, $scope);
    }]);

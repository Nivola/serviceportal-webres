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
nivolaApp.controller('ListRichiesteController',
    ["$scope", "$state", "$stateParams", "$filter", "$mdDialog","$rootScope",
        "entitiesRest", "controllerValidator", "notificationManager", 'loggers',
        'AuthenticationService', 'AuthLevel', '$translate', 'ReadthedocService',
        function ($scope, $state, $stateParams, $filter, $mdDialog, $rootScope,
            entitiesRest, controllerValidator, notificationManager, loggers,
            AuthenticationService, AuthLevel, $translate, ReadthedocService) {
            "use strict";

            var logger = loggers.get("ListRichiesteController");
           // var Messaggi = entitiesRest.getEntity('Messaggi');
            var Remedy = entitiesRest.getEntity('Remedy');

            $scope.rtdListTickets=ReadthedocService.getUrlFromPath('/remedy/user/tickets/elenco').docUrl;
            $scope.usaRemedy= AuthenticationService.getUtente().usaRemedy; 

            $scope.richieste = [];
            $scope.selected = [];

            $scope.options = {
				rowSelection: true,
				multiSelect: false,
				autoSelect: false,
				decapitate: false,
				largeEditDialog: false,
				boundaryLinks: false,
				limitSelect: true,
				pageSelect: true,
                elencoVuoto : false
			};

            $scope.limitOptions = [ 10, 20, 30];

            $scope.filter = {
                options: {
                    debounce: 500
                }
            };

            $scope.query = {
                order: "-dataInvio",  //by more recent date 
                order_bozze: "-dataInserimento",
                limit: 10,
                page: 1
            };



            $scope.actions = {
				auth: {
					

					delete: [
						AuthLevel.SUPERADMIN,
						AuthLevel.BOADMIN,
						/*AuthLevel.BOMONITORING,*/
						AuthLevel.OrgAdminRole,
						AuthLevel.DivAdminRole,
						AuthLevel.AccountAdminRole
					].join(",")
				},

			
			
				view: function () {
                    var item = $scope.selected[0]; 

                    if(item.tipoSegnalazione=="AnomaliaServiziCloud"){
                        $state.go('app.formAssistenza.viewServiziCloud',{
                            richiesta: $scope.selected[0],
                        });
                    }

                    // if(item.tipoSegnalazione=="AnomaliaConnessioneDiRete"){
                    //     $state.go('app.formAssistenza.viewConnDiRete',{
                    //         richiesta: $scope.selected[0],
                    //     });
                    // }
                    
                    if(item.tipoSegnalazione!="AnomaliaServiziCloud" /* && item.tipoSegnalazione!="AnomaliaConnessioneDiRete" */)
                    {
                        notificationManager.showErrorPopup("use case  "+ item.tipoSegnalazione+ " ToDo(Da implementare)");
                    }
					
				},


                refresh : function () {
                    getRemedy($stateParams.areRequestSent);
                },

                loadInviati : function(){
                    $state.go('app.listRichieste'); 
                },

                loadBozze : function(){
                    $state.go('app.listBozze'); 
                }
				
				

				
			}

            


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

            function getRemedy(filter) {
                $rootScope.loadingElement =  true ; 
                $scope.promise = Remedy.query().$promise;

                return $scope.promise.then(function (data) {
                    logger.info("SUCCESS", data);
                    

                    var filtered= data.filter(function(item){
                        return item.inviato == filter;         
                    })

                    filtered.forEach(function (value) {
                        if(!value.ticketId){value.ticketId="N-D"}
                        if(!value.assegnatario){value.assegnatario="N-D"}
                        value.badge=  value.inviato == true ? "badge badge-success" : "badge badge-warning";
						value.inviato = value.inviato == true ? $translate.instant('YES') : $translate.instant('NO');
                        
					});

                    

                    $scope.richieste = filtered;
                    if($scope.richieste.length==0){
                        $scope.options.elencoVuoto = true 
                    }

                       
                }, function (onfail) {
                    if (onfail.data) {
						notificationManager.showErrorPopup($translate.instant('error.loading_remedy') + ': ' + onfail.data.message);
				    } else {
					    notificationManager.showErrorPopup($translate.instant('error.loading_remedy'));
				    }
                }).finally(function() {
                    $rootScope.loadingElement = false;
                });
            };


                
            this.onInit = function () {
                // Recupera i richieste
                //console.log("EK", $stateParams.areRequestSent);
                $scope.areRequestSent = $stateParams.areRequestSent; 
                getRemedy($stateParams.areRequestSent);
              
            };

            this.onExit = function () { };

            controllerValidator.validate(this, $scope);
        }
    ]); 
   

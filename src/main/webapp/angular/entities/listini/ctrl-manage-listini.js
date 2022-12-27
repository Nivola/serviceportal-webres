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




angular.module('app').controller('VisualizzaListinoController', [
    '$scope', '$state', '$stateParams', 'controllerValidator', 'notificationManager',
    'loggers', 'entitiesRest', 'AuthenticationService', 'ReadthedocService', "$rootScope",
    function (
        $scope, $state, $stateParams, controllerValidator, notificationManager,
        loggers, entitiesRest, AuthenticationService, ReadthedocService, $rootScope) {

        var logger = loggers.get("VisualizzaListinoController");

        var dettaglioListino = entitiesRest.getEntity('dettaglioListino');
		
        //var Staas = entitiesRest.getEntity('Staas');
        //$scope.rtdStaasManage=ReadthedocService.getUrlFromPath('/staas/manage').docUrl;

        $scope.volume={};
        $scope.iconStyle = {
            "color": "#4285f4",
        }
        $scope.resize= false; 


        $scope.options = {
            rowSelection: false,
            multiSelect: false,
            autoSelect: false,
            decapitate: false,
            largeEditDialog: false,
            boundaryLinks: false,
            limitSelect: true,
            pageSelect: true
        };

        $scope.limitOptions = [10, 20, 30];

        $scope.filter = {
            options: {
                debounce: 500
            }
        };

        $scope.query = {
            order:[ "servizio", "voce",] ,
            limit: 10,
			page: 1
        };

        $scope.status = {
            pending: false,

            tabIndex: 0
        };


        $scope.actions = {
            refresh : function(){
                getListino() ;
            }
        }
      
        
			function getListino() {
				//on()
                //blocca lo schermo dopo 1 secondo di attesa risposta chiamata al servizio 
				setTimeout(() => {
					if($scope.promise.$$state.status===0){
						$rootScope.loadingElement = true;
					}
				}, 1000);

              
                $scope.promise = dettaglioListino.get({idListino: $scope.item.id}).$promise;

                return $scope.promise.then(function (data) {
                    logger.info("SUCCESS", data);

                    console.log(JSON.stringify(data)); 
                    $scope.title = data.descrizione ;

					data.elencoDettagli.forEach(function (value) {
						value.elencoPrezzo.forEach(function(item){
                            switch(item.codice){
                                case "ESE":
                                    value.ese={importoAnnuo:  item.importoAnnuo};
                                    break;
                                    case "ORD":
                                    value.ord={importoAnnuo:  item.importoAnnuo};
                                    break;
                                    case "NC":
                                    value.nc={importoAnnuo:  item.importoAnnuo};
                                    break;
                                    case "PROD":
                                    value.prod={importoAnnuo:  item.importoAnnuo};
                                    break;
                                    
                            }
                        })
					});

					$scope.dettagliListino = data.elencoDettagli;
                    console.log(data.elencoDettagli); 
                       
                }, function (onfail) {
                    if (onfail.data) {
						notificationManager.showErrorPopup( "errore get listino" + ': ' + onfail.data.message);
				    } else {
					    notificationManager.showErrorPopup("errore get listino");
				    }
                }).finally(function() {
                    $rootScope.loadingElement = false;
					//off()
                });
            };

     
		
      

        this.onInit = function () {
            $scope.item = $stateParams.listino;
            // console.log("listino",  $scope.item);
            var isNotFromRefresh= !!$stateParams.listino&&Object.keys($stateParams.listino).length>0; 
            if(isNotFromRefresh){
                getListino();
               
            }else{
                $state.go('app.elencoListini'); 
            }
            
         
        };

        this.onExit = function () {

        };

        controllerValidator.validate(this, $scope);
    }]);

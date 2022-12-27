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
"use strict";

angular.module('app').controller('FormAssistenzaController', [
	'$rootScope', '$scope', '$state', '$stateParams','$http', 'ReadthedocService',
	'controllerValidator', 'loggers', 'notificationManager', 'entitiesRest', 'AuthLevel', '$translate', '$mdDialog',
	function (
		$rootScope, $scope, $state, $stateParams, $http, ReadthedocService,
		controllerValidator, loggers, notificationManager, entitiesRest, AuthLevel, $translate, $mdDialog
	) {
		'use strict';
		var ctrl = this;

		var logger = loggers.get("FormAssistenzaController");
		var Assistenza = entitiesRest.getEntity('Assistenza');
		var Requisiti = entitiesRest.getEntity('Requisiti');
		var Configura = entitiesRest.getEntity('Configura');

		$scope.rtdNuovoTickets=ReadthedocService.getUrlFromPath('/remedy/user/tickets/nuovo').docUrl;

		var objToBeSend = null;
		
		$scope.assistenza = {
			
			oggetto: null,
			
			q_tipo : null,
			q_category  : null ,
			q_scope  : null,
			q_sev   : null, 
			q_serv   : null,
			qTecnologia   : null 
		};
	   $scope.queue = [];

		const findObj = (arr, idToFind) => {
			for (const item of arr) {
			  if (item.id === idToFind) return item;
			  if (item.children) {
				const recursiveResult = findObj(item.children, idToFind);
				if (recursiveResult) return recursiveResult;
			  }
			}
		};



		$scope.riepilogoScelte = null;
		// $scope.sceltaTwoStepOneDone = null;
		// $scope.isGoTolastStep = false; 
		// $scope.techDB=false;


		$scope.status = {
			
			tagsReadOnly: false,
			tagsRemovable: true,
			tabIndex: 0
		}; 



	






		
	
		

		$scope.actions = {
			jumpToStep : function(step, item){
				if(step=="FORM"){

					$scope.queue.push(step);
					impostaRiepilogo(item.riep, item.parametri); 

				}else{
					var temp = findObj($scope.templates.items, step)
					// if step found 
					if(temp){
						$scope.queue.push(step);
						$scope.cards= temp.cards; 
						$scope.titolo= temp.title.toUpperCase();
					};
				}
				

			},

			stepPreccedente : function (){
				var i = $scope.queue.pop(); // step attuale
				var i = $scope.queue.pop(); // step precedente
				if(i){
					$scope.actions.jumpToStep(i);
				}
				

			},
		
			
				 


		};

		$scope.actions.gotoTab = function (index) {
			$scope.status.tabIndex = index;
		};

		function clearField() {
			var utente = $rootScope.utente;
			console.log("utente", utente);

			$scope.isLogged = utente.abilitazioneSelezionata.userRole !== AuthLevel.OSPITE;

			$scope.accountId = utente.abilitazioneSelezionata.accountUuid ;

			$scope.assistenza.oggetto = null;
			
		
			objToBeSend = angular.copy($scope.assistenza);
		}

		

		

		function impostaRiepilogo(riep, parametri){
			$scope.riepilogoScelte ="<strong><u>"+$translate.instant('assistenza.forms.output.riepilogo')+"["+ riep[0].part0 +"]"  +"</u></strong><br/>"; 


			var partOne = riep[0].part1; 
			var partTwo =  riep[0].part2; 
			var partTree=  riep[0].part3 ; 
			var partFour = riep[0].part4; 


			$scope.riepilogoScelte += partOne ? "-"+partOne : "";
			$scope.riepilogoScelte += partTwo? "<br/>-"+ partTwo : "";
			$scope.riepilogoScelte += partTree? "<br/>-"+ partTree : "";
			$scope.riepilogoScelte += partFour? "<br/>-"+ partFour : "";

	


			if($scope.servizioScelto=='DBAAS' && $scope.tipoDBScelto!=null){
				
				$scope.riepilogoScelte +="("+$scope.tipoDBScelto+")"; 

			}

			

			$state.go("app.formAssistenza.outputForm", {
				 riepilogoScelte:$scope.riepilogoScelte,
			

				qtec : parametri.qtec,
				qserv : parametri.qserv,
				qtipo : parametri.qtipo,
				qimpatto : parametri.qimpatto,
				qsev : parametri.qsev,


			});

		}

		  

		function showUrgentAlert(ev) {
			$mdDialog.show({
				controller: ()=>this,
			  templateUrl: 'angular/entities/assistenza/assistenza-urgente-popup.html',
			  parent: angular.element(document.body),
			  targetEvent: ev,
			  clickOutsideToClose:false,
			  fullscreen: false
			})
		  };

		  function checkAccountConfigurations(){
			var validAccount=false;
			setTimeout(() => {
				if($scope.promise.$$state.status===0){
					$rootScope.loadingElement = true;
				}
			}, 1000);
			$scope.promise = Requisiti.get().$promise;

			$scope.promise.then(function (data) {
				// data object
				// { "idTenant": null, "descrizioneTenant": null, "accountConfiguratoRemedy": true }
				validAccount=data.accountConfiguratoRemedy;

			}, function (onfail) {
				if (onfail.data) {
						notificationManager.showErrorPopup($translate.instant('error') + ': ' + onfail.data.message);
				} else {
					notificationManager.showErrorPopup($translate.instant('error'));
				}
				return;
			}).finally(function() {
				$rootScope.loadingElement = false;
				return validAccount;
			});
		  }

		  function showConfigurationAlert(ev) {
			$mdDialog.show({
				controller: ()=>this,
			  templateUrl: 'angular/entities/assistenza/account-configuration-required-popup.html',
			  parent: angular.element(document.body),
			  scope:$scope,
			  preserveScope:true,
			  targetEvent: ev,
			  clickOutsideToClose:false,
			  fullscreen: false
			})
		  };

		  $scope.hide=function(){$mdDialog.hide()}
		  
		this.onInit = function () {
			$scope.sended=false;
			if(checkAccountConfigurations()){
				showUrgentAlert();
			}else{
				showConfigurationAlert();
			}
			clearField();

			$http.get("angular/entities/assistenza/forms-templates.json").success(function(data) {
                $scope.templates = data;
				console.log(findObj($scope.templates.items, '1'));
            });
			

			// Recupera eventuale oggetto
			if ($stateParams.object) {
				$scope.assistenza.oggetto = $stateParams.object;
				objToBeSend.oggetto = $stateParams.object;
				$scope.isObjectFixed = true;
			}

			// Recupera eventuale messaggio
			if ($stateParams.body) {
				
				$scope.isBodyFixed = true;
			}
		};

		this.onExit = function () { };

		controllerValidator.validate(this, $scope);

		$scope.test=function(){
			console.log('test');
		}
			$scope.cancel = function () {
			  $mdDialog.cancel();
			};
		
			$scope.answer = function (answer) {
			  $mdDialog.hide(answer);
			};

			$scope.endRequestAccConfig=function(){
				$rootScope.historyBack()
			}

			$scope.reqConfigAcc = function () {
				setTimeout(() => {
					if($scope.promise.$$state.status===0){
						$rootScope.loadingElement = true;
					}
				}, 500);
				$scope.promise = Configura.get().$promise;
	
				$scope.promise.then(function (data) {
					$scope.sended=true;
				}, function (onfail) {
					if (onfail.data) {
							notificationManager.showErrorPopup($translate.instant('error') + ': ' + onfail.data.message);
					} else {
						notificationManager.showErrorPopup($translate.instant('error'));
					}
					return;
				}).finally(function() {
					$rootScope.loadingElement = false;
				});
			  };
	}])
	.config(function($mdThemingProvider) {
		$mdThemingProvider.theme('dark-brown').backgroundPalette('brown');
		$mdThemingProvider.theme('dark-grey').backgroundPalette('grey').dark();
		$mdThemingProvider.theme('dark-orange').backgroundPalette('orange').dark();
		$mdThemingProvider.theme('dark-purple').backgroundPalette('deep-purple').dark();
		$mdThemingProvider.theme('dark-blue').backgroundPalette('blue').dark();
		$mdThemingProvider.theme('blue').backgroundPalette('blue');
		$mdThemingProvider.theme('dark-red').backgroundPalette('red').dark();
		$mdThemingProvider.theme('dark-green').backgroundPalette('green').dark();
		
	  });

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

angular.module('app').controller('ctrOuputForm', [
	'$rootScope', '$scope', '$state', '$stateParams', 'FileUploader', '$http', 'AuthenticationService',
	'controllerValidator', 'loggers', 'notificationManager', 'entitiesRest', 'AuthLevel', '$translate', 
	function (
		$rootScope, $scope, $state, $stateParams, FileUploader, $http, AuthenticationService,
		controllerValidator, loggers, notificationManager, entitiesRest, AuthLevel, $translate
	) {
		'use strict';

		var logger = loggers.get("AnomaliaServiziCoudController");
		var Assistenza = entitiesRest.getEntity('Assistenza');
		var GetRemedy = entitiesRest.getEntity('GetRemedy');
		
		
		var objToBeSend = null;
		$scope.assistenza = {
			//nome: null,
			//email: null,
			oggetto: null,
			descrizione: null,
			q_tipo : null,
			q_category  : null ,
			q_scope  : null,
			q_sev   : null, 
			q_serv   : null,
			qTecnologia   : null 
		};
		$scope.isLogged = false;
		$scope.isObjectFixed = false;
		$scope.isBodyFixed = false;
		$scope.newFormReadyToSend = true; 
		var q_tipo = null;
		var q_impatto = null ; 
		var q_sev = null;
		var scopeAggiornamentoScelto = null; 
		var q_serv = null; 
		var q_tec = null;
		var descrizioneTipoAdeguamentoScelto = null;
		var impattoAdeguamentoScelto = null ;
		var tipoOtherSelto = null;

		$scope.riepilogoScelte = null;


		$scope.status = {
			
			tagsReadOnly: false,
			tagsRemovable: true,
			tabIndex: 0
		}; 

		
		
	
		

	

	

		$scope.actions = {
			navigateToServiziCloud: function(){
				$state.go("app.formAssistenza.serviziCloud", {
					//idOrganizzazione:$scope.account.organizzazione.uuid
				});
			},
		

			rimuovi: function (){
				$scope.uploadme = null
			},
			invia : function( flagInvia){
		
				var formData = new FormData();

				objToBeSend.oggetto = $scope.assistenza.oggetto;
				objToBeSend.descrizione = $scope.assistenza.descrizione;
				objToBeSend.accountId =   AuthenticationService.getUtente().abilitazioneSelezionata.accountUuid; 

				objToBeSend.invia = flagInvia == 'false'? false : true;
				objToBeSend.formId = null;
				

				
				objToBeSend.ambitoCloud = "NONE";


				objToBeSend.q_tipo = q_tipo;
				var cat = null
				if(q_tipo=='INCIDENT'){
					cat= 'RIPRISTINO_DI_SERVIZIO_UTENTE'
				}else{ // OTHER , CHANGE
					cat= 'RICHIESTA_UTENTE'
				}
				objToBeSend.q_category = cat;
				objToBeSend.impatto = q_impatto;
				objToBeSend.q_sev = q_sev ;
				objToBeSend.riepilogoScelte = $scope.riepilogoScelte
				

				
				objToBeSend.q_serv = q_serv;
				objToBeSend.qTecnologia = q_tec;

				

				if(q_serv=='CPAAS-MS'){
					objToBeSend.q_category ='RIPRISTINO_DI_SERVIZIO_INFRASTRUTTURALE'; 
					objToBeSend.qTecnologia = q_serv; 
				}

	
				var oggetto = objToBeSend.oggetto;
	
				if (!oggetto || typeof oggetto !== 'string' || (oggetto.trim && oggetto.trim() === '')) {
					notificationManager.showErrorPopup($translate.instant('assistenza.oggetto_required'));
					return;
				}
	
	
		
	
			
			formData.append('form', JSON.stringify(objToBeSend));
			formData.append('file', $scope.uploadme); 
			console.log($scope.uploadme);

			$rootScope.loadingElement =  true ; 
			return $http({
				url:  entitiesRest.getBaseUrl + '/api/richiesta/AnomaliaServiziCloud/form' ,
				headers: {"Content-Type": undefined },
				data: formData,
				method: "POST"
			}).then(function(response) {
				
				if(flagInvia=='true'){
					notificationManager.showSuccessPopup($translate.instant('assistenza.success'));
					$state.go('app.listRichieste'); 
				}else{
					notificationManager.showSuccessPopup($translate.instant('assistenza.success_bozza'));
					$state.go('app.listBozze'); 
				}
			
			  }, function (error) {
				notificationManager.showErrorPopup($translate.instant('assistenza.error') + ': ' + error.data.message);
				return;
			  }).finally(function() {
				$rootScope.loadingElement = false;
			});
		}
		
		};


		$scope.actions.gotoTab = function (index) {
			$scope.status.tabIndex = index;
		};

		function clearField() {
			var utente = $rootScope.utente;
			console.log("utente", utente);

			$scope.isLogged = utente.abilitazioneSelezionata.userRole !== AuthLevel.OSPITE;

			
			
			$scope.assistenza.oggetto = null;
			

			// Evito di modificare le proprietà read-only
			objToBeSend = angular.copy($scope.assistenza);
		}

		this.onInit = function () {
			clearField();


			if ($stateParams.riepilogoScelte!=null) {

				console.log(JSON.stringify($stateParams))
				$scope.riepilogoScelte = $stateParams.riepilogoScelte;

				q_tipo =  $stateParams.qtipo;
				 q_impatto =  $stateParams.qimpatto; ; 
				 q_sev =  $stateParams.qsev;
				 q_serv =  $stateParams.qserv;
				 q_tec =  $stateParams.qtec;
				



				
			}else{
				$state.go('app.formAssistenza'); 
				
			}

			
		};

		this.onExit = function () { };

		controllerValidator.validate(this, $scope);
	}]);

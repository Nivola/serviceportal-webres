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

angular.module('app').controller('AnomaliaServiziCoudController', [
	'$rootScope', '$scope', '$state', '$stateParams', 'FileUploader', '$http', 'AuthenticationService', 'ReadthedocService',
	'controllerValidator', 'loggers', 'notificationManager', 'entitiesRest', 'AuthLevel', '$translate', 
	function (
		$rootScope, $scope, $state, $stateParams, FileUploader, $http, AuthenticationService, ReadthedocService,
		controllerValidator, loggers, notificationManager, entitiesRest, AuthLevel, $translate
	) {
		'use strict';

		var logger = loggers.get("AnomaliaServiziCoudController");
		var Assistenza = entitiesRest.getEntity('Assistenza');
		var GetRemedy = entitiesRest.getEntity('GetRemedy');
		var AllegatiRemedy = entitiesRest.getEntity('AllegatiRemedy');
		
		$scope.rtddettaglioTickets=ReadthedocService.getUrlFromPath('/remedy/user/tickets/dettaglio').docUrl;
		$scope.rtddettaglioTicketsBOAdmin=ReadthedocService.getUrlFromPath('/remedy/backooffice/tickets/dettaglio').docUrl;
		

		var objToBeSend = {
			accountId : null,
			oggetto :null,
			impatto :null,
			urgenza :null,
			descrizione :null,
			invia :null,
			formId :null,
			ambitoCloud :null
		}; 
		$scope.assistenza = {
			//nome: null,
			//email: null,
			oggetto: null,
			descrizione: null,
			impatto : null,
			urgenza : null ,
			ambitoCloud : null
		};

		$scope.workinfo = {
			ticketId: null,
			riepilogo: null,
			tipologia : null,
			note : null 
		};

		$scope.isLogged = false;
		$scope.isObjectFixed = false;
		$scope.isBodyFixed = false;
		$scope.allegatoWI = null

		$scope.status = {
			
			tagsReadOnly: false,
			tagsRemovable: true,
			tabIndex: 0
		}; 



		
		
		$scope.topics_ambitoCloud = [
			{ 
				"codice" : "NONE", 
				"valore" : $translate.instant('assistenza.oggetti_ambitoCloud.none')
			},
			{
				"codice" : "AppEngine", 
				"valore" : $translate.instant('assistenza.oggetti_ambitoCloud.appEngine')
			},
			{
				"codice" : "COMPUTE",
				"valore" :$translate.instant('assistenza.oggetti_ambitoCloud.compute')
			},
			{
				"codice" : "DATABASE",
				"valore" :  $translate.instant('assistenza.oggetti_ambitoCloud.dataBase')
			}
			,
			{
				"codice" : "MONITORAGGIO",
				"valore" :$translate.instant('assistenza.oggetti_ambitoCloud.monitoraggio')
			},
			{
				"codice" : "RETI_SICUREZZA",
				"valore" :  $translate.instant('assistenza.oggetti_ambitoCloud.reti_sic')
			}
			,
			{
				"codice" : "STORAGE",
				"valore" :  $translate.instant('assistenza.oggetti_ambitoCloud.storage')
			}
			
		];
		$scope.getSelectedTexAmbitoCloud= function () {
			if ($scope.assistenza.ambitoCloud !== null) {
			  return /*$translate.instant('assistenza.impatto_selezionato') + ":  " + */ $scope.assistenza.ambitoCloud.valore;
			} else {
			  return $translate.instant('assistenza.ambito_cloud');
			}
		};


		$scope.topics_impatto = [
			{ 
				"codice" : "MINIMO_LOCALIZZATO", 
				"valore" : $translate.instant('assistenza.oggetti_impatto.minimo')
			},
			{
				"codice" : "MODERATO_LIMITATO", 
				"valore" : $translate.instant('assistenza.oggetti_impatto.moderato')
			},
			{
				"codice" : "SIGNIFICATIVO_GRANDE",
				"valore" :$translate.instant('assistenza.oggetti_impatto.significativo')
			},
			{
				"codice" : "VASTO_DIFFUSO",
				"valore" :  $translate.instant('assistenza.oggetti_impatto.vasto')
			}
			
		];

		$scope.getSelectedTextImpatto= function () {
			if ($scope.assistenza.impatto !== null) {
			  return /*$translate.instant('assistenza.impatto_selezionato') + ":  " + */ $scope.assistenza.impatto.valore;
			} else {
			  return $translate.instant('assistenza.impatto_seleziona');
			}
		};

		$scope.topics_urgenza = [
			{ 
				"codice" : "CRITICA", 
				"valore" : $translate.instant('assistenza.oggetti_urgenza.critica')
			},
			{
				"codice" : "ALTA", 
				"valore" :$translate.instant('assistenza.oggetti_urgenza.alta')
			},
			{
				"codice" : "MEDIA",
				"valore" :$translate.instant('assistenza.oggetti_urgenza.media')
			},
			{
				"codice" : "BASSA",
				"valore" : $translate.instant('assistenza.oggetti_urgenza.bassa')
			}
		];

		$scope.getSelectedTextUrgenza= function () {
			if ($scope.assistenza.urgenza !== null) {
			  return /*$translate.instant('assistenza.impatto_selezionato') + ":  " + */ $scope.assistenza.urgenza.valore;
			} else {
			  return $translate.instant('assistenza.urgenza_seleziona');
			}
		};


		

			     
		$scope.downloadAllegato= function (event, allegato) {
			event.preventDefault();
			let filename =allegato.nomeFile;

			var queryString = {};
			queryString.id = allegato.id;
			//queryString.nomeFile = allegato.id;
			//queryString.tipo = allegato.tipoDocumento;
		
			$scope.promise = AllegatiRemedy.query(queryString).$promise;

			$scope.promise.then(function (data) {
			//lo trasformo in arrayBuffer
			console.log(data)
				var binary_string =  window.atob(data.file);
				filename = data.nomeFile;
				var len = binary_string.length;
				var bytes = new Uint8Array( len );
				for (var i = 0; i < len; i++)        {
					bytes[i] = binary_string.charCodeAt(i);
				}

				if (window.navigator.msSaveBlob) { // IE 10+
					let currentBlob = new Blob([bytes.buffer], {type: 'application/pdf'});
					window.navigator.msSaveOrOpenBlob(currentBlob, filename);
				} else {
					try {
						var link = document.createElement('a'); //create link download file
						let currentBlob = new Blob([bytes.buffer], {type: 'application/pdf'});
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
			});


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
			/////////////////////////////////////////////////////////////////////////////////////////////////7

			invia : function( flagInvia){
		
				var formData = new FormData();
				var form = $scope.remedy.form

				objToBeSend.oggetto = $scope.assistenza.oggetto;
				objToBeSend.descrizione = $scope.assistenza.descrizione;
				objToBeSend.accountId =   $scope.remedy.datiSintesi.accountId; 
				objToBeSend.invia = flagInvia == 'false'? false : true;
				objToBeSend.formId = $scope.remedy.datiSintesi.id;
				objToBeSend.formId = form.formId;
				objToBeSend.ambitoCloud = form.ambitoCloud;
				objToBeSend.q_tipo = form.q_tipo;
				objToBeSend.q_category = form.q_category;
				objToBeSend.impatto = form.impatto;
				objToBeSend.q_sev = form.q_sev;
				objToBeSend.q_serv = form.q_serv;
				objToBeSend.qTecnologia = form.qTecnologia;

				

	
				var oggetto = objToBeSend.oggetto;
	
				if (!oggetto || typeof oggetto !== 'string' || (oggetto.trim && oggetto.trim() === '')) {
					notificationManager.showErrorPopup($translate.instant('assistenza.oggetto_required'));
					return;
				}
	
	
		
	
			
			formData.append('form', JSON.stringify(objToBeSend));
			formData.append('file', $scope.uploadme); 
			//console.log($scope.uploadme);

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
					notificationManager.showSuccessPopup($translate.instant('assistenza.success_updatebozza'));
					$state.go('app.listBozze'); 
				}
			
			  }, function (error) {
				notificationManager.showErrorPopup($translate.instant('assistenza.error') + ': ' + error.data.message);
				return;
			  }).finally(function() {
				$rootScope.loadingElement = false;
			});
		},
		
		




			

			inviaworkinfo : function (){

				var formID = $scope.remedy.datiSintesi.id;
				var formData = new FormData();
				$scope.workinfo.ticketId = $scope.remedy.datiSintesi.ticketId;

		
				var riepilogo = $scope.workinfo.riepilogo;
	
				if (!riepilogo || typeof riepilogo !== 'string' || (riepilogo.trim && riepilogo.trim() === '')) {
					notificationManager.showErrorPopup($translate.instant('assistenza.riepilogo_required'));
					return;
				}
	
	
				var note = $scope.workinfo.note;
	
				if (!note || typeof note !== 'string' || (note.trim && note.trim() === '')) {
					notificationManager.showErrorPopup($translate.instant('assistenza.note_required'));
					return;
				}
		
					
		
				
				//formData.append('form', JSON.stringify($scope.workinfo));
				formData.append('file', $scope.allegatoWI); 
				formData.append('form', new Blob([
					JSON.stringify($scope.workinfo)
				], {
					type: "application/json"
				}));

				
				
				$rootScope.loadingElement = true;
				return $http({
					url:  entitiesRest.getBaseUrl + '/api/richiesta/'+formID+'/form/integrazione' ,
					headers: {"Content-Type": undefined },
					data: formData,
					method: "POST"
				}).then(function(response) {
					notificationManager.showSuccessPopup($translate.instant('assistenza.success_wi'));
					//$state.go('app.listRichieste'); 
					getTicket(); 
					$scope.workinfo.note =null;
					$scope.workinfo.riepilogo = null;
					
				
				  }, function (error) {
					notificationManager.showErrorPopup($translate.instant('assistenza.error_wi') + ': ' + error.data.message);
					return;
				  }).finally(function() {
                    $rootScope.loadingElement = false;
                });
			}
		
		};

		
		function decodificaImpatto(codice_impatto){
			$scope.topics_impatto.forEach(function (item) {
				if(item.codice == codice_impatto){
					console.log("EK", item); 
					$scope.assistenza.impatto = item ; 
					return ; 
				}
				
			});
		}

		function decodificaUrgenza(codice_urgenza){
			$scope.topics_urgenza.forEach(function (item) {
				if(item.codice == codice_urgenza){
					console.log("EK", item); 
					$scope.assistenza.urgenza = item ; 
					return ; 
				}
				
			});
		}

		function decodificaAmbitoCloud(codice_ambito){
			$scope.topics_ambitoCloud.forEach(function (item) {
				if(item.codice == codice_ambito){
					console.log("EK", item); 
					$scope.assistenza.ambitoCloud = item ; 
					return ; 
				}
				
			});
		}

		
		function getTicket(){
			
			//$rootScope.loadingElement =  true ; 
			$scope.promise = GetRemedy.get({ id: $scope.richiesta.id }).$promise;

			$scope.promise.then(function (remedy) {
				
				$scope.remedy= remedy; 

				$scope.datiTabInf={};
				$scope.datiTabInf.ticketId =  remedy.datiSintesi.ticketId;
				$scope.datiTabInf.inviato =  remedy.datiSintesi.inviato;
				$scope.datiTabInf.assegnatario =  remedy.assegnatario ? remedy.assegnatario : "N-D" ;
				$scope.datiTabInf.motivo =  remedy.motivo ?  remedy.motivo: "N-D";
				$scope.datiTabInf.dataInvio =  remedy.datiSintesi.dataInvio;
				$scope.datiTabInf.utenteInvio =  remedy.datiSintesi.utenteInvio;
				$scope.datiTabInf.risoluzione =  remedy.risoluzione ? remedy.risoluzione : "N-D";
				$scope.datiTabInf.stato =  remedy.stato;

				$scope.datiTabInf.dataUltimaModifica =  remedy.datiSintesi.dataUltimaModifica ? remedy.datiSintesi.dataUltimaModifica : "-";
				
				$scope.datiTabInf.allegati =  remedy.allegati;


				$scope.datiTabInf.wis = remedy.allegati.filter(function(i) {
					return i.riepilogo !== null;
				});

				


				var arr= $scope.datiTabInf.wis;

				//l'ultima wi aggiunta ha l'id il più grande
				var result = arr.filter(obj => {
					return obj.id === Math.max(...arr.map(o => o.id))
				})

				$scope.canWIbeAdded= false; 
				if(result.length!=0){
					$scope.canWIbeAdded = result[0].tipologia== "Detail Clarification" ? true : false; 
				}
				if($scope.canWIbeAdded){
					$scope.workinfo.riepilogo = "Reply to > "+result[0].riepilogo; 
				}
				$scope.isAgenteBOAdmin = AuthenticationService.isGranted(AuthLevel.BOADMIN);

				$scope.datiTabInf.allegati = remedy.allegati.filter(function(i) {
					return i.nomeFile !== null;
				});

				//$scope.isObjectInviato = remedy.datiSintesi.inviato ==true? true: false;
				$scope.isBodyFixed = false;

				$scope.assistenza = angular.copy(remedy.form);
				$scope.assistenza.portaDiComunicazione = parseInt(remedy.form.porta);
				decodificaImpatto(remedy.form.impatto); 
				decodificaUrgenza(remedy.form.urgenza);
				decodificaAmbitoCloud(remedy.form.urgenza); 
				

				
				if(remedy.datiSintesi.inviato){
					$scope.isObjectFixed = true;
				}
				


				$scope.status.loaded = true;
			
			}, function (onfail) {
				if (onfail.data) {
					notificationManager.showErrorPopup($translate.instant('error.loading_remedy') + ': ' + onfail.data.message);
				} else {
					notificationManager.showErrorPopup($translate.instant('error.loading_remedy'));
				}
				return;
			}).finally(function() {
				$scope.options.isDettaglioLoaded=true;
				//$rootScope.loadingElement =  false ; 
				
			});
		}



		$scope.actions.gotoTab = function (index) {
			$scope.status.tabIndex = index;
		};


	

		function clearField() {
			var utente = $rootScope.utente;
			console.log("utente", utente);

			$scope.isLogged = utente.abilitazioneSelezionata.userRole !== AuthLevel.OSPITE;

			
			$scope.assistenza.accountId = utente.abilitazioneSelezionata.accountUuid;
			$scope.assistenza.oggetto = null;
			

			// Evito di modificare le proprietà read-only
			objToBeSend = angular.copy($scope.assistenza);
		}

		this.onInit = function () {
			clearField();


			if ($stateParams.richiesta) {
				$scope.richiesta = $stateParams.richiesta;
				


				getTicket();
			}else{
				//$state.go('app.listRichieste'); 
				window.history.back();
			}

			
		};

		this.onExit = function () { };

		controllerValidator.validate(this, $scope);
	}]);

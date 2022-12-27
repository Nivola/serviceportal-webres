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

angular.module('app').controller('DettaglioRichiestaCoudController', [
	'$rootScope', '$scope', '$state', '$stateParams', 'FileUploader', '$http', 'AuthenticationService',
	'controllerValidator', 'loggers', 'notificationManager', 'entitiesRest', 'AuthLevel', '$translate', '$timeout',
	function (
		$rootScope, $scope, $state, $stateParams, FileUploader, $http, AuthenticationService,
		controllerValidator, loggers, notificationManager, entitiesRest, AuthLevel, $translate, $timeout
	) {
		'use strict';

		var logger = loggers.get("DettaglioRichiestaCoudController");
		var UpdateUrgenza = entitiesRest.getEntity('UpdateUrgenza');
		var GetRemedy = entitiesRest.getEntity('GetRemedy');
		var AllegatiRemedy = entitiesRest.getEntity('AllegatiRemedy');
		var Assegnatori = entitiesRest.getEntity('Assegnatori');
		var EditAssegnatario = entitiesRest.getEntity('EditAssegnatario');
		
		
		
		

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
		$scope.allegatoWI = null; 
		$scope.showIt = false; 


		$scope.selectedItem  = null;
		$scope.searchText    = null;
		$scope.querySearch   = querySearch;


		$scope.status = {
			
			tagsReadOnly: false,
			tagsRemovable: true,
			tabIndex: 0
		}; 


		$scope.data = {
			dataInizio : null,
			dataFine : null 
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

		

		  
		  $scope.getUtenti = function () {
			// if($scope.searchText .length<3){

			// }else{
				var queryString = {};
		   
				queryString.startBy= $scope.searchText ;


				$scope.promise = Assegnatori.query(queryString).$promise;	

				return $scope.promise.then(function (data) {
					$scope.utenti = data;
					$scope.utenti.forEach(function (item) {
						item.display = item.cognome+ " " + item.nome; 
					}); 
					//$scope.numeroAttivi = $filter('filter')(data, { attivo: true }).length;
					//$scope.numeroDisattivi = $filter('filter')(data, { attivo: false }).length;
				}, function (onfail) {
					notificationManager.showErrorPopup("si è vrificato un errore durante il caricamento degli utenti ");
				});
			//}
			
		};


		function querySearch (query) {
			
			$timeout(function () { $scope.getUtenti(); }, Math.random() * 1000, false);
		  //   var results = query ? $scope.utenti.filter(createFilterFor(query)) :  $scope.utenti /*  $scope.states */;
		  //   var deferred = $q.defer();
		  //   $timeout(function () { deferred.resolve(results); }, Math.random() * 1000, false);
		  //   return deferred.promise;
		  return  $scope.utenti ; 
		}

		$scope.getSelectedTextImpatto= function () {
			if ($scope.assistenza.impatto !== null) {
			  return /*$translate.instant('assistenza.impatto_selezionato') + ":  " + */ $scope.assistenza.impatto.valore;
			} else {
			  return $translate.instant('assistenza.impatto_seleziona');
			}
		};

		$scope.topics_urgenza = [
			{ 
				"codice" : "Critica", 
				"valore" : $translate.instant('assistenza.oggetti_urgenza.critica')
			},
			{
				"codice" : "Alta", 
				"valore" :$translate.instant('assistenza.oggetti_urgenza.alta')
			},
			{
				"codice" : "Media",
				"valore" :$translate.instant('assistenza.oggetti_urgenza.media')
			},
			{
				"codice" : "Bassa",
				"valore" : $translate.instant('assistenza.oggetti_urgenza.bassa')
			}
		];

		$scope.codificaUrgenza = function(expression) {
			var val =null
			switch(expression) {
				case "critica":
				  val= 1;
				  break;
				case "alta":
				  val= 2
				  break;
				case "media":
				  val=3;
				  break;
				case "bassa":
				  val=4
				default:
				  val=4
			}

			  return val;
		};

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
		


		$scope.checkErr = function(startDate,endDate) {
			$scope.errMessage = ''
			var curDate = new Date();
			
			if(new Date(startDate) > new Date(endDate)){
			  $scope.errMessage = 'End Date should be greater than start date';
			  return false;
			}
			if(new Date(startDate) < curDate){
			   $scope.errMessage = 'Start date should not be before today.';
			   return false;
			}
		};


		$scope.actions = {
				
			
			navigateToServiziCloud: function(){
				$state.go("app.formAssistenza.serviziCloud", {
					//idOrganizzazione:$scope.account.organizzazione.uuid
				});
			},

			updateUrgenza : function(){
				
				var itemJson ={};
				itemJson.id = $scope.remedy.datiSintesi.id;
				itemJson.urgenza = $scope.codificaUrgenza($scope.assistenza.urgenza.codice.toLowerCase()); //$scope.assistenza.urgenza.codice;

				UpdateUrgenza.update(itemJson, function (data) {
					logger.info('SUCCESS', data);
					notificationManager.showSuccessPopup("Urgenza aggiornata correttamente");
					
						$state.go('app.dettaglioRichiesta',{
							richiesta: $scope.richiesta,
						});
						
					
					
				}, function (onfail) {
					logger.error('ERROR', onfail);
					if (onfail.data) {
						notificationManager.showErrorPopup($translate.instant('assistenza.error_update_urgenza') + ': ' + onfail.data.message);
					} else {
						notificationManager.showErrorPopup($translate.instant('assistenza.error_update_urgenza'));
					}
				}).$promise.finally(function () {
					//$scope.status.pending = false;
					
				});
			},

			manageAssegnatario : function(){
					$scope.showIt = !$scope.showIt; 
			},

			submitAssegnatario : function(){
			
				var toSend ={
					dataFineValidita : $scope.data.dataFine,
					dataInizioValidita : $scope.data.dataInizio,
					idRichiesta : $scope.remedy.datiSintesi.id,
					idUtenteAssegnatario : $scope.selectedItem.id
				}
				 
			
				EditAssegnatario.save(toSend, function (data) {
					logger.info('SUCCESS', data);
					notificationManager.showSuccessPopup("Richiesta inviata correttamente :"+ data.message);
					
					
				}, function (onfail) {
					logger.error('ERROR', onfail);
					if (onfail.data) {
						notificationManager.showErrorPopup( "L'operazione non è andata a buon fine" + ': ' + onfail.data.message);
					} else {
						notificationManager.showErrorPopup("L'operazione non è andata a buon fine");
					}
				});
			},
		

			rimuovi: function (){
				$scope.uploadme = null
			},
			invia : function( flagInvia){
		
					var formData = new FormData();

					objToBeSend.oggetto = $scope.assistenza.oggetto;
					objToBeSend.impatto = $scope.assistenza.impatto.codice;
					objToBeSend.urgenza = $scope.assistenza.urgenza.codice;
					objToBeSend.descrizione = $scope.assistenza.descrizione;
					objToBeSend.invia = flagInvia == 'false'? false : true;
					objToBeSend.formId = null;
					objToBeSend.ambitoCloud = $scope.assistenza.ambitoCloud.codice;
		
		
					var oggetto = objToBeSend.oggetto;
		
					if (!oggetto || typeof oggetto !== 'string' || (oggetto.trim && oggetto.trim() === '')) {
						notificationManager.showErrorPopup($translate.instant('assistenza.oggetto_required'));
						return;
					}
		
		
					var impatto = objToBeSend.impatto;
		
					if (!impatto || typeof impatto !== 'string' || (impatto.trim && impatto.trim() === '')) {
						notificationManager.showErrorPopup($translate.instant('assistenza.oggetto_required'));
						return;
					}
		
					var urgenza = objToBeSend.urgenza;
		
					if (!urgenza || typeof urgenza !== 'string' || (urgenza.trim && urgenza.trim() === '')) {
						notificationManager.showErrorPopup($translate.instant('assistenza.oggetto_required'));
						return;
					}
		
				
				formData.append('form', JSON.stringify(objToBeSend));
				formData.append('file', $scope.uploadme); 
				console.log($scope.uploadme); 

				return $http({
					url:  entitiesRest.getBaseUrl + '/api/richiesta/AnomaliaServiziCloud/form' ,
					headers: {"Content-Type": undefined },
					data: formData,
					method: "POST"
				}).then(function(response) {
					notificationManager.showSuccessPopup($translate.instant('assistenza.success'));
					if(flagInvia=='true'){
						$state.go('app.listRichieste'); 
					}else{
						$state.go('app.listBozze'); 
					}
				
				  }, function (error) {
					notificationManager.showErrorPopup($translate.instant('assistenza.error') + ': ' + error.data.message);
					return;
				  });;
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

				
				
				$rootScope.loadingElement =  true ; 
				return $http({
					url:  entitiesRest.getBaseUrl + '/api/richiesta/'+formID+'/form/integrazione' ,
					headers: {"Content-Type": undefined },
					data: formData,
					method: "POST"
				}).then(function(response) {
					notificationManager.showSuccessPopup($translate.instant('assistenza.success'));
					getTicket();
					//$state.go('app.listRichieste');
					// if(flagInvia=='true'){
					// 	$state.go('app.listRichieste'); 
					// }else{
					// 	$state.go('app.listBozze'); 
					// }
				
				  }, function (error) {
					notificationManager.showErrorPopup($translate.instant('assistenza.error') + ': ' + error.data.message);
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
				if(/*item.codice == codice_urgenza*/  item.codice.toLowerCase().localeCompare(codice_urgenza.toLowerCase())==0 ){
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

		function decodeSeverity(sev){
			var severity = null;
			 switch(parseInt(sev)) {
				 case 1:
				   severity=$translate.instant('assistenza.oggetti_impatto.vasto') //"Vasto/Diffuso";
				   break;
				 case 2:
					 severity=$translate.instant('assistenza.oggetti_impatto.significativo') //"Significativo/Grande";
				   break;
				 case 3:
					 severity=$translate.instant('assistenza.oggetti_impatto.moderato') //"Moderato/Limitato";
				 break;
				 case 4:
					 severity=$translate.instant('assistenza.oggetti_impatto.minimo') //"Minimo/Localizzato";
				 break;
				 default:
					 severity = "N-D";
			   }

			   return severity; 

		 }

		
	

		function getTicket(){
			
			//$rootScope.loadingElement =  true ; 
			$scope.promise = GetRemedy.get({ id: $scope.richiesta.id }).$promise;

			$scope.promise.then(function (remedy) {
				
				$scope.remedy= remedy; 

				$scope.datiTabInf={};
				$scope.datiTabInf.ticketId =  remedy.datiSintesi.ticketId;
				$scope.datiTabInf.assegnatario =  remedy.datiSintesi.assegnatario ? remedy.datiSintesi.assegnatario : "N-D" ;
				$scope.datiTabInf.motivo =  remedy.motivo ?  remedy.motivo: "N-D";
				$scope.datiTabInf.dataInvio =  remedy.datiSintesi.dataInvio;
				$scope.datiTabInf.risoluzione =  remedy.risoluzione ? remedy.risoluzione : "N-D";
				$scope.datiTabInf.stato =  remedy.stato;
				$scope.datiTabInf.utenteInvio =  remedy.datiSintesi.utenteInvio;
				$scope.datiTabInf.struttOrganizativa =  remedy.datiSintesi.organizzazioneName+" / "+ remedy.datiSintesi.divisioneName+" / "+remedy.datiSintesi.accountName;
				$scope.datiTabInf.dataUltimaModifica =  remedy.datiSintesi.dataUltimaModifica ? remedy.datiSintesi.dataUltimaModifica : "-";
				
				//$scope.datiTabInf.allegati =  remedy.allegati;


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
				$scope.isAgenteBOAdmin = AuthenticationService.isGranted(AuthLevel.BOADMIN);

				$scope.datiTabInf.allegati = remedy.allegati.filter(function(i) {
					return i.nomeFile !== null;
				});

				//$scope.isObjectInviato = remedy.datiSintesi.inviato ==true? true: false;
				$scope.isBodyFixed = false;

				$scope.assistenza = angular.copy(remedy.form);
				$scope.assistenza.portaDiComunicazione = parseInt(remedy.form.porta);
				decodificaImpatto(remedy.form.impatto); 
				//decodificaUrgenza(remedy.form.q_sev);
				decodificaUrgenza(remedy.datiSintesi.urgenza);
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

		$scope.actions.onUrgenzaChange = function () {
			$scope.canUpdateSev = true ; 
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
			$scope.canUpdateSev= false; 
			clearField();
			

			if ($stateParams.richiesta) {
				$scope.richiesta = $stateParams.richiesta;
				$scope.isBOAdminRole= true; 
				


				getTicket();
			}else{
				$state.go('app.listRichiesteBOAdmin'); 
			}

			
		};

		this.onExit = function () { };

		controllerValidator.validate(this, $scope);
	}]);

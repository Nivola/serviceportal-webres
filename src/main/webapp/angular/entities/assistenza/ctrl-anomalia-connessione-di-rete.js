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

angular.module('app').controller('AnomaliaConnessioneDiReteController', [
	'$rootScope', '$scope', '$state', '$stateParams', 'FileUploader',
	'controllerValidator', 'loggers', 'notificationManager', 'entitiesRest', 'AuthLevel', '$translate', 
	function (
		$rootScope, $scope, $state, $stateParams, FileUploader,
		controllerValidator, loggers, notificationManager, entitiesRest, AuthLevel, $translate
	) {
		'use strict';

		var logger = loggers.get("AnomaliaConnessioneDiReteController");
		var Remedy = entitiesRest.getEntity('Remedy');
		var GetRemedy = entitiesRest.getEntity('GetRemedy');

		var objToBeSend = null; 
		$scope.assistenza = {
			nome: null,
			email: null,
			oggetto: null,
			descrizione: null,
			impatto : null,
			urgenza : null ,
			ipHostFrom : null ,
			ipHostTo : null ,
			portaDiComunicazione: null 
		};
		$scope.isLogged = false;
		$scope.isObjectFixed = false;
		$scope.isBodyFixed = false;

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



		// allegati 

		var errorOccured = false ; 

        var uploader = $scope.uploader = new FileUploader({
           // compongo il primo pezzo dell'url della chiamata al servizio . l'ultimo pezzo va aggiunto in fondo al primo , poco prima  dell'invio del file (vedere funzione 'onBeforeUploadItem')
            url : entitiesRest.getBaseUrl + '/api/richiesta/AnomaliaServiziCloud/form'  // + $stateParams.idAccount + '/upload/'
        });

        // FILTERS
      
        // a sync filter
        uploader.filters.push({
            name: 'syncFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                console.log('syncFilter');
                return this.queue.length < 10;
            }
        });
      
        // an async filter
        uploader.filters.push({
            name: 'asyncFilter',
            fn: function(item /*{File|FileLikeObject}*/, options, deferred) {
                console.log('asyncFilter');
                setTimeout(deferred.resolve, 1e3);
            }
        });

        // CALLBACKS

        uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploader.onAfterAddingFile = function(fileItem) {
            console.info('onAfterAddingFile', fileItem);
            $scope.file= fileItem.file; 
       
        };
        uploader.onAfterAddingAll = function(addedFileItems) {
            console.info('onAfterAddingAll', addedFileItems);
        };
        uploader.onBeforeUploadItem = function(item) {
            // imposto correttamente l'url della chiamata el servizio
           // item.url=  item.url + $scope.allegato.selectedtipo.etichetta

			// aggiungo il json con dati del form 
			objToBeSend.oggetto = $scope.assistenza.oggetto;
			objToBeSend.impatto = $scope.assistenza.impatto.codice;
			objToBeSend.urgenza = $scope.assistenza.urgenza.codice;
			objToBeSend.descrizione = $scope.assistenza.descrizione;

			objToBeSend.ambitoCloud = "ambitoCloud";


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


			uploader.formData.push(
				objToBeSend
			)
            console.info('onBeforeUploadItem', item);
        };
        uploader.onProgressItem = function(fileItem, progress) {
            console.info('onProgressItem', fileItem, progress);
        };
        uploader.onProgressAll = function(progress) {
            console.info('onProgressAll', progress);
        };
        uploader.onSuccessItem = function(fileItem, response, status, headers) {
            console.info('onSuccessItem', fileItem, response, status, headers);
            notificationManager.showSuccessPopup($translate.instant('assistenza.success') + ': ' + response.message);
        };
        uploader.onErrorItem = function(fileItem, response, status, headers) {
            console.info('onErrorItem', fileItem, response, status, headers);
            errorOccured= true ; 
            notificationManager.showErrorPopup($translate.instant('assistenza.error') + ': ' + response.message)
        };
        uploader.onCancelItem = function(fileItem, response, status, headers) {
            console.info('onCancelItem', fileItem, response, status, headers);
            notificationManager.showSuccessPopup($translate.instant('accounts.visualizza.allegati.upload.cancel'));
        };
        uploader.onCompleteItem = function(fileItem, response, status, headers) {
            console.info('onCompleteItem', fileItem, response, status, headers);
        };

        uploader.onTimeoutItem = function(fileItem) {
            console.info('onTimeoutItem', fileItem);
            notificationManager.showErrorPopup($translate.instant('accounts.visualizza.allegati.upload.timeoutItem'))
        };

        uploader.onCompleteAll = function() {
            console.info('onCompleteAll');
            // if(!errorOccured){
            //     $state.go("app.account"); 
            // }
           
        };

        console.info('uploader', uploader);


		

		// fine sezione allegati


		function getTicket(){
			
			
			$scope.promise = GetRemedy.get({ id: $scope.richiesta.id }).$promise;

			$scope.promise.then(function (remedy) {
				

				$scope.datiTabInf={};
				$scope.datiTabInf.ticketId =  remedy.datiSintesi.ticketId;
				$scope.datiTabInf.assegnatario =  remedy.assegnatario ? remedy.assegnatario : "N-D" ;
				$scope.datiTabInf.motivo =  remedy.motivo ?  remedy.motivo: "N-D";
				$scope.datiTabInf.dataInvio =  remedy.datiSintesi.dataInvio;
				$scope.datiTabInf.risoluzione =  remedy.risoluzione ? remedy.risoluzione : "N-D";
				$scope.datiTabInf.stato =  remedy.stato;



				$scope.assistenza = angular.copy(remedy.form);
				$scope.assistenza.portaDiComunicazione = parseInt(remedy.form.porta);
				decodificaImpatto(remedy.form.impatto); 
				decodificaUrgenza(remedy.form.urgenza);
				



				// $scope.remedyDetails = remedy;
				// $scope.datiSintesi = remedy.datiSintesi;
				// $scope.form = remedy.form;

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
			});
		}




	


		$scope.actions = {
			navigateToServiziCloud: function(){
				$state.go("app.formAssistenza.serviziCloud", {
					//idOrganizzazione:$scope.account.organizzazione.uuid
				});
			},
		
		};

		$scope.actions.gotoTab = function (index) {
			$scope.status.tabIndex = index;
		};

		function clearField() {
			var utente = $rootScope.utente;
			console.log("utente", utente);

			$scope.isLogged = utente.abilitazioneSelezionata.userRole !== AuthLevel.OSPITE;

			$scope.assistenza.nome = utente ? utente.lastName + ' ' + utente.firstName : '';
			$scope.assistenza.email = utente ? utente.email : '';
			$scope.assistenza.oggetto = null;
			$scope.assistenza.messaggio = '';

			// Evito di modificare le proprietà read-only
			objToBeSend = angular.copy($scope.assistenza);
		}

		this.onInit = function () {
			clearField();

			// Recupera eventuale oggetto
			if ($stateParams.richiesta) {
				$scope.richiesta = $stateParams.richiesta;
				$scope.isObjectFixed = true;

				getTicket();
			}

			// Recupera eventuale messaggio
			// if ($stateParams.body) {
			// 	$scope.assistenza.messaggio = $stateParams.body;
			// 	objToBeSend.messaggio = $stateParams.body;
			// 	$scope.isBodyFixed = true;
			// }
		};

		this.onExit = function () { };

		controllerValidator.validate(this, $scope);
	}]);

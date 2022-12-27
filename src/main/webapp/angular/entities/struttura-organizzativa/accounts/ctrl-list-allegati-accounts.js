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
nivolaApp.controller('ListAllegatiAccountsController',
	["$scope", "$state", "$stateParams", "$filter", "$mdDialog", "AuthLevel", "$translate",
		"entitiesRest", "controllerValidator", "notificationManager", 'loggers', "AuthenticationService",
		function ($scope, $state, $stateParams, $filter, $mdDialog, AuthLevel, $translate,
			entitiesRest, controllerValidator, notificationManager, loggers, AuthenticationService) {
			"use strict";

			var logger = loggers.get("ListAllegatiAccountsController");
			var AllegatiAccount = entitiesRest.getEntity('AllegatiAccount'); 
			var DeleteFile = entitiesRest.getEntity('DeleteFile'); 
			var	DownloadAllegato = entitiesRest.getEntity('DownloadAllegato');
			 
			$scope.quoteServiziSelezionata=null; 
		
			var abilitazioneSelezionata =AuthenticationService.getUtente().abilitazioneSelezionata;
			$scope.nomeAcc= abilitazioneSelezionata.accountName ; 
			
			$scope.selected = [];


			$scope.actions = {
				auth: {
					deleteAllegati: AuthLevel.AccountAdminRole,
					downloadAllegati:  $state.get("app.AllegatiAccount").requiredUC,

				},


			

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
				order: "organizzazione_name",
				limit: 10,
				page: 1
			};

			$scope.actions = {
				auth: {
					
				},

				refresh: getAllegatiAccount,

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

			$scope.downloadAllegato= function (event) {
				event.preventDefault();
				let allegato =  $scope.selected[0]
				let filename =allegato.nomeFile;
		
				var abilitazione = AuthenticationService.getUtente().abilitazioneSelezionata;
				logger.debug("Abilitazione corrente", abilitazione);

				var queryString = {};
				queryString.accountId = abilitazione.accountUuid;
				queryString.nomeFile = allegato.nomeFile;
				queryString.tipo = allegato.tipoDocumento;
			
				$scope.promise = DownloadAllegato.query(queryString).$promise;
		
				$scope.promise.then(function (data) {
				   //lo trasformo in arrayBuffer
				   console.log(data)
					var binary_string =  window.atob(data.report);
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
		

			
			$scope.deleteAllegato= function (event) {
				var confirm = $mdDialog
				.confirm()
				.title($translate.instant('accounts.visualizza.allegati.elimina.titolo') + ' ' + $scope.selected[0].nomeFile)
				.htmlContent(" <md-dialog-content class='md-dialog-content ng-scope'> <div> <b class='ng-binding '>" 
						+ $translate.instant('accounts.visualizza.allegati.elimina.testo') 
						+ "</b><br><br><p class='ng-binding'>" 
						+ $translate.instant('accounts.visualizza.allegati.elimina.procedere')+ "</b> <br></div></md-dialog-content>")
				.targetEvent(event)
				.ok($translate.instant('conferma'))
				.cancel($translate.instant('annulla'))
			$mdDialog.show(confirm).then(function () {
				DeleteFile.update({ nomeFile: escape($scope.selected[0].nomeFile), tipoDocumento: $scope.selected[0].tipoDocumento}, function (data) {
					console.log(data);
					notificationManager.showSuccessPopup($translate.instant('accounts.visualizza.allegati.elimina.success'));
					$scope.unselectAll();
					getAllegatiAccount();
				}, function (onfail) {
					logger.error("ERROR", onfail);
					notificationManager.showErrorPopup($translate.instant('accounts.visualizza.allegati.elimina.error') + ' ' + $scope.selected[0].nomeFile);
				});
			});
			}
			
			
			
	function bytesToSize(bytes) {
		var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
		if (bytes == 0) return '0 Byte';
		var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
		return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
	}
		
			

			
	function getAllegatiAccount() {
		
		$scope.promise = AllegatiAccount.get($scope.account).$promise;

		return $scope.promise.then(function (data) {
			
			data.forEach(function (value) {
				
				value.dimensione!=null ? value.dim = bytesToSize(value.dimensione) :  value.dim =value.dimensione;
			});
			$scope.allegati = angular.copy(data);
			
		}, function (onfail) {
			notificationManager.showErrorPopup($translate.instant('error.loading_utenti'));
		}).finally(function() {
			$scope.options.isAllegatiLoaded=true;
		});
	};
				
				
            

			this.onInit = function () {
				getAllegatiAccount(); 
				
			};

			this.onExit = function () { };

			controllerValidator.validate(this, $scope);
		}
	]);

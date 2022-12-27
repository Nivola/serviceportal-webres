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
nivolaApp.controller('ListAttivitaAccountsController',
	["$scope", "$state", "$stateParams", "$filter", "$mdDialog", "AuthLevel",
		"entitiesRest", "controllerValidator", "notificationManager", 'loggers', "AuthenticationService", '$translate',
		function ($scope, $state, $stateParams, $filter, $mdDialog, AuthLevel, 
			entitiesRest, controllerValidator, notificationManager, loggers, AuthenticationService, $translate) {
			"use strict";

			var logger = loggers.get("ListAttivitaAccountsController");
			var Account = entitiesRest.getEntity('Account');
			var Divisione = entitiesRest.getEntity('Divisione');
			var AttivitaAccount = entitiesRest.getEntity('AttivitaAccount');
			var ReportcsvAttivitaAccount = entitiesRest.getEntity('ReportcsvAttivitaAccount');
			

			$scope.accounts = [];
			$scope.selected = [];
			var abilitazioneSelezionata =AuthenticationService.getUtente().abilitazioneSelezionata;
			
			// Proprietà data-table
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

			$scope.limitOptions = [5, 10, 15];

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
					new: $state.get("app.account.new").requiredUC,
					delete: $state.get("app.account.new").requiredUC,
					change: $state.get("app.account.change").requiredUC
				},

				downloadCSV:  function (event) {
                    setTimeout(() => {
                        if($scope.promise.$$state.status===0){
                            $rootScope.loadingElement = true;
                        }
                    }, 1000);
					event.preventDefault();
					
					// var queryString = {};
					// queryString.accountId = $scope.idAccount ; 
				   
					$scope.promise = ReportcsvAttivitaAccount.get({ "account" : $scope.nomeAcc}).$promise;
			
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
							let currentBlob = new Blob([bytes.buffer], {type: 'test/csv'});
							window.navigator.msSaveOrOpenBlob(currentBlob, filename);
						} else {
							try {
								var link = document.createElement('a'); //create link download file
								let currentBlob = new Blob([bytes.buffer], {type: 'test/csv'});
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

				refresh: getAttivitaAccount,


				viewContenuto: function (att) {
					$scope.selected=[];

					setTimeout(function(){ 

						$mdDialog.show({
							locals: {
								attivita: att
							},
							controller: 'DialogAttivitaContenutoController',
							templateUrl: 'angular/entities/struttura-organizzativa/accounts/tpl-dialog-dettaglio-attivita.html',
							parent: angular.element(document.body),
							targetEvent: att,
							clickOutsideToClose: true,
							fullscreen: true	// Only for -xs, -sm breakpoints.
						});

					 }, 500);
					
					
				},

			};

			$scope.openFromLeft = function(content) {
				$mdDialog.show(
				  $mdDialog.alert()
					.clickOutsideToClose(true)
					.title( $translate.instant('accounts.attivita.parametri'))
					.textContent(content)
					.ariaLabel('Left to right demo')
					.ok($translate.instant('chiudi'))
					// You can specify either sting with query selector
					.openFrom('#left')
					// or an element
					.closeTo(angular.element(document.querySelector('#right')))
				);
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

			
			
			

			function getAttivitaAccount() {
				// tornare alla lista degli account se l'utente fa il refresh della lista attivita e quindi vengono persi gli elementi del $stateparams
				if(!$stateParams.accountName  && abilitazioneSelezionata.userRole===AuthLevel.BOADMIN){
					$state.go("app.account"); 
					return 
				}
			
				if($stateParams.accountName){
					//$scope.listAttivita=$stateParams.ArrayAttivita; 
					$scope.nomeAcc=$stateParams.accountName; 
				}else{
					$scope.nomeAcc = abilitazioneSelezionata.accountName; 
				}
					
					$scope.promise = AttivitaAccount.query({ "account" : $scope.nomeAcc}).$promise;
				
					
					return $scope.promise.then(function (data) {
						logger.info("SUCCESS", data);
						data.forEach(function (value) {
							if (value.parametri) {
								value.parametri=value.parametri.replace(/,/g, " , ");
							}
							if (!value.username) {
								value.username=$translate.instant('accounts.attivita.non_definito');
							}
							if (!value.indirizzoIp) {
								value.indirizzoIp=$translate.instant('accounts.attivita.non_definito');
							}
						});
						$scope.listAttivita = data.sort(function(a, b) {
							if ( a['dataAzione'] > b['dataAzione'] ) return -1;
							return 1;
						  });; 
					
					}, function (onfail) {
						logger.error("ERROR", onfail);
						if (onfail.body) {
							if (onfail.body.data && onfail.body.data.message) {
								notificationManager.showErrorPopup($translate.instant('error.loading_attivita') + ': ' + onfail.body.data.message);
							} else {
								notificationManager.showErrorPopup($translate.instant('error.loading_attivita'));
							}
						} else {
							notificationManager.showErrorPopup($translate.instant('error.loading_attivita'));
						}
					});

				}; 
				
            

			this.onInit = function () {
				getAttivitaAccount(); 
				
			};

			this.onExit = function () { };

			controllerValidator.validate(this, $scope);
		}
	]);

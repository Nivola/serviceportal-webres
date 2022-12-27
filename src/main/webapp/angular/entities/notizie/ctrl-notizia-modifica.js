/*-
 * ========================LICENSE_START=================================
 * Nivola Service Portal Web Resources
 * %%
 * Copyright (C) 2022 CSI Piemonte
 * %%
 * SPDX-FileCopyrightText: Copyright 2022 | CSI Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
"use strict";

angular.module('app')

	.controller('ModificaNotiziaController', ['$mdDialog', '$scope', '$state', '$stateParams','$timeout',
		'AuthLevel', 'entitiesRest', 'controllerValidator',
		'notificationManager', "$filter", 'loggers', 'conf','StringMap','AuthenticationService', '$translate',
		function ($mdDialog, $scope, $state, $stateParams, $timeout,
			AuthLevel, entitiesRest, controllerValidator,
			notificationManager, $filter, loggers, conf,StringMap,AuthenticationService, $translate) {
			'use strict';

			
			var Notizia = entitiesRest.getEntity('Notizia');
	

			
			$scope.notiziaDetails = {};
			
			
			
			$scope.isBOAdmin=AuthenticationService.isGranted(AuthLevel.BOADMIN);

			// Proprietà data-table
			$scope.options = {
				isDettaglioLoaded:false,
			};

			$scope.availableStatuses = [
				{ code : 'BOZZA', description : $translate.instant('notizie.stato.bozza'), order : 2 },
				{ code : 'OBSOLETA', description : $translate.instant('notizie.stato.obsoleta'), order : 3 },
				{ code : 'PUBBLICATA', description : $translate.instant('notizie.stato.pubblicata'), order : 1 }
			];
		
			$scope.elencoPriorita = [
				{ code : 10, description : $translate.instant('notizie.priorita.alta'), order : 1 },
				{ code : 20, description : $translate.instant('notizie.priorita.media'), order : 2 },
				{ code : 30, description : $translate.instant('notizie.priorita.bassa'), order : 3 }
			];

			
			$scope.actions = {
				auth: {
					add: $state.get("app.creaNotizia").requiredUC,

					advancedSearch: [
						AuthLevel.SUPERADMIN,
						AuthLevel.BOADMIN,
						/*AuthLevel.BOMONITORING,*/
						AuthLevel.OrgAdminRole,
						AuthLevel.DivAdminRole,
						AuthLevel.AccountAdminRole
					].join(","),

					delete: [
						AuthLevel.SUPERADMIN,
						AuthLevel.BOADMIN,
						/*AuthLevel.BOMONITORING,*/
						AuthLevel.OrgAdminRole,
						AuthLevel.DivAdminRole,
						AuthLevel.AccountAdminRole
					].join(",")
				},

				refresh: getNotizia,


				delete: function (event) {
					var confirm = $mdDialog
						.confirm()
						.title($translate.instant('notizie.elimina.titolo'))
						.textContent($translate.instant('notizie.elimina.testo'))
						.targetEvent(event)
						.ok($translate.instant('si'))
						.cancel($translate.instant('no'));
					$mdDialog.show(confirm).then(function () {
						
							Notizia.delete({ idNotizia: $scope.idNotizia  }, function (data) {
								console.log("success", data);
								notificationManager.showSuccessPopup($translate.instant('notizie.elimina.success'));
								
								window.history.back();
           						$scope.status.loaded = true;
							}, function (onfail) {
								console.error("deleteError", onfail);

								if (onfail.body) {
									if (onfail.body.data && onfail.body.data.message) {
										notificationManager.showErrorPopup($translate.instant('notizie.elimina.error') + ' ' + onfail.body.data.message);
									} else {
										notificationManager.showErrorPopup($translate.instant('notizie.elimina.error'));
									}
								} else {
									notificationManager.showErrorPopup($translate.instant('notizie.elimina.error'));
								}
							});
					
					});
				},




				invia: function (event) {
					
					try {
						if ($scope.formModificaNotizia.$valid) {
							
						 
							Notizia.update($scope.notiziaDetails, function (data) {
								if (!data && !data.data && data.status != 200) {
									$scope.status.loaded = true;
									notificationManager.showErrorPopup($translate.instant('notizie.modifica.error'));
									return;
								}
	
								notificationManager.showSuccessPopup($translate.instant('notizie.modifica.success'));
								getNotizia();
								//dopo salvataggio ritorno in testa
								//$location.hash('modificaNotizia');
								//$anchorScroll('modificaNotizia');
								$scope.status.loaded = true;
							}, function (onfail) {
								notificationManager.showErrorPopup($translate.instant('notizie.modifica.error'));
							    $scope.status.loaded = true;
							});
	
							return;
						}
						//vuol dire il mio form non e' valido probabilmente mancano dei dati faccio scroll to
						$location.hash($scope.formModificaNotizia.$error.required[0]);
						$anchorScroll($scope.formModificaNotizia.$error.required[0]);
					} finally {
						 $scope.status.loaded = true;
					}
				},
	





				
			}

			// window.history.back();
            // $scope.status.loaded = true;

			function getNotizia(){
				$scope.options.isDettaglioLoaded=false;
				$scope.idNotizia = $stateParams.idNotizia;
				$scope.promise = Notizia.get({ idNotizia: $scope.idNotizia }).$promise;

				$scope.promise.then(function (notizia) {
					$scope.notiziaDetails = notizia;
					$scope.status.loaded = true;
					$scope.dtInizio=  new Date($scope.notiziaDetails.dataPubblicazioneInizio);
					$scope.dtFine=new Date($scope.notiziaDetails.dataPubblicazioneFine); 
					
					

				}, function (onfail) {
					if (onfail.body) {
						if (onfail.body.data && onfail.body.data.message) {
							notificationManager.showErrorPopup($translate.instant('error.loading_notizia') + ': ' + onfail.body.data.message);
						} else {
							notificationManager.showErrorPopup($translate.instant('error.loading_notizia'));
						}
					} else {
						notificationManager.showErrorPopup($translate.instant('error.loading_notizia'));
					}
					return;
				}).finally(function() {
					$scope.options.isDettaglioLoaded=true;
				});
			}



			this.onInit = function () {
				$scope.status.loaded = false; 
				getNotizia();
				
			
			
			};

			this.onExit = function () { };

			controllerValidator.validate(this, $scope);

		}]);

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

	.controller('DetailsNotiziaController', ['$mdDialog', '$scope', '$state', '$stateParams','$timeout',
		'AuthLevel', 'entitiesRest', 'controllerValidator',
		'notificationManager', "$filter", 'loggers', 'conf','StringMap','AuthenticationService', '$translate',
		function ($mdDialog, $scope, $state, $stateParams, $timeout,
			AuthLevel, entitiesRest, controllerValidator,
			notificationManager, $filter, loggers, conf,StringMap,AuthenticationService, $translate) {
			'use strict';

			
			var Notizia = entitiesRest.getEntity('Notizia');
			$scope.notiziaDetails = {};
			//$scope.dtInizio= new Date($scope.notiziaDetails.dataPubblicazioneInizio);
			$scope.dtInizio= $filter('date')(Date.parse($scope.notiziaDetails.dataPubblicazioneInizio), 'yyyy-MM-dd');
			$scope.dtFine= new Date($scope.notiziaDetails.dataPubblicazioneFine);
		
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
				change: function () {
					$state.go('app.modificaNotizia',{
						idNotizia: $scope.idNotizia,
					});
				},

				refresh: getNotizia,


				delete: function (event) {
					var confirm = $mdDialog
						.confirm()
						.title("Confermi la cancellazione di notizie ?")
						.textContent("la cancellazione è definitiva .")
						.targetEvent(event)
						.ok("SI")
						.cancel("NO");
					$mdDialog.show(confirm).then(function () {
						
							Notizia.delete({ id: $scope.idNotizia  }, function (data) {
								console.log("success", data);
								notificationManager.showSuccessPopup('La notizia è stato eliminato correttamente');
								
								window.history.back();
           						$scope.status.loaded = true;
							}, function (onfail) {
								console.error("deleteError", onfail);

								if (onfail.body) {
									if (onfail.body.data && onfail.body.data.message) {
										notificationManager.showErrorPopup('Si è verificato un errore durante l\'eliminazione dell\'notizia: ' + onfail.body.data.message);
									} else {
										notificationManager.showErrorPopup('Si è verificato un errore durante l\'eliminazione dell\'notizia!');
									}
								} else {
									notificationManager.showErrorPopup('Si è verificato un errore durante l\'eliminazione dell\'notizia!');
								}
							});
					
					});
				}
			}

			

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
							notificationManager.showErrorPopup('Si è verificato un errore durante il caricamento della notizia: ' + onfail.body.data.message);
						} else {
							notificationManager.showErrorPopup('Si è verificato un errore durante il caricamento della notizia!');
						}
					} else {
						notificationManager.showErrorPopup('Si è verificato un errore durante il caricamento della notizia!');
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

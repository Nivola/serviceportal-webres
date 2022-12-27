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

angular.module('app')

	.controller('DialogAssociaWbs', ['$mdDialog', '$scope', 'entitiesRest','$state', '$filter', 'idAccount',
		'controllerValidator', 'notificationManager', 'loggers', '$translate', 
		
		function ($mdDialog, $scope, entitiesRest,$state, $filter, idAccount,
			controllerValidator, notificationManager, loggers,  $translate
			) {
			'use strict';

			var logger = loggers.get("DialogAssociaWbs");

			$scope.selected = [];
			$scope.errMessage = '';
			$scope.idAccount = idAccount
		
			$scope.isSelected= false; 
			var listWBS = entitiesRest.getEntity('ElencoWbs');
			var AssociaWbs = entitiesRest.getEntity('AssociaWbs');
			$scope.FlavourSelected = null; 

			$scope.iconStyle = {
				"color": "#4285f4",
			}

			$scope.options = {
				rowSelection: true,
				multiSelect: false,
				autoSelect: true,
				decapitate: false,
				largeEditDialog: false,
				boundaryLinks: false,
				limitSelect: false,
				pageSelect: false
			};

			$scope.wbs = {
				dataInizio : null,
				dataFine : null ,
				percentuale: null
			};

			const currentYear = new Date().getFullYear();

			function getFirstDayOfYear(year) {
				return new Date(year, 0, 1);
			}


			function getLastDayOfYear(year) {
				return new Date(year, 11, 31);
			}

			$scope.wbs.dataInizio= getFirstDayOfYear(currentYear);
			$scope.wbs.dataFine= getLastDayOfYear(currentYear);

			$scope.limitOptions = [ 10, 20, 30];

            $scope.filter = {
                options: {
                    debounce: 500
                }
            };

            $scope.query = {
                order: "committente",
                limit: 10,
                page: 1
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

			$scope.filter = {
                options: {
                    debounce: 500
                }
            };

		
		
			
			$scope.onDeselect = function(){
				$scope.isSelected=false;
			}

			$scope.criteriaMatch = function() {
				// il filtro adesso scarta dalla lista il record che ha lo stesso type del flavour attualmente montato sulla VM 
				return function( v ) {
				  return v.item.nome !== $scope.vmDetails.instanceType;
				};
			  };

		
			

			
			
			function getElencoWbs() {
				var queryString = {};
				if ($scope.accountUuid) {
					queryString.accountUuid = $scope.accountUuid;
				}
				$scope.promise = listWBS.query(queryString).$promise;
	
				return $scope.promise.then(function (data) {

					logger.info("SUCCESS", data);
					$scope.elencoWbsSistema = data; 

				}, function (onfail) {
					logger.error("ERROR", onfail);
					if (onfail.data) {
						notificationManager.showErrorPopup($translate.instant('accounts.wbs.erroreLista') + ': ' + onfail.data.message);
					} else {
						notificationManager.showErrorPopup($translate.instant('accounts.wbs.erroreLista'));
					}
				});
			};


		$scope.checkErr = function(startDate,endDate) {
			$scope.errMessage = ''
			var curDate = new Date();
			
			if(new Date(startDate) > new Date(endDate)){
			  $scope.errMessage = 'End Date should be greater than start date';
			  return false;
			}
		};




			
			$scope.submit = function confirm() {
				

				var toSend ={
					dataFineAssociazione : $scope.wbs.dataFine,
					dataInizioAssociazione : $scope.wbs.dataInizio,
					ewbsPerc : $scope.wbs.percentuale/100,
					refAccount : $scope.idAccount,
					ewbs : $scope.selected[0].ewbs,
				}
				 
			
				AssociaWbs.save(toSend, function (data) {
					logger.info('SUCCESS', data);
					notificationManager.showSuccessPopup($translate.instant('accounts.wbs.association_success'));
					// LG 25.04.2019 Al termine della creazione si ritorna alla lista delle VM
					$mdDialog.hide();
					//$state.go('app.vm');
					
				}, function (onfail) {
					logger.error('ERROR', onfail);
					if (onfail.data) {
						notificationManager.showErrorPopup($translate.instant('accounts.wbs.association_error') + ': ' + onfail.data.message);
					} else {
						notificationManager.showErrorPopup($translate.instant('accounts.wbs.association_error'));
					}
				}).$promise.finally(function () {
					//$scope.status.pending = false;
					$mdDialog.hide(); 
				});
			};


			
			$scope.hide = function() {
				$scope.isSelected=false; 
				$mdDialog.hide();
			};

			$scope.cancel = function() {
				$scope.isSelected=false; 
				$mdDialog.cancel();
			};
		

			
			
			this.onInit = function () {
				getElencoWbs(); 
		
			}

			this.onExit = function () { };

			controllerValidator.validate(this, $scope);
		}]);

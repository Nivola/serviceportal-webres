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

angular.module('app').controller('FormCSVController', [
	'$rootScope', '$scope', '$state', '$stateParams',
	'controllerValidator', 'loggers', 'notificationManager', 'entitiesRest', 'AuthLevel', '$translate',
	function (
		$rootScope, $scope, $state, $stateParams,
		controllerValidator, loggers, notificationManager, entitiesRest, AuthLevel, $translate
	) {
		'use strict';

		var logger = loggers.get("FormCSVController");
		var ReportCSV = entitiesRest.getEntity('RendicontoCsvTotali');
		var RendicontoCsvWbs = entitiesRest.getEntity('RendicontoCsvWbs');

		$scope.csv = {
			dataDa: null,
			dataA: null,
			tipo: null,
			colonne: null
		};
		$scope.isLogged = false;
		$scope.isObjectFixed = false;
		$scope.isBodyFixed = false;
		

		$scope.actions = {
			invia: function () {
				if(!$scope.csv.dataA || !$scope.csv.dataDa || $scope.csv.dataDa===null || $scope.csv.dataA===null){
					notificationManager.showErrorPopup($translate.instant('report.error_selezione'));
					return; 
				}
				
				var queryString = {};
				var mese = $scope.csv.dataDa.getMonth();
				mese = mese + 1;
				mese = mese + '';
				mese = mese.padStart(2, '0');
				var giorno = ''+ $scope.csv.dataDa.getDate();
				giorno = giorno.padStart(2,0);
				queryString.dataInizio = $scope.csv.dataDa.getFullYear() +'-'+ mese + '-'+ giorno;

				mese = $scope.csv.dataA.getMonth();
				mese = mese + 1;
				mese = '' + mese;
				mese = mese.padStart(2, '0');
				var giorno = ''+ $scope.csv.dataA.getDate();
				giorno = giorno.padStart(2,0);

				queryString.dataFine = $scope.csv.dataA.getFullYear() +'-'+ mese + '-'+ giorno;
				queryString.dataFine = $scope.csv.dataA.getFullYear() +'-'+ mese + '-'+ giorno;
				queryString.tipo = $scope.csv.colonne;

				if ($scope.csv.tipo == 'tot')
					$scope.promise = ReportCSV.query(queryString).$promise;
				else
					$scope.promise = RendicontoCsvWbs.query(queryString).$promise;
					
				$scope.promise.then(function (data) {
					//lo trasformo in arrayBuffer
					 var binary_string =  window.atob(data.report);
					 let filename = data.nomeFile;
					 var len = binary_string.length;
					 var bytes = new Uint8Array( len );
					 for (var i = 0; i < len; i++)        {
						 bytes[i] = binary_string.charCodeAt(i);
					 }
		 
					 if (window.navigator.msSaveBlob) { // IE 10+
						 let currentBlob = new Blob([bytes.buffer], {type: 'text/csv'});
						 window.navigator.msSaveOrOpenBlob(currentBlob, filename);
					 } else {
						 try {
							 var link = document.createElement('a'); //create link download file
							 let currentBlob = new Blob([bytes.buffer], {type: 'text/csv'});
							 link.href = window.URL.createObjectURL(currentBlob); // set url for link download
							 link.setAttribute('download', filename); //set attribute for link created
							 document.body.appendChild(link);
							 link.click();
							 document.body.removeChild(link);
						 } catch (ex) {
							 console.log(ex);
							 notificationManager.showErrorPopup($translate.instant("error.download_file"));
						 }
					 }
				 }, function (onfail) {
					 notificationManager.showErrorPopup($translate.instant("error.loading_consumi_non_rendicontati"));
				 });
			}
		};

		function clearField() {
			
		}

		this.onInit = function () {
			clearField();
		};

		this.onExit = function () { };

		controllerValidator.validate(this, $scope);
	}]);

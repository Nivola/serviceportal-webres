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

	.controller('DialogConnectDbaasController', ['$mdDialog', '$scope', '$http','conf','entitiesRest',
		'controllerValidator', 'notificationManager', 'loggers',
		'vmSelected',
		function ($mdDialog, $scope,$http,conf, entitiesRest,
			controllerValidator, notificationManager, loggers,
			vmSelected) {

				var logger = loggers.get("DialogConnectDbaasController");

				// var Vm = entitiesRest.getEntity('Vm');
	
				if (vmSelected.length !== 1) {
					notificationManager.showErrorPopup('Selezionare una sola istanza DBASS');
					$mdDialog.hide();
					return;
				}
				$scope.urlPhpPgAdmin = conf.location.urlPhpPgAdmin;
				$scope.urlAdminer = conf.location.urlAdminer;
				$scope.urlPhpMyAdmin = conf.location.urlPhpMyAdmin;
				$scope.vmDetails = vmSelected[0];
				$scope.isRunning = $scope.vmDetails.status === 'running';
	
				$scope.iconStyle = {
					"color": "#4285f4",
				}

				$scope.redirectToPHP = function() {
					var tabWindowIdPhp = window.open('about:blank', '_blank');

					var form = '<form id="formPhpMyAdmin" action="' + $scope.urlPhpMyAdmin + '" method="post">' +
					'<input type="hidden" name="nivola_host_name" value="' + getFQDN() + '"></input>' + '</form>';
					tabWindowIdPhp.document.write(form);
					var phpForm = angular.element(tabWindowIdPhp.document.getElementById("formPhpMyAdmin"));
					phpForm.submit();
				}

				
				$scope.redirectToPHPPG = function() {
					var tabWindowIdPhpPg = window.open('about:blank', '_blank');

					var form = '<form id="formPhpPgMyAdmin" action="' + $scope.urlPhpPgAdmin + '" method="post">' +
					'<input type="hidden" name="nivola_host_name" value="' + getFQDN() + '"></input>' + '</form>';
					tabWindowIdPhpPg.document.write(form);
					var phpForm = angular.element(tabWindowIdPhpPg.document.getElementById("formPhpPgMyAdmin"));
					phpForm.submit();
				}

				$scope.redirectToADMINER= function(nsType) {
					var tabWindowIdPhpPg = window.open('about:blank', '_blank');

					var form = '<form id="formAdminer" action="' + $scope.urlAdminer + '" method="post">' +
					'<input type="hidden" name="server" value="' + getFQDN() + '"></input>' + 
					'<input type="hidden" name="ns" value="'+nsType+'"></input>' +'</form>';
					tabWindowIdPhpPg.document.write(form);
					var phpForm = angular.element(tabWindowIdPhpPg.document.getElementById("formAdminer"));
					phpForm.submit();
				}


				function getFQDN () {
					var istanza = $scope.vmDetails;
					if (istanza.fqdn) {
						return istanza.fqdn;
					} else {
						var fqdn = istanza.nome.toLowerCase();
						switch (istanza.az) {
							case "SiteTorino01":
								fqdn = fqdn + ".site01";
								break;
							case "SiteTorino02":
								fqdn = fqdn + ".site02";
								break;
							case "SiteVercelli01":
								fqdn = fqdn + ".site03";
								break;
							default:
								fqdn = fqdn + '.' + istanza.az;
								break;
						}
						fqdn = fqdn + '.nivolapiemonte.it'
						return fqdn;
					}
	
				};
			$scope.closeDialog = function () {
				$mdDialog.hide();
			};

		}]);

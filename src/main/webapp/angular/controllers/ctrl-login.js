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

angular.module('app').controller('controllerSelezionaRuolo', [
	'$log', '$rootScope', '$scope', '$state', 'loggers', '$q', 'conf', 'operations', 'notificationManager', 'AuthenticationService',
function (
	$log, $rootScope, $scope, $state, loggers, $q, conf, operations, notificationManager, AuthenticationService
){
		var logger = loggers.get("controller");
		/* 
		 * VIEW MODEL
	     */
	    $scope.vm = {
			username : null,
			password : null,
			provider : null
	    };

	    /* 
	     * STATUS MODEL
	     */
	    $scope.status = {
	    	anyPending : false
	    };
	    
	    /* 
	     * ACTION MODEL
	     */
	    $scope.actions = {
	    	doSelectProvider : null,
	    	logout : null
	    };
    /* 
     * LIFECYCLE CALLBACKS
     */
    this.onInit = function() {
    };
    
    this.onExit = function() {
    };
    
    /* 
     * IMPLEMENTATIONS
     */
	

//	operationQueue.watch($scope, $scope.status, 'anyPending', [ operations.caricamento ]);
    
	
	$scope.actions.doSelectProvider = function(provider) {
		if (provider == "SHIBB-CSI") {
			window.location.href = conf.location.urlShibbCsi;
		}
		if (provider == "SHIBB-WRUP") {
			window.location.href = conf.location.urlShibbRupar;
		}
		if (provider == "SHIBB-SISP") {
			window.location.href = conf.location.urlShibbSisp;
		}
		if (provider == "SPID") {
			window.location.href = conf.location.urlSpid;
		}
		
		$scope.hideIntestazione = false;
		
		$state.go("app.login.provider", {
			idProvider : provider
		}, {
			reload: true
		});
	};
	
	$scope.actions.logout = function() {
		window.location.href = AuthenticationService.doSessionLogout();
    }
}]);

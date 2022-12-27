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
'use strict';

angular.module('app').service('AccountRestClient',	['$q', 'RestClientFactory', function($q, RestClientFactory) {

	var domain = '/api/account';
	var restClient = newRestClientFactory();
	
	/**
    * getAccount
    * @method
    * @name #getAccountUsingGET
    * @param {object} parameters - method options and parameters
  */
  this.getAccountUsingGET = function(parameters) {
		return restClient.requestGetAll(parameters);
	};

	/**
    * saveAccount
    * @method
    * @name RestClientFactory#saveAccountUsingPOST
    * @param {object} parameters - method options and parameters
    * @param {} parameters.userDto - userDTO
    */
  this.saveAccountUsingPOST = function(parameters) {
	 	return restClient.requestPost(parameters, 'userDto');
  };

  /**
    * changePassword
    * @method
    * @name RestClientFactory#changePasswordUsingPOST
    * @param {object} parameters - method options and parameters
    * @param {} parameters.password - password
    */
  this.changePasswordUsingPOST = function(parameters) {
		var options = { headers: { 'Accept': 'text/plain', 'Content-Type': 'application/json' }, path: '/change_password' };
		return restClient.requestPost(parameters, 'password', options);
	};
	
  /**
    * finishPasswordReset
  	* @method
    * @name RestClientFactory#finishPasswordResetUsingPOST
    * @param {object} parameters - method options and parameters
    * @param {} parameters.keyAndPassword - keyAndPassword
    */
  this.finishPasswordResetUsingPOST = function(parameters) {
		var options = { headers: { 'Accept': 'text/plain', 'Content-Type': 'application/json' }, path: '/reset_password/finish' };
		restClient.requestPost(parameters, 'keyAndPassword', options);
    return deferred.promise;
	};
	
	/**
    * requestPasswordReset
    * @method
    * @name RestClientFactory#requestPasswordResetUsingPOST
    * @param {object} parameters - method options and parameters
    * @param {} parameters.mail - mail
    */
  this.requestPasswordResetUsingPOST = function(parameters) {
    var options = { headers: { 'Accept': 'text/plain', 'Content-Type': 'application/json' }, path: '/reset_password/init' };
		restClient.requestPost(parameters, 'mail', options);
    return deferred.promise;
  };

	/**
    * getCurrentSessions
    * @method
    * @name RestClientFactory#getCurrentSessionsUsingGET
    * @param {object} parameters - method options and parameters
    */
  this.getCurrentSessionsUsingGET = function(parameters) {
		var options = { path: "/sessions" };
		restClient.requestGetAll(parameters, 'mail', options);
		return deferred.promise;
	};
	
  /**
    * invalidateSession
    * @method
    * @name RestClientFactory#invalidateSessionUsingDELETE
    * @param {object} parameters - method options and parameters
    * @param {string} parameters.series - series
    */
	this.invalidateSessionUsingDELETE = function(parameters) {
		var options = { nameId: "series", path: "/sessions" };
    return restClient.requestDelete(parameters, options);
  };

	function newRestClientFactory() {
		var rc = new RestClientFactory(domain);
		rc.instanceConfiguration = {instanceId : 1,	builtFrom : "RestClientFactoryInstanceBuilder"};
		return rc;
	};

}]);

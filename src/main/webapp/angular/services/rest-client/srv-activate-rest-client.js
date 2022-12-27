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

angular.module('app').service('ActivateRestClient',	['$q', 'RestClientFactory', function($q, RestClientFactory) {

	var domain = '/api/activate';
	var restClient = newRestClientFactory();

  /**
    * activateAccount
    * @method
    * @name RestClientFactory#activateAccountUsingGET
    * @param {object} parameters - method options and parameters
    * @param {string} parameters.key - key
    */
  this.activateAccountUsingGET = function(parameters) {
    if (parameters === undefined) {
      parameters = {};
    }
    var body = {};
		var headers = {'Accept' : '*/*', 'Content-Type' : 'application/json'};
		var queryParameters = {};		
		var form = {};
		var deferred = $q.defer();
    if (parameters["key"] !== undefined) {
      queryParameters["key"] = parameters["key"];
    } else {
      deferred.reject(new Error("Missing required  parameter: key"));
      return deferred.promise;
    }
    restClient.request('GET', '', parameters, body, headers, queryParameters, form, deferred);
    return deferred.promise;
  };


	function newRestClientFactory() {
		var rc = new RestClientFactory(domain);
    rc.instanceConfiguration = {instanceId : 1,	builtFrom : "RestClientFactoryInstanceBuilder"};
    return rc;
	};

}]);

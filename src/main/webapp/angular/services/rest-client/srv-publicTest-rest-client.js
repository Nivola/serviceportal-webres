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

nivolaApp.service('PublicTestRestClient',	['$q', 'RestClientFactory', function($q, RestClientFactory) {

	var domain = '/api/public/test';
	var restClient = newRestClientFactory();

  /**
    * getServicesStatus
    * @method
    * @name RestClientFactory#getServicesStatusUsingGET
    * @param {object} parameters - method options and parameters
    */
  this.getServicesStatusUsingGET = function(parameters) {
    var headers = {'Accept' : '*/*', 'Content-Type' : 'application/json'};
    var deferred = $q.defer();
    restClient.request('GET', '-all', parameters, {}, headers, {}, {}, deferred);
    return deferred.promise;
  };

  /**
   * testDataToken
   * @method
   * @name RestClientFactory#testDataTokenUsingGET
   * @param {object} parameters - method options and parameters
   */
  this.testDataTokenUsingGET = function(parameters) {
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
    restClient.request('GET', '/data-token', parameters, body, headers, queryParameters, form, deferred);
    return deferred.promise;
  };

  /**
   * testLog
   * @method
   * @name RestClientFactory#testLogUsingGET
   * @param {object} parameters - method options and parameters
   */
  this.testLogUsingGET = function(parameters) {
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
    restClient.request('GET', '/log', parameters, body, headers, queryParameters, form, deferred);
    return deferred.promise;
  };
  

	function newRestClientFactory() {
		var rc = new RestClientFactory(domain);
    rc.instanceConfiguration = {instanceId : 1,	builtFrom : "RestClientFactoryInstanceBuilder"};
    return rc;
	};

}]);

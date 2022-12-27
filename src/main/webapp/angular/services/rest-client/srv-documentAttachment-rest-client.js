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

angular.module('app').service('DocumentAttachmentRestClient',	['$q', 'RestClientFactory', function($q, RestClientFactory) {

	var domain = '/api/document-attachment';
	var restClient = newRestClientFactory();

  /**
    * getDocumentAttachment
    * @method
    * @name RestClientFactory#getDocumentAttachmentUsingGET
    * @param {object} parameters - method options and parameters
    * @param {integer} parameters.id - id
    */
  this.getDocumentAttachmentUsingGET = function(parameters) {
    if (parameters === undefined) {
      parameters = {};
    }
    var deferred = $q.defer();
    if (parameters["id"] === undefined) {
      deferred.reject(new Error("Missing required  parameter: id"));
      return deferred.promise;
    }
    var path = '/' + parameters["id"];
    var body = {};
    var headers = {'Accept' : 'application/octet-stream', 'Content-Type' : 'application/json'};
    var queryParameters = {};		
    var form = {};
    if (parameters["key"] !== undefined) {
      queryParameters["key"] = parameters["key"];
    } else {
      deferred.reject(new Error("Missing required  parameter: key"));
      return deferred.promise;
    }
    restClient.request('GET', path, parameters, body, headers, queryParameters, form, deferred);
    return deferred.promise;
  };


	function newRestClientFactory() {
		var rc = new RestClientFactory(domain);
    rc.instanceConfiguration = {instanceId : 1,	builtFrom : "RestClientFactoryInstanceBuilder"};
    return rc;
	};

}]);

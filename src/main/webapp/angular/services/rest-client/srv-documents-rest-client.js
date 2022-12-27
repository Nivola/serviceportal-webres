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

angular.module('app').service('DocumentsRestClient',	['$q', 'RestClientFactory', function($q, RestClientFactory) {

	var domain = '/api/documents';
	var restClient = newRestClientFactory();

  /**
    * getAllDocuments
    * @method
    * @name RestClientFactory#getAllDocumentsUsingGET
    * @param {object} parameters - method options and parameters
    * @param {integer} parameters.page - Page number of the requested page
    * @param {integer} parameters.size - Size of a page
    * @param {array} parameters.sort - Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
    */
  this.getAllDocumentsUsingGET = function(parameters) {
    return restClient.requestGetAll(parameters);
  };

  /**
    * createDocument
    * @method
    * @name RestClientFactory#createDocumentUsingPOST
    * @param {object} parameters - method options and parameters
    * @param {} parameters.documentDto - documentDTO
    */
  this.createDocumentUsingPOST = function(parameters) {
    return restClient.requestPost(parameters, 'documentDto');
  };

  /**
    * updateDocument
    * @method
    * @name RestClientFactory#updateDocumentUsingPUT
    * @param {object} parameters - method options and parameters
    * @param {} parameters.documentDto - documentDTO
    */
  this.updateDocumentUsingPUT = function(parameters) {
    return restClient.requestPut(parameters, 'documentDto');
  };

  /**
    * getDocument
    * @method
    * @name RestClientFactory#getDocumentUsingGET
    * @param {object} parameters - method options and parameters
    * @param {integer} parameters.id - id
    */
  this.getDocumentUsingGET = function(parameters) {
    return restClient.requestGetOne(parameters);
  };

  /**
    * deleteDocument
    * @method
    * @name RestClientFactory#deleteDocumentUsingDELETE
    * @param {object} parameters - method options and parameters
    * @param {integer} parameters.id - id
    */
  this.deleteDocumentUsingDELETE = function(parameters) {
    return restClient.requestDelete(parameters);
  };


	function newRestClientFactory() {
		var rc = new RestClientFactory(domain);
    rc.instanceConfiguration = {instanceId : 1,	builtFrom : "RestClientFactoryInstanceBuilder"};
    return rc;
	};

}]);

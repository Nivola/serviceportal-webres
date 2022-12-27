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

angular.module('app').service('MyDocumentsRestClient',	['$q', 'RestClientFactory', function($q, RestClientFactory) {

	var domain = '/api/my-documents';
  var restClient = newRestClientFactory();
  
  /**
    * getAllMyDocuments
    * @method
    * @name RestClientFactory#getAllMyDocumentsUsingGET
    * @param {object} parameters - method options and parameters
    * @param {integer} parameters.page - Page number of the requested page
    * @param {integer} parameters.size - Size of a page
    * @param {array} parameters.sort - Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
    */
  this.getAllMyDocumentsUsingGET = function(parameters) {
    return restClient.requestGetAll(parameters);
  };


	function newRestClientFactory() {
		var rc = new RestClientFactory(domain);
    rc.instanceConfiguration = {instanceId : 1,	builtFrom : "RestClientFactoryInstanceBuilder"};
    return rc;
	};

}]);

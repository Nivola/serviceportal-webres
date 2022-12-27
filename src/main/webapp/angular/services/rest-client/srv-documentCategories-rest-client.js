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

angular.module('app').service('DocumentCategoriesRestClient',	['$q', 'RestClientFactory', function($q, RestClientFactory) {

	var domain = '/api/document-categories';
	var restClient = newRestClientFactory();

  /**
    * getAllDocumentCategories
    * @method
    * @name RestClientFactory#getAllDocumentCategoriesUsingGET
    * @param {object} parameters - method options and parameters
    * @param {integer} parameters.page - Page number of the requested page
    * @param {integer} parameters.size - Size of a page
    * @param {array} parameters.sort - Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
    */
  this.getAllDocumentCategoriesUsingGET = function(parameters) {
    return restClient.requestGetAll(parameters);
  };

  /**
    * createDocumentCategory
    * @method
    * @name RestClientFactory#createDocumentCategoryUsingPOST
    * @param {object} parameters - method options and parameters
    * @param {} parameters.documentCategoryDto - documentCategoryDTO
    */
  this.createDocumentCategoryUsingPOST = function(parameters) {
    return restClient.requestPost(parameters, 'documentCategoryDto');
  };

  /**
    * updateDocumentCategory
    * @method
    * @name RestClientFactory#updateDocumentCategoryUsingPUT
    * @param {object} parameters - method options and parameters
    * @param {} parameters.documentCategoryDto - documentCategoryDTO
    */
  this.updateDocumentCategoryUsingPUT = function(parameters) {
    return restClient.requestPut(parameters, 'documentCategoryDto');
  };

  /**
    * getDocumentCategory
    * @method
    * @name RestClientFactory#getDocumentCategoryUsingGET
    * @param {object} parameters - method options and parameters
    * @param {integer} parameters.id - id
    */
  this.getDocumentCategoryUsingGET = function(parameters) {
    return restClient.requestGetOne(parameters);
  };

  /**
    * deleteDocumentCategory
    * @method
    * @name RestClientFactory#deleteDocumentCategoryUsingDELETE
    * @param {object} parameters - method options and parameters
    * @param {integer} parameters.id - id
    */
    this.deleteDocumentCategoryUsingDELETE = function(parameters) {
      return restClient.requestDelete(parameters);
    };


	function newRestClientFactory() {
		var rc = new RestClientFactory(domain);
    rc.instanceConfiguration = {instanceId : 1,	builtFrom : "RestClientFactoryInstanceBuilder"};
    return rc;
	};

}]);

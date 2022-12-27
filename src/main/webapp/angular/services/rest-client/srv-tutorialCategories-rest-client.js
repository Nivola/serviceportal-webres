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

angular.module('app').service('TutorialCategoriesRestClient',	['$q', 'RestClientFactory', function($q, RestClientFactory) {

	var domain = '/api/tutorial-categories';
	var restClient = newRestClientFactory();



      /**
     * getAllTutorialCategories
     * @method
     * @name RestClientFactory#getAllTutorialCategoriesUsingGET
     * @param {object} parameters - method options and parameters
     * @param {integer} parameters.page - Page number of the requested page
     * @param {integer} parameters.size - Size of a page
     * @param {array} parameters.sort - Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
     */
    this.getAllTutorialCategoriesUsingGET = function(parameters) {
      return restClient.requestGetAll(parameters);
  };

  /**
    * createTutorialCategory
    * @method
    * @name RestClientFactory#createTutorialCategoryUsingPOST
    * @param {object} parameters - method options and parameters
    * @param {} parameters.tutorialCategoryDto - tutorialCategoryDTO
    */
  this.createTutorialCategoryUsingPOST = function(parameters) {
    return restClient.requestPost(parameters, 'tutorialCategoryDto');
  };

  /**
    * updateTutorialCategory
    * @method
    * @name RestClientFactory#updateTutorialCategoryUsingPUT
    * @param {object} parameters - method options and parameters
    * @param {} parameters.tutorialCategoryDto - tutorialCategoryDTO
    */
  this.updateTutorialCategoryUsingPUT = function(parameters) {
    return restClient.requestPut(parameters, 'tutorialCategoryDto');
  };

  /**
    * getTutorialCategory
    * @method
    * @name RestClientFactory#getTutorialCategoryUsingGET
    * @param {object} parameters - method options and parameters
    * @param {integer} parameters.id - id
    */
    this.getTutorialCategoryUsingGET = function(parameters) {
      return restClient.requestGetOne(parameters);
    };

    /**
     * deleteTutorialCategory
     * @method
     * @name RestClientFactory#deleteTutorialCategoryUsingDELETE
     * @param {object} parameters - method options and parameters
     * @param {integer} parameters.id - id
     */
    this.deleteTutorialCategoryUsingDELETE = function(parameters) {
      return restClient.requestDelete(parameters);
    };

    
	function newRestClientFactory() {
		var rc = new RestClientFactory(domain);
    rc.instanceConfiguration = {instanceId : 1,	builtFrom : "RestClientFactoryInstanceBuilder"};
    return rc;
	};

}]);

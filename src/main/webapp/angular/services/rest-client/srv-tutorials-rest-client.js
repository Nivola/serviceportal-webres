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

angular.module('app').service('TutorialsRestClient',	['$q', 'RestClientFactory', function($q, RestClientFactory) {

	var domain = '/api/tutorials';
	var restClient = newRestClientFactory();

  /**
    * getAllTutorials
    * @method
    * @name RestClientFactory#getAllTutorialsUsingGET
    * @param {object} parameters - method options and parameters
    * @param {integer} parameters.page - Page number of the requested page
    * @param {integer} parameters.size - Size of a page
    * @param {array} parameters.sort - Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
    */
  this.getAllTutorialsUsingGET = function(parameters) {
    return restClient.requestGetAll(parameters);
  };

  /**
    * createTutorial
    * @method
    * @name RestClientFactory#createTutorialUsingPOST
    * @param {object} parameters - method options and parameters
    * @param {} parameters.tutorialDto - tutorialDTO
    */
  this.createTutorialUsingPOST = function(parameters) {
    return restClient.requestPost(parameters, 'tutorialDto');
  };

  /**
    * updateTutorial
    * @method
    * @name RestClientFactory#updateTutorialUsingPUT
    * @param {object} parameters - method options and parameters
    * @param {} parameters.tutorialDto - tutorialDTO
    */
  this.updateTutorialUsingPUT = function(parameters) {
    return restClient.requestPut(parameters, 'tutorialDto');
  };

  /**
    * getTutorial
    * @method
    * @name RestClientFactory#getTutorialUsingGET
    * @param {object} parameters - method options and parameters
    * @param {integer} parameters.id - id
    */
  this.getTutorialUsingGET = function(parameters) {
    return restClient.requestGetOne(parameters);
  };

  /**
    * deleteTutorial
    * @method
    * @name RestClientFactory#deleteTutorialUsingDELETE
    * @param {object} parameters - method options and parameters
    * @param {integer} parameters.id - id
    */
  this.deleteTutorialUsingDELETE = function(parameters) {
    return restClient.requestDelete(parameters);
  };


	function newRestClientFactory() {
		var rc = new RestClientFactory(domain);
    rc.instanceConfiguration = {instanceId : 1,	builtFrom : "RestClientFactoryInstanceBuilder"};
    return rc;
	};

}]);

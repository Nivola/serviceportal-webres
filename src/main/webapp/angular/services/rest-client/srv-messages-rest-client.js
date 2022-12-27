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

angular.module('app').service('MessagesRestClient',	['$q', 'RestClientFactory', function($q, RestClientFactory) {

	var domain = '/api/news';
	var restClient = newRestClientFactory();

  /**
    * getAllMessages
    * @method
    * @name RestClientFactory#getAllMessagesUsingGET
    * @param {object} parameters - method options and parameters
    * @param {integer} parameters.page - Page number of the requested page
    * @param {integer} parameters.size - Size of a page
    * @param {array} parameters.sort - Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
    */
  this.getAllMessagesUsingGET = function(parameters) {
    return restClient.requestGetAll(parameters);
  };

  /**
    * createMessage
    * @method
    * @name RestClientFactory#createMessageUsingPOST
    * @param {object} parameters - method options and parameters
    * @param {} parameters.messageDto - messageDTO
    */
  this.createMessageUsingPOST = function(parameters) {
    return restClient.requestPost(parameters, 'messageDto');
  };

  /**
    * updateMessage
    * @method
    * @name RestClientFactory#updateMessageUsingPUT
    * @param {object} parameters - method options and parameters
    * @param {} parameters.messageDto - messageDTO
    */
  this.updateMessageUsingPUT = function(parameters) {
    return restClient.requestPut(parameters, 'messageDto');
  };

  /**
    * getMessage
    * @method
    * @name RestClientFactory#getMessageUsingGET
    * @param {object} parameters - method options and parameters
    * @param {integer} parameters.id - id
    */
  this.getMessageUsingGET = function(parameters) {
    return restClient.requestGetOne(parameters);
  };

  /**
    * deleteMessage
    * @method
    * @name RestClientFactory#deleteMessageUsingDELETE
    * @param {object} parameters - method options and parameters
    * @param {integer} parameters.id - id
    */
  this.deleteMessageUsingDELETE = function(parameters) {
    return restClient.requestDelete(parameters);
  };

  
	function newRestClientFactory() {
		var rc = new RestClientFactory(domain);
    rc.instanceConfiguration = {instanceId : 1,	builtFrom : "RestClientFactoryInstanceBuilder"};
    return rc;
	};

}]);

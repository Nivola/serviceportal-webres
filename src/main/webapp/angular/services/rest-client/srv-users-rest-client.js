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

angular.module('app').service('UsersRestClient',	['$q', 'RestClientFactory', function($q, RestClientFactory) {

	var domain = '/api/users';
	var restClient = newRestClientFactory();

  /**
    * getAllUsers
    * @method
    * @name RestClientFactory#getAllUsersUsingGET
    * @param {object} parameters - method options and parameters
    * @param {integer} parameters.page - Page number of the requested page
    * @param {integer} parameters.size - Size of a page
    * @param {array} parameters.sort - Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
    */
  this.getAllUsersUsingGET = function(parameters) {
    return restClient.requestGetAll(parameters);
  };

  /**
    * createUser
    * @method
    * @name RestClientFactory#createUserUsingPOST
    * @param {object} parameters - method options and parameters
    * @param {} parameters.managedUserVm - managedUserVM
    */
  this.createUserUsingPOST = function(parameters) {
    return restClient.requestPost(parameters, 'managedUserVm');
  };

  /**
    * updateUser
    * @method
    * @name RestClientFactory#updateUserUsingPUT
    * @param {object} parameters - method options and parameters
    * @param {} parameters.managedUserVm - managedUserVM
    */
  this.updateUserUsingPUT = function(parameters) {
    return restClient.requestPut(parameters, 'managedUserVm');
  };

  /**
    * getUser
    * @method
    * @name RestClientFactory#getUserUsingGET
    * @param {object} parameters - method options and parameters
    * @param {string} parameters.login - login
    */
  this.getUserUsingGET = function(parameters) {
    return restClient.requestGetOne(parameters);
  };

  /**
    * deleteUser
    * @method
    * @name RestClientFactory#deleteUserUsingDELETE
    * @param {object} parameters - method options and parameters
    * @param {string} parameters.login - login
    */
  this.deleteUserUsingDELETE = function(parameters) {
    return restClient.requestDelete(parameters);
  };


  function newRestClientFactory() {
		var rc = new RestClientFactory(domain);
    rc.instanceConfiguration = {instanceId : 1,	builtFrom : "RestClientFactoryInstanceBuilder"};
    return rc;
	};

}]);

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

angular.module('app').service('RegisterRestClient',	['$q', 'RestClientFactory', function($q, RestClientFactory) {

	var domain = '/api/register';
	var restClient = newRestClientFactory();

  /**
    * registerAccount
    * @method
    * @name RestClientFactory#registerAccountUsingPOST
    * @param {object} parameters - method options and parameters
    * @param {} parameters.managedUserVm - managedUserVM
    */
  this.registerAccountUsingPOST = function(parameters) {
    var options = { headers: { 'Accept': 'application/json, text/plain', 'Content-Type': 'application/json' } };
    return restClient.requestPost(parameters, 'managedUserVm', options);
  };


	function newRestClientFactory() {
		var rc = new RestClientFactory(domain);
    rc.instanceConfiguration = {instanceId : 1,	builtFrom : "RestClientFactoryInstanceBuilder"};
    return rc;
	};

}]);

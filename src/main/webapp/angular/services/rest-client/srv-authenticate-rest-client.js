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

angular.module('app').service('AuthenticateRestClient',	['$q', 'RestClientFactory', function($q, RestClientFactory) {

	var domain = '/api/authenticate';
	var restClient = newRestClientFactory();

  /**
    * isAuthenticated
    * @method
    * @name RestClientFactory#isAuthenticatedUsingGET
    * @param {object} parameters - method options and parameters
    */
  this.isAuthenticatedUsingGET = function(parameters) {
    return restClient.requestGetAll(parameters);
  };


	function newRestClientFactory() {
		var rc = new RestClientFactory(domain);
    rc.instanceConfiguration = {instanceId : 1,	builtFrom : "RestClientFactoryInstanceBuilder"};
    return rc;
	};

}]);

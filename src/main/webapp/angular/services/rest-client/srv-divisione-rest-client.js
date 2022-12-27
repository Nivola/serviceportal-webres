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

angular.module('app').service('DivisioneRestClient', ['$q', 'RestClientFactory', function ($q, RestClientFactory) {

    var domain = '/api/divisione';
    var restClient = newRestClientFactory();

    /**
     * getAllDivisione
     * @method
     * @name RestClientFactory#getAllDivisioneUsingGET
     * @param {object} parameters - method options and parameters
     * @param {integer} parameters.page - Page number of the requested page
     * @param {integer} parameters.size - Size of a page
     * @param {array} parameters.sort - Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
     */
    this.getAllDivisioneUsingGET = function (parameters) {
        return restClient.requestGetAll(parameters);
    };

    /**
     * createDivisione
     * @method
     * @name RestClientFactory#createDivisioneUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.DivisioneDto - DivisioneDTO
     */
    this.createDivisioneUsingPOST = function (parameters) {
        return restClient.requestPost(parameters, 'DivisioneDto');
    };

    /**
      * updateDivisione
      * @method
      * @name RestClientFactory#updateDivisioneUsingPUT
      * @param {object} parameters - method options and parameters
      * @param {} parameters.DivisioneDto - DivisioneDTO
      */

    this.updateDivisioneUsingPUT = function (parameters) {
        return restClient.requestPut(parameters, 'DivisioneDto');
    };

    /**
      * getDivisione
      * @method
      * @name RestClientFactory#getDivisioneUsingGET
      * @param {object} parameters - method options and parameters
      * @param {integer} parameters.id - id
      */
    this.getDivisioneUsingGET = function (parameters) {
        return restClient.requestGetOne(parameters);
    };

    /**
      * deleteDivisione
      * @method
      * @name RestClientFactory#deleteDivisioneUsingDELETE
      * @param {object} parameters - method options and parameters
      * @param {integer} parameters.id - id
      */
    this.deleteDivisioneUsingDELETE = function (parameters) {
        return restClient.requestDelete(parameters);
    };

    function newRestClientFactory() {
        var rc = new RestClientFactory(domain);
        rc.instanceConfiguration = { instanceId: 1, builtFrom: "RestClientFactoryInstanceBuilder" };
        return rc;
    };

}]);

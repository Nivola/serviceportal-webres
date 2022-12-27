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

angular.module('app').service('OrganizzazioneRestClient', ['$q', 'RestClientFactory', function ($q, RestClientFactory) {

    var domain = '/api/organizzazione';
    var restClient = newRestClientFactory();

    /**
     * getAllOrganizzazione
     * @method
     * @name RestClientFactory#getAllOrganizzazioneUsingGET
     * @param {object} parameters - method options and parameters
     * @param {integer} parameters.page - Page number of the requested page
     * @param {integer} parameters.size - Size of a page
     * @param {array} parameters.sort - Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
     */
    this.getAllOrganizzazioneUsingGET = function (parameters) {
        return restClient.requestGetAll(parameters);
    };

    /**
     * createOrganizzazione
     * @method
     * @name RestClientFactory#createOrganizzazioneUsingPOST
     * @param {object} parameters - method options and parameters
     * @param {} parameters.OrganizzazioneDto - OrganizzazioneDTO
     */
    this.createOrganizzazioneUsingPOST = function (parameters) {
        return restClient.requestPost(parameters, 'OrganizzazioneDto');
    };

    /**
      * updateOrganizzazione
      * @method
      * @name RestClientFactory#updateOrganizzazioneUsingPUT
      * @param {object} parameters - method options and parameters
      * @param {} parameters.OrganizzazioneDto - OrganizzazioneDTO
      */

    this.updateOrganizzazioneUsingPUT = function (parameters) {
        return restClient.requestPut(parameters, 'OrganizzazioneDto');
    };

    /**
      * getOrganizzazione
      * @method
      * @name RestClientFactory#getOrganizzazioneUsingGET
      * @param {object} parameters - method options and parameters
      * @param {integer} parameters.id - id
      */
    this.getOrganizzazioneUsingGET = function (parameters) {
        return restClient.requestGetOne(parameters);
    };

    /**
      * deleteOrganizzazione
      * @method
      * @name RestClientFactory#deleteOrganizzazioneUsingDELETE
      * @param {object} parameters - method options and parameters
      * @param {integer} parameters.id - id
      */
    this.deleteOrganizzazioneUsingDELETE = function (parameters) {
        return restClient.requestDelete(parameters);
    };

    function newRestClientFactory() {
        var rc = new RestClientFactory(domain);
        rc.instanceConfiguration = { instanceId: 1, builtFrom: "RestClientFactoryInstanceBuilder" };
        return rc;
    };

}]);

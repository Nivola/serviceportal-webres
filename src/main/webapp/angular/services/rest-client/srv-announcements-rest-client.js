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

angular.module('app').service('AnnouncementsRestClient',	['$q', 'RestClientFactory', function($q, RestClientFactory) {

	var domain = '/api/announcements';
	var restClient = newRestClientFactory();

  /**
   * getAllAnnouncements
   * @method
   * @name RestClientFactory#getAllAnnouncementsUsingGET
   * @param {object} parameters - method options and parameters
   * @param {integer} parameters.page - Page number of the requested page
   * @param {integer} parameters.size - Size of a page
   * @param {array} parameters.sort - Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
   */
  this.getAllAnnouncementsUsingGET = function(parameters) {
    return restClient.requestGetAll(parameters);
  };
  
  /**
   * createAnnouncement
   * @method
   * @name RestClientFactory#createAnnouncementUsingPOST
   * @param {object} parameters - method options and parameters
   * @param {} parameters.announcementDto - announcementDTO
   */
  this.createAnnouncementUsingPOST = function(parameters) {
    return restClient.requestPost(parameters, 'announcementDto');
  };
  
  /**
    * updateAnnouncement
    * @method
    * @name RestClientFactory#updateAnnouncementUsingPUT
    * @param {object} parameters - method options and parameters
    * @param {} parameters.announcementDto - announcementDTO
    */

  this.updateAnnouncementUsingPUT = function(parameters) {
    return restClient.requestPut(parameters, 'announcementDto');
  };

  /**
    * getAnnouncement
    * @method
    * @name RestClientFactory#getAnnouncementUsingGET
    * @param {object} parameters - method options and parameters
    * @param {integer} parameters.id - id
    */
  this.getAnnouncementUsingGET = function(parameters) {
    return restClient.requestGetOne(parameters);
  };

  /**
    * deleteAnnouncement
    * @method
    * @name RestClientFactory#deleteAnnouncementUsingDELETE
    * @param {object} parameters - method options and parameters
    * @param {integer} parameters.id - id
    */
  this.deleteAnnouncementUsingDELETE = function(parameters) {
    return restClient.requestDelete(parameters);
  };


	function newRestClientFactory() {
		var rc = new RestClientFactory(domain);
    rc.instanceConfiguration = {instanceId : 1,	builtFrom : "RestClientFactoryInstanceBuilder"};
    return rc;
	};

}]);

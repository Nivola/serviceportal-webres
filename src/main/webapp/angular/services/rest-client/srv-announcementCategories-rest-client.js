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

angular.module('app').service('AnnouncementCategoriesRestClient',	['$q', 'RestClientFactory', function($q, RestClientFactory) {

	var domain = '/api/announcement-categories';
	var restClient = newRestClientFactory();
	
  /**
    * getAllAnnouncementCategories
    * @method
    * @name RestClientFactory#getAllAnnouncementCategoriesUsingGET
    * @param {object} parameters - method options and parameters
    * @param {integer} parameters.page - Page number of the requested page
    * @param {integer} parameters.size - Size of a page
    * @param {array} parameters.sort - Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
    */
  this.getAllAnnouncementCategoriesUsingGET = function(parameters) {
		return restClient.requestGetAll(parameters);
	};
		
  /**
    * createAnnouncementCategory
    * @method
    * @name RestClientFactory#createAnnouncementCategoryUsingPOST
    * @param {object} parameters - method options and parameters
    * @param {} parameters.announcementCategoryDto - announcementCategoryDTO
    */
  this.createAnnouncementCategoryUsingPOST = function(parameters) {
		return restClient.requestPost(parameters, 'announcementCategoryDto');
	};

  /**
    * updateAnnouncementCategory
    * @method
    * @name RestClientFactory#updateAnnouncementCategoryUsingPUT
    * @param {object} parameters - method options and parameters
    * @param {} parameters.announcementCategoryDto - announcementCategoryDTO
    */
  this.updateAnnouncementCategoryUsingPUT = function(parameters) {
		return restClient.requestPut(parameters, 'announcementCategoryDto');
  };

	/**
    * getAnnouncementCategory
    * @method
    * @name RestClientFactory#getAnnouncementCategoryUsingGET
    * @param {object} parameters - method options and parameters
    * @param {integer} parameters.id - id
    */
  this.getAnnouncementCategoryUsingGET = function(parameters) {
		return restClient.requestGetOne(parameters);
  };

	/**
    * deleteAnnouncementCategory
    * @method
    * @name RestClientFactory#deleteAnnouncementCategoryUsingDELETE
    * @param {object} parameters - method options and parameters
    * @param {integer} parameters.id - id
    */
  this.deleteAnnouncementCategoryUsingDELETE = function(parameters) {
		return restClient.requestDelete(parameters);
  };


	function newRestClientFactory() {
		var rc = new RestClientFactory(domain);
		rc.instanceConfiguration = {instanceId : 1,	builtFrom : "RestClientFactoryInstanceBuilder"};
		return rc;
	};

}]);

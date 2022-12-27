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
angular.module('app').service('TutorialService', [
	'loggers', 'TutorialsRestClient', 'MyTutorialsRestClient',
function (
	loggers, TutorialsRestClient, MyTutorialsRestClient
) {
	var logger = loggers.get("srv-tutorial");

	var service = this;

	service.getAllMyTutorials = function() {

    	return MyTutorialsRestClient.getAllMyTutorialsUsingGET().then(function(response) {
            var mapped = response.data;
            return mapped;
        });

    };

	service.getAllTutorials = function() {

    	return TutorialsRestClient.getAllTutorialsUsingGET().then(function(response) {
            var mapped = response.data;
            return mapped;
        });

    };

	service.getTutorial = function(id) {

    	return TutorialsRestClient.getTutorialUsingGET({id : id}).then(function(response) {
            var mapped = response.data;
            return mapped;
        });

    };

    service.createTutorial = function(o) {

    	return TutorialsRestClient.createTutorialUsingPOST({tutorialDto  : o}).then(function(response) {
            var mapped = response.data;
            return mapped;
        });

    };
    
    service.updateTutorial = function(o) {

    	return TutorialsRestClient.updateTutorialUsingPUT({tutorialDto  : o}).then(function(response) {
            var mapped = response.data;
            return mapped;
        });

    };
    
    service.deleteTutorial = function(id) {

    	return TutorialsRestClient.deleteTutorialUsingDELETE({id : id}).then(function(response) {
            var mapped = response.data;
            return mapped;
        });

    };
}]);

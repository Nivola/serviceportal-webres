/*-
 * ========================LICENSE_START=================================
 * Nivola Service Portal Web Resources
 * %%
 * Copyright (C) 2022 Regione Piemonte
 * %%
 * SPDX-FileCopyrightText: Copyright 2022 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
angular.module('app').service('DocumentiService', [
	'loggers', 'MyDocumentsRestClient', 'DocumentsRestClient',
function (
    loggers, MyDocumentsRestClient, DocumentsRestClient    
) {
	var logger = loggers.get("srv-documenti");

	var service = this;

	service.getAllMyDocuments = function() {

    	return MyDocumentsRestClient.getAllMyDocumentsUsingGET().then(function(response) {
            var mapped = response.data;
            return mapped;
        });

    };

	service.getAllDocuments = function() {

    	return DocumentsRestClient.getAllDocumentsUsingGET().then(function(response) {
            var mapped = response.data;
            return mapped;
        });

    };

	service.getDocument = function(id) {

    	return DocumentsRestClient.getDocumentUsingGET({id : id}).then(function(response) {
            var mapped = response.data;
            return mapped;
        });

    };

    service.createDocument = function(o) {

    	return DocumentsRestClient.createDocumentUsingPOST({documentDto  : o}).then(function(response) {
            var mapped = response.data;
            return mapped;
        });

    };
    
    service.updateDocument = function(o) {

    	return DocumentsRestClient.updateDocumentUsingPUT({documentDto  : o}).then(function(response) {
            var mapped = response.data;
            return mapped;
        });

    };
    
    service.deleteDocument = function(id) {

    	return DocumentsRestClient.deleteDocumentUsingDELETE({id : id}).then(function(response) {
            var mapped = response.data;
            return mapped;
        });

    };
}]);

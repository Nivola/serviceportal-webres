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
angular.module('app').service('MessaggiService', [
	'loggers', 'MessagesRestClient', 'myNewsRestClient',
function (
	loggers, MessagesRestClient, myNewsRestClient
) {
	var logger = loggers.get("srv-messaggi");

	var service = this;

	service.getAllMyMessages = function() {

    	return myNewsRestClient.getMyMessagesUsingGET().then(function(response) {
            var mapped = response.data;
            
            mapped = $.grep(mapped, function(candidate) {
        		return true;
        	})
        	
            return mapped;
        });

    };

	service.getAllMessages = function() {

    	return MessagesRestClient.getAllMessagesUsingGET().then(function(response) {
            var mapped = response.data;
            return mapped;
        });

    };

	service.getMessage = function(id) {

    	return MessagesRestClient.getMessageUsingGET({id : id}).then(function(response) {
            var mapped = response.data;
            return mapped;
        });

    };

    service.createMessage = function(o) {

    	return MessagesRestClient.createMessageUsingPOST({messageDto  : o}).then(function(response) {
            var mapped = response.data;
            return mapped;
        });

    };
    
    service.updateMessage = function(o) {

    	return MessagesRestClient.updateMessageUsingPUT({messageDto  : o}).then(function(response) {
            var mapped = response.data;
            return mapped;
        });

    };
    
    service.deleteMessage = function(id) {

    	return MessagesRestClient.deleteMessageUsingDELETE({id : id}).then(function(response) {
            var mapped = response.data;
            return mapped;
        });

    };
}]);

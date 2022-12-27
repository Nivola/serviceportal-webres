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
angular.module('app').controller('CreaNotiziaController', [
	'$scope', '$state', 'controllerValidator', 'loggers', '$interval', 'MessaggiService', '$stateParams', 'notificationManager', 'UsersRestClient',
	'$translate',
function (
	$scope, $state, controllerValidator, loggers, $interval, MessaggiService, $stateParams, notificationManager, UsersRestClient, $translate)
{
	

	var controller = this;

	$scope.scenario = $state.current.data.scenario;
	$scope[$state.current.data.scenario] = true;
	
	$scope.vm = {
	    entity : null,
		listaUtenti : null,
		
    };

	$scope.status = {
	    loading : true,
        loaded : false,
        failed : false
    };

	$scope.actions = {
		save : null,
		delete : null
    };

	$scope.helpers = {
    };

	$scope.vm.availableStatuses = [
        { code : 'BOZZA', description : $translate.instant('notizie.stato.bozza'), order : 2 },
        { code : 'OBSOLETA', description : $translate.instant('notizie.stato.obsoleta'), order : 3 },
        { code : 'PUBBLICATA', description : $translate.instant('notizie.stato.pubblicata'), order : 1 }
    ];

	$scope.vm.elencoPriorita = [
		{ code : 10, description : $translate.instant('notizie.priorita.alta'), order : 1 },
		{ code : 20, description : $translate.instant('notizie.priorita.media'), order : 2 },
		{ code : 30, description : $translate.instant('notizie.priorita.bassa'), order : 3 }
		];
	
	
	$scope.actions.save = function() {
		var handler = ($state.current.data.scenario == 'MODIFICA') ? 
				MessaggiService.updateMessage : MessaggiService.createMessage;
		
		$scope.status.loading = true;
		$scope.status.loaded = false;
		
		var entity = angular.copy($scope.vm.entity);
		if (!entity.targetId || entity.targetId == "0") entity.targetId = null;
		
		handler(entity).then(function(data) {
			if (($state.current.data.scenario == 'MODIFICA')) {
				notificationManager.showSuccessPopup($translate.instant('notizie.modifica.success'));
			} else {
				notificationManager.showSuccessPopup($translate.instant('notizie.nuova.success'));
			}
			
			window.history.back();
            $scope.status.loaded = true;
        }, function(onfail) {
        	notificationManager.showErrorPopup($translate.instant('notizie.nuova.error'));
            $scope.status.failed = true;
        }).finally(function() {
            $scope.status.loading = false;
        });
		
	};

	$scope.actions.delete = function() {

		$scope.status.loading = true;
		$scope.status.loaded = false;
		
		MessaggiService.deleteMessage($scope.vm.entity.id).then(function(data) {
			notificationManager.showSuccessPopup($translate.instant('notizie.elimina.success'));
			window.history.back();
            $scope.status.loaded = true;
        }, function(onfail) {
        	notificationManager.showErrorPopup($translate.instant('notizie.nuova.error'));
            $scope.status.failed = true;
        }).finally(function() {
            $scope.status.loading = false;
        });
		
	};

	controller.onInit = function() {


		if ($state.current.data.scenario == 'MODIFICA') {
			if ($stateParams.entity) {
				$scope.vm.entity = $stateParams.entity;
	            $scope.status.loaded = true;
	            $scope.status.loading = false;
	            controller.parseIncoming($scope.vm.entity);
	            
			} else {
				MessaggiService.getMessage($stateParams.idMessaggio).then(function(data) {
		            $scope.vm.entity = data;
		            $scope.status.loaded = true;
		            controller.parseIncoming($scope.vm.entity);
		        }, function(onfail) {
		            $scope.status.failed = true;
		        }).finally(function() {
		            $scope.status.loading = false;
		        });
			}
			
		} else {
			$scope.vm.entity = {
				title : '',
				content : '',
				status : 'ENABLED',
				priority : 10,
				targetId : 0
			};
			
            $scope.status.loaded = true;
            $scope.status.loading = false;
		}
    };
    
    controller.parseIncoming = function(raw) {
    	if (!raw.targetId) {
    		raw.targetId = 0;
    	}
    	
    	if (raw.senderId) {
    		raw.senderDescription = raw.senderFirstName;
        	if (raw.senderFirstName != raw.senderLastName) {
        		raw.senderDescription += " " + raw.senderLastName;
        	}
        }
    	return raw;
    };

    controller.onExit = function() {
        // nop
	};

	controllerValidator.validate(controller, $scope);
}]);


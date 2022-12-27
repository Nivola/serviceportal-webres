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
angular.module('app').controller('MessaggioModificaController', [
	'$scope', '$state', 'controllerValidator', 'loggers', '$interval', 'MessaggiService', '$stateParams', 'notificationManager', 'UsersRestClient',
function (
	$scope, $state, controllerValidator, loggers, $interval, MessaggiService, $stateParams, notificationManager, UsersRestClient)
{
	var logger = loggers.get("ctrl-messaggio-modifica");
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
        { code : 'BOZZA', description : 'Bozza', order : 2 },
        { code : 'OBSOLETA', description : 'Obsoleta', order : 3 },
        { code : 'PUBBLICATA', description : 'Pubblicata', order : 1 }
    ];

	$scope.vm.elencoPriorita = [
		{ code : 10, description : 'Alta', order : 1 },
		{ code : 20, description : 'Media', order : 2 },
		{ code : 30, description : 'Bassa', order : 3 }
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
				notificationManager.showSuccessPopup('La notizia è stata salvata');
			} else {
				notificationManager.showSuccessPopup('La notizia è stata creata');
			}
			
			window.history.back();
            $scope.status.loaded = true;
        }, function(onfail) {
        	notificationManager.showErrorPopup('Si è verificato un errore durante il salvataggio della notizia:( ');
            $scope.status.failed = true;
        }).finally(function() {
            $scope.status.loading = false;
        });
		
	};

	$scope.actions.delete = function() {

		$scope.status.loading = true;
		$scope.status.loaded = false;
		
		MessaggiService.deleteMessage($scope.vm.entity.id).then(function(data) {
			notificationManager.showSuccessPopup('La notizia è stata eliminata');
			window.history.back();
            $scope.status.loaded = true;
        }, function(onfail) {
        	notificationManager.showErrorPopup('Si è verificato un errore durante la cancellazione della notizia:( ');
            $scope.status.failed = true;
        }).finally(function() {
            $scope.status.loading = false;
        });
		
	};

	controller.onInit = function() {
		
		var p0 = UsersRestClient.getAllUsersUsingGET().then(function(response){
			$scope.vm.listaUtenti = [{
				id : 0,
				description : "Broadcast (visibile a tutti gli utenti)",
				orderKey : "0"
			}];
			
			$.each(response.data, function(i, e) {
				if (e.id < 3) {
					return;
				}
				
				var o = angular.copy(e);
				
				// NO MAPPING
				o.description = o.firstName + " " + o.lastName;
				o.orderKey = "1" + o.description;
				
				$scope.vm.listaUtenti.push(o);
			});
			
		});

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

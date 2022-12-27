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
angular.module('app').controller('TutorialModificaController', [
	'$scope', '$state', '$mdToast', 'controllerValidator', 'loggers', 'conf',
	'$interval', 'TutorialService', '$stateParams', 'notificationManager', 'DataUtils', '$timeout',
function (
	$scope, $state, $mdToast, controllerValidator, loggers, conf,
	$interval, EntityService, $stateParams, notificationManager, DataUtils, $timeout)
{
	var logger = loggers.get("ctrl-tutorial-modifica");
	var controller = this;

	$scope.scenario = $state.current.data.scenario;
	$scope[$state.current.data.scenario] = true;
	
	$scope.vm = {
	    entity : null
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
	
	$scope.helpers.setDirty = function() {
		$scope.form.$setDirty();
		return true;
	};

	$scope.vm.availableStatuses = [
        { code : 'DRAFT', description : 'Bozza (non visibile agli utenti)', order : 1 },
        { code : 'PUBLISHED', description : 'Pubblicato', order : 2 },
        { code : 'ARCHIVED', description : 'Archiviato (non visibile agli utenti)', order : 3 }
    ];
	
	$scope.actions.save = function() {
		var handler = ($state.current.data.scenario == 'MODIFICA') ? 
				EntityService.updateTutorial : EntityService.createTutorial;
		
		$scope.status.loading = true;
		$scope.status.loaded = false;
		
		var e = angular.copy($scope.vm.entity);
		
		handler(e).then(function(data) {
			if (($state.current.data.scenario == 'MODIFICA')) {
				notificationManager.showSuccessPopup('Il tutorial è stato salvato');
			} else {
				notificationManager.showSuccessPopup('Il tutorial è stato creato');
			}
			
			window.history.back();
            $scope.status.loaded = true;
        }, function(onfail) {
        	notificationManager.showErrorPopup('Si è verificato un errore :( ');
            $scope.status.failed = true;
        }).finally(function() {
            $scope.status.loading = false;
        });
		
	};

	$scope.actions.delete = function() {

		$scope.status.loading = true;
		$scope.status.loaded = false;
		
		EntityService.deleteTutorial($scope.vm.entity.id).then(function(data) {
			notificationManager.showSuccessPopup('Il tutorial è stato eliminato');
			window.history.back();
            $scope.status.loaded = true;
        }, function(onfail) {
        	notificationManager.showErrorPopup('Si è verificato un errore :( ');
            $scope.status.failed = true;
        }).finally(function() {
            $scope.status.loading = false;
        });
		
	};
	
	$scope.actions.view = function() {
		$state.go("app.tutorial.visualizza", {
			idTutorial : $stateParams.idTutorial
		});
	};

	controller.onInit = function() {

		if ($state.current.data.scenario == 'MODIFICA') {
			if ($stateParams.entity) {
				$scope.vm.entity = $stateParams.entity;
	            $scope.status.loaded = true;
	            $scope.status.loading = false;
			} else {
				EntityService.getTutorial($stateParams.idTutorial).then(function(data) {
		            $scope.vm.entity = data;
		            $scope.status.loaded = true;
		        }, function(onfail) {
		            $scope.status.failed = true;
		        }).finally(function() {
		            $scope.status.loading = false;
		        });
			}
		} else {
			$scope.vm.entity = {
				title : '',
				description : '',
				ordinal : 0,
				mediaResourceLocation : null,
				mediaResourceIdentifier : null,
				status : 'DRAFT'
			};
			
            $scope.status.loaded = true;
            $scope.status.loading = false;
		}
    };

    controller.onExit = function() {
        // nop
	};
    
	controllerValidator.validate(controller, $scope);

    $timeout(function (){
        angular.element('.form-group:eq(1)>input').focus();
    });

}]);

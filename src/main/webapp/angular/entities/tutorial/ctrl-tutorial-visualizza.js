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
angular.module('app').controller('TutorialVisualizzaController', [
	'$scope', '$state', '$mdToast', 'controllerValidator', 'loggers', 'conf', '$sce',
	'$interval', 'TutorialService', '$stateParams', 'notificationManager', 'DataUtils', '$timeout',
function (
	$scope, $state, $mdToast, controllerValidator, loggers, conf, $sce,
	$interval, EntityService, $stateParams, notificationManager, DataUtils, $timeout)
{
	var logger = loggers.get("ctrl-tutorial-visualizza");
	var controller = this;

	$scope.scenario = $state.current.data.scenario;
	$scope[$state.current.data.scenario] = true;
	
	$scope.vm = {
	    entity : null,
	    videoSource : null
    };

	$scope.status = {
	    loading : true,
        loaded : false,
        failed : false
    };

	$scope.actions = {
    };

	$scope.helpers = {
    };

	$scope.helpers.isSeeking = function() {
		var video = controller.getVideoElement();
		return (!!$scope.vm.videoSource) && video.seeking;
	}
	
	$scope.helpers.isPlaying = function() {
		var video = controller.getVideoElement();
		return (!!$scope.vm.videoSource) && !video.paused;
	};

	$scope.helpers.isPaused = function() {
		var video = controller.getVideoElement();
		return (!!$scope.vm.videoSource) && video.paused;
	};
	
	$scope.actions.play = function() {
		var video = controller.getVideoElement();
		video.play();
	};

	$scope.actions.pause= function() {
		var video = controller.getVideoElement();
		video.pause();
	};
	
	controller.getVideoSource = function() {
		if ($scope.status.loaded) {
			if ($scope.vm.entity.mediaResourceLocation) {
				return $sce.trustAsResourceUrl($scope.vm.entity.mediaResourceLocation);
			} else {
				return null;
			}
		} else {
			return null;
		}
	};
	
	controller.onVideoReady = function() {
		$scope.vm.videoSource = controller.getVideoSource();
		
		var video = controller.getVideoElement();
		// video.play();
	};

	controller.getVideoElement = function() {
		return $("#tutorialVideoPlayer").get(0);
	};
	
	controller.onInit = function() {

		if ($stateParams.entity) {
			$scope.vm.entity = $stateParams.entity;
            $scope.status.loaded = true;
            $scope.status.loading = false;
            controller.onVideoReady();
		} else {
			EntityService.getTutorial($stateParams.idTutorial).then(function(data) {
	            $scope.vm.entity = data;
	            $scope.status.loaded = true;
	            controller.onVideoReady();
	        }, function(onfail) {
	            $scope.status.failed = true;
	        }).finally(function() {
	            $scope.status.loading = false;
	        });
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

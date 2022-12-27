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
angular.module('app').controller('VmIstanzaDettaglioController', [
	'$interval', '$scope',  '$stateParams','controllerValidator', 'loggers', 'VmIstanzeService',
function (
	$interval, $scope, $stateParams, controllerValidator, loggers, VmIstanzeService)
{
	var logger = loggers.get("ctrl-vm-istanze");
    var controller = this;

	$scope.vm = {
	    vm : null,
        snapshots : null
    };

	$scope.status = {
	    loading : true,
        loaded : false,
        failed : false,

        pending : 0,

        selectedTabIndex : 0,

        allowReboot : false
    };

	$scope.actions = {
        doInstanceStart : null,
        doInstanceStop : null,
        doInstanceRestart : null
    };

	$scope.helpers = {

    };

    $scope.actions.doInstanceStart = function() {
        $scope.status.loaded = false;
        $scope.status.loading = true;

        $scope.status.selectedTabIndex = 0;

        $scope.status.pending ++;

        VmIstanzeService.doEC2InstanceStart($scope.vm.vm.instanceId)
            .then(controller.refresh)
            .then(function(onsuccess) {
                $scope.status.loaded = true;
            }, function(onfail) {
                $scope.status.failed = true;
            }).finally(function() {
            $scope.status.loading = false;
            $scope.status.pending --;
        });
    };

    $scope.actions.doInstanceStop = function() {
        $scope.status.loaded = false;
        $scope.status.loading = true;

        $scope.status.selectedTabIndex = 0;

        $scope.status.pending ++;

        VmIstanzeService.doEC2InstanceStop($scope.vm.vm.instanceId)
            .then(controller.refresh)
            .then(function(onsuccess) {
                $scope.status.loaded = true;
            }, function(onfail) {
                $scope.status.failed = true;
            }).finally(function() {
            $scope.status.loading = false;
            $scope.status.pending --;
        });
    };

    $scope.actions.doInstanceRestart = function() {
        $scope.status.loaded = false;
        $scope.status.loading = true;

        $scope.status.selectedTabIndex = 0;

        $scope.status.pending ++;

        VmIstanzeService.doEC2InstanceRestart($scope.vm.vm.instanceId)
            .then(controller.refresh)
            .then(function(onsuccess) {
                $scope.status.loaded = true;
            }, function(onfail) {
                $scope.status.failed = true;
            }).finally(function() {
            $scope.status.loading = false;
            $scope.status.pending --;
        });
    };

    controller.refreshSeStatoNonPermanente = function() {
        if ($scope.status.pending) return;
        if (!$scope.vm.vm) return;
        if ($scope.vm.vm.state.code == 16 || $scope.vm.vm.state.code == 80) {
            return;
        }

        controller.refresh();
    };

    controller.refresh = function() {

        $scope.status.pending ++;

        return VmIstanzeService.getEc2Instance($stateParams.idIstanzaVm).then(function(data) {
            $scope.vm.vm = data;

            $scope.vm.snapshots = [
                {id : 1, name : "Snapshot 90215891825125", date : "01/02/2013"},
                {id : 2, name : "Snapshot 39693209306023", date : "02/03/2014"},
                {id : 3, name : "Snapshot 82959023904119", date : "03/04/2015"},
                {id : 4, name : "Snapshot 49592390120491", date : "04/05/2016"},
                {id : 5, name : "Snapshot 71259190205052", date : "05/06/2017"},
            ];

            $scope.status.pending --;
        });

    };

    this.onInit = function() {
        controller.refresh().then(function(data) {
            $scope.status.loaded = true;
        }, function(onfail) {
            $scope.status.failed = true;
        }).finally(function() {
            $scope.status.loading = false;
        });

        controller.intervalHandler = $interval(function() {
            controller.refreshSeStatoNonPermanente();
        }, 10000);
    };

	this.onExit = function() {
        $interval.cancel(controller.intervalHandler);
	};

	controllerValidator.validate(this, $scope);
}]);

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
angular.module('app').controller('DBaaSIstanzaDettaglioController', [
	'$interval', '$scope', '$stateParams', 'DBaaSIstanzeService', 'controllerValidator', 'loggers',
function (
	$interval, $scope, $stateParams, DBaaSIstanzeService, controllerValidator, loggers)
{
	var logger = loggers.get("ctrl-dbaas-istanze");
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

    controller.refreshSeStatoNonPermanente = function() {
        if ($scope.status.pending) return;
        if (!$scope.vm.istanza) return;
        if ($scope.vm.istanza.state.code == 16 || $scope.vm.istanza.state.code == 80) {
            return;
        }

        controller.refresh();
    };

    controller.refresh = function() {

        $scope.status.pending ++;

        return DBaaSIstanzeService.getById($stateParams.idIstanzaDBaaS).then(function(data) {
            $scope.vm.istanza = data;

            $scope.vm.snapshots = [];

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

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
angular.module('app').controller('VmIstanzeController', [
	'$scope', '$state', '$mdToast', 'controllerValidator', 'loggers', '$interval', 'VmIstanzeService',
function (
	$scope, $state, $mdToast, controllerValidator, loggers, $interval, VmIstanzeService)
{
	var logger = loggers.get("ctrl-vm-istanze");

	$scope.vm = {
	    list : null,
        vmDetail : null
    };

	$scope.status = {
	    loading : true,
        loaded : false,
        failed : false,
        vmDetailOpened : false,
        vmListFilterInput : null,
        bottomFabOpen : false
    };

	$scope.actions = {
	    clickOnVmInList : null,
        closeVmDetail : null,
        clearVmListFilterInput : null,
        gotoVmDetail : null,
        gotoNewVm : null
    };

	$scope.helpers = {
	    vmListFilter : null
    };

	$scope.actions.gotoNewVm = function() {
	    $state.go("app.vm.nuova");
    };

    $scope.actions.gotoVmDetail = function(vm) {
        $state.go("app.vm.istanze.dettaglio", {
            idIstanzaVm : vm.instanceId
        });
    };

	$scope.actions.clearVmListFilterInput = function() {
	    $scope.status.vmListFilterInput = null;
    };

	$scope.actions.clickOnVmInList = function(vm) {
        $scope.actions.gotoVmDetail(vm);
    };

	$scope.actions.closeVmDetail = function() {
        $scope.status.vmDetailOpened = false;
        $scope.vm.vmDetail = null;
    }

    $scope.helpers.vmListFilter = function(value, index, array) {
        var keyword = $scope.status.vmListFilterInput;
        if (!keyword) return true;
        keyword = keyword.toUpperCase();

        return value.instanceId.toUpperCase().indexOf(keyword) != -1 ||
            value.instanceType.toUpperCase().indexOf(keyword) != -1;
    };

	this.onInit = function() {

        VmIstanzeService.getEc2Instances().then(function(data) {
            $scope.vm.list = data;
            $scope.status.loaded = true;
        }, function(onfail) {
            $scope.status.failed = true;
        }).finally(function() {
            $scope.status.loading = false;
        });

    };

	this.onExit = function() {
	};

	controllerValidator.validate(this, $scope);
}]);

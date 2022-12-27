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
angular.module('app').controller('DBaaSIstanzeController', [
	'$scope', '$state', '$mdToast', 'controllerValidator', 'loggers', '$interval', 'DBaaSIstanzeService',
function (
	$scope, $state, $mdToast, controllerValidator, loggers, $interval, DBaaSIstanzeService)
{
	var logger = loggers.get("ctrl-dbaas-istanze");

	$scope.dbaas = {
	    list : null,
        istanzaDetail : null
    };

	$scope.status = {
	    loading : true,
        loaded : false,
        failed : false,
        istanzaDetailOpened : false,
        vmListFilterInput : null,
        bottomFabOpen : false
    };

	$scope.actions = {
	    clickOnDBaaSInList : null,
        closeDBaaSDetail : null,
        clearDBaaSListFilterInput : null,
        gotoDBaaSDetail : null,
        gotoNewDBaaS : null
    };

	$scope.helpers = {
	    dbaasListFilter : null
    };

	$scope.actions.gotoNewDBaaS = function() {
	    $state.go("app.dbaas.nuova");
    };

    $scope.actions.gotoDBaaSDetail = function(dbaas) {
        $state.go("app.dbaas.istanze.dettaglio", {
            idIstanzaDBaaS : dbaas.dbInstanceIdentifier
        });
    };

	$scope.actions.clearDBaaSListFilterInput = function() {
	    $scope.status.dbListFilterInput = null;
    };

	$scope.actions.clickOnDBaaSInList = function(dbaas) {
	    // $scope.vm.istanzaDetail = vm;
	    // $scope.status.istanzaDetailOpened = true;
        $scope.actions.gotoDBaaSDetail(dbaas);
    };

	$scope.actions.closeDBaaSDetail = function() {
        $scope.status.istanzaDetailOpened = false;
        $scope.vm.istanzaDetail = null;
    }

    $scope.helpers.vmListFilter = function(value, index, array) {
        var keyword = $scope.status.dbaasListFilterInput;
        if (!keyword) return true;
        keyword = keyword.toUpperCase();

        return value.dbInstanceIdentifier.toUpperCase().indexOf(keyword) != -1 ||
            value.dbName.toUpperCase().indexOf(keyword) != -1;
    };

	this.onInit = function() {

        DBaaSIstanzeService.get().then(function(data) {
            $scope.dbaas.list = data;
            $scope.status.loaded = true;
        }, function(onfail) {
            $scope.status.failed = true;
        }).finally(function() {
            $scope.status.loading = false;
        });

    };

	this.onExit = function() {
        // nop
	};

	controllerValidator.validate(this, $scope);
}]);

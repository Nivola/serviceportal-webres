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
angular.module('app').controller('DocumentiListaController', [
	'$scope', '$state', '$mdToast', 'controllerValidator', 'loggers', '$interval', 'DocumentiService',
function (
	$scope, $state, $mdToast, controllerValidator, loggers, $interval, DocumentiService)
{
    var logger = loggers.get("ctrl-documenti");

	$scope.vm = {
	    list : null
    };

	$scope.status = {
	    loading : true,
        loaded : false,
        failed : false
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
	    $state.go("app.documentazione.nuovo");
    };

    $scope.actions.gotoVmDetail = function(vm) {
        $state.go("app.documentazione.modifica", {
            idDocumento : vm.id
        });
    };

	$scope.actions.clearVmListFilterInput = function() {
	    $scope.status.vmListFilterInput = null;
    };

	$scope.actions.clickOnVmInList = function(vm) {
        $scope.actions.gotoVmDetail(vm);
    };

    $scope.helpers.vmListFilter = function(value, index, array) {
        var keyword = $scope.status.vmListFilterInput;
        if (!keyword) return true;
        keyword = keyword.toUpperCase();

        return value.title.toUpperCase().indexOf(keyword) != -1 ||
        	value.description.toUpperCase().indexOf(keyword) != -1 ||
        	value.status.toUpperCase().indexOf(keyword) != -1 ||
        	(value.documentFileName && value.documentFileName.toUpperCase().indexOf(keyword) != -1);
    };

	this.onInit = function() {

		DocumentiService.getAllDocuments().then(function(data) {
            $scope.vm.list = data;
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

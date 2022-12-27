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
angular.module('app').controller('MessaggiListaController', [
	'$scope', '$state', 'controllerValidator', 'loggers', 'MessaggiService', 'AuthenticationService', 'AuthLevel',
function (
	$scope, $state, controllerValidator, loggers, MessaggiService, AuthenticationService, AuthLevel)
{
	var logger = loggers.get("ctrl-messaggi");

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
	    $state.go("app.messaggistica.nuovo");
    };

    $scope.actions.gotoVmDetail = function(vm) {
        $state.go("app.messaggistica.modifica", {
            idMessaggio : vm.id
        });
    };

	$scope.actions.clearVmListFilterInput = function() {
	    $scope.status.vmListFilterInput = null;
    };

	$scope.actions.clickOnVmInList = function(vm) {
		if (AuthenticationService.isGranted(AuthLevel.BOADMIN)) {
			$scope.actions.gotoVmDetail(vm);
		} else {
			// visualizza messaggio
			// TODO
		}
    };

    $scope.helpers.vmListFilter = function(value, index, array) {
        var keyword = $scope.status.vmListFilterInput;
        if (!keyword) return true;
        keyword = keyword.toUpperCase();

        return value.title.toUpperCase().indexOf(keyword) != -1 ||
        value.content.toUpperCase().indexOf(keyword) != -1 ||
        value.status.toUpperCase().indexOf(keyword) != -1 ||
        (value.senderFirstName != null && value.senderFirstName.toUpperCase().indexOf(keyword) != -1) ||
        (value.targetFirstName != null && value.targetFirstName.toUpperCase().indexOf(keyword) != -1) ||
        (value.senderLastName != null && value.senderLastName.toUpperCase().indexOf(keyword) != -1) ||
        (value.targetLastName != null && value.targetLastName.toUpperCase().indexOf(keyword) != -1);
    };

	this.onInit = function() {

		var provider = AuthenticationService.isGranted(AuthLevel.BOADMIN) ? MessaggiService.getAllMessages : MessaggiService.getAllMyMessages;
		provider().then(function(data) {
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

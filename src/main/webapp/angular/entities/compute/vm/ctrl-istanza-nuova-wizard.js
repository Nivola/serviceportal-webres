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
angular.module('app').controller('VmIstanzaNuovaWizardController', [
	'$scope', '$state', '$mdToast', 'controllerValidator', 'loggers', '$interval', 'VmIstanzeService', '$q',
function (
	$scope, $state, $mdToast, controllerValidator, loggers, $interval, VmIstanzeService, $q)
{
	var logger = loggers.get("ctrl-vm-istanze");

	$scope.vm = {
	    vm : null,
        availablePlans : [],
        tags : [],

        selectedAMI : null
    };

	$scope.status = {
	    loading : true,
        loaded : false,
        failed : false,

        tagsReadOnly : false,
        tagsRemovable : true
    };

	$scope.actions = {

    };

	$scope.helpers = {

    };

	this.onInit = function() {

        $q.all([

            VmIstanzeService.getAvailablePlans().then(function(data) {
                $scope.vm.availablePlans = data;
            }),

            VmIstanzeService.getAvailableAMIs().then(function(data) {
                $scope.vm.availableAMIs = data;
                $scope.vm.selectedAMI = data[0].id;
            }),

            VmIstanzeService.get().then(function(data) {
                var o = data[0];

                o.name = "Nuova VM";
                o.id ++;
                o.code = o.id;
                o.notes = "";

                $scope.vm.vm = o;
                $scope.status.loaded = true;
            })

        ]).then(function(onSuccess) {
            $scope.status.loaded = true;
        }, function(onFail) {
            $scope.status.failed = false;
        }).finally(function() {
            $scope.status.loading = false;
        });

        $scope.vm.tags = ["TEST", "COD-PRODOTTO"];
    };

	this.onExit = function() {
        // nop
	};

	controllerValidator.validate(this, $scope);
}]);

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
angular.module('app').controller('DBaaSIstanzaNuovaController', [
	'$scope', '$state', '$mdToast', 'controllerValidator', 'loggers', '$interval', 'DBaaSIstanzeService', '$q',
function (
	$scope, $state, $mdToast, controllerValidator, loggers, $interval, DBaaSIstanzeService, $q)
{
	var logger = loggers.get("ctrl-dbaas-istanze");

	$scope.vm = {
	    vm : null,
        availableTemplates : [],
        availableSizings : [],
        availableSecurityGroups : [],
        availableDiskSizings : [],
        availableDiskTypes : [],
        availableAvailabilityZones : [],
        availableVirtualizationOptions : [],

        tags : []
    };

	$scope.status = {
	    loading : true,
        loaded : false,
        failed : false,

        tagsReadOnly : false,
        tagsRemovable : true,
        tabIndex : 0
    };

	$scope.actions = {
        gotoTab : null
    };

	$scope.helpers = {

    };

	$scope.actions.gotoTab = function(index) {
        $scope.status.tabIndex = index;
    };

	this.onInit = function() {

        $q.all([

            DBaaSIstanzeService.getAvailableTemplates().then(function(data) {
                $scope.vm.availableTemplates = [
                	{ id : 1, name : "PostgreSQL 9.6", description : "PostgreSQL 9.6" },
                	{ id : 2, name : "MySQL 5.7", description : "MySQL 5.7.0" },
                	{ id : 3, name : "MySQL 5.2", description : "MySQL 5.2.0" },
                	{ id : 4, name : "Oracle 12c", description : "Oracle DB 12c" }
                ];
            }),

            DBaaSIstanzeService.getAvailableSizing().then(function(data) {
                $scope.vm.availableSizings = data;
            }),

            DBaaSIstanzeService.getAvailableDiskSizing().then(function(data) {
                $scope.vm.availableDiskSizings = data;
                $scope.vm.selectedDiskSize = data[0];
            }),

            DBaaSIstanzeService.getAvailableDiskTypes().then(function(data) {
                $scope.vm.availableDiskTypes = data;
                $scope.vm.selectedDiskType = data[0].id;
            }),

            DBaaSIstanzeService.getAvailableVirtualizationOptions().then(function(data) {
                $scope.vm.availableVirtualizationOptions = data;
                $scope.vm.selectedVirtualizationOption = $.grep(data, function(candidate){
                	return candidate.code == 'VMWARE';
                })[0].id;
            }),

            DBaaSIstanzeService.getAvailableAvailabilityZones().then(function(data) {
                $scope.vm.availableAvailabilityZones = data;
                $scope.vm.selectedAvailabilityZone = $.grep(data, function(candidate){
                	return candidate.code == 'TO1';
                })[0].id;
            }),
            
            DBaaSIstanzeService.get().then(function(data) {
                var o = data[0];

                o.name = "Nuova istanza DBAAS";
                o.id ++;
                o.code = o.id;
                o.notes = "";
                
                o.schema = "mainschema";
                o.defaultPort = 5432;
                o.rootPassword = "mypass";

                $scope.vm.istanza = o;
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

        $scope.vm.availableSecurityGroups = [
            {id : 1, name : "Default", description : "Gruppo di sicurezza di default (autogenerato)"},
            {id : 2, name : "CUS-1", description : "Gruppo di sicurezza custom 1"},
            {id : 3, name : "CUS-2", description : "Gruppo di sicurezza custom 2"},
        ];

        $scope.vm.selectedSecurityGroup = $scope.vm.availableSecurityGroups[0].id;
    };

	this.onExit = function() {
        // nop
	};

	controllerValidator.validate(this, $scope);
}]);

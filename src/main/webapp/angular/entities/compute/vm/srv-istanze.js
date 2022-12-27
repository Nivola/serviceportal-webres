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
angular.module('app').service('VmIstanzeService', [
    'loggers', 'MockService',
    function (
        loggers, serviceMock
    ) {
        var logger = loggers.get("srv-vm-istanze");

        var service = this;

        service.getEc2Instances = function () {

            /*
            return restClientService.getEC2InstancesUsingGET().then(function(response) {
                var output = [];
                $.each(response.data || [], function(i, e) {
                    var mapped = service.mapEc2InstanceToVM(e);
                    output.push(mapped);
                });
                return output;
            });
            */

        };

        service.getEc2Instance = function (id) {

            /*
            return restClientService.getEC2InstanceUsingGET({id : id}).then(function(response) {
                var mapped = service.mapEc2InstanceToVM(response.data);
                return mapped;
            });
            */

        };

        service.doEC2InstanceStart = function (id) {

            /*
            return restClientService.doEC2InstanceStartUsingGET({id : id}).then(function(response) {
                var mapped = response.data;
                return mapped;
            });
            */

        };

        service.doEC2InstanceRestart = function (id) {

            /*
            return restClientService.doEC2InstanceRestartUsingGET({id : id}).then(function(response) {
                var mapped = response.data;
                return mapped;
            });
            */

        };

        service.doEC2InstanceStop = function (id) {

            /*
            return restClientService.doEC2InstanceStopUsingGET({id : id}).then(function(response) {
                var mapped = response.data;
                return mapped;
            });
            */

        };

        service.get = function () {

            return serviceMock.getAsync(serviceMock.getRandomList(serviceMock.getRandomVm)).then(function (response) {
                return response; // here should be response.data
            });

        };

        service.getAvailableTemplates = function () {

            return serviceMock.getAsync(serviceMock.getRandomList(serviceMock.getRandomVmTemplate)).then(function (response) {
                return response; // here should be response.data
            });

        };

        service.getAvailableSizing = function () {

            return serviceMock.getAsync(serviceMock.getRandomVmSizingList()).then(function (response) {
                return response; // here should be response.data
            });

        };

        service.getAvailablePlans = function () {

            return serviceMock.getAsync(serviceMock.getVmPlanList()).then(function (response) {
                return response; // here should be response.data
            });

        };

        service.getAvailableDiskSizing = function () {

            return serviceMock.getAsync(serviceMock.getVmDiskSizingList()).then(function (response) {
                return response; // here should be response.data
            });

        };

        service.getAvailableDiskTypes = function () {

            return serviceMock.getAsync(serviceMock.getRandomVmDiskTypeList()).then(function (response) {
                return response; // here should be response.data
            });

        };

        service.getAvailableAMIs = function () {

            return serviceMock.getAsync(serviceMock.getAMIList()).then(function (response) {
                return response; // here should be response.data
            });

        };

        service.mapEc2InstanceToVM = function (input) {
            var output = angular.copy(input);

            output.dataSource = service.getEc2DatasourceMetadata();

            return output;
        };

        service.getEc2DatasourceMetadata = function () {
            return {
                code: 'nivolaspsrv.aws.ec2',
                description: 'Servizio di computing EC2 - AWS platform'
            };
        };


        service.getAvailableVirtualizationOptions = function () {

            return serviceMock.getAsync([
                { id: 1, code: 'OpenStack', description: 'OpenStack' },
                { id: 2, code: 'VMWARE', description: 'VMware vSphere' }
            ]);

        };

        service.getAvailableRegions = function () {

            return serviceMock.getAsync([
                { id: 1, code: '13', description: 'Piemonte' }
            ]);

        };

        service.getAvailableAvailabilityZones = function () {

            return serviceMock.getAsync([
                { id: 1, code: 'TO1', site:'site01', description: 'IT-TO-1 - Torino 1' },
                { id: 2, code: 'TO2', site:'site02', description: 'IT-TO-2 - Torino 2' },
                { id: 9, code: 'VC1', site:'site03', description: 'IT-VC-1 - Vercelli 1' }
            ]);

        };

        service.getAvailableSubnets = function () {

            return serviceMock.getAsync([
                { id: 1, code: '13', description: 'subnet-13 | default' }
            ]);

        };


    }]);

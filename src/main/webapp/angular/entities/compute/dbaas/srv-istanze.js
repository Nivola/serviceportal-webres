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
angular.module('app').service('DBaaSIstanzeService', [
    'loggers', 'MockService', function (loggers, serviceMock) {
        var logger = loggers.get("srv-dbaas-istanze");

        var service = this;

        service.getById = function (id) {

            return serviceMock.getAsync(serviceMock.getRandomDBaaS()).then(function (response) {
                response.dataSource = service.getEc2DatasourceMetadata();
                return response; // here should be response.data
            });

        };

        service.get = function () {

            return serviceMock.getAsync(serviceMock.getRandomList(serviceMock.getRandomDBaaS)).then(function (response) {

                return $.grep(response, function (candidate) {
                    candidate.dataSource = service.getEc2DatasourceMetadata();
                    return true;
                }); // here should be response.data
            });

        };

        service.getAvailableDbTemplates = function () {

            return serviceMock.getAsync(serviceMock.getRandomList(serviceMock.getRandomDbTemplate)).then(function (response) {
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

            return serviceMock.getAsync(serviceMock.getDbDiskSizingList ()).then(function (response) {
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
                code: 'nivolaspsrv.mock.dbaas',
                description: 'Servizio mock DBaaS - Nivola'
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
                { id: 1, code: 'TO1', description: 'IT-TO-1 - Torino 1' },
                { id: 2, code: 'TO2', description: 'IT-TO-2 - Torino 2' },
                { id: 9, code: 'VC1', description: 'IT-VC-1 - Vercelli 1' }
            ]);

        };

        service.getAvailableSubnets = function () {

            return serviceMock.getAsync([
                { id: 1, code: '13', description: 'subnet-13 | default' }
            ]);

        };
    }]);

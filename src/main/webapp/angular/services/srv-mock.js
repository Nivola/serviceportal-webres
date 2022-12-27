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
nivolaApp.service('MockService', ['$http', 'loggers', '$q', '$mdToast', '$translate', 
    function ($http, loggers, $q, $mdToast, $translate) {

        var logger = loggers.get("mock-service");
        var thiz = this;

        /* Interface */
        thiz.logger = null;
        thiz.counter = 0;

        thiz.pickRandom;

        thiz.doAsync;
        thiz.getAsync;

        thiz.getRandom;
        thiz.getRandomBoolean;
        thiz.getRandomList;
        thiz.getNews;

        thiz.getRandomVmTemplate;
        thiz.getRandomVm;
        thiz.getRandomVmSizingList;

        thiz.notImplemented;

        thiz.getMyNewsMock = function () {
            return []
        };

        thiz.getUserRolesNEWMock = function () {
            return { }
        }
        /* Implementation */

        thiz.notImplemented = function () {
            $mdToast.show($mdToast.simple().textContent(
                'funzionalità non ancora implementata :('
            ));
        };

        thiz.pickRandom = function (items) {
            return items[Math.floor(Math.random() * items.length)];
        };

        thiz.doAsync = function (data, returnData, delay, delayMax) {
            if (!delay) delay = 500;
            if (!delayMax) delayMax = 2500;
            delay = delay + Math.random() * (delayMax - delay);

            var deferred = $q.defer();

            setTimeout(function () {
                deferred.resolve(data);
            }, delay);

            return deferred.promise;
        };

        thiz.getAsync = function (data, delay, delayMax) {
            if (!delay) delay = 500;
            if (!delayMax) delayMax = 2500;
            delay = delay + Math.random() * (delayMax - delay);

            var deferred = $q.defer();

            setTimeout(function () {
                deferred.resolve(data);
            }, delay);

            return deferred.promise;
        };

        
        thiz.getAsyncD = function (data, delay, delayMax) {
            if (!delay) delay = 500;
            if (!delayMax) delayMax = 2500;
            delay = delay + Math.random() * (delayMax - delay);

            var deferred = $q.defer();

            setTimeout(function () {
                deferred.resolve(data);
            }, delay);

            return deferred;
        };

        thiz.getNews = function () {
            return $http.get("https://newsapi.org/v1/articles?source=new-scientist&sortBy=top&apiKey=31447b02c893419fad0b069c2a8700b6")
                .then(function (response) {
                    return response.data.articles;
                });
        };

        thiz.getRandom = function (range) {
            if (!range) range = 10000;
            return Math.round(Math.random() * range);
        };

        thiz.getRandomBoolean = function (treshold) {
            return thiz.getRandom(100) <= (treshold || 50);
        };

        thiz.getRandomList = function (provider, n) {
            if (!n) n = (5 + thiz.getRandom(10));
            var l = [];
            for (var i = 0; i < n; i++) l.push(provider());
            return l;
        };

        thiz.getAMIList = function () {
            return thiz.getRandomList(thiz.getRandomVmTemplate, 8);
        };

        thiz.getVmPlanList = function () {
            return [
            ];
        };

        thiz.getRandomVmSizingList = function () {
            return [];
        };

        thiz.getRandomVmDiskTypeList = function () {
            var tipologia_gold = $translate.instant('vm.nuova.disco.tipologia_gold');
            var tipologia_silver = $translate.instant('vm.nuova.disco.tipologia_silver');

            return [];
        };

        thiz.getVmDiskSizingList = function () {
            return [
               // 20, 35, 50, 100, 200, 300, 500
                5, 7, 10, 15, 20 , 30 ,40, 50, 75 , 100 , 125 , 150 , 175 , 200 , 250 ,300 , 350 ,400 ,450 , 500
            ];
        };

        thiz.getDbDiskSizingList = function () {
            const fillRange = function (start, end, step) {
                return Array((end - start) / step + 1).fill().map((item, index) => start + index * step);
            };

            var firstSteps = fillRange(30, 50, 10);
            var secondSteps = fillRange(75, 175, 25);
            var thirdSteps = fillRange(200 , 500, 50);

            return firstSteps.concat(secondSteps).concat(thirdSteps);
        };

        thiz.getRandomDbTemplate = function () {
            var uid = thiz.getRandom();
            var db1 = thiz.getRandomBoolean() ? "PostgreSQL 9.6" : "MySQL 5.7";
            var db2 = thiz.getRandomBoolean() ? "SQLServer 2017" : "Oracle 12c";
            var db = thiz.getRandomBoolean() ? db1 : db2;
            return {
                code: uid,
                id: uid,
                name: db,   // + " - template " + uid,
                description: db + " template with code " + uid,
                softwareDescription: "preconfigurato"
            };
        };

        thiz.getRandomVmTemplate = function () {
            var uid = thiz.getRandom();
            var os1 = thiz.getRandomBoolean() ? "Ubuntu Server 14" : "CentOS 6";
            var os2 = thiz.getRandomBoolean() ? "Suse 15" : "Windows 10";
            var os3 = thiz.getRandomBoolean() ? "Debian 8" : "FreeBSD 12";
            var os4 = thiz.getRandomBoolean() ? "RedHat 7.5" : "OSX 11";
            var os12 = thiz.getRandomBoolean() ? os1 : os2;
            var os34 = thiz.getRandomBoolean() ? os3 : os4;
            var os = thiz.getRandomBoolean() ? os12 : os34;
            return {
                code: uid,
                id: uid,
                name: os,   // + " - template " + uid,
                description: os + " template with code " + uid,
                softwareDescription: "preconfigurato con Apache2 e JBoss 6.4 EAP"
            };
        };

        thiz.getRandomVm = function () {
            var id = ++thiz.counter;

            var GB = 1024 * 1024 * 1024;

            var o = {
                id: id,
                code: id,
                name: "Virtual machine #" + id,
                notes: "virtual machine autogenerata (mock data) #" + id,
                template: thiz.getRandomVmTemplate(),
                resources: [
                    { name: "N° CPU", valueDescription: "4" },
                    { name: "RAM", valueDescription: "16 GB" },
                    { name: "Disco OS", valueDescription: "40 GB" },
                    { name: "Disco Dati 1", valueDescription: "128 GB" },
                    { name: "Disco Dati 2", valueDescription: "128 GB" },

                ],
                status: {
                    running: true,
                    paused: false,
                    failed: false
                },
                pendingOperations: thiz.getRandomBoolean(20),
                authorizations: {
                    canView: true,
                    canManage: true,
                    canUse: true,
                    canDelete: false
                },
                ip: "10.102.184." + (60 + id > 200 ? 0 : id),
                network: "test_" + id
            };

            return o;
        };

        thiz.getRandomDBaaS = function () {
            var id = ++thiz.counter;

            var GB = 1024 * 1024 * 1024;
            var sizes = [20, 35, 50, 100, 200, 300, 500];

            var o = {};

            return o;
        };

    }]);


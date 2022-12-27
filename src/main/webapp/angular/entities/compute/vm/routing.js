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
nivolaApp.config(["$stateProvider", "conf", "AuthLevel",
    function ($stateProvider, conf, AuthLevel) {
        var context = conf.siteContext + "/angular/entities/compute/vm";

        $stateProvider

            // .state('app.vm', {
            //     url: '/vm',
            //     abstract: true,
            //     data: {
            //         'section': 'VM'
            //     }
            // })

            .state("app.vm", {
                url: "/vm",
                requiredUC: [
                    AuthLevel.AccountViewerRole,
                    AuthLevel.AccountOperatorRole,
                    AuthLevel.AccountAdminRole
                ].join(),
                views: {
                    "content@": {
                        templateUrl: context + "/tpl-list-vm.html",
                        controller: "ListVmController"
                    }
                }
            })
            .state("app.vm.new", {
                url: "/new",
                requiredUC: [
                    AuthLevel.AccountOperatorRole,
                    AuthLevel.AccountAdminRole
                ].join(),
                views: {
                    "content@": {
                        templateUrl: context + "/tpl-nuova-vm.html",
                        controller: "NuovaVmController"
                    }
                }
            })
            .state("app.vm.manage", {
                url: "/{idVm}/manage",
                requiredUC: [
                    AuthLevel.AccountViewerRole,
                    AuthLevel.AccountOperatorRole,
                    AuthLevel.AccountAdminRole
                ].join(),
                views: {
                    "content@": {
                        templateUrl: context + "/tpl-manage-vm.html",
                        controller: "ManageVmController"
                    }
                }
            })
            .state("app.vm.change", {
                url: "/vm/{idVm}/change",
                requiredUC: [
                    AuthLevel.AccountOperatorRole,
                    AuthLevel.AccountAdminRole
                ].join(),
                views: {
                    "content@": {
                        templateUrl: context + "/tpl-modifica-vm.html",
                        controller: "ModificaVmController"
                    }
                }
            });

    }]);

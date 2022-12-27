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
nivolaApp.config(["$stateProvider", "conf", "AuthLevel",
    function ($stateProvider, conf, AuthLevel) {
        var context = conf.siteContext + "/angular/entities/networking/vpc";

        $stateProvider

            // .state('app.vpc', {
            //     url: '/vpc',
            //     abstract: true,
            //     data: {
            //         'section': 'VPC'
            //     }
            // })

            .state("app.vpc", {
                url: "/vpc",
                requiredUC: [
                    AuthLevel.AccountViewerRole,
                    AuthLevel.AccountOperatorRole,
                    AuthLevel.AccountAdminRole
                ].join(),
                views: {
                    "content@": {
                        templateUrl: context + "/tpl-list-vpc.html",
                        controller: "ListVpcController"
                    }
                }
            })
            .state("app.vpc.new", {
                url: "/new",
                requiredUC: [
                    AuthLevel.AccountOperatorRole,
                    AuthLevel.AccountAdminRole
                ].join(),
                // views: {
                //     "content@": {
                //         templateUrl: context + "/tpl-nuova-vpc.html",
                //         controller: "NuovaVpcController"
                //     }
                // }
            })
            .state("app.vpc.change", {
                url: "/vpc/{idVpc}/change",
                requiredUC: [
                    AuthLevel.AccountOperatorRole,
                    AuthLevel.AccountAdminRole
                ].join(),
                // views: {
                //     "content@": {
                //         templateUrl: context + "/tpl-nuova-vpc.html",
                //         controller: "ModificaVpcController"
                //     }
                // }
            });
    }]);

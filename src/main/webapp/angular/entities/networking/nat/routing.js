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
        var context = conf.siteContext + "/angular/entities/networking/nat";

        $stateProvider

            // .state('app.nat', {
            //     url: '/nat',
            //     abstract: true,
            //     data: {
            //         'section': 'VPC'
            //     }
            // })

            .state("app.nat", {
                url: "/nat",
                requiredUC: [
                    AuthLevel.AccountViewerRole,
                    AuthLevel.AccountOperatorRole,
                    AuthLevel.AccountAdminRole
                ].join(),
                views: {
                    "content@": {
                        templateUrl: context + "/tpl-list-nat.html",
                        controller: "ListNatController"
                    }
                }
            })
            .state("app.nat.new", {
                url: "/new",
                requiredUC: [
                    AuthLevel.AccountOperatorRole,
                    AuthLevel.AccountAdminRole
                ].join(),
                // views: {
                //     "content@": {
                //         templateUrl: context + "/tpl-nuova-nat.html",
                //         controller: "NuovaNatController"
                //     }
                // }
            })
            .state("app.nat.change", {
                url: "/nat/{idNat}/change",
                requiredUC: [
                    AuthLevel.AccountOperatorRole,
                    AuthLevel.AccountAdminRole
                ].join(),
                // views: {
                //     "content@": {
                //         templateUrl: context + "/tpl-nuova-nat.html",
                //         controller: "ModificaNatController"
                //     }
                // }
            });
    }]);

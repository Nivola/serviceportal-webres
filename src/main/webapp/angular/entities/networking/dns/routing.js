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
        var context = conf.siteContext + "/angular/entities/networking/dns";

        $stateProvider

            // .state('app.dns', {
            //     url: '/dns',
            //     abstract: true,
            //     data: {
            //         'section': 'VPC'
            //     }
            // })

            .state("app.dns", {
                url: "/dns",
                requiredUC: [
                    AuthLevel.AccountViewerRole,
                    AuthLevel.AccountOperatorRole,
                    AuthLevel.AccountAdminRole
                ].join(),
                views: {
                    "content@": {
                        templateUrl: context + "/tpl-list-dns.html",
                        controller: "ListDnsController"
                    }
                }
            })
            .state("app.dns.new", {
                url: "/new",
                requiredUC: [
                    AuthLevel.AccountOperatorRole,
                    AuthLevel.AccountAdminRole
                ].join(),
                // views: {
                //     "content@": {
                //         templateUrl: context + "/tpl-nuova-dns.html",
                //         controller: "NuovaDnsController"
                //     }
                // }
            })
            .state("app.dns.change", {
                url: "/dns/{idDns}/change",
                requiredUC: [
                    AuthLevel.AccountOperatorRole,
                    AuthLevel.AccountAdminRole
                ].join(),
                // views: {
                //     "content@": {
                //         templateUrl: context + "/tpl-nuova-dns.html",
                //         controller: "ModificaDnsController"
                //     }
                // }
            });
    }]);

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
        var context = conf.siteContext + "/angular/entities/networking/lb";

        $stateProvider

            // .state('app.lb', {
            //     url: '/lb',
            //     abstract: true,
            //     data: {
            //         'section': 'VPC'
            //     }
            // })

            .state("app.lb", {
                url: "/lb",
                requiredUC: [
                    AuthLevel.AccountViewerRole,
                    AuthLevel.AccountOperatorRole,
                    AuthLevel.AccountAdminRole
                ].join(),
                views: {
                    "content@": {
                        templateUrl: context + "/tpl-list-lb.html",
                        controller: "ListLbController"
                    }
                }
            })
            .state("app.lb.new", {
                url: "/new",
                requiredUC: [
                    AuthLevel.AccountOperatorRole,
                    AuthLevel.AccountAdminRole
                ].join(),
                // views: {
                //     "content@": {
                //         templateUrl: context + "/tpl-nuova-lb.html",
                //         controller: "NuovaLbController"
                //     }
                // }
            })
            .state("app.lb.change", {
                url: "/lb/{idLb}/change",
                requiredUC: [
                    AuthLevel.AccountOperatorRole,
                    AuthLevel.AccountAdminRole
                ].join(),
                // views: {
                //     "content@": {
                //         templateUrl: context + "/tpl-nuova-lb.html",
                //         controller: "ModificaLbController"
                //     }
                // }
            });
    }]);

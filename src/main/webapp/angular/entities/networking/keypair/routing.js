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
        var context = conf.siteContext + "/angular/entities/networking/keypair";

        $stateProvider

            .state("app.keypair", {
                url: "/keypairs",
                requiredUC: [
                    AuthLevel.AccountViewerRole,
                    AuthLevel.AccountOperatorRole,
                    AuthLevel.AccountAdminRole
                ].join(),
                views: {
                    "content@": {
                        templateUrl: context + "/tpl-list-keypairs.html",
                        controller: "ListKeypairsController"
                    }
                }
            })
            // .state("app.snapshots", {
            //     url: "/listasnapshots",
            //     requiredUC: [
            //         AuthLevel.AccountViewerRole,
            //         AuthLevel.AccountOperatorRole,
            //         AuthLevel.AccountAdminRole
            //     ].join(),
            //     views: {
            //         "content@": {
            //             templateUrl: context + "/tpl-list-snapshots.html",
            //             controller: "ListSnapshotsController"
            //         }
            //     }
            // })

            .state("app.keypair.new", {
                url: "",
                requiredUC: [
                    AuthLevel.AccountOperatorRole,
                    AuthLevel.AccountAdminRole
                ].join(),
                views: {}
            })
            .state("app.keypair.import", {
                url: "",
                requiredUC: [
                    AuthLevel.AccountOperatorRole,
                    AuthLevel.AccountAdminRole
                ].join(),
                views: {}
            })
            .state("app.keypair.delete", {
                url: "",
                requiredUC: [
                    AuthLevel.AccountOperatorRole,
                    AuthLevel.AccountAdminRole
                ].join(),
                views: {}
            });
 
    }]);

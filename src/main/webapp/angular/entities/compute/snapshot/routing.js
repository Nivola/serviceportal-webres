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
        var context = conf.siteContext + "/angular/entities/compute/snapshot";

        $stateProvider

            .state("app.snapshots", {
                url: "/listasnapshots",
                requiredUC: [
                    AuthLevel.AccountViewerRole,
                    AuthLevel.AccountOperatorRole,
                    AuthLevel.AccountAdminRole
                ].join(),
                views: {
                    "content@": {
                       templateUrl: context + "/tpl-list-snapshots.html",
                        controller: "ListSnapshotsController"
                    }
                }
            })
            .state("app.snapshots.new", {
                url: "",
                requiredUC: [
                    AuthLevel.AccountOperatorRole,
                    AuthLevel.AccountAdminRole
                ].join(),
                views: {}
            }) .state("app.snapshots.delete", {
                url: "",
                requiredUC: [
                    AuthLevel.AccountOperatorRole,
                    AuthLevel.AccountAdminRole
                ].join(),
                views: {}
            })

           
    }]);

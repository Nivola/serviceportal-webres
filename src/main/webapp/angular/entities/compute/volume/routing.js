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
        var context = conf.siteContext + "/angular/entities/compute/volume";

        $stateProvider

            
            .state("app.volume", {
                url: "/volume",
                requiredUC: [
                    AuthLevel.AccountViewerRole,
                    AuthLevel.AccountOperatorRole,
                    AuthLevel.AccountAdminRole
                ].join(),
                views: {
                    "content@": {
                        templateUrl: context + "/tpl-list-volumi.html",
                        controller: "ListVolumiController"
                    }
                }
            })
            .state("app.volume.nuovo", {
                url: "/nuovo",
                requiredUC: [
                    AuthLevel.AccountViewerRole,
                    AuthLevel.AccountOperatorRole,
                    AuthLevel.AccountAdminRole
                ].join(),
                views: {
                    "content@": {
                        templateUrl: context + "/tpl-nuovo-volume.html",
                        controller: "NewVolumeController"
                    }
                }
            })
            .state("app.volume.manage", {
                url: "/{idVolume}/manage",
                params:{
                    volume:{},
                    tabIndex : null
                },
                requiredUC: [
                    AuthLevel.AccountViewerRole,
                    AuthLevel.AccountOperatorRole,
                    AuthLevel.AccountAdminRole
                ].join(),
                views: {
                    "content@": {
                        templateUrl: context + "/tpl-manage-volume.html",
                        controller: "GestioneVolumeController"
                    }
                }
            });

            

       
    }]);

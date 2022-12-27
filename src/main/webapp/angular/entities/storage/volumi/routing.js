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
    var context = conf.siteContext + "/angular/entities/storage/volumi";

    $stateProvider
      .state("app.volumes", {
        url: "/volumes",
        requiredUC: [
          AuthLevel.AccountViewerRole,
          AuthLevel.AccountOperatorRole,
          AuthLevel.AccountAdminRole
        ].join(),
        views: {
          "content@": {
            templateUrl: context + "/tpl-list-volumes.html",
            controller: "ListVolumesController"
          }
        }
      })
      .state("app.volumes.new", {
        url: "/new",
        requiredUC: [
          AuthLevel.AccountOperatorRole,
          AuthLevel.AccountAdminRole
        ].join(),
        views: {
          "content@": {
            templateUrl: context + "/tpl-nuovo-volume.html",
            controller: "NuovoVolumeController"
          }
        }
      })
      .state("app.volumes.manage", {
        url: "/volume/{volumeId}/manage",
        params:{
          volume:{}
        },
        requiredUC: [
          AuthLevel.AccountViewerRole,
          AuthLevel.AccountOperatorRole,
          AuthLevel.AccountAdminRole
        ].join(),
        views: {
          "content@": {
            templateUrl: context + "/tpl-manage-volume.html",
            controller: "ManageVolumeController"
          }
        }
      })
      .state("app.volumes.change", {
        url: "/volume/{volumeId}/change",
        params:{
          nvlCapabilities:{}
        },
        requiredUC: [
          AuthLevel.AccountViewerRole,
          AuthLevel.AccountOperatorRole,
          AuthLevel.AccountAdminRole
        ].join(),
        views: {
          "content@": {
            templateUrl: context + "/tpl-modifica-volume.html",
            controller: "ModificaVolumeController"
          }
        }
      })
      .state("app.volumes.delete", {
        url: "/volume/{volumeId}/delete",
        requiredUC: [
          AuthLevel.AccountOperatorRole,
          AuthLevel.AccountAdminRole
        ].join()
      })
      .state("app.volumes.newgrant", {
        url: "/volume/{volumeId}/grants/new",
        requiredUC: [
          AuthLevel.AccountOperatorRole,
          AuthLevel.AccountAdminRole
        ].join(),
        views: {
          "content@": {
            templateUrl: context + "/tpl-nuovo-grant.html",
            controller: "NuovoGrantController"
          }
        }
      });
  }]);

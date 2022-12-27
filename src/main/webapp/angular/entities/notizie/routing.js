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
    var context = conf.siteContext + "/angular/entities/notizie";

    $stateProvider
      .state("app.creaNotizia", {
        url: "/notizie/nuova",
        requiredUC: [
          AuthLevel.SUPERADMIN,
          AuthLevel.BOADMIN,
          // AuthLevel.BOMONITORING,
          AuthLevel.OrgAdminRole,
          AuthLevel.DivAdminRole,
          AuthLevel.AccountAdminRole
        ].join(","),
        views: {
          "content@": {
            templateUrl: context + "/tpl-notizia-crea.html",
            controller: "CreaNotiziaController"
          }
        }
      })
    

      .state("app.listNotizie", {
        url: "/listaNotizie",
        views: {
          "content@": {
            templateUrl: context + "/tpl-list-notizie.html",
            controller: "ListNotizieController"
          }
        },
        stateParams: {
          entity: null
        }
      })


      .state("app.visualizzaNotizia", {
        url: "/notizia/{idNotizia}/dettaglio",
        requiredUC: [
          AuthLevel.SUPERADMIN,
          AuthLevel.BOADMIN,
          AuthLevel.BOMONITORING,
          AuthLevel.OrgAdminRole,
          AuthLevel.DivAdminRole,
          AuthLevel.AccountAdminRole,
          AuthLevel.OrgOperatorRole,
          AuthLevel.DivOperatorRole,
          AuthLevel.AccountOperatorRole,
          AuthLevel.OrgViewerRole,
          AuthLevel.DivViewerRole,
          AuthLevel.AccountViewerRole
        ].join(","),
        views: {
          "content@": {
            templateUrl: context + "/tpl-notizia-details.html",
            controller: "DetailsNotiziaController"
          }
        }
      })
      .state("app.modificaNotizia", {
        url: "/notizia/{idNotizia}/modifica",
        requiredUC: [
          AuthLevel.SUPERADMIN,
          AuthLevel.BOADMIN,
          // AuthLevel.BOMONITORING,
          // AuthLevel.OrgAdminRole,
          // AuthLevel.DivAdminRole,
          // AuthLevel.AccountAdminRole,
          // AuthLevel.OrgOperatorRole,
          // AuthLevel.DivOperatorRole,
          // AuthLevel.AccountOperatorRole,
          // AuthLevel.OrgViewerRole,
          // AuthLevel.DivViewerRole,
          // AuthLevel.AccountViewerRole
        ].join(","),
        views: {
          "content@": {
            templateUrl: context + "/tpl-notizia-modifica.html",
            controller: "ModificaNotiziaController"
          }
        }
      });
  }
]);

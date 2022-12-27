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
    var context = conf.siteContext + "/angular/entities/listini";

    $stateProvider
      .state("app.elencoListini", {
        url: "/elencoListini",
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
            templateUrl: context + "/tpl-list-listini.html",
            controller: "ElencoListiniController"
          }
        }
      })
      .state("app.visualizzaListino", {
        url: "/listini/dettaglio",
        params:{
          listino:{}
        },
        requiredUC: [
          AuthLevel.SUPERADMIN,
          AuthLevel.BOADMIN,
          // AuthLevel.BOMONITORING,
          AuthLevel.OrgAdminRole,
          AuthLevel.DivAdminRole,
          AuthLevel.AccountAdminRole
        ].join(),
        views: {
          "content@": {
            templateUrl: context + "/tpl-visualizza-listino.html",
            controller: "VisualizzaListinoController"
          }
        }
      })
      .state("app.newListino", {
        url: "/listini/new",
        requiredUC: [
          AuthLevel.SUPERADMIN,
          AuthLevel.BOADMIN,
          AuthLevel.BOMONITORING
        //   AuthLevel.OrgAdminRole,
        //   AuthLevel.DivAdminRole,
        //   AuthLevel.AccountViewerRole,
        //   AuthLevel.AccountAdminRole,
        //   AuthLevel.OrgOperatorRole,
        //   AuthLevel.DivOperatorRole,
        //   AuthLevel.AccountOperatorRole,
        //   AuthLevel.OrgViewerRole,
        //   AuthLevel.DivViewerRole,
          
        ].join(","),
        views: {
          "content@": {
            templateUrl: context + "/tpl-visualizza-utente.html",
            controller: "NuovoListinoController"
          }
        }
      })
    
  }
]);


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
  function($stateProvider, conf, AuthLevel) {
    var context = conf.siteContext + "/angular/entities/struttura-organizzativa/divisioni/";
    var listAuthView = [AuthLevel.BOADMIN, AuthLevel.SUPERADMIN, 
                        AuthLevel.OrgAdminRole, AuthLevel.OrgOperatorRole, AuthLevel.OrgViewerRole,
                        AuthLevel.DivAdminRole, AuthLevel.DivOperatorRole, AuthLevel.DivViewerRole].join();

    var listAuthInsert = [AuthLevel.BOADMIN, AuthLevel.SUPERADMIN, 
                          AuthLevel.OrgAdminRole, AuthLevel.DivAdminRole].join();

    var listAuthDelete = [AuthLevel.BOADMIN, AuthLevel.SUPERADMIN, 
                          AuthLevel.OrgAdminRole, AuthLevel.DivAdminRole].join();

    var listAuthChange = [AuthLevel.BOADMIN, AuthLevel.SUPERADMIN, 
                          AuthLevel.OrgAdminRole, AuthLevel.OrgOperatorRole,
                          AuthLevel.DivAdminRole, AuthLevel.DivOperatorRole].join();

    $stateProvider
      .state("app.divisione", {
        url: "/organizzazione/:idOrganizzazione/divisione",
        requiredUC: listAuthView,
        views: {
          "content@": {
            templateUrl: context + "tpl-list-divisioni.html",
            controller: "ListDivisioniController"
          }
        }
      })
      .state("app.divisione.view", {
        url: "/{idDivisione}",
        requiredUC: listAuthView,
        views: {
          "content@": {
            templateUrl: context + "tpl-visualizza-divisione.html",
            controller: "VisualizzaDivisioneController"
          }
        }
      })
      .state("app.divisione.change", {
        url: "/{idDivisione}/change",
        requiredUC: listAuthChange,
        views: {
          "content@": {
            templateUrl: context + "tpl-modifica-divisione.html",
            controller: "ModificaDivisioneController"
          }
        }
      })
      .state("app.divisione.new", {
        url: "/{idDivisione}/new",
        requiredUC: listAuthInsert,
        views: {
          "content@": {
            templateUrl: context + "tpl-nuova-divisione.html",
            controller: "NuovaDivisioneController"
          }
        }
      }).state("app.divisione.delete", {
        requiredUC: listAuthDelete
      });
}]);

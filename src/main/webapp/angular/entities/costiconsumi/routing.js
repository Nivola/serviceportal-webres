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
nivolaApp.config([
  "$stateProvider",
  "$urlRouterProvider",
  "conf","AuthLevel",
  function ($stateProvider, $urlRouterProvider, conf,AuthLevel) {
    var context = conf.siteContext + "/angular/entities/costiconsumi";

    $stateProvider

      .state("app.costiconsumi", {
        url: "/costiconsumi/{idAccount}",
        requiredUC:[AuthLevel.OrgAdminRole, AuthLevel.DivAdminRole, AuthLevel.AccountAdminRole, AuthLevel.AccountOperatorRole, AuthLevel.AccountViewerRole,  AuthLevel.BOADMIN, AuthLevel.BOMONITORING, AuthLevel.SUPERADMIN].join(),//backoffice
        views: {
          "content@": {
            templateUrl: context + "/tpl-list-costiconsumi.html",
            controller: "ListCostiConsumiController"
          }
        },
        stateParams: {
          entity: null
        }
      })
      .state("app.costiconsumi.div", {
        url: "/costiconsumidiv/{idDiv}",
        requiredUC:[AuthLevel.OrgAdminRole, AuthLevel.DivAdminRole, AuthLevel.DivViewerRole,  AuthLevel.BOADMIN, AuthLevel.BOMONITORING, AuthLevel.SUPERADMIN].join(),//backoffice
        views: {
          "content@": {
            templateUrl: context + "/tpl-div-list-costiconsumi.html",
            controller: "ListCostiConsumiDivisioneController"
          }
        },
        stateParams: {
          entity: null
        }
      })
      .state("app.costiconsumi.org", {
        url: "/costiconsumiorg",
        requiredUC:[AuthLevel.OrgAdminRole, AuthLevel.OrgViewerRole, AuthLevel.OrgOperatorRole, AuthLevel.BOADMIN, AuthLevel.BOMONITORING, AuthLevel.SUPERADMIN].join(),//backoffice
        views: {
          "content@": {
            templateUrl: context + "/tpl-org-list-costiconsumi.html",
            controller: "ListCostiConsumiOrganizzazioneController"
          }
        },
        stateParams: {
          entity: null
        }
      })
      ;
  }
]);

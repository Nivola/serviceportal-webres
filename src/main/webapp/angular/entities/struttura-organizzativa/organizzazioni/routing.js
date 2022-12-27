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
    var context = conf.siteContext + "/angular/entities/struttura-organizzativa/organizzazioni/";
    var listAuthView = [AuthLevel.BOADMIN, AuthLevel.SUPERADMIN, 
                        AuthLevel.OrgAdminRole, AuthLevel.OrgOperatorRole, AuthLevel.OrgViewerRole];

    var listAuthInsert = [AuthLevel.BOADMIN, AuthLevel.SUPERADMIN, 
                          AuthLevel.OrgAdminRole].join();

    var listAuthDelete = [AuthLevel.BOADMIN, AuthLevel.SUPERADMIN, 
                          AuthLevel.OrgAdminRole].join();

    var listAuthChange = [AuthLevel.BOADMIN, AuthLevel.SUPERADMIN, 
                          AuthLevel.OrgAdminRole, AuthLevel.OrgOperatorRole].join();

    $stateProvider
      .state("app.organizzazioni", {
        url: "/organizzazioni",
        requiredUC: listAuthView,
        views: {
          "content@": {
            templateUrl: context + "tpl-list-organizzazioni.html",
            controller: "ListOrganizzazioniController"
          }
        }
      })
      .state("app.visualizzaOrganizzazione", {
        url: "/organizzazione/visualizza/{idOrganizzazione}/{new}",
        requiredUC: listAuthView,
        views: {
          "content@": {
            templateUrl: context + "tpl-visualizza-organizzazione.html",
            controller: "VisualizzaOrganizzazioneController"
          }
        }
      })
      .state("app.modificaOrganizzazione", {
        url: "/organizzazione/modifica/{idOrganizzazione}",
        requiredUC: listAuthChange,
        views: {
          "content@": {
            templateUrl: context + "tpl-modifica-organizzazione.html",
            controller: "ModificaOrganizzazioneController"
          }
        }
      })
      .state("app.nuovaOrganizzazione", {
        url: "/organizzazione/inserisci",
        requiredUC: listAuthInsert,
        views: {
          "content@": {
            templateUrl: context + "tpl-nuova-organizzazione.html",
            controller: "NuovaOrganizzazioneController"
          }
        }
      });
}]);

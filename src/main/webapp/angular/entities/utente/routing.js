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
    var context = conf.siteContext + "/angular/entities/utente";

    $stateProvider
    .state("app.SignInGuestUser", {
      url: "/guest/signin",
      //requiredUC : 'BOADMIN',
      views: {
          "content@": {
              templateUrl:
                  context + "/tpl-form-ospite.html",
              controller: "RegistraOspiteController"
          }
      }
    })
      .state("app.registraUtente", {
        url: "/utenteInserimento",
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
            templateUrl: context + "/tpl-form-utente.html",
            controller: "RegistraUtenteController"
          }
        }
      })
      .state("app.aggiornaUtente", {
        url: "/utenteAggiornamento/{idUtente}",
        requiredUC: [
          AuthLevel.SUPERADMIN,
          AuthLevel.BOADMIN,
        ].join(","),
        views: {
          "content@": {
            templateUrl: context + "/tpl-form-modifica-utente.html",
            controller: "ModificaUtenteController"
          }
        }
      })
      .state("app.listUtenti", {
        url: "/listaUtenti",
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
            templateUrl: context + "/tpl-list-utenti.html",
            controller: "ListUtentiController"
          }
        }
      })
      .state("app.visualizzaUtente", {
        url: "/utente/{idUtente}",
        requiredUC: [
          AuthLevel.SUPERADMIN,
          AuthLevel.BOADMIN,
          AuthLevel.BOMONITORING,
          AuthLevel.OrgAdminRole,
          AuthLevel.DivAdminRole,
          AuthLevel.AccountViewerRole,
          AuthLevel.AccountAdminRole,
          AuthLevel.OrgOperatorRole,
          AuthLevel.DivOperatorRole,
          AuthLevel.AccountOperatorRole,
          AuthLevel.OrgViewerRole,
          AuthLevel.DivViewerRole,
          
        ].join(","),
        views: {
          "content@": {
            templateUrl: context + "/tpl-visualizza-utente.html",
            controller: "VisualizzaUtenteController"
          }
        }
      })
      .state("app.visualizzaInfoUtente", {
        url: "/infoUtente/",
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
            templateUrl: context + "/tpl-visualizza-info-utente.html",
            controller: "VisualizzaInfoUtenteController"
          }
        }
      })
      .state("app.listUtenti.account", {
        url: "/organizzazione/divisione/account/utente",
        requiredUC: [
          AuthLevel.AccountAdminRole,  AuthLevel.AccountViewerRole
        ].join(),
        views: {
          "content@": {
            templateUrl: context + "/tpl-list-utenti-account.html",
            controller: "ListUtentiAccountsController"
          }
        }
      })

      .state("app.listUtenti.divisione", {
        url: "/organizzazione/divisione/utenti",
        requiredUC: [
          AuthLevel.DivAdminRole
        ].join(),
        views: {
          "content@": {
            templateUrl: context + "/tpl-list-utenti-divisione.html",
            controller: "ListUtentiDivisioneController"
          }
        }
      })

      .state("app.listUtenti.accredit", {
        url: "/organizzazione/divisione/utenti/accredit",
        requiredUC: [
          AuthLevel.DivAdminRole, 
          AuthLevel.OrgAdminRole,
          AuthLevel.AccountAdminRole,
        ].join(),
        views: {
          "content@": {
            templateUrl: context + "/tpl-form-utente-accredit.html",
            controller: "RegistraAccreditaUtenteController"
          }
        }
      })
      .state("app.listUtenti.accreditamento", {
        url: "/organizzazione/utenti/accredit",
        requiredUC: [
          AuthLevel.DivAdminRole, 
          AuthLevel.OrgAdminRole
        ].join(),
        views: {
          "content@": {
            templateUrl: context + "/tpl-form-utente-accredit-org.html",
            controller: "RegistraAccreditaUtenteOrgController"
          }
        }
      });
  }
]);


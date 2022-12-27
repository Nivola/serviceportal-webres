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
nivolaApp.config([
  "$stateProvider",
  "$urlRouterProvider",
  "conf",
  function ($stateProvider, $urlRouterProvider, conf) {
    var context = conf.siteContext + "/angular/entities/messaggistica";

    $stateProvider

      .state("app.messaggistica", {
        url: "/messaggistica",
        views: {
          "content@": {
            templateUrl: context + "/tpl-list-messaggi.html",
            controller: "ListMessaggiController"
          }
        },
        stateParams: {
          entity: null
        }
      })
      .state("app.messaggistica.view", {
        url: "/{idMessaggio}/details",
        views: {
          "content@": {
            templateUrl: context + "/tpl-messaggio-modifica.html",
            controller: "MessaggioModificaController"
          }
        },
        stateParams: {
          entity: null
        },
        data: {
          scenario: "DETAIL"
        }
      })
      // .state("app.messaggistica", {
      //   url: "/messaggistica",
      //   views: {
      //     "content@": {
      //       templateUrl: context + "/tpl-messaggistica.html",
      //       controller: "MessaggiListaController"
      //     }
      //   },
      //   stateParams: {
      //     entity: null
      //   }
      // })
      .state("app.messaggistica.modifica", {
        url: "/{idMessaggio}/modifica",
        requiredUC: "BOADMIN",
        views: {
          "content@": {
            templateUrl: context + "/tpl-messaggio-modifica.html",
            controller: "MessaggioModificaController"
          }
        },
        stateParams: {
          entity: null
        },
        data: {
          scenario: "MODIFICA"
        }
      })
      .state("app.messaggistica.nuovo", {
        url: "/nuovo",
        requiredUC: "BOADMIN",
        views: {
          "content@": {
            templateUrl: context + "/tpl-messaggio-modifica.html",
            controller: "MessaggioModificaController"
          }
        },
        data: {
          scenario: "CREA"
        }
      });
  }
]);

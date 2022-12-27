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
  function($stateProvider, $urlRouterProvider, conf) {
    var context = conf.siteContext + "";

    $stateProvider

      .state("app.tutorial", {
        url: "/tutorial",
        views: {
          "content@": {
            templateUrl:
              context + "/angular/entities/tutorial/tpl-tutorial.html",
            controller: "TutorialListaController"
          }
        },
        stateParams: {
          entity: null
        }
      })

      .state("app.tutorial.visualizza", {
        url: "/{idTutorial}/visualizza",
        views: {
          "content@": {
            templateUrl:
              context +
              "/angular/entities/tutorial/tpl-tutorial-visualizza.html",
            controller: "TutorialVisualizzaController"
          }
        },
        stateParams: {
          entity: null
        },
        data: {
          scenario: "VISUALIZZA"
        }
      })

      .state("app.tutorial.modifica", {
        url: "/{idTutorial}/modifica",
        requiredUC: "BOADMIN",
        views: {
          "content@": {
            templateUrl:
              context + "/angular/entities/tutorial/tpl-tutorial-modifica.html",
            controller: "TutorialModificaController"
          }
        },
        stateParams: {
          entity: null
        },
        data: {
          scenario: "MODIFICA"
        }
      })

      .state("app.tutorial.nuovo", {
        url: "/nuovo",
        requiredUC: "BOADMIN",
        views: {
          "content@": {
            templateUrl:
              context + "/angular/entities/tutorial/tpl-tutorial-modifica.html",
            controller: "TutorialModificaController"
          }
        },
        data: {
          scenario: "CREA"
        }
      });
  }
]);

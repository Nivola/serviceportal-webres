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
    var context = conf.siteContext + "/angular/entities/compute/backup";

    $stateProvider
      .state("app.jobs", {
        url: "/jobs",
        requiredUC: [
          AuthLevel.AccountViewerRole,
          AuthLevel.AccountOperatorRole,
          AuthLevel.AccountAdminRole
        ].join(),
        views: {
          "content@": {
            templateUrl: context + "/tpl-list-jobs.html",
            controller: "ListJobsController"
          }
        }
      })
      .state("app.jobs.new", {
        url: "/new",
        requiredUC: [
          AuthLevel.AccountViewerRole,
          AuthLevel.AccountOperatorRole,
          AuthLevel.AccountAdminRole
        ].join(),
        views: {
          "content@": {
            templateUrl: context + "/tpl-nuovo-job.html",
            controller: "NuovoJobController"
          }
        }
      })
      .state("app.jobs.manage", {
        url: "/job/{jobId}/manage",
        requiredUC: [
          AuthLevel.AccountViewerRole,
          AuthLevel.AccountOperatorRole,
          AuthLevel.AccountAdminRole
        ].join(),
        params: {
          jobId:null
        },
        views: {
          "content@": {
            templateUrl: context + "/tpl-manage-job.html",
            controller: "ManageJobController"
          }
        }
      })
      .state("app.jobs.change", {
        url: "/job/{jobId}/change",
        requiredUC: [
          AuthLevel.AccountViewerRole,
          AuthLevel.AccountOperatorRole,
          AuthLevel.AccountAdminRole
        ].join(),
        views: {
          "content@": {
            templateUrl: context + "/tpl-modifica-job.html",
            controller: "ModificaJobController"
          }
        }
      })
      .state("app.jobs.delete", {
        url: "/job/{jobId}/delete",
        requiredUC: [
          AuthLevel.AccountViewerRole,
          AuthLevel.AccountOperatorRole,
          AuthLevel.AccountAdminRole
        ].join()
      });
  }]);

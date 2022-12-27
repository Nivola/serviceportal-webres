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
        var context = conf.siteContext + "/angular/entities/compute/dbaas";

        $stateProvider
            .state("app.dbaas", {
                url: "/dbaas",
                requiredUC: [
                    AuthLevel.AccountViewerRole,
                    AuthLevel.AccountOperatorRole,
                    AuthLevel.AccountAdminRole
                ].join(),
                views: {
                    "content@": {
                        templateUrl: context + "/tpl-list-dbaas.html",
                        controller: "ListDbaasController"
                    }
                }
            })
            .state("app.dbaas.new", {
                url: "/new",
                requiredUC: [
                    AuthLevel.AccountOperatorRole,
                    AuthLevel.AccountAdminRole
                ].join(),
                views: {
                    "content@": {
                        templateUrl: context + "/tpl-nuovo-dbaas.html",
                        controller: "NuovoDbaasController"
                    }
                }
            })
            .state("app.dbaas.manage", {
                url: "/dbaas/{dbaasId}/manage",
                requiredUC: [
                    AuthLevel.AccountViewerRole,
                    AuthLevel.AccountOperatorRole,
                    AuthLevel.AccountAdminRole
                ].join(),
                views: {
                    "content@": {
                        templateUrl: context + "/tpl-manage-dbaas.html",
                        controller: "ManageDbaasController"
                    }
                }
            })
            .state("app.dbaas.change", {
                url: "/dbaas/{dbaasId}/change",
                requiredUC: [
                    AuthLevel.AccountOperatorRole,
                    AuthLevel.AccountAdminRole
                ].join(),
                views: {
                    "content@": {
                        templateUrl: context + "/tpl-modifica-dbaas.html",
                        controller: "ModificaDbaasController"
                    }
                }
            })
            .state("app.dbaas.delete", {
                url: "/dbaas/{dbaasId}/delete",
                requiredUC: [
                    AuthLevel.AccountOperatorRole,
                    AuthLevel.AccountAdminRole
                ].join()
            });

        ///////////////////////////////////////////////////////////////
        // OLD
        ///////////////////////////////////////////////////////////////

        // .state('app.dbaas', {
        //   url: '/dbaas',
        //   abstract: true,
        //   data: {
        //     'section': 'DBAAS'
        //   }
        // })
        // .state('app.dbaas.istanze', {
        //   url: '/istanze',
        //   views: {
        //     'content@': {
        //       templateUrl: context + '/tpl-istanze.html',
        //       controller: "DBaaSIstanzeController"
        //     }
        //   },
        // })
        // .state('app.dbaas.istanze.dettaglio', {
        //   url: '/{idIstanzaDBaaS}/dettaglio',
        //   views: {
        //     'content@': {
        //       templateUrl: context + '/tpl-istanza-dettaglio.html',
        //       controller: "DBaaSIstanzaDettaglioController"
        //     }
        //   },
        // })
        // .state('app.dbaas.nuova', {
        //   url: '/nuova',
        //   views: {
        //     'content@': {
        //       templateUrl: context + '/tpl-istanza-nuova.html',
        //       controller: "DBaaSIstanzaNuovaController"
        //     }
        //   },
        // });
    }]);

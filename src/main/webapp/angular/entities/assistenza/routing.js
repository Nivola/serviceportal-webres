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
        var context = conf.siteContext + "/angular/entities/assistenza";

        $stateProvider
            .state("app.formAssistenza", {
                url: "/assistenza/new",
                requiredUC: [
                    //AuthLevel.AccountOperatorRole,
                    AuthLevel.AccountAdminRole,
                    AuthLevel.AccountViewerRole
                ].join(),
                params: {
                    object: null,
                    body: null
                },
                views: {
                    "content@": {
                        templateUrl:
                            context + "/tpl-form-assistenza.html",
                        controller: "FormAssistenzaController"
                    }
                }
            })


            .state("app.formAssistenza.viewServiziCloud", {
                url: "/dettaglio/AnomaliaServiziCloud",
                requiredUC: [
                    AuthLevel.AccountOperatorRole,
                    AuthLevel.AccountAdminRole,
                    AuthLevel.AccountViewerRole
                ].join(),
                params: {
                    richiesta: null
                },
                views: {
                    "content@": {
                        templateUrl:
                            context + "/form-dettaglio-richiesta.html",
                        controller: "AnomaliaServiziCoudController"
                    }
                }
            })

            .state("app.formAssistenza.viewConnDiRete", {
                url: "/dettaglio/AnomaliaConnessioneDiRete",
                //requiredUC : 'BOADMIN',
                params: {
                    richiesta: null
                },
                views: {
                    "content@": {
                        templateUrl:
                            context + "/form-anomaliaConnessioneDiRete.html",
                        controller: "AnomaliaConnessioneDiReteController"
                    }
                }
            })





            .state("app.formAssistenza.serviziCloud", {
                url: "/incident/AnomaliaServiziCloud",
                requiredUC: [
                    AuthLevel.AccountOperatorRole,
                    AuthLevel.AccountAdminRole,
                    AuthLevel.AccountViewerRole
                ].join(),
                params: {
                    object: null,
                    body: null
                },
                views: {
                    "content@": {
                        templateUrl:
                            context + "/form-AnomaliaServiziCloud.html",
                        controller: "AnomaliaServiziCoudController"
                    }
                }
            })

            .state("app.formAssistenza.outputForm", {
                url: "/incident",
                requiredUC: [
                    AuthLevel.AccountOperatorRole,
                    AuthLevel.AccountAdminRole,
                    AuthLevel.AccountViewerRole
                    
                ].join(),
                params: {
                    riepilogoScelte: null,
                    qtec: null,
                    qserv: null,
                    qtipo: null,
                    qimpatto: null,
                    qsev: null
                },
                views: {
                    "content@": {
                        templateUrl:
                            context + "/tpl-form-output.html",
                        controller: "ctrOuputForm"
                    }
                }
            })

            
            .state("app.formAssistenza.connessioneRete", {
                url: "/incident/AnomaliaConnessioneDiRete",
                requiredUC: [
                    AuthLevel.AccountViewerRole,
                    AuthLevel.AccountOperatorRole,
                    AuthLevel.AccountAdminRole,
                    AuthLevel.OrgAdminRole,
                    AuthLevel.DivAdminRole
                  ].join(),
                params: {
                    object: null,
                    body: null
                },
                views: {
                    "content@": {
                        templateUrl:
                            context + "/form-anomaliaConnessioneDiRete.html",
                        controller: "AnomaliaConnessioneDiReteController"
                    }
                }
            })

            .state("app.listRichieste", {
                url: "/assistenza/tickets/inviati",
                requiredUC: [
                    AuthLevel.AccountOperatorRole,
                    AuthLevel.AccountAdminRole,
                    AuthLevel.AccountViewerRole,
                ].join(),
                views: {
                  "content@": {
                    templateUrl: context + "/tpl-list-richieste.html", // TODO cambiare ed adattare template e controller 
                    controller: "ListRichiesteController"
                  }
                },
                params:{
                    areRequestSent: true
                }
              })

              .state("app.listRichiesteBOAdmin", {
                url: "/assistenza/richieste",
                requiredUC: [
                    AuthLevel.BOADMIN, 
                    AuthLevel.BOMONITORING, 
                    AuthLevel.SUPERADMIN
                ].join(),
                views: {
                  "content@": {
                    templateUrl: context + "/tpl-list-richieste-BOAdmin.html", 
                    controller: "ListRichiesteBOAdminController"
                  }
                },
                params:{
                    areRequestSent: true
                }
              })

               .state("app.dettaglioRichiesta", {
                url: "/incident/dettaglio",
                requiredUC: [
                    AuthLevel.BOADMIN, 
                    AuthLevel.BOMONITORING, 
                    AuthLevel.SUPERADMIN
                ].join(),
                params: {
                    richiesta: null
                },
                views: {
                    "content@": {
                        templateUrl:
                        context + "/form-dettaglio-richiesta.html",
                        controller: "DettaglioRichiestaCoudController"
                    }
                }
            })

              .state("app.listBozze", {
                url: "/assistenza/tickets/bozze",
                requiredUC: [
                    AuthLevel.AccountOperatorRole,
                    AuthLevel.AccountAdminRole,
                    AuthLevel.AccountViewerRole
                ].join(),
                views: {
                    "content@": {
                      templateUrl: context + "/tpl-list-bozze.html", // TODO cambiare ed adattare template e controller 
                      controller: "ListRichiesteController"
                    }
                  },
                params:{
                    areRequestSent: false
                }
              });
    }
]);

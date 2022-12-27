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
    "$stateProvider", "conf", "AuthLevel",
    function ($stateProvider, conf, AuthLevel) {
        var context = conf.siteContext + "/angular/entities/documentazione";

        $stateProvider
            .state("app.condizioniGenerali", {
                url: "/condizioniGenerali",
                requiredUC: [
                    AuthLevel.OSPITE,
                    AuthLevel.BOADMIN, AuthLevel.BOMONITORING, AuthLevel.SUPERADMIN,
                    AuthLevel.AccountViewerRole, AuthLevel.AccountOperatorRole, AuthLevel.AccountAdminRole,
                    AuthLevel.DivViewerRole, AuthLevel.DivOperatorRole, AuthLevel.DivAdminRole,
                    AuthLevel.OrgViewerRole, AuthLevel.OrgOperatorRole, AuthLevel.OrgAdminRole
                ].join(),
                views: {
                    "content@": {
                        templateUrl: context + "/tpl-condizioni-generali.html",
                        controller: "CondizioniGeneraliController"
                    }
                }
            })
            .state("app.compliance", {
                url: "/compliance",
                requiredUC: [
                    AuthLevel.OSPITE,
                    AuthLevel.BOADMIN, AuthLevel.BOMONITORING, AuthLevel.SUPERADMIN,
                    AuthLevel.AccountViewerRole, AuthLevel.AccountOperatorRole, AuthLevel.AccountAdminRole,
                    AuthLevel.DivViewerRole, AuthLevel.DivOperatorRole, AuthLevel.DivAdminRole,
                    AuthLevel.OrgViewerRole, AuthLevel.OrgOperatorRole, AuthLevel.OrgAdminRole
                ].join(),
                views: {
                    "content@": {
                        templateUrl: context + "/tpl-compliance.html",
                        controller: "ComplianceController"
                    }
                }
            })
            .state("app.sla", {
                url: "/sla",
                requiredUC: [
                    AuthLevel.OSPITE,
                    AuthLevel.BOADMIN, AuthLevel.BOMONITORING, AuthLevel.SUPERADMIN,
                    AuthLevel.AccountViewerRole, AuthLevel.AccountOperatorRole, AuthLevel.AccountAdminRole,
                    AuthLevel.DivViewerRole, AuthLevel.DivOperatorRole, AuthLevel.DivAdminRole,
                    AuthLevel.OrgViewerRole, AuthLevel.OrgOperatorRole, AuthLevel.OrgAdminRole
                ].join(),
                views: {
                    "content@": {
                        templateUrl: context + "/tpl-sla.html",
                        controller: "SlaController"
                    }
                }
            })
            .state("app.documentiEManuali", {
                url: "/documentiEManuali",
                requiredUC: [
                    AuthLevel.OSPITE,
                    AuthLevel.BOADMIN, AuthLevel.BOMONITORING, AuthLevel.SUPERADMIN,
                    AuthLevel.AccountViewerRole, AuthLevel.AccountOperatorRole, AuthLevel.AccountAdminRole,
                    AuthLevel.DivViewerRole, AuthLevel.DivOperatorRole, AuthLevel.DivAdminRole,
                    AuthLevel.OrgViewerRole, AuthLevel.OrgOperatorRole, AuthLevel.OrgAdminRole
                ].join(),
                views: {
                    "content@": {
                        templateUrl: context + "/tpl-documentiEManuali.html",
                        controller: "documentiEManualiCtrl"
                    }
                },
                stateParams: {
                    entity: null
                }
            })
            .state("app.documentazione", {
                url: "/documentazione",
                requiredUC: [
                    AuthLevel.OSPITE,
                    AuthLevel.BOADMIN, AuthLevel.BOMONITORING, AuthLevel.SUPERADMIN,
                    AuthLevel.AccountViewerRole, AuthLevel.AccountOperatorRole, AuthLevel.AccountAdminRole,
                    AuthLevel.DivViewerRole, AuthLevel.DivOperatorRole, AuthLevel.DivAdminRole,
                    AuthLevel.OrgViewerRole, AuthLevel.OrgOperatorRole, AuthLevel.OrgAdminRole
                ].join(),
                views: {
                    "content@": {
                        templateUrl: context + "/tpl-documentazione.html",
                        controller: "DocumentiListaController"
                    }
                },
                stateParams: {
                    entity: null
                }
            })
            .state("app.documentazione.modifica", {
                url: "/{idDocumento}/modifica",
                requiredUC: [
                    AuthLevel.OSPITE,
                    AuthLevel.BOADMIN, AuthLevel.BOMONITORING, AuthLevel.SUPERADMIN,
                    AuthLevel.AccountViewerRole, AuthLevel.AccountOperatorRole, AuthLevel.AccountAdminRole,
                    AuthLevel.DivViewerRole, AuthLevel.DivOperatorRole, AuthLevel.DivAdminRole,
                    AuthLevel.OrgViewerRole, AuthLevel.OrgOperatorRole, AuthLevel.OrgAdminRole
                ].join(),
                views: {
                    "content@": {
                        templateUrl: context + "/tpl-documento-modifica.html",
                        controller: "DocumentoModificaController"
                    }
                },
                stateParams: {
                    entity: null
                },
                data: {
                    scenario: "MODIFICA"
                }
            })
            .state("app.documentazione.nuovo", {
                url: "/nuovo",
                requiredUC: [
                    AuthLevel.OSPITE,
                    AuthLevel.BOADMIN, AuthLevel.BOMONITORING, AuthLevel.SUPERADMIN,
                    AuthLevel.AccountViewerRole, AuthLevel.AccountOperatorRole, AuthLevel.AccountAdminRole,
                    AuthLevel.DivViewerRole, AuthLevel.DivOperatorRole, AuthLevel.DivAdminRole,
                    AuthLevel.OrgViewerRole, AuthLevel.OrgOperatorRole, AuthLevel.OrgAdminRole
                ].join(),
                views: {
                    "content@": {
                        templateUrl: context + "/tpl-documento-modifica.html",
                        controller: "DocumentoModificaController"
                    }
                },
                data: {
                    scenario: "CREA"
                }
            });
    }
]);

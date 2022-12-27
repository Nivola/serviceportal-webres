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
    var context = conf.siteContext + "/angular/entities/struttura-organizzativa/accounts";

    $stateProvider
      .state("app.account", {
        // url: "/organizzazione/divisione/:idDivisione/account",
        url: "/organizzazione/divisione/account",
        params: { 
          //idAccount:"",
          idDivisione:"",
          accountName: "",
          tabIndex:null
        },
        requiredUC: [
          AuthLevel.BOADMIN,
          AuthLevel.SUPERADMIN,
          AuthLevel.OrgAdminRole,
          AuthLevel.DivAdminRole,
          AuthLevel.AccountAdminRole
        ].join(),
        views: {
          "content@": {
            templateUrl: context + "/tpl-list-accounts.html",
            controller: "ListAccountsController"
          }
        }
      })
      .state("app.account.view", {
        url: "/organizzazione/divisione/account/{idAccount}",
        requiredUC: [
          AuthLevel.BOADMIN,
          AuthLevel.SUPERADMIN,
          AuthLevel.OrgAdminRole,
          AuthLevel.DivAdminRole
        ].join(),
        views: {
          "content@": {
            templateUrl: context + "/tpl-visualizza-account.html",
            controller: "VisualizzaAccountController"
          }
        }
      })
      .state("app.account.change", {
        url: "/organizzazione/divisione/account/{idAccount}/change",
        params: { 
          idAccount:"",
          idDivisione:"",
          accountName: "",
          tabIndex:null
        },
        requiredUC: [
          AuthLevel.BOADMIN,
          AuthLevel.SUPERADMIN,
        ].join(),
        views: {
          "content@": {
            templateUrl: context + "/tpl-modifica-account.html",
            controller: "ModificaAccountController"
          }
        }
      })
      .state("app.account.allegati", {
        url: "/organizzazione/divisione/account/{idAccount}/uploadfile",
        params: { 
          idAccount:"",
          idDivisione:"",
          accountName: "",
        },
        requiredUC: [
          AuthLevel.BOADMIN,
          AuthLevel.SUPERADMIN,
        ].join(),
        views: {
          "content@": {
            templateUrl: context + "/tpl-allegati-account.html",
            controller: "AllegatiAccountController"
          }
        }
      })
     
      .state("app.account.newinforendicontazione", {
        url: "/organizzazione/divisione/account/{idAccount}/newInfoR",
        params: { 
          idAccount:"",
          idDivisione:"",
          accountName: "",
        },
        requiredUC: [
          AuthLevel.BOADMIN,
          AuthLevel.SUPERADMIN,
          AuthLevel.OrgAdminRole,
          AuthLevel.DivAdminRole
        ].join(),
        views: {
          "content@": {
            templateUrl: context + "/tpl-nuova-info-rendicontazione-account.html",
            controller: "NuovaInfoRendicontazioneAccountController"
          }
        }
      })
      .state("app.account.newAssoShareAccount", {
        url: "/organizzazione/divisione/account/{idAccount}/newAssShareAcc",
        params: { 
          idAccount:"",
          idDivisione:"",
          accountName: "",
        },
        requiredUC: [
          AuthLevel.BOADMIN,
          AuthLevel.SUPERADMIN,
        ].join(),
        views: {
          "content@": {
            templateUrl: context + "/tpl-nuova-associazione-share-account.html",
            controller: "NuovaAssociazioneShareAccountController"
          }
        }
      })
      .state("app.account.editinforendicontazione", {
        url: "/organizzazione/divisione/account/{idAccount}/editInfoR",
        params: {
          infoRendicontazione:{},
          idAccount:null,
          accountName: "",
        },
        requiredUC: [
          AuthLevel.BOADMIN,
          AuthLevel.SUPERADMIN,
          AuthLevel.OrgAdminRole,
          AuthLevel.DivAdminRole
        ].join(),
        views: {
          "content@": {
            templateUrl: context + "/tpl-modifica-info-rendicontazione-account.html",
            controller: "ModificaInfoRendicontazioneAccountController"
          }
        }
      })
      .state("app.account.editassociazioneshareaccount", {
        url: "/organizzazione/divisione/account/{idAccount}/editAssShareAccount",
        params: {
          shareNettapp:{},
          idAccount:null,
          accountName: ""
          // tipologia: null,
          // dataInizio : null,
          // dataFine : null
        },
        requiredUC: [
          AuthLevel.BOADMIN,
          AuthLevel.SUPERADMIN
        ].join(),
        views: {
          "content@": {
            templateUrl: context + "/tpl-modifica-associazione-share-account.html",
            controller: "ModificaAssociazioneShareAccountController"
          }
        }
      })  
      .state("app.account.new", {
        url: "/organizzazione/divisione/account/{idAccount}/new",
        requiredUC: [
          AuthLevel.BOADMIN,
          AuthLevel.SUPERADMIN
          //AuthLevel.DivAdminRole
        ].join(),
        views: {
          "content@": {
            templateUrl: context + "/tpl-nuovo-account.html",
            controller: "NuovoAccountController"
          }
        }
      })

      .state("app.attivitaAccount", {
        url: "/account/attivita",
        requiredUC: [
            AuthLevel.AccountAdminRole,
            AuthLevel.AccountViewerRole,
            AuthLevel.BOADMIN,
            AuthLevel.OrgAdminRole,
            AuthLevel.DivAdminRole
        ].join(),
        params: {
          ArrayAttivita: null,
          accountName : null 
      },
        views: {
          "content@": {
            templateUrl: context + "/tpl-list-attivita-accounts.html",
            controller: "ListAttivitaAccountsController"
          }
        }
      })

      
      .state("app.QuoteAccount", {
        url: "/account/quote",
        requiredUC: [
            AuthLevel.AccountAdminRole,
            AuthLevel.AccountViewerRole
        ].join(),
        views: {
          "content@": {
            templateUrl: context + "/tpl-quote-accounts.html",
            controller: "QuoteAccountsController"
          }
        }
      })

       
      .state("app.listiniAccount", {
        url: "/account/listini",
        requiredUC: [
            AuthLevel.AccountAdminRole,
            AuthLevel.AccountViewerRole
        ].join(),
        views: {
          "content@": {
            templateUrl: context + "/tpl-listini-accounts.html",
            controller: "ListiniAccountsController"
          }
        }
      })

      .state("app.AllegatiAccount", {
        url: "/account/allegati",
        requiredUC: [
            AuthLevel.AccountAdminRole,
            AuthLevel.AccountViewerRole
        ].join(),
        views: {
          "content@": {
            templateUrl: context + "/tpl-list-allegati-accounts.html",
            controller: "ListAllegatiAccountsController"
          }
        }
      })

      .state("app.serviziGestione", {
        url: "/organizzazione/divisione/account/serviziGestione",
        // params: { 
        //   idAccount:"",
        //   idDivisione:"",
        //   accountName: "",
        // },
        requiredUC: [
          AuthLevel.AccountAdminRole,
          AuthLevel.AccountViewerRole
        ].join(),
        views: {
          "content@": {
            templateUrl: context + "/serviziGestione-account.html",
            controller: "ServizioGestioneAccount"
          }
        }
      })
      
      
  }]);


  

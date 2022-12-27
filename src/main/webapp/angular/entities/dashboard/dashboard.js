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
nivolaApp.factory("DashboarFactory", ["AuthLevel", "$translate", function (AuthLevel, $translate) {

  /* DASHBOARD */
  var templatePath = "angular/entities/dashboard/templates/";

  var dashboard = {
    name: "Dashboard",
    //version: "1.0.5.030",
    columns: []
  };

  /* CARD */

  var cardNotizie = {
    name: "cardNotizie",
    resize: "true",
    // title: "Notizie",
    title: $translate.instant("homepage.notizie.titolo"),
    type: "include",
    content: templatePath + "notizie.html",
    dataProviderService: "notizieDataProviderService",
    customActions: [
      {
        name: "done",
        icon: "done_all",
        event: "markAsRead",
        tooltip: $translate.instant("homepage.notizie.segna_lette"),
      }
    ]
  };


  var cardStatoServizi = {
    name: "cardStatoServizi",
    resize: "true",
    // title: "Stato dei servizi",
    title: $translate.instant("homepage.stato_servizi.titolo"),
    type: "include",
    content: templatePath + "stato-servizi.html",
    _minHeight: 400,
    dataProviderService: "servicesStatusDataProviderService",
    customActions: [
      {
        name: "refresh",
        icon: "autorenew",
        event: "refresh",
        tooltip: $translate.instant("homepage.stato_servizi.aggiorna")
      }
    ]
  };


  var cardStatoUtilizzatori = {
    name: "cardStatoUtilizzatori",
    resize: "true",
    // title: "Utilizzo piattaforma",
    title: $translate.instant("homepage.stato_utilizzatori.titolo"),
    type: "include",
    content: templatePath + "stato-utilizzatori.html",
    _minHeight: 400,
    dataProviderService: "statoUtilizzatoriDataProviderService"
  };

  var cardAvviso = {
    name: "cardAvviso&Notifiche",
    resize: "true",
    // title: "Avvisi e Notifiche",
    title: $translate.instant("homepage.avvisi_notifiche.titolo"),
    type: "include",
    content: templatePath + "avviso&notifiche.html",
    dataProviderService: "avviso&NotificheDataProviderService",
    customActions: [
      {
        name: "done",
        icon: "done_all",
        event: "markAsRead",
        tooltip: $translate.instant("homepage.avvisi_notifiche.segna_lette"),
      }
    ]
  };

  var cardRisorseOrganizzazione = {
    name: "cardRisorseOrganizzazione",
    resize: "true",
    // title: "Utilizzo piattaforma Organizzazione",
    title: $translate.instant("homepage.risorse_organizzazione.titolo"),
    type: "include",
    content: templatePath + "risorse-org.html",
    dataProviderService: "risorseOrganizzazioneDataProviderService"
  };

  var cardRisorseDivisione = {
    name: "cardRisorseDivisione",
    resize: "true",
    // title: "Utilizzo piattaforma Divisione",
    title: $translate.instant("homepage.risorse_divisione.titolo"),
    type: "include",
    content: templatePath + "risorse-div.html",
    dataProviderService: "risorseDivisioneDataProviderService"
  };

  //EK beggin

      // DIVISIONE
  var cardComputeDivisione = {
    name: "cardComputeDivision",
    resize: "true",
    // title: "Compute",
    title: $translate.instant("homepage.compute.titolo"),
    type: "include",
    content: templatePath + "computeServiceTemplate.html",
    dataProviderService: "risorseDivisioneDataProviderService"
  };

  var cardDataBaseDivision = {
    name: "cardDataBaseDivision",
    resize: "true",
    // title: "DataBase",
    title: $translate.instant("homepage.dbaas.titolo"),
    type: "include",
    content: templatePath + "dbaasTemplate.html",
    dataProviderService: "risorseDivisioneDataProviderService"
  };

  var cardStorageDivision = {
    name: "cardStorageDivision",
    resize: "true",
    // title: "Storage",
    title: $translate.instant("homepage.staas.titolo"),
    type: "include",
    content: templatePath + "staasTemplate.html",
    dataProviderService: "risorseDivisioneDataProviderService"
  };

     // ORGANISATION
  var cardComputeOrganisation = {
    name: "cardComputeOrganisation",
    resize: "true",
    // title: "Compute",
    title: $translate.instant("homepage.compute.titolo"),
    type: "include",
    content: templatePath + "computeServiceTemplate.html",
    dataProviderService: "risorseOrganizzazioneDataProviderService"
  };

  var cardDataBaseOrganisation = {
    name: "cardDataBaseOrganisation",
    resize: "true",
    // title: "DataBase",
    title: $translate.instant("homepage.dbaas.titolo"),
    type: "include",
    content: templatePath + "dbaasTemplate.html",
    dataProviderService: "risorseOrganizzazioneDataProviderService"
  };

  var cardStorageOrganisation = {
    name: "cardStorageOrganisation",
    resize: "true",
    // title: "Storage",
    title: $translate.instant("homepage.staas.titolo"),
    type: "include",
    content: templatePath + "staasTemplate.html",
    dataProviderService: "risorseOrganizzazioneDataProviderService"
  };
 


  // EK End 

  var cardPortafoglioOrganizzazione = {
    name: "cardPortafoglioOrganizzazione",
    resize: "true",
    // title: "Costi",
    title: $translate.instant("homepage.portafoglio.titolo"),
    type: "include",
    content: templatePath + "portafoglio-org.html",
    dataProviderService: "portafoglioOrganizzazioneDataProviderService"
  };

  var cardPortafoglioDivisione = {
    name: "cardPortafoglioDivisione",
    resize: "true",
    // title: "Costi",
    title: $translate.instant("homepage.portafoglio.titolo"),
    type: "include",
    content: templatePath + "portafoglio-div.html",
    dataProviderService: "portafoglioDivisioneDataProviderService"
  };

  var cardServiziAccount = {
    name: "cardServiziAccount",
    resize: "true",
    // title: "Servizi Attivi Account",
    title: $translate.instant("homepage.servizi_attivi.titolo"),
    type: "include",
    content: templatePath + "risorse.html",
    dataProviderService: "serviziAccountDataProviderService"
  };

  var cardCostiAccount = {
    name: "cardCostiAccount",
    resize: "true",
    // title: "Costi",
    title: $translate.instant("homepage.costi.titolo"),
    type: "include",
    content: templatePath + "costiAccount.html",
    dataProviderService: "costiDataProviderService"

  };

  var cardComputeService = {
    name: "cardComputeService",
    resize: "true",
    // title: "Compute",
    title: $translate.instant("homepage.compute.titolo"),
    type: "include",
    content: templatePath + "computeService.html",
    dataProviderService: "computeServiceDataProviderService"
  };

  var cardDBAAS = {
    name: "cardDBAAS",
    resize: "true",
    // title: "Database",
    title: $translate.instant("homepage.dbaas.titolo"),
    type: "include",
    content: templatePath + "dbaas.html",
    dataProviderService: "dbaasDataProviderService"
  };

  var cardSTAAS = {
    name: "cardSTAAS",
    resize: "true",
    // title: "Storage",
    title: $translate.instant("homepage.staas.titolo"),
    type: "include",
    content: templatePath + "staas.html",
    dataProviderService: "staasDataProviderService"
  };

  var cardAppEngine = {
    name: "cardAppEngine ",
    resize: "true",
    // title: "AppEngine ",
    title: $translate.instant("homepage.appengine.titolo"),
    type: "include",
    content: templatePath + "appEngine.html",
    dataProviderService: "appEngineDataProviderService"
  };

  /* COLUMNS */

  var default_columns = [
    {
      name: "column1",
      size: 50,
      background: "#ffffff",
      widgets: [cardNotizie]
    },
    {
      name: "column2",
      size: 50,
      background: "#ffffff",
      widgets: [cardAvviso]
    }
  ];

  var guest_columns = [
    {
      name: "column1",
      size: 50,
      background: "#ffffff",
      widgets: [cardNotizie]
    },
    {
      name: "column2",
      size: 50,
      background: "#ffffff",
      widgets: [cardStatoServizi]
    }
  ];


  var backoffice_columns = [
    {
      name: "column1",
      size: 50,
      background: "#ffffff",
      widgets: [cardNotizie]
    },
    {
      name: "column2",
      size: 50,
      background: "#ffffff",
      widgets: [cardStatoServizi,cardStatoUtilizzatori]
    }
  ];

  var organizzationRole_colums = [
    {
      name: "column1",
      size: 34,
      background: "#ffffff",
      widgets: [cardNotizie, cardAvviso]
    },
    {
      name: "column2",
      size: 33,
      background: "#ffffff",
      widgets: [cardRisorseOrganizzazione, cardPortafoglioOrganizzazione]
    },
    {
      name: "column3",
      size: 33,
      background: "#ffffff",
      widgets: [  cardComputeOrganisation, cardDataBaseOrganisation,  cardStorageOrganisation]
    }
  ];

  var divisionRole_colums = [
    {
      name: "column1",
      size: 34,
      background: "#ffffff",
      widgets: [cardNotizie, cardAvviso]
    },
    {
      name: "column2",
      size: 33,
      background: "#ffffff",
      
      widgets: [ cardRisorseDivisione, cardPortafoglioDivisione]
      
    },
    {
      name: "column3",
      size: 33,
      background: "#ffffff",
      widgets: [  cardComputeDivisione, cardDataBaseDivision, cardStorageDivision]
      
    }
  ];

  var accountAdminRole_colums = [
    {
      name: "column1",
      size: 34,
      background: "#ffffff",
      widgets: [cardNotizie, cardAvviso]
    },
    {
      name: "column2",
      size: 33,
      background: "#ffffff",
      widgets: [cardServiziAccount,cardCostiAccount]
    },
    {
      name: "column3",
      size: 33,
      background: "#ffffff",
      // widgets: [cardComputeService, cardDBAAS, cardSTAAS, cardAppEngine]
      widgets: [cardComputeService, cardDBAAS, cardSTAAS]
    }
  ];

  var accountViewerRole_colums = [
    {
      name: "column1",
      size: 34,
      background: "#ffffff",
      widgets: [cardNotizie, cardAvviso]
    },
    {
      name: "column2",
      size: 33,
      background: "#ffffff",
      // widgets: [cardServiziAccount, cardCostiAccount, cardAppEngine],
      widgets: [cardServiziAccount, cardCostiAccount]
    },
    {
      name: "column3",
      size: 33,
      background: "#ffffff",
      widgets: [cardComputeService, cardDBAAS, cardSTAAS]
    }
  ];

  var accountOperatorRole_colums = [
    {
      name: "column1",
      size: 34,
      background: "#ffffff",
      widgets: [cardNotizie, cardAvviso]
    },
    {
      name: "column2",
      size: 33,
      background: "#ffffff",
      widgets: [cardServiziAccount]
    },
    {
      name: "column3",
      size: 33,
      background: "#ffffff",
      // widgets: [cardComputeService, cardDBAAS, cardSTAAS, cardAppEngine]
      widgets: [cardComputeService, cardDBAAS, cardSTAAS]
    }
  ];

  //utilizzato solo nel visualizza dettaglio account primo tab 
  var DettaglioAccountViewer_columns = [
		{
		  name: "column1",
		  size: 34,
		  background: "#ffffff",
		  widgets: [cardComputeService]
		},
		{
		  name: "column2",
		  size: 33,
		  background: "#ffffff",
		  widgets: [cardDBAAS]
		},
		{
		  name: "column3",
		  size: 33,
		  background: "#ffffff",
		  widgets: [ cardSTAAS]
		}
    ];
    

    var DettaglioDivisioneViewer_columns = [
      {
        name: "column1",
        size: 34,
        background: "#ffffff",
        widgets: [cardComputeService]
      },
      {
        name: "column2",
        size: 33,
        background: "#ffffff",
        widgets: [cardDBAAS]
      },
      {
        name: "column3",
        size: 33,
        background: "#ffffff",
        widgets: [ cardSTAAS]
      }
      ];



  return function (profile) {
    switch (profile) {
      case AuthLevel.SUPERADMIN:
      case AuthLevel.BOADMIN:
      case AuthLevel.BOMONITORING:
        dashboard.columns = angular.copy(backoffice_columns);
        break;

      case AuthLevel.OrgAdminRole:
      case AuthLevel.OrgOperatorRole:
      case AuthLevel.OrgViewerRole:
        dashboard.columns = angular.copy(organizzationRole_colums);
        break;

      case AuthLevel.DivAdminRole:
      case AuthLevel.DivOperatorRole:
      case AuthLevel.DivViewerRole:
        dashboard.columns = angular.copy(divisionRole_colums);
        break;

      case AuthLevel.AccountAdminRole:
        dashboard.columns = angular.copy(accountAdminRole_colums);
        break;
      
        case AuthLevel.AccountViewerRole:
        dashboard.columns = angular.copy(accountViewerRole_colums);
        break;
        case AuthLevel.AccountOperatorRole:
        dashboard.columns = angular.copy(accountOperatorRole_colums);
        break;
      case AuthLevel.DettaglioAccountViewer:
        dashboard.columns = angular.copy(DettaglioAccountViewer_columns);
        break;
      case AuthLevel.DettaglioDivisioneViewer:
          dashboard.columns = angular.copy(DettaglioDivisioneViewer_columns);
      break;
        
      //case AuthLevel.ROLE_ANONYMOUS:
      case AuthLevel.Ospite:
      default:
        dashboard.columns = angular.copy(guest_columns);
    }

    return dashboard;
  };
}]);

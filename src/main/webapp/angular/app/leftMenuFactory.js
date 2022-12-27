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
nivolaApp.factory('LeftMenuFactory', ['AuthLevel', 'conf', 'ReadthedocService', '$translate','AuthenticationService',
     function (AuthLevel, conf , ReadthedocService, $translate, AuthenticationService) {

   	// i18n - guida utente
    // var rtdindex=ReadthedocService.getUrlFromPath('/index').docUrl;
    // if (rtdindex == null) {
    	// rtdindex = "";
    	// rtdindex = "menu.documentazione.guida_utente.url";
    // }

    // var rtdcompliance=ReadthedocService.getUrlFromPath('/compliance').docUrl;
    // if (rtdcompliance == null) {
    	// rtdcompliance = "";
    // }

    var usaRemedy= AuthenticationService.getUtente().usaRemedy; 
    var allRoles = [
        AuthLevel.OSPITE,
        AuthLevel.BOADMIN, AuthLevel.BOMONITORING, AuthLevel.SUPERADMIN,
        AuthLevel.AccountViewerRole, AuthLevel.AccountOperatorRole, AuthLevel.AccountAdminRole,
        AuthLevel.DivViewerRole, AuthLevel.DivOperatorRole, AuthLevel.DivAdminRole,
        AuthLevel.OrgViewerRole, AuthLevel.OrgOperatorRole, AuthLevel.OrgAdminRole
    ].join();
    var allAuthenticatedRoles = [
        AuthLevel.BOADMIN, AuthLevel.BOMONITORING, AuthLevel.SUPERADMIN,
        AuthLevel.AccountViewerRole, AuthLevel.AccountOperatorRole, AuthLevel.AccountAdminRole,
        AuthLevel.DivViewerRole, AuthLevel.DivOperatorRole, AuthLevel.DivAdminRole,
        AuthLevel.OrgViewerRole, AuthLevel.OrgOperatorRole, AuthLevel.OrgAdminRole
    ].join();
    var allBackOfficeRoles = [AuthLevel.BOADMIN, AuthLevel.BOMONITORING, AuthLevel.SUPERADMIN].join();
    var allOperativeBackOfficeRoles = [AuthLevel.BOADMIN, AuthLevel.SUPERADMIN].join();
    var allOrganizzationRoles = [AuthLevel.OrgAdminRole, AuthLevel.OrgOperatorRole, AuthLevel.OrgViewerRole].join();
    var allDivisionRoles = [AuthLevel.DivAdminRole, AuthLevel.DivOperatorRole, AuthLevel.DivViewerRole].join();
    var allAccountRoles = [AuthLevel.AccountAdminRole, AuthLevel.AccountOperatorRole, AuthLevel.AccountViewerRole].join();
    var AdminViewerAccountRoles = [AuthLevel.AccountAdminRole, AuthLevel.AccountViewerRole].join();
    var allAdminRoles = [AuthLevel.OrgAdminRole, AuthLevel.DivAdminRole, AuthLevel.AccountAdminRole].join();
    var allOperatorRoles = [AuthLevel.OrgOperatorRole, AuthLevel.DivOperatorRole, AuthLevel.AccountOperatorRole].join();
    var allViewerRoles = [AuthLevel.OrgViewerRole, AuthLevel.DivViewerRole, AuthLevel.AccountViewerRole].join();
    var noRoles = AuthLevel.NoRoles;


    var allNotBackOfficeRoles = [
        AuthLevel.OSPITE,
        AuthLevel.AccountViewerRole, AuthLevel.AccountOperatorRole, AuthLevel.AccountAdminRole,
        AuthLevel.DivViewerRole, AuthLevel.DivOperatorRole, AuthLevel.DivAdminRole,
        AuthLevel.OrgViewerRole, AuthLevel.OrgOperatorRole, AuthLevel.OrgAdminRole
    ].join();

    function concatRoles(...roles) {
        var allRoles = roles[0];
        for (let i = 1; i < roles.length; i++) {
            allRoles = allRoles.concat(',', roles[i]);
        }
        return allRoles;
    }

    /*
        Livello 1 del menu :    
        {
            title:      --> titolo che appare sulla barra
            content:    --> array dei sottolivelli
        }

        Livello 2 del menu :    
        {
            title:      --> titolo che appare sulla barra
            kw:         --> parametri per la ricerca
            icon:       --> icona
            requireUc:  --> parametri per la sicurezza
            real:       --> se attivo o meno
            isDirect:   --> vero se non ha un sottomenu
            state:      --> apre una cpagina contestuale
            click:      --> alternativa a state, azione da compiere al click del mouse
            url:        --> eventuale pagina da aprire
            options:    --> array dei sottolivelli
        }

        Livello 3 del menu :    
        {
            name:       --> titolo che appare sulla barra
            kw:         --> parametri per la ricerca
            icon:       --> icona
            requireUc:  --> parametri per la sicurezza
            real:       --> se attivo o meno
            state:      --> apre una cpagina contestuale
            click:      --> alternativa a state, azione da compiere al click del mouse
            url:        --> eventuale pagina da aprire
        }

    */


    /*#############   MAIN MANU   #############*/

    var homepage = {
        //title: 'Home Page / Dashboard',
        title: $translate.instant('menu.homepage.titolo'),
        kw: 'home homepage dashboard inizio prima pagina',
        icon: 'home',
        real: true,
        isDirect: true,
        state: 'app.home',
        options: []
    }

    var documentazione = {
       // title: 'Documentazione',
        title: $translate.instant('menu.documentazione.titolo'),
        kw: 'documentazione manuali catalogo condizioni guida',
        icon: 'book',
        real: true,
        requireUc: allRoles,
        options: [{
            // name: 'Guida Utente',
            name: 'menu.documentazione.guida_utente.titolo',
            kw: 'guida utente',
            icon: 'help_outline',
            requireUc: allRoles,
            real: true,
            // click: 'openNewWindows',
            // url: rtdindex
            click: 'openNewWindowFromPath',
            url: '/index'
        },
        // {
        //     name: 'Guida Nivola Web Service',
        //     kw: 'guida nivola webservice',
        //     icon: 'help',
        //     requireUc: allRoles,
        //     real: false
        // }, {
        //     name: 'Video Tutorial',
        //     kw: 'video tutorial',
        //     icon: 'play_arrow',
        //     requireUc: allRoles,
        //     real: false,
        //     click: 'openNewWindows',
        //     url: ''
        // },
        {
            // name: 'Condizioni Generali',
            name: 'menu.documentazione.condizioni_generali',
            kw: 'condizioni generali servizio',
            icon: 'import_contacts',
            requireUc: allRoles,
            real: true,
            state: 'app.condizioniGenerali',
        }, {
            // name: 'Compliance',
            name: 'menu.documentazione.compliance',
            kw: 'compliance',
            icon: 'assignment_turned_in',
            requireUc: allRoles,
            real: true,
            // click: 'openNewWindows',
            // url: rtdcompliance
            click: 'openNewWindowFromPath',
            url: '/compliance'
            //state: 'app.compliance'
        }, {
            // SLA,
            name: 'menu.documentazione.sla',
            kw: 'condizioni generali servizio',
            icon: 'import_contacts',
            requireUc: allRoles,
            real: true,
            state: 'app.sla',
        }]
    }

    var assistenza_old = {
        // title: "Assistenza",
        title: $translate.instant("menu.assistenza.titolo"),
        kw: "contatti richieste assistenza help aiuto",
        icon: 'support_agent',
        real: true,
        options: [{
            // name: 'Area di condivisione',
            name: 'menu.assistenza.area_condivisione',
            kw: 'storage personale cloud area condivisa',
            icon: 'cloud',
            real: true,
            requireUc: allRoles,
            click: 'openNewWindows',
            url: ''
        }, /* {
            // name: 'Chat',
            name: 'menu.assistenza.chat',
            kw: 'chat di assistenza',
            icon: 'chat_bubble_outline',
            real: true,
            click: 'openChat'
        }, */{
            // name: 'Richiesta supporto',
            name: 'menu.assistenza.richiesta_supporto',
            kw: 'Invia una richiesta di assistenza al Nivola Support Center',
            icon: 'support',
            real: true,
            requireUc: allNotBackOfficeRoles,
            state: 'app.listRichieste'
        }]
    }

    var assistenza = {

        // title: "Assistenza",
        title: $translate.instant("menu.assistenza.titolo"),
        kw: "contatti richieste assistenza help aiuto",
        icon: 'support_agent',
        //requireUc: allAccountRoles,
        real: true,
        isDirect: false,
        options: [{
            name: 'menu.assistenza.inviate',
            //name: 'menu.servizi.compute.vm',
            kw: 'lista tickets inviati',
            icon: 'near_me',
            requireUc: allAccountRoles,
            real: true,
            state: 'app.listRichieste'
        },
        {
            name: 'menu.assistenza.aperti',
            //name: 'menu.servizi.compute.vm',
            kw: 'lista tickets aperti',
            icon: 'near_me',
            requireUc: allBackOfficeRoles,
            real: true,
            state: 'app.listRichiesteBOAdmin'
        },
        
        {
            name: 'menu.assistenza.bozze',
            //name: 'menu.servizi.compute.chiavi_ssh',
            kw: 'lista bozze',
            icon: 'edit_note',
            requireUc:  AuthenticationService.getUtente().usaRemedy ? allAccountRoles : allBackOfficeRoles,
            real: true,
            state: 'app.listBozze'
        },
        {
            name:  'menu.assistenza.nuova_remedy',
            //name: 'menu.servizi.compute.volumi',
            kw: 'apri nuovo ticket',
            icon: 'post_add',
            requireUc: AuthenticationService.getUtente().usaRemedy ? allAccountRoles : allBackOfficeRoles,
            real: true,
            state: 'app.formAssistenza'
        },
        {
            // name: 'Area di condivisione',
            name: 'menu.assistenza.area_condivisione',
            kw: 'storage personale cloud area condivisa',
            icon: 'cloud',
            real: true,
            requireUc: allRoles,
            click: 'openNewWindows',
            url: ''
        }]
    }

    var notizie = {
        // title: 'Notizie',
        title: $translate.instant("menu.notizie.titolo"),
        kw: 'notizie news avvisi',
        icon: 'notifications',
        requireUc: allRoles,
        real: true,
        isDirect: true,
        state: 'app.listNotizie',
        options: []
    }

    var avvisiENotifiche = {
       // title: 'Avvisi e Notifiche',
        title:$translate.instant( "menu.avvisi_notifiche.titolo"),
        kw: 'avvisi notifiche',
        icon: 'notification_important',
        requireUc: allAuthenticatedRoles,
        real: false,
        isDirect: true,
        options: []
    }

    var taskERichieste = {
        // title: 'Task e richieste',
        title: $translate.instant("menu.task_richieste.titolo"),
        kw: 'task richieste',
        icon: 'list_alt',
        // LG 25.04.2019 Nasconde voce di menu
        requireUc: AuthLevel.SUPERADMIN,
        // requireUc: allAuthenticatedRoles,
        real: false,
        isDirect: true,
        options: []
    }

    var mainSettings = {
        title: 'MAIN',
        content: [homepage, documentazione, assistenza, notizie, avvisiENotifiche, taskERichieste]
    }

    /*#############   STRUMENTI   #############*/

    var monitoraggio = {
        // title: 'Monitoraggio',
        title: $translate.instant('menu.strumenti.monitoraggio'),
        kw: 'monitoraggio',
        icon: 'multiline_chart',
        requireUc: allNotBackOfficeRoles,
        real: true,
        isDirect: true,
        options: [],
        click: 'openNewWindows',
        url: ''
    }

    var LogManagement = {
        //title: 'Log Management',
        title: $translate.instant('menu.strumenti.log_management'),
        kw: 'Log Management',
        icon: 'visibility',
        requireUc: allNotBackOfficeRoles,
        real: true,
        isDirect: true,
        options: [],
        click: 'openNewWindows',
        url: ''
      
    }

    var costiEConsumi_account = {
        // title: 'Costi e Consumi',
        title: $translate.instant('menu.gestione_account.costi_consumi'),
        kw: 'costi consumi',
        icon: 'credit_card',
        // LG 25.04.2019 Nasconde voce di menu
        //requireUc: AuthLevel.SUPERADMIN,
        requireUc: [AuthLevel.AccountAdminRole, AuthLevel.AccountViewerRole].join(),
        real: true,
        isDirect: true,
        state: 'app.costiconsumi',
        options: []
    }

    var costiEConsumi_divisione = {
        title: 'Costi e Consumi',
        kw: 'costi consumi',
        icon: 'credit_card',
        // LG 25.04.2019 Nasconde voce di menu
        requireUc: AuthLevel.SUPERADMIN,
        //requireUc: allAdminRoles,
        real: false,
        isDirect: true,
        options: []
    }

    var costiEConsumi_organizzazione = {
        title: 'Costi e Consumi',
        kw: 'costi consumi',
        icon: 'credit_card',
        // LG 25.04.2019 Nasconde voce di menu
        requireUc: AuthLevel.SUPERADMIN,
        //requireUc: allAdminRoles,
        real: false,
        isDirect: true,
        options: []
    }

    var costiEConsumi_backoffice = {
        title: 'Costi e Consumi',
        kw: 'costi consumi',
        icon: 'credit_card',
        requireUc: allBackOfficeRoles,
        real: false,
        isDirect: true,
        options: []
    }

    var wallet_divisione = {
        title: 'Gestione Wallet',
        kw: 'costi consumi wallet',
        icon: 'account_balance_wallet',
        requireUc: [AuthLevel.DivAdminRole, AuthLevel.DivViewerRole,
        AuthLevel.BOADMIN, AuthLevel.SUPERADMIN].join(),
        real: false,
        isDirect: true,
        options: []
    }

    var log = {
        title: 'Log',
        kw: 'log',
        icon: 'visibility',
        // LG 25.04.2019 Nasconde voce di menu
        requireUc: AuthLevel.SUPERADMIN,
        // requireUc: [AuthLevel.AccountAdminRole, AuthLevel.AccountViewerRole,
        // AuthLevel.DivAdminRole, AuthLevel.DivViewerRole,
        // AuthLevel.OrgAdminRole, AuthLevel.OrgViewerRole,
        // AuthLevel.BOADMIN, AuthLevel.SUPERADMIN].join(),
        real: false,
        isDirect: true,
        options: []
    }

    var alerting = {
        title: 'Alerting',
        kw: 'alerting',
        icon: 'warning',
        // LG 25.04.2019 Nasconde voce di menu
        requireUc: AuthLevel.SUPERADMIN,
        // requireUc: [AuthLevel.AccountAdminRole, AuthLevel.AccountViewerRole,
        // AuthLevel.DivAdminRole, AuthLevel.DivViewerRole,
        // AuthLevel.OrgAdminRole, AuthLevel.OrgViewerRole,
        // AuthLevel.BOADMIN, AuthLevel.SUPERADMIN].join(),
        real: false,
        isDirect: true,
        options: []
    }

    var limiti = {
        title: 'Limiti',
        kw: 'limiti',
        icon: 'settings_applications',
        // LG 25.04.2019 Nasconde voce di menu
        requireUc: AuthLevel.SUPERADMIN,
        // requireUc: [AuthLevel.AccountAdminRole, AuthLevel.AccountViewerRole,
        // AuthLevel.DivAdminRole, AuthLevel.DivViewerRole,
        // AuthLevel.OrgAdminRole, AuthLevel.OrgViewerRole,
        // AuthLevel.BOADMIN, AuthLevel.SUPERADMIN].join(),
        real: false,
        isDirect: true,
        options: []
    }

    var strumentiSettings = {
         title:  $translate.instant('menu.strumenti.titolo'),
        //title: 'menu.strumenti.titolo',
        content: [monitoraggio,LogManagement, log, alerting, limiti],
        requireUc: allNotBackOfficeRoles
    }

    /*#############   SERVIZI   #############*/
    var compute = {
        // title: "Compute",
        title: $translate.instant('menu.servizi.compute.titolo'),
        kw: "servizi compute service",
        icon: 'computer',
        requireUc: allAccountRoles,
        real: true,
        isDirect: false,
        options: [{
            // name: 'VM',
            name: 'menu.servizi.compute.vm',
            kw: 'vm virtual machine macchine virtuali',
            icon: 'laptop',
            requireUc: allAccountRoles,
            real: true,
            state: 'app.vm'
        },
        {
            // name: 'Chiavi SSH',
            name: 'menu.servizi.compute.chiavi_ssh',
            kw: 'chiavi ssh per accedere alle vm',
            icon: 'vpn_key',
            requireUc: allAccountRoles,
            real: true,
            state: 'app.keypair'
        },
        {
            // volume,
            name: 'menu.servizi.compute.volumi',
            kw: 'elenco volumi della vm',
            icon: 'save',
            requireUc: allAccountRoles,
            real: true,
            state: 'app.volume'
        },
    /*    {
            name: 'Lista Snapshot',
            kw: 'Lista Snapshot delle VM ',
            icon: 'shutter_speed',
            requireUc: allAccountRoles,
            real: true,
            state: 'app.snapshots'
        }, */
         {
            name: 'Immagini',
            kw: 'catalogo immagini installazione',
            icon: 'album',
            // LG 25.04.2019 Nasconde voce di menu
            requireUc: AuthLevel.SUPERADMIN,
            // requireUc: allAccountRoles,
            real: false
        }, {
            name: 'Backup',
            kw: 'backup',
            icon: 'backup',
            // LG 25.04.2019 Nasconde voce di menu
            //requireUc: AuthLevel.SUPERADMIN,
            requireUc: allAccountRoles,
            real: true,
            state: 'app.jobs'
        }]
    }

    var database = {
        // title: "Database",
        title: $translate.instant('menu.servizi.database.titolo'),
        kw: "servizi database service dbaas",
        icon: 'album',
        requireUc: allAccountRoles,
        real: true,
        isDirect: false,
        options: [{
            // name: 'Istanze DBAAS',
            name: 'menu.servizi.database.dbaas',
            kw: 'istanze dbaas',
            icon: 'sd_storage',
            requireUc: allAccountRoles,
            real: true,
            state: 'app.dbaas'
        }
            // ,{
            //     name : 'Console DBaaS mySQL',
            //     kw : 'link a console DBaaS mySQL',
            //     icon : 'archive',
            //     real : true,
            //     click : 'openNewWindows',
            //     url : '',
            // }
        ]
    }

    var storage = {
        // title: "Storage",
        title: $translate.instant('menu.servizi.storage.titolo'),
        kw: "servizi storage service staas",
        icon: 'storage',
        requireUc: allAccountRoles,
        real: true,
        isDirect: false,
        options: [{
            // name: 'Shares',
            name: 'menu.servizi.storage.shares',
            kw: 'Volumi',
            icon: 'sd_storage',
            requireUc: allAccountRoles,
            real: true,
            state: 'app.volumes'
        }]
    }

    var appEngine = {
        //title: "AppEngine",
        title: $translate.instant('menu.servizi.appengine.titolo'),
        kw: "servizi appEngine service",
        icon: 'devices_other',
        requireUc: allAccountRoles,
        real: true,
        isDirect: false,
        options: [{
            // name: 'Istanze AppEngine',
            name: 'menu.servizi.appengine.istanze',
            kw: 'istanze appengine',
            icon: 'devices',
            requireUc: allAccountRoles,
            real: false
        }]
    }

   

    var networking = {
        //title: "Reti e Sicurezza",
        title: $translate.instant('menu.servizi.networking.titolo'),
        kw: "networking reti sicurezza",
        icon: 'settings_ethernet',
        requireUc: allAccountRoles,
        real: true,
        isDirect: false,
        options: [{
            // name: 'VPC',
            name: 'menu.servizi.networking.vpc',
            kw: 'vpc',
            icon: 'router',
            requireUc: allAccountRoles,
            real: true,
            state: 'app.vpc'
        }, {
            // name: 'Security Group',
            name: 'menu.servizi.networking.security_group',
            kw: 'security group',
            icon: 'security',
            requireUc: allAccountRoles,
            real: true,
            state: 'app.sg'
        },
      
         {
            name: 'DNS',
            kw: 'dns',
            icon: 'dns',
            // LG 25.04.2019 Nasconde voce di menu            
            requireUc: AuthLevel.SUPERADMIN,
            // requireUc: allAccountRoles,
            real: true,
            state: 'app.dns'
        }, {
            name: 'Load Balancing',
            kw: 'load balancing',
            icon: 'device_hub',
            // LG 25.04.2019 Nasconde voce di menu
            requireUc: AuthLevel.SUPERADMIN,
            // requireUc: allAccountRoles,
            real: true,
            state: 'app.lb'
        }, {
            name: 'NAT',
            kw: 'nat',
            icon: 'settings_input_component',
            requireUc: AuthLevel.SUPERADMIN,
            // requireUc: allAccountRoles,
            real: true,
            state: 'app.nat'
        }]
    }

    
    var serviziSettings = {
        title: $translate.instant('menu.servizi.titolo'),
       // title: 'Servizi',
        content: [compute, database, storage, appEngine, networking]
    }

    /*#############  GESTIONE ACCOUNT    #############*/
     // EK 
    var utenti=  {
            //title: "Utenti",
            title: $translate.instant('menu.amministrazione.utenti.titolo'),
            kw: "utenti account registrazione",
            icon: 'people',
            real: true,
            requireUc:  AdminViewerAccountRoles,
            backoffice: true,
            options: [{
                // name: 'Lista utenti accreditati'a
                name: 'menu.gestione_account.utenti.lista_accreditati',
                kw: 'elenco lista utenti accreditati',
                icon: 'view_list',
                state: 'app.listUtenti.account', // EK ToDo
                real: true,
                requireUc: AdminViewerAccountRoles, 
            }]
    }

    var attivita = {
        // title: 'Attività',
        title: $translate.instant('menu.gestione_account.attivita'),
        kw: 'Attività',
        icon: 'history',
        requireUc: [AuthLevel.AccountAdminRole, AuthLevel.AccountViewerRole].join(),
        real: true,
        isDirect: true,
        state: 'app.attivitaAccount', 
        options: []
    }

    var serviziGestione = {
         //title: 'Servizi di gestione',
        title: $translate.instant( 'menu.gestione_account.servizi_gestione'),
        kw: 'AttiServizi di gestione',
        icon: 'payment',
        requireUc: [AuthLevel.AccountAdminRole, AuthLevel.AccountViewerRole].join(),
        real: true,
        isDirect: true,
        state: 'app.serviziGestione', 
        options: []
    }


    var quote = {
        // title: 'Quote Servizi',
        title: $translate.instant('menu.gestione_account.quote_servizi'),
        kw: 'Quote Servizi',
        icon: 'pie_chart',
        requireUc: [AuthLevel.AccountAdminRole, AuthLevel.AccountViewerRole].join(),
        real: true,
        isDirect: true,
        state: 'app.QuoteAccount', 
        options: []
    }

    var listini_account = {
        // title: 'Quote Servizi',
        title: $translate.instant('menu.gestione_account.listino'),
        kw: 'listini',
        icon: 'format_list_numbered',
        requireUc: [AuthLevel.AccountAdminRole, AuthLevel.AccountViewerRole].join(),
        real: true,
        isDirect: true,
        state: 'app.listiniAccount', 
        options: []
    }

    var allegati = {
        // title: 'Quote Servizi',
        title: $translate.instant('menu.gestione_account.allegati'),
        kw: 'Allegati',
        icon: 'file_present',
        requireUc: [AuthLevel.AccountAdminRole, AuthLevel.AccountViewerRole].join(),
        real: true,
        isDirect: true,
        state: 'app.AllegatiAccount', 
        options: []
    }


    var gestioneAccountSettings = {
        title:  $translate.instant('menu.gestione_account.titolo'),
        //title: 'menu.gestione_account.titolo', 
        content: [utenti, costiEConsumi_account, attivita, serviziGestione , quote, listini_account /*, allegati*/]
    }

    // EK END


    /*#############   ACCOUNT E SERVIZI   #############*/

    var account = {
        title: "Account",
        kw: "account",
        icon: 'account_box',
        real: true,
        isDirect: false,
        options: [{
            name: 'Lista Account',
            kw: 'anagrafica account',
            icon: 'account_circle',
            requireUc: allDivisionRoles,
            real: false
        }]
    }

    var accountEServiziSettings = {
        // title: 'Gestione Divisione',
        title: 'menu.gestione_divisione.titolo',
        content:  [
            // {
            //     account
            // },
            {
                // title: "Struttura organizzativa",
                title: 'menu.gestione_divisione.struttura_organizzativa.titolo',
                kw: "struttura organizzativa backoffice",
                icon: 'account_balance',
                real: true,
                requireUc:  AuthLevel.DivAdminRole, 
                backoffice: true,
                options: [ 
                   
                    {
                        // name: 'Accounts',
                        name: 'menu.gestione_divisione.struttura_organizzativa.accounts',
                        kw: ' elenco lista accounts',
                        icon: 'account_circle',
                        real: true,
                        state: 'app.account',
                        requireUc:  AuthLevel.DivAdminRole
                }]
            },
            {
                // title: "Costi e consumi",
                title: 'menu.gestione_divisione.costi_consumi',
                kw: "Costi e consumi",
                icon: 'timeline',
                real: true,
                backoffice: true,
                isDirect: true,
                requireUc:  allDivisionRoles, 
                state: 'app.costiconsumi.div',
                options: []
            },
            
            // EK nascosta da leftmenu la voce "Utenti" per il ruole master di Divisione 
           {
                // title: "Utenti",
                title: 'menu.gestione_divisione.utenti.titolo',
                kw: "utenti backoffice registrazione",
                icon: 'people',
                real: true,
                requireUc: AuthLevel.DivAdminRole,
                backoffice: true,
                options: [{
                    // name: 'Lista utenti accreditati  ',
                    name: 'menu.gestione_divisione.utenti.lista_accreditati',
                    kw: 'Lista utenti accreditati per la Divisione',
                    icon: 'view_list',
                    state: 'app.listUtenti.divisione',
                    real: true,
                    requireUc: AuthLevel.DivAdminRole
                },
                 /*  {
                    name: 'Registra nuovo utente',
                    kw: 'registrazione inserimento nuovo utente',
                    icon: 'person_add',
                    real: true,
                    state: 'app.registraUtente',
                    requireUc: AuthLevel.DivAdminRole
                }, {
                    name: 'Accreditamento',
                    kw: 'utente accreditamento',
                    icon: 'assignment',
                    real: true,
                    state: 'app.listUtenti',
                    requireUc: AuthLevel.DivAdminRole
                }
            */ ]
            }, 
            {
                // title: "Portafoglio",
                title: "menu.amministrazione.portafoglio.titolo",
                kw: "Portafoglio backoffice",
                icon: 'account_balance_wallet',
                real: false,
                backoffice: true,
                options: [{
                    // name: 'Wallets Org-Divisioni',
                    name: "menu.amministrazione.portafoglio.titolo",
                    kw: 'Wallets Org-Divisioni organizzazioni divisioni portafoglio',
                    icon: 'account_balance_wallet',
                    real: false,
                    requireUc: AuthLevel.DivAdminRole
                }]
            },
            
            
            /*
            {
                title: 'Costi e Consumi',
                kw: 'costi consumi',
                icon: 'timeline',
                requireUc: AuthLevel.DivAdminRole , 
                real: true,
                isDirect: true,
                state: 'app.costiconsumi',
                options: []
            }
            ,
            */
        ]
    }

    /*#############  Gestione Organizzazione   #############*/

    var division = {
        title: "Division",
        kw: "division",
        icon: 'group',
        real: true,
        isDirect: false,
        options: [{
            name: 'Lista Account',
            kw: 'anagrafica account',
            icon: 'group_outline',
            requireUc: allOrganizzationRoles,
            real: false
        }]
    }

    var divisionEServiziSettings = {//todo org costi
        // title: 'Gestione Organizzazione',
        title: 'menu.gestione_organizzazione.titolo',
        content: [
            // {
            //     division
            // },
            {
                title: "Struttura organizzativa",
                kw: "struttura organizzativa backoffice",
                icon: 'account_balance',
                real: true,
                requireUc:  AuthLevel.OrgAdminRole, 
                backoffice: true,
                options: [ 
                    {
                        name: 'Divisioni',
                        kw: 'elenco lista divisioni ',
                        icon: 'group_work',
                        real: true,
                        state: 'app.divisione',  
                        requireUc:  AuthLevel.OrgAdminRole
                    },
                    // EK nascosta dal leftmenu la voce "Accounts" per il ruolo master divisione 
                    /* 
                    {
                        name: 'Accounts',
                        kw: ' elenco lista accounts',
                        icon: 'account_circle',
                        real: true,
                        requireUc:  AuthLevel.OrgAdminRole
                }
            */]
            }, 
            {
                // title: "Costi e consumi",
                title: 'menu.gestione_organizzazione.costi_consumi',
                kw: "Costi e consumi",
                icon: 'timeline',
                real: true,
                backoffice: true,
                isDirect: true,
                requireUc:  allOrganizzationRoles, 
                state: 'app.costiconsumi.org',
                options: []
            },
            
             // EK nascosta dal leftmenu la voce "Utenti" per il ruolo master divisione 
           /* {
                title: "Utenti",
                kw: "utenti backoffice registrazione",
                icon: 'people',
                real: true,
                requireUc: AuthLevel.OrgAdminRole,
                backoffice: true,
                options: [{
                    name: 'Lista utenti registrati',
                    kw: 'elenco lista utenti registrati',
                    icon: 'view_list',
                    state: 'app.listUtenti',
                    real: true,
                    requireUc: AuthLevel.OrgAdminRole
                   
                }, {
                    name: 'Registra nuovo utente',
                    kw: 'registrazione inserimento nuovo utente',
                    icon: 'person_add',
                    real: true,
                    state: 'app.registraUtente',
                    requireUc: AuthLevel.OrgAdminRole
                }, {
                    name: 'Accreditamento',
                    kw: 'utente accreditamento',
                    icon: 'assignment',
                    real: true,
                    state: 'app.listUtenti',
                    requireUc: AuthLevel.OrgAdminRole
                    // requireUc: concatRoles(allOperativeBackOfficeRoles, allAdminRoles)
                }]
            },
            */ {
                // title: "Portafoglio",
                title: "menu.amministrazione.portafoglio.titolo",
                kw: "Portafoglio backoffice",
                icon: 'account_balance_wallet',
                real: false,
                backoffice: true,
                options: [{
                    // name: 'Wallets Org-Divisioni',
                    name: "menu.amministrazione.portafoglio.wallets",
                    kw: 'Wallets Org-Divisioni organizzazioni divisioni portafoglio',
                    icon: 'account_balance_wallet',
                    real: false,
                    requireUc: AuthLevel.OrgAdminRole
                }]
            },
            /*
            {
                title: 'Costi e Consumi',
                kw: 'costi consumi',
                icon: 'timeline',
                requireUc: AuthLevel.OrgAdminRole , 
                real: true,
                isDirect: true,
                state: 'app.costiconsumi',
                options: []
            },
            */
           
        ]
    }

    /*#############   BACK OFFICE   #############*/

    var backOfficeSettings = {
        // title: 'Amministrazione',
        title: 'menu.amministrazione.titolo',
        content: [
            /*
             {
                title: 'Costi e Consumi',
                kw: 'costi consumi',
                icon: 'timeline',
                requireUc: allBackOfficeRoles , //allAdminRoles.concat(allBackOfficeRoles),
                real: true,
                isDirect: true,
                state: 'app.costiconsumi',
                options: []
            },
            */
            {
                // title: "Struttura organizzativa",
                title: 'menu.amministrazione.struttura_organizzativa.titolo',
                kw: "struttura organizzativa backoffice",
                icon: 'account_balance',
                real: true,
                requireUc:  allBackOfficeRoles, 
                backoffice: true,
                options: [{
                    // name: 'Organizzazioni',
                    name: 'menu.amministrazione.struttura_organizzativa.organizzazioni',
                    kw: 'elenco lista organizzazioni ',
                    icon: 'account_balance',
                    real: true,
                    state: 'app.organizzazioni',
                    requireUc:  allBackOfficeRoles
                }, {
                    // name: 'Divisioni',
                    name: 'menu.amministrazione.struttura_organizzativa.divisioni',
                    kw: 'elenco lista divisioni ',
                    icon: 'group_work',
                    real: true,
                    state: 'app.divisione',
                    requireUc:  allBackOfficeRoles
                }, {
                    // name: 'Accounts',
                    name: 'menu.amministrazione.struttura_organizzativa.accounts',
                    kw: 'lista elenco accounts',
                    icon: 'account_circle',
                    real: true,
                    state: 'app.account',
                    requireUc:  allBackOfficeRoles
                }]
            }, {
                // title: "Utenti",
                title: 'menu.amministrazione.utenti.titolo',
                kw: "utenti backoffice registrazione",
                icon: 'people',
                real: true,
                requireUc: allBackOfficeRoles,
                // requireUc: concatRoles(allBackOfficeRoles, allAdminRoles),
                backoffice: true,
                options: [{
                    // name: 'Lista utenti registrati',
                    name: 'menu.amministrazione.utenti.lista_registrati',
                    kw: 'elenco lista utenti registrati',
                    icon: 'view_list',
                    state: 'app.listUtenti',
                    real: true,
                    requireUc: allBackOfficeRoles
                    // requireUc: concatRoles(allBackOfficeRoles, allAdminRoles)
                }, {
                    // name: 'Registra nuovo utente',
                    name: 'menu.amministrazione.utenti.registra',
                    kw: 'registrazione inserimento nuovo utente',
                    icon: 'person_add',
                    real: true,
                    state: 'app.registraUtente',
                    requireUc: allBackOfficeRoles
                    // requireUc: concatRoles(allOperativeBackOfficeRoles, allAdminRoles)
                }, {
                    // name: 'Accreditamento',
                    name: 'menu.amministrazione.utenti.accreditamento',
                    kw: 'utente accreditamento',
                    icon: 'assignment',
                    real: true,
                    state: 'app.listUtenti',
                    requireUc: allBackOfficeRoles
                    // requireUc: concatRoles(allOperativeBackOfficeRoles, allAdminRoles)
                }]
            },{
                title: "menu.amministrazione.listini.titolo",
                kw: "Listini back office",
                icon: 'format_list_numbered',
                real: true,
                requireUc: allBackOfficeRoles,
                // requireUc: concatRoles(allBackOfficeRoles, allAdminRoles),
                backoffice: true,
                options: [{
                    name: 'menu.amministrazione.listini.elenco',
                    kw: 'elenco listini registrati',
                    icon: 'format_list_numbered_rtl',
                    state: 'app.elencoListini',
                    real: true,
                    requireUc: allBackOfficeRoles
                    // requireUc: concatRoles(allBackOfficeRoles, allAdminRoles)
                }, {
                    name: 'menu.amministrazione.listini.registra',
                    kw: 'registrazione inserimento nuovo listino',
                    icon: 'plus_one',
                    real: true,
                    state: 'app.newListino',
                    requireUc: allBackOfficeRoles
                    // requireUc: concatRoles(allOperativeBackOfficeRoles, allAdminRoles)
                }]
            }, {
                // title: "Portafoglio",
                title: "menu.amministrazione.portafoglio.titolo",
                kw: "Portafoglio backoffice",
                icon: 'account_balance_wallet',
                real: false,
                backoffice: true,
                options: [{
                    // name: 'Wallets Org-Divisioni',
                    name: "menu.amministrazione.portafoglio.wallets",
                    kw: 'Wallets Org-Divisioni organizzazioni divisioni portafoglio',
                    icon: 'account_balance_wallet',
                    real: false,
                    requireUc: allBackOfficeRoles
                }]
            }, {
                // title: "Catalogo",
                title: "menu.amministrazione.catalogo.titolo",
                kw: "Catalogo backoffice",
                icon: 'library_books',
                real: false,
                backoffice: true,
                options: [{
                    // name: 'Cataloghi',
                    name: "menu.amministrazione.catalogo.cataloghi",
                    kw: 'lista elenco Cataloghi',
                    icon: 'view_list',
                    real: false,
                    requireUc: allBackOfficeRoles
                }]
            },{
                // title: "Report",
                title: "menu.amministrazione.report.titolo",
                kw: "reportCSVTot",
                icon: 'report',
                real: true,
                requireUc:  allBackOfficeRoles, 
                backoffice: true,
                options: [{
                    // name: 'Report',
                    name: "menu.amministrazione.report.report",
                    kw: 'report csv totali',
                    icon: 'report',
                    real: true,
                    state: 'app.csvaccount',
                    requireUc:  allBackOfficeRoles
                }]
            }]
    }

    /*#############   MENU COMPLETO   #############*/

    return {
        getMenuCompleto: [
            { 'title': mainSettings.title, 'content': mainSettings.content },
            { 'title': strumentiSettings.title, 'content': strumentiSettings.content },
            { 'title': gestioneAccountSettings.title, 'content': gestioneAccountSettings.content },
            { 'title': serviziSettings.title, 'content': serviziSettings.content },
            { 'title': accountEServiziSettings.title, 'content': accountEServiziSettings.content },
            { 'title': divisionEServiziSettings.title, 'content': divisionEServiziSettings.content },
            { 'title': backOfficeSettings.title, 'content': backOfficeSettings.content },
        ]
    }
}]);

//GIT REFACTOR togliere commenti
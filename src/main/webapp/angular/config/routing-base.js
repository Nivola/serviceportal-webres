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
nivolaApp.config(['$stateProvider', '$urlRouterProvider', 'conf', function ($stateProvider, $urlRouterProvider, conf) {

    var context = conf.siteContext + "";

    $urlRouterProvider.otherwise('/home');

    $stateProvider
        .state('app', {
            url: '',
            abstract: true,
            views: {
                'content': {
                    templateUrl: context + './templates/partials/empty.html'
                },
                'menu': {
                    templateUrl: context + './templates/partials/menu.html'
                }
            },
            resolve: {
                serverParams: function () {
                    return {};
                }
            },
            data: {
              'hideMenu' : false
            }
        })

        .state('app.home', {
            url: '/home',
            views: {
                'content@': {
                    templateUrl: context + './templates/home.html',
                    controller: "controllerHome"
                }
            }
        })

        .state('app.logout', {
            url: '/logout',
            views: {
                'content@': {
                    templateUrl: context + './templates/logout.html',
                    controller: "controllerSelezionaRuolo"
                }
            },
            data: {
              'hideMenu' : true
            }
        })
        
        .state('app.login', {
            url: '/login',
            views: {
                'content@': {
                    templateUrl: context + './templates/login.html',
                    controller: "controllerSelezionaRuolo"
                }
            },
            data: {
              'hideMenu' : true
            }
        })

        .state('app.login.provider', {
            url: '/{idProvider}',
            views: {
                'content@': {
                    templateUrl: context + './templates/login.html',
                    controller: "controllerSelezionaRuolo"
                }
            }
        })

        .state('app.organizzazione', {
            url: '/backoffice/gestione-organizzazioni',
            requiredUC : 'BOADMIN',
            views: {
                'content@': {
                    templateUrl: context + '/angular/entities/organizzazione/tpl-lista.html',
                    controller: "controllerMock"
                }
            },
            data: {
                'backoffice' : true
            }
        })

        .state('app.organizzazione.dettaglio', {
            url: '/{idOrganizzazione}',
            views: {
                'content@': {
                    templateUrl: context + '/angular/entities/organizzazione/tpl-dettaglio.html',
                    controller: "controllerMock"
                }
            },
            stateParams : {
                entity : null
            }
        })

        .state('app.organizzazione.modifica', {
            url: '/modifica/{idOrganizzazione}',
            views: {
                'content@': {
                    templateUrl: context + '/angular/entities/organizzazione/tpl-modifica.html',
                    controller: "controllerMock"
                }
            },
            stateParams : {
                entity : null
            }
        })
        
        .state('app.organizzazione.dettaglio.divisione', {
            url: '/divisione/{idDivisione}',
            views: {
                'content@': {
                    templateUrl: context + '/angular/entities/organizzazione/tpl-dettaglio-divisione.html',
                    controller: "controllerMock"
                }
            },
            stateParams : {
                entity : null
            }
        })

        .state('app.organizzazione.dettaglio.divisione.account', {
            url: '/account/{idAccount}',
            views: {
                'content@': {
                    templateUrl: context + '/angular/entities/organizzazione/tpl-dettaglio-account.html',
                    controller: "controllerMock"
                }
            },
            stateParams : {
                entity : null
            }
        })
     
    ;

}]);


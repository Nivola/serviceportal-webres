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
nivolaApp
    .factory('Organizzazione', ['$resource', 'entitiesRest', '$translate', function ($resource, entitiesRest, $translate) {
        'use strict';
        var serviceUrl = '/api/organizzazione';

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl + '/:id', { id: '@id' },
            {
                /// update: { method: 'put' }
            });

        // delete entity.prototype.$delete;
        // delete entity.prototype.$remove;

        entity.tipoCategoria = [
            {
                key: 'public',
                name: $translate.instant('organizzazioni.categoria.public'),
                badge_class: 'badge-success'
            },
            {
                key: 'csi',
                name: $translate.instant('organizzazioni.categoria.csi'),
                badge_class: 'badge-warning'
            },
            {
                key: 'private',
                name: $translate.instant('organizzazioni.categoria.privata'),
                badge_class: 'badge-danger'
            }
        ]

        entity.findTipoCategoriaByKey = function (value) {
            var key = value.toLocaleLowerCase();
            var rt = entity.tipoCategoria.find(function (element) { return element.key === key });
            if (! rt) {
                rt =  {
                    key: 'public',
                    name: $translate.instant('organizzazioni.categoria.public'),
                    badge_class: 'badge-success'
                };
            }
            return rt;
        }

        return entity;
    }])

    .factory('AccreditamentoOrganizzazione', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = '/api/organizzazione';

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl + '/:uuidEntity/utente/:uuidUtente/ruolo/:id', { uuidEntity: '@uuidEntity', uuidUtente: '@uuidUtente', id: '@id' },
            {
                // update: { method: 'put' }
            });

        delete entity.prototype.$get;
        delete entity.prototype.$query;

        return entity;
    }]);

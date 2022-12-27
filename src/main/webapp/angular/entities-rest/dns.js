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
    .factory('Dns', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = '/api/dns';

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl + '/:id', { id: '@id' },
            {
                // update: { method: 'put' }
            });

        // delete entity.prototype.$delete;
        // delete entity.prototype.$remove;

        return entity;
    }]);

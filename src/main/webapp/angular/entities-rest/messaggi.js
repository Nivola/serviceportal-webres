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
nivolaApp
    .factory('Messaggi', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = '/api/messages';

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl + '/:id/details', { id: '@id' },
            {
                // update: { method: 'put' }
            });

        delete entity.prototype.$save;
        delete entity.prototype.$delete;
        delete entity.prototype.$remove;

        return entity;
    }])

   

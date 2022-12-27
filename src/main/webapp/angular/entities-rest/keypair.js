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
    .factory('Keypair', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = '/api/keypairs';

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl + '/:nomeChiave/', { nomeChiave: '@nomeChiave' },
            {
                update: { method: 'PUT' },
            });

        // delete entity.prototype.$delete;
        // delete entity.prototype.$remove;

        return entity;
    }]);


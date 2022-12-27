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
    .factory('StrumentiAmministrazione', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = '/api/admin/accountcmp/';

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl + '/:uuidAccount/costi/:data', { uuidAccount: '@uuidAccount', data: '@data' },
            {
                // update: { method: 'put' }
            });

        delete entity.prototype.$get;
        delete entity.prototype.$query;

        return entity;
    }]);   

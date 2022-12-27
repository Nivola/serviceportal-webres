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
    .factory('Quote', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = 'api/accountcmp';

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl + '/:uuid/quote', { id: '@uuid' },
      
            {
                query:  {method:'GET', isArray:false}
            });

        //delete entity.prototype.$get;
        //delete entity.prototype.$query;
        delete entity.prototype.$delete;
        delete entity.prototype.$remove;

        return entity;
    }]);

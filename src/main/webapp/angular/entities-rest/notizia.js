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
    .factory('Notizia', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = '/api/news';

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl + '/:idNotizia', { idNotizia: '@idNotizia' },
            {
                update: { method: 'PUT' }
            });


        return entity;
    }]);
   
   

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
    
.factory('ElencoWbs', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
    'use strict';
    var serviceUrl = 'api/wbs';
    var entity = $resource(entitiesRest.getBaseUrl + serviceUrl + '/:id', { id: '@id' },
        {
            // update: { method: 'put' }
        });

    //delete entity.prototype.$get;
    //delete entity.prototype.$query;

    return entity;
}]).factory('AssociaWbs', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
    'use strict';
    var serviceUrl = 'api/wbs/account';
    var entity = $resource(entitiesRest.getBaseUrl + serviceUrl + '/:id', { id: '@id' },
        {
            // update: { method: 'put' }
        });

    //delete entity.prototype.$get;
    //delete entity.prototype.$query;

    return entity;
}]).factory('RevocaAssociaWbs', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
    'use strict';
    var serviceUrl = 'api/wbs/account';
    var entity = $resource(entitiesRest.getBaseUrl + serviceUrl + '/:accountId/:associazioneId', { accountId: '@accountId', associazioneId: '@associazioneId' },
        {
            // update: { method: 'put' }
        });

    //delete entity.prototype.$get;
    //delete entity.prototype.$query;

    return entity;
}]);



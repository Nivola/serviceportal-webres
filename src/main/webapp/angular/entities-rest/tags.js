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
    
.factory('TagsManage', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
    'use strict';
    var serviceUrl = '/api/vm/tags';
    var entity = $resource(entitiesRest.getBaseUrl + serviceUrl + '/:id', { id: '@id' },
        {
            // update: { method: 'put' }
        });

    //delete entity.prototype.$get;
    //delete entity.prototype.$query;

    return entity;
}])
.factory('TagsRemove', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
    'use strict';
    var serviceUrl = '/api/risorsa';
    var entity = $resource(entitiesRest.getBaseUrl + serviceUrl + '/:resourceId/tags/:tagKey', { resourceId: '@resourceId' , tagKey: '@tagKey' },
        {
            // update: { method: 'put' }
        });

    //delete entity.prototype.$get;
    //delete entity.prototype.$query;

    return entity;
}]);



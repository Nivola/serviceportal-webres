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
    .factory('Staas', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = '/api/staas';
        
        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl+ '/:id', { id: '@id' },
            {
                query:  {method:'GET', isArray:true},
                update: { method: 'PUT' },
             
            });

        delete entity.prototype.$save;
        //delete entity.prototype.$put;
        //delete entity.prototype.$post;
        delete entity.prototype.$query;
        //delete entity.prototype.$remove;
        
        return entity;
    }])
    nivolaApp
    .factory('StaasTypes', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = '/api/staas/types';
        
        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl, null,
            {
                query:  {method:'GET', isArray:true}
            });

        delete entity.prototype.$save;
        delete entity.prototype.$put;
        delete entity.prototype.$post;
        delete entity.prototype.$query;
        delete entity.prototype.$delete;
        delete entity.prototype.$remove;
        
        return entity;
    }])
    nivolaApp
    .factory('StaasGrant', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = '/api/staas/:id/grants/:idGrant';
        
        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl, { id: '@id', idGrant: '@idGrant' },
                {
        	query:  {method:'GET', isArray:true}
                });
        
        //delete entity.prototype.$remove;
//        angular.extend(this, entity);
        return entity;
    }]);
    

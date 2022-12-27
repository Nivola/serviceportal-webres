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
    .factory('SecurityGroup', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = '/api/securitygroups';

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl + '/:id', { id: '@id' },
            {
        	query:  {method:'GET', isArray:true}
            });

        delete entity.prototype.$delete;
        delete entity.prototype.$remove;

        return entity;
    }])
    .factory('SecurityGroupAccount', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = '/api/securitygroups?accountUuid=';

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl + ':accountUuid', { accountUuid: '@accountUuid' },
            {
        	query:  {method:'GET', isArray:true}
            });

        delete entity.prototype.$delete;
        delete entity.prototype.$remove;

        return entity;
    }])

    .factory('SecurityRule', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = '/api/securitygroups/regola';

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl, null,
            {
                update: { method:'put' }
            });

        delete entity.prototype.$get;
        delete entity.prototype.$query;
        delete entity.prototype.$delete;
        delete entity.prototype.$remove;
        
        
        return entity;
    }])

    .factory('DeleteSG', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = '/api/securitygroups';

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl + '/:nome',{nome: '@nome'}, 
            {
                //update: { method:'put' }
            });

        delete entity.prototype.$get;
        delete entity.prototype.$query;
        //delete entity.prototype.$delete;
        delete entity.prototype.$remove;
        
        
        return entity;
    }])
    
    
    .factory('SecurityGroupTemplates', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = '/api/securitygroups/templates';

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
    }]);

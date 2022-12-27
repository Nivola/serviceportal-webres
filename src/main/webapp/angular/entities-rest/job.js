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
    .factory('Job', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = '/api/backup/job';

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl + '/:id', { id: '@id' },
            {
                // update: { method: 'put' }
            });

        // delete entity.prototype.$delete;
        // delete entity.prototype.$remove;

        return entity;
    }])
    
    .factory('JobRestorePoints', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = 'api/backup/restorepoint';
        
        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl,
            {
                // get: {method:'GET',isArray:false}
                // update: { method: 'put' }
            });

        // delete entity.prototype.$save;
        // delete entity.prototype.$delete;
        // delete entity.prototype.$remove;

        return entity;
    }])
    
    .factory('VMRestorePoints', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = 'api/backup/restorepoint';
        
        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl,
            {
                // get: {method:'GET',isArray:false}
                // update: { method: 'put' }
            });

        // delete entity.prototype.$save;
        // delete entity.prototype.$delete;
        // delete entity.prototype.$remove;

        return entity;
    }])

    .factory('Policies', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = 'api/backup/job/policies';
        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl,{  });

        return entity;
    }])

    .factory('RestoreVM', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = 'api/backup/restore/vm';
        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl,{  });

        return entity;
    }])
    ;

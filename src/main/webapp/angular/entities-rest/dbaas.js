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
    .factory('Dbaas', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = '/api/dbaas';

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl + '/:id', { id: '@id' },
            {
                // update: { method: 'put' }
            });

        // delete entity.prototype.$delete;
        // delete entity.prototype.$remove;

        return entity;
    }])
    .factory('DbaasUtente', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = '/api/dbaas';

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl + '/:id/utente', { id: '@id' },
            {
                dismetti: { method: 'PUT' }
            });

        return entity;
    }])
    
    .factory('Engine', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = '/api/dbaas/engine';

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl + '/:id', { id: '@id' },
            {
                // update: { method: 'put' }
            });

        delete entity.prototype.$save;
        delete entity.prototype.$delete;
        delete entity.prototype.$remove;

        return entity;
    }])
    
    .factory('DbDiskSizeLimit', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = '/api/dbaas/limiti';

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl,
            {
                // update: { method: 'put' }
            });

        delete entity.prototype.$query;
        delete entity.prototype.$save;
        delete entity.prototype.$delete;
        delete entity.prototype.$remove;

        return entity;
    }])
    
    .factory('DbFlavour', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = '/api/dbaas/flavour';

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl + '/:id', { id: '@id' },
            {
                // update: { method: 'put' }
            });

        delete entity.prototype.$save;
        delete entity.prototype.$delete;
        delete entity.prototype.$remove;

        return entity;
    }]);

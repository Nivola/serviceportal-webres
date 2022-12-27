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
    .factory('Vm', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = '/api/vm';

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl + '/:id/:action', { id: '@id', action: '@action' },
            {
                update: { method: 'PUT' }
            });

        // delete entity.prototype.$delete;
        // delete entity.prototype.$remove;

        return entity;
    }])

    .factory('Template', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = '/api/vm/templates';

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl + '/:id', { id: '@id' },
            {
                // update: { method: 'put' }
            });

        delete entity.prototype.$save;
        delete entity.prototype.$delete;
        delete entity.prototype.$remove;

        return entity;
    }])
    
    .factory('VmFlavour', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = '/api/vm/flavour';

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl + '/:id', { id: '@id' },
            {
                // update: { method: 'put' }
            });

        delete entity.prototype.$save;
        delete entity.prototype.$delete;
        delete entity.prototype.$remove;

        return entity;
    }])
    
    .factory('AvailabilityZone', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = '/api/vm/availabilityzones';

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl + '/:id', { id: '@id' },
            {
                // update: { method: 'put' }
            });

        delete entity.prototype.$save;
        delete entity.prototype.$delete;
        delete entity.prototype.$remove;

        return entity;
    }])
    
    .factory('Subnet', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = '/api/vm/subnet';

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl + '/:id', { id: '@id' },
            {
                // update: { method: 'put' }
            });

        delete entity.prototype.$save;
        delete entity.prototype.$delete;
        delete entity.prototype.$remove;

        return entity;
    }])
    .factory('rebootVm', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = '/api/vm/reboot';

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl + '/:id', { id: '@id'},
            {
                update: { method: 'PUT' }
            });

        // delete entity.prototype.$delete;
        // delete entity.prototype.$remove;

        return entity;
    }]);

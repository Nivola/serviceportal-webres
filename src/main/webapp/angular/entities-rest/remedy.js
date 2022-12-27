/*-
 * ========================LICENSE_START=================================
 * Nivola Service Portal Web Resources
 * %%
 * Copyright (C) 2022 Regione Piemonte
 * %%
 * SPDX-FileCopyrightText: Copyright 2022 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
nivolaApp
    .factory('Remedy', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = 'api/richiesta';

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl + '/:id', { id: '@id' },
            {
                // update: { method: 'put' }
            });

        //delete entity.prototype.$get;
        delete entity.prototype.$query;
        delete entity.prototype.$delete;
        delete entity.prototype.$remove;

        return entity;
    }])
    .factory('GetRemedy', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = 'api/richiesta';

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl + '/:id/stato', { id: '@id' },
            {
                // update: { method: 'put' }
            });

        //delete entity.prototype.$get;
        delete entity.prototype.$query;
        delete entity.prototype.$delete;
        delete entity.prototype.$remove;

        return entity;
    }])
    .factory('AllegatiRemedy', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = 'api/richiesta/allegato';  

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl + '/:id/scarica', { id: '@id' },
            {
                query:  {method:'GET', isArray:false}
            });

        //delete entity.prototype.$get;
        delete entity.prototype.$query;
        delete entity.prototype.$delete;
        delete entity.prototype.$remove;

        return entity;
    }]).factory('StatiRemedy', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = 'api/remedy/ticket/stato';

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl + '/:id', { id: '@id' },
            {
                // update: { method: 'put' }
            });

        //delete entity.prototype.$get;
        delete entity.prototype.$query;
        delete entity.prototype.$delete;
        delete entity.prototype.$remove;

        return entity;
    }])
    .factory('UpdateUrgenza', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = 'api/richiesta';

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl + '/:id/urgenza/:urgenza', { id: '@id' , urgenza: '@urgenza' },
            {
                update: { method: 'put' }
            });

        //delete entity.prototype.$get;
        delete entity.prototype.$query;
        delete entity.prototype.$delete;
        delete entity.prototype.$remove;

        return entity;
    }]).factory('Users', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = 'api/user/suggest';

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl + '/:id', { id: '@id' },
            {
                // update: { method: 'put' }
            });

        //delete entity.prototype.$get;
        delete entity.prototype.$query;
        delete entity.prototype.$delete;
        delete entity.prototype.$remove;

        return entity;
    }]).factory('Assegnatori', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = 'api/user/suggest/ticket';

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl + '/:id', { id: '@id' },
            {
                // update: { method: 'put' }
            });

        //delete entity.prototype.$get;
        delete entity.prototype.$query;
        delete entity.prototype.$delete;
        delete entity.prototype.$remove;

        return entity;
    }]).factory('EditAssegnatario', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = '/api/richiesta/assegna';
        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl + '/:id', { id: '@id' },
            {
                // update: { method: 'put' }
            });
    
        //delete entity.prototype.$get;
        //delete entity.prototype.$query;
    
        return entity;
    }]);


    

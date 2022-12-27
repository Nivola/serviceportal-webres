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
    .factory('Divisione', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = '/api/divisione';

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl + '/:id', { id: '@id' },
            {
                update: { method: 'PUT' },
            });

        // delete entity.prototype.$delete;
        // delete entity.prototype.$remove;

        return entity;
    }])
    .factory('DettaglioDivisione', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = '/api/divisione';

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl + '/:uuid', { uuid: '@uuid'},
            {
                // update: { method: 'put' }
                
            });

        delete entity.prototype.$post;
        delete entity.prototype.$query;
        delete entity.prototype.$save;

        return entity;
    }])

    .factory('RemedyEnti', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = '/api/remedy/enti';

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl, { ricerca: '@ricerca' }, 
            {
                get:  {isArray:true},
                query:  {isArray:true},
            });

        // delete entity.prototype.$delete;
        // delete entity.prototype.$remove;

        return entity;
    }])

    .factory('AccreditamentoDivisione', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = '/api/divisione';

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl + '/:uuidEntity/utente/:uuidUtente/ruolo/:id', { uuidEntity: '@uuidEntity', uuidUtente: '@uuidUtente', id: '@id' },
            {
                // update: { method: 'put' }
            });

        delete entity.prototype.$get;
        delete entity.prototype.$query;

        return entity;
    }])
    .factory('UtentiDivisione', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = '/api/divisione/:uuid/utenti';

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl, { uuid: '@uuid' },
            {
                // update: { method: 'PUT' }
            });

        delete entity.prototype.$delete;
        delete entity.prototype.$remove;
        delete entity.prototype.$save;
        delete entity.prototype.$post;
        delete entity.prototype.$put;
        return entity;
    }])
    .factory('UtentiAccreditatiDivisione', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = 'api//divisione/:uuid/utentiaccount'
        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl, { uuid: '@uuid' },
        {
            get:  {isArray:true}

        });

            delete entity.prototype.$post;
            delete entity.prototype.$query;
            delete entity.prototype.$save;

        return entity;
    }]);

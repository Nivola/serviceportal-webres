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
    .factory('Account', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = '/api/accountcmp';
        // var entity = $resource(entitiesRest.getBaseUrl + serviceUrl + '/:id', { id: '@id' },
        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl , {},
            {
                update: { method: 'PUT' },
                get:  {isArray:true}

            });

        // delete entity.prototype.$delete;
        // delete entity.prototype.$remove;

        return entity;
    }])

    .factory('AccreditamentoAccount', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = '/api/accountcmp';

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl + '/:uuidEntity/utente/:uuidUtente/ruolo/:id', { uuidEntity: '@uuidEntity', uuidUtente: '@uuidUtente', id: '@id' },
            {
                // update: { method: 'put' }
            });

        delete entity.prototype.$get;
        delete entity.prototype.$query;

        return entity;
    }])

    .factory('DettaglioAccount', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = '/api/accountcmp';

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl + '/:uuid', { uuid: '@uuid'},
            {
                // update: { method: 'put' }
                
            });

        delete entity.prototype.$post;
        delete entity.prototype.$query;
        delete entity.prototype.$save;

        return entity;
    }])
    .factory('UtentiAccount', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = '/api/accountcmp/:uuid/utenti';

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl , { uuid: '@uuid'},
            {
                get:  {isArray:true}

            });

        delete entity.prototype.$post;
        delete entity.prototype.$query;
        delete entity.prototype.$save;

        return entity;
    }])
    
    .factory('AccountPortal', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = '/api/account';
        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl , {},
            {
                get:  {isArray:false}

            });
            delete entity.prototype.$delete;
            delete entity.prototype.$remove;
            delete entity.prototype.$save;
            delete entity.prototype.$post;
            delete entity.prototype.$put;

        return entity;
    }])

    .factory('AccountCapabilities', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = '/api/account/:id/capabilities';
        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl , { id: '@id'},
            {
                get:  {isArray:true}

            });
            delete entity.prototype.$delete;
            delete entity.prototype.$remove;
            delete entity.prototype.$put;

        return entity;
    }])
    
    .factory('AccountWbs', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = '/api/wbs/account';
        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl + '/:uuid', { uuid: '@uuid'},
            {
                get:  {isArray:true}

            });
            delete entity.prototype.$delete;
            delete entity.prototype.$remove;
            delete entity.prototype.$put;

        return entity;
    }]);

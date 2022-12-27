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

    .factory('AccreditamentoNewUtente', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = '/api/utentestruttura';

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl + '/:id', { id: '@id' },
            {
                // update: { method: 'put' }
            });

            delete entity.prototype.$get;
            delete entity.prototype.$query;

        return entity;
    }])

    .factory('Utente', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = '/api/utente';

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl + '/:id', { id: '@id' },
            {
                 //update: { method: 'put' }
            });

        // delete entity.prototype.$delete;
        // delete entity.prototype.$remove;

        return entity;
    }])
    .factory('UpdateUtente', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = '/api/utente';

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl + '/:idUtente', { id: '@idUtente' },
            {
                 update: { method: 'put' }
            });

        // delete entity.prototype.$delete;
        // delete entity.prototype.$remove;

        return entity;
    }])

    .factory('AccreditamentoBackoffice', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = '/api/utente';

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl + '/:uuidUtente/ruolo/:id', { uuidUtente: '@uuidUtente', id: '@id' },
            {
                // update: { method: 'put' }
            });

        delete entity.prototype.$get;
        delete entity.prototype.$query;

        return entity;
    }])

    // TODO: DA ELIMINARE!!! BISOGNA CAMBIARE I PATH SUL BACKEND!!!
    .factory('AccreditamentoAccount_TOBECHANGED', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = '/api/accreditamento/account';

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl + '/:id', { id: '@id' },
            {
                // update: { method: 'put' }
            });

        delete entity.prototype.$get;
        delete entity.prototype.$query;
        delete entity.prototype.$delete;
        delete entity.prototype.$remove;

        return entity;
    }])

    // TODO: DA ELIMINARE!!! BISOGNA CAMBIARE I PATH SUL BACKEND!!!
    .factory('AccreditamentoDivisione_TOBECHANGED', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = '/api/accreditamento/divisione';

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl + '/:id', { id: '@id' },
            {
                // update: { method: 'put' }
            });

        delete entity.prototype.$get;
        delete entity.prototype.$query;
        delete entity.prototype.$delete;
        delete entity.prototype.$remove;

        return entity;
    }])

    // TODO: DA ELIMINARE!!! BISOGNA CAMBIARE I PATH SUL BACKEND!!!
    .factory('AccreditamentoOrganizzazione_TOBECHANGED', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = '/api/accreditamento/organizzazione';

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl + '/:id', { id: '@id' },
            {
                // update: { method: 'put' }
            });

        delete entity.prototype.$get;
        delete entity.prototype.$query;
        delete entity.prototype.$delete;
        delete entity.prototype.$remove;

        return entity;
    }])
    
    .factory('SelfRegistrazioneGuest', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = '/api/utenteself';

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl + '/:id', { id: '@id' },
            {
                // update: { method: 'put' }
            });

            delete entity.prototype.$get;
            delete entity.prototype.$query;

        return entity;
    }]);   

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
    .factory('Assistenza', ['$resource', 'entitiesRest', '$translate', function ($resource, entitiesRest, $translate) {
        'use strict';
        var serviceUrl = '/api/emailAssistenza';

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl,
            {
                // update: { method: 'put' }
            });

        //delete entity.prototype.$get;
        delete entity.prototype.$query;
        delete entity.prototype.$delete;
        delete entity.prototype.$remove;

        return entity;
    }])
    .factory('ReadTheDocs', ['$resource', 'entitiesRest', function ($resource, entitiesRest, $translate) {
        'use strict';
        
		// i18n - guida utente
        var serviceUrl = '/api/docs/readthedocs';
        

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl,
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
    .factory('Requisiti', ['$resource', 'entitiesRest', function ($resource, entitiesRest, $translate) {
        'use strict';
        var serviceUrl = '/api/richiesta/requisiti';
        

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl, {            });

        return entity;
    }])
    .factory('Configura', ['$resource', 'entitiesRest', function ($resource, entitiesRest, $translate) {
        'use strict';
        var serviceUrl = '/api/richiesta/configura';
        

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl, {            });

        return entity;
    }]);

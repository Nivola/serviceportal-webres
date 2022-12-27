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
    .factory('Listini', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = '/api/listino';

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl + '/:idListino', { idListino: '@idListino' },
            {
                update: { method: 'PUT' }
            });


        return entity;
    }])
    
    .factory('ListiniAccount', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = 'api/listino/attuale';

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl + '/:idListino', { idListino: '@idListino' },
            {
                update: { method: 'PUT' }
            });


        return entity;
    }])
    
    .factory('dettaglioListino', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = 'api/listino';

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl + '/:idListino', { idListino: '@idListino' },
            {
                update: { method: 'PUT' }
            });


        return entity;
    }])

    .factory('listaListini', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = '/api/listino';

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl,
            {
                // update: { method: 'PUT' }
            });


        return entity;
    }])
    
    .factory('Infocosto', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = '/api/listino/infocosto';

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl,{},
            {
                update: { method: 'PUT' }
            });


        return entity;
    }])
    
    .factory('PriceListHistory', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = '/api/listino/infocosto';

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl,
            {
            });


        return entity;
    }])
    
    .factory('Tipi', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = 'api/listino/tipo';

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl,{});

        return entity;
    }])
    .factory('RemoveInfocosto', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = 'api/listino/infocosto';

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl + '/:id', { id: '@id' },
            {
                // update: { method: 'put' }
            });

        // delete entity.prototype.$delete;
        // delete entity.prototype.$remove;

        return entity;
    }])
    ;
   
   
    

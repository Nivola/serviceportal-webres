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
nivolaApp.factory('CostiAccountRendicontati', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = '/api/rendiconti';

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl ,{},
            {
                // update: { method: 'PUT' }
                query:  {method:'GET', isArray:false}
            });

        delete entity.prototype.$delete;
        delete entity.prototype.$remove;
        delete entity.prototype.$save;
        delete entity.prototype.$post;
        delete entity.prototype.$put;
        return entity;
    }]);


    nivolaApp.factory('AndamentoCostiAccount', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = '/api/costo/grafico';

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl +  '/:id', { id: '@id' },
            {
                // update: { method: 'PUT' }
                query:  {method:'GET', isArray:true}
            });

        delete entity.prototype.$delete;
        delete entity.prototype.$remove;
        delete entity.prototype.$save;
        delete entity.prototype.$post;
        delete entity.prototype.$put;
        return entity;
    }])

    nivolaApp.factory('RendicontoReport', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = '/api/report';

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl ,{},
            {
                // update: { method: 'PUT' }
                query:  {method:'GET', isArray:false}
            });

        delete entity.prototype.$delete;
        delete entity.prototype.$remove;
        delete entity.prototype.$save;
        delete entity.prototype.$post;
        delete entity.prototype.$put;
        return entity;
    }])

    nivolaApp.factory('RendicontoCsv', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = '/api/reportCSV';

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl ,{},
            {
                // update: { method: 'PUT' }
                query:  {method:'GET', isArray:false}
            });

        delete entity.prototype.$delete;
        delete entity.prototype.$remove;
        delete entity.prototype.$save;
        delete entity.prototype.$post;
        delete entity.prototype.$put;
        return entity;
    }])

    nivolaApp.factory('RendicontoCsvSintetico', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = '/api/account/report/csv/mensilesintetico';

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl ,{},
            {
                // update: { method: 'PUT' }
                query:  {method:'GET', isArray:false}
            });

        delete entity.prototype.$delete;
        delete entity.prototype.$remove;
        delete entity.prototype.$save;
        delete entity.prototype.$post;
        delete entity.prototype.$put;
        return entity;
    }])

    nivolaApp.factory('RendicontoCsvTotali', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = '/api/bo/reportCSVTot';

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl ,{},
            {
                // update: { method: 'PUT' }
                query:  {method:'GET', isArray:false}
            });

        delete entity.prototype.$delete;
        delete entity.prototype.$remove;
        delete entity.prototype.$save;
        delete entity.prototype.$post;
        delete entity.prototype.$put;
        return entity;
    }])

    nivolaApp.factory('RendicontoCsvWbs', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = '/api/bo/reportTotWbsAngular';

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl ,{},
            {
                // update: { method: 'PUT' }
                query:  {method:'GET', isArray:false}
            });

        delete entity.prototype.$delete;
        delete entity.prototype.$remove;
        delete entity.prototype.$save;
        delete entity.prototype.$post;
        delete entity.prototype.$put;
        return entity;
    }])

    nivolaApp.factory('ConsumiNonRendicontatiAccount', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = '/api/costo/mese';

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl +  '/:id', { id: '@id' },
            {
                // update: { method: 'PUT' }
                query:  {method:'GET', isArray:false}
            });

        delete entity.prototype.$delete;
        delete entity.prototype.$remove;
        delete entity.prototype.$save;
        delete entity.prototype.$post;
        delete entity.prototype.$put;
        return entity;
    }])

    nivolaApp.factory('ConsumiNonRendicontatiDivisione', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        //var serviceUrl = '/api/divisione/:uuid/costo/mese';  
        var serviceUrl = '/api/divisione/costo/mese?' ;
        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl + 'uuidStruttura=:uuidStruttura' ,
        { uuidStruttura: '@uuidStruttura' },
        {
            query:  {method:'GET', isArray:false}
        });

        delete entity.prototype.$delete;
        delete entity.prototype.$remove;
        delete entity.prototype.$save;
        delete entity.prototype.$post;
        delete entity.prototype.$put;
        return entity;
    }])
    
    nivolaApp.factory('AndamentoCostiDivisione', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        
        var serviceUrl = '/api/divisione/costo/grafico';

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl , {},
            {
                // update: { method: 'PUT' }
                query:  {method:'GET', isArray:true}
            });
            
        delete entity.prototype.$delete;
        delete entity.prototype.$remove;
        delete entity.prototype.$save;
        delete entity.prototype.$post;
        delete entity.prototype.$put;
        return entity;
    }])
    nivolaApp.factory('CostiDivisioneDettaglio', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = 'api/divisione/costo/grafico/account';

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl, { uuid: '@uuidStruttura' },
            {
                // update: { method: 'PUT' }
                query:  {method:'GET', isArray:true}
            });

        delete entity.prototype.$delete;
        delete entity.prototype.$remove;
        delete entity.prototype.$save;
        delete entity.prototype.$post;
        delete entity.prototype.$put;
        return entity;
    }])
    nivolaApp.factory('CostiOrganizzazioneDettaglio', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = 'api/organizzazione/costo/grafico/divisione';

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl, { uuid: '@uuidStruttura' },
            {
                // update: { method: 'PUT' }
                query:  {method:'GET', isArray:true}
            });

        delete entity.prototype.$delete;
        delete entity.prototype.$remove;
        delete entity.prototype.$save;
        delete entity.prototype.$post;
        delete entity.prototype.$put;
        return entity;
    }])
    nivolaApp.factory('CostiDivisioneRendicontati', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = '/api/rendiconti';

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl,{},
            {
                // update: { method: 'PUT' }
                query:  {method:'GET', isArray:false}
            });

        delete entity.prototype.$delete;
        delete entity.prototype.$remove;
        delete entity.prototype.$save;
        delete entity.prototype.$post;
        delete entity.prototype.$put;
        return entity;
    }])
    
    nivolaApp.factory('ConsumiNonRendicontatiOrganizzazione', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = '/api/organizzazione/costo/mese';

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl, { uuid: '@uuidStruttura' },
            {
                // update: { method: 'PUT' }
                query:  {method:'GET', isArray:false}
            });

        delete entity.prototype.$delete;
        delete entity.prototype.$remove;
        delete entity.prototype.$save;
        delete entity.prototype.$post;
        delete entity.prototype.$put;
        return entity;
    }])
    
    nivolaApp.factory('AndamentoCostiOrganizzazione', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = '/api/organizzazione/costo/grafico';

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl, { uuid: '@uuidStruttura' },
            {
                // update: { method: 'PUT' }
                query:  {method:'GET', isArray:true}
            });

        delete entity.prototype.$delete;
        delete entity.prototype.$remove;
        delete entity.prototype.$save;
        delete entity.prototype.$post;
        delete entity.prototype.$put;
        return entity;
    }])
    nivolaApp.factory('CostiOrganizzazioneRendicontati', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = '/api/rendiconti';

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl,{},
            {
                // update: { method: 'PUT' }
                query:  {method:'GET', isArray:false}
            });

        delete entity.prototype.$delete;
        delete entity.prototype.$remove;
        delete entity.prototype.$save;
        delete entity.prototype.$post;
        delete entity.prototype.$put;
        return entity;
    }]);


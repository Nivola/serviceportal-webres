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
    .factory('StimaCostiVm', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = '/api/vm/stimacosto?';
        //var entity = $resource(entitiesRest.getBaseUrl + serviceUrl, null,
        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl + 'numCpu=:numCpu&gbRam=:gbRam&gbDiscoBase=:gbDiscoBase&gbDiscoPrestazionale=:gbDiscoPrestazionale'
             +'&licenzaCommerciale=:licenzaCommerciale&accountId=:accountId', 
            { numCpu: '@numCpu' , gbRam: '@gbRam' , gbDiscoBase: '@gbDiscoBase' , gbDiscoPrestazionale : '@gbDiscoPrestazionale', licenzaCommerciale: '@licenzaCommerciale', accountId: '@accountId'  },
            {
                // update: { method: 'put' }
            });

        delete entity.prototype.$save;
        delete entity.prototype.$delete;
        delete entity.prototype.$remove;

        return entity;
    }])
    .factory('StimaCostiDbass', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = '/api/dbaas/stimacosto?';
        //var entity = $resource(entitiesRest.getBaseUrl + serviceUrl, null,
        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl + 'numCpu=:numCpu&gbRam=:gbRam&gbDiscoBase=:gbDiscoBase&gbDiscoPrestazionale=:gbDiscoPrestazionale'
             +'&accountId=:accountId&engineType=:engineType', 
            { numCpu: '@numCpu' , gbRam: '@gbRam' , gbDiscoBase: '@gbDiscoBase' , gbDiscoPrestazionale : '@gbDiscoPrestazionale', licenzaCommerciale: '@licenzaCommerciale', accountId: '@accountId' , engineType: '@engineType' },
            {
                // update: { method: 'put' }
            });

        delete entity.prototype.$save;
        delete entity.prototype.$delete;
        delete entity.prototype.$remove;

        return entity;
    }])
    .factory('StimaCostiStaas', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = '/api/staas/stimacosto?';
        //var entity = $resource(entitiesRest.getBaseUrl + serviceUrl, null,
        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl +'&accountId=:accountId&dimensione=:dimensione', 
            { accountId: '@accountId' , dimensione: '@dimensione' },
            {
                // update: { method: 'put' }
            });

        delete entity.prototype.$save;
        delete entity.prototype.$delete;
        delete entity.prototype.$remove;

        return entity;
    }])

   

    
    

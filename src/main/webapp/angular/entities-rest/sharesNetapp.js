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
    .factory('SharesNetapps', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = '/api/account/staas?';

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl + 'accountUuid=:accountUuid' , {accountUuid : '@accountUuid'},
        
            {
                // update: { method: 'put' }
            });
            delete entity.prototype.$delete;
            delete entity.prototype.$remove;
            delete entity.prototype.$save;
            delete entity.prototype.$post;
            delete entity.prototype.$put;

        return entity;
    }]).factory('SharesNetappsAssociati', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = '/api/account/staas/associati?';

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl + 'accountUuid=:accountUuid' , {accountUuid : '@accountUuid'},
        
            {
                // update: { method: 'put' }
            });
            delete entity.prototype.$delete;
            delete entity.prototype.$remove;
            delete entity.prototype.$save;
            delete entity.prototype.$post;
            delete entity.prototype.$put;

        return entity;
    }])
    .factory('NewSharesNetapps', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = '/api/account/staas';
        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl, null,
        
            {
                // update: { method: 'put' }
            });
            delete entity.prototype.$delete;
            delete entity.prototype.$remove;
            //delete entity.prototype.$save;
            //delete entity.prototype.$post;
            //delete entity.prototype.$put;

        return entity;
    }]);  
    

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
    
    .factory('AllegatiAccount', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = '/api/documento/:uuid';

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl , { uuid: '@uuid'},
            {
                get:  {isArray:true}

            });

        delete entity.prototype.$post;
        delete entity.prototype.$query;
        delete entity.prototype.$save;

        return entity;
    }])
    .factory('TipiDocumentiAllegati', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = '/api/documento/tipi';

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl , { uuid: '@uuid'},
            {
                get:  {isArray:true}

            });

        delete entity.prototype.$post;
        delete entity.prototype.$query;
        delete entity.prototype.$save;

        return entity;
    }])
    .factory('UploadFile', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = '/api/documento';

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl + '/:uuid/upload/:tipo' , { uuid: '@uuid', tipo : '@tipo'},
            {
                //get:  {isArray:true}

            });

        //delete entity.prototype.$post;
        delete entity.prototype.$query;
        delete entity.prototype.$save;

        return entity;
    }])
    .factory('DownloadAllegato', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = '/api/documento/download';

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl + '/:uuid/:nomedoc' , { uuid: '@uuid', nomedoc : '@nomedoc'},
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
    .factory('DeleteFile', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = '/api/documento';

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl , {},
            {
                update: { method: 'PUT' }

            });

        return entity;
    }]); 
    
    
    

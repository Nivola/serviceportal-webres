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
.service('dashboardAccountActiveServices', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
    'use strict';
    var serviceUrl = '/api/dashboard/account/:id/activeservices';
   
    var entity = $resource(entitiesRest.getBaseUrl + serviceUrl, {id:'@id'},
                {   
                    get:{method:'GET', isArray:true},
                    getOneService:{method:'GET', isArray:true, params: {tipoServizio: '@tipoServizio'}}
                }); 
   entity.tipiServizi = {
        ComputeService : 'ComputeService',
        DatabaseService : 'DatabaseService',
        StorageService : 'StorageService',
        AppEngineService : 'AppEngineService',
        CostiConsumiService:'CostiConsumiService'
        
    };
    angular.extend(this, entity);
}])

.service('dashboardAccountCosti', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
    'use strict';
    var serviceUrl = "/api/dashboard/account/:id/costi";
   
    var entity = $resource(entitiesRest.getBaseUrl + serviceUrl, {id:'@id'},
                {   
                    // get:{method:'GET', params: {anno: '@anno'}}
                }); 
    angular.extend(this, entity);
}])

.service('dashboardDivisioneCosti', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
    'use strict';
    var serviceUrl = "/api/dashboard/divisione/:id/costi";
   
    var entity = $resource(entitiesRest.getBaseUrl + serviceUrl, {id:'@id'},
                {   
                    get:{method:'GET', params: {anno: '@anno'}}
                }); 
    angular.extend(this, entity);
}])

.service('dashboardDivisioneRisorse', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
    'use strict';
    var serviceUrl = "/api/dashboard/divisione/:id/risorse";
   
    var entity = $resource(entitiesRest.getBaseUrl + serviceUrl, {id:'@id'}); 
    angular.extend(this, entity);
}])

.service('dashboardOrganizzazioneCosti', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
    'use strict';
    var serviceUrl = "/api/dashboard/organizzazione/:id/costi";
   
    var entity = $resource(entitiesRest.getBaseUrl + serviceUrl, {id:'@id'},
                {   
                    get:{method:'GET', params: {anno: '@anno'}}
                }); 
    angular.extend(this, entity);
}])

.service('dashboardOrganizzazioneRisorse', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
    'use strict';
    var serviceUrl = "/api/dashboard/organizzazione/:id/risorse";
   
    var entity = $resource(entitiesRest.getBaseUrl + serviceUrl, {id:'@id'}); 
    angular.extend(this, entity);
}])
.service('dashBoardStatoUtilizzatori', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = '/api/dashboard/stato-utilizzatori';

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl ,
            {
                // update: { method: 'PUT' }
            });

        delete entity.prototype.$delete;
        delete entity.prototype.$remove;
        delete entity.prototype.$save;
        return entity;
    }]);


    

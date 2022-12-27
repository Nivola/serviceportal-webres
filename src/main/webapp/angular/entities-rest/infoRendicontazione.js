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
    .factory('InfoRendicontazioneCodifiche', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = '/api/metrichecosto/descrivi';

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl , {},
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
    
    
    
    .factory('InfoRendicontazione', ['$resource', 'entitiesRest', function ($resource, entitiesRest) {
        'use strict';
        var serviceUrl = 'api/accountcmp';

        var entity = $resource(entitiesRest.getBaseUrl + serviceUrl+'/:idAccount/metrichecosto/:idMetrica', { idAccount: '@idAccount',idMetrica:'@idMetrica' },
            {
                update: { method: 'put' }
            });


        return entity;
    }]);

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
nivolaApp.provider('entitiesRest', function () {
    'use strict';

    var baseUrl = '';

    this.setBaseUrl = function (value) {
        baseUrl = value.endsWith('/') ? value : value + '/';
    };

    this.$get = ['$injector', function ($injector) {
        var managerEntity = {
            getBaseUrl : baseUrl,
            getEntity : function (name) {
                var entity = $injector.get(name);
                return entity;
            }
        }

        return managerEntity;
    }];
});

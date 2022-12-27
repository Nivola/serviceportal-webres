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
angular.module('app').
component('simpleInstanceList', {
    templateUrl: 'angular/components/simple-istance-list/simple-instance-list.component.html',
    bindings: {
      vmList: '<',
    }
});

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
nivolaApp.directive('cfCheck', ['$http', '$q', function ($http, $q) {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {

            ctrl.$asyncValidators.cfCheck = function (modelValue, viewValue) {

                if (ctrl.$isEmpty(modelValue) || ctrl.length > 5) {
                    // consider empty model valid
                    return $q.when();
                }

                var def = $q.defer();
                var cf = modelValue;

                if (cf.match(/^[A-Za-z]{6}[0-9]{2}[A-Za-z]{1}[0-9]{2}[A-Za-z]{1}[0-9]{3}[A-Za-z]{1}$/g)) {
                    ctrl.$setValidity('cfCheck', true);
                    def.resolve();
                } else {
                    ctrl.$setValidity('cfCheck', false);
                    def.reject();
                }

                return def.promise;
            };
        }
    };
}]);

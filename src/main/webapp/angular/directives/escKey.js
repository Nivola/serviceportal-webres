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
nivolaApp.directive('escKey', function () {
    return function (scope, element, attrs) {
        element.bind('keydown keypress', function (event) {
            if (event.which === 27) { // 27 = esc key
                scope.$apply(function () {
                    scope.$eval(attrs.escKey);
                });

                event.preventDefault();
            }
        });
        scope.$on('$destroy', function () {
            element.unbind('keydown keypress')
        })
    };
});

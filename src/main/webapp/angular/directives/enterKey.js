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
nivolaApp.directive('enterKey', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (e) {
            if (e.which === 13) { // 13 = enter key
                scope.$apply(function () {
                    scope.$eval(attrs.enterKey);
                });

                e.preventDefault();
            }
        });
        scope.$on('$destroy', function () {
            element.unbind('keydown keypress')
        })
    };
});

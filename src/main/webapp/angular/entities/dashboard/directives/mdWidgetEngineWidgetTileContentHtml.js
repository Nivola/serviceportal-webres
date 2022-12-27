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
// To pass custom directives dyamically it needs to be compiled first
nivolaApp.directive('mdWidgetEngineWidgetTileContentHtml', ['conf', function(conf) {
    return {
        transclude: true,
        controller: function($scope, $element, $attrs, $transclude, $timeout, $compile){
            var el = $compile($scope.widget.content)($scope);
            $element.parent().append(el);
        },
        link: function($scope, iElm, iAttrs, controller) {}
    };
}]);

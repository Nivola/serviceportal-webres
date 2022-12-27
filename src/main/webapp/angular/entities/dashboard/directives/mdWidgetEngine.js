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
// The main widget engine directive
nivolaApp.directive('mdWidgetEngine', ['conf', function(conf) {
    return {
        scope: {
            configuration: "=configuration",
            callback: "=callback",
            displayxs:"<displayxs"
        },
        templateUrl : conf.siteContext + "angular/entities/dashboard/directives/widget-engine.html",
        controller: function($scope, $element, $attrs, $transclude, $timeout){
            $timeout(function(){
                $scope.configuration =  $scope.configuration || {};
            });
        },
        link: function($scope, iElm, iAttrs, controller) {}
    };
}]);





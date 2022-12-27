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
nivolaApp.service( 'tutorialsDataProviderService', ['TutorialService', 'utils', 'conf', '$state', function(TutorialService, utils, conf, $state) {

    this.provide = function($scope, widget) {

    	$scope.loading = true;
    	$scope.tutorials = [];

        widget.callbacks = {
            onTutorialClick : function(item) {
                $state.go("app.tutorial.visualizza", {
                	idTutorial : item.id
                });
            }
        };

        TutorialService.getAllMyTutorials().then(function(data) {

        	var dtoList = $.grep(data, function(candidate) {
        		return candidate.status == 'PUBLISHED';
        	});
        	
        	dtoList = utils.sortByProperty(dtoList, 'ordinal', +1);
        	
        	$.each(dtoList, function(i, dto) {
                var o = angular.copy(dto);
				$scope.tutorials.push(o);
			 });
			 
			//$scope.tutorials = $scope.tutorials.concat(dtoList);
        	
        	$scope.loading = false;
			$scope.failed = false;
		}, function() {
			$scope.loading = false;
			$scope.failed = true;
		});
    };

}]);

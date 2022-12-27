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
// Every widget column has X widget tiles
nivolaApp.directive('mdWidgetEngineWidgetTile', ['conf', function(conf) {
    function mdWidgetEngineWidgetTileDirectiveController(){
	    var _obj = {};
	    _obj._draggedTile = null;

	    _obj.controller = function($scope, $element, $attrs, $transclude, $mdDialog, $timeout, $sce, $document, events){
	    	
	    	$scope.$on(events.GLOBAL_SEARCH_CHANGED, function(event, filter) {
	    		$scope.filter = filter;
	    	});
	    	
	        $scope.fullscreen = false;
	        $scope.widget._internalSettings = {};
	        $scope.widget._internalSettings.trustedURL = $sce.trustAsResourceUrl($scope.widget.content);
	        $scope.widget._internalSettings.trustedHTML = $sce.trustAsHtml($scope.widget.content);
	        $scope.widget._internalSettings.isFabControlOpen = false;
	        $scope.widget._internalSettings.isMoving = false;
	        $scope.toggleFullscreen = function(){
	            $scope.fullscreen = !$scope.fullscreen;
	            $scope.callback("$toggleFullscreen", $scope.widget);
	        };

	        $scope.toggleSticky = function(){
	            $scope.widget.sticky = !$scope.widget.sticky;
	        };

	        $scope.removeWidget = function(e){
//	            var confirm = $mdDialog.confirm()
//	                          .title('Sei sicuro?')
//	                          .textContent('Nascondere la scheda "' + $scope.widget.title + '" ?')
//	                          .ariaLabel('Sei sicuro di voler nascondere la scheda?')
//	                          .targetEvent(e)
//	                          .ok('Sì')
//	                          .cancel('Annulla');
//
//	            $mdDialog.show(confirm).then(function(){
	                
	            	// $element.addClass('md-widget-engine-widget-remove');
	            	
//	                $timeout(function(){
	                    // var removedWidget = $scope.configuration.columns[$scope.columnIndex].widgets.splice($scope.widgetIndex, 1);
	                	var removedWidget = $scope.configuration.columns[$scope.columnIndex].widgets[$scope.widgetIndex];
	                	
	                	removedWidget.hidden = true;
	                	
	                    // $scope.callback("$removeWidget", removedWidget[0]);
	                	// $scope.callback("$removeWidget", removedWidget);
	                	$scope.callback("$hiddenWidget", removedWidget);
	                    $scope.callback("$update", $scope.configuration);
//	                }, 200);
	                
//	            }, function(){});
	        };

	        $scope.restoreWidget = function(e){

	        	var restoredWidget = $scope.configuration.columns[$scope.columnIndex].widgets[$scope.widgetIndex];
            	
	        	restoredWidget.hidden = false;
            	
                // $scope.callback("$removeWidget", removedWidget[0]);
            	$scope.callback("$restoredWidget", restoredWidget);
                $scope.callback("$update", $scope.configuration);
	        };

	        $scope.customActionCallback = function(cAction){
	            $scope.callback(cAction.event, $scope.widget);
	        };

	        $scope.openMenu = function($mdOpenMenu, ev) {
	            originatorEv = ev;
	            $mdOpenMenu(ev);
	        };

	        // $element.attr("draggable", "true");

	        $element.on('dragstart', function(event){
	            
	            // only drag when initiated by child
	            event.stopPropagation();
	          
	            if (event.originalEvent) event = event.originalEvent; // PATCH
	          
	            if(!event._initiatedByDragger || $scope.fullscreen){
	                if(!(event.dataTransfer && event.dataTransfer.types && event.dataTransfer.types.length)){
	                    event.preventDefault();
	                }
	                event.stopPropagation();
	                return;
	            }
	            // $scope.fullscreen = false; //incase, you know
	            $element.addClass("md-widget-engine-widget-moving");
	            var draggerPosition = $scope.columnIndex + "::" + $scope.widgetIndex;
	            event.dataTransfer.setData("Text", draggerPosition);
	            event.dataTransfer.effectAllowed = "move";
	            event.dataTransfer.dropEffect = "move";
	            event.dataTransfer.setDragImage($element[0], 20, 20);
	            _obj._draggedTile = $element;
	            $scope.widget._internalSettings.isMoving = true;
	            // console.log($scope.columnIndex, $scope.widgetIndex);
	        });

	        $element.on('dragenter', function(event){
	            event.stopPropagation();
	            if($scope.widget.sticky) return false;
	            if(!$scope.isAnyWidgetMoving()) return false;
	            if($element.hasClass('md-widget-engine-widget-moving')) return;
	            $element.addClass("md-widget-engine-widget-dashed");
	        });

	        $element.on('dragover', function(event){
	            event.stopPropagation();
	            if($scope.widget.sticky) return false;
	            if(!$scope.isAnyWidgetMoving()) return false;
	            if($element.hasClass('md-widget-engine-widget-moving')) return;
	            $element.addClass("md-widget-engine-widget-dashed");
	            if(event.preventDefault) event.preventDefault();
	        });

	        $element.on('dragleave', function(event){
	            event.stopPropagation();
	            if($scope.widget.sticky) return false;
	            if(!$scope.isAnyWidgetMoving()) return false;
	            $element.removeClass("md-widget-engine-widget-dashed");
	        });

	        $element.on('dragend', function(event){
	            event.stopPropagation();
	            if($scope.widget.sticky) return false;
	            if(!$scope.isAnyWidgetMoving()) return false;
	            event = event.originalEvent || event;
	            $element.removeClass("md-widget-engine-widget-moving");
	            $scope.widget._internalSettings.isMoving = false;
	        });

	        $element.on('drop', function(event){
	            event.stopPropagation();
	            if (event.originalEvent) event = event.originalEvent; // PATCH
	          
	            if($scope.widget.sticky) return false;
	            if(!$scope.isAnyWidgetMoving()) return false;

	            // get the positions of swappers
	            var draggerPosition = (event.dataTransfer.getData("Text") || event.dataTransfer.getData("text/plain")).split("::");
	            if($scope.columnIndex == draggerPosition[0] && $scope.widgetIndex == draggerPosition[1]) return; // no need to drop at the same place
	            var dropeePosition = [$scope.columnIndex, $scope.widgetIndex];
	            // get the elements
	            var draggerElement = $scope.configuration.columns[draggerPosition[0]].widgets[draggerPosition[1]];
	            var dropeeElement =  $scope.configuration.columns[dropeePosition[0]].widgets[dropeePosition[1]];
	            // swap the elements
	            $scope.configuration.columns[draggerPosition[0]].widgets[draggerPosition[1]] = dropeeElement;
	            $scope.configuration.columns[dropeePosition[0]].widgets[dropeePosition[1]] = draggerElement;
	            
	            _obj._draggedTile.removeClass("md-widget-engine-widget-dashed");
	            $element.removeClass("md-widget-engine-widget-dashed");

	            setTimeout(function(){
	                $scope.$apply();
	                $scope.callback("$update", $scope.configuration);
	            }, 150);
	            // if source and destination are same, well then move on :P
	        });

	    };

	    return _obj.controller;
	}


    return {
        scope: false,
        replace: true,
        templateUrl : conf.siteContext + "angular/entities/dashboard/directives/widget-engine-tile.html",
        controller: mdWidgetEngineWidgetTileDirectiveController(),
        link: function($scope, iElm, iAttrs, controller) {    	
        }
    };
}]);

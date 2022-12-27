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
// Every widget engine has X columns
nivolaApp.directive('mdWidgetEngineColumn', ['conf', function mdWidgetEngineColumnDirective(conf) {
    return {
        scope: false,
        templateUrl : conf.siteContext + "angular/entities/dashboard/directives/widget-engine-column.html",
        
        controller: function($scope, $element, $attrs, $transclude, $document, $timeout){
            
            $scope.widgetEngineClientRect = {};

            var mouseMove = function(e){
                // console.log("mouse moving", e);
                var newX = e.clientX - $scope.widgetEngineClientRect.left + 16;
                var differenceXPercentage =  ((newX - $element[0].children[0].offsetLeft) / $scope.widgetEngineClientRect.width) * 100;
                // don't allow doing anything the affected column is 15% already now
                
                if($scope.configuration.columns[$scope.columnIndex + 1].size - (differenceXPercentage - $scope.column.size) <=15)
                    return;
                if($scope.configuration.columns[$scope.columnIndex].size <= 15 && differenceXPercentage <= 15)
                    return;
                if($scope.configuration.columns[$scope.columnIndex + 1])
                    $scope.configuration.columns[$scope.columnIndex + 1].size -= differenceXPercentage - $scope.column.size;

                $scope.column.size = differenceXPercentage;
                $timeout(function(){
                    
                });
                
            };

            var mouseUp = function(){
                // console.log("mouse up");
                $document.unbind('mouseup', mouseUp);
                $document.unbind('mousemove', mouseMove);
                $scope.callback("$resize", $scope.configuration);
            };

            $scope.setupColumnResizing = function(e){
                event.preventDefault();
                // console.log("mouse down", e);
                $document.on('mouseup', mouseUp);
                $document.on('mousemove', mouseMove);
                $scope.widgetEngineClientRect = $element.parent().parent()[0].getBoundingClientRect();
                
            };

            $scope.addNewColumn = function(){
                var newColumn = angular.copy($scope.configuration.columns[$scope.columnIndex]);
                newColumn.widgets = []; // reset the columns
                newColumn.size = '';
                $timeout(function(){
                    $scope.configuration.columns.splice($scope.columnIndex + 1, 0, newColumn);
                });
            };

            $scope.removeEmptyColumn = function(){
                if($scope.configuration.columns[$scope.columnIndex + 1] && $scope.configuration.columns[$scope.columnIndex -1]){
                    $scope.configuration.columns[$scope.columnIndex + 1].size += $scope.column.size / 2;
                    $scope.configuration.columns[$scope.columnIndex - 1].size += $scope.column.size / 2;
                }else if($scope.configuration.columns[$scope.columnIndex + 1]){
                    $scope.configuration.columns[$scope.columnIndex + 1].size += $scope.column.size;
                }else if($scope.configuration.columns[$scope.columnIndex - 1].size){
                    $scope.configuration.columns[$scope.columnIndex - 1].size += $scope.column.size;
                }

                var removedColumn = $scope.configuration.columns.splice($scope.columnIndex, 1);
                // check if the total width is less than 100% due to resizing of last column and deleting an empty column
                var totalWidth = 0;
                $scope.configuration.columns.forEach(function(c){
                    totalWidth+= c.size;
                });
            };

            // this is only needed when ther are 2 widget engines on the same page; the scope of parent is shared
            $scope.isAnyWidgetMoving = function(){
                var isMoving = false;
                $scope.configuration.columns.forEach(function(c){
                    c.widgets.forEach(function(w){
                        if(w._internalSettings.isMoving) isMoving = true;
                    });
                });
                return isMoving;
            };

            $element.on('dragenter', function(event){
                if(!$scope.isAnyWidgetMoving()) return false;
                $element.addClass("md-widget-engine-column-dashed");
                event.stopPropagation();
            });

            $element.on('dragover', function(event){
                if(!$scope.isAnyWidgetMoving()) return false;
                $element.addClass("md-widget-engine-column-dashed");
                event.stopPropagation();
                if(event.preventDefault) event.preventDefault();
            });

            $element.on('dragleave', function(event){
                if(!$scope.isAnyWidgetMoving()) return false;
                $element.removeClass("md-widget-engine-column-dashed");
                event.stopPropagation();
            });

            $element.on('drop', function(event){
                if(!$scope.isAnyWidgetMoving()) return false;
                // get the positions of swappers
                if (event.originalEvent) event = event.originalEvent; // PATCH
              
                var draggerPosition = (event.dataTransfer.getData("Text") || event.dataTransfer.getData("text/plain")).split("::");
                if($scope.columnIndex == draggerPosition[0]){
                    $element.removeClass("md-widget-engine-column-dashed");
                    return;  // if dropping in the same column  
                }
                // get the elements
                var draggerElement = $scope.configuration.columns[draggerPosition[0]].widgets[draggerPosition[1]];
                // swap the elements
                var removedWidget = $scope.configuration.columns[draggerPosition[0]].widgets.splice(draggerPosition[1], 1)[0];
                $scope.configuration.columns[$scope.columnIndex].widgets.push(removedWidget);
                // assign configurations
                $element.removeClass("md-widget-engine-column-dashed");
                $document.find(".md-widget-engine-column-dashed").removeClass('md-widget-engine-column-dashed');
                $timeout(function(){
                    $scope.$apply();
                    $scope.callback("$update", $scope.configuration);
                }, 150);
                // if source and destination are same, well then move on :P
            });

        },
        link: function($scope, iElm, iAttrs, controller) {}
    };
}]);

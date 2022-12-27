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
component('restorePointsDetail', {
    templateUrl: 'angular/components/restore-points-detail/restore-points-detail.component.html',
    bindings: {
      data: '<',
      query: '<',
      onLoadVmList:'&',
      onLoadRestorePoint: '&'
    },
    controller: function($scope,$mdDialog,$translate,$stateParams){
      var ctrl = this;

      ctrl.rpToLoad = {
         idRp: null,
         idVm: null,
         nameVm: null,
      };

      ctrl.lists = [];
      ctrl.confirm = false;
      ctrl.point = {};

      function setModalData(point) {
        ctrl.point=point;
        ctrl.rpToLoad.idRp=point.id;
        ctrl.rpToLoad.idVm= $stateParams.idVm;
        ctrl.lists=point.instanceSet?point.instanceSet:[];
      }

      function resetModalData(){
        ctrl.point={};
        ctrl.rpToLoad = {
          idRp: null,
          idVm: null,
          nameVm: null,
       };
       ctrl.lists =[];
       ctrl.confirm = false;
      }
    
        $scope.resetToRestorePoint=function(point){
          
          setModalData(point);
          $mdDialog.show({    
              controller: ()=>this, 
              templateUrl: 'angular/components/restore-points-detail/launch-restore-point-modal.html',
              parent: angular.element(document.body),
              scope:$scope,
              preserveScope:true,
              clickOutsideToClose: true,
              fullscreen: true	
          }) .then(function () {
            ctrl.onLoadRestorePoint({idRp:ctrl.rpToLoad.idRp,idVm:ctrl.rpToLoad.idVm,nameVm:ctrl.rpToLoad.nameVm});
            resetModalData();
        });
          
      }
    
      $scope.complete=function(){
        $mdDialog.hide();
      }
    
      $scope.closeDialog = function () {
        resetModalData();
        $mdDialog.cancel();
      };      
    }
  });

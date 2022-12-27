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
component('vmList', {
    templateUrl: 'angular/entities/compute/components/vm-list/vm-list.component.html',
    bindings: {
      selectedVms: '<',
      unselectAll: '&',
      actions:'<',
      filter:'<',
      query:'<',
      vmList:'<',
      rtdVmConnect:'<',
      resetFilter:'&',
      callRecoveryPoint:'&',
      callDelete:'&',
    },
    controller: function($scope,$mdDialog,$translate,$stateParams){
      var ctrl = this;

      $scope.options = {
        rowSelection: true,
        multiSelect: false,
        autoSelect: true,
        decapitate: false,
        largeEditDialog: false,
        boundaryLinks: false,
        limitSelect: true,
        pageSelect: true
    };

    $scope.limitOptions = [ 10, 20, 30];

    

    this.$onInit = function () {
   }
  }
});

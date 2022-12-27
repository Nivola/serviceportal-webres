/*-
 * ========================LICENSE_START=================================
 * Nivola Service Portal Web Resources
 * %%
 * Copyright (C) 2022 Regione Piemonte
 * %%
 * SPDX-FileCopyrightText: Copyright 2022 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
angular.module('app').
component('generalInformations', {
    templateUrl: 'angular/entities/struttura-organizzativa/accounts/components/general-informations/general-informations.component.html',
    bindings: {
      account: '=',
      organizzazioni: '<',
      divisioni: '<',
      categorie: '<',     
      people: '<',     
      onOrganizzazioneChange:'&',
      onDivisioneChange:'&',
      onSaveAccount:'&',
      onCheckAcronimo:'&',
      isUpdate: '<',
      options: '<',
    }, controller: function ($scope, $anchorScroll, $location, $mdDialog) {
        var ctrl = this;

        ctrl.formAccount={}
        ctrl.organizzazione=null;
        ctrl.divisione=null;


        ctrl.clickSaveAccount=function(){
          
          if ($scope.formAccount.$valid) {
            ctrl.onSaveAccount();
          }else{
            $location.hash($scope.formAccount.$error.required[0]);
            $anchorScroll($scope.formAccount.$error.required[0]);
        }
        }

        this.$onInit = function () {
          if(ctrl.isUpdate){
            ctrl.options.showSteps=true;
          }
          setTimeout(() => {
            if((!ctrl.organizzazione||!ctrl.organizzazione)&&ctrl.account&&ctrl.account.organizzazione&&ctrl.account.divisione){

               ctrl.organizzazione=ctrl.account.organizzazione.name;
               if(ctrl.account.organizzazione.desc) ctrl.organizzazione=ctrl.organizzazione.concat(` - ${ctrl.account.organizzazione.desc}`)
               ctrl.divisione=ctrl.account.divisione.name;
               if(ctrl.account.divisione.desc) ctrl.divisione=ctrl.divisione.concat(` - ${ctrl.account.divisione.desc}`)
   
            }
        }, 1500);
          };
    }})

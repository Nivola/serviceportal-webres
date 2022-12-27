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
angular.module('app').component('billingDetails', {
   templateUrl:
      'angular/entities/struttura-organizzativa/accounts/components/billing-details/billing-details.component.html',
   bindings: {
      account: '=',
      prezzari: '<',
      listini: '<',
      pricesHistory: '<',
      doSaveBilling: '&',
      doCancelBilling: '&',
      doLoadListiniDisponibili: '&',
      priceListTypes: '<',
   },
   controller: function ($scope, $anchorScroll, $location, $mdDialog, $stateParams) {
      var ctrl = this;

      ctrl.listinoAccountData = {
         id: null,
         refAccount: null,
         dataCreazione: null,
         dataFineAssociazione: null,
         dataInizioAssociazione: null,
         usaListinoSpecifico: 'N',
         idListino: null,
         tipoListinoCodice: 'CSI',
         tipoPrezzoCodice: null,
      };

      ctrl.addListino = false;
      ctrl.editListino = false;
      ctrl.isRemove = false;

      $scope.formBilling = {};
      ctrl.minEndDateConsumi = new Date();
      ctrl.showPricesStep = false;
      ctrl.minMaxArray = [];
      ctrl.dateGaps = [];

      
      ctrl.organizzazione=null;
      ctrl.divisione=null;

      ctrl.minDateAssociazioneEnd  = new Date();
      ctrl.minDateAssociazioneStart  = new Date();
      $scope.initialized=false;

      ctrl.disableAggiornaCosti=false;

      ctrl.onAggiornaCostiGiornoChanged = function (ev) {
         if(!ctrl.account.aggiornaCostiGiorno){
            ctrl.resetForm()
         }
         ctrl.resetDates();
         
      };

      
      ctrl.resetDates = function () {
         ctrl.account.dataFineConsumi = null;
         ctrl.listinoAccountData.dataInizioAssociazione=null;
         ctrl.listinoAccountData.dataFineAssociazione=null;
      }
      
      ctrl.setDates = function (isUpdate) {
         const lastAssociation=ctrl.pricesHistory&&ctrl.pricesHistory.length===1;
         const dayTime=86400000;
         var startDate= new Date();

         if(isUpdate){
            if(lastAssociation){
               startDate.setTime(Date.parse(ctrl.creation));
            }else{
               startDate.setTime(Date.parse(ctrl.pricesHistory[1].dataFineAssociazione)+dayTime);
            }
         }else{
            startDate.setTime(Date.parse(ctrl.pricesHistory[0].dataInizioAssociazione)+dayTime);
         }

         ctrl.minDateAssociazioneStart.setTime(startDate.getTime());
         ctrl.minDateAssociazioneEnd.setTime(ctrl.minDateAssociazioneStart.getTime()+dayTime);

      };

      ctrl.onAssociationDateChanged = function () {
            ctrl.minDateAssociazioneEnd = setTime(ctrl.listinoAccountData.dataInizioAssociazione.getTime() + 86400000);
      };

      ctrl.callSaveBilling = function () {
         ctrl.listinoAccountData.refAccount = ctrl.account.uuid;
         if ($scope.formBilling) {
               $mdDialog.show({    
                  controller: ()=>this, 
                  templateUrl: 'angular/entities/struttura-organizzativa/accounts/components/billing-details/billing-detail-confirm-modal.html',
                  parent: angular.element(document.body),
                  scope:$scope,
                  preserveScope:true,
                  clickOutsideToClose: false,
                  fullscreen: true	
              }).then(function () {
               ctrl.doSaveBilling({ data: ctrl.listinoAccountData, isUpdate:!!ctrl.listinoAccountData.id });
               ctrl.resetForm();
              });

         } else {
            $location.hash($scope.formAccount.$error.required[0]);
            $anchorScroll($scope.formAccount.$error.required[0]);
         }
      };

      ctrl.loadPrezzi = function () {
         var listaPrezziListino = ctrl.listini.filter((el) => el.id === ctrl.listinoAccountData.idListino);
         if (listaPrezziListino && listaPrezziListino.length === 1) {
            ctrl.prezzari = angular.copy(listaPrezziListino[0].tipiPrezzoAmmessi);
            ctrl.listinoAccountData.tipoPrezzoCodice = null;
         }
      };

      ctrl.changePriceListType = function (load) {
         ctrl.listinoAccountData.tipoListinoCodice= ctrl.priceListTypes.filter(el=>el.codice!==ctrl.listinoAccountData.tipoListinoCodice)[0].codice;
         ctrl.listinoAccountData.tipoPrezzoCodice = null;
         ctrl.listinoAccountData.idListino = null;
         ctrl.doLoadListiniDisponibili({ firstLoad: load });
      };

      ctrl.removePriceListRecord = function (listino) {
         ctrl.isRemove=true;  
         $mdDialog.show({    
            controller: ()=>this, 
            templateUrl: 'angular/entities/struttura-organizzativa/accounts/components/billing-details/billing-detail-confirm-modal.html',
            parent: angular.element(document.body),
            scope:$scope,
            preserveScope:true,
            clickOutsideToClose: false,
            fullscreen: true	
        }).then(function () {
         ctrl.doCancelBilling({ idListino: listino.id});
         ctrl.resetForm();
        });
      };

      ctrl.editPriceListRecord = function (listino) {
         ctrl.listinoAccountData = angular.copy(listino);
         ctrl.listinoAccountData.dataInizioAssociazione = new Date(Date.parse(listino.dataInizioAssociazione));
         ctrl.listinoAccountData.dataFineAssociazione = listino.dataFineAssociazione
            ? new Date(Date.parse(listino.dataFineAssociazione))
            : listino.dataFineAssociazione;
         ctrl.listinoAccountData.idListino=listino.listino.id
         ctrl.doLoadListiniDisponibili({ firstLoad: listino.usaListinoSpecifico==='S' });
         ctrl.isRemove=false;
         ctrl.editListino = true;     
         ctrl.setDates(true);    
      };

      ctrl.doAddListino = function () {
            ctrl.addListino = true;
            ctrl.listinoAccountData.usaListinoSpecifico = 'N';
            ctrl.setDates(false);
      };

      
      ctrl.resetForm = function () {
         ctrl.addListino=false;
         ctrl.editListino=false;
         $scope.formBilling.$setPristine();
   };

      this.$onInit = function () {
         ctrl.account.dataInizioConsumi = new Date();
         ctrl.minEndDateConsumi.setTime(ctrl.account.dataInizioConsumi.getTime() + 86400000);
         ctrl.listinoAccountData.dataCreazione = new Date();
         ctrl.addListino = false;
         ctrl.disableAggiornaCosti=ctrl.account.aggiornaCostiGiorno?true:false;
      };
      
      this.$onChanges=function(change){
         if(!$scope.initialized&&!jQuery.isEmptyObject($scope.formBilling)){
            $scope.initialized=true;
         }
         setTimeout(() => {
            if((!ctrl.organizzazione||!ctrl.organizzazione)&&ctrl.account&&ctrl.account.organizzazione&&ctrl.account.divisione){

               ctrl.organizzazione=ctrl.account.organizzazione.name;
               if(ctrl.account.organizzazione.desc) ctrl.organizzazione=ctrl.organizzazione.concat(` - ${ctrl.account.organizzazione.desc}`)
               ctrl.divisione=ctrl.account.divisione.name;
               if(ctrl.account.divisione.desc) ctrl.divisione=ctrl.divisione.concat(` - ${ctrl.account.divisione.desc}`)
   
            }
        }, 0);
        if(ctrl.listinoAccountData.id&&ctrl.listinoAccountData.idListino&&ctrl.listini.length>0&&ctrl.prezzari.length===0){
         
         ctrl.loadPrezzi();
        }
      }

      //MODAL

      ctrl.closeDialog=function(){
            $mdDialog.cancel();
      }

      ctrl.complete=function(){
         $mdDialog.hide();
       }

       ctrl.test=function(){
         $mdDialog.show({    
            controller: ()=>this, 
            templateUrl: 'angular/entities/struttura-organizzativa/accounts/components/billing-details/billing-detail-confirm-modal.html',
            parent: angular.element(document.body),
            scope:$scope,
            preserveScope:true,
            clickOutsideToClose: false,
            fullscreen: true	
        }).then(function () {
            $scope.editBillingDetail=true;
            
        });
       }
   },
});

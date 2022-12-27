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
nivolaApp.controller('ServizioGestioneAccount', [
    '$rootScope', '$scope', '$state', '$anchorScroll', '$location',
    '$stateParams', 'controllerValidator',
    'notificationManager',
    '$mdDialog',
    "utils", "$filter", 'entitiesRest', "AuthenticationService", "AuthLevel",
    function (
        $rootScope, $scope, $state, $anchorScroll, $location,
        $stateParams, controllerValidator,
        notificationManager,
        $mdDialog,
        utils, $filter, entitiesRest, AuthenticationService, AuthLevel
    ) {
        'use strict';

      
        var InfoRendicontazione = entitiesRest.getEntity('InfoRendicontazione');
      

       
        $scope.acronimi = [];
        $scope.prezzari = [];

        $scope.formModificaAccount = {};

        $scope.organizzazioniDivisioni = [];
        $scope.categorie = [
            { nome: 'Pubblica Amministrazione', value: 'public' },
            { nome: 'Csi', value: 'csi' },
            { nome: 'Privata', value: 'private' }
        ];

        //info rendicontazione Account
        $scope.infoRendicontazioniAccount = [];

        $scope.selected = [];

       $scope.limitOptions = [ 10, 20, 30];

        $scope.filter = {
            options: {
                debounce: 500
            }
        };

        $scope.query = {
            order: "organizzazione_name",
            limit: 10,
            page: 1
        };

        $scope.options = {
            isDataLoaded: false,
            isCapabilitiesLoaded: false,
            isOrganizzazioneDivisioneSoloLettura: true,
            disabilitaModificaAcronimo: false,
            //aggiunti
            rowSelection: false,
            multiSelect: false,
            autoSelect: false,
            decapitate: false,
            largeEditDialog: false,
            boundaryLinks: false,
            limitSelect: true,
            pageSelect: true,
            editInfoRendicontazione: false,
            newInfoRendicontazione: false,
            detailsInfoRendicontazione: false,

        };

        $scope.iconStyle = {
        };
        $scope.account = {};

        $scope.capabilities = [];
        $scope.sharesAssociati = [];

      
        
        $scope.onPrezzarioChange = function () {
            if($scope.account.codicePrezzo==="" ||  $scope.account.codicePrezzo===null ){
                $scope.account.aggiornaCostiGiorno=false ;
                $scope.disableSwith=true; 
            }else{
                $scope.disableSwith=false;
            }

            isSalvaready();
        };

        $scope.onAggiornaCostiGiornoChanged = function () {
            if($scope.account.aggiornaCostiGiorno===false){
                $scope.account.dataInizioConsumi= null ;
            }
            isSalvaready();
        };

       function isSalvaready(){
            $scope.isSalvable=false
            if(  $scope.account.aggiornaCostiGiorno===true ){
                if( $scope.account.dataInizioConsumi && $scope.account.codicePrezzo){
                    $scope.isSalvable= true;
                }
            }else{
                $scope.isSalvable= true;
            }
       }

        $scope.onDateChanged = function () {
            isSalvaready();
        };

        $scope.onChangeFiltroPeriodo= function () {
            if($scope.myDate!=null){
               var filteredList = $scope.infoRendicontazioniAccount.filter(element => {
                   return ( (new Date(element.dataDa).getTime()<= new Date($scope.myDate).getTime())  
                           &&( (new Date(element.dataA).getTime()>= new Date($scope.myDate).getTime()) || (element.dataA==null)  )
                           
                           );
                
               })
       
               $scope.infoRendicontazioniAccount= filteredList; 
            }
       
       }; 

       $scope.aggiornaInfoRendicontazioni= function(){
            $scope.myDate=null;
            getInfoRendicontazioniAccount();

       }; 


        $scope.isInfoTenant = function (info) {
            return info.nomeMetricaDefinizione.includes('tenant');
        };
       






        $scope.checkAcronimo = function () {
            //acronimo 
            if (!$scope.formModificaAccount.$invalid && $scope.account.acronimo !== null && $scope.account.acronimo !== ''
                && $scope.acronimi.length > 0 && $scope.acronimi.findIndex(x => x.toLowerCase() == $scope.account.acronimo.toLowerCase()) !== -1) {
                notificationManager.showErrorPopup('L\'acronimo ' + $scope.account.acronimo + ' è già stato utilizzato');
                return;
            }
        };
       


        function getInfoRendicontazioniAccount() {
            var accountUuid= AuthenticationService.getUtente().abilitazioneSelezionata.accountUuid; 
            var queryString = {
                idAccount: accountUuid
            };
           
            $scope.promise = InfoRendicontazione.query(queryString).$promise;


            return $scope.promise.then(function (data) {
                
                if (data) {
                    $scope.infoRendicontazioniAccount = data;
                }

            }, function (onfail) {
                if (onfail) {
                    if (onfail.data && onfail.data.message) {
                        notificationManager.showErrorPopup('Si è verificato un errore durante il caricamento delle informazioni di rendicontazioni dell\'account: ' + onfail.data.message);
                    } else {
                        notificationManager.showErrorPopup('Si è verificato un errore durante il caricamento delle informazioni di rendicontazioni dell\'account!');
                    }
                } else {
                    notificationManager.showErrorPopup('Si è verificato un errore durante il caricamento delle informazioni di rendicontazioni dell\'account!');
                }
            });
        };


     
        this.onInit = function () {
            
            getInfoRendicontazioniAccount();
            
        };

        this.onExit = function () { };

        controllerValidator.validate(this, $scope);
    }]);

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
nivolaApp.controller('AllegatiAccountController', [
    '$rootScope', '$scope', '$state', '$anchorScroll', '$location','FileUploader',
    '$stateParams', 'controllerValidator', '$timeout',
    'notificationManager', 'loggers',
    '$mdDialog',
    "utils", "$filter", 'entitiesRest', "AuthenticationService", "AuthLevel", '$translate', 
    function (
        $rootScope, $scope, $state, $anchorScroll, $location, FileUploader,
        $stateParams, controllerValidator, $timeout,
        notificationManager, loggers,
        $mdDialog,
        utils, $filter, entitiesRest, AuthenticationService, AuthLevel, $translate
    ) {
        'use strict';
        var UploadFile = entitiesRest.getEntity('UploadFile');
        var TipiDocumentiAllegati = entitiesRest.getEntity('TipiDocumentiAllegati');

        var logger = loggers.get("AllegatiAccountController");
    
        $scope.selected = [];

       $scope.limitOptions = [ 10, 20, 30];

        
        $scope.filter = {
            options: {
                debounce: 500
            }
        };

        $scope.tipo = null;
        $scope.tipi = null;
        $scope.tipiDocumenti = null ; 
      
        $scope.allegato={
            selectedtipo:null
        }

       

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
        };

        $scope.iconStyle = {
        };
        $scope.toSubmit = {};

        $scope.capabilities = [];
        $scope.sharesAssociati = [];

    	function getTipiDocumenti() {
	
            $scope.promise = TipiDocumentiAllegati.get().$promise;
    
            return $scope.promise.then(function (data) {
                $scope.tipiDocumenti = angular.copy(data);
    
            }, function (onfail) {
                notificationManager.showErrorPopup($translate.instant('error.loading_account_anagrafica'));
            }).finally(function() {
                $scope.options.isDettaglioLoaded=true;
            });
        };

      
        $scope.loadtipi = function() {
      
          // Use timeout to simulate a 650ms request.
          return $timeout(function() {
      
            $scope.tipi =   $scope.tipiDocumenti; 
      
          }, 650);
        };
      
       

        var errorOccured = false ; 

        var uploader = $scope.uploader = new FileUploader({
           // compongo il primo pezzo dell'url della chiamata al servizio . l'ultimo pezzo va aggiunto in fondo al primo , poco prima  dell'invio del file (vedere funzione 'onBeforeUploadItem')
            url : entitiesRest.getBaseUrl + 'api/documento/' + $stateParams.idAccount + '/upload/'
        });

        // FILTERS
      
        // a sync filter
        uploader.filters.push({
            name: 'syncFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                console.log('syncFilter');
                return this.queue.length < 10;
            }
        });
      
        // an async filter
        uploader.filters.push({
            name: 'asyncFilter',
            fn: function(item /*{File|FileLikeObject}*/, options, deferred) {
                console.log('asyncFilter');
                setTimeout(deferred.resolve, 1e3);
            }
        });

        // CALLBACKS

        uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploader.onAfterAddingFile = function(fileItem) {
            console.info('onAfterAddingFile', fileItem);
            $scope.file= fileItem.file; 
       
        };
        uploader.onAfterAddingAll = function(addedFileItems) {
            console.info('onAfterAddingAll', addedFileItems);
        };
        uploader.onBeforeUploadItem = function(item) {
            // imposto correttamente l'url della chiamata el servizio
            item.url=  item.url + $scope.allegato.selectedtipo.etichetta
            console.info('onBeforeUploadItem', item);
        };
        uploader.onProgressItem = function(fileItem, progress) {
            console.info('onProgressItem', fileItem, progress);
        };
        uploader.onProgressAll = function(progress) {
            console.info('onProgressAll', progress);
        };
        uploader.onSuccessItem = function(fileItem, response, status, headers) {
            console.info('onSuccessItem', fileItem, response, status, headers);
            notificationManager.showSuccessPopup($translate.instant('accounts.visualizza.allegati.upload.successItem') + ': ' + response.message);
        };
        uploader.onErrorItem = function(fileItem, response, status, headers) {
            console.info('onErrorItem', fileItem, response, status, headers);
            errorOccured= true ; 
            notificationManager.showErrorPopup($translate.instant('accounts.visualizza.allegati.upload.errorItem') + ': ' + response.message)
        };
        uploader.onCancelItem = function(fileItem, response, status, headers) {
            console.info('onCancelItem', fileItem, response, status, headers);
            notificationManager.showSuccessPopup($translate.instant('accounts.visualizza.allegati.upload.cancel'));
        };
        uploader.onCompleteItem = function(fileItem, response, status, headers) {
            console.info('onCompleteItem', fileItem, response, status, headers);
        };

        uploader.onTimeoutItem = function(fileItem) {
            console.info('onTimeoutItem', fileItem);
            notificationManager.showErrorPopup($translate.instant('accounts.visualizza.allegati.upload.timeoutItem'))
        };

        uploader.onCompleteAll = function() {
            console.info('onCompleteAll');
           
        };

        console.info('uploader', uploader);   
      

        this.onInit = function () {
            getTipiDocumenti(); 
        };

        this.onExit = function () { };

        controllerValidator.validate(this, $scope);
    }]);

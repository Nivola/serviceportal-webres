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
nivolaApp.controller('ModificaAssociazioneShareAccountController', [
    '$rootScope', '$scope', '$state', '$anchorScroll', '$location',
    '$stateParams', 'controllerValidator',
    'notificationManager',
    '$timeout',
    "utils", "$filter", 'entitiesRest', "AuthenticationService", "AuthLevel", '$translate',
    function (
        $rootScope, $scope, $state, $anchorScroll, $location,
        $stateParams, controllerValidator,
        notificationManager,
        $timeout,
        utils, $filter, entitiesRest, AuthenticationService, AuthLevel, $translate
    ) {
        'use strict';

        var SharesNetapps = entitiesRest.getEntity('SharesNetapps');
        var NewSharesNetapps = entitiesRest.getEntity('NewSharesNetapps');

        var Account = entitiesRest.getEntity('Account');
        
        $scope.formAssociazioneShareAcc = {};
        $scope.shares = [];
        $scope.nomeAccount = '';
        //nuovo InfoRendicontazione

        $scope.nAssociazioneShare = {
            //nuova
            share: null,//{evs-filesystem-share},
            dataInizio: null,
            dataFine: null,
            tipologia : null,
            dataInizioMax: null,
            dataFineMin: null,
            idAccount:null
        };

        $scope.tipologieShare = [ 'Netapp ' , 'Netapp-replica'];           

        $scope.options = {
            isDataLoaded: false,
        };

        $scope.actions = {
            refresh: function (event) {
                resetForm();
            },
            salva: function (event) {
                let jsonData = {
                        dataFineAssociazione : $scope.nAssociazioneShare.dataFine,
                        dataInizioAssociazione : $scope.nAssociazioneShare.dataInizio,
                        evs : $scope.nAssociazioneShare.share.evs,
                        filesystem : $scope.nAssociazioneShare.share.filesystem,
                        refAccount : $scope.nAssociazioneShare.idAccount,
                        share :  $scope.nAssociazioneShare.share.share,
                        tipologia : $scope.nAssociazioneShare.tipologia
                    }; 

                    console.log(JSON.stringify(jsonData));
                
				NewSharesNetapps.save(jsonData, function (data) {
                    notificationManager.showSuccessPopup($translate.instant('accounts.shares.modifica.success'));
                    resetForm();
                    history.back();
                }, function (err) {
                    if(err && err.data && err.data.messaggio)
					    notificationManager.showErrorPopup($translate.instant('accounts.shares.modifica.error') + '<br>' + err.data.messaggio);
                    else notificationManager.showErrorPopup($translate.instant('accounts.shares.modifica.error'));

                    }).$promise.finally(function () {
					$scope.status.pending = false;
				});



            },
            isSalvaAbilitata: function () {
                return $scope.nAssociazioneShare.share && $scope.nAssociazioneShare.share != null && $scope.nAssociazioneShare.dataInizio && $scope.nAssociazioneShare.tipologia;
            },

        };

        $scope.soloDataMaggioreDataInizio = function (dataFine) {
            if ($scope.nAssociazioneShare.dataInizio) {
                return dataFine > $scope.nAssociazioneShare.dataInizio;
            }
            return true;
        };

        $scope.onChangeDataInizio = function () {

        };

        $scope.onChangeDataFine = function () {

        };

        function resetForm(form) {
            //resetto i form
            $scope.formAssociazioneShareAcc.$setPristine(true);
            $scope.formAssociazioneShareAcc.$setUntouched(true);
            angular.forEach($scope.formAssociazioneShareAcc, function (ctrl, name) {
                if (name.indexOf('$') != 0) {
                    angular.forEach(ctrl.$error, function (value, name) {
                        ctrl.$setValidity(name, null);
                    });
                }
            });

        }
        function  getSharesAssociabiliAccount() {
            var queryString = {accountUuid : $stateParams.idAccount};
            $scope.promise = SharesNetapps.query(queryString).$promise;

            return $scope.promise.then(function (data) {

                if(data){
                    Object.assign($scope.shares,data);
                }

            }, function (onfail) {
                logger.error("ERROR", onfail);
                if (onfail.body) {
                    if (onfail.body.data && onfail.body.data.message) {
                        notificationManager.showErrorPopup($translate.instant('error.loading_shares') + ': ' + onfail.body.data.message);
                    } else {
                        notificationManager.showErrorPopup($translate.instant('error.loading_shares'));
                    }
                } else {
                    notificationManager.showErrorPopup($translate.instant('error.loading_shares'));
                }
            });
        };

    
        this.onInit = function () {
            $scope.accountName =$stateParams.accountName;
            $scope.nAssociazioneShare.idAccount=$stateParams.idAccount;
            $scope.nAssociazioneShare.share = $stateParams.shareNettapp;
           
            $scope.nAssociazioneShare.tipologia = $stateParams.shareNettapp.tipologia; 
            $scope.nAssociazioneShare.dataInizio =new Date(Date.parse($stateParams.shareNettapp.dataInizioAssociazione));
            $scope.nAssociazioneShare.dataFine =  $stateParams.shareNettapp.dataFine !=null?  new Date(Date.parse($stateParams.shareNettapp.dataFine)) : null;
            
             getSharesAssociabiliAccount();
        };

        this.onExit = function () { };

        controllerValidator.validate(this, $scope);
    }]);

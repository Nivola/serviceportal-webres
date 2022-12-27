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

angular.module('app').controller('controllerHome', [
    '$mdMedia', '$mdToast', '$scope',
    'AuthenticationService', 'controllerValidator',
    'DashboardManagerService', 'events', 'loggers',
    'AuthLevel', '$state','entitiesRest',
    function (
        $mdMedia, $mdToast, $scope,
        AuthenticationService, controllerValidator,
        DashboardManagerService, events, loggers,
        AuthLevel, $state, entitiesRest) {
        var logger = loggers.get("controller");

        var ReadTheDocs = entitiesRest.getEntity('ReadTheDocs'); 

        $scope.iconStyle = {
            "color": "#4285f4",
        }

        logger.debug('ST:controllerHome');
        $scope.dashboard = null;
        $scope.displayxs = null;

        $scope.$watch(function () { return $mdMedia('xs'); }, function (val) {
            $scope.displayxs = val;
        });

        $scope.actions = {
            register: function () {
                $state.go('app.formAssistenza', { object: " Richiesta di registrazione" });
            },

            guestSignIn: function () {
                $state.go('app.SignInGuestUser');
            }

            
        }

        $scope.toggleEditMode = function () {
            if ($scope.dashboard.editMode) {
                var somethingToSave = $scope.dashboard.unsavedChanges > 0;

                $scope.dashboard.save();
                $scope.dashboard.setEditMode(false);

                if (somethingToSave) {
                    $mdToast.show($mdToast.simple().textContent('la configurazione della dashboard è stata salvata'));
                }

            } else {
                $scope.dashboard.setEditMode(true);
            }
            logger.debug('ST:controllerHome.toggleEditMode ', $scope.dashboard);
        };

        function loadReadthedocs() {
            $scope.promise = ReadTheDocs.query().$promise;

            return $scope.promise.then(function (data) {
                logger.info("SUCCESS", data);
                window.localStorage['readTheDocs'] = angular.toJson(data);
            }, function (onfail) {
                logger.error("ERROR", onfail);
                if (onfail.body) {
                    if (onfail.body && onfail.body.data && onfail.body.data.message) {
                        notificationManager.showErrorPopup('Si è verificato un errore durante il caricamento readTheDocs: ' + onfail.body.data.message);
                    } else {
                        notificationManager.showErrorPopup('Si è verificato un errore durante il caricamento readTheDocs!');
                    }
                } else {
                    notificationManager.showErrorPopup('Si è verificato un errore durante il caricamento readTheDocs!');
                }
            });
        };

        function loadDashboard() {
            if (!AuthenticationService.getUtente().abilitazioneSelezionata) {
                return;
            }
            var dashboard = DashboardManagerService.loadDashboard(
                AuthenticationService.getUtente().abilitazioneSelezionata.userRole//, 
                
            );
            $scope.dashboard = dashboard;
            $scope.benvenuto = $scope.dashboard.key === AuthLevel.OSPITE;
            $scope.nonAttivo = !(AuthenticationService.getUtente().attivo);
            if ($scope.nonAttivo) {
                $scope.benvenuto = false;
                $scope.dashboard = false;
            }
                
            if (dashboard.source == "reset") {
                $mdToast.show($mdToast.simple().textContent(
                    'configurazione reinizializzata per nuova specifica ' + dashboard.configuration.version
                ));
            }
        }

        $scope.$on(events.USER_CHANGED, function () {
            if ($scope.dashboard) {
                $scope.dashboard.finalize();
            }
            logger.debug('ST:controllerHome on event USER_CHANGED ');
            loadDashboard();
        });

        this.onInit = function () {
            logger.debug('ST:controllerHome onInit ');
            loadReadthedocs(); 
            loadDashboard();
        };

        this.onExit = function () {
            logger.debug('ST:controllerHome.onExit ', $scope.dashboard);
            $scope.dashboard.finalize();
        };

        controllerValidator.validate(this, $scope);
    }]);

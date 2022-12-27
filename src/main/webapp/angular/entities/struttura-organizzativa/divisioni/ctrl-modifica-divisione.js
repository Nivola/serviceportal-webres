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
nivolaApp.controller('ModificaDivisioneController', [
	'$scope', '$anchorScroll', '$location',
    '$stateParams', 'controllerValidator',
    'notificationManager','entitiesRest', '$http', 'conf', '$translate', 
    function (
        $scope, $anchorScroll, $location,
        $stateParams, controllerValidator,
        notificationManager, entitiesRest, $http, conf, $translate
    ) {
        'use strict';


        var Divisione = entitiesRest.getEntity('Divisione');
        var Organizzazione = entitiesRest.getEntity('Organizzazione');
        var RemedyEnti = entitiesRest.getEntity('RemedyEnti');

        $scope.formModificaDivisione = {};

		$scope.organizzazioni = [];
        $scope.divisione = {};
        $scope.enteSelezionato = null;
        $scope.enteRemedy = '';
        $scope.categorieDiv = [
            { nome: $translate.instant('organizzazioni.categoria.public'), value:'public' },
			{ nome: $translate.instant('organizzazioni.categoria.csi'), value:'csi' },
			{ nome: $translate.instant('organizzazioni.categoria.privata'), value:'private' }
        ];

        $scope.options = {
            isDataLoaded: false,
            showSteps: false
        };

        $scope.iconStyle = {
            // "color": "#4285f4"
        };


        $scope.actions = {
            invia: function (event) {
				event.stopPropagation();
                try {
                    if ($scope.formModificaDivisione.$valid) {
                        $scope.divisioneAggiorna = angular.copy($scope.divisione);
                        Divisione.update($scope.divisioneAggiorna, function (data) {
                            if (!data && !data.data && data.status != 200) {
                                $scope.options.isDataLoaded = true;
                                notificationManager.showErrorPopup($translate.instant('organizzazioni.modifica.errore'));
                                return;
                            }

                            notificationManager.showSuccessPopup($translate.instant('organizzazioni.modifica.success'));
							
                            $scope.options.isDataLoaded=true;
                            window.history.back();
                        }, function (onfail) {
							notificationManager.showErrorPopup($translate.instant('organizzazioni.modifica.error_salva'));
                            $scope.options.isDataLoaded=true;
                        });

                        return;
                    }
                    //vuol dire il mio form non e' valido probabilmente mancano dei dati faccio scroll to
                    $location.hash($scope.formModificaDivisione.$error.required[0]);
                    $anchorScroll($scope.formModificaDivisione.$error.required[0]);
                } finally {
                    $scope.options.isDataLoaded=true;
                }
            }
		};


        $scope.onOrganizzazioneChange = function () {
            if ($scope.divisione.organizzazione && $scope.divisione.organizzazione.org_type) {
                $scope.divisione.categoriaDiv = $scope.categorieDiv
                    .filter(function (el) {
                        return el.value === $scope.divisione.organizzazione.org_type.toLowerCase();
                    })[0];
                $scope.options.showSteps = true;
            }
        };

        $scope.cercaEnti = function (testo) {
            if (testo.length < 3) {
                return [];
            }
            return $http.get(conf.location.uaaApi + "/api/remedy/enti?ricerca="+testo).then(function(response) {
                return response.data;
              }, function () {
                return [];
              });
        };


        function getOrganizzazioni() {
            var queryString = {};
            $scope.options.isDataLoaded = false;
            $scope.promise = Organizzazione.query(queryString).$promise;

            $scope.promise.then(function (data) {
                data.forEach(function (organizzazione) {

                    if (($stateParams.idOrganizzazione && $stateParams.idOrganizzazione !== '' && organizzazione.uuid === $stateParams.idOrganizzazione && organizzazione && $scope.organizzazioni.findIndex(x => x.uuid == organizzazione.uuid) === -1)
                        ||
                        ((!$stateParams.idOrganizzazione || $stateParams.idOrganizzazione === '') && organizzazione && $scope.organizzazioni.findIndex(x => x.uuid == organizzazione.uuid) === -1)
                    ) {
                        $scope.organizzazioni.push(organizzazione);
                    }
				});
				
                if ($scope.organizzazioni.length > 0 && $scope.divisione && $scope.divisione.organizzazione) {
					$scope.divisione.organizzazione = $scope.organizzazioni
																	.filter(function (el) {
																		return el.uuid === $scope.divisione.organizzazione.uuid;
																	})[0];
                    $scope.divisione.categoriaDiv = $scope.categorieDiv
																   .filter(function (el) {
																		return el.value === $scope.divisione.organizzazione.org_type.toLowerCase();
																	})[0];
                    $scope.options.showSteps = true;
				}

            }, function (onfail) {
                if (onfail.body) {
                    if (onfail.body.data && onfail.body.data.message) {
                        notificationManager.showErrorPopup($translate.instant('error.loading_divisioni') + ': ' + onfail.body.data.message);
                    } else {
                        notificationManager.showErrorPopup($translate.instant('error.loading_divisioni'));
                    }
                } else {
                    notificationManager.showErrorPopup($translate.instant('error.loading_divisioni'));
                }
            }).finally(function () {
                $scope.options.isDataLoaded = true;
            });
        };


		
        function getDivisione() {
			$scope.idDivisione = $stateParams.idDivisione;
			$scope.options.isDataLoaded=false;
			if(!$scope.idDivisione){
				return;
			}
			$scope.promise = Divisione.get({'id': $scope.idDivisione}).$promise;

			$scope.promise.then(function (data) {
                $scope.divisione = angular.copy(data);
                if ($scope.divisione.elencoAttributi != null && $scope.divisione.elencoAttributi.length >0) {
                    $scope.enteRemedy = $scope.divisione.elencoAttributi[0].valore;
                }
                
				$scope.divisione.categoria= $scope.categorieDiv
													.filter(function (el) {
														return el.value === data.organizzazione.org_type.toLowerCase();
												})[0];
			}, function (onfail) {
                notificationManager.showErrorPopup($translate.instant('divisioni.modifica.error_anagrafica'));
			}).finally(function() {
				$scope.options.isDataLoaded=true;
				getOrganizzazioni();

			});
		};

        this.onInit = function () {
			getDivisione();
        };

        this.onExit = function () { };

        controllerValidator.validate(this, $scope);
    }]);

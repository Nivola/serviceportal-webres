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
nivolaApp.controller('VisualizzaDivisioneController', [
	'$mdDialog', '$scope', '$state',"$stateParams", "$filter","$rootScope",
		'entitiesRest', 'controllerValidator',  'notificationManager', 'AuthenticationService','DashboardManagerService','AuthLevel',
		'conf', '$translate',
	function ($mdDialog, $scope, $state,$stateParams, $filter,$rootScope, 
		entitiesRest, controllerValidator, notificationManager, AuthenticationService,DashboardManagerService,AuthLevel,
		conf, $translate ) {
	'use strict';
	
	var Divisione = entitiesRest.getEntity('Divisione');
	var AndamentoCosti = entitiesRest.getEntity('AndamentoCostiDivisione');
	var CostiRendicontati = entitiesRest.getEntity('CostiDivisioneRendicontati');
	var RendicontoReport = entitiesRest.getEntity('RendicontoReport');
	var ConsumiNonRendicontati = entitiesRest.getEntity('ConsumiNonRendicontatiDivisione');
	var UtentiDivisione = entitiesRest.getEntity('UtentiDivisione');

	
	$scope.utenti=[];
	$scope.divisione={};

	$scope.consumiNonRendicontati = {};
	$scope.rendicontazioni = [];
	// colori delle barre - diverso per ogni servizio
	$scope.colors = [];
	// etichette dell barre - parte orizzontale del grafico
	$scope.labelsMesi = [];
	// array di array - 1 array mese che contiene un array per servizio
	$scope.data = [];
	$scope.intestazioneGrafico = '';
	$scope.valuta = { nome : "Euro", code : "€"};

	$scope.accounts=[];
	$scope.valuta = { nome : "Euro", code : "€"};

	$scope.options={
		isErrorGeneric:false,
		isErrorDettaglio:false,
		isErrorWidget:false,
		isErrorUtenti:false,
		isErrorConsumi:false,
		isDettaglioLoaded:false,
		isUtentiLoaded:false,
		isShowGrafico:false,
		rowSelection: false,
		multiSelect: false,
		autoSelect: true,
		decapitate: false,
		boundaryLinks: false,
		limitSelect: true,
		pageSelect: true
	};
	$scope.limitOptions = [10, 20, 30];
	$scope.filter = {
		options: {
			debounce: 500
		}
	};
	$scope.query = {
		order: "ruolo",
		limit: 10,
		page: 1
	};
	var widgetConfig = {
        computeServiceDataProviderService: {
            divisioneUuid: $stateParams.idDivisione,
            refreshAutomatico: false
        },
        dbaasDataProviderService: {
            divisioneUuid: $stateParams.idDivisione,
            refreshAutomatico: false
        },
        staasDataProviderService: {
            divisioneUuid: $stateParams.idDivisione,
            refreshAutomatico: false
        }
    };
	$scope.actions = {
		auth: {
			change: $state.get("app.divisione.change").requiredUC
		},
		change: function () {
			$state.go("app.divisione.change", {
				idDivisione:$scope.idDivisione
			});
		},
		visualizzaAccount:function(){
			$state.go("app.account", {
				idDivisione:$scope.idDivisione
			});
		},
		refresh: function(){
			getDivisione();
			loadWidgetVisualizzaDivisione();
			getUtentiDivisione();
			getCostiConsumi();	
		},
		dettaglioUtente:function(utente){
			$state.go("app.visualizzaUtente", {
				idUtente:utente.id
			});
		},
		registraUtente:function(){
			$state.go("app.registraUtente");
		},
		navigateToOrganizzazione:function(){
			$state.go("app.visualizzaOrganizzazione", {
				idOrganizzazione:$scope.divisione.organizzazione.uuid
			});
		},
		aggiornaGrafico: function () {
			$scope.labelsMesi = [];
			$scope.data = [];
			$scope.chartLoading = true;
			var queryString = {};
			if ($scope.idDivisione) {
				queryString.uuid = $scope.idDivisione;
			}
			$scope.promise = AndamentoCosti.query(queryString).$promise;
			$scope.promise.then(function (data) {
				impostaGraficoPerMese(data);
				$scope.chartLoading = false;
			}, function (onfail) {
				$scope.chartLoading = false;
				notificationManager.showErrorPopup($translate.instant('divisioni.visualizza.error_costi'));
			}).finally(function(){
			});
		},
	};



	$scope.componiNomeFile = function (date) {
		return "rendicontazione_" + formatDate(date) + ".pdf";
	};

	$scope.downloadFile = function (event, rendiconto) {
		event.preventDefault();
		let filename = this.componiNomeFile(rendiconto.dataRendicontoDa);

		var queryString = {};
		if ($scope.idDivisione) {
			queryString.divisione = $scope.idDivisione;
			queryString.report = rendiconto.id;
		}
		$scope.promise = RendicontoReport.query(queryString).$promise;
		$scope.promise.then(function (data) {
		   //lo trasformo in arrayBuffer
			var binary_string =  window.atob(data.report);
			var len = binary_string.length;
			var bytes = new Uint8Array( len );
			for (var i = 0; i < len; i++)        {
				bytes[i] = binary_string.charCodeAt(i);
			}

			if (window.navigator.msSaveBlob) { // IE 10+
				let currentBlob = new Blob([bytes.buffer], {type: 'application/pdf'});
				window.navigator.msSaveOrOpenBlob(currentBlob, filename);
			} else {
				try {
					var link = document.createElement('a'); //create link download file
					let currentBlob = new Blob([bytes.buffer], {type: 'application/pdf'});
					link.href = window.URL.createObjectURL(currentBlob); // set url for link download
					link.setAttribute('download', filename); //set attribute for link created
					document.body.appendChild(link);
					link.click();
					document.body.removeChild(link);
				} catch (ex) {
					notificationManager.showErrorPopup($translate.instant('divisioni.visualizza.error_download'));
				}
			}
		}, function (onfail) {
			notificationManager.showErrorPopup($translate.instant('divisioni.visualizza.error_non_rendicontati'));
		});
	};

	$scope.resetFilter = function () {
		$scope.filter.search = '';
		$scope.query.filter = '';

		if ($scope.filter.form.$dirty) {
			$scope.filter.form.$setPristine();
		}
	};

	function getUtentiDivisione() {
		$scope.options.isUtentiLoaded=false;
		if(!$scope.idDivisione){
			$scope.options.isErrorGeneric =  true;
			return;
		}
		$scope.promise = UtentiDivisione.query({ 'uuid': $scope.idDivisione }).$promise;

		return $scope.promise.then(function (data) {
			$scope.utenti = angular.copy(data);
		}, function (onfail) {
			notificationManager.showErrorPopup($translate.instant('divisioni.visualizza.error_utenti'));
		}).finally(function() {
			$scope.options.isUtentiLoaded=true;
		});
	};

	function formatDate(d) {
		let month = String(d.getMonth() + 1);
		let day = String(d.getDate());
		const year = String(d.getFullYear());
	  
		if (month.length < 2) month = '0' + month;
		if (day.length < 2) day = '0' + day;
	  
		return `${day}-${month}-${year}`;
	  }

	function loadWidgetVisualizzaDivisione() {
		DashboardManagerService.impostaWidgetConf(widgetConfig);
		$scope.dashboard= DashboardManagerService.loadDashboard(AuthLevel.DettaglioDivisioneViewer);
	}

	function getDivisione() {
		$scope.idDivisione = $stateParams.idDivisione;
		$scope.options.isDettaglioLoaded=false;
		if(!$scope.idDivisione){
			return;
		}
		$scope.promise = Divisione.get({'id': $scope.idDivisione}).$promise;

		$scope.promise.then(function (data) {
			$scope.divisione = angular.copy(data);
			$scope.divisione.creation = formatDate(new Date($scope.divisione.creation));
		}, function (onfail) {
			notificationManager.showErrorPopup($translate.instant('divisioni.visualizza.error_anagrafica'));
		}).finally(function() {
			$scope.options.isDettaglioLoaded=true;
		});
		};

		function calcolaScala (dati) {
			var max = 0;
			for (var i = 0; i<dati.length; i++) {
				var strutt = dati[i];
				var costoTotale = 0;
				if (strutt && strutt.servizi)
				for (var j = 0; j<strutt.servizi.length; j++)
				{
					costoTotale = costoTotale + strutt.servizi[j].importo;
				}
				if (costoTotale > max) {
					max = costoTotale;
				}
			}
			var scala = max / 6;
			scala = Math.round(scala/100)*100;
			return scala;
		}

		function impostaGraficoPerMese(dati) {
			var scalaGrafico = calcolaScala(dati);
			$scope.chartOptions = {
				title: {
					display: false,
					text: 'titolo'
				},
				legend: {
					position: "bottom",
					display: true,
					labels: {
						filter: function (item, chart) {
							return !item.text.includes('totale');
						}
					},
					onClick: (e) => e.stopPropagation()
				},
				tooltips: {
					mode: 'label',
					bodySpacing: 10,
					cornerRadius: 0,
					titleMarginBottom: 15,
					callbacks: {
						label: function (tooltipItem, data) {
							var corporation = data.datasets[tooltipItem.datasetIndex].label;
							var valor = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
							// Loop through all datasets to get the actual total of the index
							if(valor ===""){
								return;
							}
							var total = 0;
							for (var i = 0; i < data.datasets.length; i++)
							if(data.datasets[i].data[tooltipItem.index] !=undefined && data.datasets[i].data[tooltipItem.index] !="")
							   total += data.datasets[i].data[tooltipItem.index];
							// If it is not the last dataset, you display it as you usually do
							if (tooltipItem.datasetIndex != data.datasets.length - 1) {
								if(valor == null || valor == undefined || valor == "" ||  valor.lenght == 0){
								  return  corporation + " : €" +parseFloat(0).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') ;
								}else
									 return corporation + " : €" + valor.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
							} else { // .. else, you display the dataset and the total, using an array
								var corporationTtotale = corporation;
								if(valor == null || valor == undefined || valor == "" ||  valor.lenght == 0){
									return  corporation + " : €", "Totale : €" + parseFloat(total).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') ;
								  }else
									  return [corporationTtotale + " : €" + valor.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'), "Totale : €" + parseFloat(total).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')];
							}
						}
					}
				},
				responsive: true,
				scales: {
					xAxes: [{
						stacked: true,
						ticks: {}
					}],
					yAxes: [{
						stacked: true,
						ticks: {
							beginAtZero: true,
							stepSize: scalaGrafico,
							userCallback: function (value, index, values) {
								// Convert the number to a string and splite the string every 3 charaters from the end
								value = value.toString();
								value = value.split(/(?=(?:...)*$)/);
								// Convert the array to a string and format the output
								value = value.join('.');
								return value + ' €';
							}
						},

					}]
				}
			};

			$scope.datasetOverride = [];
			var listaMesi = [];//contiene distinct delle date

			//primo ciclo, gestione dei servizi
			for (var i = 0; i < dati.length; i++) {
				var servizio = dati[i];
				$scope.datasetOverride.push( {
					label: servizio.nome,
					borderWidth: 1,
					type: 'bar'
				});

				$scope.colors.push(servizio.colore);

				servizio.costi.forEach(costo => {
					if (!(listaMesi.includes(costo.data))) {
						listaMesi.push(costo.data);
					}
				});
			}

			listaMesi.sort();

			for (var i = 0; i < dati.length; i++) {
				let valori = new Array(listaMesi.length).fill(0);
				var servizio = dati[i];

				servizio.costi.forEach(c => {
					valori[listaMesi.indexOf(c.data)] = c.valore;
				});

				$scope.data.push(valori);
				$scope.options.isShowGrafico = true;
			}

			let mesi = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
			$scope.labelsMesi = listaMesi.map(e => {
				let dataj = new Date(e);
				return mesi[dataj.getMonth()];
			});
			
			$scope.intestazioneGrafico = $scope.labelsMesi[0] + ' ' + new Date(listaMesi[0]).getFullYear() + ' - ' + $scope.labelsMesi[$scope.labelsMesi.length - 1] + ' ' + new Date(listaMesi[listaMesi.length -1 ]).getFullYear();
		}

		function ordinaPerData(a, b) {
			return a.data - b.data;
		}
		//ordinamento DESC
		function ordinaRendicontiPerData(a, b) {
			return b.dataRendicontoDa - a.dataRendicontoDa;
		}


		/** functions */
		function getCostiConsumi() {
			var queryString = {};
			//1-Consumi Non Rendicontati
			var queryString = {};
			if ($scope.idDivisione) {
				queryString.uuidStruttura = $scope.idDivisione;
			}
			$scope.promise = ConsumiNonRendicontati.query(queryString).$promise;
			$scope.promise.then(function (data) {
				$scope.consumiNonRendicontati = data;
				$scope.consumiNonRendicontati.elencoServizi = $scope.consumiNonRendicontati.elencoServizi
					.map(e => {
						e.costo = parseFloat(e.costo).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
						return e;
					})
					.filter(e => {
						return parseFloat(e.costo) > 0;
					});
				$scope.consumiNonRendicontati.totaleConsumiNonRendicontati = parseFloat($scope.consumiNonRendicontati.totaleConsumiNonRendicontati).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
				$scope.valuta = data.valuta;
			}, function (onfail) {
				notificationManager.showErrorPopup($translate.instant('divisioni.visualizza.error_rendicontati'));
			}).finally(function () {
				//3-Consumi Rendicontati
				// le carico qua perche serve che sia caricata la prima tabella
				var queryString = {};
				if ($scope.idDivisione) {
					queryString.idDivisione = $scope.idDivisione;
				}
				$scope.promise = CostiRendicontati.get(queryString).$promise;
				$scope.promise.then(function (data) {
					if (data && data.rendiconti) {
						$scope.rendicontazioni = data.rendiconti.map(e => {
							e.dataRendicontoDa = new Date(e.dataRendicontoDa);
							e.dataRendicontoA = new Date(e.dataRendicontoA);
							e.importo = data.valuta.code + parseFloat(e.importo).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
							e.stato = $translate.instant('divisioni.visualizza.consolidato');
							return e;
						}).sort(ordinaRendicontiPerData);
						if ($scope.consumiNonRendicontati && $scope.consumiNonRendicontati.elencoServizi.length > 0)
							$scope.rendicontazioni.splice(0, 0, {
								dataRendicontoDa: $scope.consumiNonRendicontati.periodoDA,
								dataRendicontoA: $scope.consumiNonRendicontati.periodoA,
								importo: data.valuta.code + $scope.consumiNonRendicontati.totaleConsumiNonRendicontati,
								stato: $translate.instant('divisioni.visualizza.in_corso'),
								descrizione: $translate.instant('divisioni.visualizza.mese_in_corso'),
								meseInCorso: true,
								periodo: $scope.consumiNonRendicontati.periodo
							}
							);
						$scope.rendicontazioni.join();
						$scope.valuta = data.valuta;
					}
				}, function (onfail) {
					notificationManager.showErrorPopup($translate.instant('divisioni.visualizza.error_non_rendicontati'));
				});
			}
			);


			// 2-grafico
			var queryString = {};
			if ($scope.idDivisione) {
				queryString.uuidStruttura = $scope.idDivisione;
			}
			$scope.promise = AndamentoCosti.query(queryString).$promise;
			$scope.promise.then(function (data) {
				impostaGraficoPerMese(data);
			}, function (onfail) {
				notificationManager.showErrorPopup($translate.instant('divisioni.visualizza.error_costi'));
			}).finally(function(){
			});

		};

	this.onInit = function () {
		getDivisione();
		loadWidgetVisualizzaDivisione();
		getUtentiDivisione();
		getCostiConsumi();
	};

	this.onExit = function () { };
	controllerValidator.validate(this, $scope);


}]);

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
nivolaApp.controller('ListCostiConsumiController',
    ["$scope", "$state", "$stateParams", "$filter", "$mdDialog", "$http","$rootScope",
        "entitiesRest", "controllerValidator", "notificationManager", 'loggers',
        'AuthenticationService', 'AuthLevel', "conf", '$translate',
        function ($scope, $state, $stateParams, $filter, $mdDialog, $http,$rootScope,
            entitiesRest, controllerValidator, notificationManager, loggers,
            AuthenticationService, AuthLevel, conf, $translate) {
            "use strict";

            var logger = loggers.get("ListCostiConsumiController");
            var AndamentoCosti = entitiesRest.getEntity('AndamentoCostiAccount');
            var CostiRendicontati = entitiesRest.getEntity('CostiAccountRendicontati');
            var RendicontoReport = entitiesRest.getEntity('RendicontoReport');
            var ConsumiNonRendicontati = entitiesRest.getEntity('ConsumiNonRendicontatiAccount');
            var RendicontoCsv = entitiesRest.getEntity('RendicontoCsv');
            var RendicontoCsvSintetico = entitiesRest.getEntity('RendicontoCsvSintetico');
            var DettaglioAccount = entitiesRest.getEntity('DettaglioAccount');

            
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
            // Proprietà data-table
            $scope.options = {
                rowSelection: false,
                multiSelect: false,
                autoSelect: true,
                decapitate: false,
                largeEditDialog: false,
                boundaryLinks: false,
                limitSelect: true,
                pageSelect: true,
                isShowGrafico:false
            };

           $scope.limitOptions = [ 10, 20, 30];

            $scope.filter = {
                options: {
                    debounce: 500
                }
            };

            $scope.query = {
                // order:'nome',
                limit: 10,
                page: 1
            };

            $scope.nomeStruttura = '';

            $scope.init = function (accountUuid) {
                let abilitazione = AuthenticationService.getUtente().abilitazioneSelezionata;
                $scope.accountUuid =  accountUuid ? accountUuid: abilitazione.accountUuid;
                if (!$scope.accountUuid) //caso passaggio da divisione.
                    $scope.accountUuid = $stateParams.idAccount;
                var promise = DettaglioAccount.get({ 'uuid':  $scope.accountUuid }).$promise;

                    promise.then(function (data) {
                        $scope.lineAt = data.budgetMax;
                        getCostiConsumi();
                    }, function (onfail) {
                        notificationManager.showErrorPopup($translate.instant('error.loading_account_anagrafica'));
                    });
                
                
            };
            
            
            this.onInit = function () {
                
            };

            $scope.componiNomeFile = function (date) {
                return "rendicontazione_" + formatDate(date) + ".pdf";
            };

            $scope.downloadFile = function (event, rendiconto) {
                event.preventDefault();
                let filename = this.componiNomeFile(rendiconto.dataRendicontoDa);

                var queryString = {};
                if ($scope.accountUuid) {
                    queryString.account = $scope.accountUuid;
                    queryString.report = rendiconto.id;
                }
                $scope.promise = RendicontoReport.query(queryString).$promise;
                $scope.promise.then(function (data) {
                   //lo trasformo in arrayBuffer
                    var binary_string =  window.atob(data.report);
                    filename = data.nomeFile;
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
                            notificationManager.showErrorPopup($translate.instant("error.download_file"));
                        }
                    }
                }, function (onfail) {
                    logger.error("ERROR", onfail);
                    notificationManager.showErrorPopup($translate.instant("error.loading_consumi_non_rendicontati"));
                });


            };
            $scope.downloadFileDett = function (event, rendiconto) {
                event.preventDefault();
                let filename = this.componiNomeFile(rendiconto.dataRendicontoDa);

                var queryString = {};
                if ($scope.accountUuid) {
                    queryString.account = $scope.accountUuid;
                    queryString.report = rendiconto.idDettaglio;
                }
                $scope.promise = RendicontoReport.query(queryString).$promise;
                $scope.promise.then(function (data) {
                   //lo trasformo in arrayBuffer
                    var binary_string =  window.atob(data.report);
                    filename = data.nomeFile;
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
                            notificationManager.showErrorPopup($translate.instant("error.download_file"));
                        }
                    }
                }, function (onfail) {
                    logger.error("ERROR", onfail);
                    notificationManager.showErrorPopup($translate.instant("error.loading_consumi_non_rendicontati"));
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


            
            $scope.downloadFileCSV = function (event, rendiconto) {
                event.preventDefault();
                let filename = this.componiNomeFile(rendiconto.dataRendicontoDa);

                var queryString = {};
                if ($scope.accountUuid) {
                    queryString.uuidStruttura = $scope.accountUuid;
                    queryString.anno = rendiconto.dataRendicontoDa.getFullYear();
                    queryString.mese = rendiconto.dataRendicontoDa.getMonth() +1;
                    queryString.tipoStruttura = 'ACCOUNT';
                    if (AuthenticationService.getUtente().abilitazioneSelezionata.accountName){
                        queryString.nome = AuthenticationService.getUtente().abilitazioneSelezionata.accountName;
                    } else {
                        queryString.nome = $scope.account.name;
                    }

                }
                $scope.promise = RendicontoCsv.query(queryString).$promise;
                $scope.promise.then(function (data) {
                   //lo trasformo in arrayBuffer
                    var binary_string =  window.atob(data.report);
                    filename = data.nomeFile;
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
                            notificationManager.showErrorPopup($translate.instant("error.download_file"));
                        }
                    }
                }, function (onfail) {
                    logger.error("ERROR", onfail);
                    notificationManager.showErrorPopup($translate.instant("error.loading_consumi_non_rendicontati"));
                });


            };

            $scope.downloadFileCSVSintetico = function (event, rendiconto) {
                event.preventDefault();
                let filename = this.componiNomeFile(rendiconto.dataRendicontoDa);

                var queryString = {};
                if ($scope.accountUuid) {
                    queryString.uuidAccount = $scope.accountUuid;
                    queryString.anno = rendiconto.dataRendicontoDa.getFullYear();
                    queryString.mese = rendiconto.dataRendicontoDa.getMonth() +1;
                    queryString.tipoStruttura = 'ACCOUNT';
                    if (AuthenticationService.getUtente().abilitazioneSelezionata.accountName){
                        queryString.nome = AuthenticationService.getUtente().abilitazioneSelezionata.accountName;
                    } else {
                        queryString.nome = $scope.account.name;
                    }

                }
                $scope.promise = RendicontoCsvSintetico.query(queryString).$promise;
                $scope.promise.then(function (data) {
                   //lo trasformo in arrayBuffer
                    var binary_string =  window.atob(data.report);
                    filename = data.nomeFile;
                    var len = binary_string.length;
                    var bytes = new Uint8Array( len );
                    for (var i = 0; i < len; i++)        {
                        bytes[i] = binary_string.charCodeAt(i);
                    }

                    if (window.navigator.msSaveBlob) { // IE 10+
                        let currentBlob = new Blob([bytes.buffer], {type: 'text/csv'});
                        window.navigator.msSaveOrOpenBlob(currentBlob, filename);
                    } else {
                        try {
                            var link = document.createElement('a'); //create link download file
                            let currentBlob = new Blob([bytes.buffer], {type: 'text/csv'});
                            link.href = window.URL.createObjectURL(currentBlob); // set url for link download
                            link.setAttribute('download', filename); //set attribute for link created
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                        } catch (ex) {
                            notificationManager.showErrorPopup($translate.instant("error.errore_download"));
                        }
                    }
                }, function (onfail) {
                    logger.error("ERROR", onfail);
                    notificationManager.showErrorPopup($translate.instant("error.loading_consumi_non_rendicontati"));
                });


            };

            $scope.aggiornaGrafico = function () {
                $scope.labelsMesi = [];
                $scope.data = [];
                $scope.chartLoading = true;
                var queryString = {};
                if ($scope.accountUuid) {
                    queryString.idAccount = $scope.accountUuid;
                }
                $scope.promise = AndamentoCosti.query(queryString).$promise;
                $scope.promise.then(function (data) {
                    impostaGrafico(data);
                    $scope.chartLoading = false;
                }, function (onfail) {
                    logger.error("ERROR", onfail);
                    $scope.chartLoading = false;
                    notificationManager.showErrorPopup($translate.instant("error.loading_andamento_costi"));
                });
            }
            /** functions */
            function getCostiConsumi() {
                //1-Consumi Non Rendicontati
                var queryString = {};
                if ($scope.accountUuid) {
                    queryString.idAccount = $scope.accountUuid;
                }
                $scope.promise = ConsumiNonRendicontati.query(queryString).$promise;
                $scope.promise.then(function (data) { 
                    $scope.consumiNonRendicontati = data;
                    $scope.consumiNonRendicontati.elencoServizi = $scope.consumiNonRendicontati.elencoServizi
                    .map(e=>{
                        e.costo = parseFloat(e.costo).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
                        return e;
                    })
                    .filter(e => {
                            return parseFloat( e.costo) >0;
                    });
                    $scope.consumiNonRendicontati.totaleConsumiNonRendicontati = $rootScope.presentaImportoLocalizzato($scope.consumiNonRendicontati.totaleConsumiNonRendicontati, $translate.preferredLanguage()); 
                    $scope.valuta = data.valuta;
                    $scope.nomeStruttura = data.nomeStruttura;

                }, function (onfail) {
                    logger.error("ERROR", onfail);
                    notificationManager.showErrorPopup($translate.instant("error.loading_consumi_rendicontati"));
                }).finally(function() {
                     //3-Consumi Rendicontati
                     //le carico qua perche serve che sia caricata la prima tabella
                    var queryString = {};
                    if ($scope.accountUuid) {
                        queryString.account = $scope.accountUuid;
                    }
                    $scope.promise = CostiRendicontati.query(queryString).$promise;
                    $scope.promise.then(function (data) {
                        if(data && data.rendiconti){
                            $scope.rendicontazioni = data.rendiconti.map(e => {
                                e.dataRendicontoDa = new Date(e.dataRendicontoDa );
                                e.dataRendicontoA = new Date(e.dataRendicontoA );
                                e.importo = data.valuta.code + parseFloat(e.importo ).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');

                                var now = new Date()
                                if (
                                (e.dataRendicontoA.getFullYear() == now.getFullYear()) &&
                                (e.dataRendicontoA.getMonth() == now.getMonth()) 
                                ) {
                                    e.stato=$translate.instant('costi_consumi.rendicontazioni.in_corso');
                                    e.meseInCorso=true;

                                }else{
                                    e.stato=$translate.instant('costi_consumi.rendicontazioni.consolidato');
                                    e.meseInCorso=false;
                                }
                                //e.stato = new Date() > e.dataRendicontoDa && new Date()  < e.dataRendicontoA ? 'In corso' : 'Consolidato';
                                //e.meseInCorso = new Date() > e.dataRendicontoDa && new Date()  < e.dataRendicontoA;
                                return e;
                            }).sort(ordinaRendicontiPerData);
                            /*if($scope.consumiNonRendicontati && $scope.consumiNonRendicontati.elencoServizi.length >0)
                                $scope.rendicontazioni.splice(0, 0, {
                                                                    dataRendicontoDa :$scope.consumiNonRendicontati.periodoDA,
                                                                    dataRendicontoA :$scope.consumiNonRendicontati.periodoA,
                                                                    importo:data.valuta.code + $scope.consumiNonRendicontati.totaleConsumiNonRendicontati,
                                                                    stato:'In corso',
                                                                    descrizione:'mese in corso',
                                                                    meseInCorso:true,
                                                                    periodo:$scope.consumiNonRendicontati.periodo
                                                                    }
                                                            );*/
                            $scope.rendicontazioni.join();
                        $scope.valuta = data.valuta;
                        }
                    }, function (onfail) {
                        logger.error("ERROR", onfail);
                        notificationManager.showErrorPopup($translate.instant("error.loading_consumi_non_rendicontati"));
                    });
                });


                //2-grafico
                var queryString = {};
                if ($scope.accountUuid) {
                    queryString.idAccount = $scope.accountUuid;
                }
                $scope.promise = AndamentoCosti.query(queryString).$promise;
                $scope.promise.then(function (data) {
                    impostaGrafico(data);
                }, function (onfail) {
                    logger.error("ERROR", onfail);
                    notificationManager.showErrorPopup($translate.instant("error.loading_andamento_costi"));
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

            function impostaGrafico(dati) {
                var scalaGrafico = calcolaScala(dati);
                $scope.chartOptions = {
                    onClick: function(e) {
                        console.log('Cliccato');
                        var element = this.getElementAtEvent(e);
                        if (element.length) {
                           console.log(element[0])
                        }
                     },
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
                                    // if(tooltipItem.datasetIndex == data.datasets.length-1 ){
                                    //     let datasetTotale =data.datasets[tooltipItem.datasetIndex];
                                    //     datasetTotale.backgroundColor="red";
                                    //     datasetTotale.borderColor="red";
                                    //     corporationTtotale = datasetTotale.label;
                                    // }
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

                // let mesi = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
                var objDate = new Date('01/01/2021');
                let mesi = [];
                for (i = 0; i < 12; i++) {
                    mesi.push(objDate.toLocaleString($translate.use(), {month:"long"}));
                    objDate.setMonth(objDate.getMonth() + 1);
                }

                $scope.labelsMesi = listaMesi.map(e => {
                    let dataj = new Date(e);
                    return mesi[dataj.getMonth()];
                });
                
                $scope.intestazioneGrafico = $scope.labelsMesi[0] + ' ' + new Date(listaMesi[0]).getFullYear() + ' - ' + $scope.labelsMesi[$scope.labelsMesi.length - 1] + ' ' + new Date(listaMesi[listaMesi.length -1 ]).getFullYear();
                /*console.log('data');
                console.log($scope.data);
                console.log('labelsMesi');
                console.log($scope.labelsMesi);
                console.log('colors');
                console.log($scope.colors);
                console.log('datasetOverride');
                console.log($scope.datasetOverride);
                console.log('chartOptions');
                console.log($scope.chartOptions);*/
                

                var ctx = document.getElementById("chartconsumiCosti");

                Chart.pluginService.register({
                    afterDraw: function(chart) {
                        var lineAt = $scope.lineAt;

                        var ctxPlugin = chart.chart.ctx;
      
                        var xAxe = chart.scales[chart.config.options.scales.xAxes[0].id];
                        var yAxe = chart.scales[chart.config.options.scales.yAxes[0].id];

                        if (yAxe.min != 0) return;

                        ctxPlugin.strokeStyle = "red";
                        ctxPlugin.beginPath();
                        lineAt = (lineAt - yAxe.min) * (100 / yAxe.max);
                        lineAt = (100 - lineAt) / 100 * (yAxe.height) + yAxe.top;
                        lineAt = lineAt +3; //piccolo aggiustamento in quanto il cacolo sopra genera uno scarto
                        ctxPlugin.moveTo(xAxe.left, lineAt);
                        ctxPlugin.lineTo(xAxe.right, lineAt);
                        ctxPlugin.stroke();
                        ctxPlugin.strokeText("Budget", xAxe.right - 40, lineAt - 15);
                        }
                    });
            }

            function ordinaPerData(a, b) {
                return a.data - b.data;
            }
            //ordinamento DESC
            function ordinaRendicontiPerData(a, b) {
                return b.dataRendicontoDa - a.dataRendicontoDa;
            }
            
            $scope.estrazionePeriodo  = function (rendiconto) {
                return new Date(rendiconto.anno , rendiconto.mese  -1 , 1 , 0, 0, 0, 0).toLocaleString($translate.use(), {month:"long"});
            };

            this.onExit = function () { };

            controllerValidator.validate(this, $scope);
        }
    ]);

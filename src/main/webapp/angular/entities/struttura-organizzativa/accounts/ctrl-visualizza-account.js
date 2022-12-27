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
nivolaApp.controller('VisualizzaAccountController', [
	'$mdDialog', '$scope', '$state',"$stateParams", "$filter","$rootScope",
		'entitiesRest', 'controllerValidator',  'notificationManager', 'AuthenticationService','DashboardManagerService','AuthLevel',
		'conf','loggers', '$translate',
	function ($mdDialog, $scope, $state,$stateParams, $filter,$rootScope, 
		entitiesRest, controllerValidator, notificationManager, AuthenticationService,DashboardManagerService,AuthLevel,
		conf, loggers, $translate) {
    'use strict';
	var DettaglioAccount = entitiesRest.getEntity('DettaglioAccount');      
	var UtentiAccount = entitiesRest.getEntity('UtentiAccount');
	var Vm = entitiesRest.getEntity('Vm');
	var Quote = entitiesRest.getEntity('Quote');  
	var AllegatiAccount = entitiesRest.getEntity('AllegatiAccount');
	var	DownloadAllegato = entitiesRest.getEntity('DownloadAllegato');
	var DeleteFile = entitiesRest.getEntity('DeleteFile'); 

	var Dbaas = entitiesRest.getEntity('Dbaas');
	var Staas = entitiesRest.getEntity('Staas');
	var SecurityGroupAccount = entitiesRest.getEntity('SecurityGroupAccount');
	var InfoRendicontazione = entitiesRest.getEntity('InfoRendicontazione');
	var Vpc = entitiesRest.getEntity('Vpc');
	var RendicontoCsv = entitiesRest.getEntity('RendicontoCsv');
	var RendicontoCsvSintetico = entitiesRest.getEntity('RendicontoCsvSintetico');
	var ComputeVolumes = entitiesRest.getEntity('ComputeVolumes');
	var AccountWbs = entitiesRest.getEntity('AccountWbs');

	



	var ReportcsvSG = entitiesRest.getEntity('ReportcsvSG');
	var ReportcsvVM = entitiesRest.getEntity('ReportcsvVM');
	var ReportcsvDB = entitiesRest.getEntity('ReportcsvDB');
	var ReportcsvVolumi = entitiesRest.getEntity('ReportcsvVolumi');
	var ReportcsvShare = entitiesRest.getEntity('ReportcsvShare');
	var rebootVm= entitiesRest.getEntity('rebootVm');

	var RevocaAssociaWbs= entitiesRest.getEntity('RevocaAssociaWbs');
	
	


	

	var logger = loggers.get("VisualizzaAccountController");
	
	$scope.account={};
	$scope.utenti=[];
	$scope.myDate= null ; 
	$scope.ServiceReport = null   ; 

	$scope.selected = [];
	$scope.selectedVM = [];

	$scope.options={
		isErrorGeneric:false,
		isErrorDettaglio:false,
		isErrorWidget:false,
		isErrorUtenti:false,
		isErrorConsumi:false,
		isDettaglioLoaded:false,
		isUtentiLoaded:false,
		rowSelection: true,
		multiSelect: false,
		autoSelect: true,
		decapitate: false,
		boundaryLinks: false,
		limitSelect: true,
		pageSelect: true,
	};
	$scope.limitOptions = [10, 20,  30];
	$scope.filter = {
		options: {
			debounce: 500
		}
	};
	$scope.filterQuote = {
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
            accountUuid: $stateParams.idAccount,
            refreshAutomatico: false
        },
        dbaasDataProviderService: {
            accountUuid: $stateParams.idAccount,
            refreshAutomatico: false
        },
        staasDataProviderService: {
            accountUuid: $stateParams.idAccount,
            refreshAutomatico: false
        }
	};
	
	$scope.actions = {
		auth: {
			newInfoRendicontazione: $state.get("app.account.newinforendicontazione").requiredUC,
			change: $state.get("app.account.change").requiredUC,
			accredit :  AuthLevel.OrgAdminRole,
			manageAllegati : AuthLevel.BOADMIN
		},
	
		downloadCSV:  function (event) {
			setTimeout(() => {
				if($scope.promise.$$state.status===0){
					$rootScope.loadingElement = true;
				}
			}, 1000);
			event.preventDefault();
			
			var queryString = {};
			queryString.accountId = $scope.idAccount ; 
		   
			$scope.promise = $scope.ServiceReport.get(queryString).$promise;
	
			$scope.promise.then(function (data) {
			//lo trasformo in arrayBuffer
			console.log(data)
				var binary_string =  window.atob(data.report);
				var filename = data.nomeFile;
				var len = binary_string.length;
				var bytes = new Uint8Array( len );
				for (var i = 0; i < len; i++)        {
					bytes[i] = binary_string.charCodeAt(i);
				}
	
				if (window.navigator.msSaveBlob) { // IE 10+
					let currentBlob = new Blob([bytes.buffer], {type: 'test/csv'});
					window.navigator.msSaveOrOpenBlob(currentBlob, filename);
				} else {
					try {
						var link = document.createElement('a'); //create link download file
						let currentBlob = new Blob([bytes.buffer], {type: 'test/csv'});
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
				notificationManager.showErrorPopup($translate.instant("error.loading_allegato"));
			}).finally(function() {
				$rootScope.loadingElement = false;
			});
	
	
		},

		reboot: function (event) {
			var confirm = $mdDialog
				.confirm()
				.title($translate.instant('vm.reboot.titolo'))
				.textContent($translate.instant('vm.reboot.testo'))
				.targetEvent(event)
				.ok($translate.instant('si'))
				.cancel($translate.instant('no'));
			$mdDialog.show(confirm).then(function () {
				$scope.selectedVM.forEach(element => {
					rebootVm.save({ instanceId: element.instanceId ,  accountId: $stateParams.idAccount}, function (data) {
						logger.info("SUCCESS", data);
						notificationManager.showSuccessPopup($translate.instant('vm.reboot.success'));
						// Reset lista
						$scope.unselectAll();
						//$scope.resetFilter();
						// Aggiorno lista VM
						getIstanze();
					}, function (onfail) {
						logger.error("ERROR", onfail);
						
						if (onfail.data) {
							 notificationManager.showErrorPopup($translate.instant('vm.reboot.error') + ': ' + onfail.data.message);
						} else if (onfail.data.messaggio){
							notificationManager.showErrorPopup($translate.instant('vm.reboot.error') + ': ' + onfail.data.messaggio);
						}else {
							notificationManager.showErrorPopup($translate.instant('vm.reboot.error'));
						}
					});
				});
			});
		},
   
		change: function () {
			$state.go("app.account.change", {
				idAccount:$scope.idAccount
			});
		},
		uploadFile: function () {
			$state.go("app.account.allegati", {
				idAccount:$scope.idAccount
			});
		},
		aggiornaInfoRendicontazioni : function(){
			$scope.myDate=null; 
			getInfoRendicontazioniAccount();
		},
		refresh: function(){
			getDettaglioAccount();
			loadWidgetVisualizzaAccount();
			getUtentiAccount();
			getIstanze();  getDbaas();	getVolumes(); getSecurityGroups(); getVpcs();getVolumi(); getWbs();
		},

		// refreshServices: function(){
			
		// 	getIstanze();  getDbaas();	getVolumes(); getSecurityGroups(); getVpcs();getVolumi();
		// },
		dettaglioUtente:function(utenteAccount){
			$state.go("app.visualizzaUtente", {
				idUtente:utenteAccount.id
			});
		},
		registraUtente:function(){
			$state.go("app.registraUtente");
		},
		navigateToOrganizzazione:function(){
			$state.go("app.visualizzaOrganizzazione", {
				idOrganizzazione:$scope.account.organizzazione.uuid
			});
		},
		nuovaInfoRendicontazione: function () {
			$state.go('app.account.newinforendicontazione', { idAccount: $scope.account.uuid ,accountName: $scope.account.name });
		},
		navigateToDivisione:function(){
			$state.go("app.divisione.view", {
				idDivisione:$scope.account.divisione.uuid
			});
		},
		AccNewUser:function(){
			$state.go("app.listUtenti.accreditamento", {
				//idOrganizzazione:$scope.account.organizzazione.uuid
			});
		},accredit: function (ev) {
			var selected = $scope.selected;

			if ($scope.advancedSearchState) {
				// Evito di selezionare l'elemento (che potrebbe non essere presente) nella data-table
				$scope.selected = [];
				$scope.advancedSearchState = false;
			}

			$mdDialog.show({
				locals: {
					userSelected: selected
				},
				controller: 'DialogAccreditController',
				templateUrl: 'angular/entities/utente/tpl-dialog-accredit-utente.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose: true,
				fullscreen: true	// Only for -xs, -sm breakpoints.
			});
		},

		modificaInfoRendizontazione: function (info) {
			$state.go('app.account.editinforendicontazione', { infoRendicontazione: info, idAccount: $scope.account.idAccount ,accountName: $scope.account.name });
		},

		deleteInfoRendicontazione: function (info) {
			var confirm = $mdDialog
			.confirm()
			.title($translate.instant('accounts.info_rendicontazione.elimina.titolo') + ' ' + info.descrizioneMetrica)
			.htmlContent(" <md-dialog-content class='md-dialog-content ng-scope'> <div> <b class='ng-binding '>" + $translate.instant('accounts.info_rendicontazione.elimina.testo') + "</b><br><br><p class='ng-binding'>" + $translate.instant('accounts.info_rendicontazione.elimina.procedere')+ "</b> <br></div></md-dialog-content>")
			.targetEvent(event)
			.ok($translate.instant('conferma'))
			.cancel($translate.instant('annulla'))
		$mdDialog.show(confirm).then(function () {
			InfoRendicontazione.delete({ idMetrica: info.idValore,idAccount:info.accountUuid }, function (data) {
				notificationManager.showSuccessPopup($translate.instant('accounts.info_rendicontazione.elimina.success'));
				getInfoRendicontazioniAccount();
			}, function (onfail) {
				notificationManager.showErrorPopup($translate.instant('accounts.info_rendicontazione.elimina.error') + ' ' + info.descrizioneMetrica);
			});
		});
		},
	};

	

	$scope.unselectAll = function () {
		$scope.selected = [];
		$scope.selectedVM = [];
	};
	$scope.isInfoTenant = function (info) {
		return info.nomeMetricaDefinizione.includes('tenant');
	};
	$scope.resetFilter = function () {
		$scope.filter.search = '';
		$scope.query.filter = '';

		if ($scope.filter.form.$dirty) {
			$scope.filter.form.$setPristine();
		}
	};
	$scope.resetFilterQuote = function () {
		$scope.filterQuote.search = '';
		$scope.query.filterQuote = '';

		if ($scope.filterQuote.form.$dirty) {
			$scope.filterQuote.form.$setPristine();
		}
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

	}

	function getDettaglioAccount() {
	
		$scope.account ={};
		$scope.idAccount = $stateParams.idAccount;
		$scope.options.isDettaglioLoaded=false;
		if(!$scope.idAccount){
			$scope.options.isErrorGeneric =  true;
			return;
		}
		$scope.promise = DettaglioAccount.get({ 'uuid': $scope.idAccount }).$promise;

		return $scope.promise.then(function (data) {
			$scope.account = angular.copy(data);
			$scope.account.dataInizioConsumi = $scope.account.dataInizioConsumi!=null? new Date(Date.parse($scope.account.dataInizioConsumi)) : null;
			$scope.account.creation = formatDate(new Date($scope.account.creation));

		}, function (onfail) {
			notificationManager.showErrorPopup($translate.instant('error.loading_account_anagrafica'));
		}).finally(function() {
			$scope.options.isDettaglioLoaded=true;
		});
	};

	function getUtentiAccount() {
		$scope.account ={};
		$scope.idAccount = $stateParams.idAccount;
		$scope.options.isUtentiLoaded=false;
		if(!$scope.idAccount){
			$scope.options.isErrorGeneric =  true;
			return;
		}
		$scope.promise = UtentiAccount.get({ 'uuid': $scope.idAccount }).$promise;

		return $scope.promise.then(function (data) {
			$scope.utenti = angular.copy(data);
			
		}, function (onfail) {
			notificationManager.showErrorPopup($translate.instant('error.loading_utenti'));
		}).finally(function() {
			$scope.options.isUtentiLoaded=true;
		});
	};



	function getAllegatiAccount() {
		$scope.account ={};
		$scope.account.accountId=  $stateParams.idAccount;
		$scope.idAccount = $stateParams.idAccount;
		$scope.options.isAllegatiLoaded=false;
		if(!$scope.idAccount){
			$scope.options.isErrorGeneric =  true;
			return;
		}
		$scope.promise = AllegatiAccount.get($scope.account).$promise;

		return $scope.promise.then(function (data) {
			
			data.forEach(function (value) {
				
				value.dimensione!=null ? value.dim = bytesToSize(value.dimensione) :  value.dim =value.dimensione;
			});
			$scope.allegati = angular.copy(data);
			
		}, function (onfail) {
			notificationManager.showErrorPopup($translate.instant('error.loading_utenti'));
		}).finally(function() {
			$scope.options.isAllegatiLoaded=true;
		});
	};

	function bytesToSize(bytes) {
		var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
		if (bytes == 0) return '0 Byte';
		var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
		return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
	}


	$scope.deleteAllegato= function (event, allegato) {
		var accountId = $stateParams.idAccount; 
		var confirm = $mdDialog
		.confirm()
		.title($translate.instant('accounts.visualizza.allegati.elimina.titolo') + ' ' + allegato.nomeFile)
		.htmlContent(" <md-dialog-content class='md-dialog-content ng-scope'> <div> <b class='ng-binding '>" 
				+ $translate.instant('accounts.visualizza.allegati.elimina.testo') 
				+ "</b><br><br><p class='ng-binding'>" 
				+ $translate.instant('accounts.visualizza.allegati.elimina.procedere')+ "</b> <br></div></md-dialog-content>")
		.targetEvent(event)
		.ok($translate.instant('conferma'))
		.cancel($translate.instant('annulla'))
	$mdDialog.show(confirm).then(function () {
		DeleteFile.update({ nomeFile: escape(allegato.nomeFile), tipoDocumento: allegato.tipoDocumento, idAccount: accountId}, function (data) {
			console.log(data);
			notificationManager.showSuccessPopup($translate.instant('accounts.visualizza.allegati.elimina.success'));
			
			getAllegatiAccount();
		}, function (onfail) {
			logger.error("ERROR", onfail);
			notificationManager.showErrorPopup($translate.instant('accounts.visualizza.allegati.elimina.error') + ' ' + allegato.nomeFile);
		});
	});
	}
	
	

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



	     
	$scope.downloadAllegato= function (event, allegato) {
		event.preventDefault();
		let filename =allegato.nomeFile;

		var queryString = {};
		queryString.accountId = $scope.account.uuid;
		queryString.nomeFile = allegato.nomeFile;
		queryString.tipo = allegato.tipoDocumento;
	
		$scope.promise = DownloadAllegato.query(queryString).$promise;

		$scope.promise.then(function (data) {
		   //lo trasformo in arrayBuffer
		   console.log(data)
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
			notificationManager.showErrorPopup($translate.instant("error.loading_allegato"));
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

	function loadWidgetVisualizzaAccount() {
		DashboardManagerService.impostaWidgetConf(widgetConfig);
		$scope.dashboard= DashboardManagerService.loadDashboard(AuthLevel.DettaglioAccountViewer);
		console.log("EK   loadWidgetVisualizzaAccount()")
	}

	/*
		Elenco dei servizi accont per 
	 */
	$scope.tabRisorseSelected = function () {
		$scope.query.page=1; // torna alla prima pagina della lista
		$scope.ServiceReport = null   ; 
		$scope.reportAvailable=false; 
		switch ($scope.risorsaSelezionata) {
			case 'vm':
				$scope.ServiceReport = ReportcsvVM;
				$scope.reportAvailable=true;
				getIstanze();
			break;
			case 'db':
				$scope.ServiceReport = ReportcsvDB;
				$scope.reportAvailable=true;
				getDbaas();
			break;
			case 'staas':
				$scope.reportAvailable=true;
				$scope.ServiceReport = ReportcsvShare;
				getVolumes();
			break;
			case 'sg':
				$scope.ServiceReport = ReportcsvSG;
				$scope.reportAvailable=true;
				getSecurityGroups();
			break;
			case 'vpc':
				$scope.reportAvailable=false;
				$scope.ServiceReport = null;
				getVpcs();
			break;
			case 'vol' :
				$scope.reportAvailable=true;
				$scope.ServiceReport = ReportcsvVolumi;
				getVolumi();
		}
	};

	$scope.determinateValue = 30;
	$scope.tabQuoteSelected = function () {
		switch ($scope.quoteServiziSelezionata) {
			case 'all':
				getQuoteservizi()
			case 'vm':
				quoteCompute();
			break;
			case 'db':
				quoteDbaas();
			break;
			case 'staas':
				quoteVolumes();
			break;
		}
	};

	function quoteDbaas(){
		$scope.quote = $scope.quoteDbaas;
	}

	function quoteCompute(){
		$scope.quote = $scope.quoteCompute
	}

	function quoteVolumes(){
		$scope.quote = $scope.quoteStaas
	}

	
	function getQuoteservizi() {

		$scope.promise = Quote.query({ "uuid" :  $stateParams.idAccount}).$promise;
			
			return $scope.promise.then(function (data) {
				logger.info("SUCCESS", data);
				
				$scope.quote=[]; 
				$scope.quoteCompute = [];
				$scope.quoteDbaas = [];
				$scope.quoteStaas = [];
				var qCompute = data.quoteCompute; 
				var qDbaas = data.quoteDb;
				var qStaas = data.quoteStorage; 
				qCompute.forEach(function(value){

					let used= value.valori[0].usato;
					let totale= value.valori[0].limite;
					let percent= Math.floor(used* 100 /totale); 
					if(percent > 70) 
						value.colore= "md-warn md-hue-10"; 
					else value.colore= "md-primary md-hue-10";

					value.percent=percent;
					value.used=used;
					value.totale=totale;
					value.servizio="compute"; 
					$scope.quoteCompute.push(value); 
					$scope.quote.push(value); 
				});

				qDbaas.forEach(function(value){

					let used= value.valori[0].usato;
					let totale= value.valori[0].limite;
					let percent= Math.floor(used* 100 /totale); 
					if(percent > 70) 
						value.colore= "md-warn md-hue-10"; 
					else value.colore= "md-primary md-hue-10";

					value.percent=percent;
					value.used=used;
					value.totale=totale;
					value.servizio="dbaas";
					$scope.quoteDbaas.push(value);
					$scope.quote.push(value); 
				});

				qStaas.forEach(function(value){

					let used= value.valori[0].usato;
					let totale= value.valori[0].limite;
					let percent= Math.floor(used* 100 /totale); 
					if(percent > 70) 
						value.colore= "md-warn md-hue-10"; 
					else value.colore= "md-primary md-hue-10";

					value.percent=percent;
					value.used=used;
					value.totale=totale;
					value.servizio="staas";
					$scope.quoteStaas.push(value); 
					$scope.quote.push(value); 
				});

			}, function (onfail) {
				logger.error("ERROR", onfail);
				if (onfail.data && onfail.data.message) {
						notificationManager.showErrorPopup('Si è verificato un errore durante il caricamento delle quote : ' + onfail.data.message);
				} else {
						notificationManager.showErrorPopup('Si è verificato un errore durante il caricamento delle quote !');
				}
				
			});

			

		}; 

	function getDbaas() {
		var queryString = {};
		queryString.accountId = $stateParams.idAccount;

		$scope.promise = Dbaas.query(queryString).$promise;

		return $scope.promise.then(function (data) {
			logger.info("SUCCESS", data);
			data.forEach(function (value) {
				value.cpu_ram = '';
				if (value.cpu != null && value.ram != null) {
					value.cpu_ram = value.cpu + ' CPU, ';
				}
				if (value.ram != null) {
					value.cpu_ram = value.cpu_ram + value.ram + ' RAM';
				}
				value.region_az = value.region + ' - ' + value.az;

				var sColor = null;
				var sIcon = null;
				var sTooltip = null;
				
				if (value.status == null || value.status == "null") {
					value.status = "undefined";
				}
				
				if (value.engine == null || value.engine == "null" || value.engine == "null null") {
						value.engine = "n.d.";
				}
				
				if (value.status.toLowerCase() === "running" || 
					value.status.toLowerCase() === "active"  ||
					value.status.toLowerCase() === "available" ) {
					sColor = "green";
					sIcon = "power_settings_new";
					sTooltip = $translate.instant('dbaas.stato.available');
				} else if (value.status.toLowerCase() === "pending") {
					sColor = "orange";
					sIcon = "av_timer";
					sTooltip = $translate.instant('dbaas.stato.pending');
				} else if (value.status.toLowerCase() === "stopped" ) {
					sColor = "red";
					sIcon = "power_settings_new ";
					sTooltip = $translate.instant('dbaas.stato.stopped');
				} else if (value.status.toLowerCase() === "inactive" ) {
					sColor = "red";
					sIcon = "power_settings_new ";
					sTooltip = $translate.instant('dbaas.stato.inactive');
				} else if (value.status.toLowerCase() === "error" ) {
					sColor = "red";
					sIcon = "error_outline";
					sTooltip = $translate.instant('dbaas.stato.error');
				} else if (value.status.toLowerCase() === "undefined" ) {
					sColor = "yellow";
					sIcon = "warning";
					sTooltip = $translate.instant('dbaas.stato.undefined');                           
				} else {
					sColor = "grey";
					sIcon = "warning";
					sTooltip = $translate.instant('dbaas.stato.value') + ' ' + value.status;
				}

				value.stato = {
					flag: value.status,
					color: sColor,
					icon: sIcon,
					tooltip: sTooltip 
				};
			});

			$scope.dbaas = data;

			$scope.numeroAttivi = $filter("filter")(data, { status: 'attivo' }).length;
			$scope.numeroDisattivi = $filter("filter")(data, { status: 'sospeso' }).length;
		}, function (onfail) {
			logger.error("ERROR", onfail);
			if (onfail.body) {
				if (onfail.body.data && onfail.body.data.message) {
					notificationManager.showErrorPopup($translate.instant('error.loading_istanze') + ': ' + onfail.body.data.message);
				} else {
					notificationManager.showErrorPopup($translate.instant('error.loading_istanze'));
				}
			} else {
				notificationManager.showErrorPopup($translate.instant('error.loading_istanze'));
			}
		});
	};


	/**
	 * sezione STORAGE
	 */
	function getVolumes() {
		var queryString = {};
		queryString.accountId = $stateParams.idAccount;
		$scope.promise = Staas.query(queryString).$promise;
		return $scope.promise.then(function (data) {
			if(data.length ===0){
				$scope.options.elencoVuoto = true;
			}
			$scope.volumes = data;
		}, function (onfail) {
			if (onfail.data) {
				if (onfail.data && onfail.data.message) {
					notificationManager.showErrorPopup($translate.instant('error.loading_storage') + ': ' + onfail.data.message);
				} else {
					notificationManager.showErrorPopup($translate.instant('error.loading_storage'));
				}
			} else {
				notificationManager.showErrorPopup($translate.instant('error.loading_storage'));
			}
		}).finally(function(){
			$scope.volumes = $scope.volumes.map(e => {
				e.dataCreazione = formatDate(new Date(e.dataCreazione));
				e.throughput = getThroughput(e.provisionedThroughputInMibps, e.throughputMode);
				e.dimensione = getDimensione(e.dimensioneInByte, 2);
				e.stato = getStatoFS(e.statoFileSystem);
				e.mountTargetsIds = getMountTargetsIds(e.mountTargets);
				e.ipAddresses = getIpAddresses(e.mountTargets);
				e.protocols = getProtocols(e.mountTargets);
				return e;
		});
		});

	};


	function getVpcs() {
		var queryString = {};
		queryString.accountUuid = $stateParams.idAccount;
		$scope.promise = Vpc.query(queryString).$promise;

		return $scope.promise.then(function (data) {
			logger.info("SUCCESS", data);
			$scope.vpcs = data;
		}, function (onfail) {
			logger.error("ERROR", onfail);
			if (onfail.body) {
				if (onfail.body.data && onfail.body.data.message) {
					notificationManager.showErrorPopup($translate.instant('error.loading_vpc') + ': ' + onfail.body.data.message);
				} else {
					notificationManager.showErrorPopup($translate.instant('error.loading_vpc'));
				}
			} else {
				notificationManager.showErrorPopup($translate.instant('error.loading_vpc'));
			}
		});
	};


	function getSecurityGroups() {
		var queryString = {};
		queryString.accountUuid = $stateParams.idAccount;
		$scope.promise = SecurityGroupAccount.query(queryString).$promise;
		return $scope.promise.then(function (data) {
			logger.info("SUCCESS", data);
			$scope.groups = data;
		}, function (onfail) {
			logger.error("ERROR", onfail);
			if (onfail.data) {
				if (onfail.data && onfail.data.message) {
					notificationManager.showErrorPopup($translate.instant('error.loading_security_group') + ': ' + onfail.data.message);
				} else {
					notificationManager.showErrorPopup($translate.instant('error.loading_security_group'));
				}
			} else {
				notificationManager.showErrorPopup($translate.instant('error.loading_security_group'));
			}

		});
	};

	function getVolumi() {

		//$scope.volumi = mockupResponse.elencoVolumi;
		
		var queryString = {};
		queryString.accountId = $stateParams.idAccount;

		$scope.promise = ComputeVolumes.get(queryString).$promise;

		return $scope.promise.then(function (data) {
			logger.info("SUCCESS", data);
			$scope.volumi =data.elencoVolumi;

			
			data.elencoVolumi.forEach( function(value){
						
				var  sBadge = null; 
				var  sStato = null; 

				if(value.status !== null){
					if (value.status.toLowerCase() === "in-use") {
						sBadge= "badge badge-success";
						sStato =$translate.instant('volume.statoText.inuse');

					} else if (value.status.toLowerCase() === "pending") {
						sBadge= "badge badge-warning";
						sStato =$translate.instant('volume.statoText.pending');

					}else if (value.status.toLowerCase() === "stopped") {
						sBadge= "badge badge-secondary";
						sStato =$translate.instant('volume.statoText.stopped');

					}else if (value.status.toLowerCase() === "error") {
						sBadge= "badge badge-danger";
						sStato =$translate.instant('volume.statoText.error');

					}
					else if (value.status.toLowerCase() === "unknown") {
						sBadge= "badge badge-warning";
						sStato =$translate.instant('volume.statoText.unknow');

					}
					else{
						sBadge= "badge badge-light";
						sStato =value.status ;
					}
				}

				value.stato = {
					badge: sBadge,
					stato: sStato
				};

			});

		}, function (onfail) {
			logger.error("ERROR", onfail);
			if (onfail.body) {
				if (onfail.body.data && onfail.body.data.message) {
					notificationManager.showErrorPopup($translate.instant('error.loading_volumi') + ': ' + onfail.body.data.message);
				} else {
					notificationManager.showErrorPopup($translate.instant('error.loading_volumi'));
				}
			} else {
				notificationManager.showErrorPopup($translate.instant('error.loading_volumi'));
			}
		});
	};


	function getStatoFS(stato){
		let htmlStato = '';
		
		switch (stato) {
			case 'creating':
			case 'deleting':
				htmlStato = '<span class="badge badge-warning" >' + stato + '</span>';
				break;
			case 'available':
				htmlStato = '<span class="badge badge-success" >' + stato + '</span>';
				break;
			case 'deleted':
				htmlStato = '<span class="badge badge-danger" >' + stato + '</span>';
				break;
			case 'error':
				htmlStato = '<span class="badge badge-danger" >' + stato + '</span>';
				break;
			default :
				htmlStato = '<span class="badge badge-warning" >' + stato + '</span>';
				break;
		}
		return htmlStato;
	}

	function getDimensione(bytes, decimals = 2) {
		if (bytes === 0) return '0 Bytes';
	
		const k = 1024;
		const dm = decimals < 0 ? 0 : decimals;
		const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	
		const i = Math.floor(Math.log(bytes) / Math.log(k));
	
		return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
	}

	function getMountTargetsIds(mountTargets){
		let htmlmountTargets = '<span class="md-caption" >';
		if(mountTargets && mountTargets.length > 0){
			mountTargets.forEach(target => {
				if(target['MountTargetId']){
					htmlmountTargets +=target['MountTargetId'];
				}
			});
		}
		htmlmountTargets+='</span>';
		return htmlmountTargets;
	}

	function getIpAddresses(mountTargets){
		let htmlIpAddresses = '<span class="md-caption" >';
		if(mountTargets && mountTargets.length > 0){
			mountTargets.forEach(target => {
				if(target['IpAddress']){
					htmlIpAddresses +=target['IpAddress'];
				}
			});
		}
		htmlIpAddresses+='</span>';
		return htmlIpAddresses;
	}

	function getProtocols(mountTargets){
		let htmlProtocol = '<span class="md-caption" >';
		if(mountTargets && mountTargets.length > 0){
			mountTargets.forEach(target => {
				if(target['protocol']){
					htmlProtocol +=target['protocol'];
				}
			});
		}
		htmlProtocol+='</span>';
		return htmlProtocol;
	}
	
	function getThroughput(valore,mode){
		let htmlThroughput = '<span class="md-caption" >';
		if(mode && mode !==null && mode !==''){
			htmlThroughput +=mode;
		}
		if(valore && valore !==null){
			htmlThroughput+=' <b>'+valore+' MiB/S</b>'
		}
		htmlThroughput+='</span>';
		return htmlThroughput;
	}

	function formatDate(d) {
		let month = String(d.getMonth() + 1);
		let day = String(d.getDate());
		const year = String(d.getFullYear());
	  
		if (month.length < 2) month = '0' + month;
		if (day.length < 2) day = '0' + day;
	  
		return `${day}-${month}-${year}`;
	  }
	this.onInit = function () {
		getVolumes();
	};

	/**
	 * FINE SEZIONE STORAGE
	 */

	/**
	 * INIZIO SEZIONE VM
	 */
	function getIstanze() {
		var queryString = {};
		
		queryString.accountId = $stateParams.idAccount;
		$scope.promise = Vm.query(queryString).$promise;

		return $scope.promise.then(function (data) {
			logger.info("SUCCESS", data);
			data.forEach(function (value) {
				value.cpu_ram = '';
				
				if (value.cpu != null && value.ram != null) {
					value.cpu_ram = value.cpu + ' CPU, ';
				}
				if (value.ram != null) {
					value.cpu_ram = value.cpu_ram + value.ram + 'MB RAM';
				}
				value.region_az = '';
				if (value.region != null) {
					value.region_az = value.region;
					if (value.az != null) {
						value.region_az = value.region_az + ' - ' + value.az;
					}
				}

				value.secGroup = '';
				if(value.securityGroup !=null){
					value.securityGroup.forEach(function (sg) {
						if(value.secGroup == ''){
							value.secGroup = sg.groupName;
						}else{
							value.secGroup = value.secGroup + " ," +sg.groupName;
						}
						
					});
				}

				
				var sColor = null;
				var sIcon = null;
				var sTooltip = null;
				var  sBadge = null; 
				var  sStato = null; 

				if(value.status !== null){
					if (value.status.toLowerCase() === "running") {
						sTooltip = $translate.instant('vm.stato.running');
						sBadge= "badge badge-success";
						sStato =$translate.instant('vm.statoText.running');

					} else if (value.status.toLowerCase() === "pending") {
						sTooltip = $translate.instant('vm.stato.pending');
						sBadge= "badge badge-warning";
						sStato =$translate.instant('vm.statoText.pending');

					}else if (value.status.toLowerCase() === "stopped") {
						sTooltip = $translate.instant('vm.stato.stopped');
						sBadge= "badge badge-secondary";
						sStato =$translate.instant('vm.statoText.stopped');

					}else if (value.status.toLowerCase() === "error") {
						sTooltip = $translate.instant('vm.stato.errore');
						sBadge= "badge badge-danger";
						sStato =$translate.instant('vm.statoText.errore');

					}
					else if (value.status.toLowerCase() === "unknown") {
						sTooltip = $translate.instant('vm.stato.unknow');
						sBadge= "badge badge-warning";
						sStato =$translate.instant('vm.statoText.unknow');

					}
					else{
						sTooltip = $translate.instant('vm.stato.value') + " " + value.status;
						sBadge= "badge badge-light";
						sStato =value.status ;
					}
				}


				value.stato = {
					flag: value.status,
					color: sColor,
					icon: sIcon,
					tooltip: sTooltip,
					badge: sBadge,
					stato: sStato
				};
			});
			$scope.istanze = data;
			$scope.numeroAttivi = $filter("filter")(data, { status: 'running' }).length;
			$scope.numeroDisattivi = $filter("filter")(data, { status: 'error' }).length;
		}, function (onfail) {
			logger.error("ERROR", onfail);
			if (onfail.data) {
				
					notificationManager.showErrorPopup($translate.instant('error.loading_vm') + ': ' + onfail.data.message);
				
			} else {
				notificationManager.showErrorPopup($translate.instant('error.loading_vm'));
			}
		});
	};

	function getInfoRendicontazioniAccount() {
		//var accountUuid= AuthenticationService.getUtente().abilitazioneSelezionata.accountUuid; 
		var queryString = {
			//idAccount: accountUuid
			idAccount: $stateParams.idAccount
		};
	   
		$scope.promise = InfoRendicontazione.query(queryString).$promise;


		return $scope.promise.then(function (data) {
			
			if (data) {
				$scope.infoRendicontazioniAccount = data;
			}

		}, function (onfail) {
			if (onfail.body) {
				if (onfail.body.data && onfail.body.data.message) {
					notificationManager.showErrorPopup($translate.instant('error.loading_servizi_account') + ': ' + onfail.body.data.message);
				} else {
					notificationManager.showErrorPopup($translate.instant('error.loading_servizi_account'));
				}
			} else {
				notificationManager.showErrorPopup($translate.instant('error.loading_servizi_account'));
			}
		});
	};

	
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

	function getWbs() {
		var queryString = {};
		var id =  $stateParams.idAccount;
		queryString.accountId = id;
		$scope.promise = AccountWbs.query(queryString).$promise;

		return $scope.promise.then(function (data) {
			logger.info("SUCCESS", data);
			$scope.elencoWbs = data;
		}, function (onfail) {
			logger.error("ERROR", onfail);
			if (onfail.body) {
				if (onfail.body.data && onfail.body.data.message) {
					notificationManager.showErrorPopup($translate.instant('error.loading_wbs') + ': ' + onfail.body.data.message);
				} else {
					notificationManager.showErrorPopup($translate.instant('error.loading_wbs'));
				}
			} else {
				notificationManager.showErrorPopup($translate.instant('error.loading_wbs'));
			}
		});
	};




	this.onInit = function () {
		// $scope.utenteSessione = AuthenticationService.getUtente();
		// var abilitazione = AuthenticationService.getUtente().abilitazioneSelezionata;
		$scope.isBORole = AuthenticationService.getUtente().abilitazioneSelezionata.userRole === AuthLevel.BOADMIN;

		$scope.status.tabIndex = 0;
		getDettaglioAccount();
		loadWidgetVisualizzaAccount();
		getUtentiAccount();
		getAllegatiAccount();
		getInfoRendicontazioniAccount();
		getWbs();
	};

	this.onExit = function () { };
	controllerValidator.validate(this, $scope);


}]);

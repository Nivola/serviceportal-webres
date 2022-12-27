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
nivolaApp.controller('controllerMock', [
	'$rootScope', '$scope', 'loggers', 'controllerValidator', 'MockService', '$state', '$stateParams',
function( $rootScope, $scope, loggers, controllerValidator, serviceMock, $state, $stateParams) {
	var logger = loggers.get("controller");

	$scope.enti = {
		vm : {},
		status : {
			loaded : true,
			listFilterInput : null
		},
		actions : {},
		helpers : {}
	};

	$scope.referente = {
			nome : null,
			email : null
	};

	var utente = $rootScope.utente; 
	if (utente) {
		$scope.referente.nome = utente.firstName + " " + utente.lastName;
		$scope.referente.email = utente.email;
	}

	
	this.getRandomDate = function() {
		return new Date(new Date().getTime() - 1000 * 1000 * serviceMock.getRandom(10000));
	};

    this.getRandomCredit = function() {
        return serviceMock.getRandom(10000) - 2000;
    };

    this.getRandomConsumption = function() {
        return serviceMock.getRandom(5000) + 100;
    };

    this.getRandomOrderAmount = function() {
        return serviceMock.getRandom(5000) + 1000;
    };

    $scope.enti.vm.listaOrdini = [
        // {"code":"ORD000", "name":"Delibera acquisto servizi VM",    "amount":this.getRandomOrderAmount(), "date":this.getRandomDate()},
        // {"code":"ORD001", "name":"Delibera acquisto servizi CB",    "amount":this.getRandomOrderAmount(), "date":this.getRandomDate()},
        // {"code":"ORD002", "name":"Delibera acquisto servizi DBaaS", "amount":this.getRandomOrderAmount(), "date":this.getRandomDate()},
        // {"code":"ORD003", "name":"Delibera acquisto servizi VM",    "amount":this.getRandomOrderAmount(), "date":this.getRandomDate()},
        // {"code":"ORD004", "name":"Delibera acquisto servizi VM",    "amount":this.getRandomOrderAmount(), "date":this.getRandomDate()}
    ];

    $scope.enti.vm.listaConsumi = [
        // {"code":"VM", 		"name":"VM (datacenter 1)", "value":this.getRandomConsumption(), "valueDescription":"€", "metric":"12 CPU"},
        // {"code":"VM", 		"name":"VM (datacenter 2)", "value":this.getRandomConsumption(), "valueDescription":"€", "metric":"15 CPU"},
        // {"code":"DBaaS", 	"name":"DBaaS", 		    "value":this.getRandomConsumption(), "valueDescription":"€", "metric":"8.23 GB"},
        // {"code":"BaaS", 	"name":"BaaS", 			    "value":this.getRandomConsumption(), "valueDescription":"€", "metric":"152.7 GB"},
        // {"code":"SaaS", 	"name":"SaaS", 			    "value":this.getRandomConsumption(), "valueDescription":"€", "metric":"89.6 GB"}
    ];

    $scope.enti.vm.listaOrganizzazioni = [
        // {"code":"CSI-DEMO",     "name":"CSI Piemonte",          "servizi":"ALL", "credito":"€ -10.562,64",  "referente":"Dott. Vito Baglio"},
        // {"code":"COM-TORINO",   "name":"Comune di Torino",      "servizi":"ALL", "credito":"€ 5.122,24",    "referente":"Dott. Innominato"},
        // {"code":"COM-CUNEO",    "name":"Comune di Cuneo",       "servizi":"ALL", "credito":"€ 5.122,24",    "referente":"Dott. Innominato"},
        // {"code":"COM-MONDOVI'", "name":"Comune di Mondovi'",    "servizi":"ALL", "credito":"€ 5.122,24",    "referente":"Dott. Innominato"}
    ];

	$scope.enti.vm.listaDivisioni = [
		// {"code":"DIV001", "name":"Divisione 1 (default)",   "credito":this.getRandomCredit(), "referente":"Default"},
        // {"code":"DIV002", "name":"Divisione 2",             "credito":this.getRandomCredit(), "referente":"Default"},
        // {"code":"DIV003", "name":"Divisione 3",             "credito":this.getRandomCredit(), "referente":"Default"},
        // {"code":"DIV004", "name":"Divisione 4",             "credito":this.getRandomCredit(), "referente":"Default"},
	];

    $scope.enti.vm.listaAccount = [
        // {"code":"prd_services",           "name":"Servizi web per Portali",    "servizi":"ALL", "credito":this.getRandomCredit(), "referente":"Matteo Simome"},
        // {"code":"CAMO",             "name":"Comune di Camo",                "servizi":"ALL", "credito":this.getRandomCredit(), "referente":"Dottor Mario Saffirio"},
        // {"code":"CASTELLINALDO",    "name":"Comune di Castellinaldo",       "servizi":"ALL", "credito":this.getRandomCredit(), "referente":"Sindaco Giovanni Molino"},
        // {"code":"CLOUD-DEMO",       "name":"CSI Piemonte",                  "servizi":"ALL", "credito":this.getRandomCredit(), "referente":"Dott. Vito Baglio"},
        // {"code":"Collegno",         "name":"Comune di Collegno",            "servizi":"ALL", "credito":this.getRandomCredit(), "referente":"D.ssa Claudia Maddaleno"},
        // {"code":"CORNELIANO",       "name":"Corneliano d'Alba",             "servizi":"ALL", "credito":this.getRandomCredit(), "referente":"Sindaco Edgardo Tiveron"},
        // {"code":"COTO",             "name":"Comune di Torino",              "servizi":"ALL", "credito":this.getRandomCredit(), "referente":"Dario Togliatto"},
        // {"code":"CPO",              "name":"CPO Piemonte",                  "servizi":"ALL", "credito":this.getRandomCredit(), "referente":"Dott. Andrea Ortale"},
        // {"code":"GOVONE",           "name":"Comune di Govone",              "servizi":"ALL", "credito":this.getRandomCredit(), "referente":"Sindaco Giampiero Novara"},
        // {"code":"Grugliasco",       "name":"Comune di Grugliasco",          "servizi":"ALL", "credito":this.getRandomCredit(), "referente":"Fabio Amato"},
        // {"code":"MAGLIANO",         "name":"Comune di Magliano Alfieri",    "servizi":"ALL", "credito":this.getRandomCredit(), "referente":"Sindaco Luigi Carosso"},
        // {"code":"MONTELUPO",        "name":"Comune di Montelupo Albese",    "servizi":"ALL", "credito":this.getRandomCredit(), "referente":"Sindaco Marilena Destefanis"},
        // {"code":"MORETTA",          "name":"Comune di Moretta",             "servizi":"ALL", "credito":this.getRandomCredit(), "referente":"Sindaco Sergio Banchio"},
        // {"code":"NOVELLO",          "name":"Comune di Novello",             "servizi":"ALL", "credito":this.getRandomCredit(), "referente":"Sindaco Roberto Passone"},
        // {"code":"POCPOWERBI",       "name":"POCPOWERBI",                    "servizi":"ALL", "credito":this.getRandomCredit(), "referente":"Ing. Giuseppe Galgano"},
        // {"code":"PRIOCCA",          "name":"Comune di Priocca",             "servizi":"ALL", "credito":this.getRandomCredit(), "referente":"Sindaco Marco Perosino"},
        // {"code":"REGMARCHE",        "name":"Regione marche",                "servizi":"ALL", "credito":this.getRandomCredit(), "referente":"Dott. Ruggiero D'Oronzo"},
        // {"code":"RODDI",            "name":"Comune di Roddi",               "servizi":"ALL", "credito":this.getRandomCredit(), "referente":"Sindaco Roberto Giacosa"},
        // {"code":"SERRALUNGA",       "name":"Comune di Serralunga d'Alba",   "servizi":"ALL", "credito":this.getRandomCredit(), "referente":"Sindaco Gianfranco Capoccia"},
        // {"code":"SIGE",             "name":"SIGE - Comune di Torino",       "servizi":"ALL", "credito":this.getRandomCredit(), "referente":"Dott. Dario Togliatto"},
    ];

    $scope.enti.vm.account = $scope.enti.vm.listaAccount[$stateParams.idAccount ? $stateParams.idAccount : 0];
	$scope.enti.vm.organizzazione = $scope.enti.vm.listaOrganizzazioni[$stateParams.idOrganizzazione ? $stateParams.idOrganizzazione : 0];
	$scope.enti.vm.divisione = $scope.enti.vm.listaDivisioni[$stateParams.idDivisione ? $stateParams.idDivisione : 0];

    $scope.enti.actions.gotoDetailsOrg = function(e, $index) {
        $state.go("app.organizzazione.dettaglio", {idOrganizzazione : $index, entity: e});
    };

    $scope.enti.actions.gotoDetailsDivisione = function(e, $index) {
        $state.go("app.organizzazione.dettaglio.divisione", {idDivisione : $index, entity: e});
    };

    $scope.enti.actions.gotoDetailsAccount = function(e, $index) {
        $state.go("app.organizzazione.dettaglio.divisione.account", {idAccount: $index, entity: e});
    };

    $scope.enti.actions.backFromEditOrganizzazione = function() {
        window.history.back();
    };

    $scope.enti.actions.backFromEditDivisione = function() {
        window.history.back();
    };

    $scope.enti.actions.backFromEditAccount = function() {
        window.history.back();
    };

    $scope.enti.actions.gotoEditOrganizzazione = function(e, $index) {
        $state.go("app.organizzazione.modifica", {idOrganizzazione : $index, entity: e});
    };

    $scope.enti.helpers.listFilter = function(value, index, array) {
        var keyword = $scope.enti.status.listFilterInput;
        if (!keyword) return true;
        keyword = keyword.toUpperCase();

        return value.code.toUpperCase().indexOf(keyword) != -1 ||
            value.name.toUpperCase().indexOf(keyword) != -1 ||
            value.referente.toUpperCase().indexOf(keyword) != -1;
    };

    $.each($scope.enti.vm.listaOrdini, function(i, ordine) {
    	ordine.accountTarget = serviceMock.pickRandom($scope.enti.vm.listaAccount);
	});

    $.each($scope.enti.vm.listaAccount, function(i, account) {
        account.divisione = serviceMock.pickRandom($scope.enti.vm.listaDivisioni);
    });

    $.each($scope.enti.vm.listaDivisioni, function(i, divisione) {
        divisione.organizzazione = serviceMock.pickRandom($scope.enti.vm.listaOrganizzazioni);
    });

	// metodi per validazione controller
	this.onInit = function() {
		logger.debug("init mock controller");
	};
	
	this.onExit = function() {
		logger.debug("exit mock controller");
	};

	// validazione controller
	controllerValidator.validate(this, $scope);
}]);

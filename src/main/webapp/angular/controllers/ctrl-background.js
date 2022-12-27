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
"use strict";

angular.module('app').controller('controllerBackground', [
	'$rootScope', '$scope', '$state','$cookies',
	'AuthenticationService', 'operations', 'events',
	'notificationManager', 'operationQueue', '$interval',
    'controllerValidator', 'loggers', 'conf', '$mdSidenav', 'LeftMenuFactory', '$translate', /*'TawkToChat',*/
function(
	$rootScope, $scope, $state,$cookies,
	serviceUtente, operations, events,
	notificationManager, operationQueue, $interval, 
    controllerValidator, loggers, conf, $mdSidenav, LeftMenuFactory, $translate /*TawkToChat */ 
) {
	var logger = loggers.get("controller");

	var vm = $scope;
    vm.state = $state;
    vm.utente = serviceUtente.getUtente();
    vm.ruoloCorrente = vm.utente.abilitazioneSelezionata;
	vm.error = {};
    vm.warning = {};
    vm.info = {};
	vm.anyOperationRunningLong = false;
    vm.status = { loading : false	};
	vm.menuCompleto= LeftMenuFactory.getMenuCompleto;
	vm.idToChat=conf.location.idToChat;
	vm.widgetIt=conf.location.widgetIt;
	vm.widgetEn=conf.location.widgetEn;
	
    (function () {
        operationQueue.watch($scope, $scope.status, 'loading', [ operations.caricamento ]);
        $interval(function() {
            if (operationQueue.anyPendingForAtLeast(50)) {
                vm.anyOperationRunningLong = true;
            } else {
                vm.anyOperationRunningLong = false;
            }
        }, 50);
		refreshUtente();
		
    })();


    vm.onChangeRole = function(obj) {
        logger.debug('nuovo ruolo : ',obj);
        logger.debug('nuovo ruolo ID  : ',obj.id);
        var u = vm.utente;
        u.abilitazioneSelezionata = obj;
        serviceUtente.changeAbil(obj.id)
        serviceUtente.setUtente(u);
    }
          
	// ???
	$scope.close = function (id) {
		// Component lookup should always be available since we are not using `ng-if`
		$mdSidenav(id).close()
			.then(function () {
				logger.debug("close LEFT is done");
			});
	};
	
	vm.toggleLeft = buildToggler('sidenav-left');
	vm.toggleRight = buildToggler('sidenav-right');

	vm.openNewWindows = function(url) {
		window.open(url,'_blank');
	};
	
        
    vm.clearMenuFilter = function() {
		vm.leftMenuFilterInput = "";
		vm.leftFilterChanged();
	};

	vm.leftFilterChanged = function() {
		var value = vm.leftMenuFilterInput;
		if (value === null || value === undefined || value === "") {
			value = null;
		}
		
		$rootScope.globalFilterEnabled = value != null;
		$rootScope.globalFilter = value;
		
		$rootScope.$broadcast(events.GLOBAL_SEARCH_CHANGED, {
			content : $rootScope.globalFilter,
			active : $rootScope.globalFilterEnabled
		});
	};
	
    function refreshUtente () {
		vm.utente = serviceUtente.getUtente();
		vm.ruoloCorrente = serviceUtente.getUtente().abilitazioneSelezionata;
		logger.info("refresh utente vm.ruoloCorrente "+JSON.stringify(vm.ruoloCorrente ));
    };

    function buildToggler(navID) {
        return function() {
            // Component lookup should always be available since we are not using `ng-if`
            $mdSidenav(navID)
                .toggle()
                .then(function () {  });
        };
    }

	function clearCookies() {
		var cookies = $cookies.getAll();
		angular.forEach(cookies, function (v, k) {
			if ('__tawkuuid' === k || 'TawkConnectionTime' === k) {
				$cookies.remove(k);
			}
				
		});
	}
    $scope.$on("$stateChangeSuccess", function(){
        $scope.showNavMenu = $state.current.data ? !$state.current.data.hideMenu : true;
   });
    
    $scope.$on(events.USER_CHANGED, function() {
		clearCookies();
        logger.debug(" on events.USER_CHANGED: ricarico la home");
		refreshUtente();
		$state.go('app.home');
		
	});
	
	$scope.cambiareLingua = function(lingua){
		// i18n per internazionanlizzare la chat bisogna ricaricare la pagina
		// $translate.use(lingua);
		var path = location.href.split('lang=')[0];
		location.replace(path + '?lang=' + lingua);
		window.location.reload();
	};
	
	$rootScope.$on(events.GATEWAY_DOWN, function() {
		notificationManager.showPersistentWarningPopup("La connessione al server è stata interrotta");
	});

	$rootScope.$on(events.GATEWAY_UP, function() {
		notificationManager.clear();
		notificationManager.showSuccessPopup("Connessione al server ristabilita");
	});

	$rootScope.$on(events.SESSION_EXPIRED, function() {
		notificationManager.showWarningPopup("Sessione scaduta. Esegui di nuovo il login");
		$state.go("app.selezionaruolo");
	});
	
	$rootScope.historyBack = function() {
		window.history.back();
	};
	
	// metodi per validazione controller
	this.onInit = function() {
		logger.debug("inizializzazione di " + $scope.name);
		clearCookies();

	};
	
	this.onExit = function() {
		logger.debug("uscita da " + $scope.name);
	};

 	controllerValidator.validate(this, $scope);
}]);

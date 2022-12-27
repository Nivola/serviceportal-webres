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
angular.module('app').controller('DocumentoModificaController', [
	'$scope', '$state', '$mdToast', 'controllerValidator', 'loggers', 'conf',
	'$interval', 'DocumentiService', '$stateParams', 'notificationManager', 'DataUtils', '$timeout',
function (
	$scope, $state, $mdToast, controllerValidator, loggers, conf,
	$interval, EntityService, $stateParams, notificationManager, DataUtils, $timeout)
{
	var logger = loggers.get("ctrl-documentazione-modifica");
	var controller = this;

	$scope.scenario = $state.current.data.scenario;
	$scope[$state.current.data.scenario] = true;
	
	$scope.vm = {
	    entity : null
    };

	$scope.status = {
	    loading : true,
        loaded : false,
        failed : false
    };

	$scope.actions = {
		save : null,
		delete : null
    };

	$scope.helpers = {
    };
	
	$scope.helpers.setDirty = function() {
		$scope.form.$setDirty();
		return true;
	};

	$scope.vm.availableStatuses = [
        { code : 'DRAFT', description : 'Bozza (non visibile agli utenti)', order : 1 },
        { code : 'PUBLISHED', description : 'Pubblicato', order : 2 },
        { code : 'ARCHIVED', description : 'Archiviato (non visibile agli utenti)', order : 3 }
    ];
	
	
	$scope.actions.save = function() {
		var handler = ($state.current.data.scenario == 'MODIFICA') ? 
				EntityService.updateDocument : EntityService.createDocument;
		
		$scope.status.loading = true;
		$scope.status.loaded = false;
		
		var e = angular.copy($scope.vm.entity);
		
		if (e.document) {
			e.newDocument = e.document;
			e.document = null;
		}
		
		handler(e).then(function(data) {
			if (($state.current.data.scenario == 'MODIFICA')) {
				notificationManager.showSuccessPopup('Il documento è stato salvato');
			} else {
				notificationManager.showSuccessPopup('Il documento è stato creato');
			}
			
			window.history.back();
            $scope.status.loaded = true;
        }, function(onfail) {
        	notificationManager.showErrorPopup('Si è verificato un errore :( ');
            $scope.status.failed = true;
        }).finally(function() {
            $scope.status.loading = false;
        });
		
	};

	$scope.actions.delete = function() {

		$scope.status.loading = true;
		$scope.status.loaded = false;
		
		EntityService.deleteDocument($scope.vm.entity.id).then(function(data) {
			notificationManager.showSuccessPopup('Il documento è stato eliminato');
			window.history.back();
            $scope.status.loaded = true;
        }, function(onfail) {
        	notificationManager.showErrorPopup('Si è verificato un errore :( ');
            $scope.status.failed = true;
        }).finally(function() {
            $scope.status.loading = false;
        });
		
	};

	controller.onInit = function() {

		if ($state.current.data.scenario == 'MODIFICA') {
			if ($stateParams.entity) {
				$scope.vm.entity = $stateParams.entity;
	            $scope.status.loaded = true;
	            $scope.status.loading = false;
			} else {
				EntityService.getDocument($stateParams.idDocumento).then(function(data) {
		            $scope.vm.entity = data;
		            $scope.status.loaded = true;
		        }, function(onfail) {
		            $scope.status.failed = true;
		        }).finally(function() {
		            $scope.status.loading = false;
		        });
			}
		} else {
			$scope.vm.entity = {
				title : '',
				description : '',
				ordinal : 0,
				mediaResourceLocation : null,
				mediaResourceIdentifier : null,
				status : 'DRAFT'
			};
			
            $scope.status.loaded = true;
            $scope.status.loading = false;
		}
    };

    controller.onExit = function() {
        // nop
	};

	$scope.vm.byteSize = DataUtils.byteSize;
	// $scope.vm.openFile = DataUtils.openFile;
	
	$scope.vm.openFile = function() {
		var url = conf.location.api + "/api/document-attachment/" + $scope.vm.entity.id;
		window.location.href = url;
	};

	$scope.vm.setDocument = function ($file, pubblication) {
        if ($file) {
            DataUtils.toBase64($file, function(base64Data) {
                $scope.$apply(function() {
                    pubblication.document = base64Data;
                    pubblication.documentContentType = $file.type;
                    pubblication.documentFileName = $file.name;
                    pubblication.documentSize = $file.size;
                });
            });
        }
        
        $scope.helpers.setDirty();
    };
    
    $scope.vm.clearDocument = function(pubblication) {
    	pubblication.document = null;
        pubblication.documentContentType = null;
        pubblication.documentFileName = null;
        pubblication.documentSize = null;
        
        $scope.helpers.setDirty();
    };
    
	controllerValidator.validate(controller, $scope);

    $timeout(function (){
        angular.element('.form-group:eq(1)>input').focus();
    });

}]);

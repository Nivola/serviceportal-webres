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
nivolaApp.controller('ListJobsController',
	["$scope", "$state", "$stateParams", "$filter", "$mdDialog", "$rootScope",
		"entitiesRest", "controllerValidator", "notificationManager", 'loggers', '$translate',
		function ($scope, $state, $stateParams, $filter, $mdDialog, $rootScope,
			entitiesRest, controllerValidator, notificationManager, loggers, $translate) {
			"use strict";

			var logger = loggers.get("ListJobsController");
			var Job = entitiesRest.getEntity('Job');

			$scope.jobs = [];
			$scope.selected = [];

			// Proprietà data-table
			$scope.options = {
				rowSelection: true,
				multiSelect: false,
				autoSelect: true,
				decapitate: false,
				largeEditDialog: false,
				boundaryLinks: false,
				limitSelect: true,
				pageSelect: true
			};

			$scope.limitOptions = [ 10, 20, 30];

			$scope.filter = {
				options: {
					debounce: 500
				}
			};

			$scope.query = {
				order: "name",
				limit: 10,
				page: 1
			};

			$scope.actions = {
				auth: {
					new: $state.get("app.jobs.new").requiredUC,
					manage: $state.get("app.jobs.new").requiredUC,
					delete: $state.get("app.jobs.new").requiredUC,
					change: $state.get("app.jobs.change").requiredUC
				},

				refresh: getJobs,

				manage: function () {
					$state.go("app.jobs.manage", {
						jobId:$scope.selected[0].jobId
					});
				},

				add: function () {
					$state.go("app.jobs.new");
				},

				change: function () {
					$state.go("app.jobs.change", {

					});
				},

				delete: function (event) {
					var confirm = $mdDialog
						.confirm()
						.title("Confermi la cancellazione del job selezionato?")
						.textContent("Il job verrà cancellato definitivamente.")
						.targetEvent(event)
						.ok($translate.instant('si'))
						.cancel($translate.instant('no'));
					$mdDialog.show(confirm).then(function () {
						// DELETE
					});
				}
			};

			$scope.resetFilter = function () {
				$scope.filter.search = '';
				$scope.query.filter = '';

				if ($scope.filter.form.$dirty) {
					$scope.filter.form.$setPristine();
				}
			};

			$scope.unselectAll = function () {
				$scope.selected = [];
			};

			 function on() {
				document.getElementById("overlay").style.display = "block";
			}

			function off() {
				document.getElementById("overlay").style.display = "none";
			  }


			function getJobs() {
				//on()
                //blocca lo schermo dopo 1 secondo di attesa risposta chiamata al servizio 
				setTimeout(() => {
					if($scope.promise.$$state.status===0){
						$rootScope.loadingElement = true;
					}
				}, 1000);
                $scope.promise = Job.get().$promise;

                return $scope.promise.then(function (data) {
                    logger.info("SUCCESS", data);

					data.risultati.forEach(function (value) {
						value.region_az = value.availabilityZone ;
						
						value.stato = {
							color: value.result == 'available' ? "green" : "red",
							icon: value.result == 'available' ? "check_box" : "report"
						};
					});

					$scope.jobs = data.risultati;
                    console.log(JSON.stringify(data)); 
                       
                }, function (onfail) {
                    if (onfail.data) {
						notificationManager.showErrorPopup( "errore during jobs loading" + ': ' + onfail.data.message);
				    } else {
					    notificationManager.showErrorPopup("errore during jobs loading");
				    }
                }).finally(function() {
                    $rootScope.loadingElement = false;
					//off()
                });
            };


			this.onInit = function () {
				getJobs();
			};

			this.onExit = function () { };

			controllerValidator.validate(this, $scope);
		}
	]);

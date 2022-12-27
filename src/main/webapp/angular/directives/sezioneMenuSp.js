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
nivolaApp.directive('sezioneMenuSp', ['conf',/*'TawkToChat', */function(conf/*,TawkToChat*/) {
	return {
		templateUrl:'angular/directives/directive-sezione-menu.tpl.html',
		restrict: 'E',
		scope: { 
			dirSection: '=sezione',
			title:'@' ,
			filtro:'<filtro'
		},
		controller: ['$scope', '$state', '$mdSidenav', '$mdToast', 'AuthenticationService',  'events', 'loggers', '$translate', 'ReadthedocService',
			function ($scope, $state, $mdSidenav, $mdToast, AuthenticationService, events, loggers, $translate, ReadthedocService) {

				//var logger = loggers.get("sezioneMenuSp");

				function buildMenu(){
					if (!AuthenticationService.getUtente().abilitazioneSelezionata) {
						var toast = $mdToast.simple();
						toast.textContent("L'utente non ha abilitazioni per l'accesso all'applicazione.");
						toast.hideDelay(0);
						$mdToast.show(toast);
						return;
					}

					var clonedSection = angular.copy($scope.dirSection);
					clonedSection = $.grep(clonedSection, function(candidateSection) {
						candidateSection.options = $.grep(candidateSection.options, function(candidateOption) {
								return !candidateOption.requireUc || AuthenticationService.isGranted(candidateOption.requireUc);
						});
						return (!candidateSection.requireUc || AuthenticationService.isGranted(candidateSection.requireUc)) &&
							(candidateSection.isDirect || candidateSection.options.length > 0);
					});
					$scope.filteredSection = clonedSection;

					// fv - sezione MAIN sempre aperta
					if ($scope.title == 'MAIN') {
						$scope.filteredSection.opened = true;
					}
					$scope.isFilteredSectionVisible = $scope.filteredSection.length>0;
					
					var isActiveSession = false;

					$.each($scope.filteredSection, function(i,section) {
						section.isActive = false;
						if (section.isDirect) {
							if (section.state) {
								var n = $state.get(section.state).name;
								if ($state.current.name == n || $state.current.name.startsWith(n + ".")) {
									section.isActive = true;
									isActiveSession = true;
								}
							}
							if (!section.isActive) {
								section.opened = false;
								$.each(section.options, function(i,e) {
									e.isActive = false;
								});
							}
						} else {
							$.each(section.options, function(i,e) {
								if (e.state) {
									var n = $state.get(e.state).name;
									if ($state.current.name == n || $state.current.name.startsWith(n + ".")) {
										e.isActive = true;
										section.isActive = true;
										isActiveSession = true;
									} else {
										e.isActive = false;
									}
								}
			
								if (e.requireState) {
									var n = $state.get(e.requireState).name;
									if ($state.current.name == n || $state.current.name.startsWith(n + ".")) {
										e.inRequiredState = true;
									} else {
										e.inRequiredState = false;
									}
								}
			
								if (e.requireState) {
									e.display = e.inRequiredState || e.isActive;
								} else {
									e.display = true;
								}
							});
							if (section.isActive && !section.opened) {
								$scope.toggleMenuSection(section);
							}
						}
					});
					//logger.debug(' isActiveSession='+isActiveSession);
					$scope.isActiveSession = isActiveSession;
				}
				
				$scope.toggleMenuSection = function(section) {
					section.opened = !section.opened;
					if (section.opened) {
						$.each($scope.filteredSection, function(i,section2) {
							if (section !== section2 && !section2.fixed) {
								section2.opened = false;
							}
						});
					}
				}

				$scope.navigateTo = function(voice, event) {
					console.log("menu voice clicked", voice);
					if (voice.state) {
						$state.go(voice.state);
					} else if (voice.click && $scope[voice.click]) {
						$scope[voice.click](voice.url || '');
					}
					var nav = $mdSidenav('sidenav-left');
					if (!nav.isLockedOpen()) {
						nav.close();
					}
				};

				// fv
				$scope.clickSezione = function(section, event) {
					console.log("AAA menu section clicked", section);
					section.opened = !section.opened;
					if (section.opened) {
						$.each($scope.filteredSection, function(i,section2) {
							if (section !== section2 && !section2.fixed) {
								section2.opened = false;
							}
						});
					}
				};



				$scope.openNewWindowFromPath = function(path) {
					if (path) {
						var url = ReadthedocService.getUrlFromPath(path).docUrl;
						window.open(url, '_blank');
					}
				};

				$scope.openNewWindows = function(url) {
					if (url) {
						window.open(url,'_blank');
					}
				};

				// fv - per creare il menu solo inizialmente e al cambio di profilo
				var bstateChangeSuccess = false;
				$scope.$on("$stateChangeSuccess", function(){
					//logger.debug(' sono nella direttiva: on $stateChangeSuccess');
					if (!bstateChangeSuccess) {
						buildMenu();
					}
					bstateChangeSuccess = true;
				});

				$scope.$on(events.USER_CHANGED, function() {
					//logger.debug(' sono nella direttiva: on events.USER_CHANGED');
					buildMenu();
				});
			}
		]
	};
}]);

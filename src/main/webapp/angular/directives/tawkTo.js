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
/*
* Direttiva per utilizzare la tawk to chat per richiedere assistenza 
*/
nivolaApp.directive('tawkTo', ['$log', '$document', 'TAWKTO_ID','conf',

		function tawkToDirective($log, $document, TAWKTO_ID,conf) {
			return {
			restrict: 'E',
			scope: {
				id: '@idproprieta',
				widgetIt: '@it',
				widgetEn: '@en'
			},
			link: function (scope) {
				//var chatUrl =  conf.location.helpChat;
				var id = scope.id || TAWKTO_ID;
				if (!!id && id.length) {
					var s1 = $document[0].createElement("script"),
						s0 = $document[0].getElementsByTagName("script")[0];

					s1.async = true;
					// conf.location.helpChat

					// s1.src = 'https://embed.tawk.to/' + id + '/default'; // i18n - chat
					if (!scope.widgetIt) {
						scope.widgetIt = 'default';
					}
					if (!scope.widgetEn) {
						scope.widgetEn = 'default';
					}

					var lang = location.href.split('lang=')[1];
					if (lang == 'it') {
						s1.src='https://embed.tawk.to/' + id + '/' + scope.widgetIt;
					}
					else if (lang == 'en') {
						s1.src='https://embed.tawk.to/' + id + '/' + scope.widgetEn;
					}
					else {
						s1.src='https://embed.tawk.to/' + id + '/' + scope.widgetIt;
					}

					s1.charset = 'UTF-8';
					s1.setAttribute('crossorigin', '*');
					s0.parentNode.insertBefore(s1, s0);
				} else {
					$log.error('Missing TawkTo id.');
				}
			}
			};
		}

]);

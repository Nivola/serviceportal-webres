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
nivolaApp.service('notizieDataProviderService', ['myNewsRestClient', function(myNewsRestClient) {

		this.eventCallback = function(e, widget) {
			widget.data.news = $.grep(widget.data.news, function(candidate) {
			if (candidate.fixed) {
				candidate.survivedCleanup = true;
				return true;
			} else {
				return false;
			}
			});
		};

		this.provide = function(widget) {
			widget.data = widget.data || {};

			widget.data.loading = true;
			
			widget.callbacks = {
				onNewsClick : function(item) {
					if (item.url) {
						var win = window.open(item.url, '_blank');
						win.focus();
					}
				}
			};

			widget.data.news = [];
			myNewsRestClient.getMyMessagesUsingGET().then(function(response) {
				var dtoList = $.grep(response.data, function(candidate) {
					return true;
				});
				
				//override della funzione di sort per l'array
				dtoList.sort(function(a, b) {
				  if ( a['priorita'] > b['priorita'] ) return 1;
				  if ( a['priorita'] < b['priorita'] ) return -1;
				  if ( a['dataPubblicazioneInizio'] > b['dataPubblicazioneInizio'] ) return -1;
				  return 1;
				});
				//
				
				
				$.each(dtoList, function(i, dto) {
					var o = {
						dataPubblicazione : dto.dataPubblicazioneInizio,
						title :  dto.titolo != null ? dto.titolo.trunc(60) : null,
						content :  dto.contenuto !=null ? dto.contenuto.trunc(60) : null,
						icon : "rss_feed",
						sub: null,
						text: dto.contenuto,
						source : "rss",
						fixed : true,
						status : "OK",
						senderDescription : (dto.senderId != null ? dto.senderFirstName : null)
					};
					widget.data.news.push(o);
				});
				
				widget.data.loading = false;
				widget.data.failed = false;
			}, function() {
				widget.data.loading = false;
				widget.data.failed = true;
			});

		};

	}]);

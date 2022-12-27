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
nivolaApp.config(function ($translateProvider) {

	$translateProvider.useStaticFilesLoader({
		files: [
			{
				prefix: '../nivolaspsrv/angular/i18n/common/locale-',
				suffix: '.json'
			},
			{
				prefix: '../nivolaspsrv/angular/entities/dashboard/locale-',
				suffix: '.json'
			},
			{
				prefix: '../nivolaspsrv/angular/entities/documentazione/locale-',
				suffix: '.json'
			},
			{
				prefix: '../nivolaspsrv/angular/entities/assistenza/locale-',
				suffix: '.json'
			},
			{
				prefix: '../nivolaspsrv/angular/entities/notizie/locale-',
				suffix: '.json'
			},
			{
				prefix: '../nivolaspsrv/angular/entities/utente/locale-',
				suffix: '.json'
			},
			{
				prefix: '../nivolaspsrv/angular/entities/struttura-organizzativa/locale-',
				suffix: '.json'
			},
			{
				prefix: '../nivolaspsrv/angular/entities/listini/locale-',
				suffix: '.json'
			},
			{
				prefix: '../nivolaspsrv/angular/entities/report/locale-',
				suffix: '.json'
			},
			{
				prefix: '../nivolaspsrv/angular/entities/costiconsumi/locale-',
				suffix: '.json'
			},
			{
				prefix: '../nivolaspsrv/angular/entities/compute/vm/locale-',
				suffix: '.json'
			},
			{
				prefix: '../nivolaspsrv/angular/entities/compute/dbaas/locale-',
				suffix: '.json'
			},
			{
				prefix: '../nivolaspsrv/angular/entities/networking/locale-',
				suffix: '.json'
			},
			{
				prefix: '../nivolaspsrv/angular/entities/storage/volumi/locale-',
				suffix: '.json'
			},
			{
				prefix: '../nivolaspsrv/angular/entities/compute/volume/locale-',
				suffix: '.json'
			},
			{
				prefix: '../nivolaspsrv/angular/entities/compute/backup/locale-',
				suffix: '.json'
			}
		]

	});

	var lang = location.href.split('lang=')[1];
	if (lang) {
		$translateProvider.preferredLanguage(lang);
		console.log("set nivolaLang: " + lang);
		window.localStorage['nivolaLang'] = lang;
	} else {
		// browserStorage.getLocal()
		if (window.localStorage['nivolaLang'] != null) {
			lang = window.localStorage['nivolaLang'];
			console.log("get nivolaLang: " + lang);
			$translateProvider.preferredLanguage(lang);
		} else {
			$translateProvider.preferredLanguage('it');
		}
	}

});

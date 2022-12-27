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
nivolaApp.service('notificationManager', [ '$translate',
	function($translate) {

	this.showSuccessPopup = function(message, title) {
		toastr.success(
			message,
			title, 
			this.successPopupOptions
		);
	};

	this.showWarningPopup = function(message, title) {
		toastr.warning(
			message,
			title, 
			this.warningPopupOptions
		);
	};
	
	this.showErrorPopup = function(message, arg) {
		toastr.error(
			message + (arg && typeof arg == "string" ? "<br/> " + arg : ""),
			$translate.instant('errore'), 
			this.errorPopupOptions
		);
	};

	this.showPersistentWarningPopup = function(message, title) {
		toastr.warning(
			message,
			title, 
			this.persistentWarningPopupOptions
		);
	};
	
	this.clear = function() {
		toastr.clear();
	};
	
	this.errorPopupOptions = {
		"closeButton": false,
		"debug": false,
		"newestOnTop": false,
		"progressBar": false,
		"positionClass": "toast-top-right",
		"preventDuplicates": true,
		"onclick": null,
		"showDuration": "100",
		"hideDuration": "1000",
		"timeOut": "6000",
		"extendedTimeOut": "1500",
		"showEasing": "swing",
		"hideEasing": "linear",
		"showMethod": "fadeIn",
		"hideMethod": "fadeOut"
	};

	this.warningPopupOptions = {
		"closeButton": false,
		"debug": false,
		"newestOnTop": false,
		"progressBar": false,
		"positionClass": "toast-top-right",
		"preventDuplicates": true,
		"onclick": null,
		"showDuration": "100",
		"hideDuration": "1000",
		"timeOut": "6000",
		"extendedTimeOut": "1500",
		"showEasing": "swing",
		"hideEasing": "linear",
		"showMethod": "fadeIn",
		"hideMethod": "fadeOut"
	};

	this.successPopupOptions = {
		"closeButton": false,
		"debug": false,
		"newestOnTop": false,
		"progressBar": false,
		"positionClass": "toast-top-right",
		"preventDuplicates": true,
		"onclick": null,
		"showDuration": "100",
		"hideDuration": "1000",
		"timeOut": "5000",
		"extendedTimeOut": "1000",
		"showEasing": "swing",
		"hideEasing": "linear",
		"showMethod": "fadeIn",
		"hideMethod": "fadeOut"
	};

	this.persistentWarningPopupOptions = {
		"closeButton": false,
		"debug": false,
		"newestOnTop": false,
		"progressBar": false,
		"positionClass": "toast-top-right",
		"preventDuplicates": true,
		"onclick": null,
		"showDuration": "100",
		"hideDuration": "1000",
		"timeOut": "9999999",
		"extendedTimeOut": "9999999",
		"showEasing": "swing",
		"hideEasing": "linear",
		"showMethod": "fadeIn",
		"hideMethod": "fadeOut"
	};

}
]);

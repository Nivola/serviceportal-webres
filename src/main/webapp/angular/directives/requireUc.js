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
	* usage : 
	* 		require-uc="1,2" 
	* 		require-uc-fail-class="not-allowed"	[optional, default="not-allowed"] 
	* 		require-uc-grant-class="uc-allowed" [optional, default="uc-allowed"]
	* ...
	* .not-allowed {
	*		display: none;
	*	}
	* 
	*/
nivolaApp.directive('requireUc', ['AuthenticationService', 'conf', function(serviceUtente, conf) {
	return {
		restrict: 'A',
		scope: { 
		},
		link: function (scope, elem, attrs, ctrl) {
			if (!conf.enableUCViewRestriction) {
				return;
			}
			
			if(serviceUtente.isGranted(attrs.requireUc)) {
				//elem.removeClass(attrs.requireUcFailClass || "not-allowed");
				elem.addClass(attrs.requireUcGrantClass || "uc-allowed");
				elem.data("ucNotAllowed", false);
				elem.data("ucAllowed", true);
			} else {
				angular.element(elem).remove();
				// elem.addClass(attrs.requireUcFailClass || "not-allowed");
				// elem.removeClass(attrs.requireUcGrantClass || "uc-allowed");
				// elem.data("ucNotAllowed", true);
				// elem.data("ucAllowed", false);
			}
		}
	};
}]);

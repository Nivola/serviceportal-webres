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
nivolaApp.service('controllerValidator', ['loggers', function(loggers) {
	
	var logger = loggers.get("controller-validator");
	
	this.validate = function(o, $scope) {
		logger.trace("running controller validation on '" + o.name + "'");
		var errors = 0;
		
		if (!o.onInit) {
			logger.warn("missing method onInit");
		}
		else {
			o.onInit();
		}

		if (!$scope.$$listenerCount["$destroy"]) {
			if (!o.onExit) {
				logger.error("missing method onExit. You must either define onExit or implement a $destroy listener");
				errors ++;
			}
			else {
				$scope.$on(
					"$destroy",
					function( event ) {
						o.onExit();
					}
				);
			}
		}
		else {
			logger.trace("controller has own destruction method. skipping onExit registration");
		}

		if (errors == 0) {
			logger.trace("controller validation passed");
			return true;
		}
		else {
			logger.error("controller validation failed with " + errors + " errors");
			return false;
		}

	};
	
}]);

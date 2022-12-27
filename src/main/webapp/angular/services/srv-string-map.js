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
angular.module('app').factory('StringMap', [
	'Strings',
	function (
		Strings
	) {

		function StringMap(string) {
			var translation = Strings[string];

			return translation ? translation : string;
		}

		return StringMap;
	}]);

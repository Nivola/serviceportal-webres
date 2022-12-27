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
nivolaApp
	.filter('trustedUrl', ['$sce', function ($sce) {
		return function (url) {
			return $sce.trustAsResourceUrl(url);
		};
	}])

	.filter('trust', ['$sce', function ($sce) {
		return function (value, type) {
			return $sce.trustAs(type || 'html', value);
		};
	}])

	.filter('populate', ['$sce', function ($sce) {
		return function (input, p1, p2) {
			input = input || '';
			if (p1 !== undefined) input = input.replace(new RegExp('\\$1', 'g'), p1);
			if (p2 !== undefined) input = input.replace(new RegExp('\\$2', 'g'), p2);
			return $sce.trustAs('html', input);
		};
	}])

	.filter('filesize', function () {
		return function (bytes) {
			if (!bytes) return "0 B";
			var thresh = 1024;
			if (Math.abs(bytes) < thresh) {
				return bytes + ' B';
			}
			var units = ['kB', 'MB', 'GB', 'TB', 'PB', 'EB'];
			var u = -1;
			do {
				bytes /= thresh;
				++u;
			} while (Math.abs(bytes) >= thresh && u < units.length - 1);
			return bytes.toFixed(1) + ' ' + units[u];
		}
	})

	.filter('secondsToTimeString', function () {
		return function (seconds) {
			var days = Math.floor(seconds / 86400);
			var hours = Math.floor((seconds % 86400) / 3600);
			var minutes = Math.floor(((seconds % 86400) % 3600) / 60);
			var timeString = '';
			if (days > 0) timeString += (days > 1) ? (days + " days ") : (days + " day ");
			if (hours > 0) timeString += (hours > 1) ? (hours + " hours ") : (hours + " hour ");
			if (minutes >= 0) timeString += (minutes > 1) ? (minutes + " minutes ") : (minutes + " minute ");
			return timeString;
		}
	})

	.filter('shortTimeString', function () {
		return function (time) {
			var mesi = Math.floor(time / 2592000.0);
			time = time - mesi * 2592000;
			var giorni = Math.floor(time / 86400.0);
			time = time - giorni * 86400;
			var ore = Math.floor(time / 3600.0);
			time = time - ore * 3600;
			var min = Math.floor(time / 60.0);
			time = time - min * 60;
			var sec = time;

			if (ore < 10) ore = "0" + ore;
			if (min < 10) min = "0" + min;
			if (sec < 10) sec = "0" + sec;

			var s = "";
			if (mesi > 0) s += mesi + " m,";
			if (giorni > 0) s += giorni + " gg,";
			s += ore + ":" + min + ":" + sec;

			return s;
		}
	})

	.filter('orderObjectBy', function () {
		return function (input, attribute) {
			if (!angular.isObject(input)) return input;

			var array = [];
			for (var objectKey in input) {
				array.push(input[objectKey]);
			}

			array.sort(function (a, b) {
				a = parseInt(a[attribute]);
				b = parseInt(b[attribute]);
				return a - b;
			});
			return array;
		}
	})

	.filter('propsFilter', function () {
		return function (items, props) {
			var out = [];

			if (angular.isArray(items)) {
				items.forEach(function (item) {
					var itemMatches = false;

					var keys = Object.keys(props);
					for (var i = 0; i < keys.length; i++) {
						var prop = keys[i];
						var text = props[prop].toLowerCase();
						if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
							itemMatches = true;
							break;
						}
					}

					if (itemMatches) {
						out.push(item);
					}
				});
			} else {
				// Let the output be the input untouched
				out = items;
			}

			return out;
		};
	})

	.filter('range', function () {
		return function (list, total) {
			total = parseInt(total, 10);

			for (var i = 0; i < total; i++) {
				list.push(i);
			}

			return list;
		};
	})

	.filter('comma2decimal', [
		function () { // should be altered to suit your needs
			return function (input) {
				var ret = (input) ? input.toString().trim().replace(",", ".") : null;
				return parseFloat(ret);
			};
		}])

	.filter('decimal2comma', [
		function () {// should be altered to suit your needs
			return function (input) {
				var ret = (input) ? input.toString().replace(".", ",") : null;
				if (ret) {
					var decArr = ret.split(",");
					if (decArr.length > 1) {
						var dec = decArr[1].length;
						if (dec === 1) { ret += "0"; }
					}//this is to show prices like 12,20 and not 12,2
				}
				return ret;
			};
		}])
		
		.filter('unsafe',[ '$sce',function($sce) { return $sce.trustAsHtml; }])
		
		.filter('trustHtml', ['$sce',
			function($sce) {
				return function(value) {
					return $sce.trustAs('html', value);
				}
			}
		])
		
		.filter('fillIfNull', [
			function ($sce) {
			  return function (value, param) {
				var finalValue=null;
				switch (param) {
					case 'number':
						finalValue = (!value || value === 0) ? '0' : value;
					break;
					case 'string':
						finalValue=(!value || value === '') ? '/' : value;
					break;
					case 'date':
						finalValue=(!value || value === '') ? '-/-/-' : value;
					break;
					case 'time':
						finalValue=(!value || value === '') ? '--:--' : value;
					break;
					default:
						finalValue=!value || value === '' ? '/' : value;
					break;
				}
				return finalValue;
			  };
			}
		])
		.filter('capitalize', [function () {
			  return function (value) {
				return value.replace(value[0], value[0].toUpperCase())
			  };
			}
		])
		.filter('reverse', [function () {
			  return function (value) {
				var reverseArrayFromString = value.split("-").reverse(); 
				return reverseArrayFromString.join("-");
			  };
			}
		]);

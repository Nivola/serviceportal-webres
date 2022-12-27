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
nivolaApp.service('browserStorage', ['loggers', 'conf', function(loggers, conf) {
	var logger = loggers.get("storage");
	var keyPrefix = conf.codeName + "_";
	
	function buildStorageProvider(handler) {
		return {
			
			available : storageAvailable(handler),
			handler : window[handler],
	
			getBucket : function(key, defaultValueProvider) {
				var _t = this;
				return {
					get : function(defaultValue) {
						if (defaultValue === undefined && defaultValueProvider) {
							if (typeof defaultValueProvider == "function") {
								defaultValue = defaultValueProvider();
							} else {
								defaultValue = defaultValueProvider;
							}
						}
						return _t.get(key, defaultValue);
					},
					set : function(value) {
						return _t.set(key, value);
					},
					remove : function() {
						return _t.remove(key);
					}
				};
			},
	
			set : function(key, value) {
				if (logger.isTraceEnabled()) {
					logger.trace("browserStorage." + handler + " : setting " + key, value);
				}
				this.handler.setItem(keyPrefix + key, JSON.stringify(value));
			},
			
			get : function(key, defaultValue) {
				if (this.handler[keyPrefix + key] === undefined) {
					if (logger.isTraceEnabled()) {
						logger.trace("browserStorage." + handler + " : getting " + key, "not found, returning default");
					}
					return defaultValue;
				}
				var v = this.handler.getItem(keyPrefix + key, defaultValue);
				v = JSON.parse(v);
				
				if (logger.isTraceEnabled()) {
					logger.trace("browserStorage." + handler + " : getting " + key, v);
				}
				return v;
			},
			
			remove : function(key) {
				if (logger.isTraceEnabled()) {
					logger.trace("browserStorage." + handler + " : removing " + key);
				}
				this.handler.removeItem(keyPrefix + key);
			},
			
			clear : function() {
				if (logger.isTraceEnabled()) {
					logger.trace("browserStorage." + handler + " : clearing");
				}
				this.handler.clear();
			}
		};
	}

	function storageAvailable(type) {
		try {
			var storage = window[type], 
				x = '__storage_test__';
			storage.setItem(x, x);
			storage.removeItem(x);
			return true;
		}
		catch(e) {
			return false;
		}
	}


	this.local = buildStorageProvider("localStorage");
	this.session = buildStorageProvider("sessionStorage");

	this.getLocal = function() {
		return this.local;
	}
	
	this.getSession = function() {
		return this.session;
	}
	
	logger.trace("browserStorage.local disponibile : ", this.local.available);
	logger.trace("browserStorage.session disponibile : ", this.session.available);
}]);




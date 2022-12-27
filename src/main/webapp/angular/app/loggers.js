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
nivolaApp.service('loggers', ['conf', function(conf) {

	var lp = conf.loggerLevel;

	function Logger(name, level) {
		this.name = name;
		this.level = level;
	}
	Logger.prototype.constructor = Logger;
	Logger.prototype.trace = function (message, arg) { return this._log(lp.LEVEL_TRACE, message, arg); };
	Logger.prototype.debug = function (message, arg) { return this._log(lp.LEVEL_DEBUG, message, arg); };
	Logger.prototype.info = function (message, arg) { return this._log(lp.LEVEL_INFO, message, arg); };
	Logger.prototype.warn = function (message, arg) { return this._log(lp.LEVEL_WARNING, message, arg); };
	Logger.prototype.error = function (message, arg) { return this._log(lp.LEVEL_ERROR, message, arg); };
	Logger.prototype.critical = function (message, arg) { return this._log(lp.LEVEL_CRITICAL, message, arg); };

	Logger.prototype.groupTrace = function (message, arg) { return this._group(lp.LEVEL_TRACE, message, false, arg); };
	Logger.prototype.groupDebug = function (message, arg) { return this._group(lp.LEVEL_DEBUG, message, false, arg); };
	Logger.prototype.groupInfo = function (message, arg) { return this._group(lp.LEVEL_INFO, message, false, arg); };
	Logger.prototype.groupWarn = function (message, arg) { return this._group(lp.LEVEL_WARNING, message, false, arg); };
	Logger.prototype.groupError = function (message, arg) { return this._group(lp.LEVEL_ERROR, message, false, arg); };
	Logger.prototype.groupCritical = function (message, arg) { return this._group(lp.LEVEL_CRITICAL, message, false, arg); };

	Logger.prototype.groupCollapsedTrace = function (message, arg) { return this._group(lp.LEVEL_TRACE, message, true, arg); };
	Logger.prototype.groupCollapsedDebug = function (message, arg) { return this._group(lp.LEVEL_DEBUG, message, true, arg); };
	Logger.prototype.groupCollapsedInfo = function (message, arg) { return this._group(lp.LEVEL_INFO, message, true, arg); };
	Logger.prototype.groupCollapsedWarn = function (message, arg) { return this._group(lp.LEVEL_WARNING, message, true, arg); };
	Logger.prototype.groupCollapsedError = function (message, arg) { return this._group(lp.LEVEL_ERROR, message, true, arg); };
	Logger.prototype.groupCollapsedCritical = function (message, arg) { return this._group(lp.LEVEL_CRITICAL, message, true, arg); };

	Logger.prototype.groupEndTrace = function (message, arg) { return this._groupEnd(lp.LEVEL_TRACE); };
	Logger.prototype.groupEndDebug = function (message, arg) { return this._groupEnd(lp.LEVEL_DEBUG); };
	Logger.prototype.groupEndInfo = function (message, arg) { return this._groupEnd(lp.LEVEL_INFO); };
	Logger.prototype.groupEndWarn = function (message, arg) { return this._groupEnd(lp.LEVEL_WARNING); };
	Logger.prototype.groupEndError = function (message, arg) { return this._groupEnd(lp.LEVEL_ERROR); };
	Logger.prototype.groupEndCritical = function (message, arg) { return this._groupEnd(lp.LEVEL_CRITICAL); };

	Logger.prototype.isTraceEnabled = function (message, arg) { return this._isEnabled(lp.LEVEL_TRACE); };
	Logger.prototype.isDebugEnabled = function (message, arg) { return this._isEnabled(lp.LEVEL_DEBUG); };
	Logger.prototype.isInfoEnabled = function (message, arg) { return this._isEnabled(lp.LEVEL_INFO); };
	Logger.prototype.isWarnEnabled = function (message, arg) { return this._isEnabled(lp.LEVEL_WARNING); };
	Logger.prototype.isErrorEnabled = function (message, arg) { return this._isEnabled(lp.LEVEL_ERROR); };
	Logger.prototype.isCriticalEnabled = function (message, arg) { return this._isEnabled(lp.LEVEL_CRITICAL); };

	Logger.prototype.assert = function (condition, message) {
		if (!condition) {
			message = "Assertion failed : " + message;
			this.error(message);
			if (typeof Error !== "undefined") {
				throw new Error(message);
			}
			throw message;
		}
	};

	Logger.prototype._isEnabled = function (level) {
		return level.priority >= this.level.priority;
	};

	Logger.prototype._formatMessage = function (level, message) {
		if (typeof message == "string") {
			return "[ " + this.name + " " + level.code + "] " + this._getTimeStr() + "\n" + message;
		}
		return message;
	};

	Logger.prototype._log = function (level, message, arg) {
		if (!this._isEnabled(level)) {
			return;
		}

		message = this._formatMessage(level, message);
		if (arg !== undefined) {
			try {
				level.printFunction(message, arg);
			} catch (err) {
				console.log(message, arg);
			}
		} else {
			try {
				level.printFunction(message);
			} catch (err) {
				console.log(message);
			}
		}
	};

	Logger.prototype._group = function (level, message, collapsed, arg) {
		if (!this._isEnabled(level)) {
			return;
		}
		message = this._formatMessage(level, message);
		if (!collapsed) {
			if (arg === undefined) {
				console.group(message);
			} else {
				console.group(message, arg);
			}
		} else {
			if (arg === undefined) {
				console.groupCollapsed(message);
			} else {
				console.groupCollapsed(message, arg);
			}
		}
	};

	Logger.prototype._groupEnd = function (level) {
		if (!this._isEnabled(level)) {
			return;
		}
		console.groupEnd();
	};

	Logger.prototype._getTimeStr = function () {
		var d = new Date();
		return "".concat(d.getHours().toString().padStart(2,"0"),
			":", d.getMinutes().toString().padStart(2,"0"), 
			":", d.getSeconds().toString().padStart(2,"0"), 
			".", d.getMilliseconds().toString().padStart(3,"0"));
	};

	
	function getLogger(name) {
		var levelNameProp = "logger." + conf.loggerRootName + ((name)? "." + name : "") + ".level";
		var level = conf[levelNameProp];
		if (!level) {
			console.warn("livello di verbosity per il logger ", name, " non configurato (", levelNameProp, ").");
			return;
		}
		return new Logger(name, level);
	};

	var rootLogger = getLogger();
	var loggerList = {};
	
	this.get = function(key) {
		if (!key) {
			return rootLogger;
		}

		var logger = loggerList[key];
		if (logger) {
			return logger;
		}
		
		// console.info("creating on-demand logger " + key);
		logger = getLogger(key);

		if (logger) {
			loggerList[key] = logger;
			return logger;
		}

		return rootLogger;
	};
}]);
		
	
	


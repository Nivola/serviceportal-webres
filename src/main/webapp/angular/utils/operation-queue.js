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
nivolaApp.service('operationQueue', ['$rootScope', 'loggers', function($rootScope, loggers) {

	var _this = this;
	
	var logger = loggers.get("operation-queue");

	/* Absolutely call this within initial onetime configuration 
		*/
	_this.bindAngular = function(app) {
		_this._bindAngular($rootScope);
	};

	/* get filtered list of pending operations for selected operation 
		* - wrapped as method in operation returned from .register(...);
		*/
	_this.pending = function(registeredCfg) {
		return _this._pending(registeredCfg);
	};

	/* return true if at least one task of the specified operation(/s, array supported)
		* is waiting or pending  
		*/
	_this.anyPending = function(registeredCfg) {
		return _this._anyPending(registeredCfg); 
	};

	/* return true if at least one task of the specified operation(/s, array supported)
		* is waiting or pending and started more than a certain time ago
		*/
	_this.anyPendingForAtLeast = function(time, registeredCfg) {
		return _this._anyPendingForAtLeast(time, registeredCfg); 
	};

	/* spawn a new task as child of the specified operation.
		* p: override operation configuration (name, description, ...)
		* - wrapped as method in operation returned from .register(...);
		*/
	_this.spawn = function(registeredWrap, p) {
		return _this._spawn(registeredWrap, p);
	};

	/* return internal task queue
		*/
	_this.getQueue = function() {
		return _this._getQueue();
	};

	/* remove from queue target task or all tasks binded to the operation
		* o: task or operation
		*/
	_this.remove = function(o) {
		return _this._remove(o);
	};
	
	/* remove from queue every not-pending tasks
		*/
	_this.clean = function(o) {
		return _this._clean(o);
	};
	
	/* register an operation.
		* returns an "operation" object you can use to spawn tasks
		* structure of "operation" object:
			configuration : registeredOperation configuration,
			configurationIdentifier : registeredOperation identifier,
			identifier : task id,
			classId : operationQueue._CLASS_OPERATION,
			name : registeredOperation configuration name,
			description : registeredOperation configuration description,
			iconClass : registeredOperation configuration iconClass,
			
			status : operationQueue.STATUS_WAITING,
			result : operationQueue.RESULT_NONE,
			resultData : null,
			valid : true,
			progress : 0,
			
			waiting: true,
			finished : false,
			success : null,
			failed : false,
			running : false,
			
			setProgress : function(progress)
			start : function(rd)
			finish : function(rd)
			fail : function(rd)
			abort : function(rd)
			invalidate : function(reason)
			remove : function()
			autoremove : function()
			wrap : function(promise, sCallback, eCallback, fCallback)
		*/
	_this.register = function(declaration) {
		return _this._register(declaration);
	};
	
	/* Bind status of pending operations (or custom function) 
		* to in-scope angular-watched static values
		* 
		* scope: angular $scope
		* target : target object (e.g. $scope, $scope.status, ...)
		* targetPropertyName : string or array. 
		* 		values starting with ? will be booleanized
		* 		values starting with ! will be booleanized and inverted
		* watchList : operation or array of operations to watch 
		* 		OR function to directly evaluate ( like watchList(scope); )
		* callback : callback on value change
		*/
	_this.watch = function(scope, target, targetPropertyName, watchList, callback) {
		return _this._watch(scope, target, targetPropertyName, watchList);
	};

	/* 
		* *** HIC SUNT LEONES ***
		*/
	_this._bindAngular = function(rootScope) {
		_this._rootScope = rootScope;
	};
	
	_this._watch = function(scope, target, targetPropertyName, watchList, callback) {
		scope.$watch(function() {
			if (typeof watchList == "function") {
				return watchList(scope);
			}
			else {
				return _this.anyPending(watchList);
			}

		}, function(newValue, oldValue) {
			if ($.isArray(targetPropertyName)) {
				$.each(targetPropertyName, function(i,e) {
					_this._applyWatch(target, e, newValue);
				});
			}
			else {
				_this._applyWatch(target, targetPropertyName, newValue);
			}
			
			if (callback) {
				callback(newValue, oldValue);
			}
		});
	};
	
	_this._applyWatch = function(target, targetPropertyName, newValue) {
		if (targetPropertyName[0] == "?") {
			newValue = newValue ? true : false;
			targetPropertyName = targetPropertyName.substring(1);
		}
		else if (targetPropertyName[0] == "!") {
			newValue = newValue ? false : true;
			targetPropertyName = targetPropertyName.substring(1);
		}
		
		target[targetPropertyName] = newValue;
	};

	_this._pending = function(registeredCfg) {
		var result = [];
		
		$.each(_this._spawnedQueue, function(index, spawned){
			if (spawned.configurationIdentifier == registeredCfg.identifier) {
				if (spawned.onPendingCheck) spawned.onPendingCheck();
				if (!spawned.valid) return;
				if (spawned.running || spawned.waiting) {
					result.push(spawned);
				} 
			}
		});
		
		return result;
	};
	
	_this._anyPending = function(registeredCfg) {
		return _this._anyPendingMatching(registeredCfg, function(spawned){
			return true;
		});
	};
	
	_this._anyPendingForAtLeast = function(time, registeredCfg) {
		return _this._anyPendingMatching(registeredCfg, function(spawned){
			return spawned.running && (((new Date()) - spawned.startTime) >= time);
		});
	};

	_this._anyPendingMatching = function(registeredCfg, evaluator) {
		var result = false;
		
		if ($.isArray(registeredCfg)) {
			$.each(registeredCfg, function(i,e) {
				var r = _this._anyPendingMatching(e, evaluator);
				if (r) {
					result = true;
					return false;
				}
			});
			
			return result;
		}

		$.each(_this._spawnedQueue, function(index, spawned){
			if ((registeredCfg === null || registeredCfg === undefined) ||
					spawned.configurationIdentifier == registeredCfg.identifier) {
				if (spawned.onPendingCheck) spawned.onPendingCheck();
				if (!spawned.valid) return;
				
				if (spawned.configuration.countAsPending === false) {
					return;
				}
				
				if (spawned.running || spawned.waiting) {
					if (evaluator(spawned)) {
						result = true;
						return false;
					}
				} 
			}
		});
		
		return result;
	};

	_this._spawn = function(registeredWrap, p) {
		var id = _this._buildSpawnIdentifier(registeredWrap);
		
		if (p === undefined) p = {};
		else {
			if (typeof p == "string") {
				p = {name : p};
			}
		}
		if (p.name === undefined && registeredWrap.c.name !== undefined) {
			p.name = registeredWrap.c.name;
		}
		if (p.description === undefined && registeredWrap.c.description !== undefined) {
			p.description = registeredWrap.c.description;
		}
		if (p.iconClass === undefined && registeredWrap.c.iconClass !== undefined) {
			p.iconClass = registeredWrap.c.iconClass;
		}
		
		var spawned = {
			configuration : registeredWrap.c,
			configurationIdentifier : registeredWrap.identifier,
			identifier : id,
			classId : _this._CLASS_OPERATION,
			name : p.name,
			description : p.description,
			iconClass : p.iconClass,
			
			status : _this.STATUS_WAITING,
			result : _this.RESULT_NONE,
			resultData : null,
			valid : true,
			waiting: true,
			finished : false,
			success : null,
			failed : false,
			running : false,
			progress : 0,
			
			setProgress : function(progress) {
				this.progress = progress;
			},
			
			start : function(rd) {
				this.waiting = false;
				this.status = _this.STATUS_RUNNING;
				this.running = true;
				this.startTime = new Date();
				if (rd != undefined) this.resultData = rd;
			},
			finish : function(rd) {
				this.waiting = false;
				this.status = _this.STATUS_FINISHED;
				this.result = _this.RESULT_SUCCESS;
				this.running = false;
				this.finished = true;
				this.success = true;
				this.progress = 100;
				this.finishTime = new Date();
				if (rd != undefined) this.resultData = rd;
				if (this.configuration.autoRemove) {
					this.autoremove();
				}
			},
			fail : function(rd) {
				this.failed = true;
				this.waiting = false;
				this.status = _this.STATUS_FINISHED;
				this.result = _this.RESULT_FAILED;
				this.running = false;
				this.finished = true;
				this.success = false;
				if (rd != undefined) this.resultData = rd;
				if (this.configuration.autoRemove) {
					this.autoremove();
				}
			},
			abort : function(rd) {
				this.waiting = false;
				this.status = _this.STATUS_FINISHED;
				this.result = _this.RESULT_ABORT;
				this.running = false;
				this.finished = true;
				this.success = null;
				if (rd != undefined) this.resultData = rd;
				if (this.configuration.autoRemove) {
					this.autoremove();
				}
			},
			invalidate : function(reason) {
				this.invalidateReason = reason;
				this.valid = false;
			},
			remove : function() {
				var oThis = this;
				$.each(_this._spawnedQueue, function(i,e){
					if(e.identifier === oThis.identifier) {
						_this._spawnedQueue.splice(i,1);
						return false;
					}
				});
			},
			autoremove : function() {
				var autoRemoveTarget = this;
				setTimeout(function() {
					autoRemoveTarget.invalidate(_this._INVALIDATE_REASON_AUTOREMOVE);
					autoRemoveTarget.remove();
					if (_this._rootScope) {
						_this._rootScope.$digest();
					}
				}, this.configuration.autoRemoveDelay);
			},
			wrap : function(promise, sCallback, eCallback, fCallback) {
				this.start();
				
				if (!(this.configuration.log === false)) {
					logger.groupCollapsedDebug("[operation] " + this.name + " starting ...");
					logger.debug(this);
					logger.groupEndDebug();
				}
								
				if (typeof promise == "function") {
					promise = promise();
				}
				
				var origInstance = this;
				
				promise.then(function(data) {
					
					if (!(origInstance.configuration.log === false)) {
						logger.groupCollapsedDebug("[operation] " + origInstance.name + " ended succesfully");
						logger.debug(origInstance);
						logger.debug(data);
						logger.groupEndDebug();
						
					}
					
					if (sCallback) sCallback(data);
					if (fCallback) fCallback(true, data);
					origInstance.finish(data);
				},
				function(e) {
					if (!(origInstance.configuration.log === false)) {
						logger.groupCollapsedError("[operation] " + origInstance.name + " ended with error");
						logger.error("error dump", e);
						logger.groupEndError();
					}
					
					if (eCallback) eCallback(e);
					if (fCallback) fCallback(false, e);
					origInstance.fail(e);
				});
				
				return promise;
			},
			
			onPendingCheck : null
		};
		
		_this._spawnedQueue.push(spawned);
		
		return spawned;
	};
	
	_this._getQueue = function() {
		return _this._spawnedQueue;
	};

	_this._remove = function(o) {
		if (o.classId == _this._CLASS_OPERATION) {
			o.invalidate(_this._INVALIDATE_REASON_REMOVE_EXT);
			o.remove();
		}
		else if (o.classId == _this._CLASS_CONFIG) {
			$.each(_this._spawnedQueue, function(index, spawned){
				if (spawned.configurationIdentifier == o.identifier) {
					spawned.invalidate(_this._INVALIDATE_REASON_REMOVE_EXT);
					spawned.remove();					
				}
			});
		}
		else {
			logger.error("invalid operationQueue.remove argument", o);
		}
	};

	_this._clean = function(o) {
		$.each(_this._spawnedQueue, function(index, spawned){
			if (spawned.finished) {
				spawned.invalidate(_this._INVALIDATE_REASON_CLEANUP);
				spawned.remove();					
			}
		});
	};

	_this._register = function(declaration) {
		if (typeof declaration == "string") {
			declaration = {name : declaration};
		}
		var identifier = _this._buildIdentifier(declaration);
		var wrapped = _this._wrapDeclaration(declaration, identifier);
		_this._registeredCache[identifier] = wrapped;
		return wrapped;
	};

	_this._wrapDeclaration = function(declaration, identifier) {
		if (declaration === undefined) declaration = {};
		
		if (declaration.name === undefined) 
			declaration.name = "Operation " + identifier;
		if (declaration.description === undefined) 
			declaration.description = null;
		if (declaration.autoRemove === undefined) 
			declaration.autoRemove = true;
		if (declaration.autoRemoveDelay === undefined) 
			declaration.autoRemoveDelay = 3000;
		if (declaration.iconClass === undefined)
			declaration.iconClass = "refresh";
		
		var wrapped = {
			'c' : declaration,
			'identifier' : identifier,
			'classId' : _this._CLASS_CONFIG
		};
		
		wrapped.spawn = function(p) {
			return _this.spawn(wrapped, p);
		};
		wrapped.pending = function() {
			return _this.pending(wrapped);
		};
		wrapped.start = function(p, rd) {
			var o = _this.spawn(wrapped, p);
			o.start(rd);
			return o;
		};
		
		wrapped.wrap = function(promise, sCallback, eCallback, fCallback) {
			var o = _this.spawn(wrapped);
			return o.wrap(promise, sCallback, eCallback, fCallback);
		};
		wrapped.wrapConfigure = function(config, promise, sCallback, eCallback, fCallback) {
			var o = _this.spawn(wrapped, config);
			return o.wrap(promise, sCallback, eCallback, fCallback);
		};
		
		return wrapped;
	};

	_this._buildIdentifier = function(declaration) {
		var r = "C" + (++_this._registerIdCounter);
		r += "." + Date.now();
		r += "." + ("R"+Math.random()).substring(6);
		return r;
	};

	_this._buildSpawnIdentifier = function(wrap) {
		var r = "S" + (++_this._registerIdCounter);
		r += "." + Date.now();
		r += "." + ("R"+Math.random()).substring(6);
		r += "." + wrap.identifier;
		return r;
	};

	_this._rootScope = null;
	_this._registeredCache = {};
	_this._registerIdCounter = 0;
	_this._spawnedQueue = [];
	_this._CLASS_CONFIG = "operationConfiguration";
	_this._CLASS_OPERATION = "spawnedOperationInstance";
	_this._INVALIDATE_REASON_REMOVE_EXT = 1;
	_this._INVALIDATE_REASON_CLEANUP = 2;
	_this._INVALIDATE_REASON_AUTOREMOVE = 3;

	_this.STATUS_WAITING = 1;
	_this.STATUS_RUNNING = 2;
	_this.STATUS_FINISHED = 10;

	_this.RESULT_SUCCESS = 1;
	_this.RESULT_NONE = null;
	_this.RESULT_FAILED = -1;
	_this.RESULT_ABORT = -2;
}]);

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

// function registerEntityTransformer(app) {

// 	var ___instanceHolder = {
// 		instance : null
// 	};
	
// 	app.service('entityTransformer', ['loggers', function(loggers) {

// 		___instanceHolder.instance = ___buildEntityTransformer(app, loggers);
		
// 		this.___instance = ___instanceHolder.instance;
		
// 		this.getInstance = function() {
// 			return this.___instance;
// 		}
		
// 	}]);
	
// 	app.config(['$httpProvider', function($httpProvider) {
// 		$httpProvider.interceptors.push(['$q', function($q) {
// 			return {
// 				'response' : function(response) {
// 					var newResponseData = ___instanceHolder.instance.processEntity(response.data);
// 					response.data = newResponseData;
// 					return response;
// 				}
// 			};
// 		}]);
// 	}]);
// }

// function ___buildEntityTransformer(app, loggers) {
	
// 	var logger = loggers.get("entitytransformer");
	
// 	var entityTransformer = {
		
// 		processEntity : function(raw) {
// 			return this.___processEntity(raw);
// 		},
		
// 		registerEntityProcessor : function(entity, processor) {
// 			return this.___registerEntityProcessor(entity, processor); 
// 		},
		
// 		registerMatchingEntityProcessor : function(entityMatcher, processor) {
// 			return this.___registerMatchingEntityProcessor(entityMatcher, processor); 
// 		},
	
// 		/* HIC SUNT LEONES */
// 		___registerEntityProcessor : function(entity, processor) {
// 			entity = this.___cleanName(entity);
// 			if (undefined === this.___registeredEntityConverters[entity]) {
// 				this.___registeredEntityConverters[entity] = [];
// 			}
// 			this.___registeredEntityConverters[entity].push(processor);
// 		},
		
// 		___registerMatchingEntityProcessor : function(entityMatcher, processor) {
// 			if (typeof entityMatcher != "function") {
// 				if (undefined === this.___registeredMatchingEntityConverters[entityMatcher]) {
// 					this.___registeredMatchingEntityConverters[entityMatcher] = [];
// 				}
// 				this.___registeredMatchingEntityConverters[entityMatcher].push(processor);
// 			}
// 			else {
// 				this.___registeredMatchingFunctionEntityConverters.push({
// 					matcher : entityMatcher,
// 					processor : processor
// 				});
// 			}
// 			this.___registeredMatchingEntityConvertersCachedMatches = {};
// 		},
		
// 		___processEntity : function(raw) {
// 			if (raw === null || raw === undefined) return raw;
			
// 			var thisOrig = this;
			
// 			if (typeof raw == "object") {
// 				if ($.isArray(raw)) {
// 					$.each(raw, function(propIndex, propValue) {
// 						raw[propIndex] = thisOrig.___processEntity(propValue);
// 					});
// 				}
// 				else {
// 					$.each(raw, function(propKey, propValue) {
// 						raw[propKey] = thisOrig.___processEntity(propValue);
// 					});
					
// 					if (raw.entity !== null && raw.entity !== undefined && raw.entity !== "") {
// 						var converters = this.___getRegisteredEntityConverters(raw.entity);
						
// 						if (converters != null) {
// 							logger.trace("found " + (converters ? converters.length : "no") + " total processors for " + raw.entity);
							
// 							$.each(converters, function(i, converter){
// 								var converterResult = converter(raw);
// 								if (converterResult === undefined || converterResult === null || (typeof converterResult != "object")) {
// 									converterResult = raw;
// 								}
// 								raw = converterResult;
// 							});
// 						}
// 					}
// 				}
				
// 				return raw;
// 			}
// 			else {
// 				return raw;
// 			}
// 		},
		
// 		___cleanName : function(raw) {
// 			return raw;
// //			if (!raw) return raw;
// //			return raw.replace(/\./g, '_');
// 		},
		
// 		___getRegisteredEntityConverters : function(entityList) {
// 			var output = [];
// 			$.each(entityList, function(i, entity) {
				
// 				entity = entityTransformer.___cleanName(entity);
				
// 				var reg = entityTransformer.___registeredEntityConverters[entity];
// 				if (undefined === reg || null === reg || reg.length < 1) reg = [];
				
// 				// look for this.___registeredMatchingEntityConvertersCachedMatches if valid
// 				var regexMatches = entityTransformer._____getMatchingRegisteredEntityConverters(entity);
// 				if (regexMatches !== null && regexMatches.length > 0) {
// 					$.each(regexMatches, function(newMatchI, newMatchConv) {
// 						reg.push(newMatchConv);
// 					});
// 				}
				
// 				if (reg.length > 0) {
// 					$.each(reg, function(i2, e2) {
// 						output.push(e2);
// 					});
// 				}
// 			});
			
// 			if (output.length < 1) return null;
// 			else return output;
// 		},
		
// 		_____getMatchingRegisteredEntityConverters : function(entity) {
// 			var matches = this.___registeredMatchingEntityConvertersCachedMatches[entity];
// 			if (matches !== undefined) {
// 				return matches;
// 			}
			
// 			logger.debug("running entity converter matching for " + entity);
			
// 			matches = [];
// 			$.each(this.___registeredMatchingEntityConverters, function(matcher, converterArray) {
// 				var matched = false;
// 				if (typeof matcher == "function") {
// 					logger.debug("checking entity converter matching against matching function");
// 					matched = macher(entity);
// 				}
// 				else {
// 					logger.debug("checking entity converter matching against " + matcher);
// 					matched = entity.match(matcher);
// 				}
				
// 				if (matched) {
// 					$.each(converterArray, function(i, converter){
// 						logger.debug("matched - adding converter");
// 						matches.push(converter);
// 					});
// 				}
// 			});
			
// 			$.each(this.___registeredMatchingFunctionEntityConverters, function(i, converterEntry) {
// 				logger.debug("checking entity converter matching against matching function");
// 				var matched = converterEntry.matcher(entity);
				
// 				if (matched) {
// 					logger.debug("matched - adding converter");
// 					matches.push(converterEntry.processor);
// 				}
// 			});
			
// 			if (matches.length < 1) {
// 				matches = null;
// 			}
			
// 			this.___registeredMatchingEntityConvertersCachedMatches[entity] = matches;
			
// 			logger.trace("found " + (matches ? matches.length : "no") + " matching processors");
// 			return matches;
// 		},
		
// 		___defaultEntityConverter : function(raw) {
// 			return raw;
// 		},
		
// 		___registeredEntityConverters : {
// 			'default' : [this.___defaultEntityConverter]
// 		},
// 		___registeredMatchingEntityConverters : {},
// 		___registeredMatchingFunctionEntityConverters : [],
// 		___registeredMatchingEntityConvertersCachedMatches : {}
		
// 	};
	
// 	return entityTransformer;
// }

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
/*jshint -W069 */
/*global angular:false, btoa */
"use strict";

angular.module("app").factory("RestClientFactory", ["$rootScope", "$q", "RestClientDispatcher", 'loggers', function ($rootScope, $q, RestClientDispatcher, loggers) {

  var logger = loggers.get("srv-rest-client-factory");

  /**
   * nivolasp API documentation
   * @class RestClientFactory
   * @param {(string|object)} domainOrOptions - The project domain or options object. If object, see the object's optional properties.
   * @param {string} domainOrOptions.domain - The project domain
   * @param {string} [domainOrOptions.cache] - An angularjs cache implementation
   * @param {string} [cache] - An angularjs cache implementation
   */

  function RestClientFactory(options, cache) {
    var domain = typeof options === "object" ? options.domain : options;
    this.domain = typeof domain === "string" ? domain : "";
    this.cache = cache || (typeof options === "object" ? options.cache : cache);

    if (this.domain) {
      if (logger.isTraceEnabled()) {
        logger.trace("Attenzione ! non è stato definito un dominio per i servizi rest");
      }
    }
  }

  RestClientFactory.prototype.constructor = RestClientFactory;

  /**
   * HTTP GET Request (select)
   * @method
   * @name RestClientFactory#requestGetAll
   * @param {object} parameters
   * @param {object} [options]
   * @param {object} [options.headers] - header parameters
   * @param {object} [options.deferred] - promise object 
   * @param {object} [options.path] - path to add to the domain 
   */
  RestClientFactory.prototype.requestGet = function (parameters, options) {
    parameters = parameters || {};
    var headers = (options && options.headers) || { 'Accept': '*/*', 'Content-Type': 'application/json' };
    var deferred = (options && options.deferred) || $q.defer();
    var path = (options && options.path) || '';
    this.request('GET', path, parameters, {}, headers, {}, {}, deferred);
    return deferred.promise;
  };

  /**
   * HTTP GET ALL Request (select *)
   * @method
   * @name RestClientFactory#requestGetAll
   * @param {object} parameters
   * @param {object} [parameters.page] parameter for query (page)
   * @param {object} [parameters.size] parameter for query (size)
   * @param {object} [parameters.sort] parameter for query (sort)
   * @param {object} [options]
   * @param {object} [options.headers] - header parameters
   * @param {object} [options.deferred] - promise object 
   * @param {object} [options.path] - path to add to the domain 
   */
  RestClientFactory.prototype.requestGetAll = function (parameters, options) {
    parameters = parameters || {};
    var headers = (options && options.headers) || { 'Accept': '*/*', 'Content-Type': 'application/json' };
    var deferred = (options && options.deferred) || $q.defer();
    var queryParameters = {};
    if (parameters.page !== undefined) {
      queryParameters.page = parameters.page;
    }
    if (parameters.size !== undefined) {
      queryParameters.size = parameters.size;
    }
    if (parameters.sort !== undefined) {
      queryParameters.sort = parameters.sort;
    }
    var path = (options && options.path) || '';
    this.request('GET', path, parameters, {}, headers, queryParameters, {}, deferred);
    return deferred.promise;
  };

  /**
   * HTTP GET ONE Request (select by id)
   * @method
   * @name RestClientFactory#requestGetOne
   * @param {object} parameters
   * @param {object} [options]
   * @param {object} [options.headers] - header parameters
   * @param {object} [options.deferred] - promise object 
   * @param {object} [options.nameId] - name of field used by key (default is 'id')
   * @param {object} [options.path] - path to add to the domain 
   */
  RestClientFactory.prototype.requestGetOne = function (parameters, options) {
    parameters = parameters || {};
    var headers = (options && options.headers) || { 'Accept': '*/*', 'Content-Type': 'application/json' };
    var deferred = (options && options.deferred) || $q.defer();
    var nameId = (options && options.nameId) ? options.nameId : 'id';
    if (parameters[nameId] === undefined) {
      deferred.reject(new Error("Missing required parameter: parameters[" + nameId + "]"));
      return deferred.promise;
    }
    var path = (options && options.path) || '';
    path += '/' + parameters[nameId];
    this.request('GET', path, parameters, {}, headers, {}, {}, deferred);
    return deferred.promise;
  };


  /**
   * HTTP POST Request (insert)
   * @method
   * @name RestClientFactory#requestPost
   * @param {object} parameters
   * @param {object} nameEntity - name of field used by entity
   * @param {object} [options]
   * @param {object} [options.headers] - header parameters
   * @param {object} [options.deferred] - promise object 
   * @param {object} [options.path] - path to add to the domain 
   */
  RestClientFactory.prototype.requestPost = function (parameters, nameEntity, options) {
    parameters = parameters || {};
    var headers = (options && options.headers) || { 'Accept': '*/*', 'Content-Type': 'application/json' };
    var deferred = (options && options.deferred) || $q.defer();
    if (nameEntity === undefined) {
      deferred.reject(new Error("Missing required parameter: nameEntity"));
      return deferred.promise;
    }
    if (parameters[nameEntity] === undefined) {
      deferred.reject(new Error("Missing required parameter: parameters[" + nameEntity + "]"));
      return deferred.promise;
    }
    var path = (options && options.path) || '';
    this.request('POST', path, parameters, parameters[nameEntity], headers, {}, {}, deferred);
    return deferred.promise;
  };

  /**
   * HTTP PUT Request (update)
   * @method
   * @name RestClientFactory#requestPut
   * @param {object} parameters
   * @param {object} nameEntity - name of field used by entity
   * @param {object} [options]
   * @param {object} [options.headers] - header parameters
   * @param {object} [options.deferred] - promise object 
   * @param {object} [options.path] - path to add to the domain 
   */
  RestClientFactory.prototype.requestPut = function (parameters, nameEntity, options) {
    parameters = parameters || {};
    var headers = (options && options.headers) || { 'Accept': '*/*', 'Content-Type': 'application/json' };
    var deferred = (options && options.deferred) || $q.defer();
    if (nameEntity === undefined) {
      deferred.reject(new Error("Missing required parameter: nameEntity"));
      return deferred.promise;
    }
    if (parameters[nameEntity] === undefined) {
      deferred.reject(new Error("Missing required parameter: parameters[" + nameEntity + "]"));
      return deferred.promise;
    }
    var path = (options && options.path) || '';
    this.request('PUT', path, parameters, parameters[nameEntity], headers, {}, {}, deferred);
    return deferred.promise;
  };


  /**
* HTTP DELETE Request (delete)
* @method
* @name RestClientFactory#requestDelete
* @param {object} parameters
* @param {object} [options]
* @param {object} [options.headers] - header parameters
* @param {object} [options.deferred] - promise object 
* @param {object} [options.nameId] - name of field used by key (default is 'id')
* @param {object} [options.path] - path to add to the domain 
*/
  RestClientFactory.prototype.requestDelete = function (parameters, options) {
    parameters = parameters || {};
    var headers = (options && options.headers) || { 'Accept': '*/*', 'Content-Type': 'application/json' };
    var deferred = (options && options.deferred) || $q.defer();
    var nameId = (options && options.nameId) ? options.nameId : 'id';
    if (parameters[nameId] === undefined) {
      deferred.reject(new Error("Missing required parameter: parameters[" + nameId + "]"));
      return deferred.promise;
    }
    var path = (options && options.path) || '';
    path += '/' + parameters[nameId];
    this.request('DELETE', path, parameters, {}, headers, {}, {}, deferred);
    return deferred.promise;
  };

  /**
   * HTTP Request
   * @method
   * @name RestClientFactory#request
   * @param {string} method - http method
   * @param {string} url - url to do request
   * @param {object} parameters
   * @param {object} body - body parameters / object
   * @param {object} headers - header parameters
   * @param {object} queryParameters - querystring parameters
   * @param {object} form - form data object
   * @param {object} deferred - promise object
   */
  RestClientFactory.prototype.request = function (method, path, parameters, body, headers, queryParameters, form, deferred) {
    var url = this.domain + path;
    parameters = parameters || {};
    queryParameters = mergeQueryParams(parameters, queryParameters);
    var options = {
      timeout: parameters.$timeout,
      method: method,
      url: url,
      params: queryParameters,
      data: body,
      headers: headers
    };
    if (Object.keys(form).length > 0) {
      options.data = form;
      options.headers["Content-Type"] = "application/x-www-form-urlencoded";
      options.transformRequest = transformRequest;
    }
    RestClientDispatcher
      .dispatch(options)
      .then(function (data, status, headers, config) {
        deferred.resolve(data);
        if (parameters.$cache !== undefined) {
          parameters.$cache.put(url, data, parameters.$cacheItemOpts ? parameters.$cacheItemOpts : {});
        }
      })
      .catch(function (data, status, headers, config) {
        deferred.reject({
          status: status,
          headers: headers,
          config: config,
          body: data
        });
      });
  };

  RestClientFactory.prototype.$on = function ($scope, path, handler) {
    var url = this.domain + path;
    $scope.$on(url, function () {
      handler();
    });
    return this;
  };

  RestClientFactory.prototype.$broadcast = function (path) {
    var url = this.domain + path;
    $rootScope.$broadcast(url);
    return this;
  };

  function transformRequest(obj) {
    var str = [];
    for (var p in obj) {
      var val = obj[p];
      if (angular.isArray(val)) {
        val.forEach(function (val) {
          str.push(encodeURIComponent(p) + "=" + encodeURIComponent(val));
        });
      } else {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(val));
      }
    }
    return str.join("&");
  };

  function mergeQueryParams(parameters, queryParameters) {
    if (parameters.$queryParameters) {
      Object.keys(parameters.$queryParameters).forEach(function (parameterName) {
        var parameter = parameters.$queryParameters[parameterName];
        queryParameters[parameterName] = parameter;
      });
    }
    return queryParameters;
  }


  return RestClientFactory;

}]);

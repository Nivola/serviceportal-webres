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
angular.module("app").service("SystemStatusService", [
  "$http", "$rootScope", "$interval", "loggers", "conf", "events", "PublicTestRestClient",  function(
  $http,  $rootScope,  $interval,  loggers,  conf,  events, PublicTestRestClient) {
    var service = this;
    var logger = loggers.get("system-status");

    var GATEWAY_PING_INTERVAL_WHEN_UP = conf.gatewayIntervalPingWhenOnline;
    var GATEWAY_PING_INTERVAL_WHEN_DOWN = conf.gatewayIntervalPingWhenOffline;

    var status = {
      gatewayUp: true,
      gatewayDown: false,
      gatewayMonitoringEnabled: false
    };

    /* Interface */

    service.getServicesStatus = function() {
      return PublicTestRestClient.getServicesStatusUsingGET().then(function(
        response
      ) {
        var mapped = response.data;
        return mapped;
      });
    };

    service.getStatus = function() {
      return status;
    };

    service.enableGatewayMonitoring = function() {
      logger.trace("gateway monitoring enabled");
      status.gatewayMonitoringEnabled = true;
      doPing();
    };

    service.disableGatewayMonitoring = function() {
      logger.trace("gateway monitoring disabled");
      status.gatewayMonitoringEnabled = false;
    };

    service.isGatewayUp = function() {
      return status.gatewayUp;
    };

    service.isGatewayDown = function() {
      return status.gatewayDown;
    };

    /* Implementation */

    var doPing = function() {
      ping().then(
        function(response) {
          if (!status.gatewayUp) {
            logger.trace("gateway is now up, broadcasting event");
            status.gatewayUp = true;
            status.gatewayDown = false;
            $rootScope.$broadcast(events.GATEWAY_UP);
          }
        },
        function(response) {
          if (status.gatewayUp) {
            logger.trace("gateway is now down, broadcasting event");
            status.gatewayUp = false;
            status.gatewayDown = true;
            $rootScope.$broadcast(events.GATEWAY_DOWN);
          }
        }
      );
    };

    var ping = function() {
      return $http.get(conf.location.api + "/ping");
    };

    var _INTERVAL_0 = 0;
    var _INTERVAL_STEP = 250;
    var intervalHandler = $interval(function() {
      if (!status.gatewayMonitoringEnabled) {
        return;
      }
      _INTERVAL_0 += _INTERVAL_STEP;
      if (
        (status.gatewayUp && _INTERVAL_0 >= GATEWAY_PING_INTERVAL_WHEN_UP) ||
        (status.gatewayDown && _INTERVAL_0 >= GATEWAY_PING_INTERVAL_WHEN_DOWN)
      ) {
        _INTERVAL_0 = 0;
        logger.trace("pinging gateway");
        doPing();
      }
    }, _INTERVAL_STEP);
  }
]);

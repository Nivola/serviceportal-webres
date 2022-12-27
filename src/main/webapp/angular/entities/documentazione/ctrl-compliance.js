/*-
 * ========================LICENSE_START=================================
 * Nivola Service Portal Web Resources
 * %%
 * Copyright (C) 2022 Regione Piemonte
 * %%
 * SPDX-FileCopyrightText: Copyright 2022 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
nivolaApp.controller("ComplianceController", [
    "$scope", "loggers", "controllerValidator",
    function ($scope, loggers, controllerValidator) {
        var logger = loggers.get("ComplianceController");

        this.onInit = function () {
        };

        this.onExit = function () {
            // nop
        };

        controllerValidator.validate(this, $scope);
    }
]);

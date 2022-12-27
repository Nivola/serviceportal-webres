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
angular.module("app").controller("documentiEManualiCtrl", [
  "$scope",
  "loggers",
  "conf",
  function($scope, loggers, conf) {
    var logger = loggers.get("documentiEManualiCtrl");

    logger.debug("max: init documentiEManualiCtrl");
    $scope.linkDoc = {
      documentazione: "https://doc.nivolapiemonte.it/userguide/getting_started.html",
      catalogoPdf: conf.siteContext + "/documentation/Nivola - Catalogo Servizi.pdf",
      condizioniPdf: conf.siteContext + "/documentation/Nivola-CondizioniGenerali.pdf",
      manualePdf: conf.siteContext + "/documentation/Nivola - Manuale Utente del Servizio.pdf",
      slaPdf: conf.siteContext + "/documentation/sla-2020-2-semestre.pdf",
    };
  }
]);

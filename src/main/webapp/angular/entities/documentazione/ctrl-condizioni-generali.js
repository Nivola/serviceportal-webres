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
nivolaApp.controller("CondizioniGeneraliController", [
    "$scope", "loggers", "conf", "AuthLevel", "controllerValidator", '$translate', 
    function ($scope, loggers, conf, AuthLevel, controllerValidator, $translate) {
        var logger = loggers.get("CondizioniGeneraliController");

        logger.debug("max: init CondizioniGeneraliController");

        // i18n - documentazione pdf da tradurre
        var linkDoc = {
            it: {
                condizioniPdf: "/documentation/Nivola-CondizioniGenerali.pdf",
                condizioniFornitoriPdf: "/documentation/Nivola-CondizioniGenerali-Fornitori.pdf"
            },
            en: {
                condizioniPdf: "/documentation/Nivola-CondizioniGenerali.pdf",
                condizioniFornitoriPdf: "/documentation/Nivola-CondizioniGenerali-Fornitori.pdf"
            }
        };

        $scope.openPdfDocumentazione = function(urlKey) {
            var jsonLinkDoc = linkDoc; // JSON.parse(linkDoc);
            var lang = $translate.use();
            var url = conf.siteContext + jsonLinkDoc[lang][urlKey];
            window.open(url, '_blank');
        }

        this.onInit = function () {
        };

        this.onExit = function () {
            // nop
        };

        controllerValidator.validate(this, $scope);
    }
]);

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
nivolaApp.controller("SlaController", [
    "$scope", "loggers", "conf", "AuthLevel", "controllerValidator", '$translate', 
    function ($scope, loggers, conf, AuthLevel, controllerValidator, $translate) {
        var logger = loggers.get("SlaController");

        logger.debug("max: init SlaController");

        // i18n - documentazione pdf da tradurre
        var linkDoc = {
            it: {
                
                sem2_2020_slaPdf: "/documentation/sla-2020-semestre2.pdf",
                condizioniFornitoriPdf: "/documentation/Nivola-CondizioniGenerali-Fornitori.pdf",
                sem1_2021_slaPdf: "/documentation/sla-2021-semestre1.pdf",
                sem2_2021_slaPdf: "/documentation/sla-2021-semestre2.pdf",
                sem1_2022_slaPdf: "/documentation/sla-2022-semestre1.pdf"
            },
            en: {
                sem2_2020_slaPdf: "/documentation/sla-2020-2-semestre.pdf",
                condizioniFornitoriPdf: "/documentation/Nivola-CondizioniGenerali-Fornitori.pdf",
                sem1_2021_slaPdf: "/documentation/sla-2021-semestre1.pdf",
                sem2_2021_slaPdf: "/documentation/sla-2021-semestre2.pdf",
                sem1_2022_slaPdf: "/documentation/sla-2022-semestre1.pdf"
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

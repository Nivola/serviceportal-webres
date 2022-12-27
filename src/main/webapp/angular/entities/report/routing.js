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
nivolaApp.config(["$stateProvider", "conf",
    function ($stateProvider, conf) {
        var context = conf.siteContext + "/angular/entities/report";

        $stateProvider
            .state("app.csvaccount", {
                url: "/report/csv",
                requiredUC : 'BOADMIN',
                params: {
                    object: null,
                    body: null
                },
                views: {
                    "content@": {
                        templateUrl:
                            context + "/tpl-form-csv.html",
                        controller: "FormCSVController"
                    }
                }
            });
    }
]);

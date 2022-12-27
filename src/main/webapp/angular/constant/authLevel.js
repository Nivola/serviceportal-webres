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
nivolaApp.constant('AuthLevel', {
	//ROLE_ANONYMOUS: "ROLE_ANONYMOUS",
	OSPITE: "Ospite",

	BOADMIN: "BOADMIN",
	BOMONITORING: "BOMONITORING",
	SUPERADMIN: "SUPERADMIN",

	AccountViewerRole: "AccountViewerRole",
	AccountOperatorRole: "AccountOperatorRole",
	AccountAdminRole: "AccountAdminRole",

	DivViewerRole: "DivViewerRole",
	DivOperatorRole: "DivOperatorRole",
	DivAdminRole: "DivAdminRole",

	OrgViewerRole: "OrgViewerRole",
	OrgOperatorRole: "OrgOperatorRole",
	OrgAdminRole: "OrgAdminRole",

	//questi sono stati aggiunti per le widget che mostro nelle pagine dettaglio account e dettaglio divisione
	DettaglioAccountViewer:"DettaglioAccountViewer",
	DettaglioDivisioneViewer:"DettaglioDivisioneViewer"
});

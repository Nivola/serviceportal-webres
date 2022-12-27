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
nivolaApp.service('operations', ['operationQueue', function(oq) {
	this.caricamentoRuoli = oq.register("Caricamento lista ruoli"),
	this.caricamentoOperatori = oq.register("Caricamento lista operatori"),
	this.sceltaRuolo = oq.register("Scelta del ruolo"),
	this.monitoraggio = oq.register("Monitoraggio"),
	this.caricamentoIdentita = oq.register("Caricamento identita'"),

	this.caricaParametri = oq.register("Caricamento Parametri"),
	this.caricaMessaggi = oq.register("MESSAGGIO_MESSAGGIO_MESSAGGIO"),
	this.caricamento = oq.register("Caricamento dati"),
	this.applicazione = oq.register("Applicazione delle modifiche"),
		
	this.ricercaGlobale = oq.register("Ricerca globale")
		
}]);

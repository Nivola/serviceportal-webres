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
nivolaApp.config(function ($mdDateLocaleProvider) {
   
    $mdDateLocaleProvider.months =  []; // [ "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre" ];
    $mdDateLocaleProvider.shortMonths =  []; // [ "Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Sett", "Ott", "Nov", "Dic" ];
    $mdDateLocaleProvider.days = []; // ['Domenica','Lunedì','Martedì','Mercoledì','Giovedì','Venerdì','Sabato'];
    $mdDateLocaleProvider.shortDays = []; // ['Do','Lu','Ma','Me','Gi','Ve','Sa'];

    // var lang = $translate.use();
    var lang = location.href.split('lang=')[1];
    var objDate = new Date(2021, 0, 1); // primo gennaio
    for (i = 0; i < 12; i++) {
        $mdDateLocaleProvider.months.push(objDate.toLocaleString(lang, {month:"long"}));
        $mdDateLocaleProvider.shortMonths.push(objDate.toLocaleString(lang, {month:"short"}));
        objDate.setMonth(objDate.getMonth() + 1);
    }
    var objDate = new Date(2021, 0, 24); // domenica 24 gennaio 2021
    for (i = 0; i < 7; i++) {
        $mdDateLocaleProvider.days.push(objDate.toLocaleString(lang, {weekday:"long"}));
        $mdDateLocaleProvider.shortDays.push(objDate.toLocaleString(lang, {weekday:"short"}));
        objDate.setDate(objDate.getDate() + 1);
    }
    

    $mdDateLocaleProvider.formatDate = function (date) {
        if(date && date !== null){
            let day = date.getDate();
            let monthIndex = date.getMonth();
            let year = date.getFullYear();
            return day + '/' + (monthIndex + 1) + '/' + year;
        }
        return '';

    };

    /**
     * @param dateString {string} string that can be converted to a Date
     * @returns {Date} JavaScript Date object created from the provided dateString
     */
    // $mdDateLocaleProvider.parseDate = function (dateString) {
    //     var m = moment(dateString, 'D/M/Y', true);
    //     return m.isValid() ? m.toDate() : new Date(NaN);
    // };


    $mdDateLocaleProvider.isDateComplete = function (dateString) {
        dateString = dateString.trim();
        //accetta solo in questo formato 12/01/2000
        var re = /^(((0[1-9]|[12]\d|3[01])\/(0[13578]|1[02])\/((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\/(0[13456789]|1[012])\/((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\/02\/((19|[2-9]\d)\d{2}))|(29\/02\/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))))/;
        return re.test(dateString);
    };
});

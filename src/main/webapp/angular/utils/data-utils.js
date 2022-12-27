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
nivolaApp.service('DataUtils', ['$window', function($window) {

    this.abbreviate = function(text) {
        if (!angular.isString(text)) {
            return '';
        }
        if (text.length < 30) {
            return text;
        }
        return text ? (text.substring(0, 15) + '...' + text.slice(-10)) : '';
    }

    this.byteSize = function(base64String) {
        if (!angular.isString(base64String)) {
            return '';
        }
        return formatAsBytes(size(base64String));
    }
    function formatAsBytes(size) {
        return size.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' bytes';
    }
    function size(base64String) {
        return base64String.length / 4 * 3 - paddingSize(base64String);
    }
    function paddingSize(base64String) {
        if (base64String.endsWith('==')) {
            return 2;
        }
        if (base64String.endsWith('=')) {
            return 1;
        }
        return 0;
    }

    this.openFile = function(type, data) {
        $window.open('data:' + type + ';base64,' + data, '_blank', 'height=300,width=400');
    }

    this.toBase64 = function toBase64 (file, cb) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = function (e) {
            var base64Data = e.target.result.substr(e.target.result.indexOf('base64,') + 'base64,'.length);
            cb(base64Data);
        };
    }

    

    

    

    
}]);

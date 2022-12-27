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
nivolaApp.service('utils', function() {
	
	this.nop = function() {
		// NOP
	};
	
	this.scrollTo = function(selector, time) {
		if (!time) time = 500;
		
		$('html, body').animate({
			scrollTop: $(selector).offset().top
		}, time);
	};
		
	this.sortByProperty = function (array, property, order) {
		if (!array || !array.sort) return array;
		if (order >= 0) order = 1;
		else order = -1;
		array.sort(function(a, b){
			var aValue = a[property];
			var bValue = b[property]; 
			return order * ((aValue < bValue) ? -1 : ((aValue > bValue) ? 1 : 0));
		});
		return array;
	};
		
	//ESPORTA TABELLA EXCEL BISOGNA PASSARE TABLE_ID
	this.esportaExcel = function(tableId,nomeFile) {

		var dt = new Date();
		var day = dt.getDate();
		var month = dt.getMonth() + 1;
		var year = dt.getFullYear();
		var hour = dt.getHours();
		var mins = dt.getMinutes();
		var postfix = day + "-" + month + "-" + year + " " + hour + "." + mins;
		var fileName = nomeFile+' '+postfix+'.xls';                          
		var uri = 'data:application/vnd.ms-excel;base64,'
		, template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
		, base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))) }
		, format = function(s, c) { return s.replace(/{(\w+)}/g, function(m, p) { return c[p]; }) };
		var tempTable = document.getElementById(tableId).cloneNode(true);
		angular.element(tempTable.querySelectorAll("thead tr th.hide")).remove();
		angular.element(tempTable.querySelectorAll("thead tr th.overhide")).remove();
		// angular.element(tempTable.querySelectorAll("thead tr th.md-checkbox-column")).remove();
		angular.element(tempTable.querySelectorAll("thead tr th.plusbuttonicon")).remove();
		angular.element(tempTable.querySelectorAll("thead.md-table-progress tr th")).remove();
		angular.element(tempTable.querySelectorAll("thead.md-table-progress")).remove();

		angular.element(tempTable.querySelectorAll("tbody tr td.overhide")).remove();
		angular.element(tempTable.querySelectorAll("tbody tr td.hide")).remove();
		// angular.element(tempTable.querySelectorAll("tbody tr td.md-checkbox-column")).remove();
		angular.element(tempTable.querySelectorAll("tbody tr td.plusbuttonicon")).remove();
		angular.element(tempTable.querySelectorAll("tbody tr.secondary")).remove();


		// if (!tableId.nodeType) tableId = document.getElementById(tableId);
		var ctx = {worksheet: fileName || 'Worksheet', table: tempTable.innerHTML};
		var exceldata = new Blob([ format(template, ctx)], { type: "data:application/vnd.ms-excel;base64" }) ;
		if (window.navigator.msSaveBlob) { // IE 10+
				window.navigator.msSaveOrOpenBlob(exceldata, fileName);
		} else {
				var link = document.createElement('a'); //create link download file
				link.href = window.URL.createObjectURL(exceldata); // set url for link download
				link.setAttribute('download', fileName); //set attribute for link created
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
		}
		tempTable.remove();
	};
			
	this.buildBooleanOptionsForCombo = function() {
		return [{ codice:'N', label: 'No', value: false }, { codice:'Y', label: 'Sì', value: true }];
	};

	this.addAlertMessage = function(alerts, msg, type) {
		if(!type){
			type = 'alert-warning';
		}

		alerts.push({
			msg: msg,
			type: 'alert-'+type
		});
	};

	this.closeAlert = function(alerts, index) {
		alerts.splice(index, 1);
	};
	
	this.getAlberoStati = function(endLeafName, $state) {
		var albero = [];
		var stato;
		while (true) {
			stato = $state.get(endLeafName);
			if (stato) {
				albero.push(stato);
				if (endLeafName.indexOf(".") >= 0) {
					endLeafName = endLeafName.substring(0, endLeafName.lastIndexOf("."));
				}
				else {
					break;
				}
			}
			else {
				break;
			}
		}
		return albero;
	};
	
	
	
	this.scrollToElement = function(elementSelector, maxTimeOut) {
		var scrollingContextIndex = 0;
		
		function scroll (context) {
		
			if (context.index != scrollingContextIndex) {
				return;
			}
			
			context.iteration ++;
			
			var element = $(context.selector);
	
			if (element.length) {
				var position = element.offset().top;
				if (context.lastPosition === null || (position != context.lastPosition && Math.abs(position - context.lastPosition) >= 50)) {
					context.lastPosition = position;
					$('html, body').animate({
						scrollTop: position - 40
					}, context.scrollSpeed);
				}
			}
			
			context.timeout -= context.step;
			
			if (context.timeout > 0) {
				setTimeout(function(){
					scroll(context);
				}, context.step)
			}
		};

		return scroll({
			index : ++scrollingContextIndex,
			selector : elementSelector,
			timeout : maxTimeOut,
			iteration : 0,
			step : 50,
			scrollSpeed : 200,
			lastPosition : null
		});
		
	};
	
	this.isEmpty = function(obj) {
		for (var key in obj) {
			if (obj.hasOwnProperty(key))
				return false;
		}
		return true;
	};
	
});


/*
 * Copyright (c) 2009 Massimiliano Balestrieri
 * 
 * $Date: 2010-03-01 15:18:17 +0100 (lun, 01 mar 2010) $
 * $Rev: 316 $
 * @requires jQuery v1.3.2
 * 
 * Copyright (c) 2008 Massimiliano Balestrieri
 * Examples and docs at: http://maxb.net/blog/
 * Licensed GPL licenses:
 * http://www.gnu.org/licenses/gpl.html
 */

(function($){
	
jQApri = {}; 

////////////////////////////////////////////////////////////////////////////////
//========== APERTURA FINESTRE =================================================
////////////////////////////////////////////////////////////////////////////////

jQApri.Apri = {
    build   : function(options)
    {
    	
    	var _options = $.extend({
    	   message     : "Attenzione: questo link si apre in una nuova finestra",
	       toolbar     : "no",
           location    : "no",
           directories : "no",
           status      : "no",
           menuBar     : "no",
           scrollbars  : "yes",
           resizable   : "yes",
           width       : 400,
           height      : 300,
           top         : false,
           left        : false,
           screenX     : false,
           screenY     : false
    	}, options);

		//var _name = this.selector;
		//_name = _name.replace(".","_").replace("#","_");//IE6 

        return this.each(function(nr){
                var _prop = '';
                for (_option in _options)
                    if (_options[_option])
                        _prop += _option + "=" + _options[_option] + ",";
                
                var that = this;
                var _j = $(that);
                var _t = _j.attr("title") ? _j.attr("title") : _j.text();  
                _j.attr("title", _t + " - " + _options.message);

			    var _href = _j.attr("href");
			    _j.click(function () {window.open(_href, "_blank", _prop); return false;});//_name
         });
    },
    init : function() {
    	
    }
};
   
$.fn.apri = jQApri.Apri.build;
$.fn.apri_init = jQApri.Apri.init;

$(document).bind("ready", function(ev){
	var _target = ev.target || document;
	jQuery(_target).apri_init();
});

})(jQuery);
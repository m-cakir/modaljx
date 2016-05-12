(function ($) {
		
    var BSModalAjax = function (element, options) {
		
        this.init(element, options);
		
    };

    BSModalAjax.prototype = {

        constructor: BSModalAjax,

        init: function (element, options) {
			
            this.$element = $(element);
			
            this.options = $.extend({}, $.fn.modaljx.defaults, this.$element.data(), typeof options === 'object' && options);
			
            this.xhr = false;
			
            var that = this;

            this.$element.on('click', function(e){
				
                e.preventDefault();
				
                that.open($(this).attr('href') || $(this).data('target'));
				
            });
        },
		
		open : function(url){
			
			if(!Boolean(url)) {
				
				this.__log("URL cannot be empty!");
				
				return;
				
			}

			if(url.charAt(0) === '#') url = url.substr(1);

			var options = this.options;

			var modalOptions = options.staticBackdrop ? { backdrop: 'static', keyboard: false } : {};

            this._modal = $(this._getHtml()).appendTo('body').modal(modalOptions);

            this._content = $(this._modal.find('.modal-dialog').html(this.options.spinner));
			
            this._modal.on('shown.bs.modal', function () {

                if (typeof( $('body').data('fv_open_modals') ) == 'undefined') {
					$('body').data('fv_open_modals', 0);
				}

				if ($(this).hasClass('fv-modal-stack')) return;

				var modalCount = $('body').data('fv_open_modals');

				$('body').data('fv_open_modals', modalCount + 1);

				$(this).addClass('fv-modal-stack').css('z-index', 1040 + (10 * modalCount));

				$('.modal-backdrop').not('.fv-modal-stack').css('z-index', 1039 + (10 * modalCount)).addClass('fv-modal-stack');
					
				if(typeof window[options.onShown] === 'function'){
					
					window[options.onShown].apply(this);
					
				}

            }).on('hidden.bs.modal', function(){

                if(this.xhr) this.xhr.abort();

				$('body').data('fv_open_modals', $('body').data('fv_open_modals' ) - 1);

				$(this).removeClass('fv-modal-stack').remove();
					
				if(typeof window[options.onClose] === 'function') {
					
					window[options.onClose].apply(this);
					
				}
				
            });
			
			this.__ajax(url);
			
		},

		hide : function () {

			if(this._modal) this._modal.modal('hide');

		},
		
		__ajax : function(url){
			
			var options = this.options;
			
			var modal = this._modal;
			
			var content = this._content;
			
            this.xhr = $.ajax({
                
				type    	: options.ajax.type,
                
				url     	: url,
                
				data    	: this._getData(),

				beforeSend 	: options.ajax.beforeSend
				
            }).done(function(response, status, xhr){
				
                if(status !== 'success') return;
				
				modal.addClass(options.modalClass);

                content.html(response);

                if(typeof window[options.onSuccess] === 'function') {
					
                    window[options.onSuccess].apply(this, [].concat(arguments));
					
				}
				
            }).fail(function() {
				
				if(options.canHideOnFail) modal.modal('hide');

                if(typeof window[options.onFail] === 'function') {
                
					window[options.onFail].apply(this, [].concat(arguments));
				
				}
				
			});
			
		},
		
		_getData : function(){
			
			var data = {};
			
			if(!this.options.cacheable){
				
				data.r = this.__random(100, 999999999);
				
			}
			
			return data;
		},

        _getHtml : function(){

            var count = 0;

            if (typeof( $('body').data('fv_open_modals') ) !== 'undefined') {
				
                count = $('body').data('fv_open_modals');
				
            }

            return [ '<div id="modaljx-', (count + 1), '" class="modal fade" role="dialog" aria-hidden="true" style="display: none;">',
                        '<div class="modal-dialog">', '</div>',
                    '</div>'].join('');
        },

        __random : function (m, n) {
			
            m = parseInt(m); n = parseInt(n);
			
            return Math.floor( Math.random() * (n - m + 1) ) + m;
        },
		
		__log : function(txt){
			
			if(typeof console === 'undefined') return;
			
			console.log("modaljx - msg: " + txt);
			
		}

    };

    /* Bootstrap Ajax Modal jQuery Plugin Definition
     * ============================================== */

    $.fn.modaljx = function (option, args) {
		
        return this.each(function () {
            var that = $(this),
                data = that.data('modaljx');

            if (!data) that.data('modaljx', (data = new BSModalAjax(this, option)));
            if (typeof option === 'string' && /open|hide/.test(option)) data[option].apply(data, [].concat(args));
        });
	
    };

    $.fn.modaljx.defaults = {
		
		cacheable	: false,

		canHideOnFail : false,

		staticBackdrop : false,
        
		modalClass	: '',	
		
        spinner     : '<div class="progress progress-striped active" style="margin-top: 10%;"><div class="progress-bar progress-bar-info" style="width: 100%"></div></div>',
		
		ajax 		: {
				
			type : 'GET', // or POST

			beforeSend : function () {}
				
		},
				
        onFail     	: function(){},
		
		onSuccess	: function(){},
		
        onShown   	: function(){},
		
		onClose		: function(){}
    };

}(jQuery));
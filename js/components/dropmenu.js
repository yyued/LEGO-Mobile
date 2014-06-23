define('dropmenu',['zepto'],function(require, exports, module) {
	var $ = require("zepto");

	var dropmenu = function(options){
		var defaultOptions = {
			position : 'center',
			selection : null,
			afterdrop : null
		}

		this.options = $.extend(defaultOptions, options);
		
		//dropMenu触发对象
		this.el = arguments[0].ref;

		//渲染下拉列表
		this.renderList();

		//添加点击监听
		this.addEvents();
	}

	dropmenu.prototype.renderList = function(){
		var _ts = this,
			_opts = _ts.options,
			_selection = _opts.selection;

		var _dropList = '<div class="m-droplist--'+_opts.position+'"><ul class="m-nav-droplist animation">';

		for(var i = 0, j = _selection.length; i < j; i++){
			_dropList += '<li class="m-nav-droplist-item"><a href="'+_selection[i].href+'">'+_selection[i].title+'</a></li>';
		}
		_dropList += '</ul></div>';

		$(this.el).after(_dropList);
	}

	dropmenu.prototype.addEvents = function(){
		$(".m-nav").on("click", ".m-nav-list__item", function(){
			if(!$(this).hasClass('active')){
				$(".m-nav-droplist").removeClass('slide-down-menu');
				$(".m-nav-list__item").removeClass('active');
			}
			$(this).toggleClass('active');
			$(this).parent().find(".m-nav-droplist").toggleClass('slide-down-menu');
		});
	}

	//注册$插件
    $.fn.dropmenu = function (opts) {
        opts = $.extend({}, opts, { ref : this[0] });
        return new dropmenu(opts);
    };

    module.exports = function(opts){
    	return new dropmenu(opts);
    }
});


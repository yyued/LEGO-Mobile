define(function(require, exports, module) {
	var $ = require("zepto");

	var MO = {};

	MO.config = {
		baseUrl : '',
		debug : true
	};

	MO.touchFeedback = function(){
		$("*[data-touch=on]").on("touchstart",function(){
		});
	}

	MO.toggleButton = function(){
		$("body").on('touchstart', '.u-toggle', function(event) {
			$(this).attr('checked', function(index, attr){
				return attr == "checked" ? "" : "checked";
			})
		});
	}

    /**
     * 返回顶部通用方法
     * @return {}
     */
	MO.initScrollTop = function(){
        var st = null,
            _scTop = '<span class="mod-scrollTop hidden"></span>';
        $("body").append(_scTop);
        $(window).bind('scroll',function(event){
            clearTimeout(st);
            st = setTimeout(function(){
                if(document.body.scrollTop > window.innerHeight/2){
                    $(".mod-scrollTop").show();
                    $(".mod-scrollTop").click(function(event) {
                        $(this).hide();
                        event.preventDefault();
                        window.scrollTo(0,0);
                    });
                }else{
                    $(".mod-scrollTop").hide();
                }
            },50);
        });
    }

	/**
     * 解析模版tpl。当data未传入时返回编译结果函数；当某个template需要多次解析时，
     * 建议保存编译结果函数，然后调用此函数来得到结果。
     * 
     * @method MO.parseTpl
     * @grammar MO.parseTpl(str, data)  ⇒ string
     * @grammar MO.parseTpl(str)  ⇒ Function
     * @param {String} str 模板
     * @param {Object} data 数据
     * @example var str = "<p><%=name%></p>",
     * obj = {name: 'ajean'};
     */
	MO.parseTpl = function(str, data){
		var tmpl = 'var __p=[];' + 'with(obj||{}){__p.push(\'' +
                str.replace( /\\/g, '\\\\' )
                .replace( /'/g, '\\\'' )
                .replace( /<%=([\s\S]+?)%>/g, function( match, code ) {
                    return '\',' + code.replace( /\\'/, '\'' ) + ',\'';
                } )
                .replace( /<%([\s\S]+?)%>/g, function( match, code ) {
                    return '\');' + code.replace( /\\'/, '\'' )
                            .replace( /[\r\n\t]/g, ' ' ) + '__p.push(\'';
                } )
                .replace( /\r/g, '\\r' )
                .replace( /\n/g, '\\n' )
                .replace( /\t/g, '\\t' ) +
                '\');}return __p.join("");',

            func = new Function( 'obj', tmpl );
		
        return data ? func( data ) : func;
	};

	MO.init = function(){
		/*初始化程序中touch效果*/
		MO.touchFeedback();

		//初始化程序中toggle开关
		MO.toggleButton();
	}();

	//exports
	module.exports = MO;
});
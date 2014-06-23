define('tab',['zepto','MO','swipe'],function(require, exports, module) {
	var $ = require("zepto"),
		MO = require("MO"),
		Swipe = require("swipe");

	var Tab = function( selector , options ){

		var elem = $(selector).get(0),
			nav = $(selector).find("nav").children();
			//console.log(nav);

		/*插件自定义参数*/
		var opts = {
			callback:function(pos){
           var i = nav.length;
           while (i--) {
             nav.eq(i).removeClass('current');
           }
           nav.eq(pos).addClass('current');
			}
		}

		//合并调用参数，和插件参数
		opts = $.extend( {}, options, opts );

		/**
		 * [tabSwitch description]
		 * @return {[type]} [description]
		 * tab切换事件绑定
		 */
		var tabSwitch = function(){

			nav.each(function(index, el) {
				//alert(33);
				$(this).attr("data-index",index);
			});

			//tab按钮绑定切换tab内容事件
			$(selector).find("nav").on('touchstart', '*', function(event) {
				mySwipe.slide( parseInt( $(this).attr("data-index") ) );
				/* Act on the event */
			});

		}

		tabSwitch();
	   	var mySwipe = Swipe(elem, opts);


		//创建sipejs对象
	    return Swipe(elem, opts);

	}

	//exports
	module.exports = Tab; 
});




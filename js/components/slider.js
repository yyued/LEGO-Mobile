define('slider',['zepto','MO'],function(require, exports, module) {
	var $ = require("zepto"),
		MO = require("MO");

	var Slider = function(selector, options){
		this.selector = selector;
		this.options = options;

		Slider.prototype.normal = function(){
			var _ts = this;

			//异步加载swipe.js
			require.async('swipe', function(swipe){
				var elem = $(_ts.selector).get(0),
					nav = $(_ts.selector).find(".m-slider-trigger").children();

				/*插件自定义参数*/
				var opts = {
					callback: function(pos){
			           	var i = nav.length;

			           	_ts.loadNextImg(pos+1);

			           	while (i--) {
			             	nav.eq(i).removeClass('current');
			           	}
		           		nav.eq(pos).addClass('current');
					}
				}
				/*预读第二张图片*/
				_ts.loadNextImg(1);
				/*合并调用参数，和插件参数*/
				opts = $.extend( {}, _ts.options, opts );

				return swipe(elem, opts);
			})
		}

		Slider.prototype.loop = function(){
			var _ts = this;
			//异步加载swipe_loop.js
			require.async('swipe-loop', function(swipe_loop){
				var elem = $(_ts.selector).get(0),
					con = $(_ts.selector).find(".m-slider-con"),
					nav = $(_ts.selector).find(".m-slider-trigger").children();

				/*插件自定义参数*/
				var opts = {
					callback: function(pos){
						var i = nav.length;

						while(i--){
							con.eq(i).removeClass('current');
			             	nav.eq(i).removeClass('current');
			            }

			           	_ts.loadNextImg(pos+1);
						con.eq(pos).addClass('current');
		           		nav.eq(pos).addClass('current');
					}
				}

				/*预读第二张图片*/
				_ts.loadNextImg(1);
				_ts.loadNextImg(nav.length-1);
				/*合并调用参数，和插件参数*/
				opts = $.extend( {speed : 300}, _ts.options, opts );
				return swipe_loop($(elem), opts);

			});
		}

		Slider.prototype.loadNextImg = function(index){
			var _ts = this,
				_img = $(_ts.selector).find(".m-slider-con").eq(index).find('img');

			_img.attr('src',function(){
				return $(this).attr('data-src');
			});
		}
		
	}

	//exports
	module.exports = Slider; 
});



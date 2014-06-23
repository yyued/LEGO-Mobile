define(function(require, exports, module) {
	var $ = require("zepto"),
		MO = require("MO"),
		Panel = require("panel"),
		widgetData = require("../js/data.js");


	$(function(){

		var	qWidth = $(window).width(),				//页面宽度
			listSection = $("#ListControl"),		//列表控制DOM
			contentSection = $("#ContentControl"),	//内容控制DOM
			widgetData = window.widgetData;			//插件数据

		//移动端页面初始化同时生成Panel实例
		if(qWidth < 720){
			var PanelInstance = contentSection.Panel({
				targetContent : listSection,
				displayMode : 'push',
				direction : 'right'
			});
		}

		if(navigator.userAgent.match(/ipad/ig)){
            $('#TargetFrame').wrap(function(){
                var $this = $(this);
                return $('<div />').css({
                    width: $this.width(),
                    height: $this.height(),
                    overflow: 'scroll',
                    '-webkit-overflow-scrolling': 'touch'
                });
            });
		}

		//列表点击响应
		$("#ListControl").on("click", ".list-node", function(e){
			var _href = $(this).attr('href');

			if(qWidth > 720){
				$(this).parent().toggleClass('active');
			}
			location.hash = _href;
			e.preventDefault();
		}).on("click", ".list-expand a", function(e){
			e.preventDefault();
			$("#TargetFrame").attr("src", $(this).attr("href"));
		})

		//返回按钮点击响应
		$(".bt-return").click(function(e){
			location.hash = '';
		});

		//主页面控制
		var controlPage = function(){
			var widgetName = location.hash.replace('#',''),
				_html = "<ul>";

			if(qWidth < 720){
				if(widgetName === ''){
					PanelInstance.close();
					contentSection.hide();
					$(".bt-return").hide();
				}else{
					window.scrollTo(0,0);
					PanelInstance.open();
					$(".bt-return").show();
					widgetData[widgetName].forEach(function(item, index){
						_html += '<li><a href="' + item.href + '">' + item.title + '</a></li>';
					});
					_html += '</ul>';

					contentSection.find(".legoMo-sidelist ul").remove();
					contentSection.find(".legoMo-sidelist").append(_html);
				}
			}else{
				_html = '<div class="list-expand"><ul>';
				if(widgetName != '' && $('[href="'+widgetName+'"]').parent().find(".list-expand").length === 0){
					widgetData[widgetName].forEach(function(item, index){
						_html += '<li><a href="' + item.href + '">' + item.title + '</a></li>';
					});
					_html += '</div></ul>';
					$('[href="'+widgetName+'"]').parent().append(_html);
				}
			}
		}
		window.onhashchange = function(e){
			controlPage();
		}
		controlPage();

		//返回顶部按钮初始化
		MO.initScrollTop();
	});
});


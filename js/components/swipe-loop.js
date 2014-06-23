/*
 * Swipe_Loop 1.0
*/

define(function(require, exports, module) {

    var Swipe_Loop = function(container, options){

        var noop = function(){};
        var offloadFn = function(fn){ 
            setTimeout(fn || noop, 0); 
        };

        var ua = navigator.userAgent.toLowerCase();

        // 检测当前浏览器对(addEventListener、touch、transitions)支持情况
        var browser = {
            addEventListener : !!window.addEventListener,
            touch : ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch,
            transitions : (function(temp){
                var props = ['transitionProperty', 'WebkitTransition', 'MozTransition', 'OTransition', 'msTransition'];
                for (var i in props) if (temp.style[props[i]] !== undefined) return true;
                return false;
            })(document.createElement('swipe'))
        };

        // 根节点元素(container)不存在时退出
        if (!container) return;
        
        // 标示当前是否只有2个slide
        var flag = false;

        var element = container[0].children[0];
        var slides,
            slidePos,
            width;
        options = options || {};
        var index = parseInt(options.startSlide, 10) || 0;
        var speed = options.speed || 300;
        options.disableTouch = (options.disableTouch !== undefined) ? options.disableTouch : false;

        var opts = {
            startSlide : 0,
            speed : 300,
            auto : 0,
            disableTouch : (options.disableTouch !== undefined) ? options.disableTouch : false,
            disableScroll : (options.disableScroll !== undefined) ? options.disableScroll : false,
            stopPropagation : false,
            callback : ''
        };

        var init = function(){
            slides = element.children;
            // 如果只有一张焦点图则设置continuous值为false
            if (slides.length < 2) {
            } else{
                build();
                move(1,0);
            }
        };

        //html重构
        var build = function(){
            var add_last_con = element.children[slides.length-1].cloneNode(true);
            var add_first_con = element.children[0].cloneNode(true);
            add_last_con.className += ' add_con';
            add_first_con.className += ' add_con';

            //把最后一张图片复制一份插入到第一张图片前
            element.insertBefore(add_last_con,element.children[0]);

            //把第一张图片复制一份插入到最后一张图片后
            element.appendChild(add_first_con);

            //选中状态
            // element.children[1].className += ' cur';

            //确定每个幻灯片的宽度
            width = slides[0].getBoundingClientRect().width || slides.offsetWidth;
            element.style.width = (slides.length * width ) + 'px';
            // 创建一个数组来存储每个幻灯片当前位置
            slidePos = new Array(slides.length);
        };
        var next = function(){
            if (options.continuous) {
                move(index + 1, speed);
            }else if (index < slides.length - 1) {
                move(index + 1, speed);
            }
        };

        var circle = function(index){
            return (slides.length + (index % slides.length)) % slides.length;
        };

        var move = function(i, speed){
            translate(-i*width, speed);
            index=i;
            //callback
            options.callback(index-1);
        };

        var translate = function(dist, speed){
            var style = element && element.style;

            // 指定对象过渡持续的时间(默认值是0，意味着不会有效果)
            style.webkitTransitionDuration = 
            style.MozTransitionDuration = 
            style.msTransitionDuration = 
            style.OTransitionDuration = 
            style.transitionDuration = speed + 'ms';

            // 定义3D转换，沿着X轴移动元素
            if (ua.indexOf('gt-') != -1) {
                style.webkitTransform = 'translateX(' + dist + 'px)';
            } else {
                style.webkitTransform = 'translate(' + dist + 'px,0)' + 'translateZ(0)';
            }
            style.msTransform = 
            style.MozTransform = 
            // 定义2D转换，沿着X轴移动元素
            style.OTransform = 'translateX(' + dist + 'px)';
        };

        // 设置自动幻灯片
        var delay = options.auto || 0;
        var interval;

        function begin(){
            if (index == slides.length - 1){
                index = 1;
                move(index,0);
                interval = setTimeout(next, delay);
            } else{
                interval = setTimeout(next, delay);
            }
        }

        function stop(){
            delay = 0;
            clearTimeout(interval);
        }

        var start = {};
        var delta = {};
        var isScrolling;

        // 设置事件捕获
        var events = {
            handleEvent : function(event){
                switch (event.type) {
                    case 'touchstart' : this.start(event); break;
                    case 'touchmove' : this.move(event); break;
                    case 'touchend' : offloadFn(this.end(event)); break;
                    case 'webkitTransitionEnd' :
                    case 'msTransitionEnd' :
                    case 'oTransitionEnd' :
                    case 'otransitionend' :
                    case 'transitionend' : offloadFn(this.transitionEnd(event)); break;
                    case 'resize' : offloadFn(move(index,0)); break;
                }

                if (options.stopPropagation) event.stopPropagation();
            },
            start : function(event){
                if (options.disableTouch) return;

                var touches = event.touches[0];

                // 获取初始的触摸变量值
                start = {
                    // 获取初始的触摸坐标
                    x : touches.pageX,
                    y : touches.pageY,
                    // 用来确定触摸持续时间
                    time : +new Date()
                };

                // 用于检测第一次move事件
                isScrolling = undefined;

                // 添加touchmove、touchend事件监听
                element.addEventListener('touchmove', this, false);
                element.addEventListener('touchend', this, false);
            },
            move : function(event){
                if (options.disableTouch) return;

                // 确保单点触摸滑动
                if (event.touches.length > 1 || event.scale && event.scale !== 1) return;

                if (options.disableScroll) event.preventDefault();

                var touches = event.touches[0];

                // 获取滑动触摸在X、Y轴的变化值
                delta = {
                    x : touches.pageX - start.x,
                    y : touches.pageY - start.y
                };

                // 检测是否是垂直滚动
                if (typeof isScrolling == 'undefined') {
                    isScrolling = !!(isScrolling || Math.abs(delta.x) < Math.abs(delta.y));
                }

                // 如果不是垂直滚动
                if (!isScrolling) {
                    // 阻止默认滚动
                    event.preventDefault();

                    // 停止幻灯片
                    stop();
                    if(typeof slidePos[index] == 'undefined'){
                        slidePos[index] = 0 ;
                    }
                    translate(delta.x - index*width, 0);
                }
            },
            end : function(event){
                if (options.disableTouch) return;

                if (typeof isScrolling == 'undefined') return;

                // 获取幻灯片触摸持续时间
                var duration = +new Date() - start.time;
                // 确定是否触发上一个或下一个幻灯片
                // 如果幻灯片触摸持续时间小于250ms 
                // 并且在X轴方向触摸滑动距离大于20px 
                // 或者如果在X轴方向触摸滑动距离大于幻灯片宽度的一半
                var isValidSlide = Number(duration) < 250  && Math.abs(delta.x) > 20  || Math.abs(delta.x) > width / 2;
                    
                // 幻灯片试图确定是否是过去的开始和结束
                // 如果是第一个slide并且向右滑动
                // 或者是最后一个slide并且向左滑动
                var isPastBounds = !index && delta.x > 0 || index == slides.length - 1 && delta.x < 0;   

                if (!isScrolling) {
                    if (isValidSlide) {
                        // 检测swipe滑动方向(true : 向左, false : 向右)
                        if(delta.x < 0){
                            index += 1;
                            move(index,speed);
                            if(index == slides.length-1){
                                setTimeout(function(){
                                    index = 1;
                                    move(index,0);
                                },200);
                            }
                        }else{
                            index -= 1;
                            move(index,speed);
                            if(index === 0){
                                setTimeout(function(){
                                    index = slides.length-2;
                                    move(index,0);
                                },200);
                            }
                        }
                    } else{
                        move(index,speed);
                    }
                }                

                // 当touchstart事件再次被触发时，移除touchmove、touchend事件监听
                element.removeEventListener('touchmove', events, false);
                element.removeEventListener('touchend', events, false);
            },
            transitionEnd : function(event){
                if (delay) {
                    begin();
                }
            }
        };

        // 触发init
        init();

        // 启动自动幻灯片(如果可适用)
        if (delay) begin();

        // 添加事件监听
        if (browser.addEventListener) {
            // 给element绑定touchstart事件
            if (browser.touch) element.addEventListener('touchstart', events, false);

            if (browser.transitions) {
                element.addEventListener('webkitTransitionEnd', events, false);
                element.addEventListener('msTransitionEnd', events, false);
                element.addEventListener('oTransitionEnd', events, false);
                element.addEventListener('otransitionend', events, false);
                element.addEventListener('transitionend', events, false);
            }

            // 给window绑定resize事件
            window.addEventListener('resize', events, false);
        } else {
            // 兼容老版本IE
            window.onresize = function(){ init(); };
        }
    };

    module.exports = function(container, opts){
        return new Swipe_Loop(container, opts);
    };
});
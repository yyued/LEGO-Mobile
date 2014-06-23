define('pop',['zepto'],function(require, exports, module) {
    var $ = require("zepto");

    //pop
    var pop = function(opts){
        //默认参数
        var defOpts = {
            /**
             * 弹出框标题
             * @property {String} [title=null]
             */
            title : null,
            /**
             * 参照对象
             * @property {String} [ref=null]
             */
            ref     : null,     //参照目标
            /**
             * 参照对象高度
             * @property {Number} [refTop=0]
             */
            refTop  : 0,
            /**
             * 定位方向
             * @property {string} [pos='']
             */
            pos     : '',
            /**
             * 是否显示关闭按钮
             * @property {Boolean} [isClose=true]
             */
            isClose : true,
            /**
             * 是否在弹出的时候禁用scroll
             * @property {Boolean} [scrollMove=false]
             */
            scrollMove : false,
            /**
             * 弹出框内容
             * @property {String} [con=null]
             */
            con     : '',
            /**
             * 弹出框上的按钮
             * @property {Array} [btns=[{text : '关闭', handler : 'close'}]]
             */
            btns : [{           //按钮
                text : '关闭',
                handler : 'close'
            }],
            /**
             * 弹出框显示完后的回调函数
             * @type {function}
             */
            onShow : function(){},
            /**
             * 弹出框关闭后的回调函数
             * @type {function}
             */
            onClose : function(){}
        };
        this.opts = $.extend(defOpts, opts); 
        this.init();
    };

    //初始化
    pop.prototype.init = function(){
        var _ts = this, 
            opts = this.opts;
        //基础属性
        _ts.id = opts.id || 'pop-'+uuid();    //自动设置id
        _ts.body = $('body');             //body
        _ts.bodyH = _ts.body.get(0).scrollHeight;   //body height
        _ts.win = $(window);                    //window
        _ts.winH = _ts.win.height();            //window height
        _ts.winS = _ts.body.get(0).scrollTop;   //scrollTop
        _ts.render();   //渲染
    };

    //定位
    pop.prototype.position = function(){
        var _ts = this, 
            opts = _ts.opts, 
            winH = _ts.winH, 
            winS = _ts.winS, 
            popH = _ts.popH,
            bodyH = _ts.bodyH,
            scrTop = 0, //滚动位置
            popTop = 0; //pop top

        if(opts.pos === 'center'){
            //居中
            if(popH > winH){    //弹层高度大于窗口高度
                popTop = winS + 40;
            }else{
                popTop = winS + (winH-popH)/2;
            }
        }else{
            //偏移参考目标
            if (typeof opts.ref === "string" || opts.ref instanceof String) {
                opts.ref = $(opts.ref);
            }
            var refOffset = opts.ref.offset();
            popTop = refOffset.top + refOffset.height + opts.refTop;
            var popAllH = popTop + popH;

            //window scrollTop
            if(popAllH > bodyH){    //body的高度不能弹出层的高度时
                popTop = bodyH - popH - 40;
            }
        }

        //pop定位
        _ts.pop.css({'top':popTop});

        //scrollTop
        if(popH > winH ){
            //当窗口少于弹窗高度，弹窗上留40px
            scrTop = popTop - 40 - winS;
            popToTop(scrTop, winS);
        }else{
            if(winS > popTop){
                scrTop = popTop - 40 - winS;
                popToTop(scrTop, winS);
            }else if((popH + popTop - winH - winS) > 0){
                //当弹窗显示不完时，窗口滑动让弹窗居中显示
                var scrtop = popTop + popH/2 - winH/2 - winS;
                popToTop(scrtop, winS);
            }
        } 
    };

    //渲染按钮
    pop.prototype.renderBtn = function(btns, _ts){
        var btnHtml = '',
            len = btns.length>2 ? 2 : btns.length,  //最多显示2个按钮
            close = function(){
                _ts.remove();
            };

        if(len > 0){
            for(var i=0, l=len; i<l; i++){
                var ret = btns[i];
                if(typeof ret === 'object' && typeof ret.text !=='undefined'){
                    //按钮
                    var btn = '';
                    if(typeof ret.href !== 'undefined'){
                        btn = '<span data-i="'+i+'"><a href="'+ret.href+'">'+ret.text+'</a></span>';
                    }else{
                        btn = '<span data-i="'+i+'">'+ret.text+'</span>';
                    }
                    btnHtml += btn;

                    //回调方法
                    btns[i].handler = (typeof btns[i].handler !== 'undefined' && btns[i].handler === 'close') ? close : btns[i].handler;
                }
            }
            return '<div class="pop-ft">'+btnHtml+'</div>';
        }else{
            return '';
        }
    };

    //渲染
    pop.prototype.render = function(){
        var _ts = this,
            opts = _ts.opts,
            titleEl = opts.title ? '<div class="pop-hd">'+opts.ti+'</div>' : '',
            closeEl = opts.isClose ? '<span class="pop-close"><i>关闭</i></span>' : '',
            btnsEl = _ts.renderBtn(opts.btns, _ts),
            conEl = '';

        //消息
        if(typeof opts.msg !== 'undefined'){
            conEl = '<div class="pop-msg">'+opts.msg+'</div>';
        }else if(typeof opts.con !== 'undefined'){
            if($.isFunction(opts.con)){ //fun
                conEl = opts.con(_ts);
            }else{ //string
                conEl = opts.con;
            }
        }

        //组装
        var html = '<div id="'+_ts.id+'" class="pop-mod" style="visibility:hidden;">'+titleEl+'<div class="pop-bd">'+conEl+'</div>'+btnsEl+closeEl+'</div>',
            $popWrap = $('#pop-dialogs'),
            $popOver = $('#pop-overlay');

        if($popWrap.size() === 0 && $popOver.size() === 0){
            _ts.body.append('<div id="pop-dialogs">'+html+'</div><div id="pop-overlay" style="height:'+_ts.bodyH+'px;display:none;"></div>');
            $popOver = $('#pop-overlay');
        }else{
            $popWrap.html(html);
        }

        var $pop = _ts.pop = $('#'+_ts.id);
        _ts.popOver = $popOver;
        _ts.popH = $pop.offset().height;
        opts.pos = (opts.ref === null)? 'center' : opts.pos;

        //定位
        _ts.position();
              
        //显示
        $popOver.show();
        $pop.css('visibility','visible');

        //绑定事件
        //防止点击按钮瞬间的点透问题，故做了400ms延迟
        setTimeout(function(){
            _ts.bind();
        }, 400);

    };

    //绑定事件
    pop.prototype.bind = function(){
        var _ts = this, opts = _ts.opts;

        //执行onShow
        opts.onShow(_ts.pop, _ts);

        //btns
        var btns = opts.btns;
        _ts.pop.on('click', '.pop-ft span', function(){
            var i = $(this).attr('data-i'); 
            if($.isFunction(btns[i].handler)){
                btns[i].handler(_ts.pop, _ts);
            }
        });

        //close
        if(opts.isClose){
            _ts.pop.on('click', '.pop-close', $.proxy(this.remove, _ts));
        }

        _ts.pop.on('click', 'a', $.proxy(this.remove, _ts));

        //旋转屏幕
        _ts.win.bind('orientationchange',function(e){
            _ts.body.css('height','auto');
            _ts.bodyH = _ts.body.get(0).scrollHeight;
            //_ts.body.height(_ts.bodyH);
            _ts.popOver.height(_ts.bodyH);
            _ts.winH = _ts.win.height();            
            _ts.winS = _ts.body.get(0).scrollTop;  
            _ts.position();
        });

        $(window).on('touchmove', function(e){
            opts.scrollMove && e.preventDefault();
        })
    };

    //重设
    pop.prototype.reset = function(){
        var _ts = this;
        _ts.popH = _ts.pop.offset().height;
        _ts.position();
    };

    //移除
    pop.prototype.remove = function(){
        var _ts = this;

        //执行onClose
        if($.isFunction(_ts.opts.onClose)){
            _ts.opts.onClose(_ts.pop, _ts);
        }

        _ts.pop.remove();
        _ts.popOver.hide().height(_ts.bodyH);
        //_ts.body.height(_ts.bodyH);
        _ts.win.unbind('orientationchange');
        _ts = null;
    };

    //uuid
    var uuid = function(){
        var S4 = function() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    };

    //页面滑动
    var popToTop = function(h,s){
        var nav_t = 0;
        var nav_d = 30;  //速度
        var nav_c = h;   //高度
        var nac = $('body').get(0);
        var popSc = function(t,b,c,d){
            return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
        };
        function down(){
            if(nav_t<nav_d){
                nav_t++;
                nac.scrollTop = Math.ceil(popSc(nav_t,0,nav_c,nav_d))+s;
                setTimeout(down, 20);
            }
        }
        down();
    };

    //注册$插件
    $.fn.pop = function (opts) {
        opts = $.extend(opts, { ref : this[0] });
        return new pop(opts);
    };

    module.exports = function(opts){
        return new pop(opts);
    };

});

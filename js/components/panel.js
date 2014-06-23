define('panel',['zepto'],function(require, exports, module) {
	var $ = require("zepto");

	var transform = $.fx.cssPrefix + 'transform',
        transitionEnd = $.fx.transitionEnd;

    var Panel = function(options){
    	var defaultOptions = {
    		targetContent : '',
    		displayMode : 'push',
    		direction : 'left',
    		autoDismiss : true
    	}

        //扩展options
    	this.options = $.extend(defaultOptions, options);

        //Panel对象
        this.el = arguments[0].ref;

        //Content对象
        this.cont = this.options.targetContent;

        //Panel宽度
        this.width = ($(this.el).width() === 0 ? window.innerWidth : $(this.el).width());

        //Panel打开状态，默认为false(关闭)
        this.isOpen = false;

        //初始化
        this.init();
    }

    //初始化Panel
    Panel.prototype.init = function(){
    	var _ts = this,
    		_opts = _ts.options,
            _pos = _ts.getPosition()[_opts.displayMode];


        $(_ts.el).addClass('m-panel m-panel--'+ _opts.direction);

        $(_ts.el).css(transform, 'translate3d('+_ts.transDirectionToPos(_opts.direction, _pos.panel[Number(_ts.isOpen)])+'px,0,0)').hide();

    	$(_ts.cont).addClass('m-panel--animate');

        //触发页面reflow
        $(_ts.cont).get(0).clientLeft;
    }

    Panel.prototype.controlPanel = function(status){
        var _ts = this,
            _opts = _ts.options,
            _pos = _ts.getPosition()[_opts.displayMode];

        $(_ts.el).addClass('m-panel--animate').show();

        $(_ts.el).css(transform, 'translate3d('+_ts.transDirectionToPos(_opts.direction, _pos.panel[Number(status)])+'px,0,0)');

        $(_ts.cont).css(transform, 'translate3d('+_ts.transDirectionToPos(_opts.direction, _pos.cont[Number(status)])+'px,0,0)');

        _ts.isOpen = !_ts.isOpen;
    }

    Panel.prototype.transDirectionToPos = function(direct, val){
        return direct === 'left' ? val : -val;
    }

    Panel.prototype.getPosition = function(){
        var _ts = this,
            _width = _ts.width;
        return {
            push: {
                panel: [-_width, 0],
                cont: [0, _width]
            },
            overlay: {
                panel: [-_width, 0],
                cont: [0, 0]
            }
        }
    }

    //打开Panel
    Panel.prototype.open = function(){
        return this.controlPanel(true);
    }

    //关闭Panel
    Panel.prototype.close = function(){
        return this.controlPanel(false);
    }

    //切换Panel的打开或关闭状态
    Panel.prototype.toggle = function(){
        return this[this.isOpen ? 'close' : 'open']();
    }

    //注册$插件
    $.fn.Panel = function (opts) {
        opts = $.extend(opts, { ref : this[0] });
        return new Panel(opts);
    };

    module.exports = function(opts){
    	return new Panel(opts);
    }
});
define('refresh',['zepto','iscroll-probe'],function(require, exports, module) {
	var $ = require("zepto"),
		IScroll = require("iscroll-probe");

	var Refresh = function(options){

		var defaultOptions = {
			afterRefresh: null,
			threshold: 30
    	}

    	this.options = $.extend(defaultOptions, options);

    	this.$el = arguments[0].el;

    	this.init();
	}

	Refresh.prototype.init = function(){
		var _ts = this,
			opts = _ts.options;

		$.each(['up','down'], function(i, dir){
			//设置初始加载状态为可用
			_ts.status(dir, true);

			opts.refreshInfo || (opts.refreshInfo = {});
			opts.refreshInfo[dir] = {
				$icon: $(".m-refresh-"+dir).find('.m-refresh-icon'),
				$label: $(".m-refresh-"+dir).find('.m-refresh-label'),
				text: $(".m-refresh-"+dir).find('.m-refresh-label').html()
			}
		});

		_ts.initIScroll();
	}

	//初始化IScroll
	Refresh.prototype.initIScroll = function(){
		var _ts = this,
			opts = _ts.options,
			$el = _ts.$el;

		opts.iScroll = new IScroll($el,{
			probeType: 3,
			mouseWheel: true
		});

		opts.iScroll.on('scrollStart', function(){
		});

		opts.iScroll.on('scroll', function(){

			var upStatus = _ts.status('up'),
				downStatus = _ts.status('down'),
				upRefreshed = opts['upRefreshed'],
				downRefreshed = opts['downRefreshed'];

			//上边按钮，下拉加载
			if(upStatus && !upRefreshed && this.y > opts.threshold){
				_ts.setMoveState('up', 'beforeload');
			}

			//上边按钮，下拉恢复
			else if(upStatus && upRefreshed && this.y < opts.threshold){
				_ts.setMoveState('up', 'loaded');
			}

			//下边按钮，上拉加载
			else if(downStatus && !downRefreshed && this.y < (this.maxScrollY - opts.threshold)){
				_ts.setMoveState('down', 'beforeload');
			}

			//下边按钮，上拉恢复
			else if(downStatus && downRefreshed && this.y > (this.maxScrollY + opts.threshold)){
				_ts.setMoveState('down', 'loaded');
			}
		});

		opts.iScroll.on('scrollEnd', function(){
			var action = opts.direction;
			if(action && _ts.status(action)) {
				_ts.setStyle(action, 'loading');
				_ts.loadingAction(action)
			}
		});
	}

	/**
     * 用来设置加载是否可用。
     * @param {String} direction 加载的方向（'up' | 'down'）
     * @param {String} status 状态（true | false）
     */
	Refresh.prototype.status = function(direction, status){
		var opts = this.options;

		return status === undefined ? opts[direction+'Open'] : opts[direction+'Open'] = !!status;
	}

	/**
     * 当组件调用load，在load中通过ajax请求内容回来后，需要调用此方法，来改变refresh状态。
     * @method afterDataLoading
     * @param {String} direction 加载的方向（'up' | 'down'）
     * @chainable
     * @return {self} 返回本身。
     */
	Refresh.prototype.setStyle = function(direction, state){
		var _ts = this,
			opts = _ts.options;
			refreshInfo = opts.refreshInfo[direction];

		switch (state){
			case 'loaded':
				refreshInfo['$label'].html(refreshInfo['text']);
				refreshInfo['$icon'].removeClass().addClass('m-refresh-icon');
				break;
			case 'loading':
				refreshInfo['$label'].html('加载中...');
				refreshInfo['$icon'].addClass('m-loading');
				break;
			case 'disable':
				refreshInfo['$label'].html('没有更多内容了');
				break;
			case 'beforeload':
				refreshInfo['$label'].html('松开立即加载');
				refreshInfo['$icon'].addClass('m-refresh-flip');
				break;
		}
	}

	Refresh.prototype.setMoveState = function(direction, state){
		var _ts = this,
			opts = _ts.options;

		_ts.setStyle(direction, state);
		opts['direction'] = direction;
	}

	Refresh.prototype.loadingAction = function(direction, type){
		var _ts = this,
			opts = _ts.options,
			loadFn = opts.afterRefresh;

		$.isFunction(loadFn) && loadFn.call(_ts, direction, type);
		_ts.status(direction, false);

		return _ts;
	}

	/**
     * 当组件调用afterRefresh，通过ajax请求内容回来后，需要调用此方法，来改变refresh状态。
     * @method afterRefreshLoading
     * @param {String} direction 加载的方向（'up' | 'down'）
     * @return {self} 返回本身。
     */
	Refresh.prototype.afterRefreshLoading = function(direction){
		var _ts = this,
			opts = _ts.options,
			dir = dir || opts['direction'];

        opts.iScroll.refresh();
        opts[direction+'Refreshed'];

		_ts.setStyle(direction, 'loaded');
		_ts.status(direction, true);

		return _ts;
	}

	//注册$插件
    $.fn.Refresh = function (opts) {
        opts = $.extend(opts, { el : this[0] });
        return new Refresh(opts);
    };

    module.exports = function(opts){
    	return new Refresh(opts);
    }
});



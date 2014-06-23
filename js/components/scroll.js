define('scroll',['iscroll'],function(require, exports, module) {
	var IScroll = require("iscroll");

	var scroll = function(selector, options){
		var myscroll = new IScroll(selector, options);

		return myscroll;
	}

	//exports
	module.exports = scroll;
});



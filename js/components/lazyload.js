define('lazyload',['zepto'],function(require, exports, module) {

    var $ = require('zepto'),
        $window = $(window);

    $.fn.lazyload = function(options) {
        var elements = this;
        var $container;
        var settings = {
            threshold: 0,
            failure_limit: 0,
            event: "scroll",
            container: window,
            attr: "osrc",
            appear: null,
            loaded: null
        };

        if (options) {
            $.extend(settings, options);
        }

        /* Cache container as jQuery as object. */
        $container = settings.container === undefined || settings.container === window ? $window : $(settings.container);

        var dealDelay = null,
            scrollEvent = function(event){
                if(dealDelay){
                    clearTimeout(dealDelay);
                }
                dealDelay = setTimeout(update, 50);
            };

        var update = function() {

            //如果为空，清除scrll事件
            if(elements.length <= 0){
                $container.off(settings.event, scrollEvent);
                return;
            }

            var counter = 0;
            elements.each(function() {
                var $this = $(this);
                if ($.abovethetop(this, settings)) {} else if (!$.belowthefold(this, settings)) {
                    $this.trigger("appear");
                    counter = 0;
                } else {
                    if (++counter > settings.failure_limit) {
                        return false;
                    }
                }
            });
        };

        /* if we found an image we'll load, reset the counter */
        /* Fire one scroll event per scroll. Not one scroll event per image. */
        if (0 === settings.event.indexOf("scroll")) {
            $container.on(settings.event, scrollEvent);
        }

        this.each(function() {
            var self = this;
            var $self = $(self);
            self.loaded = false;
            $self.one("appear", function() {
                if (!self.loaded) {
                    if ($.isFunction(settings.appear)) {
                        var elements_left = elements.length;
                        settings.appear.call(self, elements_left, settings);
                    }
                    $("<img />").on("load", function() {
                        if(self.tagName === 'IMG'){
                            $self.hide().attr("src", $self.data(settings.attr)).show();
                        }else{
                            $self.css('background-image', 'url('+$self.data(settings.attr)+')');
                        }
                        self.loaded = true;
                        var temp = $.grep(elements, function(element) {
                            return !element.loaded;
                        });
                        elements = $(temp);
                        if ($.isFunction(settings.loaded)) {
                            var elements_left = elements.length;
                            settings.loaded.call(self, elements_left, settings);
                        }
                    }).attr("src", $self.data(settings.attr));
                }
            });

            /* When wanted event is triggered load original image */
            /* by triggering appear.                              */
            if (0 !== settings.event.indexOf("scroll")) {
                $self.on(settings.event, function(event) {
                    if(!self.loaded){
                        $self.trigger("appear");
                    }
                });
            }
        });

        /* Check if something appears when window is resized. */
        $window.on("resize", function() {
            update();
        });

        /* Force initial check if images should appear. */
        $window.on("load", function() {
            update();
        });

        /* With IOS5 force loading images when navigating with back button. */
        /* Non optimal workaround. */
        if (/iphone|ipod|ipad.*os 5/gi.test(navigator.appVersion)) {
            $window.on("pageshow", function(event) {
                if (event.originalEvent && event.originalEvent.persisted) {
                    elements.each(function() {
                        $(this).trigger("appear");
                    });
                }
            });
        }

        return this;
    };

    /* Convenience methods in jQuery namespace.*/
    /* Use as  $.belowthefold(element, {threshold : 100, container : window}) */
    $.belowthefold = function(element, settings) {
        var fold;
        if (settings.container === undefined || settings.container === window) {
            fold = $window.height() + $window.scrollTop();
        } else {
            fold = $(settings.container).offset().top + $(settings.container).height();
        }
        return fold <= $(element).offset().top - settings.threshold;
    };

    $.abovethetop = function(element, settings) {
        var fold;
        if (settings.container === undefined || settings.container === window) {
            fold = $window.scrollTop();
        } else {
            fold = $(settings.container).offset().top;
        }
        return fold >= $(element).offset().top + settings.threshold + $(element).height();
    };

});

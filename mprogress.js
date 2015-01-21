/* MProgress  from NProgress
 * @license MIT */

;(function(root, factory) {
    // UMD
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.MProgress = factory();
    }

})(this, function() {
    var MProgress = {};

    MProgress.version = '0.1.0';

    var Settings = MProgress.settings = {
        minimum: 0.08,
        easing: 'ease',
        positionUsing: '',
        speed: 200,
        trickle: true,
        trickleRate: 0.02,
        trickleSpeed: 800,
        barSelector: '[role="bar"]',
        dashedSelector: '[role="dashed"]',
        parent: 'body',
        template: 3
    };

    var renderTemplate = {
        determinate: '<div class="deter-bar" role="bar"><div class="peg"></div></div><div class="bar-bg"></div>',
        indeterminate: '<div class="indeter-bar" role="bar"><div class="peg"></div></div><div class="bar-bg"></div>',
        buffer: '<div class="deter-bar" role="bar"><div class="peg"></div></div><div class="buffer-bg"></div><div class="mp-ui-dashed" role="dashed"></div>',
        query: ''
    };

    /**
     * Updates configuration.
     *
     *     MProgress.config({
     *       minimum: 0.1
     *     });
     */
    MProgress.config = function(options) {
        var key, value;
        for (key in options) {
            value = options[key];
            if (value !== undefined && options.hasOwnProperty(key)) Settings[key] = value;
        }

        return this;
    };

    /**
     * Last number.
     */

    MProgress.status = null;


    /**
     * setProgress
     *
     * @param barSelector
     * @return {undefined}
     */

    MProgress.setProgress = function(barSelector, n){
        var started  = MProgress.isStarted(),
            progress = MProgress.render(!started),
            bar      = progress.querySelector(barSelector),
            speed    = Settings.speed,
            ease     = Settings.easing;

        progress.offsetWidth; /* Repaint */ 
        
        queue(function(next) {
            // Set positionUsing if it hasn't already been set
            if (Settings.positionUsing === '') Settings.positionUsing = MProgress.getPositioningCSS();

            // Add transition
            css(bar, barPositionCSS(n, speed, ease));

            if (n === 1) {
                // Fade out
                css(progress, { 
                    transition: 'none', 
                    opacity: 1 
                });
                progress.offsetWidth; /* Repaint */

                setTimeout(function() {
                    css(progress, { 
                        transition: 'all ' + speed + 'ms linear', 
                        opacity: 0 
                    });
                    setTimeout(function() {
                        MProgress.remove();
                        next();
                    }, speed);
                }, speed);
            } else {
                setTimeout(next, speed);
            }
        });


    }

    /**
     * Sets the progress bar status, where `n` is a number from `0.0` to `1.0`.
     *
     *     MProgress.set(0.4);
     *     MProgress.set(1.0);
     */

    MProgress.set = function(n) {
        n = clamp(n, Settings.minimum, 1);
        MProgress.status = (n === 1 ? null : n);
        
        MProgress.setProgress(Settings.barSelector, n);
       
        return this;
    };

    MProgress.isStarted = function() {
        return typeof MProgress.status === 'number';
    };

    /**
     * Shows the progress bar.
     * This is the same as setting the status to 0%, except that it doesn't go backwards.
     *
     *     MProgress.start();
     *
     */
    MProgress.start = function() {
        if (!MProgress.status) MProgress.set(0);

        // buffer show front dashed scroll
        if (~~Settings.template === 3) {
            var started  = MProgress.isStarted(),
                progress = MProgress.render(!started),
                dashed   = progress.querySelector(Settings.dashedSelector);
            addClass(dashed, 'active');
            setTimeout(function(){
                hideEl(dashed);
                removeClass(dashed, 'active');
                showEl(dashed);
            }, 3000);
        }

        var work = function() {
            setTimeout(function() {
                if (!MProgress.status) return;
                MProgress.trickle();
                work();
            }, Settings.trickleSpeed);
        };

        if (Settings.trickle) work();

        return this;
    };

    /**
     * Hides the progress bar.
     * This is the *sort of* the same as setting the status to 100%, with the
     * difference being `done()` makes some placebo effect of some realistic motion.
     *
     *     MProgress.done();
     *
     * If `true` is passed, it will show the progress bar even if its hidden.
     *
     *     MProgress.done(true);
     */

    MProgress.done = function(force) {
        if (!force && !MProgress.status) return this;

        return MProgress.inc(0.3 + 0.5 * Math.random()).set(1);
    };

    /**
     * Increments by a random amount.
     */

    MProgress.inc = function(amount) {
        var n = MProgress.status;

        if (!n) {
            return MProgress.start();
        } else {
            if (typeof amount !== 'number') {
                amount = (1 - n) * clamp(Math.random() * n, 0.1, 0.95);
            }

            n = clamp(n + amount, 0, 0.994);
            return MProgress.set(n);
        }
    };

    MProgress.trickle = function() {
        return MProgress.inc(Math.random() * Settings.trickleRate);
    };

    /**
     * Waits for all supplied jQuery promises and
     * increases the progress as the promises resolve.
     * 
     * @param $promise jQUery Promise
     */
    (function() {
        var initial = 0, current = 0;

        MProgress.promise = function($promise) {
            if (!$promise || $promise.state() == "resolved") {
                return this;
            }

            if (current == 0) {
                MProgress.start();
            }

            initial++;
            current++;

            $promise.always(function() {
                current--;
                if (current == 0) {
                    initial = 0;
                    MProgress.done();
                } else {
                    MProgress.set((initial - current) / initial);
                }
            });

            return this;
        };

    })();

    /**
     * (Internal) renders the progress bar markup based on the `template`
     * setting.
     */

    MProgress.render = function(fromStart) {
        if (MProgress.isRendered()) return document.getElementById('mprogress');

        var progress = document.createElement('div'),
            currTpl  = MProgress.getCurrTemplate() || '',
            bar,
            perc,
            MParent;

        progress.id = 'mprogress';
        progress.innerHTML = currTpl;

        bar      = progress.querySelector(Settings.barSelector);
        perc     = fromStart ? '-100' : toBarPerc(MProgress.status || 0);
        MParent  = document.querySelector(Settings.parent);

        css(bar, {
            transition: 'all 0 linear',
            transform: 'translate3d(' + perc + '%,0,0)'
        });

        if (MParent != document.body) {
            addClass(MParent, 'mprogress-custom-parent');
        }

        MParent.appendChild(progress);
        return progress;
    };

    /**
     * Removes the element. Opposite of render().
     */

    MProgress.remove = function() {
        var progress = document.getElementById('mprogress'),
            MParent   = document.querySelector(Settings.parent);

        if (MParent != document.body) {
            removeClass(MParent, 'mprogress-custom-parent');
        }

        progress && removeElement(progress);
    };

    /**
     * Checks if the progress bar is rendered.
     */

    MProgress.isRendered = function() {
        return !!document.getElementById('mprogress');
    };

    MProgress.getCurrTemplate = function() {
        var tplType = Settings.template || 1,
            tplNameArr = ['determinate', 'indeterminate', 'buffer', 'query'],
            tplKey;

        if (typeof ~~tplType === 'number') {
            tplKey = tplNameArr[tplType - 1];
            return renderTemplate[tplKey] || '';
        }

        if (typeof tplType === 'string') {
            return template;
        }
    };
    
    /**
     * Determine which positioning CSS rule to use.
     */

    MProgress.getPositioningCSS = function() {
        // Sniff on document.body.style
        var bodyStyle = document.body.style;

        // Sniff prefixes
        var vendorPrefix = ('WebkitTransform' in bodyStyle) ? 'Webkit' :
            ('MozTransform' in bodyStyle) ? 'Moz' :
            ('msTransform' in bodyStyle) ? 'ms' :
            ('OTransform' in bodyStyle) ? 'O' : '';

        if (vendorPrefix + 'Perspective' in bodyStyle) {
            // Modern browsers with 3D support, e.g. Webkit, IE10
            return 'translate3d';
        } else if (vendorPrefix + 'Transform' in bodyStyle) {
            // Browsers without 3D support, e.g. IE9
            return 'translate';
        } else {
            // Browsers without translate() support, e.g. IE7-8
            return 'margin';
        }
    };

    /**
     * Helpers
     */

    function clamp(n, min, max) {
        if (n < min) return min;
        if (n > max) return max;
        return n;
    }

    /**
     * (Internal) converts a percentage (`0..1`) to a bar translateX
     * percentage (`-100%..0%`).
     */

    function toBarPerc(n) {
        return (-1 + n) * 100;
    }


    /**
     * (Internal) returns the correct CSS for changing the bar's
     * position given an n percentage, and speed and ease from Settings
     */

    function barPositionCSS(n, speed, ease) {
        var barCSS;

        if (Settings.positionUsing === 'translate3d') {
            barCSS = { transform: 'translate3d('+toBarPerc(n)+'%,0,0)' };
        } else if (Settings.positionUsing === 'translate') {
            barCSS = { transform: 'translate('+toBarPerc(n)+'%,0)' };
        } else {
            barCSS = { 'margin-left': toBarPerc(n)+'%' };
        }

        barCSS.transition = 'all '+speed+'ms '+ease;

        return barCSS;
    }

    /**
     * (Internal) Queues a function to be executed.
     */

    var queue = (function() {
        var pending = [];

        function next() {
            var fn = pending.shift();
            if (fn) {
                fn(next);
            }
        }

        return function(fn) {
            pending.push(fn);
            if (pending.length == 1) next();
        };
    })();

    /**
     * (Internal) Applies css properties to an element, similar to the jQuery 
     * css method.
     *
     * While this helper does assist with vendor prefixed property names, it 
     * does not perform any manipulation of values prior to setting styles.
     */

    var css = (function() {
        var cssPrefixes = [ 'Webkit', 'O', 'Moz', 'ms' ],
        cssProps    = {};

        function camelCase(string) {
            return string.replace(/^-ms-/, 'ms-').replace(/-([\da-z])/gi, function(match, letter) {
                return letter.toUpperCase();
            });
        }

        function getVendorProp(name) {
            var style = document.body.style;
            if (name in style) return name;

            var i = cssPrefixes.length,
            capName = name.charAt(0).toUpperCase() + name.slice(1),
            vendorName;
            while (i--) {
                vendorName = cssPrefixes[i] + capName;
                if (vendorName in style) return vendorName;
            }

            return name;
        }

        function getStyleProp(name) {
            name = camelCase(name);
            return cssProps[name] || (cssProps[name] = getVendorProp(name));
        }

        function applyCss(element, prop, value) {
            prop = getStyleProp(prop);
            element.style[prop] = value;
        }

        return function(element, properties) {
            var args = arguments,
            prop, 
            value;

            if (args.length == 2) {
                for (prop in properties) {
                    value = properties[prop];
                    if (value !== undefined && properties.hasOwnProperty(prop)) applyCss(element, prop, value);
                }
            } else {
                applyCss(element, args[1], args[2]);
            }
        }
    })();

    /**
     * (Internal) Determines if an element or space separated list of class names contains a class name.
     */

    function hasClass(element, name) {
        var list = typeof element == 'string' ? element : classList(element);
        return list.indexOf(' ' + name + ' ') >= 0;
    }

    /**
     * (Internal) Adds a class to an element.
     */

    function addClass(element, name) {
        var oldList = classList(element),
        newList = oldList + name;

        if (hasClass(oldList, name)) return; 

        // Trim the opening space.
        element.className = newList.substring(1);
    }

    /**
     * (Internal) Removes a class from an element.
     */

    function removeClass(element, name) {
        var oldList = classList(element),
        newList;

        if (!hasClass(element, name)) return;

        // Replace the class name.
        newList = oldList.replace(' ' + name + ' ', ' ');

        // Trim the opening and closing spaces.
        element.className = newList.substring(1, newList.length - 1);
    }

    /**
     * show element
     * like $('*').show();
     * @param element
     * @return {undefined}
     */
    function showEl(element) {
        css(element, {
            display: 'block'
        });
    }

    /**
     * hide element
     * like $('*').hide();
     * @param element
     * @return {undefined}
     */
    function hideEl(element) {
        css(element, {
            display: 'none'
        });
    }
    /**
     * (Internal) Gets a space separated list of the class names on the element. 
     * The list is wrapped with a single space on each end to facilitate finding 
     * matches within the list.
     */

    function classList(element) {
        return (' ' + (element.className || '') + ' ').replace(/\s+/gi, ' ');
    }

    /**
     * (Internal) Removes an element from the DOM.
     */

    function removeElement(element) {
        element && element.parentNode && element.parentNode.removeChild(element);
    }

    return MProgress;
});


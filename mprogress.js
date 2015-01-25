/* MProgress  inspire from Material Design and NProgress...
 * @license MIT */

;(function(root, factory) {
    // UMD
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.Mprogress = factory();
    }

})(typeof window !== 'undefined' ? window : this, function() {

    'use strict';

    var SETTINGS = {
        minimum: 0.08,
        easing: 'ease',
        positionUsing: '',
        speed: 200,
        trickle: true,
        trickleRate: 0.02,
        trickleSpeed: 800,
        barSelector: '[role="mpbar"]',
        bufferSelector: '[role="bufferBar"]',
        dashedSelector: '[role="dashed"]',
        parent: 'body',
        template: 2
    };

    var UN_TPL_ID = '99';

    var renderTemplate = {

        determinate:    '<div class="deter-bar" role="mpbar1">'+
                            '<div class="peg"></div>'+
                        '</div>'+
                        '<div class="bar-bg"></div>',

        indeterminate:  '<div class="indeter-bar" role="mpbar2">'+
                            '<div class="peg"></div>'+
                        '</div>'+ 
                        '<div class="bar-bg"></div>',

        buffer:         '<div class="deter-bar" role="mpbar3">'+
                            '<div class="peg"></div>'+
                        '</div>'+
                        '<div class="buffer-bg" role="bufferBar"></div>' +
                        '<div class="mp-ui-dashed" role="dashed"></div>',

        query:          '<div class="query-bar" role="mpbar4">'+
                            '<div class="peg"></div>'+
                        '</div>'+ 
                        '<div class="bar-bg"></div>'
    };

    var Mprogress = function(opt) {
        var options = Utils.extend(opt, SETTINGS);
        var tplType = ~~options.template;
        var idName = 'mprogress';
        var data;
        if (typeof tplType === 'number') {
            idName += tplType;
        } else {
            idName += '0';
        }

        if(!document.getElementById(idName)){
            data = new MProgress(options);
        } else {
            data = document.getElementById(idName);
        }

        return data;
    };

    var MProgress = function(options){
        this.options = options || {};
        this.status = null; //Last number
        this.bufferStatus = null;
    };


    MProgress.prototype = {

        version : '0.1.0',

        constructor: MProgress,

        /**
         * Sets the progress bar status, where `n` is a number from `0.0` to `1.0`.
         *
         *     MProgress.set(0.4);
         *     MProgress.set(1.0);
         */
        set: function(n) {
            n = Utils.clamp(n, this.options.minimum, 1);
            this.status = (n === 1 ? null : n);

            this._setProgress(this._getCurrSelector(), n);

            return this;
        },

        setBuffer: function(n) {
            n = Utils.clamp(n, this.options.minimum, 1);
            this.bufferStatus = (n === 1 ? null : n);

            this._setProgress(this.options.bufferSelector, n);

            return this;
        },

        /**
         * Shows the progress bar.
         * This is the same as setting the status to 0%, except that it doesn't go backwards.
         *
         *     MProgress.start();
         *
         */
        start: function() {
            if (!this.status) this.set(0);

            var self = this;
            // buffer show front dashed scroll
            if ( this._isBufferStyle() ) {
                if (!this.bufferStatus) this.setBuffer(0);
                var started  = this._isStarted(),
                progress = this.render(!started),
                dashed   = progress.querySelector(this.options.dashedSelector);
                Utils.addClass(dashed, 'active');
                setTimeout(function(){
                    Utils.hideEl(dashed);
                    Utils.removeClass(dashed, 'active');
                    Utils.showEl(dashed);
                }, 3000);
            }

            var work = function() {
                setTimeout(function() {
                    if (!self.status) return;
                    self.trickle();
                    work();
                }, self.options.trickleSpeed);
            };

            if (this.options.trickle) work();

            return this;
        },

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
        done: function(force) {
            if (!force && !this.status) return this;

            return this.inc(0.3 + 0.5 * Math.random()).set(1);
        },


        /**
         * Increments by a random amount.
         */
        inc: function(amount) {
            var n = this.status;
            var bn = this.bufferStatus;

            if (!n) {
                return this.start();
            } else {
                n = this._getRandomNum(n, amount);
                if ( this._isBufferStyle()) {
                    bn = this._getRandomNum( n + 0.1, amount);
                    this.setBuffer(bn);
                }
                return this.set(n);
            }
        },

        trickle: function() {
            return this.inc(Math.random() * this.options.trickleRate);
        },

        /**
         * (Internal) renders the progress bar markup based on the `template`
         * setting.
         */
        render: function(fromStart) {
            if (this._isRendered()) {
                return this._getRenderedId();
            }

            var progress = document.createElement('div'),
            currTpl  = this._getCurrTemplate() || '',
            bar,
            perc,
            MParent;

            progress.id = this._getRenderedId(true);
            progress.className = 'ui-mprogress';
            progress.innerHTML = currTpl;

            bar      = progress.querySelector(this._getCurrSelector());
            perc     = fromStart ? '-100' : Utils.toBarPerc(this.status || 0);
            MParent  = document.querySelector(this.options.parent);

            Utils.setcss(bar, {
                transition: 'all 0 linear',
                transform: 'translate3d(' + perc + '%,0,0)'
            });

            if ( this._isBufferStyle() ) {
                var buffer  = progress.querySelector(this.options.bufferSelector),
                bufferPerc = fromStart ? '-100' : Utils.toBarPerc(this.bufferStatus || 0);
                Utils.setcss(buffer, {
                    transition: 'all 0 linear',
                    transform: 'translate3d(' + bufferPerc + '%,0,0)'
                });
            }

            if (MParent != document.body) {
                Utils.addClass(MParent, 'mprogress-custom-parent');
            }

            MParent.appendChild(progress);
            return progress;
        },

        /**
         * Removes the element. Opposite of render().
         */
        remove: function() {
            var progress = this._getRenderedId(),
            MParent   = document.querySelector(this.options.parent);

            if (MParent != document.body) {
                Utils.removeClass(MParent, 'mprogress-custom-parent');
            }

            progress && Utils.removeElement(progress);
        },

        /**
         * interior method 
         *
         */
        _setProgress: function(barSelector, n){
            var started  = this._isStarted(),
            progress = this.render(!started),
            bar      = progress.querySelector(barSelector),
            speed    = this.options.speed,
            ease     = this.options.easing,
            self     = this;

            progress.offsetWidth; /* Repaint */ 

            Utils.queue(function(next) {
                // Set positionUsing if it hasn't already been set
                if (self.options.positionUsing === '') self.options.positionUsing = self._getPositioningCSS();

                // Add transition
                Utils.setcss(bar, self._barPositionCSS(n, speed, ease));

                if (n === 1) {
                    // Fade out
                    Utils.setcss(progress, { 
                        transition: 'none', 
                        opacity: 1 
                    });
                    progress.offsetWidth; /* Repaint */

                    setTimeout(function() {
                        Utils.setcss(progress, { 
                            transition: 'all ' + speed + 'ms linear', 
                            opacity: 0 
                        });
                        setTimeout(function() {
                            self.remove();
                            next();
                        }, speed);
                    }, speed);
                } else {
                    setTimeout(next, speed);
                }
            });


        },

        _getCurrSelector: function(){
            var tplType = this._getCurrTplId();

            if(tplType !== UN_TPL_ID) {
                return '[role="mpbar' + tplType + '"]' 
            } else {
                return this.options.barSelector; 
            }
        },

        _isStarted : function() {
            return typeof this.status === 'number';
        },

        _getRandomNum: function(n, amount) {
            if (typeof amount !== 'number') {
                amount = (1 - n) * Utils.clamp(Math.random() * n, 0.1, 0.95);
            }

            n = Utils.clamp(n + amount, 0, 0.994); 

            return n;
        },

        /**
         * Checks if the progress bar is rendered.
         */
        _isRendered: function() {

            return !!this._getRenderedId();
        },

        _getRenderedId: function(getId) {

            var tplType = this._getCurrTplId();
            var idName = 'mprogress' + tplType;

            if(!getId){
                return document.getElementById(idName);
            } else {
                return idName;
            }
        },

        _isBufferStyle: function() {
            return this._getCurrTplId() === 3;
        },

        _isQueryStyle: function() {
            return this._getCurrTplId() === 4;
        },

        _getCurrTplId: function() {
            var tplType = ~~this.options.template || 1;
            if (typeof tplType === 'number') {
                return tplType;
            } else {
                return UN_TPL_ID;
            } 

        },

        _getCurrTemplate: function() {
            var tplType = this.options.template || 1,
            tplNameArr = ['determinate', 'indeterminate', 'buffer', 'query'],
            tplKey;

            if (typeof ~~tplType === 'number') {
                tplKey = tplNameArr[tplType - 1];
                return renderTemplate[tplKey] || '';
            }

            if (typeof tplType === 'string') {
                return template;
            }
        },

        /**
         * Determine which positioning CSS rule to use.
         */
        _getPositioningCSS: function() {
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
        },

        /**
         * (Internal) returns the correct CSS for changing the bar's
         * position given an n percentage, and speed and ease from Settings
         */
        _barPositionCSS: function(n, speed, ease) {
            var barCSS;

            if (this.options.positionUsing === 'translate3d') {
                barCSS = { transform: 'translate3d('+Utils.toBarPerc(n)+'%,0,0)' };
            } else if (this.options.positionUsing === 'translate') {
                barCSS = { transform: 'translate('+Utils.toBarPerc(n)+'%,0)' };
            } else {
                barCSS = { 'margin-left': Utils.toBarPerc(n)+'%' };
            }

            barCSS.transition = 'all '+speed+'ms '+ease;

            return barCSS;
        }

    };

    /**
     * Helpers
     */
    var Utils = {
        extend: function(newObj, targetObj) {
            var key, value;
            for (var key in newObj) {
                value = newObj[key];
                if (newObj.hasOwnProperty(key) && value !== undefined) {
                    targetObj[key] = value;
                }
            }

            return targetObj;
        },

        /**
         * (Internal) Queues a function to be executed.
         */

        queue: (function() {
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
        })(),
           /**
         * (Internal) Applies css properties to an element, similar to the jQuery 
         * setcss method.
         *
         * While this helper does assist with vendor prefixed property names, it 
         * does not perform any manipulation of values prior to setting styles.
         */

        setcss: (function() {
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
        })(),
        clamp: function(n, min, max) {
            if (n < min) return min;
            if (n > max) return max;
            return n;
        },

        /**
         * (Internal) converts a percentage (`0..1`) to a bar translateX
         * percentage (`-100%..0%`).
         */

        toBarPerc: function(n) {
            return (-1 + n) * 100;
        },

        hasClass: function(element, name) {
            var list = typeof element == 'string' ? element : Utils.classList(element);
            return list.indexOf(' ' + name + ' ') >= 0;
        },
        addClass: function(element, name) {
            var oldList = Utils.classList(element),
            newList = oldList + name;

            if (Utils.hasClass(oldList, name)) return; 

            // Trim the opening space.
            element.className = newList.substring(1);
        },
        removeClass: function(element, name) {
            var oldList = Utils.classList(element),
            newList;

            if (!Utils.hasClass(element, name)) return;

            // Replace the class name.
            newList = oldList.replace(' ' + name + ' ', ' ');

            // Trim the opening and closing spaces.
            element.className = newList.substring(1, newList.length - 1);
        },
        showEl: function(element) {
            Utils.setcss(element, {
                display: 'block'
            });
        },
        hideEl: function(element) {
            Utils.setcss(element, {
                display: 'none'
            });
        },
        classList: function(element) {
            return (' ' + (element.className || '') + ' ').replace(/\s+/gi, ' ');
        },

        /**
         * (Internal) Removes an element from the DOM.
         */
        removeElement: function(element) {
            element && element.parentNode && element.parentNode.removeChild(element);
        }

    };

    
    /**
     * Waits for all supplied jQuery promises and
     * increases the progress as the promises resolve.
     * 
     * @param $promise jQUery Promise
     */
    (function() {
        var initial = 0, current = 0;

        MProgress.prototype.promise = function($promise) {
            if (!$promise || $promise.state() == "resolved") {
                return this;
            }

            var self = this;

            if (current == 0) {
                self.start();
            }

            initial++;
            current++;

            $promise.always(function() {
                current--;
                if (current == 0) {
                    initial = 0;
                    self.done();
                } else {
                    self.set((initial - current) / initial);
                }
            });

            return this;
        };

    })();

    return Mprogress;
});


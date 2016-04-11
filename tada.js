/**
 * TADA v0.0.1
 * A very lightweight jQuery plugin to lazy load images
 * https://github.com/fallroot/tada
 *
 * Licensed under the MIT license.
 * Copyright 2015 fallroot
 */

!function(window, document, undefined) {
    'use strict';

    var settings = {
        attribute: 'data-src',
        delay: 50,
        threshold: '20%'
    };

    var initialized = false;

    var elements = [];

    var viewportHeight;
    var viewportWidth;

    var thresholdHeight;
    var thresholdWidth;

    var throttledRun;

    function init() {
        initialized = true;

        setViewport();

        throttledRun = settings.delay ? throttle(run, settings.delay) : run;

        addEvent(window, 'scroll', throttledRun);

        addEvent(window, 'resize', function() {
            setViewport();
            throttledRun();
        });
    }

    function setup(options) {
        for (var key in options || {}) {
            settings[key] = options[key];
        }
    }

    function setViewport() {
        viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        viewportWidth  = window.innerWidth  || document.documentElement.clientWidth;

        setThreshold();
    };

    function setThreshold() {
        var matches = settings.threshold.toString().match(/^\s*(\d+)\s*(px|%)?\s*$/);

        if (!matches || !matches.length) {
            console.error('Threshold value must be number or px or %.');
            return;
        }

        var value = matches[1];
        var unit  = matches[2];

        if (unit == '%') {
            thresholdHeight = Math.floor(viewportHeight * value / 100);
            thresholdWidth  = Math.floor(viewportWidth  * value / 100);
        } else {
            thresholdHeight = thresholdWidth = value;
        }
    }

    function add(element) {
        if (!initialized) {
            init();
        }

        if (typeof element == 'string') {
            var nodes = document.querySelectorAll(element);

            for (var i = 0, length = nodes.length; i < length; ++i) {
                addElement(nodes[i]);
            }
        } else {
            addElement(element);
        }

        throttledRun();
    }

    function addElement(element) {
        if (elements.indexOf(element) >= 0) {
            return;
        }

        var src = element.getAttribute(settings.attribute);

        var tagName = element.tagName.toLowerCase();

        if (tagName == 'img') {
            if (element.getAttribute('src') == src) {
                return;
            }
        } else {
            if (element.style.backgroundImage == 'url(' + src + ')') {
                return;
            }
        }

        elements.push(element);
    }

    function valid(element) {
        if (getStyle(element).display == 'none') {
            return false;
        }

        var rect = element.getBoundingClientRect();

        var top    = rect.top    >= -thresholdHeight && rect.top    <= viewportHeight + thresholdHeight;
        var bottom = rect.bottom >= -thresholdHeight && rect.bottom <= viewportHeight + thresholdHeight;
        var left   = rect.left   >= -thresholdWidth  && rect.left   <= viewportWidth  + thresholdWidth;
        var right  = rect.right  >= -thresholdWidth  && rect.right  <= viewportWidth  + thresholdWidth;

        return (top || bottom) && (left || right);
    }

    function run() {
        var clone = elements.slice();

        for (var i = 0, length = clone.length; i < length; ++i) {
            var element = clone[i];

            if (!valid(element)) {
                continue;
            }

            show(element);
        }
    }

    function show(element) {
        var src = element.getAttribute(settings.attribute);

        var tagName = element.tagName.toLowerCase();

        if (tagName == 'img') {
            element.setAttribute('src', src);
        } else {
            element.style.backgroundImage = 'url(' + src + ')';
        }

        element.removeAttribute(settings.attribute);

        elements.splice(elements.indexOf(element), 1);

        if (typeof settings.callback == 'function') {
            settings.callback(element);
        }
    }

    function throttle(method, delay) {
        var timer;

        return function() {
            if (timer) {
                clearTimeout(timer);
            }

            timer = setTimeout(method, delay);
        };
    }

    function addEvent(element, type, listener) {
        if (element.addEventListener) {
            element.addEventListener(type, listener, false);
        } else {
            element.attachEvent('on' + type, listener);
        }
    }

    function getStyle(element) {
        return window.getComputedStyle ? getComputedStyle(element) : element.currentStyle;
    }

    window.Tada = {
        setup: setup,
        add  : add
    };

}(window, document);

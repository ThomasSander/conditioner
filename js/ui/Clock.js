define(function(){

    'use strict';

    var _pad = function(n){return n<10 ? '0'+n : n;};

    // Clock Class
    var exports = function(element,options) {

        // set default options
        this._element = element;
        this._options = options;

        // backup content
        this._inner = this._element.innerHTML;

        // start ticking
        this._tick();
    };

    // default options
    exports.options = {
        'time':true
    };

    // update time
    exports.prototype._tick = function() {

        var self = this,
            now = new Date(),
            date = _pad(now.getDate()) + '/' + (now.getMonth()+1) + '/'+ now.getFullYear(),
            time = _pad(now.getHours()) + ':' + _pad(now.getMinutes()) + ':' + _pad(now.getSeconds());

        // write inner html
        this._element.innerHTML = date + (this._options.time ? ' - ' + time : '');

        // if time is not enabled, don't start ticking
        if (!this._options.time) {
            return;
        }

        // wait timeout milliseconds till next clock tick
        this._timer = setTimeout(function(){
            self._tick();
        },900);

    };

    // unload clock
    exports.prototype.unload = function() {

        // stop ticking
        clearTimeout(this._timer);

        // restore content
        this._element.innerHTML = this._inner;

    };

    return exports;

});
(function (root, optimizeReady) {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define(['jquery'], optimizeReady);
  } else if (typeof exports === 'object') {
    // Node, CommonJS-like
    module.exports = optimizeReady(require('jquery'));
  } else {
    // Browser globals (root is window)
    root.returnExports = optimizeReady(root.jQuery);
  }
}(this, function () {
  'use strict';

  var customEventPolyfill = function() {
    console.log('polyfill');
    if ( typeof window.CustomEvent === 'function' ) {return false;}

    function CustomEvent ( event, params ) {
      params = params || { bubbles: false, cancelable: false, detail: undefined };
      var evt = document.createEvent( 'CustomEvent' );
      evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
      return evt;
     }

    CustomEvent.prototype = window.Event.prototype;

    window.CustomEvent = CustomEvent;
  };

  var optimizeReady = function(optimizeID, options) {

    if (typeof optimizeID !== Object) {
      throw new Error('First parameter must be an object whose keys are Optimize container IDs');
    }
    
    customEventPolyfill();

    var
        dataLayer = options.dataLayer ? options.dataLayer : 'dataLayer',
        timeOut = options.timeout ? options.timeout : 1500,
        optimizeReady = new CustomEvent('optimizeReady', {
          detail: {
            timeout: false
          }
        });


    var timer = setTimeout(function() {
      optimizeReady.detail.timeout = true;
      window.dispatchEvent(optimizeReady);
      optimizeID.end = null;
    }, timeOut);

    optimizeID.start = 1*new Date();

    optimizeID.end = function() {
      clearTimeout(timer);
      window.dispatchEvent(optimizeReady);
    };

    (window[dataLayer] = window[dataLayer] || []).hide = optimizeID;

    optimizeID.timeout = timeOut;

  };

  return optimizeReady;

}));

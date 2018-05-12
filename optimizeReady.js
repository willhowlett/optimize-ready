(function (root, optimizeReady) {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define(optimizeReady);
  } else if (typeof exports === 'object') {
    // Node, CommonJS-like
    module.exports = optimizeReady();
  } else {
    // Browser globals (root is window)
    root.returnExports = optimizeReady();
  }
}(this, function() {
  'use strict';

  var customEventPolyfill = function() {

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

  /**
   * Adds an 'optimizeReady' event listener that fires once the Optimize
   * container is loaded and the experiment is ready (or once the defined
   * timeout has passed).
   * @param {Object} optimizeID An object whose keys are Optimize container IDs.
   * @param {Object} [options] Optional extra options object.
   * @param {string} [options.dataLayer = 'dataLayer'] The name of property that references the dataLayer object.
   * @param {number} [options.timeout = 1500] The max time (in milliseconds) the page will be hidden.
   */
  var optimizeReady = function(optimizeID, options) {

    if (typeof optimizeID !== 'object') {
      throw new Error('First parameter must be an object whose keys are Optimize container IDs');
    }
    options = typeof options === 'object' ? options : {}

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

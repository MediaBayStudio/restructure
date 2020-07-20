;(function(factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof exports === "object") {
    module.exports = factory();
  } else {
    window.Replacement = factory();
  }
})(function() {
  
  Replacement = (function() {
    //=include components/utils.js
  })();

  //=include components/init.js
  //=include components/initGrid.js
  //=include components/placementElements.js

  return Replacement;
});
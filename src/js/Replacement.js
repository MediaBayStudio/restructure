;(function(func) {
  window.Replacement = func();
})(function() {
  
  Replacement = (function() {
    //=include components/utils.js
  })();

  //=include components/init.js
  //=include components/initGrid.js
  //=include components/placementElements.js

  return Replacement;
});
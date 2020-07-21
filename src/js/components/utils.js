return function(options) {
  let _ = this;

  _.defaults = {};

  _.options = options;

  _.resizes = {};

  for (let key in _.defaults) {
    if (_.options[key] === undefined) {
      _.options[key] = _.defaults[key];
    }
  };

  // функции-обертки для сокращения записи
  _.q = function(selector, context) {
    context = context || document.body;
    return context.querySelector(selector);
  };

  _.matchMedia = function(mediaQuery) {
    return window.matchMedia(mediaQuery).matches;
  };

  _.resizeHandler = {
    handleEvent: _.initGrid,
    ctx: _
  };

  _.grid = {};
  _.parentElements = [];
  _.childElements = [];
  _.currentMediaQuery = undefined;

  _.init();
  _.initGrid();
  window.addEventListener('resize', _.resizeHandler);
}
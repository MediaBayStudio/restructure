Replacement.prototype.initGrid = function() {
  let _ = this.ctx || this,
    options = _.options,
    grid = _.grid,
    elements = _.elements,
    targetMediaQuery = _.targetMediaQuery,
    currentMediaQuery = _.currentMediaQuery;

  _.targetMediaQuery = undefined; // === initial

  for (let mediaQuery in grid) {
    if (_.matchMedia(mediaQuery)) {
      _.targetMediaQuery = mediaQuery;
    }
  }

  if (_.targetMediaQuery !== _.currentMediaQuery) {
    _.placementElements();
  }
};
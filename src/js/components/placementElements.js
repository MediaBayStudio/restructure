Replacement.prototype.placementElements = function() {
  let _ = this,
    options = _.options,
    grid = _.grid,
    targetMediaQuery = _.targetMediaQuery,
    currentMediaQuery = _.currentMediaQuery,
    targetGrid = grid[targetMediaQuery || 'initial']

  if (targetMediaQuery) {
    _.currentMediaQuery = targetMediaQuery;
  } else {
    _.currentMediaQuery = undefined;
  }

  targetGrid.forEach(function(childsArray, parent) {
    parent.innerHTML = '';
    for (let i = 0; i < childsArray.length; i++) {
      parent.appendChild(childsArray[i]);
    }
  });
};
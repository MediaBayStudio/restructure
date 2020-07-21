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
    // удаляем всех потомков (для поддержки IE)
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
    // вставляем всех потомков в нужном нам порядке
    for (let j = 0; j < childsArray.length; j++) {
      parent.appendChild(childsArray[j]);
    }
  });
};
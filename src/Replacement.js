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
    return function(options) {
      let _ = this;
    
      _.defaults = {
        'mobile-first': true
      };
    
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
    
      _.dispatchEvent = function(element, eventName) {
        if (typeof window.CustomEvent === "function") {
          let evt = new CustomEvent(eventName);
          element.dispatchEvent(evt);
        }
      };
    
      _.resizeHandler = {
        handleEvent: _.initGrid,
        ctx: _
      };
    
      _.mobileFirst = _.options['mobile-first'];
    
      _.grid = {};
      _.parentElements = [];
      _.childElements = [];
      _.currentMediaQuery = undefined;
    
      _.init();
      _.initGrid();
      window.addEventListener('resize', _.resizeHandler);
    }
  })();

  /*
    Будем разбирать объект initials
    т.к. там по задумке находится изначальная структура вложенностей элементов
    Берем родилея и ищем внутри потомков
    Формируем удобный объект Map
  */
  Replacement.prototype.init = function() {
    let _ = this,
      options = _.options,
      initialElements = options['initial'],
      initialMapObject = new Map(),
      parentElements = _.parentElements,
      childElements = _.childElements,
      parseGrid = function(mediaQuery) {
        let elements = options[mediaQuery],
          map = new Map();
  
        for (let parentSelector in elements) {
          let childsSelectors = elements[parentSelector],
            currentParent,
            elementsArray = [];
  
          for (let i = 0; i < parentElements.length; i++) {
            if (parentElements[i].matches(parentSelector)) {
              currentParent = parentElements[i];
              break;
            }
          }
  
          for (let i = 0; i < childsSelectors.length; i++) {
            let childSelector = childsSelectors[i];
            for (let j = 0; j < childElements.length; j++) {
              if (childElements[j].matches(childSelector)) {
                elementsArray[i] = childElements[j];
                break;
              }
            }
          }
          map.set(currentParent, elementsArray);
        }
  
        _.grid[mediaQuery] = map;
      };
  
    for (let initialElement in initialElements) {
      let selectors = initialElements[initialElement],
        currentElement = _.q(initialElement),
        elementsArray = [];
  
      for (let i = 0; i < selectors.length; i++) {
        let pushedElement = selectors[i];
        if (typeof selectors[i] === 'string') {
          elementsArray[i] = _.q(selectors[i], currentElement);
          pushedElement = elementsArray[i];
        }
        _.childElements[_.childElements.length] = pushedElement;
      }
  
      if (elementsArray.length === 0) {
        elementsArray = selectors;
      }
  
      initialMapObject.set(currentElement, elementsArray);
      _.parentElements[_.parentElements.length] = currentElement;
    }
  
    _.grid['initial'] = initialMapObject;
  
    for (let option in options) {
      if ((option[0] === '(' && option[option.length - 1] === ')')) {
        parseGrid(option);
      }
    }
  
  };
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

  return Replacement;
});
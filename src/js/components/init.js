/*
  Будем разбирать объект initials
  т.к. там по задумке находится изначальная структура вложенностей элементов
  Берем родилея и ищем внутри потомков
  Формируем удобный объект Map
*/
Replacement.prototype.init = function() {
    let _ = this,
      options = _.options,
      initialElements = options['initial'];

    // проверяем метод объекта Map
    if (typeof initialElements.delete === 'function') {
      _.grid['initial'] = initialElements;
      for (let option in options) {
        if ((option[0] === '(' && option[option.length - 1] === ')')) {
          _.grid[option] = options[option];
        }
      }
    // иначе будем строить эти объекты Map
    } else {
       /*
        Найдем все объекты со страницы через объект initial
        Сформируем удобный объект Map и с его помощью будем формировать другие объекты по размерам экранов, напрмиер:
        'initial': {
          div.footer: [div.footer__nav, div.footer__callback, ...]
        }
      */
      let initialMapObject = new Map(),
        parentElements = _.parentElements,
        childElements = _.childElements,
        htmlClassRegExp = /\./g,
        comparisonSelector = function(element, selector) {
          let isId = selector.indexOf('#') !== -1,
            isClass = selector.indexOf('.') !== -1;

            console.log(element);
            console.log(selector);
    
          if (isId) {
            return element.id === selector.slice(1);
          } else if (isClass) {
            return element.classList.contains(selector.slice(1));
          } else {
            return element.tagName === selector.toUpperCase();
          }
        },
        parseGrid = function(mediaQuery) {
          let elements = options[mediaQuery],
            map = new Map();
    
          for (let parentSelector in elements) {
            let childsSelectors = elements[parentSelector],
              currentParent,
              elementsArray = [];
    
            // проверяем какой из родителей подойдет по селектору id или class
            for (let i = 0; i < parentElements.length; i++) {
              if (comparisonSelector(parentElements[i], parentSelector)) {
                currentParent = parentElements[i];
                break;
              }
            }
    
            // проверяем какой из детей подойдет по селекутору id или class
            for (let i = 0; i < childsSelectors.length; i++) {
              let childSelector = childsSelectors[i];
              for (let j = 0; j < childElements.length; j++) {
                if (comparisonSelector(childElements[j], childSelector)) {
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
    }
  };
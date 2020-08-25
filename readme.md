# Перестройка блоков

Поддерживает IE 11

С помощью этого скрипта можно менять положение блоков в HTML дереве, в зависимости от размера экрана.
Нужно вызвать новый класс и в настройках указать размеры экранов, родительские элементы и порядок дочерних элементов, например:
```javascript
new Replacement({
  'initial': {
    'parent1': ['child1', 'child2', 'child3']
    'parent2': ['child4', 'child6', 'child5']
  },
  '(min-width: 1024px)': {
    'parent1': ['child5', 'child6', 'child4']
    'parent2': ['child1', 'child2', 'child3']
  }
});
```
Где `parent` и `child` - css селекторы, по которым будут получены элементы с помощью `document.querySelector`. Пока что допустимы одиночный класс, одиночный id или одиночный html тег, например: `.footer` или `#footer` или `footer`.

Алгоритм работы скрипта:
- из объекта `initial` скрипт получит все родительские элементы со страницы;
- затем из того же объекта будут получены все дочерние элементы, но поиск будет происходить уже в родительских элементах (`footer.querySelector('.footer__nav')`);
- в других медиа-запросах поиск элементов не будет происходить повторно через `querySelector()`, элементы будут выбраны cравниваем классов, id или тегов;
- потом инициализируются сетки в нужный скрипту вид (создается объект `Map`);
- проверяются медиа-запросы;
- если попали в медиа-запрос, то родительский элемент полностью очищается и дочерние элементы вставляются в установленном порядке.

Также, вместо селекторов можно указать сразу готовые объекты `Map`. Такой способ будет более надежный в поиске, ведь будут переданы уже готовые элементы и скрипт не будет ничего искать, и это актуально, если на стрнаице сложное дерево с повторяющиемся классами, например:
```javascript
let section = document.querySelector('#section'),
  sectionHeadingBlock = section.querySelector('.section__heading-block'),
  sectionFirstTitle = section.querySelector('h2.section__title'),
  sectionSecondTitle = section.querySelector('span.section__title'),
  sectionFirstDescr = section.querySelector('.section__descr:first-of-type'),
  sectionSecondDescr = section.querySelector('.section__descr:nth-of-type(2)'),
  sectionThirdDescr = section.querySelector('.section__descr:nth-of-type(3)'),
  sectionFourthDescr = section.querySelector('.section__descr:nth-of-type(4)'),
  initialMap = new Map([
    [
      section, [
        sectionHeadingBlock,
        sectionFirstTitle,
        sectionFirstDescr,
        sectionSecondDescr,
        sectionSecondTitle,
        sectionThirdDescr,
        sectionFourthDescr
      ]
    ]
  ]),
  minWidth576Map = new Map([
    [
      section, [
        sectionHeadingBlock,
        sectionFirstDescr,
        sectionSecondDescr,
        sectionThirdDescr,
        sectionFourthDescr
      ]
    ],
    [
      sectionHeadingBlock, [
        sectionFirstTitle,
        sectionSecondTitle
      ]
    ]
  ]);

new Replacement({
  'initial': initialMap,
  '(min-width: 576px)': minWidth576Map
});
```
Таким образом, на экранах от 320px до 576px блоки будут рассталвены как укзазано в объекте `initial`, а на размерах экранов от 576px и больше, элементы будут расставлены как указано в следующем объекте `(min-width: 576px)`.
**Все элементы внутри родительского блока будут удалены и вставлены заново в установленном порядке.**

Медиа-запросы должны идти подряд в нужном порядке. Например, если, desktop first, то на умнеьшение, например:
```javascript
new Replacement({
  'initial': {
    '.footer__top': [footerNav, footerCallback, footerPolicy]
    '#footer__bottom': [footerCopyright, footerInsta, footerTelegram]
  },
  '(max-width: 1024px)': {
    '.footer__top': [footerTelegram, footerInsta, footerCopyright]
    '#footer__bottom': [footerNav, footerCallback, footerPolicy]
  },
  '(max-width: 768px)': {
    '...': '...'
  }
});
```
И это будет озночать, что на экранах от 1920px до 1024px, элементы будут расставлены как укзано в объекте `initial`. На экранах от 768px до 1024px, элементы будут расставлены как в следующем объекте `(max-width: 1024px)` и т.д.
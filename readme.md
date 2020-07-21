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
Где `parent` и `child` - css селекторы, по которым будут получены элементы с помощью `document.querySelector`. Пока что допустимы 1 класс или 1 id или 1 html тег, например: `.footer` или `#footer` или `footer`.
Алгоритм работы скрипта:
- из объекта `initial` скрипт получит все родительские элементы со страницы;
- затем из того же объекта будут получены все дочерние элементы, но поиск будет происходить уже в родительских элементах (`footer.querySelector('.footer__nav')`);
- в других медиа-запросах поиск элементов не будет происходить повторно через `querySelector()`, элементы будут выбраны cравниваем классов, id или тегов;
- потом инициализируются сетки в нужный скрипту вид (объект `Map`);
- проверяются медиа-запросы;
- если попали в медиа-запрос, то родительский элемент полностью очищается и дочерние элементы вставляются в установленном порядке.
Также можно указывать не селекторы, а сразу `HTMLElement`, например:
```javascript
let footer = document.querySelector('.footer'),
  footerNav = footer.querySelector('.footer__nav'),
  footerCallback = footer.querySelector('.footer__callback'),
  footerPolicy = footer.querySelector('.footer__policy'),
  footerCopyright = footer.querySelector('.footer__copyright'),
  footerInsta = footer.querySelector('.footer__insta'),
  footerTelegram = footer.querySelector('.footer__telegram');

new Replacement({
  'initial': {
    '.footer__top': [footerNav, footerCallback, footerPolicy]
    '#footer__bottom': [footerCopyright, footerInsta, footerTelegram]
  },
  '(min-width: 1024px)': {
    '.footer__top': [footerTelegram, footerInsta, footerCopyright]
    '#footer__bottom': [footerNav, footerCallback, footerPolicy]
  }
});
```
Таким образом, на экранах от 320px до 1024px блоки будут рассталвены как укзазано в объекте `initial`, а на размерах экранов от 1024px и больше, элементы будут расставлены как указано в следующем объекте `(min-width: 1024px)`.
**Все элементы внутри родительского блока будут удалены и вставлены заново в установленном порядке.**

Медиа-запросы должны идти подряд в нужном порядке. Например, если, desktop first, то на умнеьшение, например:
```javascript
new Replacement({
  'mobile-first': false,
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
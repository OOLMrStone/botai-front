> Архив предыдущего эксперимента. Текущий контракт: `work-3-onest-design.md`. Старые файлы шрифтов и Retrogression перенесены в `artifacts/design-system/previous-font-trials` и не подключены к приложению

# Шрифты Work 3

Проверено 29 сентября 2026 года. Новые зависимости не устанавливались.

## MF EVOLT SPECIAL FREE

- Источник: [Шрифтотека](https://myskotom.ru/tproduct/504619321-117605608273-mf-evolt-special), публичный архив по ссылке «СКАЧАТЬ»: https://drive.google.com/file/d/10PjZCPg-5xY4tJUNDrlSckZMVK6ZrDH-/view
- Автор: Мистер Фонт, https://icebearger.ru
- Неизменённый файл: `src/assets/fonts/mf-evolt-special-free.otf`, исходная лицензия: `src/assets/fonts/mf-evolt-license.txt`
- Family: `MF EVOLT SPECIAL FREE`; PostScript: `MFEVOLTSPECIALFREE-Regular`; единственное начертание Regular, OS/2 weight 400. Это не variable font
- Проверка реальных контуров CoreText: все 66 русских букв (включая Ёё), цифры 0–9 и проверенная пунктуация `+-=,.!?@_()` имеют непустые контуры
- **ASCII-латиница отсутствует визуально:** A–Z и a–z отображаются в cmap на отдельные ненулевые glyph ID (36–61 и 68–93), но все 52 глифа имеют ноль элементов контура и пустой bounding box. Браузер считает символы присутствующими, поэтому обычная цепочка fallback их не исправляет
- Предыдущий вывод о поддержке английского алфавита был ошибочным: проверялась только успешность сопоставления символов с glyph ID, без проверки контуров. Повторная проверка вызвала `CTFontCreatePathForGlyph` для каждого глифа исходного OTF; подстановка системного шрифта не использовалась
- Файл нельзя подключать как единственный основной шрифт для смешанного текста. Его можно использовать только в явно ограниченном диапазоне Unicode с отдельным полноценным шрифтом для остальных символов; сам OTF изменять нельзя по условиям лицензии
- Лицензия внутри архива и nameID 13 явно разрешает коммерческие проекты, web, приложения и сервисы. Исходный OTF сохранён без конвертации и изменения; авторство сохранено

## Retrogression: только графика логотипа

- Источник: [Шрифтотека](https://myskotom.ru/tproduct/504619321-621303393143-retrogression), публичный архив по ссылке «СКАЧАТЬ»: https://drive.google.com/file/d/13jS-_wc2W0YEjM-Ep3KL9U2E0hxV_9nj/view
- Автор: slnc.jpg, 2020; [авторская публикация](https://www.behance.net/gallery/107545039/RETROGRESSION-FREE-FONT)
- [Страница распространителя](https://pixelsurplus.com/products/retrogression-free-font) указывает бесплатную Desktop Commercial License, отдельно платную Web Font License
- [Условия Desktop Commercial License](https://pixelsurplus.com/pages/licensing) разрешают создание логотипов и графики для web; запрещают встраивание самого шрифта в сайты и приложения
- Поэтому `public/brand/ai-retrogression.svg` содержит только статические контуры двух букв, полученные CoreText из оригинального Retrogression-Regular.otf. Шрифтовой файл не входит в приложение, не распространяется с ним и не загружается браузером
- Графика: tight viewBox `0 0 600 400`, пропорция 3:2, цвет `currentColor`. Исходный credit архива сохранён в `public/brand/retrogression-credit.txt`
- SVG является готовым элементом логотипа. Использовать его как алфавитный набор или замену шрифту нельзя; для набора произвольного текста Retrogression потребуется отдельное разрешение на web/app embedding

## Urbanist: латиница, цифры, пунктуация

Источник: https://github.com/google/fonts/tree/main/ofl/urbanist. Файл `src/assets/fonts/urbanist-variable.ttf`, лицензия `urbanist-license.txt` рядом. SIL OFL 1.1, вес 100–900. Проверены реальные контуры A–Z/a–z и 0–9: 62 из 62 непустые. MF Evolt исключён из этих символов через unicode-range, fallback MF отключён. Файлы шрифтов не изменены

# BROWSER QA REPORT — GlobalEnergoStroi

Дата: 2026-09-16T16:07:51.552Z
URL: https://globe-glow-dramatically-little.trycloudflare.com (та же сборка, что отдаётся по публичной ссылке)
Инструмент: Playwright (Chromium), реальные click/input/select/localStorage/submit, с ожиданием гидратации.

## DESKTOP 1440x900
HOME = PASS
CATALOG = PASS
SEARCH = PASS
FILTERS = PASS
PRODUCT DETAIL = PASS
COMPARE = PASS
FAVORITES = PASS
PODBOR = PASS
CALCULATOR = PASS
FORMS = PASS
HEADER = PASS
FOOTER = PASS
CONSOLE = PASS

## MOBILE 390x844
MENU = PASS
CATALOG = PASS
SEARCH = PASS
FILTERS = PASS
PRODUCT DETAIL = PASS
COMPARE = PASS
FAVORITES = PASS
PODBOR = PASS
CALCULATOR = PASS
FORMS = PASS
OVERFLOW = PASS

## FINAL
TOTAL TESTS = 30
PASSED = 30
FAILED = 0
NOT TESTED = 0
CONSOLE ERRORS = 0
404 = 0
500 = 0

## Детализация
- [desktop] HOME: PASS — status 200
- [desktop] CATALOG: PASS — Найдено: 143
- [desktop] SEARCH: PASS — {"500":11,"1000":6,"Weichai":25,"WPG":25,"Yuchai":7}
- [desktop] FILTERS: PASS — brand=25, brand+power(500-1000)=11
- [desktop] FILTERS_RESET: PASS — после сброса: 143
- [desktop] PAGINATION: PASS — Стр. 2 / 6
- [desktop] PRODUCT_DETAIL ges-00001: PASS — status 200, h1="ГПУ Weichai WPG103B9NG"
- [desktop] PRODUCT_DETAIL ges-00006: PASS — status 200, h1="ГПУ Weichai WPG123.5B9NG"
- [desktop] PRODUCT_DETAIL ges-00011: PASS — status 200, h1="ГПУ Weichai WPG137.5B9NG"
- [desktop] COMPARE: PASS — cols=3→2, empty=true
- [desktop] FAVORITES: PASS — present=true, persist=true, emptyAfterRemove=true
- [desktop] PODBOR_STEP1_SELECT: PASS — is-active=true, disabledBefore=true, enabledAfter=true
- [desktop] PODBOR: PASS — resultCards=true, engineerMsg=true
- [desktop] CALCULATOR: PASS — emptyBlocked=true, result=true, noNaN=true
- [desktop] CALCULATOR_EDGE: PASS — {"zero":true,"negative":true,"letters":true,"huge":true}
- [desktop] FORMS: PASS — errorsOnEmpty=5, success=true
- [desktop] HEADER: PASS — links=12, bad=0
- [desktop] FOOTER: PASS — /:200, /katalog:200, /resheniya:200, /uslugi:200, /proekty:200, /o-kompanii:200, /kontakty:200, /sravnenie:200, /izbrannoe:200, /zayavka:200, /podbor:200, /kalkulyator:200
- [mobile] MENU: PASS — menuVisible=true, navigated=true
- [mobile] CATALOG: PASS — Найдено=143
- [mobile] SEARCH: PASS — Weichai=25
- [mobile] FILTERS: PASS — Yuchai=7
- [mobile] PRODUCT_DETAIL: PASS — h1="ГПУ Weichai WPG103B9NG"
- [mobile] COMPARE: PASS — header="Сравнение (1)"
- [mobile] FAVORITES: PASS — present=true, persist=true
- [mobile] PODBOR: PASS — is-active=true
- [mobile] CALCULATOR: PASS — result=true
- [mobile] FORMS: PASS — success=true
- [mobile] OVERFLOW: PASS — [{"label":"home","overflow":false},{"label":"katalog","overflow":false},{"label":"product","overflow":false},{"label":"podbor","overflow":false},{"label":"kalkulyator","overflow":false},{"label":"zayavka","overflow":false}]
- [desktop] CONSOLE: PASS — errors=0

## Ошибки консоли
Не обнаружено.


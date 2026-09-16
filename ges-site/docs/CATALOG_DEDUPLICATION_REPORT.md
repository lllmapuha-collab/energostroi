# CATALOG DEDUPLICATION REPORT

Сгенерировано: 2026-09-16T14:21:32.884Z
Источник: data/generated/products.json (Master Catalog v4)

## Итоги
- RAW PRODUCTS = 337
- DUPLICATE GROUPS = 54
- MERGED PRODUCTS = 194
- REVIEW REQUIRED = 0 (спорных дублей на ручное решение нет)
- SIMILAR-BUT-NOT-MERGED = 60 (похожие, но разные товары — для прозрачности)
- FINAL UNIQUE PRODUCTS = 143
- VERIFIED PRODUCTS = 78
- DISCOVERY PRODUCTS = 58
- PUBLISHED CANDIDATES = 78

## Контроль качества
- CONFIRMED DUPLICATE CANONICAL KEYS = 0
- DUPLICATE PRODUCT URL = 0
- DUPLICATE SLUG = 0

## Канонический ключ
brand + model + engine + frequency + voltage + prime + standby + thermal.
Поле «исполнение» (execution) НЕ входит в ключ — это атрибут одной модели
(правила AI-07/AI-08). Разные двигатель/мощность/напряжение/частота → разные товары.

## Логика объединения
Записи с одинаковым каноническим ключом сводятся в один товар. За базу берётся
наиболее подтверждённая (verified) и наиболее полная запись. Все исполнения
сохраняются в атрибуте `executions` — данные не уничтожаются.

## 20 наиболее заметных групп объединения

### 1. Weichai WPG103B9NG
BEFORE:
- Weichai WPG103B9NG (GES-00001) — базовая запись
- Weichai WPG103B9NG (открытая) (GES-00002)
- Weichai WPG103B9NG (в кожухе) (GES-00003)
- Weichai WPG103B9NG (в контейнере) (GES-00004)
- Weichai WPG103B9NG (на шасси) (GES-00005)
AFTER:
- Weichai WPG103B9NG (GES-00001) — исполнения: открытая / в кожухе / в контейнере / на шасси
REASON:
Совпадают все технические поля (двигатель, мощность, напряжение, частота, тепло); отличается только исполнение.

### 2. Weichai WPG123.5B9NG
BEFORE:
- Weichai WPG123.5B9NG (GES-00006) — базовая запись
- Weichai WPG123.5B9NG (открытая) (GES-00007)
- Weichai WPG123.5B9NG (в кожухе) (GES-00008)
- Weichai WPG123.5B9NG (в контейнере) (GES-00009)
- Weichai WPG123.5B9NG (на шасси) (GES-00010)
AFTER:
- Weichai WPG123.5B9NG (GES-00006) — исполнения: открытая / в кожухе / в контейнере / на шасси
REASON:
Совпадают все технические поля (двигатель, мощность, напряжение, частота, тепло); отличается только исполнение.

### 3. Weichai WPG137.5B9NG
BEFORE:
- Weichai WPG137.5B9NG (GES-00011) — базовая запись
- Weichai WPG137.5B9NG (открытая) (GES-00012)
- Weichai WPG137.5B9NG (в кожухе) (GES-00013)
- Weichai WPG137.5B9NG (в контейнере) (GES-00014)
- Weichai WPG137.5B9NG (на шасси) (GES-00015)
AFTER:
- Weichai WPG137.5B9NG (GES-00011) — исполнения: открытая / в кожухе / в контейнере / на шасси
REASON:
Совпадают все технические поля (двигатель, мощность, напряжение, частота, тепло); отличается только исполнение.

### 4. Weichai WPG165B8NG
BEFORE:
- Weichai WPG165B8NG (GES-00016) — базовая запись
- Weichai WPG165B8NG (открытая) (GES-00017)
- Weichai WPG165B8NG (в кожухе) (GES-00018)
- Weichai WPG165B8NG (в контейнере) (GES-00019)
- Weichai WPG165B8NG (на шасси) (GES-00020)
AFTER:
- Weichai WPG165B8NG (GES-00016) — исполнения: открытая / в кожухе / в контейнере / на шасси
REASON:
Совпадают все технические поля (двигатель, мощность, напряжение, частота, тепло); отличается только исполнение.

### 5. Weichai WPG206B8NG
BEFORE:
- Weichai WPG206B8NG (GES-00021) — базовая запись
- Weichai WPG206B8NG (открытая) (GES-00022)
- Weichai WPG206B8NG (в кожухе) (GES-00023)
- Weichai WPG206B8NG (в контейнере) (GES-00024)
- Weichai WPG206B8NG (на шасси) (GES-00025)
AFTER:
- Weichai WPG206B8NG (GES-00021) — исполнения: открытая / в кожухе / в контейнере / на шасси
REASON:
Совпадают все технические поля (двигатель, мощность, напряжение, частота, тепло); отличается только исполнение.

### 6. Weichai WPG247.5B8NG
BEFORE:
- Weichai WPG247.5B8NG (GES-00026) — базовая запись
- Weichai WPG247.5B8NG (открытая) (GES-00027)
- Weichai WPG247.5B8NG (в кожухе) (GES-00028)
- Weichai WPG247.5B8NG (в контейнере) (GES-00029)
- Weichai WPG247.5B8NG (на шасси) (GES-00030)
AFTER:
- Weichai WPG247.5B8NG (GES-00026) — исполнения: открытая / в кожухе / в контейнере / на шасси
REASON:
Совпадают все технические поля (двигатель, мощность, напряжение, частота, тепло); отличается только исполнение.

### 7. Weichai WPG275B8NG
BEFORE:
- Weichai WPG275B8NG (GES-00031) — базовая запись
- Weichai WPG275B8NG (открытая) (GES-00032)
- Weichai WPG275B8NG (в кожухе) (GES-00033)
- Weichai WPG275B8NG (в контейнере) (GES-00034)
- Weichai WPG275B8NG (на шасси) (GES-00035)
AFTER:
- Weichai WPG275B8NG (GES-00031) — исполнения: открытая / в кожухе / в контейнере / на шасси
REASON:
Совпадают все технические поля (двигатель, мощность, напряжение, частота, тепло); отличается только исполнение.

### 8. Weichai WPG316B8NG
BEFORE:
- Weichai WPG316B8NG (GES-00036) — базовая запись
- Weichai WPG316B8NG (открытая) (GES-00037)
- Weichai WPG316B8NG (в кожухе) (GES-00038)
- Weichai WPG316B8NG (в контейнере) (GES-00039)
- Weichai WPG316B8NG (на шасси) (GES-00040)
AFTER:
- Weichai WPG316B8NG (GES-00036) — исполнения: открытая / в кожухе / в контейнере / на шасси
REASON:
Совпадают все технические поля (двигатель, мощность, напряжение, частота, тепло); отличается только исполнение.

### 9. Weichai WPG344B8NG
BEFORE:
- Weichai WPG344B8NG (GES-00041) — базовая запись
- Weichai WPG344B8NG (открытая) (GES-00042)
- Weichai WPG344B8NG (в кожухе) (GES-00043)
- Weichai WPG344B8NG (в контейнере) (GES-00044)
- Weichai WPG344B8NG (на шасси) (GES-00045)
AFTER:
- Weichai WPG344B8NG (GES-00041) — исполнения: открытая / в кожухе / в контейнере / на шасси
REASON:
Совпадают все технические поля (двигатель, мощность, напряжение, частота, тепло); отличается только исполнение.

### 10. Weichai WPG312L8NG
BEFORE:
- Weichai WPG312L8NG (GES-00046) — базовая запись
- Weichai WPG312L8NG (открытая) (GES-00047)
- Weichai WPG312L8NG (в кожухе) (GES-00048)
- Weichai WPG312L8NG (в контейнере) (GES-00049)
- Weichai WPG312L8NG (на шасси) (GES-00050)
AFTER:
- Weichai WPG312L8NG (GES-00046) — исполнения: открытая / в кожухе / в контейнере / на шасси
REASON:
Совпадают все технические поля (двигатель, мощность, напряжение, частота, тепло); отличается только исполнение.

### 11. Weichai WPG500-7NG
BEFORE:
- Weichai WPG500-7NG (GES-00051) — базовая запись
- Weichai WPG500-7NG (открытая) (GES-00052)
- Weichai WPG500-7NG (в кожухе) (GES-00053)
- Weichai WPG500-7NG (в контейнере) (GES-00054)
- Weichai WPG500-7NG (на шасси) (GES-00055)
AFTER:
- Weichai WPG500-7NG (GES-00051) — исполнения: открытая / в кожухе / в контейнере / на шасси
REASON:
Совпадают все технические поля (двигатель, мощность, напряжение, частота, тепло); отличается только исполнение.

### 12. Weichai WPG1375C7NG
BEFORE:
- Weichai WPG1375C7NG (GES-00064) — базовая запись
- Weichai WPG1375C7NG (открытая) (GES-00065)
- Weichai WPG1375C7NG (в кожухе) (GES-00066)
- Weichai WPG1375C7NG (в контейнере) (GES-00067)
- Weichai WPG1375C7NG (на шасси) (GES-00068)
AFTER:
- Weichai WPG1375C7NG (GES-00064) — исполнения: открытая / в кожухе / в контейнере / на шасси
REASON:
Совпадают все технические поля (двигатель, мощность, напряжение, частота, тепло); отличается только исполнение.

### 13. Yuchai YC6C935N-D30
BEFORE:
- Yuchai YC6C935N-D30 (GES-00081) — базовая запись
- Yuchai YC6C935N-D30 (открытая) (GES-00082)
- Yuchai YC6C935N-D30 (в кожухе) (GES-00083)
- Yuchai YC6C935N-D30 (в контейнере) (GES-00084)
- Yuchai YC6C935N-D30 (на шасси) (GES-00085)
AFTER:
- Yuchai YC6C935N-D30 (GES-00081) — исполнения: открытая / в кожухе / в контейнере / на шасси
REASON:
Совпадают все технические поля (двигатель, мощность, напряжение, частота, тепло); отличается только исполнение.

### 14. Sinotruk T12.15D
BEFORE:
- Sinotruk T12.15D (GES-00094) — базовая запись
- Sinotruk T12.15D (открытая) (GES-00095)
- Sinotruk T12.15D (в кожухе) (GES-00096)
- Sinotruk T12.15D (в контейнере) (GES-00097)
- Sinotruk T12.15D (на шасси) (GES-00098)
AFTER:
- Sinotruk T12.15D (GES-00094) — исполнения: открытая / в кожухе / в контейнере / на шасси
REASON:
Совпадают все технические поля (двигатель, мощность, напряжение, частота, тепло); отличается только исполнение.

### 15. Sinotruk T13.15D
BEFORE:
- Sinotruk T13.15D (GES-00099) — базовая запись
- Sinotruk T13.15D (открытая) (GES-00100)
- Sinotruk T13.15D (в кожухе) (GES-00101)
- Sinotruk T13.15D (в контейнере) (GES-00102)
- Sinotruk T13.15D (на шасси) (GES-00103)
AFTER:
- Sinotruk T13.15D (GES-00099) — исполнения: открытая / в кожухе / в контейнере / на шасси
REASON:
Совпадают все технические поля (двигатель, мощность, напряжение, частота, тепло); отличается только исполнение.

### 16. VMAN CHG620V12C
BEFORE:
- VMAN CHG620V12C (GES-00104) — базовая запись
- VMAN CHG620V12C (открытая) (GES-00105)
- VMAN CHG620V12C (в кожухе) (GES-00106)
- VMAN CHG620V12C (в контейнере) (GES-00107)
- VMAN CHG620V12C (на шасси) (GES-00108)
AFTER:
- VMAN CHG620V12C (GES-00104) — исполнения: открытая / в кожухе / в контейнере / на шасси
REASON:
Совпадают все технические поля (двигатель, мощность, напряжение, частота, тепло); отличается только исполнение.

### 17. VMAN CHG622V20C
BEFORE:
- VMAN CHG622V20C (GES-00109) — базовая запись
- VMAN CHG622V20C (открытая) (GES-00110)
- VMAN CHG622V20C (в кожухе) (GES-00111)
- VMAN CHG622V20C (в контейнере) (GES-00112)
- VMAN CHG622V20C (на шасси) (GES-00113)
AFTER:
- VMAN CHG622V20C (GES-00109) — исполнения: открытая / в кожухе / в контейнере / на шасси
REASON:
Совпадают все технические поля (двигатель, мощность, напряжение, частота, тепло); отличается только исполнение.

### 18. MWM TCG 2020 V20
BEFORE:
- MWM TCG 2020 V20 (GES-00122) — базовая запись
- MWM TCG 2020 V20 (открытая) (GES-00123)
- MWM TCG 2020 V20 (в кожухе) (GES-00124)
- MWM TCG 2020 V20 (в контейнере) (GES-00125)
- MWM TCG 2020 V20 (на шасси) (GES-00126)
AFTER:
- MWM TCG 2020 V20 (GES-00122) — исполнения: открытая / в кожухе / в контейнере / на шасси
REASON:
Совпадают все технические поля (двигатель, мощность, напряжение, частота, тепло); отличается только исполнение.

### 19. MTU 8V4000 family
BEFORE:
- MTU 8V4000 family (GES-00131) — базовая запись
- MTU 8V4000 family (открытая) (GES-00132)
- MTU 8V4000 family (в кожухе) (GES-00133)
- MTU 8V4000 family (в контейнере) (GES-00134)
- MTU 8V4000 family (на шасси) (GES-00135)
AFTER:
- MTU 8V4000 family (GES-00131) — исполнения: открытая / в кожухе / в контейнере / на шасси
REASON:
Совпадают все технические поля (двигатель, мощность, напряжение, частота, тепло); отличается только исполнение.

### 20. MTU 12V4000 family
BEFORE:
- MTU 12V4000 family (GES-00136) — базовая запись
- MTU 12V4000 family (открытая) (GES-00137)
- MTU 12V4000 family (в кожухе) (GES-00138)
- MTU 12V4000 family (в контейнере) (GES-00139)
- MTU 12V4000 family (на шасси) (GES-00140)
AFTER:
- MTU 12V4000 family (GES-00136) — исполнения: открытая / в кожухе / в контейнере / на шасси
REASON:
Совпадают все технические поля (двигатель, мощность, напряжение, частота, тепло); отличается только исполнение.

## 20 похожих пар, которые НЕ объединены

### 1
Product A: GES-00322 · Weichai WPG700*7 (512 кВт)
Product B: GES-00324 · Weichai WPG900*7 (640 кВт)
DIFFERENCES: power, engine
REASON NOT MERGED: Похожее название модели того же бренда, но отличаются технические поля — это разные агрегаты, объединять нельзя.

### 2
Product A: GES-00325 · Weichai WPG1000*7 (800 кВт)
Product B: GES-00330 · Weichai WPG1100*7 (800 кВт)
DIFFERENCES: engine
REASON NOT MERGED: Похожее название модели того же бренда, но отличаются технические поля — это разные агрегаты, объединять нельзя.

### 3
Product A: GES-00327 · Weichai WPG600*76 (545 кВт)
Product B: GES-00328 · Weichai WPG660*76 (600 кВт)
DIFFERENCES: power, engine
REASON NOT MERGED: Похожее название модели того же бренда, но отличаются технические поля — это разные агрегаты, объединять нельзя.

### 4
Product A: GES-00327 · Weichai WPG600*76 (545 кВт)
Product B: GES-00329 · Weichai WPG800*76
DIFFERENCES: power, engine
REASON NOT MERGED: Похожее название модели того же бренда, но отличаются технические поля — это разные агрегаты, объединять нельзя.

### 5
Product A: GES-00094 · Sinotruk T12.15D (200 кВт)
Product B: GES-00099 · Sinotruk T13.15D (250 кВт)
DIFFERENCES: power, engine
REASON NOT MERGED: Похожее название модели того же бренда, но отличаются технические поля — это разные агрегаты, объединять нельзя.

### 6
Product A: GES-00114 · MWM TCG 2020 V12 (1200 кВт)
Product B: GES-00257 · MWM TCG 2020 V12 K (1125 кВт)
DIFFERENCES: power, engine
REASON NOT MERGED: Похожее название модели того же бренда, но отличаются технические поля — это разные агрегаты, объединять нельзя.

### 7
Product A: GES-00114 · MWM TCG 2020 V12 (1200 кВт)
Product B: GES-00258 · MWM TCG 2020 V12 R (1200 кВт)
DIFFERENCES: engine
REASON NOT MERGED: Похожее название модели того же бренда, но отличаются технические поля — это разные агрегаты, объединять нельзя.

### 8
Product A: GES-00114 · MWM TCG 2020 V12 (1200 кВт)
Product B: GES-00260 · MWM TCG 3020 V12 (1380 кВт)
DIFFERENCES: power, engine
REASON NOT MERGED: Похожее название модели того же бренда, но отличаются технические поля — это разные агрегаты, объединять нельзя.

### 9
Product A: GES-00118 · MWM TCG 2020 V16 K (1500 кВт)
Product B: GES-00257 · MWM TCG 2020 V12 K (1125 кВт)
DIFFERENCES: power, engine
REASON NOT MERGED: Похожее название модели того же бренда, но отличаются технические поля — это разные агрегаты, объединять нельзя.

### 10
Product A: GES-00118 · MWM TCG 2020 V16 K (1500 кВт)
Product B: GES-00258 · MWM TCG 2020 V12 R (1200 кВт)
DIFFERENCES: power, engine
REASON NOT MERGED: Похожее название модели того же бренда, но отличаются технические поля — это разные агрегаты, объединять нельзя.

### 11
Product A: GES-00118 · MWM TCG 2020 V16 K (1500 кВт)
Product B: GES-00259 · MWM TCG 2020 V16 R (1560 кВт)
DIFFERENCES: power, engine
REASON NOT MERGED: Похожее название модели того же бренда, но отличаются технические поля — это разные агрегаты, объединять нельзя.

### 12
Product A: GES-00122 · MWM TCG 2020 V20 (2000 кВт)
Product B: GES-00127 · MWM TCG 3020 V20 (2300 кВт)
DIFFERENCES: power, engine
REASON NOT MERGED: Похожее название модели того же бренда, но отличаются технические поля — это разные агрегаты, объединять нельзя.

### 13
Product A: GES-00127 · MWM TCG 3020 V20 (2300 кВт)
Product B: GES-00262 · MWM TCG 3020 V20 XV (2000 кВт)
DIFFERENCES: power, engine
REASON NOT MERGED: Похожее название модели того же бренда, но отличаются технические поля — это разные агрегаты, объединять нельзя.

### 14
Product A: GES-00127 · MWM TCG 3020 V20 (2300 кВт)
Product B: GES-00263 · MWM TCG 3020 V20 Z (1880 кВт)
DIFFERENCES: power, engine
REASON NOT MERGED: Похожее название модели того же бренда, но отличаются технические поля — это разные агрегаты, объединять нельзя.

### 15
Product A: GES-00257 · MWM TCG 2020 V12 K (1125 кВт)
Product B: GES-00258 · MWM TCG 2020 V12 R (1200 кВт)
DIFFERENCES: power, engine
REASON NOT MERGED: Похожее название модели того же бренда, но отличаются технические поля — это разные агрегаты, объединять нельзя.

### 16
Product A: GES-00257 · MWM TCG 2020 V12 K (1125 кВт)
Product B: GES-00259 · MWM TCG 2020 V16 R (1560 кВт)
DIFFERENCES: power, engine
REASON NOT MERGED: Похожее название модели того же бренда, но отличаются технические поля — это разные агрегаты, объединять нельзя.

### 17
Product A: GES-00258 · MWM TCG 2020 V12 R (1200 кВт)
Product B: GES-00259 · MWM TCG 2020 V16 R (1560 кВт)
DIFFERENCES: power, engine
REASON NOT MERGED: Похожее название модели того же бренда, но отличаются технические поля — это разные агрегаты, объединять нельзя.

### 18
Product A: GES-00260 · MWM TCG 3020 V12 (1380 кВт)
Product B: GES-00261 · MWM TCG 3020 V16 (1840 кВт)
DIFFERENCES: power
REASON NOT MERGED: Похожее название модели того же бренда, но отличаются технические поля — это разные агрегаты, объединять нельзя.

### 19
Product A: GES-00262 · MWM TCG 3020 V20 XV (2000 кВт)
Product B: GES-00263 · MWM TCG 3020 V20 Z (1880 кВт)
DIFFERENCES: power
REASON NOT MERGED: Похожее название модели того же бренда, но отличаются технические поля — это разные агрегаты, объединять нельзя.

### 20
Product A: GES-00131 · MTU 8V4000 family (1013 кВт)
Product B: GES-00136 · MTU 12V4000 family (1286 кВт)
DIFFERENCES: power, engine
REASON NOT MERGED: Похожее название модели того же бренда, но отличаются технические поля — это разные агрегаты, объединять нельзя.

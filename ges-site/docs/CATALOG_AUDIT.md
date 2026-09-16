# CATALOG AUDIT (post-import)

## Verdict
- Source: `data/raw/GlobalEnergoStroi_Master_Catalog_v4.xlsx`
- TOTAL PRODUCTS = **337** (MATCH)
- Hardcoded demo catalog replaced by generated JSON

## Counts
| Category | Count |
|----------|------:|
| ГПУ | 228 |
| ДГУ | 95 |
| ПЭС | 10 |
| Энергокомплексы | 4 |

## Status (mapped)
- verified: 78
- needs_verification: 194
- discovery: 58
- template: 7

## App wiring
- Import script: `scripts/import-catalog.ts`
- Generated: `data/generated/products.json` (+ brands/categories/filters/validation)
- UI loads via `src/data/products.ts` → `mapCatalogProduct`
- Filters / search / sort / pagination on `/katalog`
- PDP SSG for all 337 slugs
- Compare / favorites / wizard use the same catalog service

See `docs/CATALOG_VALIDATION_REPORT.md` for full brand breakdown.

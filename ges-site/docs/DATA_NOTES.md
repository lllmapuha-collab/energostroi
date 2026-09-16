# DATA NOTES

## Source of truth
- Excel: `data/raw/GlobalEnergoStroi_Master_Catalog_v4.xlsx`
- Import: `npm run import:catalog` → `data/generated/*.json` + `docs/CATALOG_VALIDATION_REPORT.md`
- Site catalog: `src/data/products.ts` maps generated JSON → UI `Product` model

## Rules
- Do not invent technical specs. Missing fields stay `null` → UI shows «Нет данных».
- All 337 Products rows are imported (verified, candidate, discovery, template).
- Passport Master / MWM Verified enrich matching brand+model only.
- Seed backup of the old 15-item demo: `src/data/products.seed.backup.ts` (not used by the app).

## Expected totals (v4)
- TOTAL PRODUCTS = 337
- ГПУ 228 · ДГУ 95 · ПЭС 10 · Энергокомплексы 4

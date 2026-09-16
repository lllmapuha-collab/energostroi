# GlobalEnergoStroi — Architecture (Prototype)

## Positioning
Инженерная энергетическая компания: задача → подбор → расчёт → оборудование → проектирование → поставка → монтаж → ПНР → сервис.

## Source roles
| Source | Role |
|--------|------|
| Global Mining catalog UX | Navigation / filters / cards / compare / favorites / selection wizard mechanics only |
| GES presentation (pending) | Visual design system |
| Master Catalog v4 | Product data (xlsx not in package yet — seed from Handoff + official source fields only) |

## Sitemap
```
/                         Home
/katalog                  Catalog hub
/katalog/[category]       Category
/katalog/[category]/[sub] Subcategory listing
/katalog/product/[slug]   Product passport
/sravnenie                Compare
/izbrannoe                Favorites
/podbor                   Equipment wizard
/kalkulyator              Economy calculator
/resheniya                Solutions
/uslugi                   Services process
/proekty                  Projects
/proekty/[slug]           Project detail
/o-kompanii               About
/kontakty                 Contacts
/zayavka                  Lead form
```

## Component architecture
```
layout/     Header, Footer, Shell, MobileDrawer
ui/         Button, Field, Select, Chip, SpecValue, Section, PageHero
catalog/    CategoryGrid, ProductCard, ProductFilters, SpecGroups, RelatedProducts
home/       Hero, Advantages, CatalogTeaser, WizardTeaser, CalcTeaser, ProjectsTeaser
forms/      LeadForm
ai/         ConsultantWidget (UX stub)
```

## Data access
- `src/data/*` — replaceable JSON/TS seed (future API/DB)
- `src/lib/catalog.ts` — query/filter/slug helpers
- `src/context/CatalogState.tsx` — compare + favorites (localStorage)
- Composite product key: `brand|model|engine|frequency|execution`

## Verification policy
- `verification_status`: `source_backed` | `discovery` | `needs_verification`
- Unknown fields → `null` → UI «—» / «По запросу»
- Never invent specs; calculator refuses hard numbers without source-backed inputs

## Design tokens (interim until presentation)
- `--ges-black`, `--ges-white`, `--ges-cyan`, industrial light theme
- Fonts: Manrope (UI) + Unbounded (display)
- Large rounded cards, generous whitespace, cyan CTAs

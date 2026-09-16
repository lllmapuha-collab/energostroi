# GlobalEnergoStroi — clickable website prototype

Next.js App Router prototype: catalog + selection wizard + compare + calculator + projects + services.

## Run

```bash
cd ges-site
npm install
npm run dev
```

Open http://localhost:3000

## Architecture

See `docs/ARCHITECTURE.md`.

## Data

- Seed: `src/data/products.ts` from Master Catalog v4 Handoff + official source fields only
- Unknown specs render as `—` / `По запросу`
- Weichai models listed as `needs_verification` until datasheet mapping
- Replace seed with API/DB without rewriting UI (`src/lib/catalog.ts`)

## Branding

Presentation not yet provided — interim tokens: black / white / cyan, Manrope + Unbounded.

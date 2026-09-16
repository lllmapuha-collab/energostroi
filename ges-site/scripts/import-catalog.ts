/**
 * Import Master Catalog v4 Excel → normalized JSON for the site catalog.
 * Run: npx tsx scripts/import-catalog.ts
 */
import * as fs from "fs";
import * as path from "path";
import * as XLSX from "xlsx";

const EXPECTED_PRODUCTS = 337;
const ROOT = path.resolve(__dirname, "..");
const XLSX_PATH = path.join(ROOT, "data/raw/GlobalEnergoStroi_Master_Catalog_v4.xlsx");
const OUT_DIR = path.join(ROOT, "data/generated");

type Num = number | null;

export type CatalogProduct = {
  id: string;
  slug: string;
  excelSlug: string | null;
  category: string;
  categoryKey: string;
  subcategory: string;
  subcategoryKey: string;
  brand: string;
  manufacturer: string;
  model: string;
  variant: string | null;
  article: string | null;
  engine: {
    manufacturer: string | null;
    model: string | null;
    cylinders: Num;
    displacementL: Num;
    boreMm: Num;
    strokeMm: Num;
    rpm: Num;
    raw: string | null;
  };
  primeKw: Num;
  primeKva: Num;
  standbyKw: Num;
  standbyKva: Num;
  voltage: string | null;
  frequency: Num;
  phases: Num;
  cosPhi: Num;
  fuel: string | null;
  thermalKw: Num;
  efficiencyElectrical: Num;
  efficiencyThermal: Num;
  efficiencyTotal: Num;
  dimensions: string | null;
  weightKg: Num;
  execution: string | null;
  sourceLevel: string | null;
  publicationStatus: string | null;
  verificationStatus: "verified" | "published_candidate" | "discovery" | "needs_verification" | "template" | "candidate";
  source: string | null;
  sourceUrl: string | null;
  sourceId: string | null;
  aiNote: string | null;
  passportId: string | null;
  images: string[];
  documents: { title: string; url: string | null }[];
  compositeKey: string;
  description: string | null;
};

function num(v: unknown): Num {
  if (v === null || v === undefined || v === "") return null;
  const s = String(v).trim().replace(",", ".").replace(/\s/g, "");
  if (!s || /уточнить|n\/a|null|unknown|нет/i.test(s)) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

function str(v: unknown): string | null {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  if (!s || /^(уточнить|n\/a|null|unknown|-|—)$/i.test(s)) return null;
  return s;
}

function norm(s: unknown): string {
  return String(s ?? "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function categoryMap(cat: string): { categoryKey: string; subcategoryKey: string; subcategory: string } {
  switch (cat) {
    case "ГПУ":
      return { categoryKey: "elektrostantsii", subcategoryKey: "gpu", subcategory: "ГПУ" };
    case "ДГУ":
      return { categoryKey: "elektrostantsii", subcategoryKey: "dgu", subcategory: "ДГУ" };
    case "ПЭС":
      return { categoryKey: "elektrostantsii", subcategoryKey: "pes", subcategory: "ПЭС" };
    case "Энергокомплексы":
      return { categoryKey: "elektrostantsii", subcategoryKey: "energokompleksy", subcategory: "Энергокомплексы" };
    default:
      return { categoryKey: "elektrostantsii", subcategoryKey: "other", subcategory: cat || "Прочее" };
  }
}

function mapVerification(sourceLevel: string | null, publicationStatus: string | null): CatalogProduct["verificationStatus"] {
  const sl = norm(sourceLevel);
  const ps = norm(publicationStatus);
  if (sl === "verified") return "verified";
  if (sl === "discovery" || ps === "discovery") return "discovery";
  if (sl === "template") return "template";
  if (ps === "published_candidate") return "published_candidate";
  if (ps === "needs_verification") return "needs_verification";
  if (sl === "candidate") return "candidate";
  return "needs_verification";
}

function placeholderImage(category: string): string {
  if (category === "ГПУ") return "/images/products/gpu-placeholder.svg";
  return "/images/products/dgu-placeholder.svg";
}

function slugifyId(id: string): string {
  return String(id).toLowerCase().replace(/[^a-z0-9-]+/g, "-");
}

function main() {
  if (!fs.existsSync(XLSX_PATH)) {
    throw new Error(`Master Catalog xlsx not found: ${XLSX_PATH}`);
  }

  const wb = XLSX.readFile(XLSX_PATH, { cellDates: true });
  const productRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(wb.Sheets["Products"], {
    defval: null,
    raw: false,
  });
  const passports = XLSX.utils.sheet_to_json<Record<string, unknown>>(wb.Sheets["Passport Master"], {
    defval: null,
    raw: false,
  });
  const mwmVerified = XLSX.utils.sheet_to_json<Record<string, unknown>>(wb.Sheets["MWM Verified"], {
    defval: null,
    raw: false,
  });
  const filters = XLSX.utils.sheet_to_json<Record<string, unknown>>(wb.Sheets["Filters"], {
    defval: null,
    raw: false,
  });

  if (productRows.length !== EXPECTED_PRODUCTS) {
    console.error(`IMPORT ERROR: expected ${EXPECTED_PRODUCTS} Products rows, got ${productRows.length}`);
  }

  // Index passports by brand|model (first wins; collisions noted)
  const passportByBrandModel = new Map<string, Record<string, unknown>[]>();
  for (const p of passports) {
    const key = `${norm(p.Brand)}|${norm(p.Model)}`;
    const list = passportByBrandModel.get(key) ?? [];
    list.push(p);
    passportByBrandModel.set(key, list);
  }

  const mwmByModel = new Map<string, Record<string, unknown>>();
  for (const m of mwmVerified) {
    mwmByModel.set(norm(m.Model), m);
  }

  const usedIds = new Set<string>();
  const usedSlugs = new Set<string>();
  const products: CatalogProduct[] = [];
  const warnings: string[] = [];

  for (const row of productRows) {
    const id = str(row["Product ID"]);
    if (!id) {
      warnings.push("Row without Product ID skipped");
      continue;
    }
    if (usedIds.has(id)) {
      warnings.push(`Duplicate Product ID: ${id}`);
      continue;
    }
    usedIds.add(id);

    const brand = str(row["Бренд"]) ?? "Unknown";
    const model = str(row["Модель"]) ?? "Unknown";
    const category = str(row["Категория"]) ?? "Прочее";
    const engineRaw = str(row["Двигатель"]);
    const execution = str(row["Execution"]);
    const excelSlug = str(row["Slug"]);
    const map = categoryMap(category);

    let slug = slugifyId(id);
    if (usedSlugs.has(slug)) {
      slug = `${slug}-${usedSlugs.size}`;
    }
    usedSlugs.add(slug);

    const key = `${norm(brand)}|${norm(model)}`;
    const passportList = passportByBrandModel.get(key) ?? [];
    // Prefer passport whose execution loosely matches, else first
    let passport =
      passportList.find((p) => execution && norm(p.Execution) && norm(p.Execution).includes(norm(execution).slice(0, 4))) ??
      passportList[0] ??
      null;

    // If multiple same model and one passport shared — still OK to enrich shared fields
    const mwm = brand.toLowerCase() === "mwm" ? mwmByModel.get(norm(model)) : undefined;

    const primeKw = num(row["Prime kW"]) ?? num(passport?.["Prime kW"]) ?? num(mwm?.["Electrical kW"]);
    const primeKva = num(row["kVA"]) ?? num(passport?.["Prime kVA"]);
    const thermalKw = num(passport?.["Thermal kW"]) ?? num(mwm?.["Thermal kW"]);
    const frequency = num(passport?.["Frequency Hz"]) ?? (mwm ? 50 : null);
    const cylinders = num(passport?.Cylinders);
    const displacementL = num(passport?.["Displacement L"]) ?? num(mwm?.["Displacement L"]);
    const boreMm = num(passport?.["Bore mm"]);
    const strokeMm = num(passport?.["Stroke mm"]);
    const rpm = num(passport?.RPM) ?? num(mwm?.["Speed rpm"]);
    const dimensions =
      str(passport?.["Dimensions L×W×H mm"]) ??
      (mwm && (mwm["Length mm"] || mwm["Width mm"] || mwm["Height mm"])
        ? [mwm["Length mm"], mwm["Width mm"], mwm["Height mm"]].filter(Boolean).join("×") || null
        : null);
    const weightKg = num(passport?.["Weight kg"]) ?? num(mwm?.["Dry weight kg"]);

    const product: CatalogProduct = {
      id,
      slug,
      excelSlug,
      category,
      categoryKey: map.categoryKey,
      subcategory: map.subcategory,
      subcategoryKey: map.subcategoryKey,
      brand,
      manufacturer: brand,
      model,
      variant: execution,
      article: null,
      engine: {
        manufacturer: null,
        model: engineRaw ?? str(passport?.["Engine model"]),
        cylinders,
        displacementL,
        boreMm,
        strokeMm,
        rpm,
        raw: engineRaw,
      },
      primeKw,
      primeKva,
      standbyKw: num(passport?.["Standby kW"]),
      standbyKva: num(passport?.["Standby kVA"]),
      voltage: str(row["Voltage V"]) ?? str(passport?.["Voltage V"]),
      frequency,
      phases: null,
      cosPhi: null,
      fuel: str(row["Fuel"]) ?? str(passport?.Fuel) ?? (mwm ? "natural gas" : null),
      thermalKw,
      efficiencyElectrical: num(passport?.["Electrical efficiency %"]) ?? num(mwm?.["Electrical efficiency %"]),
      efficiencyThermal: num(passport?.["Thermal efficiency %"]) ?? num(mwm?.["Thermal efficiency %"]),
      efficiencyTotal: num(passport?.["Total efficiency %"]) ?? num(mwm?.["Total efficiency %"]),
      dimensions,
      weightKg,
      execution,
      sourceLevel: str(row["Source level"]),
      publicationStatus: str(row["Publication status"]),
      verificationStatus: mapVerification(str(row["Source level"]), str(row["Publication status"])),
      source: str(row["Source"]) ?? str(passport?.["Source ID"]),
      sourceUrl: str(row["Source URL"]) ?? str(passport?.["Source URL"]),
      sourceId: str(passport?.["Source ID"]),
      aiNote: str(row["AI note"]),
      passportId: passport ? str(passport["Product ID"]) : null,
      images: [placeholderImage(category)],
      documents: str(row["Source URL"])
        ? [{ title: "Источник", url: str(row["Source URL"]) }]
        : passport && str(passport["Source URL"])
          ? [{ title: "Passport source", url: str(passport["Source URL"]) }]
          : [],
      compositeKey: [norm(brand), norm(model), norm(engineRaw), frequency ?? "na", norm(execution)].join("|"),
      description: str(row["AI note"]),
    };

    products.push(product);
  }

  // Categories derived from data + site tree stubs
  const categoryTree = [
    {
      slug: "elektrostantsii",
      name: "Электростанции",
      description: "ДГУ, ГПУ, ПЭС и энергокомплексы.",
      children: [
        { slug: "dgu", name: "ДГУ", description: "Дизель-генераторные установки." },
        { slug: "gpu", name: "ГПУ", description: "Газопоршневые установки." },
        { slug: "pes", name: "ПЭС", description: "Передвижные электростанции." },
        { slug: "energokompleksy", name: "Энергокомплексы", description: "Комплексные энергорешения." },
      ],
    },
    {
      slug: "teploenergetika",
      name: "Теплоэнергетика",
      description: "Утилизация тепла и тепловые системы.",
      children: [
        { slug: "teploutilizatsiya", name: "Утилизация тепла", description: "Системы утилизации тепла." },
        { slug: "teploobmenniki", name: "Теплообменники", description: "Теплообменное оборудование." },
        { slug: "kotly-utilizatory", name: "Котлы-утилизаторы", description: "Котлы-утилизаторы." },
        { slug: "sistemy-okhlazhdeniya", name: "Системы охлаждения", description: "Охлаждение энергоустановок." },
      ],
    },
    {
      slug: "elektrotekhnicheskoe",
      name: "Электротехническое оборудование",
      description: "АВР, КРУ, трансформаторы, НКУ, КТП, кабель.",
      children: [
        { slug: "avr", name: "АВР", description: "Автоматический ввод резерва." },
        { slug: "kru", name: "КРУ / КСО", description: "Распределительные устройства." },
        { slug: "transformatory", name: "Трансформаторы", description: "Силовые трансформаторы." },
        { slug: "nku", name: "НКУ", description: "Низковольтные комплектные устройства." },
        { slug: "ktp", name: "КТП", description: "Комплектные трансформаторные подстанции." },
        { slug: "kabelnye-sistemy", name: "Кабельные системы", description: "Кабель и кабельные системы." },
      ],
    },
    {
      slug: "mobilnye",
      name: "Мобильные решения",
      description: "ПЭС на шасси, контейнеры, прицепы.",
      children: [
        { slug: "pes-mobilnye", name: "ПЭС на шасси", description: "Передвижные на шасси." },
        { slug: "konteynernye", name: "Контейнерные решения", description: "Контейнерные энергоустановки." },
        { slug: "pritsepnye", name: "Прицепные решения", description: "Прицепные исполнения." },
        { slug: "spetsialnye", name: "Специальные исполнения", description: "Спецкомплексы." },
      ],
    },
    {
      slug: "komplektuyushchie",
      name: "Комплектующие и сервис",
      description: "Двигатели, альтернаторы, контроллеры, ЗИП.",
      children: [
        { slug: "dvigateli", name: "Двигатели", description: "Силовые агрегаты." },
        { slug: "alternatory", name: "Альтернаторы", description: "Генераторы тока." },
        { slug: "kontrollery", name: "Контроллеры", description: "Системы управления." },
        { slug: "zip", name: "ЗИП", description: "Запасные части." },
        { slug: "akb", name: "АКБ", description: "Аккумуляторы." },
        { slug: "vykhlopnye", name: "Системы выхлопа", description: "Выхлоп и шумоглушение." },
        { slug: "konteynery", name: "Контейнеры", description: "Контейнеры и укрытия." },
        { slug: "shumozashchita", name: "Шумозащита", description: "Шумозащитные решения." },
      ],
    },
    {
      slug: "kogeneratsiya",
      name: "Когенерация / Тригенерация",
      description: "Комплексные решения с утилизацией тепла и холода.",
      children: [
        { slug: "kogeneratsiya", name: "Когенерация", description: "Электричество + тепло." },
        { slug: "trigeneratsiya", name: "Тригенерация", description: "Электричество + тепло + холод." },
      ],
    },
  ];

  const brands = [...new Set(products.map((p) => p.brand))].sort((a, b) => a.localeCompare(b, "ru"));

  const byCategory: Record<string, number> = {};
  const byBrand: Record<string, number> = {};
  const byStatus: Record<string, number> = {};
  const bySourceLevel: Record<string, number> = {};
  const byPublication: Record<string, number> = {};
  for (const p of products) {
    byCategory[p.category] = (byCategory[p.category] || 0) + 1;
    byBrand[p.brand] = (byBrand[p.brand] || 0) + 1;
    byStatus[p.verificationStatus] = (byStatus[p.verificationStatus] || 0) + 1;
    bySourceLevel[p.sourceLevel || "NULL"] = (bySourceLevel[p.sourceLevel || "NULL"] || 0) + 1;
    byPublication[p.publicationStatus || "NULL"] = (byPublication[p.publicationStatus || "NULL"] || 0) + 1;
  }

  const enriched = products.filter((p) => p.passportId || p.efficiencyElectrical != null || p.thermalKw != null).length;

  const validation = {
    expectedProducts: EXPECTED_PRODUCTS,
    actualProducts: products.length,
    match: products.length === EXPECTED_PRODUCTS,
    uniqueIds: usedIds.size,
    uniqueSlugs: usedSlugs.size,
    missingModel: products.filter((p) => !p.model || p.model === "Unknown").length,
    missingCategory: products.filter((p) => !p.category).length,
    missingBrand: products.filter((p) => !p.brand || p.brand === "Unknown").length,
    enrichedFromPassportOrMwm: enriched,
    byCategory,
    byBrand,
    byStatus,
    bySourceLevel,
    byPublication,
    warnings,
    generatedAt: new Date().toISOString(),
  };

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(path.join(OUT_DIR, "products.json"), JSON.stringify(products, null, 2));
  fs.writeFileSync(path.join(OUT_DIR, "categories.json"), JSON.stringify(categoryTree, null, 2));
  fs.writeFileSync(path.join(OUT_DIR, "brands.json"), JSON.stringify(brands, null, 2));
  fs.writeFileSync(path.join(OUT_DIR, "filters.json"), JSON.stringify(filters, null, 2));
  fs.writeFileSync(path.join(OUT_DIR, "validation-report.json"), JSON.stringify(validation, null, 2));

  const md = `# CATALOG VALIDATION REPORT

Generated: ${validation.generatedAt}

## Totals
- EXPECTED_PRODUCTS = ${EXPECTED_PRODUCTS}
- TOTAL PRODUCTS = ${validation.actualProducts}
- MATCH = ${validation.match ? "YES" : "NO"}
- Unique IDs = ${validation.uniqueIds}
- Unique slugs = ${validation.uniqueSlugs}
- Enriched (passport/MWM fields) = ${enriched}

## BY CATEGORY
${Object.entries(byCategory)
  .map(([k, v]) => `- ${k}: ${v}`)
  .join("\n")}

## BY BRAND
${Object.entries(byBrand)
  .sort((a, b) => b[1] - a[1])
  .map(([k, v]) => `- ${k}: ${v}`)
  .join("\n")}

## BY VERIFICATION STATUS (mapped)
${Object.entries(byStatus)
  .map(([k, v]) => `- ${k}: ${v}`)
  .join("\n")}

## BY SOURCE LEVEL (raw)
${Object.entries(bySourceLevel)
  .map(([k, v]) => `- ${k}: ${v}`)
  .join("\n")}

## BY PUBLICATION STATUS (raw)
${Object.entries(byPublication)
  .map(([k, v]) => `- ${k}: ${v}`)
  .join("\n")}

## Data quality
- missing model: ${validation.missingModel}
- missing category: ${validation.missingCategory}
- missing brand: ${validation.missingBrand}
- warnings: ${warnings.length ? warnings.join("; ") : "none"}

## Notes
- All ${validation.actualProducts} Products sheet rows imported (including template / discovery).
- Passport Master (16) and MWM Verified enrich matching brand+model where available.
- Missing technical fields remain null → UI shows «Нет данных».
`;

  fs.writeFileSync(path.join(ROOT, "docs/CATALOG_VALIDATION_REPORT.md"), md);

  console.log(JSON.stringify({ TOTAL_PRODUCTS: validation.actualProducts, MATCH: validation.match, byCategory, byBrand: Object.keys(byBrand).length }, null, 2));
  if (!validation.match) {
    process.exitCode = 1;
  }
}

main();

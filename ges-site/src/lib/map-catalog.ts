import type { CatalogProductRaw } from "@/lib/catalog-raw";
import type { DocumentRef, Product, SpecField, VerificationStatus } from "@/lib/types";

function spec(group: string, key: string, label: string, value: SpecField["value"], unit?: string | null): SpecField {
  return { group, key, label, value, unit: unit ?? null };
}

function mapVerification(status: CatalogProductRaw["verificationStatus"]): VerificationStatus {
  switch (status) {
    case "verified":
      return "verified";
    case "published_candidate":
      return "published_candidate";
    case "discovery":
      return "discovery";
    case "template":
      return "template";
    case "candidate":
      return "candidate";
    case "needs_verification":
    default:
      return "needs_verification";
  }
}

function normalizeFuel(fuel: string | null): string | null {
  if (!fuel) return null;
  const f = fuel.toLowerCase();
  if (f.includes("дизел")) return "дизель";
  if (f.includes("биогаз")) return "биогаз";
  if (f.includes("пропан")) return "пропан";
  if (f.includes("газ") || f.includes("natural")) return "газ";
  return fuel;
}

function boreStroke(p: CatalogProductRaw): string | null {
  if (p.engine.boreMm != null && p.engine.strokeMm != null) {
    return `${p.engine.boreMm}/${p.engine.strokeMm}`;
  }
  return null;
}

export function mapCatalogProduct(raw: CatalogProductRaw): Product {
  const engineLabel = raw.engine.raw ?? raw.engine.model;
  const name = `${raw.category} ${raw.brand} ${raw.model}`.replace(/\s+/g, " ").trim();
  const fuel = normalizeFuel(raw.fuel);
  const powerLabel =
    raw.primeKw != null ? `${raw.primeKw} кВт` : raw.standbyKw != null ? `${raw.standbyKw} кВт` : "мощность по запросу";

  const documents: DocumentRef[] = raw.documents.map((d, i) => ({
    id: `${raw.id}-doc-${i}`,
    title: d.title,
    type: "other" as const,
    url: d.url,
  }));

  const specs: SpecField[] = [
    spec("Электрические", "prime_kw", "Prime мощность", raw.primeKw, "кВт"),
    spec("Электрические", "prime_kva", "Prime мощность", raw.primeKva, "кВА"),
    spec("Электрические", "standby_kw", "Standby мощность", raw.standbyKw, "кВт"),
    spec("Электрические", "standby_kva", "Standby мощность", raw.standbyKva, "кВА"),
    spec("Электрические", "voltage", "Напряжение", raw.voltage, "В"),
    spec("Электрические", "frequency", "Частота", raw.frequency, "Гц"),
    spec("Электрические", "phases", "Фазы", raw.phases, null),
    spec("Электрические", "cos_phi", "cos φ", raw.cosPhi, null),
    spec("Топливо", "fuel", "Топливо", fuel, null),
    spec("Двигатель", "engine", "Двигатель", engineLabel, null),
    spec("Двигатель", "cylinders", "Цилиндры", raw.engine.cylinders, null),
    spec("Двигатель", "displacement", "Рабочий объём", raw.engine.displacementL, "л"),
    spec("Двигатель", "bore_stroke", "Диаметр/ход", boreStroke(raw), "мм"),
    spec("Двигатель", "rpm", "Обороты", raw.engine.rpm, "об/мин"),
    spec("Когенерация", "thermal_kw", "Тепловая мощность", raw.thermalKw, "кВт"),
    spec("КПД", "eff_e", "Электрический КПД", raw.efficiencyElectrical, "%"),
    spec("КПД", "eff_t", "Тепловой КПД", raw.efficiencyThermal, "%"),
    spec("КПД", "eff_tot", "Суммарный КПД", raw.efficiencyTotal, "%"),
    spec("Исполнение", "execution", "Исполнение", raw.execution, null),
    spec("Размеры/масса", "dimensions", "Габариты (Д×Ш×В)", raw.dimensions, "мм"),
    spec("Размеры/масса", "weight", "Масса", raw.weightKg, "кг"),
  ];

  return {
    product_id: raw.id,
    composite_key: raw.compositeKey,
    slug: raw.slug,
    brand: raw.brand,
    model: raw.model,
    name,
    category: raw.categoryKey,
    subcategory: raw.subcategoryKey,
    variant: raw.variant,
    fuel,
    engine: engineLabel,
    voltage: raw.voltage,
    frequency: raw.frequency,
    execution: raw.execution,
    prime_kw: raw.primeKw,
    prime_kva: raw.primeKva,
    standby_kw: raw.standbyKw,
    standby_kva: raw.standbyKva,
    cylinders: raw.engine.cylinders,
    displacement_l: raw.engine.displacementL,
    bore_stroke_mm: boreStroke(raw),
    rpm: raw.engine.rpm,
    thermal_kw: raw.thermalKw,
    efficiency_electrical: raw.efficiencyElectrical,
    efficiency_thermal: raw.efficiencyThermal,
    efficiency_total: raw.efficiencyTotal,
    dimensions_mm: raw.dimensions,
    weight_kg: raw.weightKg,
    resource: null,
    warranty: null,
    price: null,
    images: raw.images.length ? raw.images : ["/images/products/dgu-placeholder.svg"],
    documents,
    specs,
    source: raw.source ?? raw.sourceUrl ?? "Master Catalog v4",
    verification_status: mapVerification(raw.verificationStatus),
    seo_title: `${raw.brand} ${raw.model} — ${raw.category} ${powerLabel} | GlobalEnergoStroi`,
    seo_description: `${raw.category} ${raw.brand} ${raw.model}. Данные Master Catalog v4.`,
    published: true,
    source_level: raw.sourceLevel,
    publication_status: raw.publicationStatus,
    ai_note: raw.aiNote,
  };
}

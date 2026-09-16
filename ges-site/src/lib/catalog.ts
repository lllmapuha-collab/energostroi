import { categories } from "@/data/categories";
import { products } from "@/data/products";
import type { CategoryNode, Product, SpecValue, VerificationStatus } from "@/lib/types";

export function getAllProducts(): Product[] {
  return products;
}

/** All Master Catalog rows (including discovery/template). */
export function getPublishedProducts(): Product[] {
  return products.filter((p) => p.published);
}

export function getProductBySlug(slug: string): Product | undefined {
  return getPublishedProducts().find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return getPublishedProducts().find((p) => p.product_id === id);
}

export function getCategory(slug: string): CategoryNode | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getSubcategory(categorySlug: string, subSlug: string): CategoryNode | undefined {
  return getCategory(categorySlug)?.children?.find((c) => c.slug === subSlug);
}

export function getProductsByCategory(categorySlug: string, subSlug?: string): Product[] {
  return getPublishedProducts().filter((p) => {
    if (p.category !== categorySlug) return false;
    if (subSlug && p.subcategory !== subSlug) return false;
    return true;
  });
}

export function formatSpec(value: SpecValue, unit?: string | null): string {
  if (value === null || value === undefined || value === "") {
    return "Нет данных";
  }
  const text = typeof value === "number" ? String(value) : String(value);
  return unit ? `${text} ${unit}` : text;
}

export function powerLabel(p: Product): string {
  if (p.prime_kw != null) return `${p.prime_kw} кВт`;
  if (p.standby_kw != null) return `${p.standby_kw} кВт`;
  return "Нет данных";
}

export function isVerified(status: VerificationStatus): boolean {
  return status === "verified" || status === "published_candidate" || status === "source_backed";
}

export function verificationLabel(status: VerificationStatus): string {
  switch (status) {
    case "verified":
    case "source_backed":
      return "Verified";
    case "published_candidate":
      return "Published candidate";
    case "discovery":
      return "Discovery";
    case "template":
      return "Template";
    case "candidate":
      return "Candidate";
    case "needs_verification":
    default:
      return "Needs verification";
  }
}

export function keySpecs(p: Product): { label: string; value: string }[] {
  const rows: { label: string; value: string }[] = [];
  if (p.prime_kw != null) rows.push({ label: "Мощность", value: `${p.prime_kw} кВт` });
  else if (p.standby_kw != null) rows.push({ label: "Standby", value: `${p.standby_kw} кВт` });
  else rows.push({ label: "Мощность", value: "Нет данных" });

  rows.push({ label: "Топливо", value: p.fuel ?? "Нет данных" });
  rows.push({ label: "Двигатель", value: p.engine ?? "Нет данных" });
  rows.push({ label: "Напряжение", value: p.voltage ? `${p.voltage} В` : "Нет данных" });
  if (p.frequency != null) rows.push({ label: "Частота", value: `${p.frequency} Гц` });
  else rows.push({ label: "Частота", value: "Нет данных" });
  if (p.thermal_kw != null) rows.push({ label: "Тепло", value: `${p.thermal_kw} кВт` });
  if (p.execution) rows.push({ label: "Исполнение", value: p.execution });
  return rows.slice(0, 6);
}

export interface FilterState {
  q: string;
  brand: string;
  fuel: string;
  powerMin: string;
  powerMax: string;
  frequency: string;
  verification: string;
  sort: "power_asc" | "power_desc" | "brand" | "relevance";
}

export const emptyFilters: FilterState = {
  q: "",
  brand: "",
  fuel: "",
  powerMin: "",
  powerMax: "",
  frequency: "",
  verification: "",
  sort: "relevance",
};

function powerOf(p: Product): number | null {
  return p.prime_kw ?? p.standby_kw;
}

export function filterProducts(list: Product[], f: FilterState): Product[] {
  const q = f.q.trim().toLowerCase();
  const min = f.powerMin ? Number(f.powerMin) : null;
  const max = f.powerMax ? Number(f.powerMax) : null;

  let result = list.filter((p) => {
    if (q) {
      const hay = `${p.brand} ${p.model} ${p.name} ${p.engine ?? ""} ${p.product_id}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (f.brand && p.brand !== f.brand) return false;
    if (f.fuel && p.fuel !== f.fuel) return false;
    if (f.frequency && String(p.frequency ?? "") !== f.frequency) return false;
    if (f.verification) {
      if (f.verification === "verified") {
        if (!isVerified(p.verification_status)) return false;
      } else if (p.verification_status !== f.verification) {
        return false;
      }
    }

    const power = powerOf(p);
    if (min != null && !Number.isNaN(min)) {
      if (power == null || power < min) return false;
    }
    if (max != null && !Number.isNaN(max)) {
      if (power == null || power > max) return false;
    }
    return true;
  });

  switch (f.sort) {
    case "power_asc":
      result = [...result].sort((a, b) => (powerOf(a) ?? 1e12) - (powerOf(b) ?? 1e12));
      break;
    case "power_desc":
      result = [...result].sort((a, b) => (powerOf(b) ?? -1) - (powerOf(a) ?? -1));
      break;
    case "brand":
      result = [...result].sort((a, b) => a.brand.localeCompare(b.brand, "ru") || a.model.localeCompare(b.model, "ru"));
      break;
    default:
      break;
  }

  return result;
}

export function uniqueBrands(list: Product[]): string[] {
  return [...new Set(list.map((p) => p.brand))].sort((a, b) => a.localeCompare(b, "ru"));
}

export function uniqueFuels(list: Product[]): string[] {
  return [...new Set(list.map((p) => p.fuel).filter(Boolean) as string[])].sort((a, b) => a.localeCompare(b, "ru"));
}

export function relatedProducts(product: Product, limit = 3): Product[] {
  return getPublishedProducts()
    .filter((p) => p.product_id !== product.product_id && p.subcategory === product.subcategory)
    .slice(0, limit);
}

export type WizardAnswers = {
  purpose: string;
  powerKw: string;
  fuel: string;
  heat: string;
  region: string;
  mode: string;
  voltage: string;
  redundancy: string;
};

export function matchWizard(answers: WizardAnswers): { products: Product[]; rationale: string[] } {
  let list = getPublishedProducts().filter((p) => isVerified(p.verification_status));
  const rationale: string[] = [];

  if (answers.fuel === "газ") {
    list = list.filter((p) => p.fuel === "газ" || p.fuel === "биогаз" || p.fuel === "пропан" || p.subcategory === "gpu");
    rationale.push("Отфильтрованы газовые установки.");
  } else if (answers.fuel === "дизель") {
    list = list.filter((p) => p.fuel === "дизель" || p.subcategory === "dgu");
    rationale.push("Отфильтрованы дизельные установки.");
  }

  if (answers.heat === "да") {
    list = list.filter((p) => p.thermal_kw != null || p.subcategory === "gpu");
    rationale.push("Учтён запрос на использование тепла (приоритет ГПУ/когенерации).");
  }

  if (answers.purpose === "резерв") {
    list = list.filter((p) => p.subcategory === "dgu" || p.standby_kw != null);
    rationale.push("Для резервирования приоритетны ДГУ со standby-рейтингом.");
  }

  if (answers.purpose === "когенерация") {
    list = list.filter((p) => p.subcategory === "gpu" || p.thermal_kw != null);
    rationale.push("Для когенерации приоритетны ГПУ.");
  }

  const target = Number(answers.powerKw);
  if (!Number.isNaN(target) && target > 0) {
    list = [...list].sort((a, b) => {
      const pa = a.prime_kw ?? a.standby_kw ?? 1e9;
      const pb = b.prime_kw ?? b.standby_kw ?? 1e9;
      return Math.abs(pa - target) - Math.abs(pb - target);
    });
    rationale.push(`Подбор около ${target} кВт по мощности из каталога.`);
  }

  if (answers.redundancy === "да") {
    rationale.push("Рекомендуется N+1 — уточнит инженер на этапе ТЭО.");
  }

  if (!list.length) {
    rationale.push("Точных совпадений в verified-каталоге нет — нужна заявка инженеру.");
  }

  return { products: list.slice(0, 6), rationale };
}

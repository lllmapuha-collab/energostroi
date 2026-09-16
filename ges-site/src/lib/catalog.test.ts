import { describe, it, expect } from "vitest";
import {
  getPublishedProducts,
  getProductBySlug,
  getProductsByCategory,
  filterProducts,
  uniqueBrands,
  uniqueFuels,
  relatedProducts,
  matchWizard,
  emptyFilters,
  type WizardAnswers,
} from "@/lib/catalog";

const all = getPublishedProducts();

describe("Каталог (канонический)", () => {
  it("143 канонических товара", () => {
    expect(all.length).toBe(143);
  });

  it("уникальные slug и product_id (нет дублей URL)", () => {
    expect(new Set(all.map((p) => p.slug)).size).toBe(all.length);
    expect(new Set(all.map((p) => p.product_id)).size).toBe(all.length);
  });

  it("у каждого товара заполнены обязательные поля", () => {
    for (const p of all) {
      expect(p.slug).toBeTruthy();
      expect(p.brand).toBeTruthy();
      expect(p.model).toBeTruthy();
      expect(Array.isArray(p.specs)).toBe(true);
      expect(Array.isArray(p.executions)).toBe(true);
    }
  });
});

describe("Товарная страница", () => {
  it("getProductBySlug возвращает товар со спеками", () => {
    const p = getProductBySlug(all[0].slug);
    expect(p).toBeTruthy();
    expect(p!.specs.length).toBeGreaterThan(0);
  });
  it("несуществующий slug → undefined", () => {
    expect(getProductBySlug("нет-такого")).toBeUndefined();
  });
  it("связанные модели ≤ 3 и не включают сам товар", () => {
    const rel = relatedProducts(all[0]);
    expect(rel.length).toBeLessThanOrEqual(3);
    expect(rel.every((r) => r.product_id !== all[0].product_id)).toBe(true);
  });
});

describe("Поиск и фильтры", () => {
  it("фильтр по бренду сужает выборку", () => {
    const brand = uniqueBrands(all)[0];
    const res = filterProducts(all, { ...emptyFilters, brand });
    expect(res.length).toBeGreaterThan(0);
    expect(res.every((p) => p.brand === brand)).toBe(true);
  });

  it("поиск по строке находит по бренду/модели", () => {
    const q = all[0].model.slice(0, 4);
    const res = filterProducts(all, { ...emptyFilters, q });
    expect(res.length).toBeGreaterThan(0);
  });

  it("диапазон мощности реально ограничивает", () => {
    const res = filterProducts(all, { ...emptyFilters, powerMin: "100", powerMax: "200" });
    expect(res.every((p) => {
      const power = p.prime_kw ?? p.standby_kw;
      return power == null ? false : power >= 100 && power <= 200;
    })).toBe(true);
  });

  it("фильтр топлива работает, если есть значения", () => {
    const fuels = uniqueFuels(all);
    if (fuels.length) {
      const res = filterProducts(all, { ...emptyFilters, fuel: fuels[0] });
      expect(res.every((p) => p.fuel === fuels[0])).toBe(true);
    }
  });

  it("сортировка по мощности по возрастанию", () => {
    const res = filterProducts(all, { ...emptyFilters, sort: "power_asc" });
    const powers = res.map((p) => p.prime_kw ?? p.standby_kw ?? Infinity);
    for (let i = 1; i < powers.length; i++) expect(powers[i]).toBeGreaterThanOrEqual(powers[i - 1]);
  });

  it("категория ГПУ содержит товары", () => {
    const gpu = getProductsByCategory("elektrostantsii", "gpu");
    expect(gpu.length).toBeGreaterThan(0);
  });
});

describe("Подбор (configurator) использует реальный каталог", () => {
  const answers: WizardAnswers = {
    purpose: "основное",
    powerKw: "150",
    fuel: "газ",
    heat: "нет",
    region: "Урал",
    mode: "постоянный",
    voltage: "0.4 кВ",
    redundancy: "нет",
  };

  it("возвращает товары из каталога и обоснование", () => {
    const res = matchWizard(answers);
    expect(Array.isArray(res.products)).toBe(true);
    expect(res.rationale.length).toBeGreaterThan(0);
    const ids = new Set(all.map((p) => p.product_id));
    expect(res.products.every((p) => ids.has(p.product_id))).toBe(true);
  });

  it("газовый выбор отдаёт газовые/ГПУ позиции", () => {
    const res = matchWizard(answers);
    expect(res.products.every((p) => p.fuel === "газ" || p.subcategory === "gpu" || p.fuel === "биогаз" || p.fuel === "пропан")).toBe(true);
  });
});

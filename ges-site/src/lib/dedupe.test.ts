import { describe, it, expect } from "vitest";
import { rawCatalog, dedupe, products, RAW_TOTAL, CATALOG_TOTAL } from "@/data/products";
import { canonicalKey, normalizeToken, dedupeCatalog } from "@/lib/dedupe";

describe("Импорт каталога", () => {
  it("импортированы все строки Master Catalog v4", () => {
    expect(RAW_TOTAL).toBe(337);
    expect(rawCatalog.length).toBe(337);
  });
});

describe("Нормализация", () => {
  it("игнорирует регистр, пробелы и разделители", () => {
    const a = normalizeToken("Weichai WPG1000*7");
    const b = normalizeToken("WEICHAI WPG1000-7");
    const c = normalizeToken("weichai  wpg1000 7");
    expect(a).toBe(b);
    expect(b).toBe(c);
  });
  it("приводит квт/kw и ква/kva", () => {
    expect(normalizeToken("100 кВт")).toBe(normalizeToken("100 kW"));
    expect(normalizeToken("125 кВА")).toBe(normalizeToken("125 kVA"));
  });
});

describe("Дедупликация", () => {
  it("337 строк → 143 канонических товара", () => {
    expect(dedupe.stats.rawProducts).toBe(337);
    expect(dedupe.stats.finalUniqueProducts).toBe(143);
    expect(CATALOG_TOTAL).toBe(143);
    expect(products.length).toBe(143);
  });

  it("54 группы дублей, 194 объединённых записи", () => {
    expect(dedupe.stats.duplicateGroups).toBe(54);
    expect(dedupe.stats.mergedProducts).toBe(194);
    expect(dedupe.stats.rawProducts).toBe(dedupe.stats.finalUniqueProducts + dedupe.stats.mergedProducts);
  });

  it("нет дубликатов канонических ключей после дедупликации", () => {
    const keys = dedupe.canonical.map(canonicalKey);
    expect(new Set(keys).size).toBe(keys.length);
    expect(dedupe.stats.confirmedDuplicateCanonicalKeys).toBe(0);
  });

  it("записи, отличающиеся только исполнением, имеют одинаковый канонический ключ", () => {
    const base = rawCatalog.find((p) => p.id === "GES-00001")!;
    const variant = rawCatalog.find((p) => p.id === "GES-00002")!;
    expect(base && variant).toBeTruthy();
    expect(canonicalKey(base)).toBe(canonicalKey(variant));
  });

  it("исполнения сохраняются как атрибут канонического товара (данные не теряются)", () => {
    const withExec = products.filter((p) => p.executions.length > 0);
    expect(withExec.length).toBeGreaterThan(100);
    const p1 = products.find((p) => p.merged_from.includes("GES-00002"));
    expect(p1?.executions).toEqual(expect.arrayContaining(["открытая", "в кожухе", "в контейнере", "на шасси"]));
  });

  it("каждая исходная строка попала ровно в один канонический товар", () => {
    const all = dedupe.canonical.flatMap((c) => c.mergedFrom);
    expect(all.length).toBe(337);
    expect(new Set(all).size).toBe(337);
  });

  it("таблица разрешения дублей содержит 194 записи merged", () => {
    const merged = dedupe.resolution.filter((r) => r.action === "merged");
    expect(merged.length).toBe(194);
  });

  it("детектор устойчив к пустому вводу", () => {
    const empty = dedupeCatalog([]);
    expect(empty.stats.rawProducts).toBe(0);
    expect(empty.canonical.length).toBe(0);
  });
});

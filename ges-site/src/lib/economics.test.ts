import { describe, it, expect } from "vitest";
import { computeEconomics, parseNumber, loadModeFactor, type EconomicsInput } from "@/lib/economics";

const base: EconomicsInput = {
  monthlyKwh: "",
  electricityPrice: "",
  gasPrice: "",
  region: "",
  loadMode: "постоянный",
};

// Проверяем, что ни одно числовое поле не стало NaN/Infinity.
function assertNoBadNumbers(r: ReturnType<typeof computeEconomics>) {
  for (const v of [r.recommendedKw, r.annualKwh, r.annualGridCost]) {
    if (v !== null) expect(Number.isFinite(v)).toBe(true);
  }
}

describe("parseNumber", () => {
  it("пусто → empty", () => expect(parseNumber("").state).toBe("empty"));
  it("текст → invalid", () => expect(parseNumber("abc").state).toBe("invalid"));
  it("запятая как разделитель", () => expect(parseNumber("3,5").value).toBe(3.5));
  it("Infinity → invalid", () => expect(parseNumber("Infinity").state).toBe("invalid"));
});

describe("loadModeFactor", () => {
  it("резервный больше постоянного", () => {
    expect(loadModeFactor("резервный")).toBeGreaterThan(loadModeFactor("постоянный"));
  });
});

describe("Калькулятор экономики", () => {
  it("корректный ввод → мощность и годовое потребление", () => {
    const r = computeEconomics({ ...base, monthlyKwh: "72000", electricityPrice: "8" });
    expect(r.ok).toBe(true);
    expect(r.recommendedKw).toBeGreaterThan(0);
    expect(r.annualKwh).toBe(72000 * 12);
    expect(r.annualGridCost).toBe(72000 * 12 * 8);
    expect(r.hasEconomics).toBe(true);
    assertNoBadNumbers(r);
  });

  it("пустые данные → ошибка, без выдуманных цифр", () => {
    const r = computeEconomics({ ...base });
    expect(r.ok).toBe(false);
    expect(r.errors.length).toBeGreaterThan(0);
    expect(r.recommendedKw).toBeNull();
    assertNoBadNumbers(r);
  });

  it("нулевое потребление → ошибка", () => {
    const r = computeEconomics({ ...base, monthlyKwh: "0" });
    expect(r.ok).toBe(false);
    expect(r.recommendedKw).toBeNull();
  });

  it("отрицательное значение → ошибка", () => {
    const r = computeEconomics({ ...base, monthlyKwh: "-500" });
    expect(r.ok).toBe(false);
  });

  it("текст вместо числа → ошибка", () => {
    const r = computeEconomics({ ...base, monthlyKwh: "很多" });
    expect(r.ok).toBe(false);
    assertNoBadNumbers(r);
  });

  it("большие значения не ломают расчёт", () => {
    const r = computeEconomics({ ...base, monthlyKwh: "100000000", electricityPrice: "10" });
    expect(r.ok).toBe(true);
    assertNoBadNumbers(r);
  });

  it("неизвестный/пустой регион не мешает расчёту мощности", () => {
    const r = computeEconomics({ ...base, monthlyKwh: "10000", region: "" });
    expect(r.ok).toBe(true);
    expect(r.recommendedKw).toBeGreaterThan(0);
  });

  it("без тарифа: мощность есть, экономики нет — CAPEX не выдуман", () => {
    const r = computeEconomics({ ...base, monthlyKwh: "10000" });
    expect(r.ok).toBe(true);
    expect(r.hasEconomics).toBe(false);
    expect(r.annualGridCost).toBeNull();
    expect(r.capex).toBeNull();
    expect(r.paybackMonths).toBeNull();
  });

  it("разные режимы нагрузки дают разную мощность", () => {
    const a = computeEconomics({ ...base, monthlyKwh: "72000", loadMode: "постоянный" });
    const b = computeEconomics({ ...base, monthlyKwh: "72000", loadMode: "резервный" });
    expect(b.recommendedKw!).toBeGreaterThan(a.recommendedKw!);
  });

  it("отрицательный тариф → ошибка", () => {
    const r = computeEconomics({ ...base, monthlyKwh: "10000", electricityPrice: "-5" });
    expect(r.ok).toBe(false);
  });
});

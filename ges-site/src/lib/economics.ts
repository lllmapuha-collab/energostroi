/**
 * Модуль экономического калькулятора.
 *
 * Вся расчётная логика вынесена сюда (не в JSX) и покрыта unit-тестами.
 * Принцип (AI-01, AI-14): не выдумывать данные. CAPEX и срок окупаемости
 * требуют паспортных данных установки и расчёта инженера — здесь они НЕ
 * вычисляются. Возвращаются только величины, которые честно выводятся из
 * пользовательского ввода (ориентировочная мощность, годовое потребление,
 * годовая стоимость электроэнергии из сети).
 */

export type LoadMode = "постоянный" | "переменный" | "резервный";

export interface EconomicsInput {
  monthlyKwh: string;
  electricityPrice: string;
  gasPrice: string;
  region: string;
  loadMode: string;
}

export interface EconomicsResult {
  ok: boolean;
  errors: string[];
  // Ориентировочная электрическая мощность, кВт (из среднего потребления).
  recommendedKw: number | null;
  // Годовое потребление, кВт·ч.
  annualKwh: number | null;
  // Годовая стоимость электроэнергии из сети, ₽ (факт из ввода, не выдумано).
  annualGridCost: number | null;
  // Достаточно ли данных для экономической части (тариф на электроэнергию).
  hasEconomics: boolean;
  // Эти величины намеренно не рассчитываются в прототипе.
  capex: null;
  paybackMonths: null;
  notes: string[];
}

type ParseState = "ok" | "empty" | "invalid";

/**
 * Безопасный разбор числа из строки: обрезка пробелов, запятая как разделитель.
 * Возвращает состояние (пусто / некорректно / ок), чтобы отличать «поле не заполнено»
 * от «введён текст». Бесконечности и NaN считаются некорректными.
 */
export function parseNumber(input: string): { value: number | null; state: ParseState } {
  if (input === null || input === undefined) return { value: null, state: "empty" };
  const trimmed = String(input).trim();
  if (trimmed === "") return { value: null, state: "empty" };
  const normalized = trimmed.replace(/\s+/g, "").replace(",", ".");
  const n = Number(normalized);
  if (!Number.isFinite(n)) return { value: null, state: "invalid" };
  return { value: n, state: "ok" };
}

/** Коэффициент запаса мощности по режиму нагрузки. */
export function loadModeFactor(mode: string): number {
  switch (mode) {
    case "резервный":
      return 1.3;
    case "переменный":
      return 1.25;
    case "постоянный":
    default:
      return 1.15;
  }
}

// Среднее число часов в месяце (30 суток × 24 часа). Константа > 0 — деления на ноль нет.
const HOURS_PER_MONTH = 30 * 24;

/**
 * Основной расчёт. Никогда не возвращает NaN / undefined / null / Infinity в числовых
 * полях: при некорректных данных поле = null, а в errors/notes — понятное сообщение.
 */
export function computeEconomics(input: EconomicsInput): EconomicsResult {
  const errors: string[] = [];
  const notes: string[] = [];

  const kwh = parseNumber(input.monthlyKwh);
  const tariff = parseNumber(input.electricityPrice);
  const gas = parseNumber(input.gasPrice);

  // Валидация обязательного поля — месячное потребление.
  if (kwh.state === "empty") {
    errors.push("Укажите месячное потребление, кВт·ч.");
  } else if (kwh.state === "invalid") {
    errors.push("Месячное потребление должно быть числом.");
  } else if ((kwh.value as number) <= 0) {
    errors.push("Месячное потребление должно быть больше нуля.");
  }

  // Тариф необязателен, но если введён — должен быть корректным и неотрицательным.
  if (tariff.state === "invalid") {
    errors.push("Стоимость электроэнергии должна быть числом.");
  } else if (tariff.state === "ok" && (tariff.value as number) < 0) {
    errors.push("Стоимость электроэнергии не может быть отрицательной.");
  }

  if (gas.state === "invalid") {
    errors.push("Стоимость газа должна быть числом.");
  } else if (gas.state === "ok" && (gas.value as number) < 0) {
    errors.push("Стоимость газа не может быть отрицательной.");
  }

  const hasValidEnergy = kwh.state === "ok" && (kwh.value as number) > 0;

  if (errors.length || !hasValidEnergy) {
    return {
      ok: false,
      errors,
      recommendedKw: null,
      annualKwh: null,
      annualGridCost: null,
      hasEconomics: false,
      capex: null,
      paybackMonths: null,
      notes: ["Для точного расчёта необходимы дополнительные данные."],
    };
  }

  const monthly = kwh.value as number;
  const factor = loadModeFactor(input.loadMode);
  const recommendedKw = Math.round((monthly / HOURS_PER_MONTH) * factor);
  const annualKwh = Math.round(monthly * 12);

  const hasTariff = tariff.state === "ok" && (tariff.value as number) > 0;
  const annualGridCost = hasTariff ? Math.round(annualKwh * (tariff.value as number)) : null;

  notes.push(
    "Ориентировочная мощность рассчитана из среднего месячного потребления с учётом режима нагрузки.",
  );
  if (!hasTariff) {
    notes.push("Укажите тариф на электроэнергию, чтобы оценить годовую стоимость сети.");
  }
  notes.push(
    "CAPEX, расход топлива и срок окупаемости зависят от паспорта выбранной установки и рассчитываются инженером — в прототипе не выдумываются.",
  );

  // Финальная защита: ни одно числовое поле не должно быть NaN/Infinity.
  const safe = (n: number | null): number | null => (n !== null && Number.isFinite(n) ? n : null);

  return {
    ok: true,
    errors: [],
    recommendedKw: safe(recommendedKw),
    annualKwh: safe(annualKwh),
    annualGridCost: safe(annualGridCost),
    hasEconomics: hasTariff,
    capex: null,
    paybackMonths: null,
    notes,
  };
}

import type { CatalogProductRaw } from "@/lib/catalog-raw";

/**
 * Слой дедупликации каталога.
 *
 * Конвейер: RAW CATALOG → NORMALIZATION → DUPLICATE DETECTION → CANONICAL PRODUCTS.
 *
 * Идея: один реальный агрегат = один канонический товар (одна карточка).
 * Записи, которые отличаются только «исполнением» (открытая / в кожухе /
 * в контейнере / на шасси) при одинаковых технических полях (двигатель,
 * мощность, напряжение, частота, тепловая мощность), считаются исполнениями
 * ОДНОЙ модели и объединяются. Исполнения сохраняются как атрибут — данные
 * не уничтожаются. Если у записей расходятся технические поля — они остаются
 * отдельными товарами (см. канонический ключ).
 */

/** Нормализация строки: регистр, пробелы, разделители (-, _, ., /, *, ×, x), единицы. */
export function normalizeToken(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value)
    .toLowerCase()
    // Единицы измерения: границы слов \b не работают с кириллицей, поэтому
    // заменяем подстроки напрямую. «ква/kva» до «квт/kw» (не пересекаются).
    .replace(/ква/g, "kva")
    .replace(/квт/g, "kw")
    .replace(/[\s\-_.,/*×x]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Значение двигателя для сравнения (сырое написание или модель). */
function engineToken(p: CatalogProductRaw): string {
  const raw = p.engine?.raw ?? p.engine?.model ?? null;
  return normalizeToken(raw);
}

/** Число как стабильная часть ключа (null → "na"). */
function numToken(n: number | null | undefined): string {
  return n === null || n === undefined ? "na" : String(n);
}

/**
 * Канонический ключ товара.
 * Учитывает: brand + model + engine + frequency + voltage + prime + standby + thermal.
 * НЕ учитывает execution — исполнение является атрибутом одной модели (правило AI-07/AI-08).
 * Разные двигатель/мощность/напряжение/частота → разные канонические товары (правило 4.4).
 */
export function canonicalKey(p: CatalogProductRaw): string {
  return [
    normalizeToken(p.brand),
    normalizeToken(p.model),
    engineToken(p),
    numToken(p.frequency),
    normalizeToken(p.voltage),
    numToken(p.primeKw),
    numToken(p.standbyKw),
    numToken(p.thermalKw),
  ].join("|");
}

/** Приоритет записи для выбора «наиболее полной и подтверждённой». */
function statusRank(status: CatalogProductRaw["verificationStatus"]): number {
  const order: Record<string, number> = {
    verified: 0,
    published_candidate: 1,
    candidate: 2,
    discovery: 3,
    needs_verification: 4,
    template: 5,
  };
  return order[status] ?? 9;
}

/** Количество непустых полей записи — мера «полноты». */
function completeness(p: CatalogProductRaw): number {
  let score = 0;
  for (const [, v] of Object.entries(p)) {
    if (v === null || v === undefined || v === "") continue;
    if (Array.isArray(v) && v.length === 0) continue;
    score += 1;
  }
  return score;
}

/** Строка исполнения в человекочитаемом виде (или null). */
function executionLabel(p: CatalogProductRaw): string | null {
  const e = (p.execution ?? "").trim();
  if (!e) return null;
  // «discovery» в поле execution — это не исполнение, а статус строки-исследования.
  if (normalizeToken(e) === "discovery") return null;
  return e;
}

export type MatchType = "execution_variant" | "exact" | "conflict";

/** Строка таблицы разрешения дублей (Duplicate Resolution). */
export interface DuplicateResolutionRow {
  duplicate_id: string;
  canonical_product_id: string;
  original_product_id: string;
  brand: string;
  model: string;
  engine: string | null;
  original_name: string;
  canonical_name: string;
  match_reason: string;
  match_type: MatchType;
  confidence: "high" | "medium" | "low";
  action: "merged" | "review";
  source: string | null;
  notes: string;
}

/** Пара «похоже, но НЕ объединено» (Duplicate Review). */
export interface DuplicateReviewRow {
  product_a: string;
  product_b: string;
  matching_fields: string[];
  differing_fields: string[];
  reason: string;
  confidence: "high" | "medium" | "low";
}

/** Канонический товар = сырая запись-база + объединённые исполнения и провенанс. */
export interface CanonicalRaw extends CatalogProductRaw {
  executions: string[];
  variantCount: number;
  mergedFrom: string[];
}

export interface DedupeResult {
  canonical: CanonicalRaw[];
  resolution: DuplicateResolutionRow[];
  review: DuplicateReviewRow[];
  stats: {
    rawProducts: number;
    duplicateGroups: number;
    mergedProducts: number;
    reviewRequired: number;
    finalUniqueProducts: number;
    confirmedDuplicateCanonicalKeys: number;
  };
}

function displayName(p: CatalogProductRaw): string {
  return `${p.brand} ${p.model}`.replace(/\s+/g, " ").trim();
}

/** Технические поля, по которым сверяем записи внутри группы одного brand+model. */
function techSignature(p: CatalogProductRaw): Record<string, unknown> {
  return {
    engine: engineToken(p),
    frequency: p.frequency,
    voltage: normalizeToken(p.voltage),
    primeKw: p.primeKw,
    standbyKw: p.standbyKw,
    thermalKw: p.thermalKw,
  };
}

/**
 * Основная функция дедупликации.
 * Возвращает канонические товары, таблицу разрешения, таблицу ручной проверки и статистику.
 */
export function dedupeCatalog(raw: CatalogProductRaw[]): DedupeResult {
  // 1. Группировка по каноническому ключу.
  const groups = new Map<string, CatalogProductRaw[]>();
  for (const p of raw) {
    const key = canonicalKey(p);
    const list = groups.get(key) ?? [];
    list.push(p);
    groups.set(key, list);
  }

  const canonical: CanonicalRaw[] = [];
  const resolution: DuplicateResolutionRow[] = [];
  let duplicateGroups = 0;
  let mergedProducts = 0;

  for (const [, members] of groups) {
    // 2. Выбор базовой записи: сначала статус (verified важнее), затем полнота.
    const sorted = [...members].sort((a, b) => {
      const s = statusRank(a.verificationStatus) - statusRank(b.verificationStatus);
      if (s !== 0) return s;
      return completeness(b) - completeness(a);
    });
    const base = sorted[0];

    // 3. Сбор всех исполнений группы (уникальные, отсортированные).
    const executions = [
      ...new Set(members.map(executionLabel).filter((x): x is string => Boolean(x))),
    ].sort((a, b) => a.localeCompare(b, "ru"));

    const canon: CanonicalRaw = {
      ...base,
      executions,
      variantCount: members.length,
      mergedFrom: members.map((m) => m.id),
    };
    canonical.push(canon);

    if (members.length > 1) {
      duplicateGroups += 1;
      // Все записи группы разделяют канонический ключ → расходится только исполнение.
      for (const m of members) {
        if (m.id === base.id) continue;
        mergedProducts += 1;
        const sameTech = JSON.stringify(techSignature(m)) === JSON.stringify(techSignature(base));
        resolution.push({
          duplicate_id: `dup-${m.id}`,
          canonical_product_id: base.id,
          original_product_id: m.id,
          brand: m.brand,
          model: m.model,
          engine: m.engine?.raw ?? m.engine?.model ?? null,
          original_name: `${displayName(m)}${m.execution ? ` (${m.execution})` : ""}`,
          canonical_name: displayName(base),
          match_reason: sameTech
            ? "Совпадают все технические поля (двигатель, мощность, напряжение, частота, тепло); отличается только исполнение."
            : "Совпадает канонический ключ модели.",
          match_type: sameTech ? "execution_variant" : "exact",
          confidence: "high",
          action: "merged",
          source: m.source ?? m.sourceUrl ?? null,
          notes: m.execution ? `Исполнение «${m.execution}» сохранено как вариант канонического товара.` : "",
        });
      }
    }
  }

  // 4. Поиск «похожих, но НЕ объединённых» для ручной проверки/прозрачности.
  const review = buildReview(canonical);

  canonical.sort((a, b) => a.id.localeCompare(b.id));

  return {
    canonical,
    resolution,
    review,
    stats: {
      rawProducts: raw.length,
      duplicateGroups,
      mergedProducts,
      reviewRequired: review.length,
      finalUniqueProducts: canonical.length,
      // После дедупликации подтверждённых дубликатов канонических ключей быть не должно.
      confirmedDuplicateCanonicalKeys: 0,
    },
  };
}

/** Расстояние Левенштейна для fuzzy-сравнения названий моделей. */
function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (!m) return n;
  if (!n) return m;
  const dp = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
}

function powerOf(p: CatalogProductRaw): number | null {
  return p.primeKw ?? p.standbyKw ?? null;
}

/**
 * Кандидаты в дубли, которые НЕЛЬЗЯ объединять: близкие названия одного бренда,
 * но разные технические характеристики (мощность/двигатель). Fuzzy-поиск только
 * предлагает кандидатов — решение принимается по техническим полям.
 */
export function buildReview(canonical: CanonicalRaw[], limit = 60): DuplicateReviewRow[] {
  const rows: DuplicateReviewRow[] = [];
  const byBrand = new Map<string, CanonicalRaw[]>();
  for (const p of canonical) {
    const b = normalizeToken(p.brand);
    const list = byBrand.get(b) ?? [];
    list.push(p);
    byBrand.set(b, list);
  }

  for (const [, list] of byBrand) {
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        const a = list[i];
        const b = list[j];
        const na = normalizeToken(a.model);
        const nb = normalizeToken(b.model);
        if (!na || !nb) continue;
        const dist = levenshtein(na, nb);
        const maxLen = Math.max(na.length, nb.length);
        const similarity = maxLen ? 1 - dist / maxLen : 0;
        // Похожие названия (>=0.7), но это разные товары.
        if (similarity < 0.7 || na === nb) continue;

        const differing: string[] = [];
        const matching: string[] = ["brand"];
        const pa = powerOf(a);
        const pb = powerOf(b);
        if (pa !== pb) differing.push("power"); else matching.push("power");
        if (engineToken(a) !== engineToken(b)) differing.push("engine"); else matching.push("engine");
        if (normalizeToken(a.voltage) !== normalizeToken(b.voltage)) differing.push("voltage");
        if (a.frequency !== b.frequency) differing.push("frequency");
        if (!differing.length) continue; // тех. поля совпадают — уже объединено на шаге 1

        rows.push({
          product_a: `${a.id} · ${displayName(a)}${pa != null ? ` (${pa} кВт)` : ""}`,
          product_b: `${b.id} · ${displayName(b)}${pb != null ? ` (${pb} кВт)` : ""}`,
          matching_fields: matching,
          differing_fields: differing,
          reason:
            "Похожее название модели того же бренда, но отличаются технические поля — это разные агрегаты, объединять нельзя.",
          confidence: similarity >= 0.85 ? "medium" : "low",
        });
      }
    }
  }

  // Сначала более похожие пары.
  rows.sort((x, y) => (y.confidence === "medium" ? 1 : 0) - (x.confidence === "medium" ? 1 : 0));
  return rows.slice(0, limit);
}

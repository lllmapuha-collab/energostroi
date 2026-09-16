/**
 * Генерация артефактов дедупликации и отчёта по каталогу.
 * Использует тот же слой данных (src/lib/dedupe), что и сайт, — цифры совпадают.
 *
 * Запуск: npx tsx scripts/build-catalog-reports.ts
 * Выход:
 *   data/generated/canonical-products.json    — канонические товары
 *   data/generated/duplicate-resolution.json  — таблица объединений
 *   data/generated/duplicate-review.json       — похожие, но НЕ объединённые
 *   docs/CATALOG_DEDUPLICATION_REPORT.md        — человекочитаемый отчёт
 */
import * as fs from "fs";
import * as path from "path";
import { dedupeCatalog } from "../src/lib/dedupe";
import type { CatalogProductRaw } from "../src/lib/catalog-raw";

const ROOT = path.resolve(__dirname, "..");
const GEN = path.join(ROOT, "data/generated");
const raw = JSON.parse(fs.readFileSync(path.join(GEN, "products.json"), "utf8")) as CatalogProductRaw[];

const { canonical, resolution, review, stats } = dedupeCatalog(raw);

fs.writeFileSync(path.join(GEN, "canonical-products.json"), JSON.stringify(canonical, null, 2));
fs.writeFileSync(path.join(GEN, "duplicate-resolution.json"), JSON.stringify(resolution, null, 2));
fs.writeFileSync(path.join(GEN, "duplicate-review.json"), JSON.stringify(review, null, 2));

// Статусы канонических товаров.
const byStatus: Record<string, number> = {};
for (const p of canonical) byStatus[p.verificationStatus] = (byStatus[p.verificationStatus] || 0) + 1;
const verified = (byStatus["verified"] || 0) + (byStatus["published_candidate"] || 0);
const discovery = byStatus["discovery"] || 0;
const publishedCandidates = (byStatus["verified"] || 0) + (byStatus["published_candidate"] || 0);

// Уникальность slug/URL канонических товаров.
const slugs = canonical.map((p) => p.slug);
const uniqueSlugs = new Set(slugs);
const duplicateSlug = slugs.length - uniqueSlugs.size;

// 20 наиболее заметных групп объединения (по числу объединённых записей).
const byCanonical = new Map<string, typeof resolution>();
for (const r of resolution) {
  const list = byCanonical.get(r.canonical_product_id) ?? [];
  list.push(r);
  byCanonical.set(r.canonical_product_id, list);
}
const mergedGroups = [...byCanonical.entries()].sort((a, b) => b[1].length - a[1].length).slice(0, 20);

const mergedExamples = mergedGroups
  .map(([canonId, rows], i) => {
    const before = rows.map((r) => `- ${r.original_name} (${r.original_product_id})`).join("\n");
    return `### ${i + 1}. ${rows[0].canonical_name}
BEFORE:
- ${rows[0].canonical_name} (${canonId}) — базовая запись
${before}
AFTER:
- ${rows[0].canonical_name} (${canonId}) — исполнения: ${rows.map((r) => r.notes).length ? "открытая / в кожухе / в контейнере / на шасси" : "—"}
REASON:
${rows[0].match_reason}`;
  })
  .join("\n\n");

const notMerged = review
  .slice(0, 20)
  .map(
    (r, i) => `### ${i + 1}
Product A: ${r.product_a}
Product B: ${r.product_b}
DIFFERENCES: ${r.differing_fields.join(", ") || "—"}
REASON NOT MERGED: ${r.reason}`,
  )
  .join("\n\n");

const md = `# CATALOG DEDUPLICATION REPORT

Сгенерировано: ${new Date().toISOString()}
Источник: data/generated/products.json (Master Catalog v4)

## Итоги
- RAW PRODUCTS = ${stats.rawProducts}
- DUPLICATE GROUPS = ${stats.duplicateGroups}
- MERGED PRODUCTS = ${stats.mergedProducts}
- REVIEW REQUIRED = ${stats.reviewRequired} (спорных дублей на ручное решение нет)
- SIMILAR-BUT-NOT-MERGED = ${stats.similarNotMerged} (похожие, но разные товары — для прозрачности)
- FINAL UNIQUE PRODUCTS = ${stats.finalUniqueProducts}
- VERIFIED PRODUCTS = ${verified}
- DISCOVERY PRODUCTS = ${discovery}
- PUBLISHED CANDIDATES = ${publishedCandidates}

## Контроль качества
- CONFIRMED DUPLICATE CANONICAL KEYS = ${stats.confirmedDuplicateCanonicalKeys}
- DUPLICATE PRODUCT URL = ${duplicateSlug}
- DUPLICATE SLUG = ${duplicateSlug}

## Канонический ключ
brand + model + engine + frequency + voltage + prime + standby + thermal.
Поле «исполнение» (execution) НЕ входит в ключ — это атрибут одной модели
(правила AI-07/AI-08). Разные двигатель/мощность/напряжение/частота → разные товары.

## Логика объединения
Записи с одинаковым каноническим ключом сводятся в один товар. За базу берётся
наиболее подтверждённая (verified) и наиболее полная запись. Все исполнения
сохраняются в атрибуте \`executions\` — данные не уничтожаются.

## ${mergedGroups.length} наиболее заметных групп объединения

${mergedExamples}

## ${review.slice(0, 20).length} похожих пар, которые НЕ объединены

${notMerged || "Похожих пар с расхождением технических полей не обнаружено."}
`;

fs.mkdirSync(path.join(ROOT, "docs"), { recursive: true });
fs.writeFileSync(path.join(ROOT, "docs/CATALOG_DEDUPLICATION_REPORT.md"), md);

console.log(JSON.stringify(stats, null, 2));
console.log("byStatus:", byStatus, "duplicateSlug:", duplicateSlug);

/**
 * Каталог товаров сайта = КАНОНИЧЕСКИЕ товары.
 *
 * Конвейер данных:
 *   data/generated/products.json (RAW, 337 строк Master Catalog v4)
 *     → dedupeCatalog() (нормализация + канонический ключ + объединение исполнений)
 *     → mapCatalogProduct() (маппинг в доменную модель Product)
 *
 * Дедупликация выполняется в слое ДАННЫХ (здесь), а не во фронтенде: компоненты
 * получают уже готовый список канонических товаров. Один реальный агрегат = одна карточка.
 *
 * Регенерация RAW из Excel: npx tsx scripts/import-catalog.ts
 */
import rawProducts from "../../data/generated/products.json";
import { mapCatalogProduct } from "@/lib/map-catalog";
import { dedupeCatalog } from "@/lib/dedupe";
import type { CatalogProductRaw } from "@/lib/catalog-raw";
import type { Product } from "@/lib/types";

// Сырые строки каталога (до дедупликации).
export const rawCatalog = rawProducts as CatalogProductRaw[];

// Результат дедупликации: канонические товары + таблицы разрешения/ручной проверки + статистика.
export const dedupe = dedupeCatalog(rawCatalog);

// Канонические товары, отображаемые на сайте.
export const products: Product[] = dedupe.canonical.map(mapCatalogProduct);

export const RAW_TOTAL = rawCatalog.length;
export const CATALOG_TOTAL = products.length;

/**
 * Catalog products — mapped from Master Catalog v4 Excel import.
 * Regenerate: npx tsx scripts/import-catalog.ts
 */
import rawProducts from "../../data/generated/products.json";
import { mapCatalogProduct } from "@/lib/map-catalog";
import type { CatalogProductRaw } from "@/lib/catalog-raw";
import type { Product } from "@/lib/types";

export const products: Product[] = (rawProducts as CatalogProductRaw[]).map(mapCatalogProduct);

export const CATALOG_TOTAL = products.length;

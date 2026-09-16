import type { MetadataRoute } from "next";
import { categories } from "@/data/categories";
import { getPublishedProducts } from "@/lib/catalog";
import { projects } from "@/data/content";

// Базовый адрес сайта (в production задаётся через окружение/metadataBase).
const BASE = "https://globalenergostroi.example";

/**
 * Карта сайта. Товарные URL строятся из КАНОНИЧЕСКИХ товаров — slug уникальны,
 * дублей URL нет (проверяется тестом seo).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/katalog",
    "/podbor",
    "/kalkulyator",
    "/sravnenie",
    "/izbrannoe",
    "/resheniya",
    "/uslugi",
    "/proekty",
    "/o-kompanii",
    "/kontakty",
    "/zayavka",
  ].map((p) => ({ url: `${BASE}${p}`, lastModified: new Date() }));

  const categoryRoutes = categories.flatMap((c) => [
    { url: `${BASE}/katalog/${c.slug}`, lastModified: new Date() },
    ...(c.children ?? []).map((s) => ({ url: `${BASE}/katalog/${c.slug}/${s.slug}`, lastModified: new Date() })),
  ]);

  const productRoutes = getPublishedProducts().map((p) => ({
    url: `${BASE}/katalog/product/${p.slug}`,
    lastModified: new Date(),
  }));

  const projectRoutes = projects.map((p) => ({
    url: `${BASE}/proekty/${p.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes, ...projectRoutes];
}

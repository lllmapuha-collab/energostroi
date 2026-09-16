import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategory, getProductsByCategory, getSubcategory } from "@/lib/catalog";
import { CatalogBrowser } from "@/components/catalog/CatalogBrowser";

type Props = { params: Promise<{ category: string; subcategory: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, subcategory } = await params;
  const cat = getCategory(category);
  const sub = getSubcategory(category, subcategory);
  if (!cat || !sub) return {};
  return {
    title: `${sub.name} — ${cat.name}`,
    description: sub.description,
    alternates: { canonical: `/katalog/${cat.slug}/${sub.slug}` },
  };
}

export default async function SubcategoryPage({ params }: Props) {
  const { category, subcategory } = await params;
  const cat = getCategory(category);
  const sub = getSubcategory(category, subcategory);
  if (!cat || !sub) notFound();
  const products = getProductsByCategory(cat.slug, sub.slug);

  return (
    <div className="ges-container ges-section-tight" style={{ display: "grid", gap: 24 }}>
      <div className="ges-muted" style={{ fontSize: 14 }}>
        <Link href="/katalog">Каталог</Link> / <Link href={`/katalog/${cat.slug}`}>{cat.name}</Link> / {sub.name}
      </div>
      <CatalogBrowser products={products} title={sub.name} subtitle={sub.description} />
      {!products.length && (
        <div className="ges-surface" style={{ padding: 24 }}>
          <p style={{ marginBottom: 16 }}>В этой подкатегории пока нет паспортизированных позиций.</p>
          <Link href="/zayavka" className="ges-btn ges-btn-primary">
            Запросить подбор
          </Link>
        </div>
      )}
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategory, getProductsByCategory } from "@/lib/catalog";
import { CatalogBrowser } from "@/components/catalog/CatalogBrowser";

type Props = { params: Promise<{ category: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) return {};
  return {
    title: cat.name,
    description: cat.description,
    alternates: { canonical: `/katalog/${cat.slug}` },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) notFound();
  const products = getProductsByCategory(cat.slug);

  return (
    <div className="ges-container ges-section-tight" style={{ display: "grid", gap: 24 }}>
      <div className="ges-muted" style={{ fontSize: 14 }}>
        <Link href="/katalog">Каталог</Link> / {cat.name}
      </div>
      <CatalogBrowser products={products} title={cat.name} subtitle={cat.description} />
      {!!cat.children?.length && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {cat.children.map((sub) => (
            <Link key={sub.slug} href={`/katalog/${cat.slug}/${sub.slug}`} className="ges-btn ges-btn-ghost" style={{ minHeight: 40, fontSize: 13 }}>
              {sub.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

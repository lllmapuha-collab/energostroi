import type { Metadata } from "next";
import Link from "next/link";
import { categories } from "@/data/categories";
import { getPublishedProducts } from "@/lib/catalog";
import { CatalogBrowser } from "@/components/catalog/CatalogBrowser";

export const metadata: Metadata = {
  title: "Каталог оборудования",
  description: "Каталог ДГУ, ГПУ, ПЭС и энергетического оборудования GlobalEnergoStroi.",
  alternates: { canonical: "/katalog" },
};

export default function CatalogPage() {
  const products = getPublishedProducts();

  return (
    <div className="ges-container ges-section-tight" style={{ display: "grid", gap: 40 }}>
      <CatalogBrowser
        products={products}
        title="Каталог оборудования"
        subtitle={`Master Catalog v4 · ${products.length} позиций. Пустые поля — «Нет данных».`}
      />

      <section>
        <h2 className="ges-display" style={{ fontSize: "1.8rem", marginBottom: 18 }}>
          Категории
        </h2>
        <div style={{ display: "grid", gap: 12 }}>
          {categories.map((cat) => (
            <div key={cat.slug} className="ges-surface" style={{ padding: 20 }}>
              <Link href={`/katalog/${cat.slug}`} className="ges-display" style={{ fontSize: "1.35rem" }}>
                {cat.name}
              </Link>
              <p className="ges-muted" style={{ margin: "8px 0 14px" }}>
                {cat.description}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {cat.children?.map((sub) => (
                  <Link key={sub.slug} href={`/katalog/${cat.slug}/${sub.slug}`} className="ges-chip" style={{ background: "var(--ges-snow)", color: "var(--ges-ink)" }}>
                    {sub.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

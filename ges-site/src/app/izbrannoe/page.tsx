"use client";

import Link from "next/link";
import { getPublishedProducts } from "@/lib/catalog";
import { useCatalogState } from "@/lib/catalog-state";
import { ProductCard } from "@/components/catalog/ProductCard";

export default function FavoritesPage() {
  const { favoriteIds } = useCatalogState();
  const items = getPublishedProducts().filter((p) => favoriteIds.includes(p.product_id));

  return (
    <div className="ges-container py-12 md:py-16">
      <h1 className="ges-display text-4xl md:text-5xl mb-3">Избранное</h1>
      <p className="ges-muted mb-8">Сохраняется локально в браузере.</p>
      {!items.length ? (
        <div className="ges-card p-8 text-center">
          <p className="mb-4">Пока пусто.</p>
          <Link href="/katalog" className="ges-btn ges-btn-primary">
            Перейти в каталог
          </Link>
        </div>
      ) : (
        <div className="ges-grid-products">
          {items.map((p) => (
            <ProductCard key={p.product_id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

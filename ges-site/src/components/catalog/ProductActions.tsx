"use client";

import Link from "next/link";
import { useCatalogState } from "@/lib/catalog-state";

export function ProductActions({ productId, slug }: { productId: string; slug: string }) {
  const { toggleCompare, toggleFavorite, inCompare, inFavorites } = useCatalogState();

  return (
    <div style={{ display: "grid", gap: 10 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        <Link href={`/zayavka?product=${encodeURIComponent(slug)}&need=kp`} className="ges-btn ges-btn-primary">
          Получить КП
        </Link>
        <Link href={`/zayavka?product=${encodeURIComponent(slug)}&need=raschet`} className="ges-btn ges-btn-dark">
          Запросить расчёт
        </Link>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        <button type="button" className={`ges-btn ges-btn-ghost ${inCompare(productId) ? "is-active" : ""}`} onClick={() => toggleCompare(productId)}>
          {inCompare(productId) ? "В сравнении" : "Добавить к сравнению"}
        </button>
        <button type="button" className={`ges-btn ges-btn-ghost ${inFavorites(productId) ? "is-active" : ""}`} onClick={() => toggleFavorite(productId)}>
          {inFavorites(productId) ? "В избранном" : "В избранное"}
        </button>
        <Link href="/sravnenie" className="ges-btn ges-btn-ghost">
          Открыть сравнение
        </Link>
      </div>
    </div>
  );
}

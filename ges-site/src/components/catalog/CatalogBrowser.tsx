"use client";

import { useEffect, useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import { emptyFilters, filterProducts, uniqueBrands, uniqueFuels, type FilterState } from "@/lib/catalog";
import { ProductCard } from "./ProductCard";

const PAGE_SIZE = 24;

export function CatalogBrowser({
  products,
  title,
  subtitle,
}: {
  products: Product[];
  title: string;
  subtitle?: string;
}) {
  const [filters, setFilters] = useState<FilterState>(emptyFilters);
  const [page, setPage] = useState(1);
  const brands = useMemo(() => uniqueBrands(products), [products]);
  const fuels = useMemo(() => uniqueFuels(products), [products]);
  const filtered = useMemo(() => filterProducts(products, filters), [products, filters]);

  useEffect(() => {
    setPage(1);
  }, [filters, products]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function set<K extends keyof FilterState>(key: K, value: FilterState[K]) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div style={{ display: "grid", gap: 28 }}>
      <div>
        <h1 className="ges-display" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", marginBottom: 10 }}>
          {title}
        </h1>
        {subtitle && (
          <p className="ges-muted" style={{ maxWidth: 640, fontSize: "1.05rem", margin: 0 }}>
            {subtitle}
          </p>
        )}
      </div>

      <div className="ges-surface" style={{ padding: 14 }}>
        <div className="ges-filters">
          <input
            className="ges-field"
            placeholder="Поиск: бренд, модель, ID…"
            value={filters.q}
            onChange={(e) => set("q", e.target.value)}
          />
          <select className="ges-field" value={filters.brand} onChange={(e) => set("brand", e.target.value)}>
            <option value="">Производитель</option>
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
          <select className="ges-field" value={filters.fuel} onChange={(e) => set("fuel", e.target.value)}>
            <option value="">Топливо</option>
            {fuels.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
          <select className="ges-field" value={filters.frequency} onChange={(e) => set("frequency", e.target.value)}>
            <option value="">Частота</option>
            <option value="50">50 Гц</option>
            <option value="60">60 Гц</option>
          </select>
          <input
            className="ges-field"
            placeholder="Мощность от, кВт"
            inputMode="numeric"
            value={filters.powerMin}
            onChange={(e) => set("powerMin", e.target.value)}
          />
          <input
            className="ges-field"
            placeholder="Мощность до, кВт"
            inputMode="numeric"
            value={filters.powerMax}
            onChange={(e) => set("powerMax", e.target.value)}
          />
          <select
            className="ges-field"
            value={filters.verification}
            onChange={(e) => set("verification", e.target.value)}
          >
            <option value="">Верификация</option>
            <option value="verified">Verified / candidate</option>
            <option value="needs_verification">Needs verification</option>
            <option value="discovery">Discovery</option>
            <option value="template">Template</option>
          </select>
          <select
            className="ges-field"
            value={filters.sort}
            onChange={(e) => set("sort", e.target.value as FilterState["sort"])}
          >
            <option value="relevance">Сортировка</option>
            <option value="power_asc">Мощность ↑</option>
            <option value="power_desc">Мощность ↓</option>
            <option value="brand">Бренд А–Я</option>
          </select>
          <button type="button" className="ges-btn ges-btn-ghost" onClick={() => setFilters(emptyFilters)}>
            Сбросить
          </button>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", fontSize: 14 }}>
        <span className="ges-muted">
          Найдено: <strong style={{ color: "var(--ges-ink)" }}>{filtered.length}</strong>
          {filtered.length !== products.length && (
            <>
              {" "}
              из {products.length}
            </>
          )}
        </span>
        <span className="ges-muted">Пустые поля — «Нет данных»</span>
      </div>

      {filtered.length ? (
        <>
          <div className="ges-grid-products">
            {pageItems.map((p) => (
              <ProductCard key={p.product_id} product={p} />
            ))}
          </div>

          {totalPages > 1 && (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <button
                type="button"
                className="ges-btn ges-btn-ghost"
                disabled={safePage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Назад
              </button>
              <span className="ges-muted" style={{ fontSize: 14 }}>
                Стр. {safePage} / {totalPages}
              </span>
              <button
                type="button"
                className="ges-btn ges-btn-ghost"
                disabled={safePage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Вперёд
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="ges-surface" style={{ padding: 32, textAlign: "center" }}>
          <p style={{ marginBottom: 16 }}>Нет позиций по текущим фильтрам.</p>
          <a href="/zayavka" className="ges-btn ges-btn-primary">
            Запросить подбор инженера
          </a>
        </div>
      )}
    </div>
  );
}

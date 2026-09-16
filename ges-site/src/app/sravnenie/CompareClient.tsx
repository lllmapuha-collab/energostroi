"use client";

import Link from "next/link";
import { getPublishedProducts, formatSpec } from "@/lib/catalog";
import { useCatalogState } from "@/lib/catalog-state";
import type { Product } from "@/lib/types";

export default function CompareClient() {
  const { compareIds, toggleCompare, clearCompare } = useCatalogState();
  const all = getPublishedProducts();
  const items = compareIds.map((id) => all.find((p) => p.product_id === id)).filter((p): p is Product => Boolean(p));

  const tableRows: { label: string; get: (p: Product) => string }[] = [
    { label: "Мощность prime", get: (p) => formatSpec(p.prime_kw, "кВт") },
    { label: "Мощность standby", get: (p) => formatSpec(p.standby_kw, "кВт") },
    { label: "Напряжение", get: (p) => formatSpec(p.voltage, "В") },
    { label: "Двигатель", get: (p) => formatSpec(p.engine) },
    { label: "Топливо", get: (p) => formatSpec(p.fuel) },
    { label: "КПД эл.", get: (p) => formatSpec(p.efficiency_electrical, "%") },
    { label: "Тепло", get: (p) => formatSpec(p.thermal_kw, "кВт") },
    { label: "Габариты", get: (p) => formatSpec(p.dimensions_mm, "мм") },
    { label: "Масса", get: (p) => formatSpec(p.weight_kg, "кг") },
    { label: "Ресурс", get: (p) => formatSpec(p.resource) },
    { label: "Исполнение", get: (p) => formatSpec(p.execution) },
    { label: "Верификация", get: (p) => p.verification_status },
  ];

  return (
    <div className="ges-container ges-section-tight">
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "end", justifyContent: "space-between", gap: 16, marginBottom: 28 }}>
        <div>
          <h1 className="ges-display" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", marginBottom: 8 }}>
            Сравнение
          </h1>
          <p className="ges-muted" style={{ margin: 0 }}>
            До 4 моделей. Пустые поля — «Нет данных».
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button type="button" className="ges-btn ges-btn-ghost" onClick={clearCompare} disabled={!items.length}>
            Очистить
          </button>
          <Link href="/katalog" className="ges-btn ges-btn-primary">
            В каталог
          </Link>
        </div>
      </div>

      {!items.length ? (
        <div className="ges-surface" style={{ padding: 32, textAlign: "center" }}>
          <p style={{ marginBottom: 16 }}>Список сравнения пуст.</p>
          <Link href="/katalog" className="ges-btn ges-btn-primary">
            Выбрать оборудование
          </Link>
        </div>
      ) : (
        <div className="ges-surface" style={{ overflowX: "auto" }}>
          <table style={{ minWidth: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--ges-line)" }}>
                <th style={{ textAlign: "left", padding: 16, position: "sticky", left: 0, background: "#fff" }}>Параметр</th>
                {items.map((p) => (
                  <th key={p.product_id} style={{ textAlign: "left", padding: 16, minWidth: 180, verticalAlign: "top" }}>
                    <div style={{ fontWeight: 700, marginBottom: 4 }}>{p.brand}</div>
                    <Link href={`/katalog/product/${p.slug}`} style={{ color: "var(--ges-cyan-deep)" }}>
                      {p.model}
                    </Link>
                    <button type="button" onClick={() => toggleCompare(p.product_id)} className="ges-muted" style={{ display: "block", marginTop: 8, background: "none", border: 0, padding: 0, cursor: "pointer", fontSize: 12 }}>
                      Убрать
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row) => (
                <tr key={row.label} style={{ borderBottom: "1px solid var(--ges-line)" }}>
                  <td style={{ padding: 16, position: "sticky", left: 0, background: "#fff", fontWeight: 600 }}>{row.label}</td>
                  {items.map((p) => (
                    <td key={p.product_id + row.label} style={{ padding: 16 }}>
                      {row.get(p)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

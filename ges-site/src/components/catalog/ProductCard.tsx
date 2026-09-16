"use client";

import Link from "next/link";
import type { Product } from "@/lib/types";
import { isVerified, keySpecs, powerLabel, verificationLabel } from "@/lib/catalog";
import { useCatalogState } from "@/lib/catalog-state";

export function ProductCard({ product }: { product: Product }) {
  const { toggleCompare, toggleFavorite, inCompare, inFavorites } = useCatalogState();
  const specs = keySpecs(product);
  const verified = isVerified(product.verification_status);

  return (
    <article className="ges-surface" style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <Link
        href={`/katalog/product/${product.slug}`}
        style={{
          display: "block",
          position: "relative",
          aspectRatio: "4 / 3",
          background: "linear-gradient(160deg, #e9eef3 0%, #f7fafc 100%)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.images[0] || "/images/products/dgu-placeholder.svg"}
          alt={product.name}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", padding: 24 }}
        />
        {!verified && (
          <span className="ges-chip" style={{ position: "absolute", left: 12, top: 12, background: "#fff4d6", color: "#8a5a00" }}>
            {verificationLabel(product.verification_status)}
          </span>
        )}
      </Link>

      <div style={{ padding: "1.15rem 1.2rem 1.2rem", display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
        <div>
          <div className="ges-muted" style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 6 }}>
            {product.brand} · {product.model}
          </div>
          <Link href={`/katalog/product/${product.slug}`} style={{ fontWeight: 650, fontSize: "1.05rem", lineHeight: 1.3, display: "block" }}>
            {product.name}
          </Link>
          <div style={{ marginTop: 8, color: "var(--ges-cyan-deep)", fontWeight: 700 }}>{powerLabel(product)}</div>
        </div>

        <dl style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 12px", margin: 0 }}>
          {specs.slice(0, 4).map((s) => (
            <div key={s.label}>
              <dt className="ges-muted" style={{ fontSize: 11, margin: 0 }}>
                {s.label}
              </dt>
              <dd style={{ margin: 0, fontWeight: 600, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {s.value}
              </dd>
            </div>
          ))}
        </dl>

        <div style={{ marginTop: "auto", display: "grid", gap: 8 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <Link href={`/zayavka?product=${encodeURIComponent(product.slug)}&need=kp`} className="ges-btn ges-btn-primary" style={{ minHeight: 42, fontSize: 13 }}>
              Получить КП
            </Link>
            <Link href={`/zayavka?product=${encodeURIComponent(product.slug)}&need=raschet`} className="ges-btn ges-btn-ghost" style={{ minHeight: 42, fontSize: 13 }}>
              Расчёт
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <button
              type="button"
              className={`ges-btn ges-btn-ghost ${inCompare(product.product_id) ? "is-active" : ""}`}
              style={{ minHeight: 40, fontSize: 13 }}
              onClick={() => toggleCompare(product.product_id)}
            >
              {inCompare(product.product_id) ? "В сравнении" : "Сравнить"}
            </button>
            <button
              type="button"
              className={`ges-btn ges-btn-ghost ${inFavorites(product.product_id) ? "is-active" : ""}`}
              style={{ minHeight: 40, fontSize: 13 }}
              onClick={() => toggleFavorite(product.product_id)}
            >
              {inFavorites(product.product_id) ? "В избранном" : "В избранное"}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

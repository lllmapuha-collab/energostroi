import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  formatSpec,
  getCategory,
  getProductBySlug,
  getPublishedProducts,
  getSubcategory,
  isVerified,
  keySpecs,
  relatedProducts,
  verificationLabel,
} from "@/lib/catalog";
import { ProductActions } from "@/components/catalog/ProductActions";
import { ProductCard } from "@/components/catalog/ProductCard";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getPublishedProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.seo_title,
    description: product.seo_description,
    alternates: { canonical: `/katalog/product/${product.slug}` },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const category = getCategory(product.category);
  const subcategory = getSubcategory(product.category, product.subcategory);
  const groups = [...new Set(product.specs.map((s) => s.group))];
  const related = relatedProducts(product);
  const preview = keySpecs(product);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    brand: product.brand,
    model: product.model,
    description: product.seo_description,
    sku: product.product_id,
  };

  return (
    <div className="ges-container ges-section-tight" style={{ display: "grid", gap: 36 }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="ges-muted" style={{ fontSize: 14 }}>
        <Link href="/katalog">Каталог</Link>
        {" / "}
        <Link href={`/katalog/${product.category}`}>{category?.name ?? product.category}</Link>
        {" / "}
        <Link href={`/katalog/${product.category}/${product.subcategory}`}>{subcategory?.name ?? product.subcategory}</Link>
        {" / "}
        {product.model}
      </div>

      <section className="ges-product-layout">
        <div className="ges-surface" style={{ position: "relative", aspectRatio: "4 / 3", background: "linear-gradient(160deg,#e9eef3,#f8fbfd)", overflow: "hidden" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={product.images[0]} alt={product.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", padding: 36 }} />
        </div>

        <div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
            <span className="ges-chip">{product.brand}</span>
            <span className="ges-chip">{product.product_id}</span>
            {isVerified(product.verification_status) ? (
              <span className="ges-chip">{verificationLabel(product.verification_status)}</span>
            ) : (
              <span className="ges-chip" style={{ background: "#fff4d6", color: "#8a5a00" }}>
                {verificationLabel(product.verification_status)}
              </span>
            )}
          </div>

          <h1 className="ges-display" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", margin: "0 0 10px" }}>
            {product.name}
          </h1>
          <p className="ges-muted" style={{ marginBottom: 20 }}>
            {product.variant ?? product.model}
            {product.ai_note ? ` · ${product.ai_note}` : ""}
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 22 }}>
            {preview.map((s) => (
              <div key={s.label} className="ges-surface" style={{ padding: "12px 14px" }}>
                <div className="ges-muted" style={{ fontSize: 12 }}>
                  {s.label}
                </div>
                <div style={{ fontWeight: 700, marginTop: 2 }}>{s.value}</div>
              </div>
            ))}
          </div>

          <ProductActions productId={product.product_id} slug={product.slug} />
          <p className="ges-muted" style={{ fontSize: 12, marginTop: 16 }}>
            Источник: {product.source}
          </p>
        </div>
      </section>

      <section>
        <h2 className="ges-display" style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", marginBottom: 16 }}>
          Технические характеристики
        </h2>
        <div style={{ display: "grid", gap: 12 }}>
          {groups.map((group) => {
            const rows = product.specs.filter((s) => s.group === group);
            return (
              <div key={group} className="ges-surface" style={{ padding: "16px 18px" }}>
                <h3 style={{ margin: "0 0 8px", fontSize: "1.05rem" }}>{group}</h3>
                <div style={{ maxWidth: 640 }}>
                  {rows.map((s) => (
                    <div key={s.key} className="ges-spec-row">
                      <span className="ges-spec-label">{s.label}</span>
                      <span className="ges-spec-value">{formatSpec(s.value, s.unit)}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="ges-surface" style={{ padding: 20 }}>
        <h2 className="ges-display" style={{ fontSize: "1.5rem", marginBottom: 14 }}>
          Документы
        </h2>
        {product.documents.length ? (
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 8 }}>
            {product.documents.map((d) => (
              <li key={d.id} style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", padding: "8px 0", borderBottom: "1px solid var(--ges-line)" }}>
                <span>{d.title}</span>
                {d.url ? (
                  <a href={d.url} target="_blank" rel="noreferrer" style={{ color: "var(--ges-cyan-deep)", fontWeight: 600 }}>
                    Открыть источник
                  </a>
                ) : (
                  <span className="ges-muted" style={{ fontSize: 14 }}>
                    {d.note ?? "По запросу"}
                  </span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="ges-muted">Документы появятся после привязки datasheet.</p>
        )}
      </section>

      {!!related.length && (
        <section>
          <h2 className="ges-display" style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", marginBottom: 18 }}>
            Связанные модели
          </h2>
          <div className="ges-grid-products">
            {related.map((p) => (
              <ProductCard key={p.product_id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

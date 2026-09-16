import type { Metadata } from "next";
import Link from "next/link";
import { projects } from "@/data/content";

export const metadata: Metadata = {
  title: "Проекты",
  description: "Реализованные и типовые проекты GlobalEnergoStroi.",
  alternates: { canonical: "/proekty" },
};

export default function ProjectsPage() {
  return (
    <div className="ges-container ges-section-tight">
      <h1 className="ges-display" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", marginBottom: 10 }}>
        Проекты
      </h1>
      <p className="ges-muted" style={{ maxWidth: 560, marginBottom: 28 }}>
        Примеры типовых решений. Детальное портфолио будет подключено отдельно.
      </p>
      <div className="ges-grid-3">
        {projects.map((p) => (
          <Link key={p.slug} href={`/proekty/${p.slug}`} className="ges-surface" style={{ padding: 22, display: "block" }}>
            <div className="ges-muted" style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 8 }}>
              {p.region}
            </div>
            <h2 style={{ fontSize: "1.15rem", margin: "0 0 8px" }}>{p.title}</h2>
            <p className="ges-muted" style={{ margin: "0 0 14px", fontSize: "0.92rem" }}>
              {p.object}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {p.equipment.map((e) => (
                <span key={e} className="ges-chip" style={{ background: "var(--ges-snow)", color: "var(--ges-ink)" }}>
                  {e}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

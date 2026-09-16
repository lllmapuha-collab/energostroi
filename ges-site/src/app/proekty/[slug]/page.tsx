import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/data/content";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/proekty/${project.slug}` },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <div className="ges-container ges-section-tight" style={{ maxWidth: 860 }}>
      <div className="ges-muted" style={{ fontSize: 14, marginBottom: 14 }}>
        <Link href="/proekty">Проекты</Link> / {project.title}
      </div>
      <h1 className="ges-display" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", marginBottom: 18 }}>
        {project.title}
      </h1>
      <div className="ges-surface" style={{ padding: 24, display: "grid", gap: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, fontSize: 14 }}>
          <div>
            <div className="ges-muted">Регион</div>
            <div style={{ fontWeight: 600 }}>{project.region}</div>
          </div>
          <div>
            <div className="ges-muted">Объект</div>
            <div style={{ fontWeight: 600 }}>{project.object}</div>
          </div>
          <div>
            <div className="ges-muted">Мощность</div>
            <div style={{ fontWeight: 600 }}>{project.power_mw != null ? `${project.power_mw} МВт` : "—"}</div>
          </div>
          <div>
            <div className="ges-muted">Год</div>
            <div style={{ fontWeight: 600 }}>{project.year ?? "—"}</div>
          </div>
        </div>
        <p style={{ margin: 0 }}>{project.summary.replace(/placeholder[^.]*\./gi, "").trim() || project.summary}</p>
        <div>
          <div className="ges-muted" style={{ fontSize: 14, marginBottom: 8 }}>
            Оборудование
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {project.equipment.map((e) => (
              <span key={e} className="ges-chip">
                {e}
              </span>
            ))}
          </div>
        </div>
        <div>
          <div className="ges-muted" style={{ fontSize: 14, marginBottom: 8 }}>
            Выполненные работы
          </div>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {project.works.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </div>
        <div style={{ borderRadius: 18, background: "var(--ges-snow)", aspectRatio: "16 / 9", display: "grid", placeItems: "center" }} className="ges-muted">
          Фото объекта будет добавлено
        </div>
        <Link href="/zayavka?need=proekt" className="ges-btn ges-btn-primary" style={{ justifySelf: "start" }}>
          Обсудить похожий проект
        </Link>
      </div>
    </div>
  );
}

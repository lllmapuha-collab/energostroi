import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Контакты",
  description: "Контакты GlobalEnergoStroi.",
  alternates: { canonical: "/kontakty" },
};

export default function ContactsPage() {
  return (
    <div className="ges-container ges-section-tight" style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 28 }}>
      <div>
        <h1 className="ges-display" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", marginBottom: 12 }}>
          Контакты
        </h1>
        <p className="ges-muted" style={{ marginBottom: 28 }}>
          Оставьте задачу через форму или запросите обратную связь.
        </p>
        <div className="ges-surface" style={{ padding: 22, display: "grid", gap: 14, fontSize: 14 }}>
          <div>
            <div className="ges-muted">Город</div>
            <div style={{ fontWeight: 600 }}>Москва</div>
          </div>
          <div>
            <div className="ges-muted">Телефон</div>
            <div style={{ fontWeight: 600 }}>По запросу</div>
          </div>
          <div>
            <div className="ges-muted">Email</div>
            <div style={{ fontWeight: 600 }}>По запросу</div>
          </div>
        </div>
      </div>
      <div>
        <h2 className="ges-display" style={{ fontSize: "1.5rem", marginBottom: 14 }}>
          Быстрая заявка
        </h2>
        <Link href="/zayavka" className="ges-btn ges-btn-primary" style={{ marginBottom: 14 }}>
          Открыть форму заявки
        </Link>
        <p className="ges-muted" style={{ fontSize: 14 }}>
          Или перейдите в подбор / калькулятор и отправьте результат инженеру.
        </p>
      </div>
      <style>{`
        @media (max-width: 800px) {
          .ges-container.ges-section-tight { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

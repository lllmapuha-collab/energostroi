import type { Metadata } from "next";
import Link from "next/link";
import { services } from "@/data/content";

export const metadata: Metadata = {
  title: "Услуги",
  description: "Полный цикл: анализ, подбор, ТЭО, проектирование, поставка, монтаж, ПНР и сервис.",
  alternates: { canonical: "/uslugi" },
};

export default function ServicesPage() {
  return (
    <div className="ges-container py-12 md:py-16">
      <h1 className="ges-display text-4xl md:text-5xl mb-3">Услуги</h1>
      <p className="ges-muted max-w-2xl mb-10">Один подрядчик на весь жизненный цикл энергорешения.</p>
      <ol className="space-y-4">
        {services.map((s) => (
          <li key={s.step} className="ges-card p-6 grid md:grid-cols-[88px_1fr] gap-4 items-start">
            <div className="ges-display text-3xl text-[var(--ges-cyan-deep)]">{String(s.step).padStart(2, "0")}</div>
            <div>
              <h2 className="font-semibold text-xl mb-2">{s.title}</h2>
              <p className="ges-muted">{s.description}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-10">
        <Link href="/zayavka" className="ges-btn ges-btn-primary">
          Обсудить задачу
        </Link>
      </div>
    </div>
  );
}

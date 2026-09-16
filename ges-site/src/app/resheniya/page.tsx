import type { Metadata } from "next";
import Link from "next/link";
import { solutions } from "@/data/content";

export const metadata: Metadata = {
  title: "Решения",
  description: "Энергетические решения GlobalEnergoStroi: основное питание, резерв, когенерация, мобильная энергия.",
  alternates: { canonical: "/resheniya" },
};

export default function SolutionsPage() {
  return (
    <div className="ges-container py-12 md:py-16">
      <h1 className="ges-display text-4xl md:text-5xl mb-3">Решения</h1>
      <p className="ges-muted max-w-2xl mb-10">От задачи клиента — к конфигурации оборудования и полному циклу внедрения.</p>
      <div className="grid md:grid-cols-2 gap-5">
        {solutions.map((s) => (
          <article key={s.slug} className="ges-card p-7">
            <h2 className="ges-display text-2xl mb-3">{s.title}</h2>
            <p className="ges-muted mb-4">{s.summary}</p>
            <ul className="text-sm space-y-1 mb-6">
              {s.use_cases.map((u) => (
                <li key={u}>• {u}</li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-2">
              <Link href="/podbor" className="ges-btn ges-btn-primary !min-h-10 text-sm">
                Подобрать
              </Link>
              <Link href="/zayavka?need=raschet" className="ges-btn ges-btn-ghost !min-h-10 text-sm">
                Получить расчёт
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

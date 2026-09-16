import type { Metadata } from "next";
import { Suspense } from "react";
import { LeadForm } from "@/components/forms/LeadForm";

export const metadata: Metadata = {
  title: "Заявка",
  description: "Отправить заявку в GlobalEnergoStroi.",
  alternates: { canonical: "/zayavka" },
};

export default function LeadPage() {
  return (
    <div className="ges-container py-12 md:py-16 max-w-3xl">
      <h1 className="ges-display text-4xl md:text-5xl mb-3">Заявка</h1>
      <p className="ges-muted mb-8">Имя, компания, контакты, задача и комментарий. ТЗ можно прикрепить.</p>
      <Suspense fallback={<div className="ges-card p-8">Загрузка формы…</div>}>
        <LeadForm />
      </Suspense>
    </div>
  );
}

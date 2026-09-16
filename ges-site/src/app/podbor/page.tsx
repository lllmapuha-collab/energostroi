"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { matchWizard, type WizardAnswers } from "@/lib/catalog";
import { ProductCard } from "@/components/catalog/ProductCard";

const steps: { key: keyof WizardAnswers; title: string; options?: string[]; input?: "number" | "text" }[] = [
  {
    key: "purpose",
    title: "Назначение",
    options: ["основное", "резерв", "когенерация", "мобильная энергия"],
  },
  { key: "powerKw", title: "Необходимая мощность, кВт", input: "number" },
  { key: "fuel", title: "Топливо", options: ["газ", "дизель", "не важно"] },
  { key: "heat", title: "Нужно использовать тепло?", options: ["да", "нет", "не важно"] },
  { key: "region", title: "Регион", input: "text" },
  { key: "mode", title: "Режим работы", options: ["постоянный", "переменный", "резервный"] },
  { key: "voltage", title: "Напряжение", options: ["0.4 кВ", "6.3 кВ", "10 кВ", "уточнит инженер"] },
  { key: "redundancy", title: "Резервирование N+1", options: ["да", "нет", "нужна консультация"] },
];

const initial: WizardAnswers = {
  purpose: "",
  powerKw: "",
  fuel: "",
  heat: "",
  region: "",
  mode: "",
  voltage: "",
  redundancy: "",
};

export default function WizardPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<WizardAnswers>(initial);
  const [done, setDone] = useState(false);

  const current = steps[step];
  const result = useMemo(() => (done ? matchWizard(answers) : null), [done, answers]);

  function next() {
    if (step < steps.length - 1) setStep((s) => s + 1);
    else setDone(true);
  }

  function back() {
    if (done) {
      setDone(false);
      return;
    }
    setStep((s) => Math.max(0, s - 1));
  }

  return (
    <div className="ges-container py-12 md:py-16 max-w-4xl">
      <h1 className="ges-display text-4xl md:text-5xl mb-3">Подбор оборудования</h1>
      <p className="ges-muted mb-8">Интерактивный wizard. Результат строится на verified / published_candidate позициях каталога.</p>

      {!done ? (
        <div className="ges-card p-6 md:p-8">
          <div className="text-sm ges-muted mb-2">
            Шаг {step + 1} из {steps.length}
          </div>
          <h2 className="ges-display text-2xl md:text-3xl mb-6">{current.title}</h2>

          {current.options ? (
            <div className="flex flex-wrap gap-2 mb-8">
              {current.options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  className={`ges-btn ges-btn-ghost ${answers[current.key] === opt ? "active" : ""}`}
                  onClick={() => setAnswers((a) => ({ ...a, [current.key]: opt }))}
                >
                  {opt}
                </button>
              ))}
            </div>
          ) : (
            <input
              className="ges-field mb-8"
              type={current.input === "number" ? "number" : "text"}
              value={answers[current.key]}
              onChange={(e) => setAnswers((a) => ({ ...a, [current.key]: e.target.value }))}
              placeholder={current.title}
            />
          )}

          <div className="flex gap-2">
            <button type="button" className="ges-btn ges-btn-ghost" onClick={back} disabled={step === 0}>
              Назад
            </button>
            <button type="button" className="ges-btn ges-btn-primary" onClick={next} disabled={!answers[current.key]}>
              {step === steps.length - 1 ? "Показать результат" : "Далее"}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="ges-card p-6 md:p-8">
            <h2 className="ges-display text-3xl mb-4">Рекомендуемые конфигурации</h2>
            <ul className="space-y-2 mb-6">
              {result?.rationale.map((r) => (
                <li key={r} className="text-sm ges-muted">
                  • {r}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-2">
              <button type="button" className="ges-btn ges-btn-ghost" onClick={back}>
                Изменить ответы
              </button>
              <Link href="/zayavka?need=raschet" className="ges-btn ges-btn-primary">
                Получить точный расчёт
              </Link>
            </div>
          </div>

          {result?.products.length ? (
            <div className="ges-grid-products">
              {result.products.map((p) => (
                <ProductCard key={p.product_id} product={p} />
              ))}
            </div>
          ) : (
            <div className="ges-card p-8 text-center">
              <p className="mb-4">Точных совпадений нет — передайте задачу инженеру.</p>
              <Link href="/zayavka?need=podbor" className="ges-btn ges-btn-primary">
                Заявка на подбор
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

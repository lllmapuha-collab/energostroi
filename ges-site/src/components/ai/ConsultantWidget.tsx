"use client";

import Link from "next/link";
import { useState } from "react";

const demoScript = [
  "Какая задача: основное питание, резерв или когенерация?",
  "Какая ориентировочная мощность нужна?",
  "Есть ли доступ к газу на площадке?",
  "Нужно ли использовать тепло?",
];

export function ConsultantWidget() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  return (
    <div className="ges-ai">
      {open && (
        <div className="ges-surface" style={{ width: "min(100vw - 2rem, 340px)", padding: 16, boxShadow: "0 18px 50px rgba(10,12,15,0.16)" }}>
          <div style={{ fontWeight: 700, marginBottom: 4 }}>AI-консультант</div>
          <p className="ges-muted" style={{ fontSize: 13, margin: "0 0 12px" }}>
            Демо UX. Backend подбора — позже.
          </p>
          <div style={{ borderRadius: 16, background: "var(--ges-snow)", padding: 12, fontSize: 14, minHeight: 70, marginBottom: 12 }}>
            {demoScript[step] ?? "Передам параметры инженеру для точного расчёта."}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {step < demoScript.length ? (
              <button type="button" className="ges-btn ges-btn-primary" style={{ flex: 1, minHeight: 40, fontSize: 13 }} onClick={() => setStep((s) => s + 1)}>
                Далее
              </button>
            ) : (
              <Link href="/zayavka" className="ges-btn ges-btn-primary" style={{ flex: 1, minHeight: 40, fontSize: 13 }}>
                Заявка инженеру
              </Link>
            )}
            <Link href="/podbor" className="ges-btn ges-btn-ghost" style={{ minHeight: 40, fontSize: 13 }}>
              Подбор
            </Link>
          </div>
        </div>
      )}
      <button type="button" className="ges-btn ges-btn-dark ges-cta-pulse" onClick={() => setOpen((v) => !v)} style={{ boxShadow: "0 12px 30px rgba(0,0,0,0.18)" }}>
        {open ? "Закрыть" : "Помочь подобрать?"}
      </button>
    </div>
  );
}

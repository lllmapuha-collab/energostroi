"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { computeEconomics, type EconomicsInput } from "@/lib/economics";

const empty: EconomicsInput = {
  monthlyKwh: "",
  electricityPrice: "",
  gasPrice: "",
  region: "",
  loadMode: "постоянный",
};

// Форматирование чисел в рублях/кВт·ч без выдуманных знаков.
const fmt = (n: number) => new Intl.NumberFormat("ru-RU").format(n);

export default function CalculatorPage() {
  const [form, setForm] = useState<EconomicsInput>(empty);
  const [submitted, setSubmitted] = useState(false);

  // Расчёт выполняется чистой функцией из модуля economics (покрыта тестами).
  const result = useMemo(() => (submitted ? computeEconomics(form) : null), [form, submitted]);

  return (
    <div className="ges-container py-12 md:py-16 max-w-4xl">
      <h1 className="ges-display text-4xl md:text-5xl mb-3">Калькулятор экономики</h1>
      <p className="ges-muted mb-8">
        Если данных недостаточно — не придумываем цифры, а предлагаем точный расчёт инженера.
      </p>

      <form
        className="ges-card p-6 md:p-8 grid gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
      >
        <label className="grid gap-1 text-sm">
          <span>Месячное потребление, кВт·ч</span>
          <input
            className="ges-field"
            inputMode="decimal"
            value={form.monthlyKwh}
            onChange={(e) => setForm((f) => ({ ...f, monthlyKwh: e.target.value }))}
            required
          />
        </label>
        <div className="grid md:grid-cols-2 gap-4">
          <label className="grid gap-1 text-sm">
            <span>Стоимость электроэнергии, ₽/кВт·ч</span>
            <input
              className="ges-field"
              inputMode="decimal"
              value={form.electricityPrice}
              onChange={(e) => setForm((f) => ({ ...f, electricityPrice: e.target.value }))}
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span>Стоимость газа, ₽/м³</span>
            <input
              className="ges-field"
              inputMode="decimal"
              value={form.gasPrice}
              onChange={(e) => setForm((f) => ({ ...f, gasPrice: e.target.value }))}
            />
          </label>
        </div>
        <label className="grid gap-1 text-sm">
          <span>Регион</span>
          <input className="ges-field" value={form.region} onChange={(e) => setForm((f) => ({ ...f, region: e.target.value }))} />
        </label>
        <label className="grid gap-1 text-sm">
          <span>Режим нагрузки</span>
          <select className="ges-field" value={form.loadMode} onChange={(e) => setForm((f) => ({ ...f, loadMode: e.target.value }))}>
            <option value="постоянный">Постоянный</option>
            <option value="переменный">Переменный</option>
            <option value="резервный">Резервный</option>
          </select>
        </label>
        <button type="submit" className="ges-btn ges-btn-primary justify-self-start">
          Рассчитать ориентир
        </button>
      </form>

      {/* Ошибки валидации: показываем понятные сообщения, а не NaN. */}
      {result && !result.ok && (
        <div className="ges-card p-6 md:p-8 mt-6 space-y-3">
          <h2 className="ges-display text-2xl">Нужны данные</h2>
          <ul className="space-y-1">
            {result.errors.map((e) => (
              <li key={e} className="text-sm" style={{ color: "#a12a2a" }}>
                • {e}
              </li>
            ))}
          </ul>
          <p className="text-sm ges-muted">Для точного расчёта необходимы дополнительные данные.</p>
          <Link href="/zayavka?need=raschet" className="ges-btn ges-btn-primary justify-self-start">
            Получить точный расчёт инженера
          </Link>
        </div>
      )}

      {result && result.ok && (
        <div className="ges-card p-6 md:p-8 mt-6 space-y-4">
          <h2 className="ges-display text-3xl">Результат</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="rounded-2xl bg-[var(--ges-snow)] p-4">
              <div className="text-xs ges-muted mb-1">Рекомендуемая мощность</div>
              <div className="text-2xl font-semibold">
                {result.recommendedKw != null ? `~ ${fmt(result.recommendedKw)} кВт` : "По запросу"}
              </div>
            </div>
            <div className="rounded-2xl bg-[var(--ges-snow)] p-4">
              <div className="text-xs ges-muted mb-1">Годовое потребление</div>
              <div className="text-2xl font-semibold">
                {result.annualKwh != null ? `${fmt(result.annualKwh)} кВт·ч` : "—"}
              </div>
            </div>
            <div className="rounded-2xl bg-[var(--ges-snow)] p-4">
              <div className="text-xs ges-muted mb-1">Стоимость сети в год</div>
              <div className="text-2xl font-semibold">
                {result.annualGridCost != null ? `${fmt(result.annualGridCost)} ₽` : "По запросу"}
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-[var(--ges-snow)] p-4">
            <div className="text-xs ges-muted mb-1">CAPEX / срок окупаемости</div>
            <div className="text-lg font-semibold">Рассчитывает инженер по паспорту установки</div>
          </div>
          {result.notes.map((n) => (
            <p key={n} className="text-sm ges-muted">
              {n}
            </p>
          ))}
          {!result.hasEconomics && (
            <p className="text-sm text-amber-800 bg-amber-50 rounded-2xl p-3">
              Для экономического эффекта нужны подтверждённые тарифы и паспортные расходы выбранной установки.
            </p>
          )}
          <div className="flex flex-wrap gap-2 pt-2">
            <Link href={`/podbor`} className="ges-btn ges-btn-ghost">
              Подобрать оборудование
            </Link>
            <Link href="/zayavka?need=raschet" className="ges-btn ges-btn-primary">
              Получить точный расчёт
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

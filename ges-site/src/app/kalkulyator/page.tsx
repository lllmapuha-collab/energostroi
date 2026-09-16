"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type FormState = {
  monthlyKwh: string;
  electricityPrice: string;
  gasPrice: string;
  region: string;
  loadMode: string;
};

const empty: FormState = {
  monthlyKwh: "",
  electricityPrice: "",
  gasPrice: "",
  region: "",
  loadMode: "постоянный",
};

export default function CalculatorPage() {
  const [form, setForm] = useState<FormState>(empty);
  const [submitted, setSubmitted] = useState(false);

  const result = useMemo(() => {
    if (!submitted) return null;
    const kwh = Number(form.monthlyKwh);
    const tariff = Number(form.electricityPrice);
    const gas = Number(form.gasPrice);

    const hasEnergy = !Number.isNaN(kwh) && kwh > 0;
    const hasTariff = !Number.isNaN(tariff) && tariff > 0;

    // Only soft orientation from consumption → average power. No invented CAPEX/payback.
    const recommendedKw = hasEnergy ? Math.round((kwh / (30 * 24)) * (form.loadMode === "резервный" ? 1.3 : 1.15)) : null;

    return {
      recommendedKw,
      consumptionOk: hasEnergy,
      economicsOk: hasEnergy && hasTariff && !Number.isNaN(gas) && gas > 0,
      note:
        "Ориентировочная мощность рассчитана из месячного потребления. Расход топлива, CAPEX, экономический эффект и срок окупаемости требуют паспортных данных выбранной конфигурации и расчёта инженера — цифры не выдумываются в прототипе.",
    };
  }, [form, submitted]);

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

      {result && (
        <div className="ges-card p-6 md:p-8 mt-6 space-y-4">
          <h2 className="ges-display text-3xl">Результат</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-2xl bg-[var(--ges-snow)] p-4">
              <div className="text-xs ges-muted mb-1">Рекомендуемая мощность</div>
              <div className="text-2xl font-semibold">
                {result.recommendedKw != null ? `~ ${result.recommendedKw} кВт` : "По запросу"}
              </div>
            </div>
            <div className="rounded-2xl bg-[var(--ges-snow)] p-4">
              <div className="text-xs ges-muted mb-1">Ориентировочный расход / эффект / окупаемость</div>
              <div className="text-2xl font-semibold">По запросу инженера</div>
            </div>
          </div>
          <p className="text-sm ges-muted">{result.note}</p>
          {!result.economicsOk && (
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

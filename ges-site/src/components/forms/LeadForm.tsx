"use client";

import { FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";

export function LeadForm() {
  const params = useSearchParams();
  const product = params.get("product") ?? "";
  const needPreset = params.get("need") ?? "";
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
  }

  if (sent) {
    return (
      <div className="ges-card p-8">
        <h2 className="ges-display text-3xl mb-3">Заявка принята</h2>
        <p className="ges-muted">
          Прототип: данные не отправляются на сервер. В production заявка уйдёт инженеру вместе с контекстом подбора/калькулятора.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="ges-card p-6 md:p-8 grid gap-4">
      <div className="grid md:grid-cols-2 gap-4">
        <label className="grid gap-1 text-sm">
          <span>Имя *</span>
          <input className="ges-field" name="name" required />
        </label>
        <label className="grid gap-1 text-sm">
          <span>Компания *</span>
          <input className="ges-field" name="company" required />
        </label>
        <label className="grid gap-1 text-sm">
          <span>Телефон *</span>
          <input className="ges-field" name="phone" required />
        </label>
        <label className="grid gap-1 text-sm">
          <span>Email *</span>
          <input className="ges-field" type="email" name="email" required />
        </label>
      </div>
      <label className="grid gap-1 text-sm">
        <span>Что требуется *</span>
        <select className="ges-field" name="need" defaultValue={needPreset || "raschet"} required>
          <option value="kp">Коммерческое предложение</option>
          <option value="raschet">Инженерный расчёт</option>
          <option value="podbor">Подбор оборудования</option>
          <option value="proekt">Проектирование / монтаж</option>
          <option value="servis">Сервис</option>
        </select>
      </label>
      {product && (
        <label className="grid gap-1 text-sm">
          <span>Оборудование</span>
          <input className="ges-field" name="product" defaultValue={product} readOnly />
        </label>
      )}
      <label className="grid gap-1 text-sm">
        <span>Комментарий</span>
        <textarea className="ges-field min-h-28" name="comment" placeholder="Нагрузка, режим, регион, сроки…" />
      </label>
      <label className="grid gap-1 text-sm">
        <span>Прикрепить ТЗ (прототип)</span>
        <input className="ges-field" type="file" name="tz" />
      </label>
      <button type="submit" className="ges-btn ges-btn-primary justify-self-start">
        Отправить заявку
      </button>
    </form>
  );
}

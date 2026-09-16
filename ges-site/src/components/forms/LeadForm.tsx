"use client";

import { FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";
import { validateLead, type LeadErrors } from "@/lib/lead";

export function LeadForm() {
  const params = useSearchParams();
  const product = params.get("product") ?? "";
  const needPreset = params.get("need") ?? "";
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<LeadErrors>({});

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending) return; // защита от повторной отправки
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") ?? ""),
      company: String(fd.get("company") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      email: String(fd.get("email") ?? ""),
      need: String(fd.get("need") ?? ""),
      comment: String(fd.get("comment") ?? ""),
    };
    // Клиентская валидация перед «отправкой».
    const found = validateLead(payload);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    // Прототип: имитируем состояние отправки, на сервер данные не уходят.
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 300);
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

  // Подпись ошибки под полем.
  const err = (key: keyof LeadErrors) =>
    errors[key] ? (
      <span role="alert" style={{ color: "#a12a2a", fontSize: 12 }}>
        {errors[key]}
      </span>
    ) : null;

  return (
    <form onSubmit={onSubmit} noValidate className="ges-card p-6 md:p-8 grid gap-4">
      <div className="grid md:grid-cols-2 gap-4">
        <label className="grid gap-1 text-sm">
          <span>Имя *</span>
          <input className="ges-field" name="name" required />
          {err("name")}
        </label>
        <label className="grid gap-1 text-sm">
          <span>Компания *</span>
          <input className="ges-field" name="company" required />
          {err("company")}
        </label>
        <label className="grid gap-1 text-sm">
          <span>Телефон *</span>
          <input className="ges-field" name="phone" inputMode="tel" required />
          {err("phone")}
        </label>
        <label className="grid gap-1 text-sm">
          <span>Email *</span>
          <input className="ges-field" type="email" name="email" required />
          {err("email")}
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
        {err("need")}
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
      <button type="submit" className="ges-btn ges-btn-primary justify-self-start" disabled={sending}>
        {sending ? "Отправка…" : "Отправить заявку"}
      </button>
    </form>
  );
}

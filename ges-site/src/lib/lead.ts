import type { LeadPayload } from "@/lib/types";

/**
 * Валидация формы заявки (чистая функция, покрыта тестами).
 * Возвращает карту ошибок по полям: пусто → нет ошибок.
 */
export type LeadErrors = Partial<Record<"name" | "company" | "phone" | "email" | "need", string>>;

// Простой e-mail-паттерн: что-то@что-то.домен.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Телефон: минимум 10 цифр (плюс, скобки, дефисы допускаются).
const PHONE_DIGITS = /\d/g;

export function validateLead(input: Partial<LeadPayload>): LeadErrors {
  const errors: LeadErrors = {};

  if (!input.name || !input.name.trim()) {
    errors.name = "Укажите имя.";
  }
  if (!input.company || !input.company.trim()) {
    errors.company = "Укажите компанию.";
  }

  const phoneDigits = (input.phone ?? "").match(PHONE_DIGITS)?.length ?? 0;
  if (!input.phone || !input.phone.trim()) {
    errors.phone = "Укажите телефон.";
  } else if (phoneDigits < 10) {
    errors.phone = "Телефон должен содержать не менее 10 цифр.";
  }

  if (!input.email || !input.email.trim()) {
    errors.email = "Укажите email.";
  } else if (!EMAIL_RE.test(input.email.trim())) {
    errors.email = "Некорректный email.";
  }

  if (!input.need || !input.need.trim()) {
    errors.need = "Выберите, что требуется.";
  }

  return errors;
}

export function isLeadValid(input: Partial<LeadPayload>): boolean {
  return Object.keys(validateLead(input)).length === 0;
}

import { describe, it, expect } from "vitest";
import { validateLead, isLeadValid } from "@/lib/lead";

const valid = {
  name: "Иван Петров",
  company: "ООО Ромашка",
  phone: "+7 495 123-45-67",
  email: "ivan@example.com",
  need: "raschet",
  comment: "",
};

describe("Валидация заявки", () => {
  it("корректная заявка проходит", () => {
    expect(validateLead(valid)).toEqual({});
    expect(isLeadValid(valid)).toBe(true);
  });

  it("пустые обязательные поля дают ошибки", () => {
    const e = validateLead({});
    expect(e.name).toBeTruthy();
    expect(e.company).toBeTruthy();
    expect(e.phone).toBeTruthy();
    expect(e.email).toBeTruthy();
    expect(e.need).toBeTruthy();
  });

  it("некорректный email отклоняется", () => {
    expect(validateLead({ ...valid, email: "not-an-email" }).email).toBeTruthy();
  });

  it("короткий телефон отклоняется", () => {
    expect(validateLead({ ...valid, phone: "123" }).phone).toBeTruthy();
  });

  it("телефон из 10+ цифр принимается", () => {
    expect(validateLead({ ...valid, phone: "8 800 555 35 35" }).phone).toBeUndefined();
  });
});

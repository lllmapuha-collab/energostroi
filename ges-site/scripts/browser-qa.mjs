// Реальный браузерный QA через Playwright (клики, ввод, select, localStorage,
// мобильный/десктоп вьюпорты, сбор ошибок консоли). Ничего не мокается.
// Ждём завершения гидратации (networkidle + polling), чтобы проверять именно
// работу клиентского кода, а не голый SSR. Результаты → JSON + BROWSER_QA_REPORT.md.
import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const BASE = (process.env.BASE_URL || "http://localhost:3100").replace(/\/$/, "");
const ART = "/opt/cursor/artifacts";
fs.mkdirSync(ART, { recursive: true });

const results = [];
const consoleErrors = [];
const badResponses = [];
let shot = 0;

const rec = (scope, name, status, detail = "") => {
  results.push({ scope, name, status, detail });
  const tag = status === "PASS" ? "✓" : status === "FAIL" ? "✗" : "•";
  console.log(`${tag} [${scope}] ${name} — ${status}${detail ? " :: " + detail : ""}`);
};

const snap = async (page, label) => {
  const p = path.join(ART, `qa-${String(++shot).padStart(2, "0")}-${label}.png`);
  try { await page.screenshot({ path: p }); } catch {}
  return p;
};

const benign = (t) =>
  /HMR|Fast Refresh|scroll-behavior|React DevTools|hydration-mismatch-help|preload|Lighthouse|favicon|allowedDevOrigins/i.test(t);

function attach(page) {
  page.on("console", (m) => {
    if (m.type() === "error" && !benign(m.text())) consoleErrors.push({ url: page.url(), text: m.text().slice(0, 300) });
  });
  page.on("pageerror", (e) => consoleErrors.push({ url: page.url(), text: "pageerror: " + String(e).slice(0, 300) }));
  page.on("response", (r) => {
    const u = r.url();
    if (u.startsWith(BASE) && r.status() >= 400) badResponses.push({ url: u, status: r.status() });
  });
}

// Навигация с ожиданием тишины сети (гидратация клиентских компонентов).
async function go(pg, url) {
  const r = await pg.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
  await pg.waitForLoadState("networkidle", { timeout: 60000 }).catch(() => {});
  await pg.waitForTimeout(350);
  return r;
}

async function foundCount(pg) {
  const span = pg.locator('span:has-text("Найдено:")').first();
  await span.waitFor({ timeout: 15000 });
  const txt = await span.innerText();
  const m = txt.match(/Найдено:\s*([\d\s]+)/);
  return m ? Number(m[1].replace(/\s/g, "")) : null;
}

// Дождаться, пока число результатов удовлетворит условию (после ввода/фильтра).
async function waitCount(pg, pred, timeout = 8000) {
  const start = Date.now();
  let last = await foundCount(pg);
  while (Date.now() - start < timeout) {
    if (pred(last)) return last;
    await pg.waitForTimeout(200);
    last = await foundCount(pg);
  }
  return last;
}

const hasBad = (s) => /\bNaN\b|\bundefined\b|\bInfinity\b/.test(s);

async function run() {
  const browser = await chromium.launch();

  // ================= DESKTOP 1440x900 =================
  const dctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await dctx.newPage();
  attach(page);

  try {
    const resp = await go(page, BASE + "/");
    await page.getByRole("heading", { name: /Энергетические решения под ключ/ }).first().waitFor({ timeout: 15000 });
    await snap(page, "home-desktop");
    rec("desktop", "HOME", resp.status() < 400 ? "PASS" : "FAIL", `status ${resp.status()}`);
  } catch (e) { rec("desktop", "HOME", "FAIL", String(e).slice(0, 160)); }

  try {
    await go(page, BASE + "/katalog");
    const total = await foundCount(page);
    rec("desktop", "CATALOG", total === 143 ? "PASS" : "FAIL", `Найдено: ${total}`);

    const search = page.getByPlaceholder(/Поиск/);
    const counts = {};
    for (const q of ["Weichai", "WPG", "Yuchai", "500", "1000"]) {
      await search.fill("");
      await search.fill(q);
      counts[q] = await waitCount(page, (c) => c !== total || q === "WPG");
    }
    await snap(page, "catalog-search");
    const changed = ["Weichai", "Yuchai"].every((q) => counts[q] !== null && counts[q] < total && counts[q] > 0);
    rec("desktop", "SEARCH", changed ? "PASS" : "FAIL", JSON.stringify(counts));
    await search.fill("");
    await waitCount(page, (c) => c === total);

    const brandSelect = page.locator("select").filter({ has: page.locator("option", { hasText: "Производитель" }) });
    await brandSelect.selectOption({ label: "Weichai" });
    const brandCount = await waitCount(page, (c) => c !== total);
    await page.getByPlaceholder(/Мощность от/).fill("500");
    await page.getByPlaceholder(/Мощность до/).fill("1000");
    const powerCount = await waitCount(page, (c) => c <= brandCount);
    await snap(page, "catalog-filters");
    const filtersOk = brandCount !== null && brandCount < total && powerCount !== null && powerCount <= brandCount;
    rec("desktop", "FILTERS", filtersOk ? "PASS" : "FAIL", `brand=${brandCount}, brand+power(500-1000)=${powerCount}`);

    await page.getByRole("button", { name: "Сбросить" }).click();
    const afterReset = await waitCount(page, (c) => c === total);
    rec("desktop", "FILTERS_RESET", afterReset === total ? "PASS" : "FAIL", `после сброса: ${afterReset}`);

    const nextBtn = page.getByRole("button", { name: "Вперёд" });
    if (await nextBtn.count()) {
      await nextBtn.first().click();
      await page.waitForTimeout(400);
      const pageInfo = await page.locator("text=/Стр\\. \\d+ \\/ \\d+/").first().innerText();
      rec("desktop", "PAGINATION", /Стр\. 2/.test(pageInfo) ? "PASS" : "FAIL", pageInfo);
      await page.getByRole("button", { name: "Назад" }).first().click().catch(() => {});
    } else rec("desktop", "PAGINATION", "FAIL", "нет кнопки Вперёд");
  } catch (e) { rec("desktop", "CATALOG", "FAIL", String(e).slice(0, 160)); }

  const slugs = ["ges-00001", "ges-00006", "ges-00011"];
  for (const s of slugs) {
    try {
      const resp = await go(page, `${BASE}/katalog/product/${s}`);
      const h1 = await page.locator("h1").first().innerText();
      const hasSpecs = await page.locator("text=Технические характеристики").isVisible();
      const hasKP = await page.getByRole("link", { name: /Получить КП/ }).count();
      const hasCompare = await page.getByRole("button", { name: /сравнени/i }).count();
      const hasFav = await page.getByRole("button", { name: /избранн/i }).count();
      const ok = resp.status() === 200 && h1 && hasSpecs && hasKP && hasCompare && hasFav;
      if (s === "ges-00001") await snap(page, "product-detail");
      rec("desktop", `PRODUCT_DETAIL ${s}`, ok ? "PASS" : "FAIL", `status ${resp.status()}, h1="${h1}"`);
    } catch (e) { rec("desktop", `PRODUCT_DETAIL ${s}`, "FAIL", String(e).slice(0, 160)); }
  }

  try {
    await go(page, `${BASE}/katalog/product/ges-00001`);
    await page.getByRole("button", { name: /Добавить к сравнению/ }).first().click();
    await go(page, `${BASE}/katalog/product/ges-00006`);
    await page.getByRole("button", { name: /Добавить к сравнению/ }).first().click();
    await go(page, `${BASE}/sravnenie`);
    const cols = await page.locator("table thead th").count();
    await snap(page, "compare");
    await page.getByRole("button", { name: "Убрать" }).first().click();
    await page.waitForTimeout(300);
    const colsAfter = await page.locator("table thead th").count();
    const clearBtn = page.getByRole("button", { name: "Очистить" });
    if (await clearBtn.isEnabled()) await clearBtn.click();
    await page.waitForTimeout(300);
    const emptyShown = await page.locator("text=Список сравнения пуст").isVisible();
    rec("desktop", "COMPARE", cols >= 3 && colsAfter < cols && emptyShown ? "PASS" : "FAIL", `cols=${cols}→${colsAfter}, empty=${emptyShown}`);
  } catch (e) { rec("desktop", "COMPARE", "FAIL", String(e).slice(0, 160)); }

  try {
    await go(page, `${BASE}/katalog/product/ges-00011`);
    await page.getByRole("button", { name: /В избранное/ }).first().click();
    await go(page, `${BASE}/izbrannoe`);
    const present = (await page.locator(".ges-grid-products article").count()) >= 1;
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForTimeout(500);
    const persisted = (await page.locator(".ges-grid-products article").count()) >= 1;
    await snap(page, "favorites");
    await page.locator(".ges-grid-products article").first().getByRole("button", { name: /В избранном/ }).click();
    await page.waitForTimeout(300);
    const emptyShown = await page.locator("text=Пока пусто").isVisible();
    rec("desktop", "FAVORITES", present && persisted && emptyShown ? "PASS" : "FAIL", `present=${present}, persist=${persisted}, emptyAfterRemove=${emptyShown}`);
  } catch (e) { rec("desktop", "FAVORITES", "FAIL", String(e).slice(0, 160)); }

  try {
    await go(page, `${BASE}/podbor`);
    const nextBtn = () => page.getByRole("button", { name: /Далее|Показать результат/ });
    const disabledBefore = await nextBtn().isDisabled();
    const opt = page.getByRole("button", { name: "основное", exact: true });
    await opt.click();
    // Дождаться подсветки выбранного (класс is-active).
    await page.waitForFunction(
      () => {
        const b = [...document.querySelectorAll("button")].find((x) => x.textContent.trim() === "основное");
        return b && b.className.includes("is-active");
      },
      { timeout: 5000 },
    ).catch(() => {});
    const cls = await opt.getAttribute("class");
    const selectedVisual = /is-active/.test(cls || "");
    const enabledAfter = await nextBtn().isEnabled();
    await snap(page, "podbor-step1");
    rec("desktop", "PODBOR_STEP1_SELECT", selectedVisual && disabledBefore && enabledAfter ? "PASS" : "FAIL", `is-active=${selectedVisual}, disabledBefore=${disabledBefore}, enabledAfter=${enabledAfter}`);

    const advance = async () => { await nextBtn().first().click(); await page.waitForTimeout(250); };
    await advance();
    await page.locator('input[type="number"]').fill("150");
    await advance();
    await page.getByRole("button", { name: "газ", exact: true }).click();
    await advance();
    await page.getByRole("button", { name: "нет", exact: true }).first().click();
    await advance();
    await page.locator('input[type="text"]').fill("Москва");
    await advance();
    await page.getByRole("button", { name: "постоянный", exact: true }).click();
    await advance();
    await page.getByRole("button", { name: "0.4 кВ", exact: true }).click();
    await advance();
    await page.getByRole("button", { name: "нет", exact: true }).first().click();
    await advance();
    await page.waitForTimeout(500);
    const hasResultCards = (await page.locator(".ges-grid-products article").count()) > 0;
    const hasEngineerMsg = await page.locator("text=/инженер|Точных совпадений|расчёт/i").count();
    await snap(page, "podbor-result");
    rec("desktop", "PODBOR", hasResultCards || hasEngineerMsg ? "PASS" : "FAIL", `resultCards=${hasResultCards}, engineerMsg=${hasEngineerMsg > 0}`);
  } catch (e) { rec("desktop", "PODBOR", "FAIL", String(e).slice(0, 160)); }

  try {
    await go(page, `${BASE}/kalkulyator`);
    const kwh = page.locator('label:has-text("Месячное потребление") input');
    const el = page.locator('label:has-text("Стоимость электроэнергии") input');
    const gas = page.locator('label:has-text("Стоимость газа") input');
    const region = page.locator('label:has-text("Регион") input');
    const mode = page.locator('label:has-text("Режим нагрузки") select');
    const submit = page.getByRole("button", { name: "Рассчитать ориентир" });

    await submit.click();
    const emptyValid = await kwh.evaluate((e) => e.validity.valid);

    await kwh.fill("100000");
    await el.fill("8");
    await gas.fill("10");
    await region.fill("Москва");
    await mode.selectOption({ index: 0 });
    await submit.click();
    await page.locator("text=Результат").first().waitFor({ timeout: 8000 }).catch(() => {});
    const resultText = await page.locator("text=Результат").first().isVisible();
    const bodyText = await page.locator("body").innerText();
    await snap(page, "calculator-result");
    rec("desktop", "CALCULATOR", emptyValid === false && resultText && !hasBad(bodyText) ? "PASS" : "FAIL", `emptyBlocked=${emptyValid === false}, result=${resultText}, noNaN=${!hasBad(bodyText)}`);

    const edge = {};
    for (const [name, val] of [["zero", "0"], ["negative", "-500"], ["letters", "abcxyz"], ["huge", "999999999999"]]) {
      await kwh.fill(val);
      await submit.click();
      await page.waitForTimeout(300);
      const bt = await page.locator("body").innerText();
      edge[name] = !hasBad(bt) && (await page.locator("body").isVisible());
    }
    rec("desktop", "CALCULATOR_EDGE", Object.values(edge).every(Boolean) ? "PASS" : "FAIL", JSON.stringify(edge));
  } catch (e) { rec("desktop", "CALCULATOR", "FAIL", String(e).slice(0, 160)); }

  try {
    await go(page, `${BASE}/zayavka`);
    await page.getByRole("button", { name: "Отправить заявку" }).click();
    await page.waitForTimeout(300);
    const errCount = await page.locator('[role="alert"]').count();
    await page.locator('input[name="name"]').fill("Иван Петров");
    await page.locator('input[name="company"]').fill("ООО Ромашка");
    await page.locator('input[name="phone"]').fill("+7 495 123-45-67");
    await page.locator('input[name="email"]').fill("ivan@example.com");
    await page.getByRole("button", { name: "Отправить заявку" }).click();
    await page.locator("text=Заявка принята").waitFor({ timeout: 5000 }).catch(() => {});
    const success = await page.locator("text=Заявка принята").isVisible();
    await snap(page, "form");
    rec("desktop", "FORMS", errCount > 0 && success ? "PASS" : "FAIL", `errorsOnEmpty=${errCount}, success=${success}`);
  } catch (e) { rec("desktop", "FORMS", "FAIL", String(e).slice(0, 160)); }

  try {
    await go(page, BASE + "/");
    const hrefs = await page.locator("header a, footer a").evaluateAll((as) =>
      [...new Set(as.map((a) => a.getAttribute("href")).filter((h) => h && h.startsWith("/")))],
    );
    let bad = 0;
    const checked = [];
    for (const h of hrefs) {
      const r = await page.goto(BASE + h, { waitUntil: "domcontentloaded", timeout: 30000 });
      checked.push(`${h}:${r.status()}`);
      if (r.status() >= 400) bad++;
    }
    rec("desktop", "HEADER", bad === 0 ? "PASS" : "FAIL", `links=${hrefs.length}, bad=${bad}`);
    rec("desktop", "FOOTER", bad === 0 ? "PASS" : "FAIL", checked.join(", "));
  } catch (e) { rec("desktop", "HEADER", "FAIL", String(e).slice(0, 160)); }

  await dctx.close();

  // ================= MOBILE 390x844 =================
  const mctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const mp = await mctx.newPage();
  attach(mp);
  const overflows = [];
  const overflow = async (label) => {
    const o = await mp.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2);
    overflows.push({ label, overflow: o });
  };

  try {
    await go(mp, BASE + "/");
    await overflow("home");
    const burger = mp.getByRole("button", { name: "Меню" });
    await burger.click();
    await mp.waitForTimeout(300);
    // В мобильном меню ссылка "Оборудование" — берём видимую (последнюю в DOM).
    const oborud = mp.getByRole("link", { name: "Оборудование" }).last();
    const linksVisible = await oborud.isVisible();
    await snap(mp, "mobile-menu");
    await oborud.click();
    await mp.waitForURL(/\/katalog/, { timeout: 15000 });
    rec("mobile", "MENU", linksVisible && mp.url().includes("/katalog") ? "PASS" : "FAIL", `menuVisible=${linksVisible}, navigated=${mp.url().includes("/katalog")}`);
  } catch (e) { rec("mobile", "MENU", "FAIL", String(e).slice(0, 160)); }

  try {
    await go(mp, BASE + "/katalog");
    await overflow("katalog");
    const total = await foundCount(mp);
    const search = mp.getByPlaceholder(/Поиск/);
    await search.fill("Weichai");
    const c = await waitCount(mp, (x) => x !== total);
    await snap(mp, "mobile-catalog");
    rec("mobile", "CATALOG", total === 143 ? "PASS" : "FAIL", `Найдено=${total}`);
    rec("mobile", "SEARCH", c !== null && c < total ? "PASS" : "FAIL", `Weichai=${c}`);
    await search.fill("");
    await waitCount(mp, (x) => x === total);
    const brandSelect = mp.locator("select").filter({ has: mp.locator("option", { hasText: "Производитель" }) });
    await brandSelect.selectOption({ label: "Yuchai" });
    const fc = await waitCount(mp, (x) => x !== total);
    rec("mobile", "FILTERS", fc !== null && fc < total ? "PASS" : "FAIL", `Yuchai=${fc}`);
  } catch (e) { rec("mobile", "CATALOG", "FAIL", String(e).slice(0, 160)); }

  try {
    await go(mp, `${BASE}/katalog/product/ges-00001`);
    await overflow("product");
    const h1 = await mp.locator("h1").first().innerText();
    await mp.getByRole("button", { name: /Добавить к сравнению/ }).first().click();
    await mp.getByRole("button", { name: /В избранное/ }).first().click();
    await mp.waitForTimeout(300);
    const cmp = await mp.locator('.ges-header a:has-text("Сравнение")').innerText();
    rec("mobile", "PRODUCT_DETAIL", h1 ? "PASS" : "FAIL", `h1="${h1}"`);
    rec("mobile", "COMPARE", /\(\d+\)/.test(cmp) ? "PASS" : "FAIL", `header="${cmp.trim()}"`);
    await go(mp, `${BASE}/izbrannoe`);
    const fav = (await mp.locator(".ges-grid-products article").count()) >= 1;
    await mp.reload({ waitUntil: "domcontentloaded" });
    await mp.waitForTimeout(500);
    const favPersist = (await mp.locator(".ges-grid-products article").count()) >= 1;
    rec("mobile", "FAVORITES", fav && favPersist ? "PASS" : "FAIL", `present=${fav}, persist=${favPersist}`);
  } catch (e) { rec("mobile", "PRODUCT_DETAIL", "FAIL", String(e).slice(0, 160)); }

  try {
    await go(mp, `${BASE}/podbor`);
    await overflow("podbor");
    const opt = mp.getByRole("button", { name: "основное", exact: true });
    await opt.tap();
    await mp.waitForFunction(
      () => {
        const b = [...document.querySelectorAll("button")].find((x) => x.textContent.trim() === "основное");
        return b && b.className.includes("is-active");
      },
      { timeout: 5000 },
    ).catch(() => {});
    const cls = await opt.getAttribute("class");
    await snap(mp, "mobile-podbor");
    rec("mobile", "PODBOR", /is-active/.test(cls || "") ? "PASS" : "FAIL", `is-active=${/is-active/.test(cls || "")}`);
  } catch (e) { rec("mobile", "PODBOR", "FAIL", String(e).slice(0, 160)); }

  try {
    await go(mp, `${BASE}/kalkulyator`);
    await overflow("kalkulyator");
    await mp.locator('label:has-text("Месячное потребление") input').fill("100000");
    await mp.locator('label:has-text("Стоимость электроэнергии") input').fill("8");
    await mp.getByRole("button", { name: "Рассчитать ориентир" }).click();
    await mp.locator("text=Результат").first().waitFor({ timeout: 8000 }).catch(() => {});
    const bt = await mp.locator("body").innerText();
    const ok = (await mp.locator("text=Результат").first().isVisible()) && !hasBad(bt);
    rec("mobile", "CALCULATOR", ok ? "PASS" : "FAIL", `result=${ok}`);
  } catch (e) { rec("mobile", "CALCULATOR", "FAIL", String(e).slice(0, 160)); }

  try {
    await go(mp, `${BASE}/zayavka`);
    await overflow("zayavka");
    await mp.locator('input[name="name"]').fill("Иван Петров");
    await mp.locator('input[name="company"]').fill("ООО Ромашка");
    await mp.locator('input[name="phone"]').fill("+7 495 123-45-67");
    await mp.locator('input[name="email"]').fill("ivan@example.com");
    await mp.getByRole("button", { name: "Отправить заявку" }).click();
    await mp.locator("text=Заявка принята").waitFor({ timeout: 5000 }).catch(() => {});
    const success = await mp.locator("text=Заявка принята").isVisible();
    rec("mobile", "FORMS", success ? "PASS" : "FAIL", `success=${success}`);
  } catch (e) { rec("mobile", "FORMS", "FAIL", String(e).slice(0, 160)); }

  const anyOverflow = overflows.some((o) => o.overflow);
  rec("mobile", "OVERFLOW", anyOverflow ? "FAIL" : "PASS", JSON.stringify(overflows));

  await mctx.close();
  await browser.close();

  const only404 = badResponses.filter((b) => b.status === 404);
  const only500 = badResponses.filter((b) => b.status >= 500);
  rec("desktop", "CONSOLE", consoleErrors.length === 0 ? "PASS" : "FAIL", `errors=${consoleErrors.length}`);

  const total = results.length;
  const passed = results.filter((r) => r.status === "PASS").length;
  const failed = results.filter((r) => r.status === "FAIL").length;
  const notTested = results.filter((r) => r.status === "NOT TESTED").length;
  const line = (scope, name) => (results.find((x) => x.scope === scope && x.name === name) || {}).status || "NOT TESTED";

  const md = `# BROWSER QA REPORT — GlobalEnergoStroi

Дата: ${new Date().toISOString()}
URL: ${BASE} (та же сборка, что отдаётся по публичной ссылке)
Инструмент: Playwright (Chromium), реальные click/input/select/localStorage/submit, с ожиданием гидратации.

## DESKTOP 1440x900
HOME = ${line("desktop", "HOME")}
CATALOG = ${line("desktop", "CATALOG")}
SEARCH = ${line("desktop", "SEARCH")}
FILTERS = ${line("desktop", "FILTERS")}
PRODUCT DETAIL = ${slugs.every((s) => line("desktop", `PRODUCT_DETAIL ${s}`) === "PASS") ? "PASS" : "FAIL"}
COMPARE = ${line("desktop", "COMPARE")}
FAVORITES = ${line("desktop", "FAVORITES")}
PODBOR = ${line("desktop", "PODBOR")}
CALCULATOR = ${line("desktop", "CALCULATOR")}
FORMS = ${line("desktop", "FORMS")}
HEADER = ${line("desktop", "HEADER")}
FOOTER = ${line("desktop", "FOOTER")}
CONSOLE = ${line("desktop", "CONSOLE")}

## MOBILE 390x844
MENU = ${line("mobile", "MENU")}
CATALOG = ${line("mobile", "CATALOG")}
SEARCH = ${line("mobile", "SEARCH")}
FILTERS = ${line("mobile", "FILTERS")}
PRODUCT DETAIL = ${line("mobile", "PRODUCT_DETAIL")}
COMPARE = ${line("mobile", "COMPARE")}
FAVORITES = ${line("mobile", "FAVORITES")}
PODBOR = ${line("mobile", "PODBOR")}
CALCULATOR = ${line("mobile", "CALCULATOR")}
FORMS = ${line("mobile", "FORMS")}
OVERFLOW = ${line("mobile", "OVERFLOW")}

## FINAL
TOTAL TESTS = ${total}
PASSED = ${passed}
FAILED = ${failed}
NOT TESTED = ${notTested}
CONSOLE ERRORS = ${consoleErrors.length}
404 = ${only404.length}
500 = ${only500.length}

## Детализация
${results.map((r) => `- [${r.scope}] ${r.name}: ${r.status}${r.detail ? " — " + r.detail : ""}`).join("\n")}

## Ошибки консоли
${consoleErrors.length ? consoleErrors.map((c) => `- ${c.url}: ${c.text}`).join("\n") : "Не обнаружено."}
${badResponses.length ? "\n## Ответы >=400\n" + badResponses.map((b) => `- ${b.status} ${b.url}`).join("\n") : ""}
`;

  fs.writeFileSync(path.join(process.cwd(), "docs/BROWSER_QA_REPORT.md"), md);
  fs.writeFileSync(path.join(ART, "browser-qa-results.json"), JSON.stringify({ base: BASE, results, consoleErrors, badResponses, totals: { total, passed, failed, notTested } }, null, 2));
  console.log(`\n=== TOTAL ${total} | PASS ${passed} | FAIL ${failed} | CONSOLE ${consoleErrors.length} | 404 ${only404.length} | 500 ${only500.length} ===`);
}

run().catch((e) => { console.error(e); process.exit(2); });

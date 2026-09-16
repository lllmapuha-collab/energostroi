import type { Product, SpecField } from "@/lib/types";

function key(parts: (string | number | null | undefined)[]) {
  return parts.map((p) => String(p ?? "na").toLowerCase().replace(/\s+/g, "-")).join("|");
}

function slugify(brand: string, model: string, suffix?: string) {
  const base = `${brand}-${model}${suffix ? `-${suffix}` : ""}`
    .toLowerCase()
    .replace(/[^a-z0-9а-яё]+/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return base;
}

function spec(group: string, key: string, label: string, value: SpecField["value"], unit?: string | null): SpecField {
  return { group, key, label, value, unit: unit ?? null };
}

function mwmProduct(opts: {
  model: string;
  variant: string;
  prime_kw: number;
  thermal_kw: number;
  eff_e: number;
  eff_t: number;
  eff_tot: number;
  cylinders: number;
  displacement_l: number;
  weight_kg: number | null;
  dimensions_mm: string | null;
}): Product {
  const engine = `TCG 2020 ${opts.model}`;
  const composite = key(["MWM", opts.model, engine, 50, "genset"]);
  const slug = slugify("mwm", `tcg-2020-${opts.model.toLowerCase().replace(/\s+/g, "-")}`);
  return {
    product_id: `mwm-${slug}`,
    composite_key: composite,
    slug,
    brand: "MWM",
    model: `TCG 2020 ${opts.model}`,
    name: `Газопоршневая установка MWM TCG 2020 ${opts.model}`,
    category: "elektrostantsii",
    subcategory: "gpu",
    variant: opts.variant,
    fuel: "газ",
    engine,
    voltage: null,
    frequency: 50,
    execution: "open / genset",
    prime_kw: opts.prime_kw,
    prime_kva: null,
    standby_kw: null,
    standby_kva: null,
    cylinders: opts.cylinders,
    displacement_l: opts.displacement_l,
    bore_stroke_mm: "170/195",
    rpm: 1500,
    thermal_kw: opts.thermal_kw,
    efficiency_electrical: opts.eff_e,
    efficiency_thermal: opts.eff_t,
    efficiency_total: opts.eff_tot,
    dimensions_mm: opts.dimensions_mm,
    weight_kg: opts.weight_kg,
    resource: null,
    warranty: null,
    price: null,
    images: ["/images/products/gpu-placeholder.svg"],
    documents: [
      {
        id: "mwm-tcg2020",
        title: "MWM TCG 2020 datasheet",
        type: "datasheet",
        url: "https://www.mwm.net/en/gas-engines-gensets/gas-engine-tcg-2020/",
      },
    ],
    specs: [
      spec("Электрические", "prime_kw", "Электрическая мощность", opts.prime_kw, "кВт"),
      spec("Электрические", "frequency", "Частота", 50, "Гц"),
      spec("Электрические", "voltage", "Напряжение", null, "В"),
      spec("КПД", "eff_e", "Электрический КПД", opts.eff_e, "%"),
      spec("КПД", "eff_t", "Тепловой КПД", opts.eff_t, "%"),
      spec("КПД", "eff_tot", "Суммарный КПД", opts.eff_tot, "%"),
      spec("Двигатель", "engine", "Двигатель", engine, null),
      spec("Двигатель", "cylinders", "Цилиндры", opts.cylinders, null),
      spec("Двигатель", "displacement", "Рабочий объём", opts.displacement_l, "л"),
      spec("Двигатель", "bore_stroke", "Диаметр/ход", "170/195", "мм"),
      spec("Двигатель", "rpm", "Обороты", 1500, "об/мин"),
      spec("Когенерация", "thermal_kw", "Тепловая мощность", opts.thermal_kw, "кВт"),
      spec("Исполнение", "execution", "Исполнение", "open / genset", null),
      spec("Размеры/масса", "dimensions", "Габариты (Д×Ш×В)", opts.dimensions_mm, "мм"),
      spec("Размеры/масса", "weight", "Сухая масса", opts.weight_kg, "кг"),
    ],
    source: "Official MWM TCG 2020 natural gas 50 Hz (NOₓ < 500 mg/Nm³ @ 5% O₂)",
    verification_status: "source_backed",
    seo_title: `MWM TCG 2020 ${opts.model} — ГПУ ${opts.prime_kw} кВт | GlobalEnergoStroi`,
    seo_description: `Газопоршневая установка MWM TCG 2020 ${opts.model}: ${opts.prime_kw} кВт эл., тепло ${opts.thermal_kw} кВт. Паспортные данные по официальному источнику.`,
    published: true,
  };
}

function cumminsProduct(opts: {
  model: string;
  standby_kw: number;
  standby_kva: number;
  prime_kw: number;
  prime_kva: number;
  engine: string;
  dimensions_mm: string | null;
  weight_kg: number | null;
}): Product {
  const composite = key(["Cummins", opts.model, opts.engine, 60, "open"]);
  const slug = slugify("cummins", opts.model);
  return {
    product_id: `cummins-${slug}`,
    composite_key: composite,
    slug,
    brand: "Cummins",
    model: opts.model,
    name: `Дизель-генераторная установка Cummins ${opts.model}`,
    category: "elektrostantsii",
    subcategory: "dgu",
    variant: null,
    fuel: "дизель",
    engine: opts.engine,
    voltage: null,
    frequency: 60,
    execution: "open set",
    prime_kw: opts.prime_kw,
    prime_kva: opts.prime_kva,
    standby_kw: opts.standby_kw,
    standby_kva: opts.standby_kva,
    cylinders: null,
    displacement_l: null,
    bore_stroke_mm: null,
    rpm: null,
    thermal_kw: null,
    efficiency_electrical: null,
    efficiency_thermal: null,
    efficiency_total: null,
    dimensions_mm: opts.dimensions_mm,
    weight_kg: opts.weight_kg,
    resource: null,
    warranty: null,
    price: null,
    images: ["/images/products/dgu-placeholder.svg"],
    documents: [
      {
        id: `cummins-${slug}-ds`,
        title: `Cummins ${opts.model} datasheet`,
        type: "datasheet",
        url: null,
        note: "Рейтинги и габариты — по официальным Cummins rating/datasheet материалам (Master Catalog v4).",
      },
    ],
    specs: [
      spec("Электрические", "standby_kw", "Standby мощность", opts.standby_kw, "кВт"),
      spec("Электрические", "standby_kva", "Standby", opts.standby_kva, "кВА"),
      spec("Электрические", "prime_kw", "Prime мощность", opts.prime_kw, "кВт"),
      spec("Электрические", "prime_kva", "Prime", opts.prime_kva, "кВА"),
      spec("Электрические", "frequency", "Частота", 60, "Гц"),
      spec("Электрические", "voltage", "Напряжение", null, "В"),
      spec("Двигатель", "engine", "Двигатель", opts.engine, null),
      spec("Топливо", "fuel", "Топливо", "дизель", null),
      spec("Исполнение", "execution", "Исполнение", "open set", null),
      spec("Размеры/масса", "dimensions", "Габариты (Д×Ш×В)", opts.dimensions_mm, "мм"),
      spec("Размеры/масса", "weight", "Сухая масса", opts.weight_kg, "кг"),
    ],
    source: "Official Cummins generator datasheets / rating cards (Master Catalog v4)",
    verification_status: "source_backed",
    seo_title: `Cummins ${opts.model} — ДГУ ${opts.standby_kw} кВт | GlobalEnergoStroi`,
    seo_description: `ДГУ Cummins ${opts.model}: standby ${opts.standby_kw} кВт / ${opts.standby_kva} кВА. Данные по официальным источникам.`,
    published: true,
  };
}

function baudouinProduct(opts: {
  model: string;
  standby_kva: number;
  standby_kw: number;
}): Product {
  const engine = opts.model;
  const composite = key(["Baudouin", opts.model, engine, 50, "genset"]);
  const slug = slugify("baudouin", opts.model);
  return {
    product_id: `baudouin-${slug}`,
    composite_key: composite,
    slug,
    brand: "Baudouin",
    model: opts.model,
    name: `Дизель-генераторная установка Baudouin ${opts.model}`,
    category: "elektrostantsii",
    subcategory: "dgu",
    variant: null,
    fuel: "дизель",
    engine,
    voltage: null,
    frequency: 50,
    execution: null,
    prime_kw: null,
    prime_kva: null,
    standby_kw: opts.standby_kw,
    standby_kva: opts.standby_kva,
    cylinders: null,
    displacement_l: 87.5,
    bore_stroke_mm: "180×215",
    rpm: null,
    thermal_kw: null,
    efficiency_electrical: null,
    efficiency_thermal: null,
    efficiency_total: null,
    dimensions_mm: null,
    weight_kg: null,
    resource: null,
    warranty: null,
    price: null,
    images: ["/images/products/dgu-placeholder.svg"],
    documents: [
      {
        id: `baudouin-${slug}`,
        title: `Baudouin ${opts.model}`,
        type: "datasheet",
        url: null,
        note: "Рейтинги и displacement/bore-stroke — официальный Baudouin (Master Catalog v4).",
      },
    ],
    specs: [
      spec("Электрические", "standby_kva", "Standby", opts.standby_kva, "кВА"),
      spec("Электрические", "standby_kw", "Standby мощность", opts.standby_kw, "кВт"),
      spec("Электрические", "frequency", "Частота", 50, "Гц"),
      spec("Двигатель", "engine", "Двигатель", engine, null),
      spec("Двигатель", "displacement", "Рабочий объём", 87.5, "л"),
      spec("Двигатель", "bore_stroke", "Диаметр/ход", "180×215", "мм"),
      spec("Топливо", "fuel", "Топливо", "дизель", null),
    ],
    source: "Official Baudouin (Master Catalog v4 Handoff)",
    verification_status: "source_backed",
    seo_title: `Baudouin ${opts.model} — ДГУ ${opts.standby_kw} кВт | GlobalEnergoStroi`,
    seo_description: `ДГУ Baudouin ${opts.model}: ${opts.standby_kva}/${opts.standby_kw} кВА/кВт. Подтверждённые паспортные поля.`,
    published: true,
  };
}

function weichaiShell(model: string): Product {
  const composite = key(["Weichai", model, model, null, null]);
  const slug = slugify("weichai", model.replace(/\*/g, "-"));
  return {
    product_id: `weichai-${slug}`,
    composite_key: composite,
    slug,
    brand: "Weichai",
    model,
    name: `Дизель-генераторная установка Weichai ${model}`,
    category: "elektrostantsii",
    subcategory: "dgu",
    variant: null,
    fuel: "дизель",
    engine: null,
    voltage: null,
    frequency: null,
    execution: null,
    prime_kw: null,
    prime_kva: null,
    standby_kw: null,
    standby_kva: null,
    cylinders: null,
    displacement_l: null,
    bore_stroke_mm: null,
    rpm: null,
    thermal_kw: null,
    efficiency_electrical: null,
    efficiency_thermal: null,
    efficiency_total: null,
    dimensions_mm: null,
    weight_kg: null,
    resource: null,
    warranty: null,
    price: null,
    images: ["/images/products/dgu-placeholder.svg"],
    documents: [],
    specs: [
      spec("Электрические", "power", "Мощность", null, "кВт"),
      spec("Двигатель", "engine", "Двигатель", null, null),
      spec("Топливо", "fuel", "Топливо", "дизель", null),
    ],
    source: "Listed in Master Catalog v4; passport extraction pending official Weichai datasheet mapping",
    verification_status: "needs_verification",
    seo_title: `Weichai ${model} — ДГУ | GlobalEnergoStroi`,
    seo_description: `Модель Weichai ${model} в каталоге. Паспортные характеристики — после сверки с официальным datasheet.`,
    published: true,
  };
}

/** Seed from Master Catalog v4 Handoff + official source fields only. */
export const products: Product[] = [
  // MWM TCG 2020 — natural gas 50 Hz from official MWM tables
  mwmProduct({
    model: "V12",
    variant: "R / high total efficiency",
    prime_kw: 1200,
    thermal_kw: 1189,
    eff_e: 43.7,
    eff_t: 43.3,
    eff_tot: 87.0,
    cylinders: 12,
    displacement_l: 53.1,
    weight_kg: 13000,
    dimensions_mm: "5970×1790×2210",
  }),
  mwmProduct({
    model: "V12 K",
    variant: "K / robustness low CAPEX",
    prime_kw: 1125,
    thermal_kw: 1267,
    eff_e: 40.7,
    eff_t: 45.8,
    eff_tot: 86.6,
    cylinders: 12,
    displacement_l: 53.1,
    weight_kg: 13000,
    dimensions_mm: "5970×1790×2210",
  }),
  mwmProduct({
    model: "V12 R",
    variant: "R / high total efficiency",
    prime_kw: 1200,
    thermal_kw: 1189,
    eff_e: 43.7,
    eff_t: 43.3,
    eff_tot: 87.0,
    cylinders: 12,
    displacement_l: 53.1,
    weight_kg: 13000,
    dimensions_mm: "5970×1790×2210",
  }),
  mwmProduct({
    model: "V16 K",
    variant: "K / robustness low CAPEX",
    prime_kw: 1500,
    thermal_kw: 1688,
    eff_e: 40.8,
    eff_t: 45.9,
    eff_tot: 86.7,
    cylinders: 16,
    displacement_l: 70.8,
    weight_kg: 14900,
    dimensions_mm: "6640×1790×2210",
  }),
  mwmProduct({
    model: "V16 R",
    variant: "R / high total efficiency",
    prime_kw: 1560,
    thermal_kw: 1576,
    eff_e: 43.3,
    eff_t: 43.8,
    eff_tot: 87.1,
    cylinders: 16,
    displacement_l: 70.8,
    weight_kg: 14900,
    dimensions_mm: "6640×1790×2210",
  }),

  // Cummins — datasheet ratings
  cumminsProduct({
    model: "C1250 D6",
    standby_kw: 1270,
    standby_kva: 1588,
    prime_kw: 1120,
    prime_kva: 1400,
    engine: "Cummins (series per datasheet)",
    dimensions_mm: "5105×2000×2238",
    weight_kg: 9190,
  }),
  cumminsProduct({
    model: "C1500 D6",
    standby_kw: 1545,
    standby_kva: 1931,
    prime_kw: 1286,
    prime_kva: 1608,
    engine: "Cummins (series per datasheet)",
    dimensions_mm: "5811×2033×2330",
    weight_kg: 10348,
  }),
  cumminsProduct({
    model: "C2000 D6",
    standby_kw: 2000,
    standby_kva: 2500,
    prime_kw: 1825,
    prime_kva: 2281,
    engine: "QSK60-G6",
    dimensions_mm: null,
    weight_kg: null,
  }),

  // Baudouin — handoff confirmed ratings
  baudouinProduct({ model: "12M55G8D2", standby_kva: 2750, standby_kw: 2200 }),
  baudouinProduct({ model: "12M55G10D2", standby_kva: 3000, standby_kw: 2400 }),

  // Weichai — models confirmed in catalog, passport pending
  weichaiShell("WPG700*7"),
  weichaiShell("WPG825*7"),
  weichaiShell("WPG900*7"),
  weichaiShell("WPG1000*7"),
  weichaiShell("WPG1100*7"),
];

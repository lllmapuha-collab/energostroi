import type { CategoryNode } from "@/lib/types";

export const categories: CategoryNode[] = [
  {
    slug: "elektrostantsii",
    name: "Электростанции",
    description: "ДГУ, ГПУ, ПЭС и энергокомплексы под ключ.",
    children: [
      { slug: "dgu", name: "ДГУ", description: "Дизель-генераторные установки." },
      { slug: "gpu", name: "ГПУ", description: "Газопоршневые установки и когенерация." },
      { slug: "pes", name: "ПЭС", description: "Передвижные электростанции." },
      { slug: "energokompleksy", name: "Энергокомплексы", description: "Комплексные энергорешения." },
    ],
  },
  {
    slug: "teploenergetika",
    name: "Теплоэнергетика",
    description: "Утилизация тепла и тепловые системы.",
    children: [
      { slug: "teploutilizatsiya", name: "Теплоутилизация", description: "Системы утилизации тепла." },
      { slug: "teploobmenniki", name: "Теплообменники", description: "Теплообменное оборудование." },
      { slug: "kotly-utilizatory", name: "Котлы-утилизаторы", description: "Котлы-утилизаторы." },
      { slug: "sistemy-okhlazhdeniya", name: "Системы охлаждения", description: "Охлаждение энергоустановок." },
      { slug: "teplovye-sistemy", name: "Тепловые системы", description: "Комплексные тепловые решения." },
    ],
  },
  {
    slug: "elektrotekhnicheskoe",
    name: "Электротехническое оборудование",
    description: "АВР, щиты, КРУ, трансформаторы, КТП и кабель.",
    children: [
      { slug: "avr", name: "АВР", description: "Автоматический ввод резерва." },
      { slug: "shchity", name: "Щиты", description: "Щитовое оборудование." },
      { slug: "kru", name: "КРУ", description: "Комплектные распределительные устройства." },
      { slug: "transformatory", name: "Трансформаторы", description: "Силовые трансформаторы." },
      { slug: "ktp", name: "КТП", description: "Комплектные трансформаторные подстанции." },
      { slug: "kabelnye-sistemy", name: "Кабельные системы", description: "Кабель и кабельные системы." },
    ],
  },
  {
    slug: "mobilnye",
    name: "Мобильные решения",
    description: "ПЭС, шасси, контейнеры и спецкомплексы.",
    children: [
      { slug: "pes-mobilnye", name: "ПЭС", description: "Передвижные электростанции." },
      { slug: "na-shassi", name: "Электростанции на шасси", description: "Решения на шасси." },
      { slug: "konteynernye", name: "Контейнерные решения", description: "Контейнерные энергоустановки." },
      { slug: "spetsialnye", name: "Специальные комплексы", description: "Специализированные мобильные комплексы." },
    ],
  },
  {
    slug: "komplektuyushchie",
    name: "Комплектующие и сервис",
    description: "Двигатели, альтернаторы, контроллеры, ЗИП и расходники.",
    children: [
      { slug: "dvigateli", name: "Двигатели", description: "Силовые агрегаты." },
      { slug: "alternatory", name: "Альтернаторы", description: "Генераторы тока." },
      { slug: "kontrollery", name: "Контроллеры", description: "Системы управления." },
      { slug: "zip", name: "ЗИП", description: "Запасные части." },
      { slug: "akkumulyatory", name: "Аккумуляторы", description: "АКБ и стартовые системы." },
      { slug: "toplivnye", name: "Топливные системы", description: "Топливная обвязка." },
      { slug: "vykhlopnye", name: "Выхлопные системы", description: "Выхлоп и шумоглушение." },
      { slug: "konteynery", name: "Контейнеры", description: "Контейнеры и укрытия." },
    ],
  },
];

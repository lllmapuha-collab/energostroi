import type { Project, ServiceStep, Solution } from "@/lib/types";

export const solutions: Solution[] = [
  {
    slug: "osnovnoe-elektrosnabzhenie",
    title: "Основное электроснабжение",
    summary: "Автономная генерация для объектов без надёжной сети или с дефицитом мощности.",
    use_cases: ["Промышленные площадки", "Удалённые объекты", "Новые производства"],
  },
  {
    slug: "rezervirovanie",
    title: "Резервирование",
    summary: "Резервные ДГУ и АВР для критичных нагрузок и непрерывности процессов.",
    use_cases: ["ЦОД и IT", "Медицина", "Инфраструктура"],
  },
  {
    slug: "kogeneratsiya",
    title: "Когенерация",
    summary: "ГПУ с утилизацией тепла — электричество и тепло в одном контуре.",
    use_cases: ["Теплицы", "Производства с тепловой нагрузкой", "Коммунальная энергетика"],
  },
  {
    slug: "mobilnaya-energiya",
    title: "Мобильная энергия",
    summary: "ПЭС и контейнерные комплексы для временных и вахтовых объектов.",
    use_cases: ["Строительство", "Мероприятия", "Аварийное покрытие"],
  },
];

export const services: ServiceStep[] = [
  { step: 1, title: "Анализ задачи", description: "Снимаем нагрузку, режимы, ограничения площадки и требования к надёжности." },
  { step: 2, title: "Подбор оборудования", description: "Формируем конфигурации по каталогу и инженерным критериям." },
  { step: 3, title: "Технико-экономический расчёт", description: "Считаем CAPEX/OPEX и срок окупаемости на подтверждённых данных." },
  { step: 4, title: "Проектирование", description: "Схемы, компоновка, обвязка, согласования." },
  { step: 5, title: "Поставка", description: "Логистика оборудования и комплектующих по России." },
  { step: 6, title: "Монтаж", description: "Шеф-монтаж / монтаж силами партнёрской сети." },
  { step: 7, title: "Пусконаладка", description: "ПНР, испытания, ввод в эксплуатацию." },
  { step: 8, title: "Сервис", description: "ТО, ЗИП, мониторинг и сопровождение жизненного цикла." },
];

/** Project cards — placeholders until real portfolio is provided. */
export const projects: Project[] = [
  {
    slug: "promyshlennaya-ploshchadka-ural",
    title: "Энергокомплекс для промышленной площадки",
    region: "Урал",
    object: "Производственный комплекс",
    power_mw: null,
    equipment: ["ДГУ", "АВР", "Щитовое оборудование"],
    year: null,
    works: ["Подбор", "Поставка", "Монтаж", "ПНР"],
    photo: null,
    summary: "Резервное и основное электроснабжение производственной площадки.",
    placeholder: true,
  },
  {
    slug: "kogeneratsiya-agrokholding",
    title: "Когенерация для агрохолдинга",
    region: "ЦФО",
    object: "Тепличный комплекс",
    power_mw: null,
    equipment: ["ГПУ", "Теплоутилизация"],
    year: null,
    works: ["ТЭО", "Проектирование", "Поставка", "Сервис"],
    photo: null,
    summary: "Газопоршневое решение с утилизацией тепла для тепличного комплекса.",
    placeholder: true,
  },
  {
    slug: "mobilnyy-kompleks-sever",
    title: "Мобильный энергокомплекс",
    region: "Северо-Запад",
    object: "Вахтовый / строительный объект",
    power_mw: null,
    equipment: ["ПЭС", "Контейнерное исполнение"],
    year: null,
    works: ["Подбор", "Поставка", "Пусконаладка"],
    photo: null,
    summary: "Мобильная генерация для временного энергоснабжения вахтового объекта.",
    placeholder: true,
  },
];

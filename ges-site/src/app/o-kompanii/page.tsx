import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "О компании",
  description: "GlobalEnergoStroi — инженерная энергетическая компания полного цикла.",
  alternates: { canonical: "/o-kompanii" },
};

export default function AboutPage() {
  return (
    <div className="ges-container py-12 md:py-16 max-w-4xl">
      <h1 className="ges-display text-4xl md:text-5xl mb-4">О компании</h1>
      <p className="text-lg ges-muted mb-8">
        ООО «ГлобалЭнергоСтрой» — инженерная энергетическая компания. Мы ведём клиента от задачи до сервиса: подбор,
        расчёт, проектирование, поставка, монтаж, пусконаладка.
      </p>
      <div className="ges-card p-6 md:p-8 space-y-4 mb-8">
        <h2 className="ges-display text-2xl">Почему GlobalEnergoStroi</h2>
        <ul className="space-y-2">
          <li>• Фокус на решении задачи, а не на «продаже коробки»</li>
          <li>• Каталог с паспортной дисциплиной данных (source-backed)</li>
          <li>• Полный цикл внедрения и сопровождения</li>
          <li>• Работа по всей России</li>
        </ul>
        <p className="text-sm ges-muted">
          Бренд-история, реквизиты для публикации и визуальные материалы — будут уточнены после презентации.
        </p>
      </div>
      <Link href="/kontakty" className="ges-btn ges-btn-primary">
        Связаться
      </Link>
    </div>
  );
}

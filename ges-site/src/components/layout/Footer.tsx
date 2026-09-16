import Link from "next/link";

export function Footer() {
  return (
    <footer className="ges-footer">
      <div className="ges-container ges-footer__grid">
        <div>
          <div className="ges-display" style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>
            Global<span style={{ color: "var(--ges-cyan)" }}>Energo</span>Stroi
          </div>
          <p style={{ color: "rgba(255,255,255,0.7)", maxWidth: 360, margin: 0 }}>
            Инженерные энергетические решения под ключ: подбор, расчёт, проектирование, поставка, монтаж и сервис.
          </p>
        </div>
        <div style={{ display: "grid", gap: "0.45rem", fontSize: "0.92rem" }}>
          <div style={{ fontWeight: 650, marginBottom: 4 }}>Навигация</div>
          <Link href="/katalog" style={{ color: "rgba(255,255,255,0.75)" }}>
            Каталог
          </Link>
          <Link href="/podbor" style={{ color: "rgba(255,255,255,0.75)" }}>
            Подбор
          </Link>
          <Link href="/kalkulyator" style={{ color: "rgba(255,255,255,0.75)" }}>
            Калькулятор
          </Link>
          <Link href="/proekty" style={{ color: "rgba(255,255,255,0.75)" }}>
            Проекты
          </Link>
        </div>
        <div style={{ display: "grid", gap: "0.45rem", fontSize: "0.92rem" }}>
          <div style={{ fontWeight: 650, marginBottom: 4 }}>Контакты</div>
          <p style={{ color: "rgba(255,255,255,0.75)", margin: 0 }}>Москва</p>
          <p style={{ color: "rgba(255,255,255,0.75)", margin: 0 }}>Контакты уточняются</p>
          <Link href="/kontakty" style={{ color: "var(--ges-cyan)", marginTop: 4 }}>
            Связаться
          </Link>
        </div>
      </div>
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        <div className="ges-container" style={{ padding: "1rem 0", fontSize: 12, color: "rgba(255,255,255,0.45)", display: "flex", flexWrap: "wrap", gap: "0.75rem", justifyContent: "space-between" }}>
          <span>© {new Date().getFullYear()} ООО «ГлобалЭнергоСтрой»</span>
          <span>Цены не являются публичной офертой</span>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";
import { categories } from "@/data/categories";
import { projects, solutions } from "@/data/content";
import { getPublishedProducts, isVerified } from "@/lib/catalog";
import { ProductCard } from "@/components/catalog/ProductCard";

export default function HomePage() {
  const featured = getPublishedProducts()
    .filter((p) => isVerified(p.verification_status) && p.prime_kw != null)
    .slice(0, 3);

  return (
    <div>
      <section className="ges-hero">
        <div className="ges-hero__media" aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/hero-industrial.svg" alt="" />
        </div>
        <div className="ges-hero__shade" />
        <div className="ges-container ges-hero__content">
          <div className="ges-animate-rise ges-display ges-hero__brand">
            Global<span style={{ color: "var(--ges-cyan)" }}>Energo</span>Stroi
          </div>
          <h1 className="ges-animate-rise-delay ges-display ges-hero__title">
            Энергетические решения под ключ
          </h1>
          <p className="ges-animate-rise-delay-2" style={{ fontSize: "clamp(1rem, 1.5vw, 1.2rem)", color: "rgba(255,255,255,0.82)", maxWidth: 560, margin: "0 0 1.6rem" }}>
            Проектируем, поставляем и запускаем энергетические комплексы для бизнеса по всей России.
          </p>
          <div className="ges-animate-rise-delay-2" style={{ display: "flex", flexWrap: "wrap", gap: "0.7rem" }}>
            <Link href="/podbor" className="ges-btn ges-btn-primary ges-cta-pulse">
              Подобрать оборудование
            </Link>
            <Link href="/zayavka" className="ges-btn ges-btn-ghost-light">
              Получить расчёт
            </Link>
            <Link href="/katalog" className="ges-btn ges-btn-ghost-light">
              Каталог оборудования
            </Link>
          </div>
        </div>
      </section>

      <section className="ges-section">
        <div className="ges-container">
          <h2 className="ges-display" style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", marginBottom: 8 }}>
            Инженерный подход
          </h2>
          <p className="ges-muted" style={{ maxWidth: 560, marginBottom: 28 }}>
            Не витрина генераторов — полный цикл от задачи до сервиса.
          </p>
          <div className="ges-grid-4">
            {["Подбор под задачу", "ТЭО и расчёт", "Поставка и монтаж", "ПНР и сервис"].map((t) => (
              <div key={t} style={{ padding: "0.2rem 0 0.6rem", borderTop: "2px solid var(--ges-cyan)" }}>
                <div style={{ fontWeight: 650, fontSize: "1.05rem", paddingTop: 14 }}>{t}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ges-section" style={{ paddingTop: 0 }}>
        <div className="ges-container">
          <div style={{ display: "flex", alignItems: "end", justifyContent: "space-between", gap: 16, marginBottom: 24 }}>
            <div>
              <h2 className="ges-display" style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", marginBottom: 6 }}>
                Каталог
              </h2>
              <p className="ges-muted">Категории оборудования</p>
            </div>
            <Link href="/katalog" className="ges-btn ges-btn-ghost">
              Весь каталог
            </Link>
          </div>
          <div className="ges-grid-cats">
            {categories.map((c) => (
              <Link key={c.slug} href={`/katalog/${c.slug}`} className="ges-surface" style={{ padding: "1.35rem 1.3rem", display: "block" }}>
                <div className="ges-display" style={{ fontSize: "1.25rem", marginBottom: 8 }}>
                  {c.name}
                </div>
                <p className="ges-muted" style={{ margin: 0, fontSize: "0.92rem" }}>
                  {c.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="ges-section" style={{ paddingTop: 0 }}>
        <div className="ges-container">
          <div className="ges-surface" style={{ padding: "2rem", display: "grid", gridTemplateColumns: "1.25fr 0.9fr", gap: "1.5rem", alignItems: "center" }}>
            <div>
              <h2 className="ges-display" style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", marginBottom: 10 }}>
                Подбор оборудования
              </h2>
              <p className="ges-muted" style={{ marginBottom: 20, maxWidth: 460 }}>
                Назначение, мощность, топливо, тепло, регион и режим — 1–3 конфигурации с объяснением выбора.
              </p>
              <Link href="/podbor" className="ges-btn ges-btn-primary">
                Запустить подбор
              </Link>
            </div>
            <div style={{ borderRadius: 20, background: "var(--ges-black)", color: "#fff", padding: "1.4rem 1.3rem" }}>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", marginBottom: 6 }}>Результат</div>
              <div className="ges-display" style={{ fontSize: "1.45rem", marginBottom: 8 }}>
                1–3 конфигурации
              </div>
              <p style={{ margin: 0, color: "rgba(255,255,255,0.7)", fontSize: "0.9rem" }}>
                Далее — точный расчёт инженера.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="ges-section" style={{ paddingTop: 0 }}>
        <div className="ges-container">
          <h2 className="ges-display" style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", marginBottom: 8 }}>
            Энергетические решения
          </h2>
          <p className="ges-muted" style={{ marginBottom: 24 }}>
            От резерва до когенерации.
          </p>
          <div className="ges-grid-2">
            {solutions.map((s) => (
              <Link key={s.slug} href="/resheniya" className="ges-surface" style={{ padding: "1.35rem", display: "block" }}>
                <div style={{ fontWeight: 650, fontSize: "1.15rem", marginBottom: 8 }}>{s.title}</div>
                <p className="ges-muted" style={{ margin: 0, fontSize: "0.92rem" }}>
                  {s.summary}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="ges-section" style={{ paddingTop: 0 }}>
        <div className="ges-container">
          <div className="ges-surface" style={{ padding: "1.8rem 2rem", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
            <div>
              <h2 className="ges-display" style={{ fontSize: "clamp(1.8rem, 3vw, 2.3rem)", marginBottom: 8 }}>
                Калькулятор экономии
              </h2>
              <p className="ges-muted" style={{ margin: 0, maxWidth: 520 }}>
                Ориентир по мощности. Без подтверждённых данных не выдумываем CAPEX и окупаемость.
              </p>
            </div>
            <Link href="/kalkulyator" className="ges-btn ges-btn-dark">
              Открыть калькулятор
            </Link>
          </div>
        </div>
      </section>

      <section className="ges-section" style={{ paddingTop: 0 }}>
        <div className="ges-container">
          <div style={{ display: "flex", alignItems: "end", justifyContent: "space-between", gap: 16, marginBottom: 24 }}>
            <div>
              <h2 className="ges-display" style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", marginBottom: 6 }}>
                Оборудование
              </h2>
              <p className="ges-muted">Подтверждённые модели из Master Catalog v4</p>
            </div>
            <Link href="/katalog/elektrostantsii" className="ges-btn ges-btn-ghost">
              Смотреть все
            </Link>
          </div>
          <div className="ges-grid-products">
            {featured.map((p) => (
              <ProductCard key={p.product_id} product={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="ges-section" style={{ paddingTop: 0 }}>
        <div className="ges-container">
          <h2 className="ges-display" style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", marginBottom: 24 }}>
            Проекты
          </h2>
          <div className="ges-grid-3">
            {projects.map((p) => (
              <Link key={p.slug} href={`/proekty/${p.slug}`} className="ges-surface" style={{ padding: "1.3rem", display: "block" }}>
                <div className="ges-muted" style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 8 }}>
                  {p.region}
                </div>
                <div style={{ fontWeight: 650, fontSize: "1.08rem", marginBottom: 6 }}>{p.title}</div>
                <p className="ges-muted" style={{ margin: 0, fontSize: "0.9rem" }}>
                  {p.object}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="ges-section" style={{ paddingTop: 0 }}>
        <div className="ges-container">
          <div style={{ borderRadius: 28, background: "var(--ges-black)", color: "#fff", padding: "2.4rem" }}>
            <h2 className="ges-display" style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", marginBottom: 10 }}>
              Готовы рассчитать решение?
            </h2>
            <p style={{ color: "rgba(255,255,255,0.7)", maxWidth: 520, marginBottom: 22 }}>
              Оставьте задачу — подготовим конфигурацию и коммерческое предложение.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              <Link href="/zayavka" className="ges-btn ges-btn-primary">
                Отправить заявку
              </Link>
              <Link href="/kontakty" className="ges-btn ges-btn-ghost-light">
                Контакты
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .ges-surface[style*="grid-template-columns: 1.25fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

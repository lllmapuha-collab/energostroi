"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCatalogState } from "@/lib/catalog-state";

const nav = [
  { href: "/katalog", label: "Оборудование" },
  { href: "/resheniya", label: "Решения" },
  { href: "/uslugi", label: "Услуги" },
  { href: "/proekty", label: "Проекты" },
  { href: "/o-kompanii", label: "О компании" },
  { href: "/kontakty", label: "Контакты" },
];

export function Header() {
  const pathname = usePathname();
  const { compareIds, favoriteIds } = useCatalogState();
  const [open, setOpen] = useState(false);

  return (
    <header className="ges-header">
      <div className="ges-container ges-header__inner">
        <Link href="/" className="ges-display ges-header__brand text-[1.05rem] md:text-[1.2rem]">
          Global<span style={{ color: "var(--ges-cyan-deep)" }}>Energo</span>Stroi
        </Link>

        <nav className="ges-nav" aria-label="Основное меню">
          {nav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{ color: active ? "var(--ges-cyan-deep)" : "rgba(18,22,29,0.82)" }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ges-header__actions">
          <Link href="/sravnenie" className="ges-btn ges-btn-ghost ges-btn-compact">
            Сравнение{compareIds.length ? ` (${compareIds.length})` : ""}
          </Link>
          <Link href="/izbrannoe" className="ges-btn ges-btn-ghost ges-btn-compact ges-only-sm">
            Избранное{favoriteIds.length ? ` (${favoriteIds.length})` : ""}
          </Link>
          <Link href="/zayavka" className="ges-btn ges-btn-primary ges-btn-compact ges-only-md">
            Получить расчёт
          </Link>
          <button type="button" className="ges-btn ges-btn-ghost ges-btn-compact ges-only-mobile-menu" onClick={() => setOpen((v) => !v)}>
            Меню
          </button>
        </div>
      </div>

      {open && (
        <div style={{ borderTop: "1px solid var(--ges-line)", background: "#fff" }}>
          <div className="ges-container" style={{ padding: "1rem 0 1.25rem", display: "grid", gap: "0.65rem" }}>
            {nav.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} style={{ fontWeight: 600, padding: "0.25rem 0" }}>
                {item.label}
              </Link>
            ))}
            <Link href="/podbor" onClick={() => setOpen(false)} style={{ fontWeight: 600 }}>
              Подбор оборудования
            </Link>
            <Link href="/kalkulyator" onClick={() => setOpen(false)} style={{ fontWeight: 600 }}>
              Калькулятор
            </Link>
            <Link href="/izbrannoe" onClick={() => setOpen(false)} style={{ fontWeight: 600 }}>
              Избранное{favoriteIds.length ? ` (${favoriteIds.length})` : ""}
            </Link>
            <Link href="/zayavka" onClick={() => setOpen(false)} className="ges-btn ges-btn-primary" style={{ marginTop: 6 }}>
              Получить расчёт
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

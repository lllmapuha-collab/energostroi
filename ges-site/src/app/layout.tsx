import type { Metadata } from "next";
import { CatalogStateProvider } from "@/lib/catalog-state";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ConsultantWidget } from "@/components/ai/ConsultantWidget";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "GlobalEnergoStroi — энергетические решения под ключ",
    template: "%s | GlobalEnergoStroi",
  },
  description:
    "Проектируем, поставляем и запускаем энергетические комплексы для бизнеса по всей России.",
  metadataBase: new URL("https://globalenergostroi.example"),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>
        <CatalogStateProvider>
          <Header />
          <main className="min-h-[70vh]">{children}</main>
          <Footer />
          <ConsultantWidget />
        </CatalogStateProvider>
      </body>
    </html>
  );
}

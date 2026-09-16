import type { Metadata } from "next";
import CompareClient from "./CompareClient";

export const metadata: Metadata = {
  title: "Сравнение",
  description: "Сравнение моделей оборудования GlobalEnergoStroi.",
  alternates: { canonical: "/sravnenie" },
};

export default function ComparePage() {
  return <CompareClient />;
}

export type VerificationStatus =
  | "verified"
  | "published_candidate"
  | "discovery"
  | "needs_verification"
  | "template"
  | "candidate"
  | "source_backed"; // legacy alias kept for older UI strings

export type SpecValue = string | number | null;

export interface SpecField {
  key: string;
  label: string;
  value: SpecValue;
  unit?: string | null;
  group: string;
}

export interface DocumentRef {
  id: string;
  title: string;
  type: "datasheet" | "certificate" | "manual" | "other";
  url: string | null;
  note?: string;
}

export interface Product {
  product_id: string;
  composite_key: string;
  slug: string;
  brand: string;
  model: string;
  name: string;
  category: string;
  subcategory: string;
  variant: string | null;
  fuel: string | null;
  engine: string | null;
  voltage: string | null;
  frequency: number | null;
  execution: string | null;
  prime_kw: number | null;
  prime_kva: number | null;
  standby_kw: number | null;
  standby_kva: number | null;
  cylinders: number | null;
  displacement_l: number | null;
  bore_stroke_mm: string | null;
  rpm: number | null;
  thermal_kw: number | null;
  efficiency_electrical: number | null;
  efficiency_thermal: number | null;
  efficiency_total: number | null;
  dimensions_mm: string | null;
  weight_kg: number | null;
  resource: string | null;
  warranty: string | null;
  price: number | null;
  images: string[];
  documents: DocumentRef[];
  specs: SpecField[];
  source: string;
  verification_status: VerificationStatus;
  seo_title: string;
  seo_description: string;
  published: boolean;
  source_level?: string | null;
  publication_status?: string | null;
  ai_note?: string | null;
  // Доступные исполнения модели (открытая / в кожухе / в контейнере / на шасси и т.д.).
  // Заполняется на этапе дедупликации: варианты одной модели сводятся в один товар.
  executions: string[];
  // Сколько исходных строк каталога объединено в этот канонический товар.
  variant_count: number;
  // ID исходных строк Master Catalog, вошедших в канонический товар (провенанс).
  merged_from: string[];
}

export interface CategoryNode {
  slug: string;
  name: string;
  description: string;
  children?: CategoryNode[];
}

export interface Project {
  slug: string;
  title: string;
  region: string;
  object: string;
  power_mw: number | null;
  equipment: string[];
  year: number | null;
  works: string[];
  photo: string | null;
  summary: string;
  placeholder?: boolean;
}

export interface Solution {
  slug: string;
  title: string;
  summary: string;
  use_cases: string[];
}

export interface ServiceStep {
  step: number;
  title: string;
  description: string;
}

export interface LeadPayload {
  name: string;
  company: string;
  phone: string;
  email: string;
  need: string;
  comment: string;
  source_path?: string;
}

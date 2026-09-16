/** Shape of rows in data/generated/products.json (import script output). */
export type CatalogProductRaw = {
  id: string;
  slug: string;
  excelSlug: string | null;
  category: string;
  categoryKey: string;
  subcategory: string;
  subcategoryKey: string;
  brand: string;
  manufacturer: string;
  model: string;
  variant: string | null;
  article: string | null;
  engine: {
    manufacturer: string | null;
    model: string | null;
    cylinders: number | null;
    displacementL: number | null;
    boreMm: number | null;
    strokeMm: number | null;
    rpm: number | null;
    raw: string | null;
  };
  primeKw: number | null;
  primeKva: number | null;
  standbyKw: number | null;
  standbyKva: number | null;
  voltage: string | null;
  frequency: number | null;
  phases: number | null;
  cosPhi: number | null;
  fuel: string | null;
  thermalKw: number | null;
  efficiencyElectrical: number | null;
  efficiencyThermal: number | null;
  efficiencyTotal: number | null;
  dimensions: string | null;
  weightKg: number | null;
  execution: string | null;
  sourceLevel: string | null;
  publicationStatus: string | null;
  verificationStatus:
    | "verified"
    | "published_candidate"
    | "discovery"
    | "needs_verification"
    | "template"
    | "candidate";
  source: string | null;
  sourceUrl: string | null;
  sourceId: string | null;
  aiNote: string | null;
  passportId: string | null;
  images: string[];
  documents: { title: string; url: string | null }[];
  compositeKey: string;
  description: string | null;
};

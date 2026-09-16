import type { MetadataRoute } from "next";

const BASE = "https://globalenergostroi.example";

// robots.txt: разрешаем индексацию, указываем карту сайта.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${BASE}/sitemap.xml`,
  };
}

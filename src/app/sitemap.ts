import type { MetadataRoute } from 'next';
import { seedProducts } from '@/data/seed';
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  return ['', '/women', '/men', '/new', ...seedProducts.map((p) => `/products/${p.slug}`)].map(
    (path) => ({ url: base + path, changeFrequency: 'monthly', priority: path === '' ? 1 : 0.7 }),
  );
}

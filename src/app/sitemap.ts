import type { MetadataRoute } from 'next';
import { getAllCountries } from '@/lib/geo';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://rvtwin.com';
  const now = new Date();

  const countryUrls = getAllCountries().map(c => ({
    url: `${base}/destinations/${c.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const plugs = [
    { url: `${base}/power-plugs`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.6 },
    { url: `${base}/power-plugs/type-a/countries`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.5 },
    { url: `${base}/power-plugs/type-c/countries`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.5 },
    { url: `${base}/power-plugs/type-g/countries`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.5 },
  ];

  return [
    { url: `${base}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/about`, changeFrequency: 'monthly' },
    { url: `${base}/contact`, changeFrequency: 'monthly' },
    { url: `${base}/guides/japan-checklist`, changeFrequency: 'monthly' },
    { url: `${base}/guides/esim-basics`, changeFrequency: 'monthly' },
    { url: `${base}/guides/baggage-basics`, changeFrequency: 'monthly' },
    { url: `${base}/legal/privacy`, changeFrequency: 'yearly' },
    { url: `${base}/legal/terms`, changeFrequency: 'yearly' },
    { url: `${base}/destinations`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    ...countryUrls,
    ...plugs,
  ];
}

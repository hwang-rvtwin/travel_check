import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://rvtwin.com';
  return [
    { url: `${base}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/about`, changeFrequency: 'monthly' },
    { url: `${base}/contact`, changeFrequency: 'monthly' },
    { url: `${base}/guides/japan-checklist`, changeFrequency: 'monthly' },
    { url: `${base}/guides/esim-basics`, changeFrequency: 'monthly' },
    { url: `${base}/guides/baggage-basics`, changeFrequency: 'monthly' },
    { url: `${base}/legal/privacy`, changeFrequency: 'yearly' },
    { url: `${base}/legal/terms`, changeFrequency: 'yearly' },
  ];
}

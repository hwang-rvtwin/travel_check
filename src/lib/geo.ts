import COUNTRIES, { type CountryMeta } from '@/data/countries';

export type { CountryMeta };

export function getAllCountries(): CountryMeta[] {
  // 얕은 복사로 외부 변이 방지
  return [...COUNTRIES];
}

export function getCountryBySlug(slug: string): CountryMeta | undefined {
  return COUNTRIES.find(c => c.slug === slug);
}

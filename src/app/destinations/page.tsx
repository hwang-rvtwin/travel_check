import Link from 'next/link';
import { getAllCountries } from '@/lib/geo';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '국가별 출국 체크 인덱스 | Travel Check Hub',
  description: '전압/플러그·비자·eSIM·기후·수하물 요약. 여행 준비를 국가별로 한눈에 확인하세요.',
  alternates: { canonical: 'https://rvtwin.com/destinations' },
  openGraph: { title: '국가별 출국 체크 인덱스', type: 'website', url: 'https://rvtwin.com/destinations' },
  twitter: { card: 'summary_large_image', title: '국가별 출국 체크 인덱스' },
};

export default function DestinationsIndexPage() {
  const countries = getAllCountries();
  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-semibold">국가별 출국 체크 인덱스</h1>
      <p className="mt-2 text-sm text-gray-500">비자·전압/플러그·eSIM·기후 요약 페이지 모음.</p>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {countries.map(c => (
          <li key={c.slug}>
            <Link
              className="block rounded-2xl border p-4 hover:bg-gray-50"
              href={`/destinations/${c.slug}`}
              aria-label={`${c.nameKo} 출국 체크 페이지`}
            >
              <div className="font-medium">{c.nameKo} <span className="text-gray-400 text-xs">({c.nameEn})</span></div>
              <div className="text-xs text-gray-500 mt-1">
                전압 {c.voltage}V / {c.frequency}Hz · 플러그 {c.plugTypes.join(', ')}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

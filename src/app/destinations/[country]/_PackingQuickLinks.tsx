// src/app/destinations/[country]/_PackingQuickLinks.tsx
import Link from "next/link";
import { MONTH_SLUGS, type MonthSlug } from "@/lib/countries";

/** destinaton → packing 슬러그 보정 (별칭 → 실제 라우트 슬러그) */
const ALIAS: Record<string, string> = {
  // ✅ 대한민국 별칭들
  kr: "south-korea",
  korea: "south-korea",
  "republic-of-korea": "south-korea",

  // (예: 기존에 쓰던 예외들)
  uae: "united-arab-emirates",
  "united arab emirates": "united-arab-emirates",
  usa: "united-states",
  "united states": "united-states",
  "united-states-of-america": "united-states",
  turkey: "turkiye",
  "türkiye": "turkiye",
  nz: "new-zealand",
  newzealand: "new-zealand",
};

/** 넘어온 국가 슬러그를 표준 슬러그로 치환 */
function normalizeCountrySlug(s: string): string {
  const k = (s ?? "").trim().toLowerCase();
  return ALIAS[k] ?? k;
}

const MONTH_LABELS_KO: readonly string[] = Array.from(
  { length: 12 },
  (_, i) => `${i + 1}월`,
);

function nextNMonthIndices(n: number, base = new Date()): number[] {
  const out: number[] = [];
  for (let i = 0; i < n; i++) out.push((base.getMonth() + i) % 12);
  return out;
}

export default function PackingQuickLinks({
  countrySlug,
  className,
}: {
  countrySlug: string;
  className?: string;
}) {
  // ✅ 여기서 표준화
  const slug = normalizeCountrySlug(countrySlug);
  const sectionClass = ["mt-3 mb-3", className].filter(Boolean).join(" ");

  const next3 = nextNMonthIndices(3).map((idx) => {
    const m = MONTH_SLUGS[idx] as MonthSlug;
    return {
      idx,
      label: MONTH_LABELS_KO[idx]!,
      slug: m,
      href: `/packing/${slug}/${m}`, // ← 표준화된 slug 사용
    };
  });

  const all = MONTH_SLUGS.map((m, idx) => ({
    idx,
    label: MONTH_LABELS_KO[idx]!,
    slug: m,
    href: `/packing/${slug}/${m}`, // ← 표준화된 slug 사용
  }));

  return (
    <section className={sectionClass}>
      <h2 className="text-lg font-semibold">월별 패킹 체크</h2>

      {/* 가까운 달 빠르게 보기 */}
      <div className="mt-5">
        <p className="text-sm text-gray-500">가까운 달 빠르게 보기</p>
        <div className="mt-2 flex flex-wrap gap-2 text-center">
          {next3.map((m) => (
            <Link
              key={m.slug}
              href={m.href}
              className="rounded-full px-4 py-4 text-sm shadow-sm hover:bg-sky-100 bg-sky-50 ring-1 ring-sky-100"
            >
              {m.label}
            </Link>
          ))}
        </div>
      </div>

      {/* 전체 월별 */}
      <div className="mt-5">
        <p className="text-sm text-gray-500">전체 월별</p>
        <div className="mt-2 grid grid-cols-4 gap-2 sm:grid-cols-6 text-center">
          {all.map((m) => (
            <Link
              key={m.slug}
              href={m.href}
              className="rounded-lg px-3 py-2 text-sm shadow-sm hover:bg-gray-50"
            >
              {m.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

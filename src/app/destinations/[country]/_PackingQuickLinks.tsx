// src/app/destinations/[country]/_PackingQuickLinks.tsx
import Link from "next/link";
import { MONTH_SLUGS, type MonthSlug } from "@/lib/countries";

// destinaton → packing 슬러그 보정
const ALIAS: Record<string, string> = {
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
function normalizeCountrySlug(s: string) {
  const k = s.trim().toLowerCase();
  return ALIAS[k] ?? k;
}

// 라벨
const MONTH_LABELS_KO: readonly string[] = Array.from(
  { length: 12 },
  (_, i) => `${i + 1}월`,
);

// 이번 달부터 n개월 인덱스(미래 방향)
function nextNMonthIndices(n: number, base = new Date()): number[] {
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    out.push((base.getMonth() + i) % 12); // 0..11
  }
  return out;
}

export default function PackingQuickLinks({
  countrySlug,
  className,
}: {
  countrySlug: string;
  className?: string;
}) {
  const slug = normalizeCountrySlug(countrySlug);
  const sectionClass = ["mt-8", className].filter(Boolean).join(" ");

  // 이번 달 + 다음 두 달
  const next3 = nextNMonthIndices(3).map((idx: number) => {
    const m = MONTH_SLUGS[idx] as MonthSlug;
    return {
      idx,
      label: MONTH_LABELS_KO[idx],
      slug: m,
      href: `/packing/${slug}/${m}`,
    };
  });

  // 전체 12개월
  const all = MONTH_SLUGS.map((m: MonthSlug, idx: number) => ({
    idx,
    label: MONTH_LABELS_KO[idx]!,
    slug: m,
    href: `/packing/${slug}/${m}`,
  }));

  return (
    <section className={sectionClass}>
      {/* 메인 타이틀만 굵게 */}
      <h2 className="text-lg font-semibold">월별 패킹 체크</h2>

      {/* 최근 3개월(= 현재/미래 3개월) */}
      <div className="mt-3">
        <p className="text-sm text-gray-500">가까운 달 빠르게 보기</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {next3.map((m) => (
            <Link
              key={m.slug}
              href={m.href}
              className="rounded-lg border px-3 py-1 text-sm hover:bg-gray-50"
            >
              {m.label}
            </Link>
          ))}
        </div>
      </div>

      {/* 전체 월별 */}
      <div className="mt-6">
        <p className="text-sm text-gray-500">전체 월별</p>
        <div className="mt-2 grid grid-cols-4 gap-2 sm:grid-cols-6">
          {all.map((m) => (
            <Link
              key={m.slug}
              href={m.href}
              className="rounded-lg border px-3 py-1 text-sm hover:bg-gray-50"
            >
              {m.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

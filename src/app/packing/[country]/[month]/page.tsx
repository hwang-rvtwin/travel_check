// src/app/packing/[country]/[month]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  COUNTRY_SLUGS,
  MONTH_SLUGS,
  findCountryBySlug,
  isMonthSlug,
  getCountryMonthlyClimate,
  type MonthSlug,
} from "@/lib/countries";
import { deriveMonthlyClimate, buildPackingAdvice } from "@/lib/packing";
import PrintButton from "@/components/PrintButton";
import {
  PackingFAQJsonLd,
  ItemListJsonLd,
  BreadcrumbsJsonLd,
} from "@/lib/schema";
import EditableChecklist, {
  type ChecklistData,
} from "@/components/EditableChecklist";

export const revalidate = 86400;

/* --------------------------------- SSG --------------------------------- */
export function generateStaticParams() {
  return COUNTRY_SLUGS.flatMap((country) =>
    MONTH_SLUGS.map((month) => ({ country, month }))
  );
}

export async function generateMetadata(props: {
  params: Promise<{ country: string; month: string }>;
}): Promise<Metadata> {
  const { country: countrySlug, month } = await props.params;
  const country = findCountryBySlug(countrySlug);
  const m = Number(month);
  const title = country
    ? `${country.nameKo} ${m}월 패킹 가이드`
    : `여행 패킹 가이드`;
  const desc = country
    ? `${country.flag} ${country.nameKo}의 ${m}월 체감 날씨·권장 복장·체크리스트·PDF`
    : "여행 패킹 체크리스트";
  const canonical = `/packing/${countrySlug}/${month}`;
  return {
    title,
    description: desc,
    alternates: { canonical },
    openGraph: { title, description: desc, type: "article", url: canonical },
  };
}

/* ------------------------- 비복장 키워드 필터링 ------------------------- */
const EXCLUDE_NON_CLOTHING = [
  /전원/i,
  /플러그/i,
  /어댑터/i,
  /멀티\s*어댑터/i,
  /멀티\s*탭/i,
  /보조\s*배터리/i,
  /배터리/i,
  /충전기/i,
];

/* -------------------------------- 페이지 -------------------------------- */
export default async function Page(props: {
  params: Promise<{ country: string; month: string }>;
}) {
  const { country: countrySlug, month: monthSlug } = await props.params;
  const country = findCountryBySlug(countrySlug);
  if (!country || !isMonthSlug(monthSlug)) notFound();
  const month = Number(monthSlug);

  // 기후/패킹 조언
  const climate = deriveMonthlyClimate(country, month);
  const advice = buildPackingAdvice(country, month, climate);

  // 월 인덱스(0..11)와 평균 최저/최고
  const monthIdx = MONTH_SLUGS.indexOf(monthSlug as MonthSlug);
  const mc = getCountryMonthlyClimate(country.slug);
  const avgMin = mc?.avgMinC?.[monthIdx];
  const avgMax = mc?.avgMaxC?.[monthIdx];

  // 권장 복장 요약에서 비복장 문구 제거
  const clothingThreeLine = advice.threeLine.filter(
    (t: string) => !EXCLUDE_NON_CLOTHING.some((rx) => rx.test(t))
  );

  // 체크리스트 초기 데이터
  const checklistData: ChecklistData = {
    상의: advice.tops.map((label: string) => ({ label })),
    하의: advice.bottoms.map((label: string) => ({ label })),
    겉옷: advice.outer.map((label: string) => ({ label })),
    신발: advice.shoes.map((label: string) => ({ label })),
    액세서리: advice.accessories.map((label: string) => ({ label })),
    "전자/전력": advice.electronics.map((label: string) => ({ label })),
    "의약/위생": advice.health.map((label: string) => ({ label })),
    "문서/금융": advice.docs.map((label: string) => ({ label })),
    기타: advice.etc.map((label: string) => ({ label })),
  };

  const season = country.seasonTagByMonth[month];

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      {/* JSON-LD */}
      <PackingFAQJsonLd country={country} month={month} />
      <ItemListJsonLd
        country={country}
        month={month}
        items={Object.values(checklistData)
          .flat()
          .map((x) => x.label)}
      />
      <BreadcrumbsJsonLd
        parts={[
          { name: "Packing", href: "/packing" },
          { name: country.nameKo, href: `/packing/${country.slug}` },
          { name: `${month}월`, href: `/packing/${country.slug}/${monthSlug}` },
        ]}
      />

      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl border border-sky-50 bg-sky-50 p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-[28px] font-semibold tracking-tight text-slate-900">
              {country.flag} {country.nameKo}{" "}
              <span className="text-sky-500">{month}월</span> 패킹 가이드
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              이달의 체감 날씨를 기반으로 권장 복장과 체크리스트를 한 눈에.
            </p>

            <div className="mt-10 flex flex-wrap gap-2 text-xs">
              <Chip icon="season">시즌: {season}</Chip>
              <Chip icon="thermo">
                {avgMin !== undefined ? `${avgMin.toFixed(1)}°C` : "—"} ~{" "}
                {avgMax !== undefined ? `${avgMax.toFixed(1)}°C` : "—"}
              </Chip>
              <Chip icon="note">체감: {climate.summary}</Chip>
            </div>
          </div>

          <div className="shrink-0">
            <PrintButton country={country.slug} month={monthSlug} />
          </div>
        </div>

        <div
          aria-hidden
          className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-sky-200/30 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-indigo-200/30 blur-3xl"
        />
      </section>

      {/* SUMMARY */}
      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader icon="cloud" title="이달 체감 날씨" />
          <p className="mt-2 text-sm leading-6 text-slate-700">
            {climate.summary}
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <Stat
              label="평균 최저"
              value={avgMin !== undefined ? `${avgMin.toFixed(1)}°C` : "—"}
              icon="thermo-down"
            />
            <Stat
              label="평균 최고"
              value={avgMax !== undefined ? `${avgMax.toFixed(1)}°C` : "—"}
              icon="thermo-up"
            />
          </div>
        </Card>

        <Card>
          <CardHeader icon="tshirt" title="권장 복장 요약" />
          <ul className="mt-2 space-y-2 text-sm leading-6">
            {clothingThreeLine.map((t: string, i: number) => (
              <li key={i} className="flex items-start gap-2">
                <Svg icon="check" className="mt-1 h-4 w-4 text-sky-600" />
                <span className="text-slate-700">{t}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHeader icon="umbrella" title="우/방수/충전 팁" />
          <p className="mt-2 text-sm leading-6 text-slate-700">
            우산/방수자켓, 멀티어댑터, 보조배터리는 필수급.
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-600">
            <Badge>방수</Badge>
            <Badge>레이어드</Badge>
            <Badge>전원/플러그</Badge>
          </div>
        </Card>
      </section>

      {/* CHECKLIST (편집 가능) */}
      <section className="mt-15">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">체크리스트</h2>
          <span className="text-xs text-slate-500">
            항목 추가/수정/삭제 가능 · 자동 저장
          </span>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <EditableChecklist
            initialData={checklistData}
            storageKey={`pack:${country.slug}:${month}`}
          />
        </div>
      </section>

      {/* CTA */}
      <section className="mt-8 grid gap-3 md:grid-cols-2">
        <a
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-sky-300 hover:text-sky-700 hover:bg-sky-50"
          href={`/destinations/${country.slug}`}
        >
          <Svg icon="arrow" className="h-4 w-4" />
          해당 국가 상세로 이동
        </a>
        <a
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-sky-300 hover:text-sky-700 hover:bg-sky-50"
          href={`/packing/${country.slug}`}
        >
          <Svg icon="calendar" className="h-4 w-4" />
          {country.nameKo} 월별 패킹 인덱스
        </a>
      </section>

      {/* NOTICE */}
      <section className="mt-10">
        <p className="text-xs text-slate-500">
          일부 링크는 제휴 링크이며,{" "}
          <span className="underline">{'rel="sponsored"'}</span>가 적용됩니다.
        </p>
      </section>
    </main>
  );
}

/* -------------------------- 프리젠테이션 컴포넌트 -------------------------- */
function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-sky-400 bg-white p-5 shadow-lg transition hover:-translate-y-0.5">
      {children}
    </div>
  );
}
function CardHeader({ icon, title }: { icon: IconKey; title: string }) {
  return (
    <div className="flex items-center gap-2 text-xs text-slate-600">
      <Svg icon={icon} className="h-4 w-4" />
      <span className="font-medium">{title}</span>
    </div>
  );
}
function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: IconKey;
}) {
  return (
    <div className="rounded-lg border border-slate-200 px-3 py-2">
      <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
        <Svg icon={icon} className="h-3.5 w-3.5" />
        {label}
      </div>
      <div className="mt-1 font-medium">{value}</div>
    </div>
  );
}
function Chip({
  icon,
  children,
}: {
  icon: IconKey;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-2.5 py-1 text-slate-700 shadow-sm ring-1 ring-slate-200 backdrop-blur">
      <Svg icon={icon} className="h-3.5 w-3.5 text-slate-600" />
      <span className="whitespace-nowrap">{children}</span>
    </span>
  );
}
function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-700">
      {children}
    </span>
  );
}

type IconKey =
  | "thermo"
  | "thermo-up"
  | "thermo-down"
  | "cloud"
  | "umbrella"
  | "tshirt"
  | "check"
  | "arrow"
  | "calendar"
  | "note"
  | "season";

function Svg({ icon, className }: { icon: IconKey; className?: string }) {
  switch (icon) {
    case "thermo":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden>
          <path
            d="M10 14.5V5a2 2 0 114 0v9.5a3.5 3.5 0 11-4 0z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          />
        </svg>
      );
    case "thermo-up":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden>
          <path
            d="M10 14.5V5a2 2 0 114 0v9.5a3.5 3.5 0 11-4 0z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path d="M6 6h6" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      );
    case "thermo-down":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden>
          <path
            d="M10 14.5V5a2 2 0 114 0v9.5a3.5 3.5 0 11-4 0z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path d="M6 18h6" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      );
    case "cloud":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden>
          <path
            d="M7 18h10a4 4 0 100-8 6 6 0 10-10 6z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          />
        </svg>
      );
    case "umbrella":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden>
          <path
            d="M3 12a9 9 0 0118 0H3z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path
            d="M12 12v5a2 2 0 01-4 0"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          />
        </svg>
      );
    case "tshirt":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden>
          <path
            d="M8 4l4-2 4 2 3 3-3 2v9a2 2 0 01-2 2H10a2 2 0 01-2-2V9L5 7l3-3z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          />
        </svg>
      );
    case "check":
      return (
        <svg viewBox="0 0 20 20" className={className} aria-hidden>
          <path
            d="M8 13l-3-3m0 0l-2 2 5 5 9-9-2-2-7 7z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          />
        </svg>
      );
    case "arrow":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden>
          <path
            d="M5 12h14M13 5l7 7-7 7"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          />
        </svg>
      );
    case "calendar":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden>
          <rect
            x="3"
            y="5"
            width="18"
            height="16"
            rx="2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path
            d="M8 3v4M16 3v4M3 10h18"
            stroke="currentColor"
            strokeWidth="1.6"
          />
        </svg>
      );
    case "note":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden>
          <rect
            x="4"
            y="3"
            width="16"
            height="18"
            rx="2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path
            d="M8 8h8M8 12h8M8 16h6"
            stroke="currentColor"
            strokeWidth="1.6"
          />
        </svg>
      );
    case "season":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden>
          <circle
            cx="12"
            cy="12"
            r="4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path
            d="M12 2v3M12 19v3M2 12h3M19 12h3M4.5 4.5l2 2M17.5 17.5l2 2M4.5 19.5l2-2M17.5 6.5l2-2"
            stroke="currentColor"
            strokeWidth="1.6"
          />
        </svg>
      );
  }
}

// src/app/packing/[country]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { COUNTRY_SLUGS, MONTH_SLUGS, findCountryBySlug } from "@/lib/countries";
import { BreadcrumbsJsonLd } from "@/lib/schema";

export const revalidate = 86400;

// /packing/[country] 정적 생성
export function generateStaticParams() {
  return COUNTRY_SLUGS.map((country) => ({ country }));
}

// 메타데이터 (Next 15: params 비동기)
export async function generateMetadata(props: {
  params: Promise<{ country: string }>;
}): Promise<Metadata> {
  const { country } = await props.params;
  const c = findCountryBySlug(country);
  if (!c) return {};
  const title = `${c.nameKo} 월별 패킹 인덱스`;
  const description = `${c.nameKo}의 1–12월 패킹 체크리스트/요약으로 바로가기.`;
  return {
    title,
    description,
    alternates: { canonical: `/packing/${c.slug}` },
    openGraph: {
      title,
      description,
      type: "website",
      url: `/packing/${c.slug}`,
    },
  };
}

// 시즌 색상 매핑(라벨 배경/테두리)
const seasonStyle: Record<string, string> = {
  한겨울: "bg-sky-50 text-sky-700 ring-sky-200",
  "늦가을/초봄": "bg-indigo-50 text-indigo-700 ring-indigo-200",
  "봄/가을": "bg-emerald-50 text-emerald-700 ring-emerald-200",
  한여름: "bg-amber-50 text-amber-700 ring-amber-200",
  "장마/우기": "bg-cyan-50 text-cyan-700 ring-cyan-200",
};

// 페이지 (Next 15: params 비동기)
export default async function Page(props: {
  params: Promise<{ country: string }>;
}) {
  const { country } = await props.params;
  const c = findCountryBySlug(country);
  if (!c) notFound();

  const now = new Date();
  const current = now.getMonth() + 1;

  return (
    <main className="relative mx-auto max-w-3xl px-4 py-10">
      {/* JSON-LD (빵부스러기) */}
      <BreadcrumbsJsonLd
        parts={[
          { name: "Packing", href: "/packing" },
          { name: c!.nameKo, href: `/packing/${c!.slug}` },
        ]}
      />

      {/* 히어로 */}
      <header className="mb-8">
        <div className="inline-flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-sky-50">
            <span className="text-lg text-sky-600 font-bold">{c!.flag}</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold leading-tight sm:text-2xl">
              {c!.nameKo} 월별 패킹 가이드
            </h1>
            <p className="text-xs text-slate-500">
              1–12월 체크리스트로 바로 이동하세요. 시즌 라벨은 간단 요약입니다.
            </p>
          </div>
        </div>
      </header>

      {/* 12개월 카드 */}
      <section
        aria-label="월 선택"
        className="grid grid-cols-3 gap-3 sm:grid-cols-3 lg:grid-cols-4"
      >
        {MONTH_SLUGS.map((m) => {
          const mNum = Number(m);
          const season = c!.seasonTagByMonth[mNum] ?? "";
          const isThisMonth = mNum === current;

          const chipClass =
            seasonStyle[season] ?? "bg-slate-50 text-slate-700 ring-slate-200";

          return (
            <a
              key={m}
              href={`/packing/${c!.slug}/${m}`}
              className={[
                "group relative rounded-2xl border border-slate-200 bg-white/80 p-4",
                "shadow-sm backdrop-blur transition-all",
                "hover:-translate-y-0.5 hover:shadow-md",
                isThisMonth ? "ring-2 ring-sky-400" : "",
                // 모바일에서도 충분한 높이(카드형 느낌)
                "min-h-[110px] sm:min-h-[120px]",
                "flex flex-col justify-between",
              ].join(" ")}
            >
              <div className="flex items-center justify-between">
                <div className="text-base font-semibold">
                  {mNum}월
                  {isThisMonth && (
                    <span className="ml-2 align-middle rounded-full bg-sky-500/10 px-2 py-0.5 text-[11px] font-medium text-sky-700 ring-1 ring-sky-200">
                      이번 달
                    </span>
                  )}
                </div>

                {/* 우상단 화살표 */}
                <svg
                  className="h-4 w-4 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-slate-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.6}
                >
                  <path d="M7 17L17 7M10 7h7v7" />
                </svg>
              </div>

              <div className="mt-3">
                <span
                  className={[
                    "inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] ring-1",
                    chipClass,
                  ].join(" ")}
                >
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-current/60" />
                  시즌: {season || "정보 없음"}
                </span>
              </div>
            </a>
          );
        })}
      </section>

      {/* 안내 */}
      <p className="mt-8 text-xs text-slate-500">
        예상 기온/강수 등 상세 정보는 각 월의 페이지 상단 안내를 참고하세요.
      </p>
    </main>
  );
}

// src/app/packing/[country]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  COUNTRY_SLUGS,
  MONTH_SLUGS,
  findCountryBySlug,
} from "@/lib/countries";
import { BreadcrumbsJsonLd } from "@/lib/schema";

export const revalidate = 86400;

// /packing/[country] 정적 생성
export function generateStaticParams() {
  return COUNTRY_SLUGS.map((country) => ({ country }));
}

// 메타데이터 (Next 15: params 비동기)
export async function generateMetadata(
  props: { params: Promise<{ country: string }> }
): Promise<Metadata> {
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

// 페이지 (Next 15: params 비동기)
export default async function Page(
  props: { params: Promise<{ country: string }> }
) {
  const { country } = await props.params;
  const c = findCountryBySlug(country);
  if (!c) notFound();

  const now = new Date();
  const current = now.getMonth() + 1;

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      {/* JSON-LD (빵부스러기) */}
      <BreadcrumbsJsonLd
        parts={[
          { name: "Packing", href: "/packing" },
          { name: c!.nameKo, href: `/packing/${c!.slug}` },
        ]}
      />

      {/* 히어로 */}
      <header className="space-y-2">
        <h1 className="text-2xl font-bold">
          {c!.flag} {c!.nameKo} 월별 패킹
        </h1>
        <p className="text-sm text-gray-600">
          1–12월 체크리스트로 바로 이동하세요. 시즌 라벨은 간단 요약입니다.
        </p>
      </header>

      {/* 12개월 카드 */}
      <section className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
        {MONTH_SLUGS.map((m) => {
          const mNum = Number(m);
          const season = c!.seasonTagByMonth[mNum];
          const isThisMonth = mNum === current;
          return (
            <a
              key={m}
              href={`/packing/${c!.slug}/${m}`}
              className={`rounded-xl border p-3 hover:bg-gray-50 transition ${
                isThisMonth ? "ring-2 ring-blue-500" : ""
              }`}
            >
              <div className="text-sm font-semibold">
                {mNum}월{" "}
                {isThisMonth && (
                  <span className="ml-1 rounded bg-blue-100 px-1.5 py-0.5 text-[10px] text-blue-700">
                    이번 달
                  </span>
                )}
              </div>
              <div className="mt-1 text-xs text-gray-500">시즌: {season}</div>
            </a>
          );
        })}
      </section>

      {/* 안내 */}
      <p className="mt-6 text-xs text-gray-500">
        예상 기온/강수는 월별 상세 페이지 상단 안내를 참고하세요.
      </p>
    </main>
  );
}

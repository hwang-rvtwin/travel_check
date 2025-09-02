// src/app/packing/[country]/[month]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  COUNTRY_SLUGS,
  MONTH_SLUGS,
  findCountryBySlug,
  isMonthSlug,
  // MonthSlug  // ← 굳이 타입 엄격히 안 갈 거면 임포트 생략해도 됩니다
} from "@/lib/countries";
import { deriveMonthlyClimate, buildPackingAdvice } from "@/lib/packing";
import PackingChecklist from "@/components/PackingChecklist";
import PdfButton from "@/components/PdfButton";
import { PackingFAQJsonLd, ItemListJsonLd, BreadcrumbsJsonLd } from "@/lib/schema";

export const revalidate = 86400;

// ✅ 동기로 간단히: Next가 알아서 처리합니다. 굳이 Promise 타입 지정하지 마세요.
export function generateStaticParams() {
  return COUNTRY_SLUGS.flatMap((country) =>
    MONTH_SLUGS.map((month) => ({ country, month }))
  );
}

// ✅ params는 "객체"로 받습니다 (Promise 아님)
export async function generateMetadata(
  props: { params: Promise<{ country: string; month: string }> }
): Promise<Metadata> {
  const { country: countrySlug, month } = await props.params;
  const country = findCountryBySlug(countrySlug);
  const m = Number(month);
  const title = country ? `${country.nameKo} ${m}월 패킹 가이드` : `여행 패킹 가이드`;
  const desc = country
    ? `${country.flag} ${country.nameKo}의 ${m}월 체감 날씨·권장 복장·체크리스트·PDF`
    : "여행 패킹 체크리스트";
  return {
    title,
    description: desc,
    alternates: { canonical: `/packing/${country}/${month}` },
    openGraph: {
      title,
      description: desc,
      type: "article",
      url: `/packing/${country}/${month}`,
    },
  };
}

// ✅ 여기서도 동일하게 "객체"로 받습니다
export default async function Page(
    props: { params: Promise<{ country: string; month: string }> }
) {
    const { country: countrySlug, month: monthSlug } = await props.params;
    const country = findCountryBySlug(countrySlug);
    if (!country || !isMonthSlug(monthSlug)) { notFound(); }
    const month = Number(monthSlug);

  const climate = deriveMonthlyClimate(country, month);
  const advice = buildPackingAdvice(country, month, climate);

  const checklistData = {
    "상의": advice.tops.map((label) => ({ label })),
    "하의": advice.bottoms.map((label) => ({ label })),
    "겉옷": advice.outer.map((label) => ({ label })),
    "신발": advice.shoes.map((label) => ({ label })),
    "액세서리": advice.accessories.map((label) => ({ label })),
    "전자/전력": advice.electronics.map((label) => ({ label })),
    "의약/위생": advice.health.map((label) => ({ label })),
    "문서/금융": advice.docs.map((label) => ({ label })),
    "기타": advice.etc.map((label) => ({ label })),
  } as const;

  const season = country.seasonTagByMonth[month];

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      {/* JSON-LD */}
      <PackingFAQJsonLd country={country} month={month} />
      <ItemListJsonLd
        country={country}
        month={month}
        items={Object.values(checklistData).flat().map((x) => x.label)}
      />
      <BreadcrumbsJsonLd
        parts={[
          { name: "Packing", href: "/packing" },
          { name: country.nameKo, href: `/packing/${country.slug}` },
          { name: `${month}월`, href: `/packing/${country.slug}/${monthSlug}` },
        ]}
      />

      {/* 히어로 */}
      <section className="space-y-2">
        <h1 className="text-2xl font-bold">
          {country.flag} {country.nameKo}{" "}
          <span className="text-gray-500">{month}월</span> 패킹 가이드
        </h1>
        <p className="text-sm text-gray-600">
          시즌: {season} · 이달 체감: {climate.summary}
        </p>
      </section>

      {/* 핵심 카드 */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6">
        <div className="border rounded-xl p-4">
          <h2 className="font-semibold mb-1">이달 체감 날씨</h2>
          <p className="text-sm">{climate.summary}</p>
        </div>
        <div className="border rounded-xl p-4">
          <h2 className="font-semibold mb-1">권장 복장 요약</h2>
          <ul className="text-sm list-disc ml-5">
            {advice.threeLine.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </div>
        <div className="border rounded-xl p-4">
          <h2 className="font-semibold mb-1">우/방수/충전 팁</h2>
          <p className="text-sm">우산/방수자켓, 멀티어댑터, 보조배터리는 필수급.</p>
        </div>
      </section>

      {/* 체크리스트 */}
      <section className="mt-8">
        <h2 className="font-semibold mb-2">체크리스트</h2>
        <PackingChecklist data={checklistData} />
      </section>

      {/* CTA */}
      <section className="mt-8 space-y-3">
        <PdfButton country={country.slug} month={monthSlug} />
        <div className="grid gap-2 md:grid-cols-2">
          <a className="border rounded-xl p-3 text-center" href={`/destinations/${country.slug}`}>
            해당 국가 상세로 이동
          </a>
          {/*<a className="border rounded-xl p-3 text-center" href={`/destinations/${country.slug}#baggage`}>
            이번 달 항공/수하물 규정 확인
          </a>*/}
          <a className="border rounded-xl p-3 text-center" href={`/packing/${country.slug}`}>
            {country.nameKo} 월별 패킹 인덱스
          </a>
        </div>
      </section>

      {/* 제휴 고정 블록 */}
      <section className="mt-10">
        {/* <AffiliateBlock variant="packing" country={country} /> */}
        <p className="text-xs text-gray-500 mt-2">
          일부 링크는 제휴 링크이며, <span className="underline">{'rel="sponsored"'}</span>가 적용됩니다.
        </p>
      </section>
    </main>
  );
}

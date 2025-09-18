// src/app/destinations/[country]/page.tsx
import { notFound } from "next/navigation";
import Script from "next/script";
import type { Metadata } from "next";
import type { ReactNode } from "react";

import { getAllCountries, getCountryBySlug } from "@/lib/geo";
import { TZ_BY_ISO2, CCY_BY_ISO2 } from "@/lib/geo-extra";
import AffiliateKit from "@/components/AffiliateKit";
// import LocalTime from "@/components/LocalTime"; // ❌ 제거
import PlugPhotos from "@/components/PlugPhotos";
import FxCard from "@/components/FxCard";
import PackingQuickLinks from "./_PackingQuickLinks";



import ClientOnly from '@/components/ClientOnly';
import LocalTime from '@/components/LocalTime';

type CountryParams = { country: string };
type CorePart = "year" | "month" | "day" | "hour" | "minute" | "second";

export const dynamicParams = false;
export const revalidate = 3600;

export function generateStaticParams(): CountryParams[] {
  return getAllCountries().map((c) => ({ country: c.slug }));
}

/* ---------- 유틸 ---------- */
function flagEmoji(iso2: string): string {
  const codePoints = iso2
    .toUpperCase()
    .split("")
    .map((c) => 127397 + c.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}
function offsetMinutes(tz: string, now = new Date()): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const parts = dtf.formatToParts(now);
  const get = (k: CorePart): number => {
    const v = parts.find((p) => p.type === k)?.value;
    return v ? parseInt(v, 10) : 0;
  };
  const asUTC = Date.UTC(
    get("year"),
    get("month") - 1,
    get("day"),
    get("hour"),
    get("minute"),
    get("second")
  );
  return (asUTC - now.getTime()) / 60000;
}
function hoursDiffFromSeoul(tz: string): number {
  return Math.round((offsetMinutes(tz) - offsetMinutes("Asia/Seoul")) / 60);
}

/* ---------- 여행자 Q/A용 로컬 데이터 (발췌) ---------- */
type Tipping =
  | "none"
  | "rounding"
  | "service_included"
  | "optional"
  | "ten_percent";
type Payment = "card" | "cash" | "mixed";
type BudgetRangeKRW = [number, number];
interface CountryExtra {
  tipping: Tipping;
  payment: Payment;
  emergency: {
    general: string;
    police?: string;
    ambulance?: string;
    fire?: string;
  };
  transport: string;
  budget10d?: BudgetRangeKRW;
  topPlaces?: string[];
  foods?: string[];
  apps?: string[];
  souvenirs?: string[];
}
function tipText(t: Tipping): string {
  switch (t) {
    case "none":
      return "팁 문화 없음(기본적으로 주지 않음).";
    case "rounding":
      return "반올림/소액 팁 정도.";
    case "service_included":
      return "영수증에 서비스료 포함이 일반적.";
    case "optional":
      return "상황에 따라 5–10% 내외.";
    case "ten_percent":
      return "음식점 등 10–20% 관례.";
  }
}
function payText(p: Payment): string {
  switch (p) {
    case "card":
      return "카드 결제 매우 보편.";
    case "cash":
      return "현금 선호 상점 다수 — 소액 현금 권장.";
    case "mixed":
      return "카드/현금 혼합 — 소규모 상점은 현금만 받기도 함.";
  }
}
function formatBudget([min, max]: BudgetRangeKRW): string {
  const f = (v: number) => `${Math.round(v / 10000)}만원`;
  return `${f(min)} ~ ${f(max)}`;
}

// (예시 데이터: 일부 국가)
const EXTRAS: Record<string, CountryExtra> = {
  JP: {
    tipping: "none",
    payment: "card",
    emergency: { general: "119", police: "110" },
    transport:
      "Suica/ICOCA/PASMO 등 교통카드 사용. JR패스는 장거리 위주일 때만 유리.",
    budget10d: [1000000, 2500000],
    topPlaces: ["도쿄", "교토·나라", "오사카", "후지/하코네"],
    foods: ["스시·사시미", "라멘", "돈카츠", "오코노미야키"],
    apps: ["NAVITIME", "Google Maps", "JR East", "Suica"],
    souvenirs: ["도쿄바나나", "녹차/말차", "키트캣 한정판", "전통 젓가락"],
  },
  US: {
    tipping: "ten_percent",
    payment: "card",
    emergency: { general: "911" },
    transport:
      "도시별 상이(뉴욕 OMNY/메트로카드, 샌프란 Clipper 등). 라이드셰어 보편.",
    budget10d: [2500000, 5000000],
    topPlaces: ["뉴욕", "라스베이거스/그랜드캐니언", "샌프란시스코", "하와이"],
    foods: ["버거", "바비큐", "텍스멕스", "뉴욕피자"],
    apps: ["Uber/Lyft", "Citymapper", "Google Maps", "Yelp"],
    souvenirs: ["리바이스/컨버스", "스니커즈", "로컬 핫소스", "국립공원 굿즈"],
  },
  // ... (다른 국가 데이터는 기존과 동일)
};

/* ---------- 메타데이터 ---------- */
export async function generateMetadata(props: {
  params: Promise<CountryParams>;
}): Promise<Metadata> {
  const { country } = await props.params;
  const c = getCountryBySlug(country);
  if (!c) return {};
  const title = `${c.nameKo} 출국 체크: 비자·eSIM·플러그·수하물 | Travel Check Hub`;
  const description = `${c.nameKo}(${c.nameEn}) 핵심: 비자, 전압 ${
    c.voltage
  }V/플러그 ${c.plugTypes.join(", ")}, eSIM, 기후 요약, 시차/환율까지.`;
  const url = `https://rvtwin.com/destinations/${c.slug}`;
  const og = `https://rvtwin.com/api/og?country=${encodeURIComponent(
    c.nameKo
  )}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      images: [{ url: og }],
    },
    twitter: { card: "summary_large_image", title, description, images: [og] },
  };
}

/* ---------- 페이지 ---------- */
export default async function CountryPage({
  params,
}: {
  params: Promise<CountryParams>;
}) {
  const { country } = await params;
  const c = getCountryBySlug(country);
  if (!c) notFound();

  const tz = TZ_BY_ISO2[c.iso2] ?? "UTC";
  const ccy = CCY_BY_ISO2[c.iso2] ?? "";
  const ex = EXTRAS[c.iso2];
  const diffH = hoursDiffFromSeoul(tz);
  const diffTxt =
    diffH === 0
      ? "시차 없음(동일)"
      : diffH > 0
      ? `한국보다 +${diffH}시간`
      : `한국보다 ${diffH}시간`;

  const faqs = [
    { q: "팁 문화는?", a: ex ? tipText(ex.tipping) : "업장/지역에 따라 상이." },
    {
      q: "결제는 카드 vs 현금?",
      a: ex
        ? payText(ex.payment)
        : "도시권은 카드 보편, 소규모 상점은 현금 요구 가능.",
    },
    {
      q: "응급전화 번호?",
      a: ex?.emergency?.general
        ? `긴급번호 ${ex.emergency.general} (지역별 세부 번호 상이 가능).`
        : "현지 안내문 확인.",
    },
    {
      q: "대중교통 팁",
      a:
        ex?.transport ??
        "대도시 대부분 교통카드/앱 사용 가능. 공항에서 구입/충전.",
    },
    {
      q: "통상 경비(10일, 항공 제외)",
      a: ex?.budget10d
        ? `${formatBudget(ex.budget10d)} (시즌/도시/취향에 따라 ±30%)`
        : "여행 스타일에 따라 편차가 큼.",
    },
    {
      q: "추천 관광지",
      a: ex?.topPlaces?.length
        ? ex.topPlaces.join(" · ")
        : "대표 관광지를 위주로 동선을 잡아보세요.",
    },
    {
      q: "추천 음식",
      a: ex?.foods?.length
        ? ex.foods.join(" · ")
        : "로컬 인기 메뉴를 시도해 보세요.",
    },
    {
      q: "유용한 앱",
      a: ex?.apps?.length
        ? ex.apps.join(" · ")
        : "현지 교통/배달/지도 앱을 준비하세요.",
    },
    {
      q: "기념품 추천",
      a: ex?.souvenirs?.length
        ? ex.souvenirs.join(" · ")
        : "로컬 간식/차/공예품이 무난합니다.",
    },
  ];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <section className="relative overflow-hidden rounded-3xl p-6">
        <div className="relative z-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-3xl font-semibold tracking-tight">
              <span className="mr-2">{flagEmoji(c.iso2)}</span>
              {c.nameKo}
              <span className="ml-2 text-base text-slate-500">{c.nameEn}</span>
            </div>
            <p className="mt-2 text-sm text-slate-600 mb-10">
              데이터 출처: IATA/정부/항공사/WorldStandards/Open-Meteo
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Chip icon="clock">{diffTxt}</Chip>
          <Chip icon="map">TZ: {tz}</Chip>
          {ccy && <Chip icon="currency">통화: {ccy}</Chip>}
        </div>
      </section>

      {/* 핵심 요약 */}
      <section className="mt-8 grid gap-4 sm:grid-cols-2">
        <GlassCard icon="passport" title="비자 요약" value={c.visaNoteKo} />
        <GlassCard
          icon="plug"
          title="전압·플러그"
          value={`${c.voltage}V / ${c.frequency}Hz · ${c.plugTypes.join(", ")}`}
        >
          <div className="mt-3 flex flex-wrap gap-3">
            {c.plugTypes.map((t) => (
              <PlugPhotos key={t} type={t} size={72} />
            ))}
          </div>
          <div
            role="note"
            className="mt-5 rounded-lg border-l-4 border-red-400 bg-red-50 p-3 text-xs leading-relaxed text-red-900"
          >
            드라이어·고데기가 <strong>프리볼트(100–240V)</strong>가 아니면
            사용을 피하세요. 어댑터는 <em>플러그 모양</em>만 바꿉니다.{" "}
            <span className="whitespace-nowrap">(변압기 아님)</span>
          </div>
        </GlassCard>
        <GlassCard icon="sim" title="eSIM 팁" value={c.esimNote} />
        <GlassCard icon="sun" title="기후 한줄 요약" value={c.climateNote} />
      </section>

      {/* 시차/현지 시각 · 환율 */}
      <section className="mt-4 grid gap-4 sm:grid-cols-2">
        <GlassCard icon="clock" title="시차/현지 시각" value={""}>
          {/* ✅ 클라이언트에서만 렌더 */}
          <ClientOnly><div className="mt-3">
            <LocalTime tz={tz} />
          </div>
          </ClientOnly>
        </GlassCard>

        <GlassCard
          icon="currency"
          title="환율"
          value={ccy ? `통화: ${ccy}` : "통화 정보 없음"}
        >
          {ccy ? (
            <div className="mt-2">
              <FxCard base={ccy} quote="KRW" />
            </div>
          ) : null}
          <div className="mt-2 text-[11px] text-slate-500">
            ※ 정보 제공용. 실제 결제 환율과 다를 수 있습니다.
          </div>
        </GlassCard>
      </section>

      {/* 월별 패킹 빠른 링크 */}
      <section className="mt-8">
        <div className="rounded-2xl bg-white/70 p-5 shadow-sm backdrop-blur ring-1 ring-slate-300/10">
          <PackingQuickLinks countrySlug={c.slug} />
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-10 rounded-2xl bg-white/70 p-5 shadow-sm backdrop-blur ring-1 ring-slate-300/10">
        <h2 className="text-lg font-semibold mt-3">자주 묻는 질문</h2>
        <div className="mt-5 space-y-3">
          {faqs.map(({ q, a }) => (
            <details
              key={q}
              className="group rounded-2xl bg-white/70 p-4 ring-1 ring-black/5 backdrop-blur open:shadow-sm mb-3   transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
                <span className="font-medium">{q}</span>
                <Svg
                  icon="chev"
                  className="h-4 w-4 transition-transform group-open:rotate-180"
                />
              </summary>
              <p className="mt-2 text-sm text-slate-700">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* 제휴 블록 */}
      <section className="mt-10 rounded-2xl bg-white/70 p-5 shadow-sm backdrop-blur ring-1 ring-slate-300/10">
        <h2 className="text-lg font-semibold mt-3">
          여행 준비 아이템
          <span className="ml-1 text-sm font-semibold text-slate-500">
            {"(제휴)"}
          </span>
        </h2>
        <div className="mt-5 mb-3">
          <AffiliateKit countrySlug={c.slug} />
        </div>
      </section>

      {/* CTA */}
      <section className="mt-10">
        <a
          href={`/start`}
          className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2 text-white shadow-sm transition hover:bg-sky-700"
        >
          <Svg icon="plane" className="h-4 w-4" />
          공항/날짜 선택하고 상세 확인하기
        </a>
      </section>

      {/* 출처/정책 */}
      <footer className="mt-12 text-xs text-slate-500">
        <p>※ 규정은 변동 가능성이 있어 출국 전 공식 안내를 확인하세요.</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>
            <a
              className="underline"
              href="https://www.iatatravelcentre.com/"
              target="_blank"
            >
              IATA Travel Centre
            </a>
          </li>
          <li>
            <a
              className="underline"
              href="https://www.worldstandards.eu/electricity/plugs-and-sockets/"
              target="_blank"
            >
              WorldStandards
            </a>
          </li>
          <li>
            <a
              className="underline"
              href="https://www.0404.go.kr/"
              target="_blank"
            >
              외교부 해외안전여행
            </a>
          </li>
          <li>
            <a
              className="underline"
              href="https://open-meteo.com/"
              target="_blank"
            >
              Open-Meteo
            </a>
          </li>
        </ul>
      </footer>

      {/* FAQ JSON-LD */}
      <Script
        id="faq-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </main>
  );
}

/* ---------- 프레젠테이션 컴포넌트 ---------- */
function GlassCard({
  icon,
  title,
  value,
  children,
}: {
  icon: IconKey;
  title: string;
  value: string;
  children?: ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-white/70 p-5 shadow-sm backdrop-blur ring-1 ring-slate-300/10">
      <div className="flex items-center gap-2 text-xs text-slate-600">
        <Svg icon={icon} className="h-4 w-4" />
        {title}
      </div>
      {value && (
        <div className="mt-3 whitespace-pre-line text-sm leading-relaxed">
          {value}
        </div>
      )}
      {children}
    </div>
  );
}
function Chip({ icon, children }: { icon: IconKey; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full shadow-sm bg-sky-100/80 px-3 py-1 text-xs text-slate-700 backdrop-blur">
      <Svg icon={icon} className="h-3.5 w-3.5" />
      {children}
    </span>
  );
}
type IconKey =
  | "clock"
  | "map"
  | "currency"
  | "passport"
  | "plug"
  | "sim"
  | "sun"
  | "plane"
  | "chev";
function Svg({ icon, className }: { icon: IconKey; className?: string }) {
  switch (icon) {
    case "clock":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden>
          <path
            d="M12 6v6l4 2"
            stroke="currentColor"
            strokeWidth="1.6"
            fill="none"
            strokeLinecap="round"
          />
          <circle
            cx="12"
            cy="12"
            r="9"
            stroke="currentColor"
            strokeWidth="1.6"
            fill="none"
          />
        </svg>
      );
    case "map":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden>
          <path
            d="M9 18l-6 3V6l6-3 6 3 6-3v15l-6 3-6-3z"
            stroke="currentColor"
            strokeWidth="1.6"
            fill="none"
          />
          <path d="M9 3v15M15 6v15" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      );
    case "currency":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden>
          <path
            d="M12 3v18M7 7h7a4 4 0 110 8H7"
            stroke="currentColor"
            strokeWidth="1.6"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      );
    case "passport":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden>
          <rect
            x="4"
            y="3"
            width="14"
            height="18"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.6"
            fill="none"
          />
          <path
            d="M8 8h6M8 12h6M8 16h4"
            stroke="currentColor"
            strokeWidth="1.6"
          />
        </svg>
      );
    case "plug":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden>
          <path
            d="M7 7h10v4a5 5 0 11-10 0V7z"
            stroke="currentColor"
            strokeWidth="1.6"
            fill="none"
          />
          <path
            d="M9 3v4M15 3v4"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      );
    case "sim":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden>
          <rect
            x="5"
            y="3"
            width="14"
            height="18"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.6"
            fill="none"
          />
          <path
            d="M9 9h6v6H9zM9 9v6M12 9v6M15 9v6"
            stroke="currentColor"
            strokeWidth="1.2"
          />
        </svg>
      );
    case "sun":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden>
          <circle
            cx="12"
            cy="12"
            r="4"
            stroke="currentColor"
            strokeWidth="1.6"
            fill="none"
          />
          <path
            d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      );
    case "plane":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden>
          <path
            d="M2 16l20-8-8 10-2 4-2-4-8-2z"
            stroke="currentColor"
            strokeWidth="1.6"
            fill="none"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "chev":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden>
          <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            strokeWidth="1.8"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      );
  }
}

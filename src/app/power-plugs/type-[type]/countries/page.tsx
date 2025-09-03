// src/app/power-plugs/type-[type]/countries/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BreadcrumbsJsonLd } from "@/lib/schema";

const TYPES = ["a", "c", "g"] as const;
type PlugType = (typeof TYPES)[number];
type TypeParams = { type: PlugType };
type PageProps = { params: Promise<TypeParams> };

type Row = {
  country: string;
  iso2: string;
  voltage: string;
  freq: string;
  href: string;
  types: readonly string[];
};

export function generateStaticParams(): TypeParams[] {
  return TYPES.map((type) => ({ type }));
}

export const metadata: Metadata = {
  title: "전원 플러그 타입별 국가 목록",
  description: "Type A/C/G 사용하는 국가와 전압·주파수 요약",
};

export default async function Page(
  { params }: { params: Promise<TypeParams> }
) {
  const { type: t } = await params;

  if (!t || !TYPES.includes(t)) {
    notFound();
  }
  const label = t.toUpperCase();

  const ALL: Row[] = [
    { country: "대한민국", iso2: "KR", voltage: "220V", freq: "60Hz", href: "/destinations/korea",           types: ["c","f"] },
    { country: "일본",     iso2: "JP", voltage: "100V", freq: "50/60Hz", href: "/destinations/japan",         types: ["a","b"] },
    { country: "중국",     iso2: "CN", voltage: "220V", freq: "50Hz",   href: "/destinations/china",         types: ["a","c","i"] },
    { country: "대만",     iso2: "TW", voltage: "110V", freq: "60Hz",   href: "/destinations/taiwan",        types: ["a","b"] },
    { country: "홍콩",     iso2: "HK", voltage: "220V", freq: "50Hz",   href: "/destinations/hong-kong",     types: ["g"] },
    { country: "태국",     iso2: "TH", voltage: "230V", freq: "50Hz",   href: "/destinations/thailand",      types: ["a","b","c","o"] },
    { country: "베트남",   iso2: "VN", voltage: "220V", freq: "50Hz",   href: "/destinations/vietnam",       types: ["a","c","f"] },
    { country: "필리핀",   iso2: "PH", voltage: "220V", freq: "60Hz",   href: "/destinations/philippines",   types: ["a","b","c"] },
    { country: "말레이시아", iso2:"MY", voltage: "240V", freq: "50Hz", href: "/destinations/malaysia",      types: ["g"] },
    { country: "싱가포르", iso2: "SG", voltage: "230V", freq: "50Hz",  href: "/destinations/singapore",     types: ["g"] },
    { country: "인도네시아", iso2:"ID", voltage: "230V", freq: "50Hz", href: "/destinations/indonesia",     types: ["c","f"] },
    { country: "미국",     iso2: "US", voltage: "120V", freq: "60Hz",  href: "/destinations/united-states", types: ["a","b"] },
    { country: "캐나다",   iso2: "CA", voltage: "120V", freq: "60Hz",  href: "/destinations/canada",        types: ["a","b"] },
    { country: "멕시코",   iso2: "MX", voltage: "127V", freq: "60Hz",  href: "/destinations/mexico",        types: ["a","b"] },
    { country: "영국",     iso2: "GB", voltage: "230V", freq: "50Hz",  href: "/destinations/united-kingdom",types: ["g"] },
    { country: "프랑스",   iso2: "FR", voltage: "230V", freq: "50Hz",  href: "/destinations/france",        types: ["c","e"] },
    { country: "독일",     iso2: "DE", voltage: "230V", freq: "50Hz",  href: "/destinations/germany",       types: ["c","f"] },
    { country: "이탈리아", iso2: "IT", voltage: "230V", freq: "50Hz",  href: "/destinations/italy",         types: ["c","f","l"] },
    { country: "스페인",   iso2: "ES", voltage: "230V", freq: "50Hz",  href: "/destinations/spain",         types: ["c","f"] },
    { country: "호주",     iso2: "AU", voltage: "230V", freq: "50Hz",  href: "/destinations/australia",     types: ["i"] },
  ];

  const rows = ALL.filter((r) => r.types.includes(t));

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <BreadcrumbsJsonLd
        parts={[
          { name: "Power Plugs", href: "/power-plugs" },
          { name: `Type {label}`, href: `/power-plugs/type-${t}/countries` },
        ]}
      />
      <h1 className="text-2xl font-bold">Type {label} 사용하는 나라</h1>
      <p className="text-sm text-gray-600 mt-1">변환 어댑터 필요 여부를 확인하세요.</p>

      <table className="w-full mt-6 text-sm">
        <thead>
          <tr className="text-left">
            <th>국가</th><th>ISO2</th><th>전압</th><th>주파수</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.iso2} className="border-t">
              <td><a className="underline" href={r.href}>{r.country}</a></td>
              <td>{r.iso2}</td>
              <td>{r.voltage}</td>
              <td>{r.freq}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

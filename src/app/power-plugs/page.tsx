// src/app/power-plugs/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbsJsonLd, PowerPlugsFAQJsonLd } from "@/lib/schema";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "전원 플러그 가이드: A/C/G 타입과 전압·주파수 요약",
  description:
    "해외 여행 시 필요한 전원 플러그 타입(A/C/G), 전압(110V/220–240V), 주파수(50/60Hz) 핵심 정리. 국가별 사용 타입으로 바로 이동하세요.",
  alternates: { canonical: "/power-plugs" },
  openGraph: {
    title: "전원 플러그 가이드",
    description:
      "플러그 타입 A/C/G 차이, 프리볼트 확인법, 국가별 타입 페이지 바로가기.",
    type: "website",
    url: "/power-plugs",
  },
};

const TYPES = [
  {
    code: "a",
    name: "Type A",
    pins: "평평한 2핀",
    regions: "미국, 캐나다, 멕시코, 일본, 대만, 필리핀(일부), 베트남(일부), 태국(일부)",
    href: "/power-plugs/type-a/countries",
  },
  {
    code: "b",
    name: "Type B",
    pins: "평평한 2핀 + 접지 1핀",
    regions: "미국, 캐나다, 멕시코, 일본(일부), 대만, 필리핀",
    href: "/power-plugs/type-b/countries",
  },
  {
    code: "c",
    name: "Type C",
    pins: "둥근 2핀(유로플러그)",
    regions: "프랑스, 스페인, 이탈리아, 독일(소켓 E/F 호환), 네덜란드, 포르투갈, 그리스, 터키, 모로코, 튀르키예, 베트남, 인도네시아, 대한민국(소켓 F에 호환)",
    href: "/power-plugs/type-c/countries",
  },
  {
    code: "d",
    name: "Type D",
    pins: "삼각형 3핀(구형 영국식)",
    regions: "인도, 네팔, 스리랑카, 방글라데시, 파키스탄, 몰디브",
    href: "/power-plugs/type-d/countries",
  },
  {
    code: "e",
    name: "Type E",
    pins: "둥근 2핀 + 소켓 접지핀",
    regions: "프랑스, 벨기에, 폴란드, 체코, 슬로바키아, 모로코, 튀니지, 알제리",
    href: "/power-plugs/type-e/countries",
  },
  {
    code: "f",
    name: "Type F",
    pins: "둥근 2핀(쇼코)",
    regions: "독일, 스페인, 네덜란드, 오스트리아, 스웨덴, 노르웨이, 핀란드, 러시아, 대한민국",
    href: "/power-plugs/type-f/countries",
  },
  {
    code: "g",
    name: "Type G",
    pins: "세모 3핀",
    regions: "영국, 아일랜드, 홍콩, 싱가포르, 말레이시아, 몰타, 아랍에미리트(UAE), 카타르, 쿠웨이트",
    href: "/power-plugs/type-g/countries",
  },
  {
    code: "h",
    name: "Type H",
    pins: "Y형 3핀(이스라엘)",
    regions: "이스라엘, 팔레스타인",
    href: "/power-plugs/type-h/countries",
  },
  {
    code: "i",
    name: "Type I",
    pins: "V형 2/3핀",
    regions: "호주, 뉴질랜드, 중국, 아르헨티나, 피지, 파푸아뉴기니",
    href: "/power-plugs/type-i/countries",
  },
  {
    code: "j",
    name: "Type J",
    pins: "3핀(스위스식)",
    regions: "스위스, 리히텐슈타인",
    href: "/power-plugs/type-j/countries",
  },
  {
    code: "k",
    name: "Type K",
    pins: "3핀(덴마크식)",
    regions: "덴마크, 그린란드, 페로제도",
    href: "/power-plugs/type-k/countries",
  },
  {
    code: "l",
    name: "Type L",
    pins: "일렬 3핀(이탈리아식)",
    regions: "이탈리아, 바티칸, 산마리노, 칠레(일부)",
    href: "/power-plugs/type-l/countries",
  },
  {
    code: "m",
    name: "Type M",
    pins: "대형 3핀(남아공식)",
    regions: "남아프리카공화국, 나미비아, 보츠와나, 레소토, 에스와티니",
    href: "/power-plugs/type-m/countries",
  },
  {
    code: "n",
    name: "Type N",
    pins: "3핀(브라질/남아공 신표준)",
    regions: "브라질, 남아프리카공화국(신표준 일부)",
    href: "/power-plugs/type-n/countries",
  },
  {
    code: "o",
    name: "Type O",
    pins: "3핀(태국 신표준)",
    regions: "태국",
    href: "/power-plugs/type-o/countries",
  },
] as const;

export default function Page() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      {/* JSON-LD */}
      <BreadcrumbsJsonLd parts={[{ name: "Power Plugs", href: "/power-plugs" }]} />
      <PowerPlugsFAQJsonLd />

      {/* 히어로 */}
      <header className="space-y-2">
        <h1 className="text-2xl font-bold">전원 플러그 가이드</h1>
        <p className="text-sm text-gray-600">
          해외에서 전자기기를 사용하려면 <strong>플러그 타입</strong> ·{" "}
          <strong>전압</strong> · <strong>주파수</strong>를 확인하세요.
          기기 어댑터에 <code>100–240V, 50/60Hz</code>가 표시되어 있으면
          보통은 <strong>플러그 어댑터</strong>만으로 충분합니다.
        </p>
      </header>

      {/* 빠른 이동: 타입 카드 */}
      <section className="mt-6">
        <h2 className="font-semibold mb-2">타입별 국가 목록 바로가기</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {TYPES.map((t) => (
            <Link
              key={t.code}
              href={t.href}
              className="border rounded-xl p-4 hover:bg-gray-50"
            >
              <div className="text-sm text-gray-500 mb-1">{t.name}</div>
              <div className="font-semibold">{t.pins}</div>
              <div className="text-xs text-gray-500 mt-1">{t.regions}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* 요약 표 */}
      <section className="mt-8">
        <h2 className="font-semibold mb-2">타입 요약</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left">
              <th className="py-2">타입</th>
              <th className="py-2">핀 형태</th>
              <th className="py-2">대표 지역</th>
              <th className="py-2">주의</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td>A</td>
              <td>평평한 2핀</td>
              <td>미국, 일본 등</td>
              <td>110/120V가 많음. 프리볼트 여부 확인</td>
            </tr>
            <tr className="border-t">
              <td>C</td>
              <td>둥근 2핀</td>
              <td>유럽 다수, 한국</td>
              <td>220–240V가 많음. 접지 필요 시 F/E 확인</td>
            </tr>
            <tr className="border-t">
              <td>G</td>
              <td>세모 3핀</td>
              <td>영국, 홍콩, 싱가포르</td>
              <td>스위치 내장 소켓 많음. 정격 전류 확인</td>
            </tr>
          </tbody>
        </table>
        <p className="text-xs text-gray-500 mt-2">
          *국가·호텔에 따라 예외가 있을 수 있습니다.
        </p>
      </section>

      {/* 팁 섹션 */}
      <section className="mt-8">
        <h2 className="font-semibold mb-2">여행자 팁</h2>
        <ul className="list-disc ml-5 text-sm space-y-1">
          <li>
            어댑터는 <strong>플러그 모양만 바꿔주는 장치</strong>입니다.
            <strong>변압기</strong>가 아니므로 프리볼트가 아닌 기기는 사용을 피하세요.
          </li>
          <li>
            노트북·폰 충전기는 대부분 프리볼트지만,{" "}
            <strong>드라이어·고데기</strong>는 예외가 많습니다.
          </li>
          <li>
            한국 C형 플러그는 일부 유럽·동남아에서 바로 맞지만,{" "}
            <strong>영국/홍콩/싱가포르(G형)</strong>는 별도 어댑터가 필수입니다.
          </li>
        </ul>
      </section>
    </main>
  );
}

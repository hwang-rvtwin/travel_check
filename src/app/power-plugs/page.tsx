// src/app/power-plugs/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import PlugPhotos from "@/components/PlugPhotos";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "전원 플러그 가이드",
  description: "A–O 타입을 동그란 배지로 직관적으로 확인하세요.",
  alternates: { canonical: "/power-plugs" },
};

const TYPES = [
  {
    code: "A",
    pins: "평평한 2핀",
    regions:
      "미국, 캐나다, 멕시코, 일본, 대만, 필리핀(일부), 베트남(일부), 태국(일부)",
    href: "/power-plugs/type-a/countries",
  },
  {
    code: "B",
    pins: "평평한 2핀 + 접지",
    regions: "미국, 캐나다, 멕시코, 일본(일부), 대만, 필리핀",
    href: "/power-plugs/type-b/countries",
  },
  {
    code: "C",
    pins: "둥근 2핀(유로)",
    regions:
      "프랑스·스페인·이탈리아·독일(소켓 E/F 호환), 네덜란드, 포르투갈, 그리스, 터키, 모로코, 튀르키예, 베트남, 인도네시아, 대한민국(소켓 F 호환)",
    href: "/power-plugs/type-c/countries",
  },
  {
    code: "D",
    pins: "삼각형 3핀",
    regions: "인도, 네팔, 스리랑카, 방글라데시, 파키스탄, 몰디브",
    href: "/power-pl러그/type-d/countries",
  },
  {
    code: "E",
    pins: "둥근 2핀 + 소켓 접지핀",
    regions: "프랑스, 벨기에, 폴란드, 체코, 슬로바키아, 모로코, 튀니지, 알제리",
    href: "/power-plugs/type-e/countries",
  },
  {
    code: "F",
    pins: "둥근 2핀(쇼코)",
    regions:
      "독일, 스페인, 네덜란드, 오스트리아, 스웨덴, 노르웨이, 핀란드, 북유럽 일부, 러시아, 대한민국",
    href: "/power-plugs/type-f/countries",
  },
  {
    code: "G",
    pins: "세모 3핀",
    regions:
      "영국, 아일랜드, 홍콩, 싱가포르, 말레이시아, 몰타, UAE, 카타르, 쿠웨이트",
    href: "/power-plugs/type-g/countries",
  },
  {
    code: "H",
    pins: "Y형 3핀",
    regions: "이스라엘, 팔레스타인",
    href: "/power-plugs/type-h/countries",
  },
  {
    code: "I",
    pins: "V형 2/3핀",
    regions: "호주, 뉴질랜드, 중국, 아르헨티나, 피지, 파푸아뉴기니",
    href: "/power-plugs/type-i/countries",
  },
  {
    code: "J",
    pins: "3핀(스위스)",
    regions: "스위스, 리히텐슈타인",
    href: "/power-plugs/type-j/countries",
  },
  {
    code: "K",
    pins: "3핀(덴마크)",
    regions: "덴마크, 그린란드, 페로제도",
    href: "/power-plugs/type-k/countries",
  },
  {
    code: "L",
    pins: "일렬 3핀(이탈리아)",
    regions: "이탈리아, 바티칸, 산마리노, 칠레(일부)",
    href: "/power-plugs/type-l/countries",
  },
  {
    code: "M",
    pins: "대형 3핀",
    regions: "남아프리카공화국, 나미비아, 보츠와나, 레소토, 에스와티니",
    href: "/power-plugs/type-m/countries",
  },
  {
    code: "N",
    pins: "3핀(브라질/남아공 신표준)",
    regions: "브라질, 남아프리카공화국(신표준 일부)",
    href: "/power-plugs/type-n/countries",
  },
  {
    code: "O",
    pins: "3핀(태국 신표준)",
    regions: "태국",
    href: "/power-plugs/type-o/countries",
  },
] as const;

export default function Page() {
  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-10">
      {/* 헤더 (그대로) */}
      <header className="mb-8">
        <h1 className="text-3pxl sm:text-3xl font-bold tracking-tight">
          전원 플러그 타입 가이드
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          해외에서 전자기기를 사용하려면 플러그타입 · 전압 · 주파수를
          확인하세요.
          <span className="block">
            <b>프리볼트(100–240V/50–60Hz)</b>가 표시되어 있으면 보통은 플러그
            어댑터만으로 충분합니다. <b>*드라이어/고데기는 예외가 많습니다.*</b>
          </span>
        </p>
      </header>

      {/* 핀 모양 범례 (그대로) */}
      <div className="md:col-span-4 lg:col-span-3 mb-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold ml-2 text-slate-800">
            핀 모양 범례
          </h2>
          {/* 타입요약 */}
          <ul className="mt-6 space-y-6 text-sm text-slate-700">
            <Legend
              icon={<PinsFlat />}
              label="평평한 2핀 (A/B)"
              note="A: 미국·캐나다·일본 / B: 북미 위주(접지 포함)"
              caution="110/120V 비중 높음 — 프리볼트 확인 필수"
            />
            <Legend
              icon={<PinsRound2 />}
              label="둥근 2핀 (C/E/F)"
              note="C: 유럽 다수·동남아 일부 / E·F: 주로 유럽 본토"
              caution="접지 필요 시 E/F 소켓을 권장"
            />
            <Legend
              icon={<PinsTriangle3 />}
              label="세모/삼각 3핀 (G/D)"
              note="G: 영국·홍콩·싱가포르 / D: 인도권"
              caution="멀티탭 사용 시 정격 전류(싱가포르 13A 등) 확인"
            />
            <Legend
              icon={<PinsSwiss3 />}
              label="스위스/일렬 3핀 (J/L)"
              note="J: 스위스 / L: 이탈리아"
              caution="같은 유럽이라도 호환 안 되는 경우 있음"
            />
            <Legend
              icon={<PinsV2 />}
              label="V형 2/3핀 (I)"
              note="호주·뉴질랜드·중국·아르헨티나 등"
              caution="I형이라도 접지 유무(2/3핀) 호환 차이 주의"
            />
          </ul>

          <div className="mt-5 rounded-xl bg-sky-50 p-5 text-sky-900 ring-1 ring-sky-200">
            <b className=" font-semibold ml-2">빠른 체크</b>
            <ul className="list-disc ml-5 mt-2 text-sm space-y-2">
              <li>
                어댑터는 <strong>플러그 모양만</strong> 바꿔주는 장치입니다.{" "}
                <strong>변압기 아님</strong>.
              </li>
              <li>
                프리볼트 표기 : <code>100–240V • 50/60Hz</code>
              </li>
              <li>
                노트북·폰 충전기는 대부분 프리볼트,{" "}
                <strong>드라이어·고데기</strong>는 예외 多.
              </li>
              <li>
                한국 C형은 일부 유럽·동남아에서 바로 맞지만,{" "}
                <strong>영국/홍콩/싱가포르(G형)</strong>는 별도 어댑터 필수.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 플러그 타입 그리드 */}
      <ul
        aria-label="플러그 타입"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {TYPES.map((t) => (
          <li key={t.code}>
            <article className="group relative h-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-black/0 transition duration-200">
              {/* 둥근 타입 배지 — PlugPhotos로 대체 */}
              <div className="mx-auto mb-5 h-28 w-28 overflow-hidden bg-white ring-1 ring-slate-200 shadow-md">
                <PlugPhotos
                  type={t.code}
                  size={96} // 배지 지름보다 살짝 크게, object-fit로 꽉 차게
                  variant="badge" // 배지 모드(이미지 한 장만)
                  showSocket={true} // 소켓 이미지는 숨김
                  className="h-full w-full object-cover" // 꽉 채우기
                />
              </div>

              {/* 플러그 타입 내용 */}
              <h2 className="text-center text-lg font-bold text-slate-900">
                Type {t.code}
              </h2>
              <p className="mt-2 text-center text-sm font-semibold text-sky-600">
                {t.pins}
              </p>

              {/* 액션 */}
              <div className="mt-6 flex justify-center">
                <Link
                  href={t.href}
                  className="inline-flex items-center gap-2 rounded-full bg-sky-600 px-2.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-sky-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                >
                  국가 목록
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden
                  >
                    <path d="M7 17L17 7M10 7h7v7" />
                  </svg>
                </Link>
              </div>

              <p className="mt-5 text-center text-sm text-slate-700">
                {t.regions}
              </p>
            </article>
          </li>
        ))}
      </ul>

      <p className="mt-8 text-center text-sm text-slate-500">
        * 지역·숙소에 따라 예외가 있을 수 있습니다. 멀티어댑터/듀얼전압 여부를
        함께 확인하세요.
      </p>
    </main>
  );
}

/* -------------------------- 프리젠테이션 컴포넌트 -------------------------- */

function Legend({
  icon,
  label,
  note,
  caution,
}: {
  icon: React.ReactNode;
  label: string;
  note?: string;
  caution?: string;
}) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 grid h-10 w-12 flex-none place-items-center rounded-md border border-slate-200 bg-white text-slate-700">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="font-medium text-slate-900">{label}</p>

        {/* 대표지역/특징 */}
        {note && (
          <p className="mt-1 flex items-start gap-2 text-[13px] leading-5 text-slate-700">
            <span
              className="mt-1 inline-block h-1.5 w-1.5 flex-none rounded-full bg-slate-600"
              aria-hidden
            />
            <span className="min-w-0">{note}</span>
          </p>
        )}

        {/* 주의사항 */}
        {caution && (
          <p className="mt-1 flex items-start gap-2 text-[13px] leading-5 text-red-700">
            <span
              className="mt-1 inline-block h-1.5 w-1.5 flex-none rounded-full bg-red-600"
              aria-hidden
            />
            <span className="min-w-0">{caution}</span>
          </p>
        )}
      </div>
    </li>
  );
}

function PinsFlat() {
  return (
    <svg viewBox="0 0 24 24" className="h-10 w-10" aria-hidden>
      <rect
        x="4"
        y="7"
        width="16"
        height="10"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />
      <rect x="9" y="10" width="2" height="4" fill="currentColor" />
      <rect x="13" y="10" width="2" height="4" fill="currentColor" />
    </svg>
  );
}
function PinsRound2() {
  return (
    <svg viewBox="0 0 24 24" className="h-10 w-10" aria-hidden>
      <rect
        x="4"
        y="7"
        width="16"
        height="10"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />
      <circle cx="10" cy="12" r="1.2" fill="currentColor" />
      <circle cx="14" cy="12" r="1.2" fill="currentColor" />
    </svg>
  );
}
function PinsTriangle3() {
  return (
    <svg viewBox="0 0 24 24" className="h-10 w-10" aria-hidden>
      <rect
        x="4"
        y="7"
        width="16"
        height="10"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />
      <path
        d="M8 13l4-4 4 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />
    </svg>
  );
}
function PinsSwiss3() {
  return (
    <svg viewBox="0 0 24 24" className="h-10 w-10" aria-hidden>
      <rect
        x="4"
        y="7"
        width="16"
        height="10"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />
      <path d="M9 9h6v6H9z" fill="none" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}
function PinsV2() {
  return (
    <svg viewBox="0 0 24 24" className="h-10 w-10" aria-hidden>
      <rect
        x="4"
        y="7"
        width="16"
        height="10"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />
      <path
        d="M9 10l3 4 3-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />
    </svg>
  );
}

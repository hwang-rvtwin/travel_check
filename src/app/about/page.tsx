// src/app/about/page.tsx
export const metadata = {
  title: "About | 출국 체크허브",
  description: "서비스 소개 및 제작 배경",
};

export default function AboutPage() {
  return (
    <div className="relative">
      <section className="mx-auto max-w-4xl px-4 pt-10 pb-12 sm:px-6 lg:px-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 text-sm text-slate-700">
          <span className="inline-block size-2 rounded-full bg-sky-500" />
          서비스 소개
        </div>

        <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
          출국 체크허브 소개
        </h1>

        <p className="mt-4 text-lg leading-7 text-slate-600">
          출국 전에 반복 검색해야 하는 핵심 정보(입국/비자, eSIM, 전압/플러그,
          수하물, 날씨)를 한 화면에서 확인할 수 있도록 만든 간단한 도구입니다.
          IATA/정부/항공사 공지를 기반으로 링크를 제공하고, Open-Meteo 기후/예보
          데이터로 여행 준비를 돕습니다.
        </p>
      </section>

      {/* 본문 카드 영역 */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="">
          {/* 섹션: 왜 만들었나요? */}
          <h2 className="text-lg font-semibold text-slate-900">
            왜 만들었나요?
          </h2>
          <ul className="mt-4 space-y-3">
            {[
              "나라마다 다른 비자/입국 규정 확인을 매번 새로 검색하는 번거로움",
              "플러그/전압/수하물 규정이 분산된 링크 구조",
              "14~16일 이내 예보와 월별 기후 평균을 함께 보고 짐을 준비하고 싶음",
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-700">
                <svg
                  className="mt-0.5 h-5 w-5 flex-none text-sky-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.78-10.72a.75.75 0 00-1.06-1.06L8.5 10.44 7.28 9.22a.75.75 0 10-1.06 1.06l1.75 1.75c.3.3.79.3 1.06 0l4.75-4.75z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="leading-7">{item}</span>
              </li>
            ))}
          </ul>

          {/* 구분선 */}
          <div className="my-6 h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

          {/* 섹션: 데이터 출처 */}
          <h2 className="text-lg font-semibold text-slate-900">데이터 출처</h2>
          <ul className="mt-4 space-y-3">
            {[
              "IATA Travel Centre, 각국 대사관/정부, 항공사 공식 페이지",
              "Open-Meteo(기후/예보), WorldStandards(전압/플러그)",
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-700">
                <svg
                  className="mt-0.5 h-4 w-4 flex-none text-indigo-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M12 3l9 4.5-9 4.5L3 7.5 12 3z" />
                  <path d="M12 12l9 4.5-9 4.5L3 16.5 12 12z" />
                </svg>
                <span className="leading-7">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

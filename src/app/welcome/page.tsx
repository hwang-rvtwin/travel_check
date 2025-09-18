// src/app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <main className="relative">
      <section className="mx-auto max-w-7xl px-4 pt-12 md:pt-16 ">
        <div className="grid items-center gap-10 md:grid-cols-[1.15fr,0.85fr]">
          <div>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight bg-gradient-to-r text-sky-600">
              체크허브<span className="text-black">에 대해</span>
            </h1>

            {/* key bullets */}
            <ul className="mt-10 mb-5 grid max-w-xl grid-cols-1 gap-2 text-sm text-slate-600 md:grid-cols-2">
              {[
                "정부·대사관·항공사 공식 문서 기반",
                "전원 플러그 규정 요약",
                "국가별 패킹 가이드",
                "PDF 파일 지원",
              ].map((t) => (
                <li key={t} className="inline-flex items-center gap-2">
                  <span className="inline-flex size-5 items-center justify-center rounded-full bg-white/90 text-xs text-sky-700 ring-2 ring-sky-200 dark:text-sky-300">
                    ✓
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ===== 체크허브가 필요한 이유 ===== */}
      <section className="mx-auto max-w-7xl mb-5">
        <ol className="grid gap-4 md:grid-cols-3">
          {[
            {
              t: "최신성",
              d: "입국 규정은 수시로 변경됩니다. 각국 공식 출처 함께 제시하고 요약해 드려요.",
            },
            {
              t: "정확성",
              d: "정부·대사관·IATA·항공사 문서를 교차 검증해 제공합니다.",
            },
            {
              t: "현실성",
              d: "여행 가방에 담는 현실적인 항목 위주로, 불필요한 사항을 줄였습니다.",
            },
          ].map((s) => (
            <li key={s.t} className="rounded-2xl bg-white/70 p-5">
              {/* 번호 배지 제거, 파란 원 아이콘 추가 */}
              <h3 className="flex items-center gap-2 font-semibold">
                <span
                  aria-hidden
                  className="inline-block size-2 rounded-full bg-sky-600"
                />
                {s.t}
              </h3>
              <p className="mt-1.5 text-sm text-slate-600">{s.d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ===== 페이지 이동 버튼 ===== */}
      <section className="mx-auto max-w-7xl px-4 py-10 bg-sky-50/80">
        <h2 className="mb-5 text-lg font-semibold md:text-xl">체크 가이드</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "월별 패킹",
              href: "/packing",
              desc: "옷·신발·겉옷·이달 체감 기온",
              icon: (
                <svg viewBox="0 0 24 24" className="size-5">
                  <path
                    d="M4 6h16M4 12h16M4 18h10"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              ),
            },
            {
              title: "전원 플러그",
              href: "/power-plugs",
              desc: "플러그 타입·전압·주파수",
              icon: (
                <svg viewBox="0 0 24 24" className="size-5">
                  <path
                    d="M9 5v6m6-6v6M7 11h10v4a5 5 0 0 1-10 0v-4Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
              ),
            },
            {
              title: "eSIM/통신",
              href: "/esim",
              desc: "여행 중 데이터 준비",
              icon: (
                <svg viewBox="0 0 24 24" className="size-5">
                  <path
                    d="M7 3h6l5 5v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M8 12h8M8 16h6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              ),
            },
          ].map((m) => (
            <Link
              key={m.title}
              href={m.href}
              className="group rounded-2xl bg-white/75 p-5 shadow-md backdrop-blur transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-xl border p-2 text-sky-600 ">
                  {m.icon}
                </div>
                <div>
                  <h3 className="font-semibold">{m.title}</h3>
                  <p className="mt-0.5 text-sm text-slate-600 ">{m.desc}</p>
                </div>
              </div>
              <div className="mt-4 text-xs text-slate-500">
                자세히 보기{" "}
                <span className="inline-block transition group-hover:translate-x-0.5">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== 출국 전 가이드 ===== */}
      <section className="mx-auto max-w-7xl px-4 py-5">
        <ol className="">
          {[
            { t: "여권/비자", d: "만료일 · ESTA/ETA · 비자 확인" },
            { t: "항공/수하물", d: "기내/위탁 · 리튬/액체 규정" },
            { t: "통신/금융", d: "eSIM/로밍 · 해외결제/현금" },
            { t: "건강/보험", d: "예방접종 · 여행자 보험 증서" },
            { t: "전원/플러그", d: "플러그 타입·전압 · 어댑터" },
            { t: "PDF 저장/공유", d: "체크 후 문서로 보관" },
          ].map((s, i) => (
            <li key={s.t} className="relative rounded-2xl p-5 pl-16">
              <span className="absolute left-5 top-5 inline-flex size-7 items-center justify-center rounded-full bg-sky-600 text-sm font-bold text-white">
                {i + 1}
              </span>
              <h3 className="font-semibold">{s.t}</h3>
              <p className="mt-1 text-sm text-zinc-600 dark:text-white/60">
                {s.d}
              </p>
              {/* flight path line */}
              {i < 5 && (
                <span
                  aria-hidden
                  className="absolute left-8 top-14 h-8 w-px"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(180deg, rgba(0,0,0,0.35) 0, rgba(0,0,0,0.35) 6px, transparent 6px, transparent 12px)",
                  }}
                />
              )}
            </li>
          ))}
        </ol>
      </section>

      {/* ===== Bottom ===== */}
      <section className="mx-auto max-w-7xl text-center bg-sky-50/80">
        <div className="overflow-hidden rounded-2xl p-10 backdrop-blur">
          <div className="grid items-center gap-6 md:grid-cols-[1.2fr,0.8fr]">
            <div>
              <h3 className="text-base font-semibold">
                필요한 것만 골라 한 번에 체크,
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                체크리스트를 PDF로 저장하고 공유하세요!
              </p>
              <div className="mt-6">
                <Link
                  href="/start"
                  className="rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-sky-700"
                >
                  체크리스트 만들기 →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

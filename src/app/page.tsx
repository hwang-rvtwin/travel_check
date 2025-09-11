// src/app/page.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

const SLIDES = [
  {
    src: "/slides/checkhub_preview.jpg",
    alt: "여행 체크",
  },
  {
    src: "/slides/monthly_packing_guide.jpg",
    alt: "패킹",
  },
];

export default function Home() {
  return (
    <main className="relative">
      <section className="mx-auto max-w-7xl px-4 pt-12 md:pt-16">
        <div className="grid items-center gap-10 md:grid-cols-[1.15fr,0.85fr]">
          {/* Title Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 text-sm text-slate-700">
              <span className="inline-block size-2 rounded-full bg-sky-500" />
              간편하게 출국 준비✈️
            </div>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight md:text-5xl">
              출국 체크리스트,
              <br />
              <span className="bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                비행 전 꼭 필요한 것만
              </span>
            </h1>
            <p className="mt-4 max-w-2xl text-sm text-slate-700 md:text-base ">
              목적지의 <b>비자·전원 플러그·패킹·eSIM</b>까지 한 번에 확인할 수
              있습니다.
            </p>
            <p className="max-w-2xl text-sm text-slate-700 md:text-base ">
              체크리스트를 <b>PDF로 저장</b>하고 공유하세요!
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/start"
                className="rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-sky-700"
              >
                시작하기 →
              </Link>
              <Link
                href="/destinations"
                className="rounded-xl px-5 py-3 text-sm font-medium text-slate-800 shadow-sm hover:bg-gray-50"
              >
                국가별 정보
              </Link>
            </div>
          </div>

          {/* FlightPlan Card */}
          <div className="overflow-hidden rounded-3xl bg-white/75 shadow-lg">
            <div className="flex items-center  justify-between border-b px-5 pt-5 py-3 text-xs text-slate-300 ">
              <div className="inline-flex items-center gap-2 font-medium text-slate-500">
                <span className="inline-flex size-6 items-center justify-center rounded-full bg-sky-100 ">
                  ✈️
                </span>
                {"You can't go abroad without CheckHub"}
              </div>
              <div className="text-slate-500">{"I'm done packing!"}</div>
            </div>

            {/* simple route + items */}
            <div className="grid gap-0 md:grid-cols-[1fr,1px,1fr] bg-gradient-to-t to-white via-white/80 from-sky-50 ">
              {/* route */}
              <div className="px-10 pb-10 pt-5">
                <div className="text-[11px] uppercase tracking-wide text-slate-500">
                  Route
                </div>
                <div className="mt-1 flex items-end gap-3">
                  <div className="text-xl font-black tracking-tight">
                    Departure
                  </div>
                  <svg viewBox="0 0 200 24" className="h-5 w-16 text-sky-600">
                    <line
                      x1="0"
                      y1="5"
                      x2="200"
                      y2="5"
                      stroke="currentColor"
                      strokeDasharray="15 5"
                      strokeWidth="4"
                    />
                  </svg>
                  <div className="text-xl font-black tracking-tight">
                    Arrival
                  </div>
                </div>

                {/* 자동 슬라이드 캐러셀 */}
                <div className="mt-5">
                  <AutoCarousel images={SLIDES} interval={6000} />
                </div>
              </div>
            </div>
          </div>
          {/*  */}
        </div>
      </section>
    </main>
  );
}

/* ========================================================================= */
function AutoCarousel({
  images,
  interval = 6000,
}: {
  images: { src: string; alt: string }[];
  interval?: number;
}) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const id = setInterval(
      () => setIdx((i) => (i + 1) % images.length),
      interval
    );
    return () => clearInterval(id);
  }, [images.length, interval]);

  const prev = () => setIdx((i) => (i - 1 + images.length) % images.length);
  const next = () => setIdx((i) => (i + 1) % images.length);

  return (
    <div className="relative overflow-hidden rounded-xl drop-shadow-lg">
      {/* 컨테이너는 relative + 명시적 높이 → fill 동작 */}
      <div className="relative h-56 w-full sm:h-96 md:h-[600px]">
        {images.map((img, i) => (
          <Image
            key={img.src}
            src={img.src}
            alt={img.alt}
            fill
            className={[
              "absolute inset-0 object-cover transition-opacity duration-700",
              i === idx ? "opacity-100" : "opacity-0",
            ].join(" ")}
            sizes="(min-width: 1024px) 800px, (min-width: 640px) 600px, 100vw"
            priority={i === 0}
          />
        ))}
      </div>

      {/* 좌우 컨트롤 */}
      <button
        type="button"
        aria-label="이전 슬라이드"
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/50 p-1 text-slate-700 shadow hover:bg-white/80"
      >
        <svg viewBox="0 0 24 24" className="size-4">
          <path
            d="M15 5l-7 7 7 7"
            stroke="currentColor"
            strokeWidth="1.8"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <button
        type="button"
        aria-label="다음 슬라이드"
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/50 p-1 text-slate-700 shadow hover:bg-white/80"
      >
        <svg viewBox="0 0 24 24" className="size-4">
          <path
            d="M9 5l7 7-7 7"
            stroke="currentColor"
            strokeWidth="1.8"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {/* 인디케이터 */}
      <div className="pointer-events-none absolute inset-x-0 bottom-2 flex justify-center gap-2">
        {images.map((_, i) => (
          <span
            key={i}
            className={[
              "h-2 w-2 rounded-full",
              i === idx ? "bg-slate-800/80" : "bg-white/70",
            ].join(" ")}
          />
        ))}
      </div>
    </div>
  );
}

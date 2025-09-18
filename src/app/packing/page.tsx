// src/app/packing/page.tsx
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { COUNTRIES } from "@/lib/countries";

type Country = { slug: string; nameKo: string; flag: string };
const MONTHS = Array.from({ length: 12 }, (_, i) => {
  const n = i + 1;
  return { num: n, slug: String(n).padStart(2, "0") };
});

export default function PackingIndexPage() {
  const [q, setQ] = useState("");
  const now = new Date();
  const currentMonth = now.getMonth() + 1;

  const list = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return COUNTRIES as Country[];
    return (COUNTRIES as Country[]).filter((c) =>
      (c.nameKo + c.slug).toLowerCase().includes(query)
    );
  }, [q]);

  return (
    <main className="relative">
      <div className="mx-auto max-w-6xl px-4 pb-12 pt-8">
        {/* Header */}
        <header className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              월별 패킹 가이드
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              국가 카드를 눌러 해당 <b>월</b>의 패킹 체크리스트로 바로
              이동하세요.
            </p>
          </div>
        </header>

        {/* Search */}
        <div className="rounded-2xl px-3 py-5 shadow-sm backdrop-blur">
          <label className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm">
            <svg viewBox="0 0 24 24" className="size-4 text-slate-500 ">
              <path
                d="M10.5 4a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13Zm10 16-5.5-5.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="국가 검색 ( 예: 대한민국, korea )"
              className="w-full bg-transparent rounded-xl px-3 py-2 text-sm outline-none ring-2 ring-gray-400 placeholder:text-gray-400 hover:ring-sky-500 focus:ring-sky-500 "
              aria-label="국가 검색"
            />
          </label>
        </div>

        {/* Country cards */}
        <section className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((c) => (
            <CountryCard key={c.slug} c={c} currentMonth={currentMonth} />
          ))}

          {list.length === 0 && (
            <div className="col-span-full rounded-2xl border p-8 text-center text-sm text-slate-500 ">
              검색 결과가 없습니다.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

/* -------------------- Sub Components -------------------- */

function CountryCard({
  c,
  currentMonth,
}: {
  c: Country;
  currentMonth: number;
}) {
  return (
    <section className="group rounded-2xl p-8 shadow-sm  hover:-translate-y-0.5 hover:shadow-md">
      {/* 카드 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex size-9 items-center justify-center rounded-full bg-sky-600 text-white">
            {c.flag}
          </span>
          <div>
            <h3 className="text-base font-semibold leading-tight">
              {c.nameKo}
            </h3>
            <div className="text-xs text-slate-500">{c.slug.toUpperCase()}</div>
          </div>
        </div>
        <div className="text-xs text-slate-400">현재 {currentMonth}월</div>
      </div>

      {/* 구분선 */}
      <div className="my-4 h-px w-full bg-slate-400" />

      {/* 월별 카드 그리드 (담백한 버튼) */}
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
        {MONTHS.map((m) => (
          <MonthTile
            key={m.slug}
            href={`/packing/${c.slug}/${m.slug}`}
            label={`${m.num}월`}
            isCurrent={m.num === currentMonth}
          />
        ))}
      </div>
    </section>
  );
}

function MonthTile({
  href,
  label,
  isCurrent,
}: {
  href: string;
  label: string;
  isCurrent?: boolean;
}) {
  return (
    <Link
      href={href}
      aria-label={`${label} 패킹으로 이동`}
      className={[
        "flex h-10 items-center justify-center rounded-xl shadow-sm text-sm transition",
        " ",
        isCurrent
          ? "border-slate-300 text-slate-900 font-semibold ring-sky-600 hover:bg-sky-100"
          : "text-slate-500 hover:bg-slate-100",
      ].join(" ")}
    >
      {label}
      
    </Link>
  );
}

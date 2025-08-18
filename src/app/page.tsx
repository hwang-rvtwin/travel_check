'use client';

import { useEffect, useMemo, useState } from 'react';

type VisaInfo = { summary: string; sources: { title: string; url: string }[] };
type ESIMDeal = { name: string; go: string };
type PowerInfo = { plugTypes: string[]; voltage: string; frequency: string; source: string };
type BaggageInfo = { guide: string; airlineLinks: { code: string; title: string; url: string }[] };
type ChecklistItem = { id: string; label: string; checked: boolean };

type ApiResponse = {
  country: string;
  passport: string;
  from: string; to: string;
  visa: VisaInfo;
  esim: { deals: ESIMDeal[] };
  power: PowerInfo;
  baggage: BaggageInfo;
  checklist: ChecklistItem[];
  updatedAt?: string | null;
};

export default function Home() {
  const [country, setCountry] = useState('JP');     // 목적지
  const [passport, setPassport] = useState('KR');   // 여권국가
  const [from, setFrom] = useState('');             // yyyy-mm-dd
  const [to, setTo] = useState('');
  const [data, setData] = useState<ApiResponse | null>(null);

  // 체크리스트 로컬 저장 키 (국가+여권+기간)
  const storageKey = useMemo(
    () => `tc_checklist_${country}_${passport}_${from}_${to}`,
    [country, passport, from, to]
  );

  // API 호출
  async function fetchData() {
    const params = new URLSearchParams({ country, passport, from, to });
    const res = await fetch(`/api/check?${params.toString()}`);
    if (!res.ok) { alert('알 수 없는 국가 코드입니다. (예: JP, SG)'); return; }
    const json = (await res.json()) as ApiResponse;

    // localStorage에 저장된 체크 상태가 있으면 덮어쓰기
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const savedMap = new Map<string, boolean>(JSON.parse(saved));
        json.checklist = json.checklist.map(item => ({
          ...item, checked: savedMap.get(item.id) ?? item.checked
        }));
      }
    } catch {}

    setData(json);
  }

  // 체크 상태 변경 + 저장
  function toggleCheck(id: string) {
    if (!data) return;
    const next = {
      ...data,
      checklist: data.checklist.map(it => it.id === id ? { ...it, checked: !it.checked } : it)
    };
    setData(next);
    // 저장 (id → checked 맵)
    const mapArr: [string, boolean][] = next.checklist.map(it => [it.id, it.checked]);
    localStorage.setItem(storageKey, JSON.stringify(mapArr));
  }

  // 링크 복사
  async function copyLink() {
    const url = new URL(window.location.href);
    url.searchParams.set('country', country);
    url.searchParams.set('passport', passport);
    if (from) url.searchParams.set('from', from);
    if (to) url.searchParams.set('to', to);
    await navigator.clipboard.writeText(url.toString());
    alert('링크를 복사했어요!');
  }

  // 인쇄(PDF 저장)
  function printPage() {
    window.print();
  }

  // 페이지 처음 열릴 때 URL 쿼리 복원
  useEffect(() => {
    const u = new URL(window.location.href);
    setCountry((u.searchParams.get('country') || 'JP').toUpperCase());
    setPassport((u.searchParams.get('passport') || 'KR').toUpperCase());
    setFrom(u.searchParams.get('from') || '');
    setTo(u.searchParams.get('to') || '');
  }, []);

  return (
    <main className="mx-auto max-w-4xl p-4">
      <header className="flex items-center justify-between py-2">
        <h1 className="text-xl font-bold">출국 체크허브 ✈️</h1>
        <div className="text-xs opacity-70">※ 본 요약은 참고용이며, 최종 규정은 항공사·출입국·대사관 공지를 따릅니다.</div>
      </header>

      {/* 검색 바 */}
      <section className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-5">
        <div className="sm:col-span-1">
          <label className="text-sm">목적지(ISO2)</label>
          <input value={country} onChange={e=>setCountry(e.target.value.toUpperCase())}
            placeholder="JP" className="w-full rounded border p-2"/>
        </div>
        <div className="sm:col-span-1">
          <label className="text-sm">여권국가</label>
          <input value={passport} onChange={e=>setPassport(e.target.value.toUpperCase())}
            placeholder="KR" className="w-full rounded border p-2"/>
        </div>
        <div className="sm:col-span-1">
          <label className="text-sm">출국일</label>
          <input type="date" value={from} onChange={e=>setFrom(e.target.value)} className="w-full rounded border p-2"/>
        </div>
        <div className="sm:col-span-1">
          <label className="text-sm">귀국일</label>
          <input type="date" value={to} onChange={e=>setTo(e.target.value)} className="w-full rounded border p-2"/>
        </div>
        <div className="sm:col-span-1 flex items-end">
          <button onClick={fetchData} className="w-full rounded bg-black px-3 py-2 text-white">조회</button>
        </div>
      </section>

      {/* 결과 */}
      {data && (
        <>
          <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* 입국/비자 */}
            <article className="rounded-2xl border p-4 shadow-sm">
              <h2 className="mb-2 text-lg font-semibold">입국 / 비자</h2>
              <p className="text-sm leading-relaxed">{data.visa.summary}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {data.visa.sources?.map((s, i) => (
                  <a key={i} className="text-sm text-blue-600 underline" href={s.url} target="_blank">{s.title}</a>
                ))}
              </div>
            </article>

            {/* eSIM */}
            <article className="rounded-2xl border p-4 shadow-sm">
              <h2 className="mb-2 text-lg font-semibold">eSIM</h2>
              <ul className="list-disc pl-5">
                {data.esim.deals.map((d, i) => (
                  <li key={i} className="text-sm">
                    <a className="text-blue-600 underline" href={d.go}>{d.name}</a>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-xs opacity-70">eSIM 제휴 링크가 사용될 수 있어요.</p>
            </article>

            {/* 전압/플러그 */}
            <article className="rounded-2xl border p-4 shadow-sm">
              <h2 className="mb-2 text-lg font-semibold">전압 / 플러그</h2>
              <p className="text-sm">플러그 타입: <b>{data.power.plugTypes.join(', ')}</b></p>
              <p className="text-sm">전압/주파수: <b>{data.power.voltage}</b>, <b>{data.power.frequency}</b></p>
              <a className="mt-2 inline-block text-sm text-blue-600 underline" href="https://www.worldstandards.eu/electricity/plug-voltage-by-country/" target="_blank">
                출처: WorldStandards
              </a>
            </article>

            {/* 수하물 */}
            <article className="rounded-2xl border p-4 shadow-sm">
              <h2 className="mb-2 text-lg font-semibold">수하물</h2>
              <p className="text-sm leading-relaxed">{data.baggage.guide}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {data.baggage.airlineLinks?.map((a, i) => (
                  <a key={i} className="text-sm text-blue-600 underline" href={a.url} target="_blank">
                    {a.title}
                  </a>
                ))}
              </div>
            </article>
          </section>

          {/* 체크리스트 */}
          <section className="mt-6 rounded-2xl border p-4 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-lg font-semibold">체크리스트</h2>
              <div className="flex gap-2">
                <button onClick={copyLink} className="rounded border px-3 py-1 text-sm">링크 복사</button>
                <button onClick={printPage} className="rounded border px-3 py-1 text-sm">인쇄 / PDF</button>
              </div>
            </div>
            <ul className="space-y-2">
              {data.checklist.map((c) => (
                <li key={c.id} className="flex items-center gap-3">
                  <input id={c.id} type="checkbox" checked={c.checked} onChange={()=>toggleCheck(c.id)} />
                  <label htmlFor={c.id} className="text-sm">{c.label}</label>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs opacity-70">업데이트: {data.updatedAt || '—'}</p>
          </section>
        </>
      )}
    </main>
  );
}

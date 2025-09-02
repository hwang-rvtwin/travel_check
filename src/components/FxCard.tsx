// src/components/FxCard.tsx  (전체 교체본)
'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

type FxState = 'idle' | 'loading' | 'ok' | 'error';

function isNum(x: unknown): x is number {
  return typeof x === 'number' && Number.isFinite(x);
}
function fmtKRW(ccy: string, rate: number) {
  const digits = rate >= 100 ? 0 : 2;
  return `1 ${ccy.toUpperCase()} ≈ ${rate.toLocaleString('ko-KR', { maximumFractionDigits: digits })}원`;
}

// 어떤 JSON이 와도 숫자 환율을 최대한 찾아내는 파서
function extractRate(j: unknown, quote: string): number | null {
  if (isNum(j)) return j;
  if (!j || typeof j !== 'object') return null;

  const o = j as Record<string, unknown>;
  const qUp = quote.toUpperCase();
  const qLo = quote.toLowerCase();

  // 1) 평범한 키들
  if (isNum(o.rate)) return o.rate;
  if (isNum(o.result)) return o.result;
  if (isNum(o.value)) return o.value;
  if (isNum(o.price)) return o.price;
  if (isNum(o.amount)) return o.amount;

  // 2) { data: { rate: number } }
  if (o.data && typeof o.data === 'object') {
    const dataObj = o.data as Record<string, unknown>;
    const dataRate = dataObj['rate'];
    if (isNum(dataRate)) return dataRate;
  }

  // 3) { KRW: 1320 } / { krw: 1320 }
  const upDirect = o[qUp];
  if (isNum(upDirect)) return upDirect as number;
  const loDirect = o[qLo];
  if (isNum(loDirect)) return loDirect as number;

  // 4) { rates: { KRW: 1320 } }
  if (o.rates && typeof o.rates === 'object') {
    const ratesObj = o.rates as Record<string, unknown>;
    const r = ratesObj[qUp] ?? ratesObj[qLo];
    if (isNum(r)) return r;
  }

  // 5) 한 단계 더 중첩
  for (const v of Object.values(o)) {
    if (v && typeof v === 'object') {
      const nested = extractRate(v, quote);
      if (isNum(nested)) return nested;
    }
  }
  return null;
}

// 업데이트 날짜 후보를 최대한 뽑아내기
function extractUpdatedAt(j: unknown): string | null {
  if (!j || typeof j !== 'object') return null;
  const o = j as Record<string, unknown>;

  const direct = o['updatedAt'] ?? o['date'] ?? o['last_update'] ?? o['last_updated'];
  if (typeof direct === 'string' && direct.length >= 8) return direct;

  // open.er-api: time_last_update_utc
  const tlu = o['time_last_update_utc'];
  if (typeof tlu === 'string' && tlu.length >= 8) return tlu;

  // { data: { date: "..." } }
  if (o.data && typeof o.data === 'object') {
    const d = (o.data as Record<string, unknown>)['date'];
    if (typeof d === 'string' && d.length >= 8) return d;
  }
  return null;
}

// 소스 도메인/라벨 추출
function labelFromUrl(url: string): string {
  if (url.startsWith('http')) {
    try { return new URL(url).hostname; } catch { /* noop */ }
  }
  return url.replace(/^https?:\/\//, '');
}

async function getJSON(url: string): Promise<unknown | null> {
  try {
    const r = await fetch(url, { cache: 'no-store' });
    if (!r.ok) return null;
    return (await r.json()) as unknown;
  } catch { return null; }
}

function pickString(o: unknown, key: string): string | null {
  if (o && typeof o === 'object') {
    const v = (o as Record<string, unknown>)[key];
    return typeof v === 'string' ? v : null;
  }
  return null;
}

export default function FxCard({ base, quote = 'KRW' }: { base: string; quote?: string }) {
  const [state, setState] = useState<FxState>('idle');
  const [rate, setRate] = useState<number | null>(null);
  const [meta, setMeta] = useState<{ source: string; asOf: string } | null>(null);

  // 현재 오리진(절대경로) + 상대경로 모두 시도
  const apiFxCandidates = useMemo(() => {
    if (typeof window === 'undefined') return ['/api/fx']; // SSR 안전
    const abs = `${window.location.origin}/api/fx`;
    return [abs, '/api/fx'];
  }, []);

  const load = useCallback(async () => {
    if (!base) return;
    setState('loading');

    // 1) 로컬 API 절대경로 → 상대경로 순서로 시도
    for (const p of apiFxCandidates) {
      const url = `${p}?base=${encodeURIComponent(base)}&quote=${encodeURIComponent(quote)}`;
      const j = await getJSON(url);
      const v = extractRate(j, quote);
      if (isNum(v)) {
        setRate(v);
        setState('ok');

        // 로컬 API가 source/updatedAt을 내려주면 사용, 아니면 라벨/오늘 날짜로 폴백
        const asOf = (extractUpdatedAt(j) ?? new Date().toISOString()).slice(0, 10);
        const src = pickString(j, 'source') ?? labelFromUrl(p);
        setMeta({ source: src, asOf });
        return;
      }
    }

    // 2) 외부 폴백 (3중)
    const urls = [
      `https://api.exchangerate.host/convert?from=${encodeURIComponent(base)}&to=${encodeURIComponent(quote)}`,
      `https://open.er-api.com/v6/latest/${encodeURIComponent(base)}`,
      `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${base.toLowerCase()}/${quote.toLowerCase()}.json`,
    ];
    for (const u of urls) {
      const j = await getJSON(u);
      const v = extractRate(j, quote);
      if (isNum(v)) {
        setRate(v);
        setState('ok');

        const asOf = (extractUpdatedAt(j) ?? new Date().toISOString()).slice(0, 10);
        const src = labelFromUrl(u);
        setMeta({ source: src, asOf });
        return;
      }
    }

    setState('error');
  }, [apiFxCandidates, base, quote]);

  useEffect(() => { void load(); }, [load]);

  if (!base) return <div className="text-sm">통화 정보 없음</div>;
  return (
    <div className="text-sm">
      {state === 'loading' && <span className="text-gray-500">환율 불러오는 중…</span>}
      {state === 'ok' && rate !== null && (
        <>
          <b>{fmtKRW(base, rate)}</b>
          {meta && (
            <p className="mt-1 text-[12px] text-gray-500">
              {meta.source} · {meta.asOf}
            </p>
          )}
        </>
      )}
      {state === 'error' && (
        <div className="flex items-center gap-2">
          <span>환율을 불러오지 못했습니다.</span>
          <button
            type="button"
            onClick={load}
            className="rounded-full border px-2 py-0.5 text-[11px] hover:bg-gray-50"
          >
            다시 시도
          </button>
        </div>
      )}
    </div>
  );
}

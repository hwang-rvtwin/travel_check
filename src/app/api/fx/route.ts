// src/app/api/fx/route.ts
export const runtime = 'nodejs';

import type { NextRequest } from 'next/server';

type FxPayload = {
  base: string;
  quote: string;
  rate: number;     // 1 base → quote
  inverse: number;  // 1 quote → base
  updated: string | null;
  source: string;
  note?: string;
};

function ok(body: FxPayload) {
  return new Response(JSON.stringify(body, null, 2), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      // 30분 캐시 + 1시간 SWR
      'cache-control': 'public, s-maxage=1800, stale-while-revalidate=3600'
    }
  });
}
function bad(msg: string, code = 502) {
  return new Response(JSON.stringify({ error: msg }), {
    status: code,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }
  });
}

async function fetchJSON(url: string) {
  const r = await fetch(url, { headers: { accept: 'application/json' } });
  const j = await r.json().catch(() => null);
  return { ok: r.ok, j };
}

async function getRate(base: string, quote: string) {
  // 1) exchangerate.host /latest
  {
    const url = `https://api.exchangerate.host/latest?base=${encodeURIComponent(base)}&symbols=${encodeURIComponent(quote)}`;
    const { ok, j } = await fetchJSON(url);
    const rate = j?.rates?.[quote];
    if (ok && typeof rate === 'number' && isFinite(rate)) {
      return { rate, updated: j?.date ?? null, source: 'exchangerate.host/latest' };
    }
  }
  // 2) exchangerate.host /convert
  {
    const url = `https://api.exchangerate.host/convert?from=${encodeURIComponent(base)}&to=${encodeURIComponent(quote)}`;
    const { ok, j } = await fetchJSON(url);
    const rate = j?.info?.rate ?? j?.result;
    if (ok && typeof rate === 'number' && isFinite(rate)) {
      return { rate, updated: j?.date ?? null, source: 'exchangerate.host/convert' };
    }
  }
  // 3) open.er-api.com
  {
    const url = `https://open.er-api.com/v6/latest/${encodeURIComponent(base)}`;
    const { ok, j } = await fetchJSON(url);
    const rate = j?.rates?.[quote];
    if (ok && typeof rate === 'number' && isFinite(rate)) {
      const updated = j?.time_last_update_utc ?? null;
      return { rate, updated, source: 'open.er-api.com' };
    }
  }
  throw new Error('no-rate');
}

export async function GET(req: NextRequest) {
  const u = new URL(req.url);
  const base = (u.searchParams.get('base') || 'KRW').toUpperCase();
  const quote = (u.searchParams.get('quote') || '').toUpperCase();
  if (!quote) return bad('quote required', 400);

  if (base === quote) {
    const payload: FxPayload = {
      base, quote, rate: 1, inverse: 1, updated: new Date().toISOString(), source: 'self', note: 'base equals quote'
    };
    return ok(payload);
  }

  try {
    const { rate, updated, source } = await getRate(base, quote);
    const payload: FxPayload = { base, quote, rate, inverse: 1 / rate, updated, source };
    return ok(payload);
  } catch {
    return bad('fx fetch failed', 502);
  }
}

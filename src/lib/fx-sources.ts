const IS_DEV = process.env.NODE_ENV !== 'production';

type FxSource = 'exchangerate.host' | 'frankfurter.app' | 'er-api';
export interface FxResult { rate: number; updated: string | null; source: FxSource; }

function fetchFx(url: string) {
  return fetch(url, IS_DEV ? { cache: 'no-store' } : { next: { revalidate: 3600 } });
}

async function fromExchangerateHost(base: string, quote: string): Promise<FxResult | null> {
  const u = `https://api.exchangerate.host/convert?from=${encodeURIComponent(base)}&to=${encodeURIComponent(quote)}`;
  const r = await fetchFx(u); if (!r.ok) return null;
  const j = await r.json() as { info?: { rate?: number }, result?: number, date?: string };
  const rate = typeof j?.info?.rate === 'number' ? j.info.rate : (typeof j?.result === 'number' ? j.result : null);
  return (typeof rate === 'number' && Number.isFinite(rate)) ? { rate, updated: j?.date ?? null, source: 'exchangerate.host' } : null;
}
async function fromFrankfurter(base: string, quote: string): Promise<FxResult | null> {
  const u = `https://api.frankfurter.app/latest?from=${encodeURIComponent(base)}&to=${encodeURIComponent(quote)}`;
  const r = await fetchFx(u); if (!r.ok) return null;
  const j = await r.json() as { date?: string, rates?: Record<string, number> };
  const rate = j?.rates?.[quote.toUpperCase()];
  return (typeof rate === 'number') ? { rate, updated: j?.date ?? null, source: 'frankfurter.app' } : null;
}
async function fromERAPI(base: string, quote: string): Promise<FxResult | null> {
  const u = `https://open.er-api.com/v6/latest/${encodeURIComponent(base)}`;
  const r = await fetchFx(u); if (!r.ok) return null;
  const j = await r.json() as { time_last_update_utc?: string, rates?: Record<string, number> };
  const rate = j?.rates?.[quote.toUpperCase()];
  return (typeof rate === 'number') ? { rate, updated: j?.time_last_update_utc ?? null, source: 'er-api' } : null;
}

export async function getFx(base: string, quote: string): Promise<FxResult | null> {
  const b = base.toUpperCase(), q = quote.toUpperCase();
  if (b === q) return { rate: 1, updated: new Date().toISOString(), source: 'exchangerate.host' };
  for (const fn of [fromExchangerateHost, fromFrankfurter, fromERAPI]) {
    try { const out = await fn(b, q); if (out) return out; } catch {}
  }
  return null;
}

export function formatFxKRW(ccy: string, rate: number) {
  const digits = rate >= 100 ? 0 : 2;
  return `1 ${ccy.toUpperCase()} ≈ ${rate.toLocaleString('ko-KR', { maximumFractionDigits: digits })}원`;
}

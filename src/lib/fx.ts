// src/lib/fx.ts
const IS_DEV = process.env.NODE_ENV !== 'production';

// 공통 fetch 옵션: 개발에선 매번 새로, 프로덕션은 1시간 캐시
function fetchFx(url: string) {
  return fetch(
    url,
    IS_DEV ? { cache: 'no-store' } : { next: { revalidate: 3600 } }
  );
}

// 1) exchangerate.host (기본)
async function fromExchangerateHost(ccy: string): Promise<number | null> {
  const url = `https://api.exchangerate.host/latest?base=${encodeURIComponent(ccy)}&symbols=KRW`;
  const res = await fetchFx(url);
  if (!res.ok) return null;
  const j = (await res.json()) as { rates?: { KRW?: number } };
  return typeof j?.rates?.KRW === 'number' ? j.rates.KRW : null;
}

// 2) frankfurter.app (백업)
async function fromFrankfurter(ccy: string): Promise<number | null> {
  const url = `https://api.frankfurter.app/latest?from=${encodeURIComponent(ccy)}&to=KRW`;
  const res = await fetchFx(url);
  if (!res.ok) return null;
  const j = (await res.json()) as { rates?: { KRW?: number } };
  return typeof j?.rates?.KRW === 'number' ? j.rates.KRW : null;
}

// 3) open.er-api.com (백업2)
async function fromERAPI(ccy: string): Promise<number | null> {
  const url = `https://open.er-api.com/v6/latest/${encodeURIComponent(ccy)}`;
  const res = await fetchFx(url);
  if (!res.ok) return null;
  const j = (await res.json()) as { rates?: Record<string, number> };
  const v = j?.rates?.KRW;
  return typeof v === 'number' ? v : null;
}

/** 1 {ccy} ≈ X KRW 를 반환. 실패 시 null */
export async function fetchKrwPer1(ccy: string): Promise<number | null> {
  if (!ccy) return null;
  if (ccy.toUpperCase() === 'KRW') return 1;
  const chain = [fromExchangerateHost, fromFrankfurter, fromERAPI];
  for (const fn of chain) {
    try {
      const v = await fn(ccy.toUpperCase());
      if (typeof v === 'number' && Number.isFinite(v)) return v;
    } catch (_) {
      // ignore and try next
    }
  }
  return null;
}

/** 표시용 포맷 */
export function formatFxKRW(ccy: string, rate: number): string {
  // 100 이상 땐 소수 0, 그 외 2자리
  const digits = rate >= 100 ? 0 : 2;
  const pretty = rate.toLocaleString('ko-KR', { maximumFractionDigits: digits });
  return `1 ${ccy.toUpperCase()} ≈ ${pretty}원`;
}

// src/app/api/climate/route.ts
export const runtime = 'nodejs';

import type { NextRequest } from 'next/server';

function round(n: number, precision = 2) {
  const p = Math.pow(10, precision);
  return Math.round(n * p) / p;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = Number(searchParams.get('lat'));
  const lon = Number(searchParams.get('lon'));
  const precision = Number(searchParams.get('precision') ?? 2); // 캐시 적중률 ↑

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return new Response(JSON.stringify({ error: 'invalid lat/lon' }), { status: 400 });
  }

  // 캐시 키 안정화를 위해 좌표를 반올림(≈ 1~3km 수준)
  const latR = round(lat, precision);
  const lonR = round(lon, precision);

  const u = new URL('https://archive-api.open-meteo.com/v1/archive');
  u.searchParams.set('latitude', String(latR));
  u.searchParams.set('longitude', String(lonR));
  u.searchParams.set('start_date', '1991-01-01');
  u.searchParams.set('end_date', '2020-12-31');
  // u.searchParams.set('models', 'ERA5'); // ❌ 400 원인 → 사용하지 않음
  u.searchParams.set('daily', 'temperature_2m_max,temperature_2m_min');
  u.searchParams.set('timezone', 'auto');

  try {
    const r = await fetch(u.toString(), { headers: { accept: 'application/json' } });
    const json = await r.json().catch(() => null);

    if (!r.ok || !json?.daily?.time?.length) {
      const reason = json?.reason || json?.error || r.statusText || 'fetch-failed';
      return new Response(
        JSON.stringify({ monthly: null, note: String(reason) }),
        {
          status: 200, // 프론트는 조용히 넘어가도록 200 + note
          headers: {
            'content-type': 'application/json',
            // 짧은 기간이라도 캐시 (실패 응답은 짧게)
            'cache-control': 'public, s-maxage=3600, stale-while-revalidate=86400'
          }
        }
      );
    }

    const d: { time: string[]; temperature_2m_max: number[]; temperature_2m_min: number[] } = json.daily;

    // 12개월 누적 → 평균
    const sumMax = new Array(12).fill(0);
    const sumMin = new Array(12).fill(0);
    const cnt = new Array(12).fill(0);

    for (let i = 0; i < d.time.length; i++) {
      const m = new Date(d.time[i]).getMonth(); // 0~11
      const tmax = d.temperature_2m_max[i];
      const tmin = d.temperature_2m_min[i];
      if (Number.isFinite(tmax)) sumMax[m] += tmax;
      if (Number.isFinite(tmin)) sumMin[m] += tmin;
      cnt[m] += 1;
    }

    const avgMax = sumMax.map((s, i) => (cnt[i] ? s / cnt[i] : NaN));
    const avgMin = sumMin.map((s, i) => (cnt[i] ? s / cnt[i] : NaN));
    const payload = {
      monthly: {
        time: Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')),
        tmax: avgMax,
        tmin: avgMin
      },
      note: null
    };

    // ✅ 장기 캐시 (월별 평년은 변하지 않음)
    return new Response(JSON.stringify(payload), {
      headers: {
        'content-type': 'application/json; charset=utf-8',
        // Vercel/프록시 캐시: 30일 + SWR 1년
        'cache-control': 'public, s-maxage=2592000, stale-while-revalidate=31536000',
        // 캐시 키가 URL로 결정되므로 좌표 반올림이 중요합니다.
      }
    });
  } catch {
    return new Response(
      JSON.stringify({ monthly: null, note: 'fetch-error' }),
      {
        headers: {
          'content-type': 'application/json',
          'cache-control': 'public, s-maxage=3600, stale-while-revalidate=86400'
        }
      }
    );
  }
}

// src/app/api/tz/route.ts
export const runtime = 'nodejs';

import type { NextRequest } from 'next/server';

function ok(body: unknown) {
  return new Response(JSON.stringify(body, null, 2), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      // 타임존은 거의 변하지 않으므로 길게 캐시
      'cache-control': 'public, s-maxage=2592000, stale-while-revalidate=31536000'
    }
  });
}
function bad(msg: string, code = 400) {
  return new Response(JSON.stringify({ error: msg }), {
    status: code,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }
  });
}

export async function GET(req: NextRequest) {
  const u = new URL(req.url);
  const lat = Number(u.searchParams.get('lat'));
  const lon = Number(u.searchParams.get('lon'));
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return bad('lat/lon required');

  const api = new URL('https://api.open-meteo.com/v1/forecast');
  api.searchParams.set('latitude', String(lat));
  api.searchParams.set('longitude', String(lon));
  api.searchParams.set('forecast_days', '1');
  api.searchParams.set('current', 'is_day'); // 최소 쿼리
  api.searchParams.set('timezone', 'auto');

  try {
    const r = await fetch(api.toString(), { headers: { accept: 'application/json' } });
    const j = await r.json().catch(() => null);
    if (!r.ok || !j?.timezone) return bad('tz lookup failed', 502);
    return ok({
      timezone: j.timezone as string,
      timezone_abbreviation: j.timezone_abbreviation ?? null,
      utc_offset_seconds: j.utc_offset_seconds ?? null
    });
  } catch {
    return bad('tz fetch error', 502);
  }
}

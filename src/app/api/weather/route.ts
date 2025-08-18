// src/app/api/weather/route.ts
export const runtime = 'nodejs';

function fmt(d: string) { return d.split('T')[0]; }
function daysAhead(dateStr: string) {
  const today = new Date();
  const start = new Date(dateStr);
  const ms = start.setHours(0,0,0,0) - new Date(today.setHours(0,0,0,0)).getTime();
  return Math.floor(ms / 86400000);
}

export async function GET(req: Request) {
  const u = new URL(req.url);
  const lat = u.searchParams.get('lat');
  const lon = u.searchParams.get('lon');
  const from = u.searchParams.get('from');
  const to = u.searchParams.get('to');

  if (!lat || !lon || !from || !to) {
    return new Response(JSON.stringify({ error: 'lat/lon/from/to required' }), { status: 400 });
  }

  const lead = daysAhead(from);
  if (lead > 16) {
    // 예보 제공 범위를 넘은 경우: 친절한 노트와 함께 빈 daily 반환
    return new Response(JSON.stringify({
      daily: null,
      note: 'beyond-range' // 출발일이 너무 멀어서 예보 제공 불가
    }), { headers: { 'content-type': 'application/json' }});
  }

  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.searchParams.set('latitude', lat);
  url.searchParams.set('longitude', lon);
  url.searchParams.set('daily', 'temperature_2m_max,temperature_2m_min,precipitation_probability_max');
  url.searchParams.set('timezone', 'auto');
  url.searchParams.set('start_date', fmt(from));
  url.searchParams.set('end_date', fmt(to));

  try {
    const r = await fetch(url.toString(), { headers: { accept: 'application/json' } });
    if (!r.ok) {
      return new Response(JSON.stringify({ daily: null, note: 'fetch-failed' }), { headers: { 'content-type': 'application/json' }});
    }
    const j = await r.json();
    return new Response(JSON.stringify({ daily: j.daily ?? null, note: j.daily ? null : 'no-data' }),
      { headers: { 'content-type': 'application/json' }});
  } catch {
    return new Response(JSON.stringify({ daily: null, note: 'fetch-error' }), { headers: { 'content-type': 'application/json' }});
  }
}

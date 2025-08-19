// src/app/api/weather/route.ts
export const runtime = 'nodejs';

function startOfDay(d: Date) { d.setHours(0,0,0,0); return d; }
function fmt(d: Date) { return d.toISOString().slice(0,10); }
function parseYMD(s: string) {
  const [y,m,dd] = s.split('-').map(Number);
  return startOfDay(new Date(y, (m||1)-1, dd||1));
}
function daysAheadFromToday(dateStr: string) {
  const today = startOfDay(new Date());
  const start = parseYMD(dateStr);
  return Math.floor((start.getTime() - today.getTime()) / 86400000);
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

  const latNum = Number(lat), lonNum = Number(lon);
  if (!Number.isFinite(latNum) || !Number.isFinite(lonNum)) {
    return new Response(JSON.stringify({ error: 'invalid lat/lon' }), { status: 400 });
  }

  // 1) 너무 먼 미래면 예보 대신 기후평년으로
  const lead = daysAheadFromToday(from);
  if (lead > 16) {
    return new Response(JSON.stringify({ daily: null, note: 'beyond-range' }),
      { headers: { 'content-type': 'application/json' } });
  }

  // 2) 범위 보정: start>=오늘, end>=start, 최대 16일
  const today = startOfDay(new Date());
  let start = parseYMD(from);
  let end = parseYMD(to);
  if (start < today) start = new Date(today);
  if (end < start) end = new Date(start);
  const maxEnd = new Date(start); maxEnd.setDate(maxEnd.getDate() + 16);
  if (end > maxEnd) end = maxEnd;

  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.searchParams.set('latitude', String(latNum));
  url.searchParams.set('longitude', String(lonNum));
  url.searchParams.set('daily', 'temperature_2m_max,temperature_2m_min,precipitation_probability_max');
  url.searchParams.set('timezone', 'auto');
  url.searchParams.set('start_date', fmt(start));
  url.searchParams.set('end_date', fmt(end));

  try {
    const r = await fetch(url.toString(), { headers: { accept: 'application/json' } });
    if (!r.ok) {
      return new Response(JSON.stringify({ daily: null, note: `fetch-failed-${r.status}` }),
        { headers: { 'content-type': 'application/json' } });
    }
    const j = await r.json();
    return new Response(JSON.stringify({ daily: j.daily ?? null, note: j.daily ? null : 'no-data' }),
      { headers: { 'content-type': 'application/json' } });
  } catch {
    return new Response(JSON.stringify({ daily: null, note: 'fetch-error' }),
      { headers: { 'content-type': 'application/json' } });
  }
}

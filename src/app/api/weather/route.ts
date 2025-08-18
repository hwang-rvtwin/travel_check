// src/app/api/weather/route.ts
export const runtime = "nodejs";

function fmt(d: string) { return d.split("T")[0]; }

export async function GET(req: Request) {
  const u = new URL(req.url);
  const lat = u.searchParams.get("lat");
  const lon = u.searchParams.get("lon");
  const from = u.searchParams.get("from");
  const to = u.searchParams.get("to");
  if (!lat || !lon || !from || !to) {
    return new Response(JSON.stringify({ error: "lat/lon/from/to required" }), { status: 400 });
  }

  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", lat);
  url.searchParams.set("longitude", lon);
  url.searchParams.set("daily", "temperature_2m_max,temperature_2m_min,precipitation_probability_max");
  url.searchParams.set("timezone", "auto");
  url.searchParams.set("start_date", fmt(from));
  url.searchParams.set("end_date", fmt(to));

  const r = await fetch(url.toString(), { headers: { "accept": "application/json" }});
  const j = await r.json();
  return new Response(JSON.stringify({
    daily: j.daily  // {time[], temperature_2m_max[], temperature_2m_min[], precipitation_probability_max[]}
  }), { headers: { "content-type":"application/json" }});
}

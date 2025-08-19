// src/app/api/visa/route.ts
export const runtime = 'nodejs';

import { NextRequest } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

type VisaRecord = {
  status: string;                 // e.g., "visa-free", "VWP-ESTA", "e-visa/voa"
  max_stay_days: number;          // 0 if N/A
  conditions?: string[];
  notes?: string;
  sources?: string[];
};
type Snapshot = {
  updated_at: string;
  passport: string;               // default passport code in file (e.g., "KR")
  [key: string]: any;
};

function ok(body: unknown, cache = true) {
  return new Response(JSON.stringify(body, null, 2), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      // 스냅샷은 자주 바뀌지 않음: 7일 캐시 + 30일 SWR
      'cache-control': cache
        ? 'public, s-maxage=604800, stale-while-revalidate=2592000'
        : 'no-store'
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
  const passport = (u.searchParams.get('passport') || '').toUpperCase();
  const country  = (u.searchParams.get('country')  || '').toUpperCase();

  if (!passport || !country) return bad('passport and country required');

  try {
    const file = path.join(process.cwd(), 'public', 'data', 'visa_snapshot.json');
    const raw = await fs.readFile(file, 'utf-8');
    const snap = JSON.parse(raw) as Snapshot;

    const key = `${passport}-${country}`;
    const rec = snap[key] as VisaRecord | undefined;

    if (!rec) return ok({ found: false, updated_at: snap.updated_at, passport, country, record: null });

    return ok({
      found: true,
      updated_at: snap.updated_at,
      passport,
      country,
      record: rec
    });
  } catch (e) {
    return bad('snapshot not available', 500);
  }
}

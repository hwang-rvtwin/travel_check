// src/app/api/visa/route.ts
export const runtime = 'nodejs';

import { NextRequest } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

type VisaRecord = {
  status: string;                 // "visa-free" | "VWP-ESTA" | "e-visa/voa" | ...
  max_stay_days: number;          // 0 if N/A
  conditions?: string[];
  notes?: string;
  sources?: string[];
};

// 스냅샷: 메타 필드 + "KR-JP" 같은 키만 VisaRecord를 갖도록 타입화(❌ any 사용 안 함)
type Snapshot = {
  updated_at: string;
  passport: string;
} & {
  [K in `${string}-${string}`]?: VisaRecord;
};

function ok(body: unknown, cache = true) {
  return new Response(JSON.stringify(body, null, 2), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      // 스냅샷은 자주 바뀌지 않음: 7일 캐시 + 30일 SWR
      'cache-control': cache
        ? 'public, s-maxage=604800, stale-while-revalidate=2592000'
        : 'no-store',
    },
  });
}

function bad(msg: string, code = 400) {
  return new Response(JSON.stringify({ error: msg }), {
    status: code,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}

export async function GET(req: NextRequest) {
  const u = new URL(req.url);
  const passport = (u.searchParams.get('passport') || '').toUpperCase();
  const country = (u.searchParams.get('country') || '').toUpperCase();

  if (!passport || !country) return bad('passport and country required');

  try {
    const file = path.join(process.cwd(), 'public', 'data', 'visa_snapshot.json');
    const raw = await fs.readFile(file, 'utf-8');

    const snapUnknown: unknown = JSON.parse(raw);
    // 최소 검증
    if (
      typeof snapUnknown !== 'object' ||
      snapUnknown === null ||
      typeof (snapUnknown as { updated_at?: unknown }).updated_at !== 'string' ||
      typeof (snapUnknown as { passport?: unknown }).passport !== 'string'
    ) {
      return bad('invalid snapshot format', 500);
    }
    const snap = snapUnknown as Snapshot;

    const key = `${passport}-${country}` as `${string}-${string}`;
    const rec = snap[key];

    if (!rec) {
      return ok({
        found: false,
        updated_at: snap.updated_at,
        passport,
        country,
        record: null,
      });
    }

    return ok({
      found: true,
      updated_at: snap.updated_at,
      passport,
      country,
      record: rec,
    });
  } catch {
    // 미사용 변수 경고 방지: 파라미터 없이 catch
    return bad('snapshot not available', 500);
  }
}

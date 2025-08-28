// src/app/api/fx/route.ts
export const runtime = 'nodejs';

import { NextResponse, type NextRequest } from 'next/server';
import { getFx } from '@/lib/fx-sources';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const base = (searchParams.get('base') ?? 'USD').toUpperCase();
  const quote = (searchParams.get('quote') ?? 'KRW').toUpperCase();

  const fx = await getFx(base, quote);
  if (!fx) return NextResponse.json({ ok: false, error: 'unavailable' }, { status: 502 });

  return NextResponse.json({ ok: true, base, quote, rate: fx.rate, updated: fx.updated, source: fx.source });
}

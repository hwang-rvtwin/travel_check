// src/app/go/coupang/route.ts
export const runtime = 'nodejs';

import { NextRequest } from 'next/server';
import { GO_MAP } from '../config';             // <-- 상대경로 주의
import { COUPANG_SLUGS } from '@/data/affiliates';

function buildSubId(u: URL) {
  const parts = [
    u.searchParams.get('country') || '',
    u.searchParams.get('city') || '',
    u.searchParams.get('from') || '',
    u.searchParams.get('to') || '',
    u.searchParams.get('placement') || '',
  ].filter(Boolean);
  return parts.join('|').slice(0, 100);
}

function appendQuery(raw: string, key: string, val: string) {
  try {
    const url = new URL(raw);
    // coupa.ng 단축 도메인은 쿼리 부착이 막힐 수 있어 그대로 반환
    if (/coupa\.ng$/i.test(url.hostname)) return raw;
    url.searchParams.set(key, val);
    return url.toString();
  } catch {
    return raw;
  }
}

export async function GET(req: NextRequest) {
  // 고정 벤더
  const vendor = GO_MAP['coupang'];
  if (!vendor) return new Response('Unknown vendor', { status: 404 });

  const inUrl = new URL(req.url);
  const sub = buildSubId(inUrl);

  const urlParam = inUrl.searchParams.get('url');     // 직접 전달된 파트너 링크
  const slug = inUrl.searchParams.get('slug');        // 사전에 저장한 키(예: plug-adapter)
  let target = urlParam || (slug ? COUPANG_SLUGS[slug] : '');

  if (!target) return new Response('No coupang target', { status: 404 });

  // 긴 링크면 채널아이디(subId) 부착
  if (vendor.subParam && sub) target = appendQuery(target, vendor.subParam, sub);

  return Response.redirect(target, 302);
}

// src/app/api/check/route.ts
export const runtime = 'nodejs';

import { NextRequest } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

/* ---------- 타입 ---------- */
type VisaSource = { title?: string; url: string };
type VisaInfo = { summary: string; sources: VisaSource[]; updatedAt?: string };
type PowerMeta = { plug: string[]; voltage: string; frequency: string; source?: string };
type BaggageLink = { code: string; title: string; url: string };
type CountryMeta = {
  iso2?: string;
  nameKo?: string;
  nameEn?: string;
  power: PowerMeta;
  visa?: VisaInfo; // optional fallback in country file
  baggage?: { links: BaggageLink[] };
  updatedAt?: string;
};

type ChecklistItem = { id: string; label: string; checked: boolean };
function buildChecklist(): ChecklistItem[] {
  return [
    { id: 'passport', label: '여권 유효기간 6개월 이상', checked: false },
    { id: 'visa', label: '비자/전자여행허가(해당 시)', checked: false },
    { id: 'tickets', label: '왕복 항공권/호텔 바우처', checked: false },
    { id: 'esim', label: 'eSIM 또는 로밍 준비', checked: false },
    { id: 'power', label: '플러그 어댑터/보조배터리', checked: false },
    { id: 'baggage', label: '수하물 규정 확인(기내/위탁)', checked: false },
    { id: 'insurance', label: '여행자 보험(선택)', checked: false },
    { id: 'cash', label: '현지 결제수단(카드/현금·환전)', checked: false }
  ];
}

/* ---------- 유틸: 비자 요약 생성 ---------- */
function makeVisaSummary(passport: string, country: string, rec: {
  status: string; max_stay_days: number; conditions?: string[]; notes?: string;
}): string {
  const p = passport; const c = country;
  const cond = rec.conditions?.length ? ` (${rec.conditions.join(', ')})` : '';
  const days = rec.max_stay_days > 0 ? `${rec.max_stay_days}일` : '';
  // status 별 템플릿
  const s = rec.status.toLowerCase();
  if (s.includes('visa-free')) {
    return `한국 여권 소지자는 ${c} 입국 시 무비자 ${days} 체류가 가능합니다${cond}.`;
  }
  if (s.includes('vwp-esta') || s.includes('esta')) {
    return `미국 방문은 VWP 대상이며 출발 전 ESTA 승인이 필요합니다. 최대 ${days || '90일'} 체류 가능합니다${cond}.`;
  }
  if (s.includes('nzeTA')) {
    return `뉴질랜드 방문은 출발 전 NZeTA 발급이 필요하며 최대 ${days || '90일'} 체류 가능합니다${cond}.`;
  }
  if (s.includes('eta') && c === 'AU') {
    return `호주 방문은 ETA(전자여행허가) 사전 승인이 필요하며 최대 ${days || '90일'} 체류 가능합니다${cond}.`;
  }
  if (s.includes('e-voa') || s.includes('voa') || s.includes('e-visa')) {
    return `입국 시 전자비자/도착비자 제도가 적용되며 통상 최대 ${days || '30일'} 체류 가능합니다${cond}.`;
  }
  if (s.includes('schengen')) {
    return `솅겐 규정에 따라 180일 중 최대 ${days || '90일'}까지 무비자 체류 가능합니다${cond}.`;
  }
  if (s.includes('visa-required')) {
    return `일반적으로 사전 비자 발급이 필요합니다${cond}.`;
  }
  // fallback
  return `비자/입국 규정은 사전에 확인이 필요합니다${cond}.`;
}

function toSources(urls?: string[]): VisaSource[] {
  return (urls || []).map((u) => ({ url: u }));
}

/* ---------- 핸들러 ---------- */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const country = (searchParams.get('country') || 'JP').toUpperCase(); // 목적지 ISO2
  const passport = (searchParams.get('passport') || 'KR').toUpperCase();
  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';

  try {
    // 국가 메타(전압/수하물 링크 등)
    const filePath = path.join(process.cwd(), 'public', 'data', 'country', `${country}.json`);
    const raw = await fs.readFile(filePath, 'utf-8');
    const meta = JSON.parse(raw) as CountryMeta;

    // 비자: 우선 /api/visa 에게 묻고 → 없으면 country 파일의 fallback 사용
    let visaInfo: VisaInfo | undefined;
    try {
      const visaUrl = new URL('/api/visa', req.url);
      visaUrl.searchParams.set('passport', passport);
      visaUrl.searchParams.set('country', country);
      const r = await fetch(visaUrl.toString(), { headers: { accept: 'application/json' } });
      const j = await r.json();
      if (j?.found && j.record) {
        visaInfo = {
          summary: makeVisaSummary(passport, country, j.record),
          sources: toSources(j.record.sources),
          updatedAt: j.updated_at
        };
      }
    } catch {
      // ignore & fallback
    }

    if (!visaInfo) {
      visaInfo = meta.visa ?? {
        summary: '입국·비자 최신 규정은 IATA/정부·대사관 공지에서 확인하세요.',
        sources: [{ url: 'https://www.iata.org/en/services/compliance/timatic/travel-documentation/' }]
      };
    }

    // eSIM (임시)
    const esim = {
      deals: [{ name: `Airalo ${country} eSIM`, go: `/go/airalo?country=${country}` }]
    };

    return new Response(
      JSON.stringify(
        {
          country,
          passport,
          from,
          to,
          visa: visaInfo,
          power: {
            plugTypes: meta.power.plug,
            voltage: meta.power.voltage,
            frequency: meta.power.frequency,
            source: meta.power.source ?? 'WorldStandards'
          },
          baggage: {
            guide:
              '국제선 일반: 기내 7~10kg / 위탁 20~23kg(항공사·운임 유형에 따라 상이). 상세는 항공사 공식 페이지를 확인하세요.',
            airlineLinks: meta.baggage?.links ?? []
          },
          esim,
          checklist: buildChecklist(),
          updatedAt: meta.updatedAt ?? null
        },
        null,
        2
      ),
      {
        headers: {
          'content-type': 'application/json; charset=utf-8',
          // 메타는 빈번히 변하지 않으니 중간 캐시 허용
          'cache-control': 'public, s-maxage=86400, stale-while-revalidate=604800'
        }
      }
    );
  } catch {
    return new Response(JSON.stringify({ error: 'unknown country' }), { status: 404 });
  }
}

// src/app/api/check/route.ts
export const runtime = 'nodejs'; // 파일 시스템 읽기 위해 node 런타임

import { NextRequest } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

/* ---------- 타입 ---------- */
type VisaSource = { title: string; url: string };
type VisaInfo = { summary: string; sources: VisaSource[]; updatedAt?: string };
type PowerMeta = { plug: string[]; voltage: string; frequency: string; source?: string };
type BaggageLink = { code: string; title: string; url: string };
type CountryMeta = {
  iso2?: string;
  nameKo?: string;
  nameEn?: string;
  power: PowerMeta;
  visa?: VisaInfo;
  baggage?: { links: BaggageLink[] };
  updatedAt?: string;
};

// 비자 스냅샷(JSON) 타입
type VisaSnapshot = { summary: string; sources: VisaSource[]; updatedAt: string };
type VisaSnapshotMap = Record<string, VisaSnapshot>;

// JSON import (Next+TS에서 assert 사용 가능)
import visaSnapRaw from '../../../../public/data/visa_snapshot.json' assert { type: 'json' };
const VISA_SNAPSHOT = visaSnapRaw as unknown as VisaSnapshotMap;

/* ---------- 체크리스트 ---------- */
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

/* ---------- 핸들러 ---------- */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const country = (searchParams.get('country') || 'JP').toUpperCase(); // 목적지 ISO2
  const passport = (searchParams.get('passport') || 'KR').toUpperCase();
  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';

  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'country', `${country}.json`);
    const raw = await fs.readFile(filePath, 'utf-8');
    const meta = JSON.parse(raw) as CountryMeta;

    // 스냅샷 우선(예: KR-JP)
    const key = `${passport}-${country}`;
    const snap = VISA_SNAPSHOT[key];
    const visa: VisaInfo | undefined = snap
      ? { summary: snap.summary, sources: snap.sources, updatedAt: snap.updatedAt }
      : meta.visa;

    // eSIM 제휴 링크(임시)
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
          visa: visa ?? {
            summary: '입국·비자 최신 규정은 IATA/정부·대사관 공지에서 확인하세요.',
            sources: [
              { title: 'IATA Travel Centre', url: 'https://www.iata.org/en/services/compliance/timatic/travel-documentation/' }
            ]
          },
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
      { headers: { 'content-type': 'application/json; charset=utf-8' } }
    );
  } catch {
    return new Response(JSON.stringify({ error: 'unknown country' }), { status: 404 });
  }
}

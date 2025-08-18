// src/app/api/check/route.ts
export const runtime = 'nodejs'; // 파일 읽기 위해 Node 런타임 사용

import { NextRequest } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import visaSnapRaw from "../../../../public/data/visa_snapshot.json" assert { type: "json" };

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

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const country = (searchParams.get('country') || 'JP').toUpperCase();
  const passport = (searchParams.get('passport') || 'KR').toUpperCase();
  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';

  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'country', `${country}.json`);
    const raw = await fs.readFile(filePath, 'utf-8');
    const meta = JSON.parse(raw);
    const key = `${passport}-${country}`;
    const snap = (visaSnapRaw as any)[key];
    const visa = snap
      ? { summary: snap.summary, sources: snap.sources, updatedAt: snap.updatedAt }
      : meta.visa; // 스냅샷 없으면 기존 링크/요약 유지

    // eSIM 제휴 링크(나중에 본인 링크로 교체)
    const esim = {
      deals: [
        { name: `Airalo ${country} eSIM`, go: `/go/airalo?country=${country}` }
      ]
    };

    // 반환
    return new Response(
      JSON.stringify(
        {
          country,
          passport,
          from, to,
          visa: visa,
          power: {
            plugTypes: meta.power.plug,
            voltage: meta.power.voltage,
            frequency: meta.power.frequency,
            source: meta.power.source
          },
          baggage: {
            guide: "국제선 일반: 기내 7~10kg / 위탁 20~23kg(항공사별 상이). 상세는 항공사 공식 페이지를 확인하세요.",
            airlineLinks: meta.baggage?.links || []
          },
          esim,
          checklist: buildChecklist(),
          updatedAt: meta.updatedAt || null
        },
        null,
        2
      ),
      { headers: { 'content-type': 'application/json; charset=utf-8' } }
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: 'unknown country' }), { status: 404 });
  }
}

// src/app/api/check/route.ts
export const runtime = 'nodejs';

import fs from 'fs/promises';
import path from 'path';

/* ---------------- Types ---------------- */

type AirlineCode = string;

interface AirlineObj {
  code?: string;
  name?: string;
  nameKo?: string;
  nameEn?: string;
  url?: string;
  baggageUrl?: string;
}

interface BaggageLink {
  code?: string;
  name?: string;
  url?: string;
}

interface CountryJson {
  iso2: string;
  nameKo: string;
  nameEn: string;
  nameCn?: string;
  nameJp?: string;
  power?: {
    plug?: string[];
    plugTypes?: string[];
    voltage?: string;
    frequency?: string;
  };
  airlines?: Array<AirlineCode | AirlineObj>;
  airline?: Array<AirlineCode | AirlineObj>;
  baggage?: {
    links?: BaggageLink[];
  };
  baggageLinks?: { title: string; url: string }[];
}

type VisaStatus = 'visa-free' | 'voa' | 'evisa' | 'eta' | 'esta' | 'visa-required';
interface VisaEntry {
  status: VisaStatus;
  days: number | string;
  notes?: string;
  sources?: string[];
  ref?: string;
}
interface VisaSnapshot {
  updatedAt?: string;
  pairs: Record<string, VisaEntry>;
}

interface VisaInfo {
  summary: string;
  sources?: { title: string; url: string }[];
  updatedAt?: string | null;
}

interface ESIMDeal { name: string; go: string }
interface PowerInfo { plugTypes: string[]; voltage: string; frequency: string; source: string }
interface BaggageInfo { guide: string; airlineLinks: { title: string; url: string }[] }

interface ApiResult {
  country: string;      // ISO2
  countryName: string;  // 표시용 국가명 (nameKo 우선)
  passport: string;
  from: string;
  to: string;
  visa: VisaInfo;
  esim: { deals: ESIMDeal[] };
  power: PowerInfo;
  baggage: BaggageInfo;
  checklist: { id: string; label: string; checked: boolean }[];
  updatedAt: string | null;
}

/* ---------------- Helpers ---------------- */

let _visaCache: VisaSnapshot | null = null;
async function loadVisaSnapshot(): Promise<VisaSnapshot> {
  if (_visaCache) return _visaCache;
  const p = path.join(process.cwd(), 'public', 'data', 'visa_snapshot.json');
  const raw = await fs.readFile(p, 'utf8');
  _visaCache = JSON.parse(raw) as VisaSnapshot;
  return _visaCache;
}

function shortTitleFromUrl(u: string): string {
  try {
    const h = new URL(u).hostname.replace(/^www\./, '');
    if (h.includes('boca.gov.tw')) return 'Taiwan BOCA';
    if (h.includes('immd.gov.hk')) return 'HK Immigration';
    if (h.includes('gov.uk')) return 'UK GOV';
    if (h.includes('cbp.gov')) return 'U.S. CBP';
    if (h.includes('homeaffairs.gov.au')) return 'Australia Home Affairs';
    if (h.includes('immigration.govt.nz')) return 'NZ Immigration';
    if (h.includes('mofa.go.kr')) return '대한민국 외교부';
    return h;
  } catch {
    return '공식 안내';
  }
}

function buildSummary(countryName: string, v: VisaEntry): string {
  const d = v.days ? String(v.days) : '';
  switch (v.status) {
    case 'visa-free':
      return `${countryName} ${d ? `${d}일` : ''} 무비자 체류가 가능합니다.${v.notes ? ' ' + v.notes : ''}`;
    case 'voa':
      return `${countryName} 입국 시 도착비자(VOA)${d ? `, 체류 ${d}일` : ''} 가능합니다.${v.notes ? ' ' + v.notes : ''}`;
    case 'evisa':
      return `${countryName} 입국에는 전자비자(e-Visa)가 필요합니다.${d ? ` (통상 ${d}일 체류)` : ''}${v.notes ? ' ' + v.notes : ''}`;
    case 'eta':
      return `${countryName} 입국에는 ETA(전자여행허가)가 필요합니다.${d ? ` (통상 ${d}일 체류)` : ''}${v.notes ? ' ' + v.notes : ''}`;
    case 'esta':
      return `${countryName}는 VWP 대상이며 ESTA 승인이 필요합니다.${d ? ` (무비자 ${d}일 체류)` : ''}${v.notes ? ' ' + v.notes : ''}`;
    case 'visa-required':
    default:
      return `${countryName} 입국에는 사전 비자가 필요합니다.${v.notes ? ' ' + v.notes : ''}`;
  }
}

async function composeVisa(passportISO2: string, countryISO2: string, countryName: string): Promise<VisaInfo> {
  const snap = await loadVisaSnapshot();
  const key = `${passportISO2.toUpperCase()}-${countryISO2.toUpperCase()}`;
  let entry: VisaEntry | undefined = snap.pairs[key];
  if (entry?.ref) entry = snap.pairs[entry.ref];

  if (!entry) {
    return {
      summary:
        '비자 요약 정보를 찾지 못했습니다. IATA Travel Centre 또는 해당국 대사관 공지에서 최신 정보를 확인하세요.',
      sources: [
        { title: 'IATA Travel Centre', url: 'https://www.iata.org/en/services/compliance/timatic/travel-documentation/' }
      ],
      updatedAt: snap.updatedAt ?? null
    };
  }

  const summary = buildSummary(countryName, entry);
  const sources = (entry.sources ?? []).map((url) => ({ title: shortTitleFromUrl(url), url }));

  return { summary, sources, updatedAt: snap.updatedAt ?? null };
}

async function readCountryJson(iso2: string): Promise<CountryJson | null> {
  const p = path.join(process.cwd(), 'public', 'data', 'country', `${iso2}.json`);
  try {
    const raw = await fs.readFile(p, 'utf8');
    return JSON.parse(raw) as CountryJson;
  } catch {
    return null;
  }
}

function normalizePower(cj: CountryJson | null): PowerInfo {
  const plugTypes = cj?.power?.plugTypes ?? cj?.power?.plug ?? [];
  return {
    plugTypes: Array.isArray(plugTypes) ? plugTypes : [],
    voltage: cj?.power?.voltage ?? '—',
    frequency: cj?.power?.frequency ?? '—',
    source: 'WorldStandards'
  };
}

function normalizeBaggage(cj: CountryJson | null): BaggageInfo {
  const out: BaggageInfo = {
    guide:
      '국제선 일반: 기내 7~10kg / 위탁 20~23kg(항공사·운임 유형에 따라 상이). 상세는 항공사 공식 페이지를 확인하세요.',
    airlineLinks: []
  };

  // baggage.links 우선
  const blist: BaggageLink[] = Array.isArray(cj?.baggage?.links) ? (cj!.baggage!.links as BaggageLink[]) : [];
  for (const b of blist) {
    if (b?.url) {
      const code = (b.code ?? '').toUpperCase();
      const name = b.name ?? code;
      out.airlineLinks.push({ title: `${name}${code ? ` (${code})` : ''}`, url: b.url });
    }
  }

  // 그 다음 legacy baggageLinks
  if (Array.isArray(cj?.baggageLinks)) {
    for (const b of cj!.baggageLinks!) {
      if (b?.title && b?.url) out.airlineLinks.push({ title: b.title, url: b.url });
    }
  }

  // airlines/airline 에 객체로 url 포함된 경우 추가
  const airlines = Array.isArray(cj?.airlines) ? cj!.airlines! : Array.isArray(cj?.airline) ? cj!.airline! : [];
  for (const item of airlines) {
    if (typeof item === 'object' && (item?.url || item?.baggageUrl)) {
      const code = (item.code ?? '').toUpperCase();
      const nm = item.name ?? item.nameKo ?? item.nameEn ?? code;
      const url = item.url ?? item.baggageUrl!;
      out.airlineLinks.push({ title: `${nm}${code ? ` (${code})` : ''}`, url });
    }
  }

  return out;
}

/* ---------------- Route Handler ---------------- */

export async function GET(req: Request): Promise<Response> {
  try {
    const u = new URL(req.url);
    const iso2 = (u.searchParams.get('country') || 'JP').toUpperCase();
    const passport = (u.searchParams.get('passport') || 'KR').toUpperCase();
    const from = u.searchParams.get('from') || '';
    const to = u.searchParams.get('to') || '';

    const countryJson = await readCountryJson(iso2);
    const countryName = countryJson?.nameKo ?? countryJson?.nameEn ?? iso2;

    const visa = await composeVisa(passport, iso2, countryName);
    const power = normalizePower(countryJson);
    const baggage = normalizeBaggage(countryJson);

    const res: ApiResult = {
      country: iso2,
      countryName,
      passport,
      from,
      to,
      visa,
      esim: {
        deals: [{ name: `Airalo ${countryJson?.nameEn ?? iso2} eSIM`, go: `/go/airalo?country=${iso2}` }]
      },
      power,
      baggage,
      checklist: [
        { id: 'p0', label: '여권 유효기간 6개월 이상', checked: false },
        { id: 'p1', label: '비자/전자여행허가(해당 시)', checked: false },
        { id: 'p2', label: 'eSIM 또는 로밍 준비', checked: false },
        { id: 'p3', label: '플러그 어댑터/변환기', checked: false }
      ],
      updatedAt: null
    };

    return new Response(JSON.stringify(res), {
      headers: {
        'content-type': 'application/json',
        'cache-control': 's-maxage=300, stale-while-revalidate=60'
      }
    });
  } catch {
    return new Response(JSON.stringify({ error: 'internal-error' }), { status: 500 });
  }
}

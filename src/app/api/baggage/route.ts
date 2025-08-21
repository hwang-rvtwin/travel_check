export const runtime = 'nodejs';

type Rule = {
  carrier: string; name: string;
  cabin?: string | null; checked?: string | null;
  note?: string | null; url: string; updated: string;
};

const BAGGAGE: Record<string, Rule> = {
  KE: { carrier:'KE', name:'Korean Air', cabin:'10kg 1pc(일반)', checked:'노선/운임 별도',
        note:'노선·운임·구간에 따라 상이. 링크에서 여정 기준 확인.',
        url:'https://www.koreanair.com/kr/ko/airport/baggage', updated:'2025-08-20' },
  OZ: { carrier:'OZ', name:'Asiana Airlines', cabin:'10kg 1pc', checked:'노선/운임 별도',
        url:'https://flyasiana.com/C/KR/KO/baggage/free-baggage', updated:'2025-08-20' },
  '7C':{ carrier:'7C', name:'Jeju Air', cabin:'10kg 1pc', checked:'유/무상 운임별 상이',
        url:'https://www.jejuair.net/ko/additionalService/service/preorderedBaggage.do', updated:'2025-08-20' },
  LJ: { carrier:'LJ', name:'Jin Air', cabin:'10kg 1pc', checked:'유/무상 운임별 상이',
        url:'https://www.jinair.com/ready/carryBaggage', updated:'2025-08-20' },
  TW: { carrier:'TW', name:'T\'way Air', cabin:'10kg 1pc', checked:'유/무상 운임별 상이',
        url:'https://www.twayair.com/app/serviceInfo/contents/1148', updated:'2025-08-20' },
  BX: { carrier:'BX', name:'Air Busan', cabin:'10kg 1pc', checked:'유/무상 운임별 상이',
        url:'https://www.airbusan.com/content/common/service/baggage/', updated:'2025-08-20' },
  RS: { carrier:'RS', name:'Air Seoul', cabin:'10kg 1pc', checked:'유/무상 운임별 상이',
        url:'https://flyairseoul.com/CW/ko/destinations.do', updated:'2025-08-20' },
  ZE: { carrier:'ZE', name:'Eastar Jet', cabin:'10kg 1pc', checked:'유/무상 운임별 상이',
        url:'https://www.eastarjet.com/newstar/PGWIK00001?_gl=1*1rc6koi*_ga*NDU3Mjc1NTk2LjE3NTU3NDgyNTk.*_ga_3MJCE20ZX8*czE3NTU3NDgyNTkkbzEkZzEkdDE3NTU3NDgyODUkajM0JGwwJGgxODQwNTMwMDMy', updated:'2025-08-20' },
};

export async function GET(req: Request) {
  const u = new URL(req.url);
  const code = (u.searchParams.get('carrier') || '').toUpperCase();
  const data = BAGGAGE[code];
  if (!data) return new Response(JSON.stringify({ error: 'unknown-carrier' }), { status: 404 });

  return new Response(JSON.stringify({ data }), {
    headers: {
      'content-type': 'application/json',
      'cache-control': 's-maxage=86400, stale-while-revalidate=86400'
    }
  });
}

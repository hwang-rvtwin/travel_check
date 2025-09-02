// src/app/destinations/[country]/page.tsx
import { notFound } from 'next/navigation';
import Script from 'next/script';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { getAllCountries, getCountryBySlug } from '@/lib/geo';
import { TZ_BY_ISO2, CCY_BY_ISO2 } from '@/lib/geo-extra';
import AffiliateKit from '@/components/AffiliateKit';
import LocalTime from '@/components/LocalTime';
import PlugPhotos from '@/components/PlugPhotos';
import FxCard from '@/components/FxCard';
import PackingQuickLinks from "./_PackingQuickLinks";

type CountryParams = { country: string };

type CorePart = 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second';

export const dynamicParams = false;
// 정적 + 환율 1시간 캐시
export const revalidate = 3600;

export function generateStaticParams(): CountryParams[] {
  return getAllCountries().map(c => ({ country: c.slug }));
}

function flagEmoji(iso2: string): string {
  const codePoints = iso2.toUpperCase().split('').map(c => 127397 + c.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

function offsetMinutes(tz: string, now = new Date()): number {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const parts = dtf.formatToParts(now);
  const get = (k: CorePart): number => {
    const v = parts.find((p) => p.type === k)?.value;
    return v ? parseInt(v, 10) : 0;
  };

  const asUTC = Date.UTC(
    get('year'),
    get('month') - 1,
    get('day'),
    get('hour'),
    get('minute'),
    get('second'),
  );
  return (asUTC - now.getTime()) / 60000; // minutes
}

function hoursDiffFromSeoul(tz: string): number {
  return Math.round((offsetMinutes(tz) - offsetMinutes('Asia/Seoul')) / 60);
}

// ======================= 여행자 Q/A용 로컬 데이터 & 유틸 =======================
type Tipping = 'none'|'rounding'|'service_included'|'optional'|'ten_percent';
type Payment = 'card'|'cash'|'mixed';
type BudgetRangeKRW = [number, number];

interface CountryExtra {
  tipping: Tipping;
  payment: Payment;
  emergency: { general: string; police?: string; ambulance?: string; fire?: string };
  transport: string;
  budget10d?: BudgetRangeKRW;
  topPlaces?: string[];
  foods?: string[];
  apps?: string[];
  souvenirs?: string[];
}

function tipText(t: Tipping): string {
  switch (t) {
    case 'none': return '팁 문화 없음(기본적으로 주지 않음).';
    case 'rounding': return '반올림/소액 팁 정도.';
    case 'service_included': return '영수증에 서비스료 포함이 일반적.';
    case 'optional': return '상황에 따라 5–10% 내외.';
    case 'ten_percent': return '음식점 등 10–20% 관례.';
  }
}

function payText(p: Payment): string {
  switch (p) {
    case 'card': return '카드 결제 매우 보편.';
    case 'cash': return '현금 선호 상점 다수 — 소액 현금 권장.';
    case 'mixed': return '카드/현금 혼합 — 소규모 상점은 현금만 받기도 함.';
  }
}

function formatBudget([min,max]: BudgetRangeKRW): string {
  const f = (v:number)=>`${Math.round(v/10000)}만원`;
  return `${f(min)} ~ ${f(max)}`;
}

// 20개국(iso2 키) — 필요시 계속 보완/조정 가능
const EXTRAS: Record<string, CountryExtra> = {
  JP: {
    tipping:'none', payment:'card', emergency:{general:'119', police:'110'},
    transport:'Suica/ICOCA/PASMO 등 교통카드 사용. JR패스는 장거리 위주일 때만 유리.',
    budget10d:[1000000, 2500000],
    topPlaces:['도쿄', '교토·나라', '오사카', '후지/하코네'],
    foods:['스시·사시미', '라멘', '돈카츠', '오코노미야키'],
    apps:['NAVITIME', 'Google Maps', 'JR East', 'Suica'],
    souvenirs:['도쿄바나나', '녹차/말차', '키트캣 한정판', '전통 젓가락'],
  },
  TH: {
    tipping:'optional', payment:'cash', emergency:{general:'191'},
    transport:'방콕은 BTS/MRT + Rabbit 카드. 그랩(Grab) 보편.',
    budget10d:[700000, 1800000],
    topPlaces:['방콕', '치앙마이', '푸켓', '파타야'],
    foods:['똠얌꿍', '팟타이', '쏨땀', '망고 스티키라이스'],
    apps:['Grab', 'LINE MAN', 'Google Maps', 'XE Currency'],
    souvenirs:['건조 망고', '허벌밤(타이거밤)', '코코넛 오일', '비누/스파 제품'],
  },
  US: {
    tipping:'ten_percent', payment:'card', emergency:{general:'911'},
    transport:'도시별 상이(뉴욕 OMNY/메트로카드, 샌프란 Clipper 등). 라이드셰어 보편.',
    budget10d:[2500000, 5000000],
    topPlaces:['뉴욕', '라스베이거스/그랜드캐니언', '샌프란시스코', '하와이'],
    foods:['버거', '바비큐', '텍스멕스', '뉴욕피자'],
    apps:['Uber/Lyft', 'Citymapper', 'Google Maps', 'Yelp'],
    souvenirs:['리바이스/컨버스', '스니커즈', '로컬 핫소스', '국립공원 굿즈'],
  },
  GB: {
    tipping:'optional', payment:'card', emergency:{general:'999'},
    transport:'오이스터/컨택트리스 결제, 데일리 플래프 적용. 기차는 사전예매 유리.',
    budget10d:[2300000, 4500000],
    topPlaces:['런던', '에든버러', '버스/옥스퍼드', '레이크디스트릭트'],
    foods:['피시앤칩스', '파이&매시', '애프터눈 티', '풀 잉글리시 브렉퍼스트'],
    apps:['Citymapper', 'Trainline', 'Google Maps', 'TfL Go'],
    souvenirs:['홍차', '숏브레드', '버버리/해리스 트위드', '해리포터 굿즈'],
  },
  FR: {
    tipping:'service_included', payment:'card', emergency:{general:'112'},
    transport:'파리 Navigo(주간권) 유용. TGV/인터시티는 사전예매.',
    budget10d:[2300000, 4500000],
    topPlaces:['파리', '몽생미셸', '니스/코트다쥐르', '루아르 성곽'],
    foods:['크루아상', '에스카르고', '부이야베스', '마카롱'],
    apps:['Bonjour RATP', 'SNCF Connect', 'Google Maps', 'TheFork'],
    souvenirs:['와인/샴페인', '마카롱', '비누/향수', '프랑스 치즈(반입 규정 확인)'],
  },
  DE: {
    tipping:'rounding', payment:'card', emergency:{general:'112'},
    transport:'Deutschlandticket(월권) 또는 지역권. 도시 내 U/S-Bahn 촘촘.',
    budget10d:[2000000, 4000000],
    topPlaces:['베를린', '뮌헨', '로맨틱 로드', '하이델베르크'],
    foods:['슈니첼', '브라트부어스트', '프레첼', '자우어크라우트'],
    apps:['DB Navigator', 'Google Maps', 'Citymapper', 'Too Good To Go'],
    souvenirs:['맥주잔/스테인', 'HARIBO', '크리스마스 오너먼트', '초콜릿'],
  },
  IT: {
    tipping:'optional', payment:'mixed', emergency:{general:'112'},
    transport:'Trenitalia/Italo 고속열차, 도시별 ACTV/ATAC 등. 지갑 조심!',
    budget10d:[2000000, 4000000],
    topPlaces:['로마', '피렌체', '베네치아', '아말피 해안'],
    foods:['파스타/피자', '젤라또', '티라미수', '아란치니'],
    apps:['Trainline', 'Google Maps', 'Michelin Guide', 'myCicero'],
    souvenirs:['올리브 오일', '발사믹 식초', '가죽제품', '리모네첼로'],
  },
  ES: {
    tipping:'rounding', payment:'card', emergency:{general:'112'},
    transport:'Renfe 사전예매, 도시권/교외철도 병행. 점심 늦고 저녁 늦음.',
    budget10d:[1800000, 3600000],
    topPlaces:['바르셀로나', '마드리드', '세비야', '그라나다'],
    foods:['파에야', '타파스', '하몽', '추로스'],
    apps:['Renfe', 'Google Maps', 'Citymapper', 'ElTenedor(TheFork)'],
    souvenirs:['하몽(반입규정 확인)', '상그리아 믹스', '올리브', '스페인 타일'],
  },
  AU: {
    tipping:'none', payment:'card', emergency:{general:'000'},
    transport:'Opal/Myki/Go Card 등 지역별 교통카드. 대중교통 도시별 편차.',
    budget10d:[2200000, 4500000],
    topPlaces:['시드니', '멜번', '그레이트오션로드', '그레이트배리어리프'],
    foods:['호주식 바비', '파블로바', '미트파이', '커피'],
    apps:['Opal', 'PTV', 'Google Maps', 'Rome2rio'],
    souvenirs:['팀탐', '마카다미아', '유칼립투스 제품', 'Ugg(정품)'],
  },
  NZ: {
    tipping:'none', payment:'card', emergency:{general:'111'},
    transport:'AT HOP 등 지역 카드. 도시 간 이동은 차량/투어가 편함.',
    budget10d:[2200000, 4500000],
    topPlaces:['오클랜드', '로토루아', '퀸스타운', '테카포'],
    foods:['그린홍합', '램', '호키포키 아이스크림', '피시앤칩스'],
    apps:['Google Maps', 'Rome2rio', 'CamperMate', 'AT Mobile'],
    souvenirs:['마누카 꿀', '키위 인형', '메리노 울', '핸드크림'],
  },
  SG: {
    tipping:'service_included', payment:'card', emergency:{general:'999'},
    transport:'EZ-Link/SimplyGo, MRT 중심으로 이동. 버스 환승 할인.',
    budget10d:[1800000, 3500000],
    topPlaces:['마리나베이', '센토사', '차이나타운', '가든스 바이 더 베이'],
    foods:['치킨라이스', '락사', '칠리크랩', '바쿠테'],
    apps:['TransitLink SimplyGo', 'Grab', 'Google Maps', 'Chope'],
    souvenirs:['카야잼', '바쿠테 티백', '머라이언 굿즈', '파인애플 타르트'],
  },
  MY: {
    tipping:'optional', payment:'mixed', emergency:{general:'999'},
    transport:'KTM/KLIA 익스프레스, 래피드KL. 터치앤고 카드 보편.',
    budget10d:[1200000, 2400000],
    topPlaces:['쿠알라룸푸르', '말라카', '페낭', '보르네오 코타키나발루'],
    foods:['나시르막', '락사', '바쿠테', '치킨 라이스'],
    apps:['Grab', 'Google Maps', 'TNG eWallet', 'Moovit'],
    souvenirs:['화이트 커피', '말레이 쿠키', '견과/건과', '바틱'],
  },
  VN: {
    tipping:'optional', payment:'cash', emergency:{general:'113'},
    transport:'Grab Bike/Car 보편. 시외는 슬리핑버스/기차.',
    budget10d:[900000, 2000000],
    topPlaces:['하노이', '하롱베이', '다낭·호이안', '호치민'],
    foods:['쌀국수', '반미', '분짜', '짜조'],
    apps:['Grab', 'Google Maps', 'BAEMIN VN', 'MoMo'],
    souvenirs:['드립 커피/핀', '코코넛 캔디', '건과류', '라탄 공예'],
  },
  ID: {
    tipping:'optional', payment:'cash', emergency:{general:'112'},
    transport:'발리는 Grab/Gojek, 자바는 KAI 철도. 섬간 이동은 항공/페리.',
    budget10d:[900000, 2000000],
    topPlaces:['발리', '자카르타', '족자카르타/보로부두르', '길리/누사'],
    foods:['나시고렝', '미고렝', '사떼', '바비굴링(발리)'],
    apps:['Grab', 'Gojek', 'Google Maps', 'Traveloka'],
    souvenirs:['루왁 커피', '바틱', '은제품', '오일/스파 제품'],
  },
  TW: {
    tipping:'none', payment:'card', emergency:{general:'110', ambulance:'119'},
    transport:'이지카드/아이패스, 고속철(HSR)/TRA. 야시장 이동은 MRT+도보.',
    budget10d:[1200000, 2400000],
    topPlaces:['타이베이', '지우펀', '화련·타이루거', '가오슝·타이난'],
    foods:['소고기면', '샤오롱바오', '펑리수', '버블티'],
    apps:['台灣高鐵 T Express', 'Bus+', 'Google Maps', 'Foodpanda'],
    souvenirs:['파인애플 케이크', '누가 크래커', '차(우롱/고산)', '마스크팩'],
  },
  HK: {
    tipping:'optional', payment:'card', emergency:{general:'999'},
    transport:'옥토퍼스 카드, MTR 중심. 트램/페리도 경험해볼만.',
    budget10d:[1600000, 3200000],
    topPlaces:['빅토리아 피크', '침사추이', '몽콕', '란타우 섬'],
    foods:['완탕면', '딤섬', '로스트 구스', '밀크티'],
    apps:['Octopus', 'Google Maps', 'OpenRice', 'Klook'],
    souvenirs:['아몬드 쿠키', '에그롤', '차/우롱', '파인애플 번 키트'],
  },
  CN: {
    tipping:'none', payment:'mixed', emergency:{general:'110', ambulance:'120', fire:'119'},
    transport:'12306 기차앱, 도심 지하철 촘촘. 결제는 Alipay/WeChat Pay 비중 큼.',
    budget10d:[1500000, 3000000],
    topPlaces:['베이징', '상하이', '시안', '구이린/양숴'],
    foods:['마라탕', '북경오리', '샤브샤브', '샤오롱바오'],
    apps:['12306', 'Gaode/百度지도', 'Alipay', 'WeChat'],
    souvenirs:['차(보이/우롱)', '비단/실크', '전통 차세트', '간식류'],
  },
  CA: {
    tipping:'ten_percent', payment:'card', emergency:{general:'911'},
    transport:'도시별(토론토 PRESTO, 밴쿠버 Compass). 대륙 횡단은 항공/기차.',
    budget10d:[2300000, 4500000],
    topPlaces:['밴프/로키', '밴쿠버', '토론토', '퀘벡시티'],
    foods:['푸틴', '연어 요리', '메이플 디저트', '나나이모 바'],
    apps:['Transit', 'Google Maps', 'Uber', 'Yelp'],
    souvenirs:['메이플 시럽', '아이스와인', '원주민 공예', '아웃도어 굿즈'],
  },
  AE: {
    tipping:'optional', payment:'card', emergency:{general:'999'},
    transport:'두바이 Nol 카드, 메트로+트램. 택시/라이드셰어 활발.',
    budget10d:[1800000, 3600000],
    topPlaces:['두바이', '아부다비', '사막 사파리', '팔므 주메이라'],
    foods:['샤와르마', '맨디', '후무스', '팔라펠'],
    apps:['Careem', 'RTA', 'Google Maps', 'Talabat'],
    souvenirs:['대추야자', '사프란', '향수/오일', '골드 수크 제품'],
  },
  TR: {
    tipping:'optional', payment:'cash', emergency:{general:'112'},
    transport:'이스탄불카르트로 트램/메트로/페리 환승. 시외는 버스/항공.',
    budget10d:[1200000, 2400000],
    topPlaces:['이스탄불', '카파도키아', '파묵칼레', '안탈리아'],
    foods:['케밥', '멘멘', '바클라바', '라흐맛준'],
    apps:['BiTaksi', 'Google Maps', 'Moovit', 'GetYourGuide'],
    souvenirs:['로쿰(터키시 딜라이트)', '사프란/향신료', '차이세트', '세라믹/도자기'],
  },
};

export async function generateMetadata( props: { params: Promise<CountryParams> }): Promise<Metadata> {
  const { country } = await props.params;
  const c = getCountryBySlug(country);
  if (!c) return {};
  const title = `${c.nameKo} 출국 체크: 비자·eSIM·플러그·수하물 | Travel Check Hub`;
  const description = `${c.nameKo}(${c.nameEn}) 핵심: 비자, 전압 ${c.voltage}V/플러그 ${c.plugTypes.join(', ')}, eSIM, 기후 요약, 시차/환율까지.`;
  const url = `https://rvtwin.com/destinations/${c.slug}`;
  const og = `https://rvtwin.com/api/og?country=${encodeURIComponent(c.nameKo)}`;
  return {
    title, description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'article', images: [{ url: og }] },
    twitter: { card: 'summary_large_image', title, description, images: [og] },
  };
}

export default async function CountryPage({ params }: { params: Promise<CountryParams> }) {
  const { country } = await params;
  const c = getCountryBySlug(country);
  if (!c) notFound();

  const tz = TZ_BY_ISO2[c.iso2] ?? 'UTC';
  const ccy = CCY_BY_ISO2[c.iso2] ?? '';

  const ex = EXTRAS[c.iso2];
  const diffH = hoursDiffFromSeoul(tz);
  const diffTxt = diffH === 0 ? '시차 없음(동일)' : (diffH > 0 ? `한국보다 +${diffH}시간` : `한국보다 ${diffH}시간`);

  const faqs = [
    { q: '팁 문화는?', a: ex ? tipText(ex.tipping) : '업장/지역에 따라 상이.' },
    { q: '결제는 카드 vs 현금?', a: ex ? payText(ex.payment) : '도시권은 카드 보편, 소규모 상점은 현금 요구 가능.' },
    { q: '응급전화 번호?', a: ex?.emergency?.general ? `긴급번호 ${ex.emergency.general} (지역별 세부 번호 상이 가능).` : '현지 안내문 확인.' },
    { q: '대중교통 팁', a: ex?.transport ?? '대도시 대부분 교통카드/앱 사용 가능. 공항에서 구입/충전.' },
    { q: '통상 경비(10일, 항공 제외)', a: ex?.budget10d ? `${formatBudget(ex.budget10d)} (시즌/도시/취향에 따라 ±30%)` : '여행 스타일에 따라 편차가 큼.' },
    { q: '추천 관광지', a: ex?.topPlaces?.length ? ex.topPlaces.join(' · ') : '대표 관광지를 위주로 동선을 잡아보세요.' },
    { q: '추천 음식', a: ex?.foods?.length ? ex.foods.join(' · ') : '로컬 인기 메뉴를 시도해 보세요.' },
    { q: '유용한 앱', a: ex?.apps?.length ? ex.apps.join(' · ') : '현지 교통/배달/지도 앱을 준비하세요.' },
    { q: '기념품 추천', a: ex?.souvenirs?.length ? ex.souvenirs.join(' · ') : '로컬 간식/차/공예품이 무난합니다.' },
  ];

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a }
    }))
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      {/* 히어로 */}
      <section className="rounded-3xl border bg-gradient-to-b from-white to-gray-50 px-6 py-6">
        <div className="text-2xl font-semibold">
          {flagEmoji(c.iso2)} {c.nameKo} <span className="text-gray-400 text-base">({c.nameEn})</span>
        </div>
        <p className="mt-2 text-sm text-gray-500">
          데이터 출처: IATA/정부/항공사/WorldStandards/Open-Meteo
        </p>
      </section>

      {/* 핵심 요약 카드 */}
      <section className="mt-6 grid gap-4 sm:grid-cols-2">
        <InfoCard label="비자 요약" value={c.visaNoteKo} />
        <InfoCard
          label="전압·플러그"
          value={`${c.voltage}V / ${c.frequency}Hz · ${c.plugTypes.join(', ')}`}
        >
          {/* ✅ 실제 사진 뱃지 렌더 */}
          <div className="mt-3 flex flex-wrap gap-3">
            {c.plugTypes.map((t) => (
              <PlugPhotos key={t} type={t} size={72} />
            ))}
            {/* 하단: 전압/플러그 경고 박스 (추가) */}
            <div
              role="note"
              className="mt-2 rounded-lg border-l-4 border-red-400 bg-red-50 p-3 text-xs leading-relaxed text-red-900">
              드라이어·고데기가 <strong>프리볼트(100–240V)</strong>가 아니면 사용을 피하세요.
              어댑터는 <em>플러그 모양</em>만 바꿉니다. <span className="whitespace-nowrap">(변압기 아님)</span>
            </div>
          </div>
        </InfoCard>
        <InfoCard label="eSIM 팁" value={c.esimNote} />
        <InfoCard label="기후 한줄 요약" value={c.climateNote} />
      </section>

      {/* 시차/환율 */}
      <section className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border p-4">
          <div className="text-xs text-gray-500">시차/현지 시각</div>
          <div className="mt-1"><LocalTime tz={tz} /></div>
        </div>
        <div className="rounded-2xl border p-4">
          <div className="text-xs text-gray-500">환율</div>
          <div className="mt-1 text-xs text-gray-500">통화: {ccy || '—'}</div>
          <div className="mt-2">
            {ccy ? <FxCard base={ccy} quote="KRW" /> : <span className="text-sm">통화 정보 없음</span>}
          </div>
          <div className="mt-2 text-[11px] text-gray-400">※ 정보 제공용. 실제 결제 환율과 다를 수 있습니다.</div>
        </div>
      </section>

      {/* 월별 패킹 빠른 링크 */}
      <section className="mt-8">
        <h2 className="text-xl font-medium">월별 패킹</h2>
        <p className="mt-1 text-sm text-gray-500">최근 3개월 바로가기</p>
        <PackingQuickLinks countrySlug={c.slug} />
      </section>

      {/* FAQ (실제 표시) */}
      <section className="mt-8">
        <h2 className="text-xl font-medium">자주 묻는 질문</h2>
        <ul className="mt-3 space-y-3">
          {faqs.map(({ q, a }) => (
            <li key={q} className="rounded-2xl border p-4">
              <div className="font-medium">{q}</div>
              <p className="mt-1 whitespace-pre-line leading-relaxed">{a}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* 제휴 블록 */}
      <section className="mt-10">
        <h2 className="text-xl font-medium">여행 준비 아이템(제휴)</h2>
        <AffiliateKit countrySlug={c.slug} />
      </section>

      {/* CTA */}
      <section className="mt-8">
        <a href={`/?country=${c.slug}`} className="inline-flex items-center rounded-xl border px-4 py-2 hover:bg-gray-50">
          공항/날짜 선택하고 상세 확인하기
        </a>
      </section>

      {/* 출처/정책 */}
      <footer className="mt-10 text-xs text-gray-500 space-y-1">
        <p>※ 규정은 변동 가능성이 있어 출국 전 공식 안내를 확인하세요.</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><a className="underline" href="https://www.iatatravelcentre.com/" target="_blank">IATA Travel Centre</a></li>
          <li><a className="underline" href="https://www.worldstandards.eu/electricity/plugs-and-sockets/" target="_blank">WorldStandards</a></li>
          <li><a className="underline" href="https://www.0404.go.kr/" target="_blank">외교부 해외안전여행</a></li>
          <li><a className="underline" href="https://open-meteo.com/" target="_blank">Open-Meteo</a></li>
        </ul>
      </footer>

      {/* FAQ JSON-LD */}
      <Script id="faq-ld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </main>
  );
}

function InfoCard(
  { label, value, children }:
  { label: string; value: string; children?: ReactNode }
) {
  return (
    <div className="rounded-2xl border p-4">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="mt-1 whitespace-pre-line leading-relaxed text-sm">{value}</div>
      {children}
    </div>
  );
}

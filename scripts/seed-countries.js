// scripts/seed-countries.js
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

// 한국 시간 ISO
const nowKST = new Date(Date.now() + 9 * 3600 * 1000).toISOString().replace('Z', '+09:00');
const outDir = path.join(process.cwd(), 'public', 'data', 'country');
fs.mkdirSync(outDir, { recursive: true });

/**
 * 주의:
 * - 플러그/전압은 국가 내 지역/호텔에 따라 예외가 있을 수 있습니다.
 * - 아래 값은 "시드(출발점)"이며, 반드시 WorldStandards/정부 공지 등 공식 출처로 재확인하세요.
 * - 비자/입국은 /api/visa(스냅샷/라이브)로 커버하고, 여기는 기본 IATA 링크만 둡니다.
 * - 필요 시 개별 국가 파일(JSON)을 사람이 덮어써도 됩니다.
 */

// 상시 넣을 공통 수하물 링크(필요에 따라 항공사 추가 가능)
const BAGGAGE_LINKS = [
  { code: 'KE', title: '대한항공 수하물', url: 'https://www.koreanair.com/contents/plan-your-travel/baggage' },
  { code: 'OZ', title: '아시아나항공 수하물', url: 'https://flyasiana.com/C/KR/KO/contents/user-guide' }
];

const IATA = 'https://www.iata.org/en/services/compliance/timatic/travel-documentation/';

// ====== SEED 목록(geo.ts에 맞춰 확장) ======
const SEED = [
  // Korea / Japan / Greater China / SE Asia
  { iso2: 'KR', nameKo: '대한민국', nameEn: 'South Korea', power: { plug: ['C','F'], voltage: '220V', frequency: '60Hz' } },
  { iso2: 'JP', nameKo: '일본', nameEn: 'Japan', power: { plug: ['A','B'], voltage: '100V', frequency: '50/60Hz' } },
  { iso2: 'HK', nameKo: '홍콩', nameEn: 'Hong Kong', power: { plug: ['G'], voltage: '220V', frequency: '50Hz' } },
  { iso2: 'MO', nameKo: '마카오', nameEn: 'Macao', power: { plug: ['G'], voltage: '220V', frequency: '50Hz' } },
  { iso2: 'TW', nameKo: '대만', nameEn: 'Taiwan', power: { plug: ['A','B'], voltage: '110V', frequency: '60Hz' } },
  { iso2: 'CN', nameKo: '중국', nameEn: 'China', power: { plug: ['A','C','I'], voltage: '220V', frequency: '50Hz' } },
  { iso2: 'SG', nameKo: '싱가포르', nameEn: 'Singapore', power: { plug: ['G'], voltage: '230V', frequency: '50Hz' } },
  { iso2: 'MY', nameKo: '말레이시아', nameEn: 'Malaysia', power: { plug: ['G'], voltage: '230V', frequency: '50Hz' } },
  { iso2: 'TH', nameKo: '태국', nameEn: 'Thailand', power: { plug: ['A','B','C'], voltage: '230V', frequency: '50Hz' } },
  { iso2: 'VN', nameKo: '베트남', nameEn: 'Viet Nam', power: { plug: ['A','C'], voltage: '220V', frequency: '50Hz' } },
  { iso2: 'ID', nameKo: '인도네시아', nameEn: 'Indonesia', power: { plug: ['C','F'], voltage: '230V', frequency: '50Hz' } },
  { iso2: 'PH', nameKo: '필리핀', nameEn: 'Philippines', power: { plug: ['A','B','C'], voltage: '220V', frequency: '60Hz' } },
  { iso2: 'BN', nameKo: '브루나이', nameEn: 'Brunei', power: { plug: ['G'], voltage: '240V', frequency: '50Hz' } },
  { iso2: 'KH', nameKo: '캄보디아', nameEn: 'Cambodia', power: { plug: ['A','C','G'], voltage: '230V', frequency: '50Hz' } },
  { iso2: 'LA', nameKo: '라오스', nameEn: 'Lao PDR', power: { plug: ['A','B','C'], voltage: '230V', frequency: '50Hz' } },
  { iso2: 'MM', nameKo: '미얀마', nameEn: 'Myanmar', power: { plug: ['C','D','G'], voltage: '230V', frequency: '50Hz' } },

  // South Asia / Oceania
  { iso2: 'IN', nameKo: '인도', nameEn: 'India', power: { plug: ['C','D','M'], voltage: '230V', frequency: '50Hz' } },
  { iso2: 'LK', nameKo: '스리랑카', nameEn: 'Sri Lanka', power: { plug: ['D','G','M'], voltage: '230V', frequency: '50Hz' } },
  { iso2: 'NP', nameKo: '네팔', nameEn: 'Nepal', power: { plug: ['C','D','M'], voltage: '230V', frequency: '50Hz' } },
  { iso2: 'MV', nameKo: '몰디브', nameEn: 'Maldives', power: { plug: ['D','G','K'], voltage: '230V', frequency: '50Hz' } },
  { iso2: 'AU', nameKo: '호주', nameEn: 'Australia', power: { plug: ['I'], voltage: '230V', frequency: '50Hz' } },
  { iso2: 'NZ', nameKo: '뉴질랜드', nameEn: 'New Zealand', power: { plug: ['I'], voltage: '230V', frequency: '50Hz' } },
  { iso2: 'GU', nameKo: '괌(미국령)', nameEn: 'Guam', power: { plug: ['A','B'], voltage: '110V', frequency: '60Hz' } },
  { iso2: 'MP', nameKo: '사이판(미국령)', nameEn: 'Northern Mariana Islands', power: { plug: ['A','B'], voltage: '110V', frequency: '60Hz' } },

  // Middle East
  { iso2: 'AE', nameKo: '아랍에미리트', nameEn: 'United Arab Emirates', power: { plug: ['G'], voltage: '230V', frequency: '50Hz' } },
  { iso2: 'QA', nameKo: '카타르', nameEn: 'Qatar', power: { plug: ['G'], voltage: '240V', frequency: '50Hz' } },
  { iso2: 'TR', nameKo: '튀르키예', nameEn: 'Türkiye', power: { plug: ['C','F'], voltage: '230V', frequency: '50Hz' } },
  { iso2: 'SA', nameKo: '사우디아라비아', nameEn: 'Saudi Arabia', power: { plug: ['G'], voltage: '230V', frequency: '60Hz' } },
  { iso2: 'IL', nameKo: '이스라엘', nameEn: 'Israel', power: { plug: ['C','H'], voltage: '230V', frequency: '50Hz' } },
  { iso2: 'JO', nameKo: '요르단', nameEn: 'Jordan', power: { plug: ['C','D','G'], voltage: '230V', frequency: '50Hz' } },
  { iso2: 'EG', nameKo: '이집트', nameEn: 'Egypt', power: { plug: ['C','F'], voltage: '220V', frequency: '50Hz' } },

  // Europe
  { iso2: 'GB', nameKo: '영국', nameEn: 'United Kingdom', power: { plug: ['G'], voltage: '230V', frequency: '50Hz' } },
  { iso2: 'FR', nameKo: '프랑스', nameEn: 'France', power: { plug: ['C','E'], voltage: '230V', frequency: '50Hz' } },
  { iso2: 'DE', nameKo: '독일', nameEn: 'Germany', power: { plug: ['C','F'], voltage: '230V', frequency: '50Hz' } },
  { iso2: 'NL', nameKo: '네덜란드', nameEn: 'Netherlands', power: { plug: ['C','F'], voltage: '230V', frequency: '50Hz' } },
  { iso2: 'IT', nameKo: '이탈리아', nameEn: 'Italy', power: { plug: ['C','F','L'], voltage: '230V', frequency: '50Hz' } },
  { iso2: 'ES', nameKo: '스페인', nameEn: 'Spain', power: { plug: ['C','F'], voltage: '230V', frequency: '50Hz' } },
  { iso2: 'CH', nameKo: '스위스', nameEn: 'Switzerland', power: { plug: ['C','J'], voltage: '230V', frequency: '50Hz' } },
  { iso2: 'AT', nameKo: '오스트리아', nameEn: 'Austria', power: { plug: ['C','F'], voltage: '230V', frequency: '50Hz' } },
  { iso2: 'SE', nameKo: '스웨덴', nameEn: 'Sweden', power: { plug: ['C','F'], voltage: '230V', frequency: '50Hz' } },
  { iso2: 'NO', nameKo: '노르웨이', nameEn: 'Norway', power: { plug: ['C','F'], voltage: '230V', frequency: '50Hz' } },
  { iso2: 'DK', nameKo: '덴마크', nameEn: 'Denmark', power: { plug: ['C','K'], voltage: '230V', frequency: '50Hz' } },
  { iso2: 'FI', nameKo: '핀란드', nameEn: 'Finland', power: { plug: ['C','F'], voltage: '230V', frequency: '50Hz' } },
  { iso2: 'IE', nameKo: '아일랜드', nameEn: 'Ireland', power: { plug: ['G'], voltage: '230V', frequency: '50Hz' } },
  { iso2: 'CZ', nameKo: '체코', nameEn: 'Czechia', power: { plug: ['C','E'], voltage: '230V', frequency: '50Hz' } },
  { iso2: 'HU', nameKo: '헝가리', nameEn: 'Hungary', power: { plug: ['C','F'], voltage: '230V', frequency: '50Hz' } },
  { iso2: 'PL', nameKo: '폴란드', nameEn: 'Poland', power: { plug: ['C','E'], voltage: '230V', frequency: '50Hz' } },
  { iso2: 'PT', nameKo: '포르투갈', nameEn: 'Portugal', power: { plug: ['C','F'], voltage: '230V', frequency: '50Hz' } },
  { iso2: 'GR', nameKo: '그리스', nameEn: 'Greece', power: { plug: ['C','F'], voltage: '230V', frequency: '50Hz' } },

  // North America
  { iso2: 'US', nameKo: '미국', nameEn: 'United States', power: { plug: ['A','B'], voltage: '120V', frequency: '60Hz' } },
  { iso2: 'CA', nameKo: '캐나다', nameEn: 'Canada', power: { plug: ['A','B'], voltage: '120V', frequency: '60Hz' } },
  { iso2: 'MX', nameKo: '멕시코', nameEn: 'Mexico', power: { plug: ['A','B'], voltage: '127V', frequency: '60Hz' } },

  // Central/South America (대표)
  { iso2: 'BR', nameKo: '브라질', nameEn: 'Brazil', power: { plug: ['C','N'], voltage: '127/220V', frequency: '60Hz' } },
  { iso2: 'CL', nameKo: '칠레', nameEn: 'Chile', power: { plug: ['C','L'], voltage: '220V', frequency: '50Hz' } },

  // Africa (대표)
  { iso2: 'ZA', nameKo: '남아프리카공화국', nameEn: 'South Africa', power: { plug: ['C','M','N'], voltage: '230V', frequency: '50Hz' } },
  { iso2: 'KE', nameKo: '케냐', nameEn: 'Kenya', power: { plug: ['G'], voltage: '240V', frequency: '50Hz' } }
];

// ====== 생성 로직 ======
SEED.forEach((c) => {
  const obj = {
    iso2: c.iso2,
    nameKo: c.nameKo,
    nameEn: c.nameEn,
    power: { ...c.power, source: 'WorldStandards (recheck required)' },
    visa: {
      summary: '입국·비자 최신 규정은 IATA Travel Centre 및 해당국 정부/대사관 공지를 확인하세요.',
      sources: [{ title: 'IATA Travel Centre', url: IATA }]
    },
    baggage: { links: BAGGAGE_LINKS },
    updatedAt: nowKST
  };

  const file = path.join(outDir, `${c.iso2}.json`);
  fs.writeFileSync(file, JSON.stringify(obj, null, 2), 'utf-8');
  console.log(`✔ wrote ${path.relative(process.cwd(), file)}`);
});

console.log(`\n완료: ${SEED.length}개 국가 파일 생성 → public/data/country/XX.json`);
console.log('주의: 각 국가 정보는 반드시 공식 출처로 재확인 후 필요 시 수동 업데이트 하세요.');

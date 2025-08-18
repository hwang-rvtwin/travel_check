// scripts/seed-countries.js
const fs = require('fs');
const path = require('path');

const nowKST = new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().replace('Z', '+09:00');
const outDir = path.join(process.cwd(), 'public', 'data', 'country');
fs.mkdirSync(outDir, { recursive: true });

/**
 * 주의:
 * - 플러그/전압은 국가 내 지역/호텔에 따라 예외가 있을 수 있습니다.
 * - 아래 값은 출발점(시드)이며, 반드시 추후 공식 출처를 재확인하세요.
 * - 비자/입국은 IATA Travel Centre 등 "공식 안내 링크" 중심으로 제공합니다.
 */
const SEED = [
  // 아시아/대양주
  { iso2:'JP', nameKo:'일본', nameEn:'Japan', power:{ plug:['A','B'], voltage:'100V', frequency:'50/60Hz' }},
  { iso2:'KR', nameKo:'대한민국', nameEn:'Korea, Republic of', power:{ plug:['C','F'], voltage:'220V', frequency:'60Hz' }},
  { iso2:'CN', nameKo:'중국', nameEn:'China', power:{ plug:['A','C','I'], voltage:'220V', frequency:'50Hz' }},
  { iso2:'HK', nameKo:'홍콩', nameEn:'Hong Kong', power:{ plug:['G'], voltage:'220V', frequency:'50Hz' }},
  { iso2:'TW', nameKo:'대만', nameEn:'Taiwan', power:{ plug:['A','B'], voltage:'110V', frequency:'60Hz' }},
  { iso2:'SG', nameKo:'싱가포르', nameEn:'Singapore', power:{ plug:['G'], voltage:'230V', frequency:'50Hz' }},
  { iso2:'MY', nameKo:'말레이시아', nameEn:'Malaysia', power:{ plug:['G'], voltage:'230V', frequency:'50Hz' }},
  { iso2:'TH', nameKo:'태국', nameEn:'Thailand', power:{ plug:['A','B','C'], voltage:'230V', frequency:'50Hz' }},
  { iso2:'VN', nameKo:'베트남', nameEn:'Viet Nam', power:{ plug:['A','C'], voltage:'220V', frequency:'50Hz' }},
  { iso2:'ID', nameKo:'인도네시아', nameEn:'Indonesia', power:{ plug:['C','F'], voltage:'230V', frequency:'50Hz' }},
  { iso2:'PH', nameKo:'필리핀', nameEn:'Philippines', power:{ plug:['A','B','C'], voltage:'220V', frequency:'60Hz' }},
  { iso2:'AU', nameKo:'호주', nameEn:'Australia', power:{ plug:['I'], voltage:'230V', frequency:'50Hz' }},
  { iso2:'NZ', nameKo:'뉴질랜드', nameEn:'New Zealand', power:{ plug:['I'], voltage:'230V', frequency:'50Hz' }},

  // 미주/유럽/중동
  { iso2:'US', nameKo:'미국', nameEn:'United States', power:{ plug:['A','B'], voltage:'120V', frequency:'60Hz' }},
  { iso2:'CA', nameKo:'캐나다', nameEn:'Canada', power:{ plug:['A','B'], voltage:'120V', frequency:'60Hz' }},
  { iso2:'GB', nameKo:'영국', nameEn:'United Kingdom', power:{ plug:['G'], voltage:'230V', frequency:'50Hz' }},
  { iso2:'FR', nameKo:'프랑스', nameEn:'France', power:{ plug:['C','E'], voltage:'230V', frequency:'50Hz' }},
  { iso2:'DE', nameKo:'독일', nameEn:'Germany', power:{ plug:['C','F'], voltage:'230V', frequency:'50Hz' }},
  { iso2:'IT', nameKo:'이탈리아', nameEn:'Italy', power:{ plug:['C','F','L'], voltage:'230V', frequency:'50Hz' }},
  { iso2:'ES', nameKo:'스페인', nameEn:'Spain', power:{ plug:['C','F'], voltage:'230V', frequency:'50Hz' }},
  { iso2:'AE', nameKo:'아랍에미리트', nameEn:'United Arab Emirates', power:{ plug:['G'], voltage:'230V', frequency:'50Hz' }},
];

const IATA = "https://www.iata.org/en/services/compliance/timatic/travel-documentation/";

SEED.forEach(c => {
  const obj = {
    iso2: c.iso2,
    nameKo: c.nameKo,
    nameEn: c.nameEn,
    power: { ...c.power, source: "WorldStandards (recheck required)" },
    visa: {
      summary: "입국·비자 최신 규정은 IATA Travel Centre 및 해당국 정부/대사관 공지를 확인하세요.",
      sources: [{ title:"IATA Travel Centre", url: IATA }]
    },
    baggage: {
      links: [
        { code:"KE", title:"대한항공 수하물", url:"https://www.koreanair.com/contents/plan-your-travel/baggage" },
        { code:"OZ", title:"아시아나항공 수하물", url:"https://flyasiana.com/C/KR/KO/contents/user-guide" }
      ]
    },
    updatedAt: nowKST
  };

  const file = path.join(outDir, `${c.iso2}.json`);
  fs.writeFileSync(file, JSON.stringify(obj, null, 2), 'utf-8');
  console.log(`✔ wrote ${path.relative(process.cwd(), file)}`);
});

console.log('\n완료: public/data/country/XX.json 20개 생성');
console.log('주의: 각 국가의 비자/입국/전압·플러그 정보는 반드시 공식 출처로 재확인하세요.');

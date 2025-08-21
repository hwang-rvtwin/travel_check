// scripts/seed-countries.js
// Generate country JSONs under public/data/country/{ISO2}.json
// Schema:
// {
//   "iso2": "JP",
//   "nameKo": "일본",
//   "nameEn": "Japan",
//   "nameCn": "日本",
//   "nameJp": "日本",
//   "power": { "plug":["A","B"], "voltage":"100V", "frequency":"50/60Hz" },
//   "airline": ["KE","OZ","JL","NH","7C","LJ","TW","BX","RS","ZE","YP","RF"],
//   "baggage": { "links": [{ "code":"KE", "name":"Korean Air", "url":"..." }, ...] },
//   "updatedAt": "2025-08-21T00:00:00+09:00",
//   "_note": "항공사/수하물 링크는 수시 변경 가능 — 운영 중 확인/보정 필요"
// }

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, 'public', 'data', 'country');
fs.mkdirSync(OUT_DIR, { recursive: true });

function nowKST() {
  const d = new Date(Date.now() + 9 * 3600 * 1000);
  return d.toISOString().replace('Z', '+09:00');
}

/* 1) 항공사 메타: 코드→표시명/공식/수하물 링크
   ※ 일부 링크는 확인/보정 필요. 운영 중 검증하세요. */
const AIRLINES = {
  // 국내
  KE: { name: 'Korean Air', url: 'https://www.koreanair.com', baggage: 'https://www.koreanair.com/kr/ko/airport/baggage' },
  OZ: { name: 'Asiana Airlines', url: 'https://flyasiana.com', baggage: 'https://flyasiana.com/C/KR/KO/contents/user-guide' },
  '7C': { name: 'Jeju Air', url: 'https://www.jejuair.net', baggage: 'https://www.jejuair.net/ko/additionalService/service/preorderedBaggage.do' },
  LJ: { name: 'Jin Air', url: 'https://www.jinair.com', baggage: 'https://www.jinair.com/ready/carryBaggage' },
  TW: { name: "T'way Air", url: 'https://www.twayair.com', baggage: 'https://www.twayair.com/app/serviceInfo/contents/1148' },
  BX: { name: 'Air Busan', url: 'https://www.airbusan.com', baggage: 'https://www.airbusan.com/content/common/service/baggage/' },
  RS: { name: 'Air Seoul', url: 'https://www.flyairseoul.com', baggage: 'https://flyairseoul.com/CW/ko/destinations.do' },
  ZE: { name: 'Eastar Jet', url: 'https://www.eastarjet.com', baggage: 'https://www.eastarjet.com/newstar/PGWIK00001?_gl=1*1rc6koi*_ga*NDU3Mjc1NTk2LjE3NTU3NDgyNTk.*_ga_3MJCE20ZX8*czE3NTU3NDgyNTkkbzEkZzEkdDE3NTU3NDgyODUkajM0JGwwJGgxODQwNTMwMDMy' },
  YP: { name: 'Air Premia', url: 'https://www.airpremia.com', baggage: 'https://www.airpremia.com/kr/ko/support/baggage/free-baggage' }, // TODO
  RF: { name: 'Aero K', url: 'https://www.aerok.com', baggage: 'https://www.aerok.com/ko-KR/travel-preparation/checked-baggage' }, // TODO

  // 일본/홍콩/대만/중국권
  JL: { name: 'Japan Airlines', url: 'https://www.jal.co.jp', baggage: 'https://www.jal.co.jp/jp/ja/inter/baggage/' },
  NH: { name: 'ANA', url: 'https://www.ana.co.jp', baggage: 'https://www.ana.co.jp/ja/jp/guide/boarding-procedures/baggage/international/' },
  CX: { name: 'Cathay Pacific', url: 'https://www.cathaypacific.com', baggage: 'https://flights.cathaypacific.com/ko_KR/baggage.html?cxsource=TOP-NAV_FLIGHTS_3_4' },
  UO: { name: 'HK Express', url: 'https://www.hkexpress.com', baggage: 'https://www.hkexpress.com/en/Plan/Extras/Baggage' },
  BR: { name: 'EVA Air', url: 'https://www.evaair.com', baggage: 'https://www.evaair.com/en-global/fly-prepare/baggage/' },
  CI: { name: 'China Airlines', url: 'https://www.china-airlines.com', baggage: 'https://www.china-airlines.com/us/en/fly/prepare-for-the-fly/baggage/baggage-rules' },
  CA: { name: 'Air China', url: 'https://www.airchina.kr', baggage: 'https://www.airchina.us/US/GB/info/checked-baggage' },
  CZ: { name: 'China Southern', url: 'https://www.csair.com', baggage: 'https://www.csair.com/en/tourguide/luggage_service/' },
  MU: { name: 'China Eastern', url: 'https://www.ceair.com', baggage: 'https://www.ceair.com/global/en_USD/Announcement/BaggageService/FreeBaggageAllowanceandSpecifications/' },
  HU: { name: 'Hainan Airlines', url: 'https://www.hainanairlines.com', baggage: 'https://www.hainanairlines.com/HUPortal/dyn/portal/DisplayPage?LANGUAGE=US&COUNTRY_SITE=US&SITE=CBHZCBHZ&PAGE=TYXL' },
  MF: { name: 'XiamenAir', url: 'https://www.xiamenair.com', baggage: 'https://www.xiamenair.com/en-us/article-detail?articleLink=%2Fcms-i18n-ow%2Fcms-en-us%2Fchannels%2F10655.json' },

  // 동남아/남아시아
  SQ: { name: 'Singapore Airlines', url: 'https://www.singaporeair.com', baggage: 'https://www.singaporeair.com/en_UK/kr/travel-info/baggage/' },
  TR: { name: 'Scoot', url: 'https://www.flyscoot.com', baggage: 'https://www.flyscoot.com/en/fly-scoot/before-you-fly/baggage' },
  MH: { name: 'Malaysia Airlines', url: 'https://www.malaysiaairlines.com', baggage: 'https://www.malaysiaairlines.com/kr/en/plan/baggage.html' },
  AK: { name: 'AirAsia', url: 'https://www.airasia.com', baggage: 'https://support.airasia.com/s/article/Baggage-Information' },
  GA: { name: 'Garuda Indonesia', url: 'https://www.garuda-indonesia.com', baggage: 'https://www.garuda-indonesia.com/other/baggage' },
  PR: { name: 'Philippine Airlines', url: 'https://www.philippineairlines.com', baggage: 'https://www.philippineairlines.com/TravelInformation/BaggageInformation' },
  '5J': { name: 'Cebu Pacific', url: 'https://www.cebupacificair.com', baggage: 'https://www.cebupacificair.com/en-PH/Pages/fees-and-charges/baggage' },
  TG: { name: 'Thai Airways', url: 'https://www.thaiairways.com', baggage: 'https://www.thaiairways.com/en/plan/baggage' },
  VN: { name: 'Vietnam Airlines', url: 'https://www.vietnamairlines.com', baggage: 'https://www.vietnamairlines.com/kr/en/plan-book/plan/baggage' },
  VJ: { name: 'VietJet Air', url: 'https://www.vietjetair.com', baggage: 'https://www.vietjetair.com' }, // TODO
  VZ: { name: 'THAI Vietjet Air', url: 'https://www.vietjetair.com', baggage: 'https://www.vietjetair.com' }, // TODO
  UL: { name: 'SriLankan Airlines', url: 'https://www.srilankan.com', baggage: 'https://www.srilankan.com/en_uk/plan-and-book/baggage' },
  AI: { name: 'Air India', url: 'https://www.airindia.com', baggage: 'https://www.airindia.com/in/en/travel-info/baggage.html' },

  // 중동/유럽
  EK: { name: 'Emirates', url: 'https://www.emirates.com', baggage: 'https://www.emirates.com/kr/english/before-you-fly/baggage/' },
  EY: { name: 'Etihad', url: 'https://www.etihad.com', baggage: 'https://www.etihad.com/en-kr/before-you-fly/baggage' },
  QR: { name: 'Qatar Airways', url: 'https://www.qatarairways.com', baggage: 'https://www.qatarairways.com/en-kr/baggage.html' },
  TK: { name: 'Turkish Airlines', url: 'https://www.turkishairlines.com', baggage: 'https://www.turkishairlines.com/en-int/any-questions/free-baggage/' },
  BA: { name: 'British Airways', url: 'https://www.britishairways.com', baggage: 'https://www.britishairways.com/en-kr/information/baggage-essentials' },
  AF: { name: 'Air France', url: 'https://www.airfrance.com', baggage: 'https://www.airfrance.kr/KR/en/common/prepare/bagages/baggages_airfrance.htm' },
  KL: { name: 'KLM', url: 'https://www.klm.com', baggage: 'https://www.klm.co.kr/information/baggage' },
  LH: { name: 'Lufthansa', url: 'https://www.lufthansa.com', baggage: 'https://www.lufthansa.com/kr/en/baggage-overview' },
  LX: { name: 'SWISS', url: 'https://www.swiss.com', baggage: 'https://www.swiss.com/kr/en/prepare/baggage' },
  OS: { name: 'Austrian', url: 'https://www.austrian.com', baggage: 'https://www.austrian.com/kr/en/baggage' },
  AY: { name: 'Finnair', url: 'https://www.finnair.com', baggage: 'https://www.finnair.com/kr-en/baggage' },
  LO: { name: 'LOT Polish', url: 'https://www.lot.com', baggage: 'https://www.lot.com/kr/en/baggage' },
  IB: { name: 'Iberia', url: 'https://www.iberia.com', baggage: 'https://www.iberia.com/es/en/baggage/' },
  AZ: { name: 'ITA Airways', url: 'https://www.ita-airways.com', baggage: 'https://www.ita-airways.com/en_en/fly-ita/baggage.html' },
  SN: { name: 'Brussels Airlines', url: 'https://www.brusselsairlines.com', baggage: 'https://www.brusselsairlines.com/en-kr/practical-information/travel-info/baggage' },

  // 미주/대양주
  UA: { name: 'United', url: 'https://www.united.com', baggage: 'https://www.united.com/en/kr/fly/travel/baggage.html' },
  DL: { name: 'Delta', url: 'https://www.delta.com', baggage: 'https://www.delta.com/us/en/baggage/overview' },
  AA: { name: 'American Airlines', url: 'https://www.aa.com', baggage: 'https://www.aa.com/i18n/travel-info/baggage/checked-baggage.jsp' },
  HA: { name: 'Hawaiian', url: 'https://www.hawaiianairlines.com', baggage: 'https://www.hawaiianairlines.com/ko-kr/travel-information/baggage' },
  AC: { name: 'Air Canada', url: 'https://www.aircanada.com', baggage: 'https://www.aircanada.com/kr/en/aco/home/plan/baggage.html' },
  NZ: { name: 'Air New Zealand', url: 'https://www.airnewzealand.co.kr', baggage: 'https://www.airnewzealand.co.kr/baggage' },
  QF: { name: 'Qantas', url: 'https://www.qantas.com', baggage: 'https://www.qantas.com/kr/en/travel-info/baggage.html' },
};

/* 2) 전압/플러그(간단 매핑) */
const POWER = {
  KR: { plug:['C','F'], voltage:'220V', frequency:'60Hz' },
  JP: { plug:['A','B'], voltage:'100V', frequency:'50/60Hz' },
  HK: { plug:['G'], voltage:'220V', frequency:'50Hz' },
  MO: { plug:['G'], voltage:'220V', frequency:'50Hz' },
  TW: { plug:['A','B'], voltage:'110V', frequency:'60Hz' },
  CN: { plug:['A','C','I'], voltage:'220V', frequency:'50Hz' },
  SG: { plug:['G'], voltage:'230V', frequency:'50Hz' },
  MY: { plug:['G'], voltage:'230V', frequency:'50Hz' },
  TH: { plug:['A','B','C'], voltage:'230V', frequency:'50Hz' },
  VN: { plug:['A','C'], voltage:'220V', frequency:'50Hz' },
  ID: { plug:['C','F'], voltage:'230V', frequency:'50Hz' },
  PH: { plug:['A','B','C'], voltage:'220V', frequency:'60Hz' },
  IN: { plug:['C','D','M'], voltage:'230V', frequency:'50Hz' },
  AE: { plug:['G'], voltage:'230V', frequency:'50Hz' },
  QA: { plug:['G'], voltage:'240V', frequency:'50Hz' },
  TR: { plug:['C','F'], voltage:'230V', frequency:'50Hz' },
  IL: { plug:['C','H'], voltage:'230V', frequency:'50Hz' },
  SA: { plug:['G'], voltage:'230V', frequency:'60Hz' },
  EG: { plug:['C','F'], voltage:'220V', frequency:'50Hz' },
  MA: { plug:['C','E'], voltage:'220V', frequency:'50Hz' },
  ZA: { plug:['M','C','N'], voltage:'230V', frequency:'50Hz' },
  KE: { plug:['G'], voltage:'240V', frequency:'50Hz' }, // Kenya
  ET: { plug:['C','F'], voltage:'220V', frequency:'50Hz' },

  US: { plug:['A','B'], voltage:'120V', frequency:'60Hz' },
  CA: { plug:['A','B'], voltage:'120V', frequency:'60Hz' },
  MX: { plug:['A','B'], voltage:'127V', frequency:'60Hz' },
  BR: { plug:['C','N'], voltage:'127/220V', frequency:'60Hz' },
  AR: { plug:['C','I'], voltage:'220V', frequency:'50Hz' },
  CL: { plug:['C','L'], voltage:'220V', frequency:'50Hz' },
  PE: { plug:['A','C'], voltage:'220V', frequency:'60Hz' },

  GB: { plug:['G'], voltage:'230V', frequency:'50Hz' },
  FR: { plug:['C','E'], voltage:'230V', frequency:'50Hz' },
  DE: { plug:['C','F'], voltage:'230V', frequency:'50Hz' },
  NL: { plug:['C','F'], voltage:'230V', frequency:'50Hz' },
  IT: { plug:['C','F','L'], voltage:'230V', frequency:'50Hz' },
  ES: { plug:['C','F'], voltage:'230V', frequency:'50Hz' },
  CH: { plug:['C','J'], voltage:'230V', frequency:'50Hz' },
  AT: { plug:['C','F'], voltage:'230V', frequency:'50Hz' },
  CZ: { plug:['C','E'], voltage:'230V', frequency:'50Hz' },
  PL: { plug:['C','E'], voltage:'230V', frequency:'50Hz' },
  PT: { plug:['C','F'], voltage:'230V', frequency:'50Hz' },
  GR: { plug:['C','F'], voltage:'230V', frequency:'50Hz' },
  SE: { plug:['C','F'], voltage:'230V', frequency:'50Hz' },
  NO: { plug:['C','F'], voltage:'230V', frequency:'50Hz' },
  DK: { plug:['K','C'], voltage:'230V', frequency:'50Hz' },
  FI: { plug:['C','F'], voltage:'230V', frequency:'50Hz' },
  IE: { plug:['G'], voltage:'230V', frequency:'50Hz' },
  BE: { plug:['C','E'], voltage:'230V', frequency:'50Hz' },

  AU: { plug:['I'], voltage:'230V', frequency:'50Hz' },
  NZ: { plug:['I'], voltage:'230V', frequency:'50Hz' },
  GU: { plug:['A','B'], voltage:'110V', frequency:'60Hz' },
  MP: { plug:['A','B'], voltage:'110V', frequency:'60Hz' },

  // 새로 추가되는 6개
  HU: { plug:['C','F'], voltage:'230V', frequency:'50Hz' },                 // Hungary
  JO: { plug:['C','D','F','G'], voltage:'230V', frequency:'50Hz' },        // Jordan
  LK: { plug:['D','G','M'], voltage:'230V', frequency:'50Hz' },            // Sri Lanka
  MM: { plug:['C','D','F','G'], voltage:'230V', frequency:'50Hz' },        // Myanmar
  MV: { plug:['D','G','J','K','L'], voltage:'230V', frequency:'50Hz' },    // Maldives
  NP: { plug:['C','D','M'], voltage:'230V', frequency:'50Hz' },            // Nepal
};

/* 3) SEED: 인천 포함 한국 국제공항을 통해 많이 가는 대표 국가 (확장 가능) */
const SEED = [
  // Korea (참조)
  { iso2:'KR', nameKo:'대한민국', nameEn:'South Korea', nameCn:'韩国', nameJp:'韓国',
    airline:['KE','OZ','7C','LJ','TW','BX','RS','ZE','YP','RF'], power: POWER.KR },

  // East Asia
  { iso2:'JP', nameKo:'일본', nameEn:'Japan', nameCn:'日本', nameJp:'日本',
    airline:['KE','OZ','7C','LJ','TW','BX','RS','ZE','JL','NH','YP','RF'], power: POWER.JP },
  { iso2:'HK', nameKo:'홍콩', nameEn:'Hong Kong', nameCn:'香港', nameJp:'香港',
    airline:['KE','OZ','7C','TW','LJ','ZE','RS','CX','UO'], power: POWER.HK },
  { iso2:'MO', nameKo:'마카오', nameEn:'Macao', nameCn:'澳门', nameJp:'マカオ',
    airline:['TW','7C','ZE'], power: POWER.MO },
  { iso2:'TW', nameKo:'대만', nameEn:'Taiwan', nameCn:'台湾', nameJp:'台湾',
    airline:['KE','OZ','7C','LJ','TW','BR','CI'], power: POWER.TW },
  { iso2:'CN', nameKo:'중국', nameEn:'China', nameCn:'中国', nameJp:'中国',
    airline:['KE','OZ','CA','CZ','MU','HU','MF'], power: POWER.CN },

  // Southeast / South Asia
  { iso2:'SG', nameKo:'싱가포르', nameEn:'Singapore', nameCn:'新加坡', nameJp:'シンガポール',
    airline:['KE','OZ','SQ','TR','7C','LJ','TW'], power: POWER.SG },
  { iso2:'MY', nameKo:'말레이시아', nameEn:'Malaysia', nameCn:'马来西亚', nameJp:'マレーシア',
    airline:['KE','OZ','MH','AK','TW','7C'], power: POWER.MY },
  { iso2:'TH', nameKo:'태국', nameEn:'Thailand', nameCn:'泰国', nameJp:'タイ',
    airline:['KE','OZ','TG','7C','LJ','TW','VZ'], power: POWER.TH },
  { iso2:'VN', nameKo:'베트남', nameEn:'Viet Nam', nameCn:'越南', nameJp:'ベトナム',
    airline:['KE','OZ','VN','VJ','7C','TW','LJ'], power: POWER.VN },
  { iso2:'ID', nameKo:'인도네시아', nameEn:'Indonesia', nameCn:'印度尼西亚', nameJp:'インドネシア',
    airline:['KE','GA','TW'], power: POWER.ID },
  { iso2:'PH', nameKo:'필리핀', nameEn:'Philippines', nameCn:'菲律宾', nameJp:'フィリピン',
    airline:['KE','OZ','PR','5J','7C','LJ','TW'], power: POWER.PH },

  // South Asia – 추가 3개
  { iso2:'LK', nameKo:'스리랑카', nameEn:'Sri Lanka', nameCn:'斯里兰卡', nameJp:'スリランカ',
    airline:['UL','QR','EK','SQ','AK'], power: POWER.LK },
  { iso2:'NP', nameKo:'네팔', nameEn:'Nepal', nameCn:'尼泊尔', nameJp:'ネパール',
    airline:['QR','TK','AI','SQ'], power: POWER.NP },
  { iso2:'MM', nameKo:'미얀마', nameEn:'Myanmar', nameCn:'缅甸', nameJp:'ミャンマー',
    airline:['TG','QR','EK','AK'], power: POWER.MM },

  // Middle East – 추가 1개
  { iso2:'JO', nameKo:'요르단', nameEn:'Jordan', nameCn:'约旦', nameJp:'ヨルダン',
    airline:['QR','EK','TK','EY'], power: POWER.JO },

  // Europe (+ Hungary)
  { iso2:'HU', nameKo:'헝가리', nameEn:'Hungary', nameCn:'匈牙利', nameJp:'ハンガリー',
    airline:['KE','TK','QR','LO','OS'], power: POWER.HU },
  { iso2:'GB', nameKo:'영국', nameEn:'United Kingdom', nameCn:'英国', nameJp:'イギリス',
    airline:['KE','BA'], power: POWER.GB },
  { iso2:'FR', nameKo:'프랑스', nameEn:'France', nameCn:'法国', nameJp:'フランス',
    airline:['KE','AF'], power: POWER.FR },
  { iso2:'DE', nameKo:'독일', nameEn:'Germany', nameCn:'德国', nameJp:'ドイツ',
    airline:['KE','LH'], power: POWER.DE },
  { iso2:'NL', nameKo:'네덜란드', nameEn:'Netherlands', nameCn:'荷兰', nameJp:'オランダ',
    airline:['KE','KL'], power: POWER.NL },
  { iso2:'IT', nameKo:'이탈리아', nameEn:'Italy', nameCn:'意大利', nameJp:'イタリア',
    airline:['KE','AZ','TK'], power: POWER.IT },
  { iso2:'ES', nameKo:'스페인', nameEn:'Spain', nameCn:'西班牙', nameJp:'スペイン',
    airline:['KE','IB','TK'], power: POWER.ES },
  { iso2:'CH', nameKo:'스위스', nameEn:'Switzerland', nameCn:'瑞士', nameJp:'スイス',
    airline:['KE','LX'], power: POWER.CH },
  { iso2:'AT', nameKo:'오스트리아', nameEn:'Austria', nameCn:'奥地利', nameJp:'オーストリア',
    airline:['KE','OS','TK'], power: POWER.AT },
  { iso2:'CZ', nameKo:'체코', nameEn:'Czechia', nameCn:'捷克', nameJp:'チェコ',
    airline:['KE','TK'], power: POWER.CZ },
  { iso2:'PL', nameKo:'폴란드', nameEn:'Poland', nameCn:'波兰', nameJp:'ポーランド',
    airline:['KE','LO','TK'], power: POWER.PL },
  { iso2:'PT', nameKo:'포르투갈', nameEn:'Portugal', nameCn:'葡萄牙', nameJp:'ポルトガル',
    airline:['KE','TK'], power: POWER.PT },
  { iso2:'GR', nameKo:'그리스', nameEn:'Greece', nameCn:'希腊', nameJp:'ギリシャ',
    airline:['KE','TK'], power: POWER.GR },
  { iso2:'SE', nameKo:'스웨덴', nameEn:'Sweden', nameCn:'瑞典', nameJp:'スウェーデン',
    airline:['KE','TK'], power: POWER.SE },
  { iso2:'NO', nameKo:'노르웨이', nameEn:'Norway', nameCn:'挪威', nameJp:'ノルウェー',
    airline:['KE','TK'], power: POWER.NO },
  { iso2:'DK', nameKo:'덴마크', nameEn:'Denmark', nameCn:'丹麦', nameJp:'デンマーク',
    airline:['KE','TK'], power: POWER.DK },
  { iso2:'FI', nameKo:'핀란드', nameEn:'Finland', nameCn:'芬兰', nameJp:'フィンランド',
    airline:['KE','AY'], power: POWER.FI },
  { iso2:'IE', nameKo:'아일랜드', nameEn:'Ireland', nameCn:'爱尔兰', nameJp:'アイルランド',
    airline:['KE','BA'], power: POWER.IE },
  { iso2:'BE', nameKo:'벨기에', nameEn:'Belgium', nameCn:'比利时', nameJp:'ベルギー',
    airline:['KE','SN','AF','KL'], power: POWER.BE },

  // Oceania
  { iso2:'AU', nameKo:'호주', nameEn:'Australia', nameCn:'澳大利亚', nameJp:'オーストラリア',
    airline:['KE','QF'], power: POWER.AU },
  { iso2:'NZ', nameKo:'뉴질랜드', nameEn:'New Zealand', nameCn:'新西兰', nameJp:'ニュージーランド',
    airline:['KE','NZ'], power: POWER.NZ },
  { iso2:'MV', nameKo:'몰디브', nameEn:'Maldives', nameCn:'马尔代夫', nameJp:'モルディブ',
    airline:['SQ','QR','EK','UL','TR'], power: POWER.MV },
  { iso2:'GU', nameKo:'괌(미국령)', nameEn:'Guam', nameCn:'关岛', nameJp:'グアム',
    airline:['KE','7C','TW','LJ'], power: POWER.GU },
  { iso2:'MP', nameKo:'사이판(미국령)', nameEn:'Northern Mariana Islands', nameCn:'北马里亚纳群岛', nameJp:'北マリアナ諸島',
    airline:['KE','7C','TW'], power: POWER.MP },

  // Americas
  { iso2:'US', nameKo:'미국', nameEn:'United States', nameCn:'美国', nameJp:'アメリカ合衆国',
    airline:['KE','OZ','YP','UA','DL','AA','HA'], power: POWER.US },
  { iso2:'CA', nameKo:'캐나다', nameEn:'Canada', nameCn:'加拿大', nameJp:'カナダ',
    airline:['KE','OZ','YP','AC'], power: POWER.CA },
  { iso2:'MX', nameKo:'멕시코', nameEn:'Mexico', nameCn:'墨西哥', nameJp:'メキシコ',
    airline:['KE','AA','UA','DL'], power: POWER.MX },
  { iso2:'BR', nameKo:'브라질', nameEn:'Brazil', nameCn:'巴西', nameJp:'ブラジル',
    airline:['KE','AF','KL','TK','QR'], power: POWER.BR },
  { iso2:'AR', nameKo:'아르헨티나', nameEn:'Argentina', nameCn:'阿根廷', nameJp:'アルゼンチン',
    airline:['KE','AF','KL','TK','QR'], power: POWER.AR },
  { iso2:'CL', nameKo:'칠레', nameEn:'Chile', nameCn:'智利', nameJp:'チリ',
    airline:['KE','AF','KL','TK','QR'], power: POWER.CL },
  { iso2:'PE', nameKo:'페루', nameEn:'Peru', nameCn:'秘鲁', nameJp:'ペルー',
    airline:['KE','AF','KL','TK','QR'], power: POWER.PE },

  // Africa (대표)
  { iso2:'EG', nameKo:'이집트', nameEn:'Egypt', nameCn:'埃及', nameJp:'エジプト',
    airline:['KE','TK','QR','EK'], power: POWER.EG },
  { iso2:'MA', nameKo:'모로코', nameEn:'Morocco', nameCn:'摩洛哥', nameJp:'モロッコ',
    airline:['KE','TK','QR','EK'], power: POWER.MA },
  { iso2:'ZA', nameKo:'남아프리카공화국', nameEn:'South Africa', nameCn:'南非', nameJp:'南アフリカ共和国',
    airline:['KE','QR','EK'], power: POWER.ZA },
  { iso2:'KE', nameKo:'케냐', nameEn:'Kenya', nameCn:'肯尼亚', nameJp:'ケニア',
    airline:['KE','QR','EK'], power: POWER.KE },
  { iso2:'ET', nameKo:'에티오피아', nameEn:'Ethiopia', nameCn:'埃塞俄比亚', nameJp:'エチオピア',
    airline:['QR','EK','TK'], power: POWER.ET },
];

/* 4) 유틸 & 메인 */
function uniq(arr) { return Array.from(new Set(arr.filter(Boolean))); }

function buildBaggageLinks(airlineCodes) {
  const codes = uniq(airlineCodes);
  const links = [];
  for (const code of codes) {
    const meta = AIRLINES[code];
    if (!meta) {
      links.push({ code, name: code, url: null });
      continue;
    }
    links.push({ code, name: meta.name, url: meta.baggage || null });
  }
  return links;
}

function writeCountry(c) {
  const iso2 = String(c.iso2 || '').toUpperCase();
  if (!iso2 || iso2.length !== 2) {
    console.warn('! skip invalid ISO2 entry:', c);
    return;
  }
  const nameKo = c.nameKo || iso2;
  const nameEn = c.nameEn || iso2;
  const nameCn = c.nameCn || nameEn;
  const nameJp = c.nameJp || nameEn;
  const power = c.power || null;
  const airline = uniq(c.airline || []);
  const baggageLinks = buildBaggageLinks(airline);

  const out = {
    iso2,
    nameKo, nameEn, nameCn, nameJp,
    power,
    airline,
    baggage: { links: baggageLinks },
    updatedAt: nowKST(),
    _note: '항공사/수하물 링크는 수시 변경 가능 — 운영 중 확인/보정 필요',
  };

  const fp = path.join(OUT_DIR, `${iso2}.json`);
  fs.writeFileSync(fp, JSON.stringify(out, null, 2));
  console.log(`✓ wrote ${path.relative(ROOT, fp)}`);
}

function main() {
  console.log(`Generating country JSONs → ${path.relative(ROOT, OUT_DIR)}`);
  for (const c of SEED) writeCountry(c);
  console.log('Done.');
}

main();

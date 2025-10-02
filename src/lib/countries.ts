// src/lib/countries.ts

export type ISO2 =
  | "KR" | "JP" | "CN" | "TW" | "HK" | "TH" | "VN" | "PH" | "MY" | "SG"
  | "ID" | "US" | "CA" | "MX" | "GB" | "FR" | "DE" | "IT" | "ES" | "AU";

export type ClimateBand =
  | "temperate"        // 온대
  | "tropical"         // 열대/아열대
  | "arid"             // 건조/사막
  | "continental"      // 대륙성
  | "mediterranean";   // 지중해성

export interface CountryMeta {
  iso2: ISO2;
  slug: string;           // e.g. "korea", "japan"
  nameKo: string;         // 한국어 국가명
  flag: string;           // emoji
  tz: string;             // IANA timezone (대표 도시)
  lat: number;            // 대표 좌표(수도 위주)
  lon: number;
  climate: ClimateBand;
  seasonTagByMonth: Record<number, "우기" | "건기" | "성수기" | "비수기" | "평년">;
}

export const COUNTRIES: CountryMeta[] = [
  {
    iso2: "KR", slug: "south-korea", nameKo: "대한민국", flag: "🇰🇷", tz: "Asia/Seoul",
    lat: 37.5665, lon: 126.9780, climate: "temperate",
    seasonTagByMonth: { 1:"비수기",2:"비수기",3:"평년",4:"평년",5:"성수기",6:"평년",7:"성수기",8:"성수기",9:"평년",10:"성수기",11:"평년",12:"비수기" }
  },
  {
    iso2: "JP", slug: "japan", nameKo: "일본", flag: "🇯🇵", tz: "Asia/Tokyo",
    lat: 35.6762, lon: 139.6503, climate: "temperate",
    seasonTagByMonth: { 1:"비수기",2:"비수기",3:"평년",4:"성수기",5:"평년",6:"평년",7:"성수기",8:"성수기",9:"평년",10:"평년",11:"성수기",12:"비수기" }
  },
  {
    iso2: "CN", slug: "china", nameKo: "중국", flag: "🇨🇳", tz: "Asia/Shanghai",
    lat: 39.9042, lon: 116.4074, climate: "continental",
    seasonTagByMonth: { 1:"비수기",2:"비수기",3:"평년",4:"성수기",5:"성수기",6:"평년",7:"평년",8:"평년",9:"성수기",10:"성수기",11:"평년",12:"비수기" }
  },
  {
    iso2: "TW", slug: "taiwan", nameKo: "대만", flag: "🇹🇼", tz: "Asia/Taipei",
    lat: 25.0330, lon: 121.5654, climate: "tropical",
    seasonTagByMonth: { 1:"성수기",2:"건기",3:"건기",4:"건기",5:"우기",6:"우기",7:"우기",8:"우기",9:"우기",10:"우기",11:"건기",12:"성수기" }
  },
  {
    iso2: "HK", slug: "hong-kong", nameKo: "홍콩", flag: "🇭🇰", tz: "Asia/Hong_Kong",
    lat: 22.3193, lon: 114.1694, climate: "tropical",
    seasonTagByMonth: { 1:"성수기",2:"건기",3:"건기",4:"건기",5:"우기",6:"우기",7:"우기",8:"우기",9:"우기",10:"우기",11:"건기",12:"성수기" }
  },
  {
    iso2: "TH", slug: "thailand", nameKo: "태국", flag: "🇹🇭", tz: "Asia/Bangkok",
    lat: 13.7563, lon: 100.5018, climate: "tropical",
    seasonTagByMonth: { 1:"성수기",2:"건기",3:"건기",4:"건기",5:"우기",6:"우기",7:"우기",8:"우기",9:"우기",10:"우기",11:"건기",12:"성수기" }
  },
  {
    iso2: "VN", slug: "vietnam", nameKo: "베트남", flag: "🇻🇳", tz: "Asia/Ho_Chi_Minh",
    lat: 21.0278, lon: 105.8342, climate: "tropical",
    seasonTagByMonth: { 1:"성수기",2:"건기",3:"건기",4:"건기",5:"우기",6:"우기",7:"우기",8:"우기",9:"우기",10:"우기",11:"건기",12:"성수기" }
  },
  {
    iso2: "PH", slug: "philippines", nameKo: "필리핀", flag: "🇵🇭", tz: "Asia/Manila",
    lat: 14.5995, lon: 120.9842, climate: "tropical",
    seasonTagByMonth: { 1:"성수기",2:"건기",3:"건기",4:"건기",5:"우기",6:"우기",7:"우기",8:"우기",9:"우기",10:"우기",11:"건기",12:"성수기" }
  },
  {
    iso2: "MY", slug: "malaysia", nameKo: "말레이시아", flag: "🇲🇾", tz: "Asia/Kuala_Lumpur",
    lat: 3.1390, lon: 101.6869, climate: "tropical",
    seasonTagByMonth: { 1:"성수기",2:"건기",3:"건기",4:"건기",5:"우기",6:"우기",7:"우기",8:"우기",9:"우기",10:"우기",11:"건기",12:"성수기" }
  },
  {
    iso2: "SG", slug: "singapore", nameKo: "싱가포르", flag: "🇸🇬", tz: "Asia/Singapore",
    lat: 1.3521, lon: 103.8198, climate: "tropical",
    seasonTagByMonth: { 1:"성수기",2:"건기",3:"건기",4:"건기",5:"우기",6:"우기",7:"우기",8:"우기",9:"우기",10:"우기",11:"건기",12:"성수기" }
  },
  {
    iso2: "ID", slug: "indonesia", nameKo: "인도네시아", flag: "🇮🇩", tz: "Asia/Jakarta",
    lat: -6.2088, lon: 106.8456, climate: "tropical",
    seasonTagByMonth: { 1:"성수기",2:"건기",3:"건기",4:"건기",5:"우기",6:"우기",7:"우기",8:"우기",9:"우기",10:"우기",11:"건기",12:"성수기" }
  },
  {
    iso2: "US", slug: "united-states", nameKo: "미국", flag: "🇺🇸", tz: "America/New_York",
    lat: 40.7128, lon: -74.0060, climate: "continental",
    seasonTagByMonth: { 1:"비수기",2:"비수기",3:"평년",4:"평년",5:"평년",6:"성수기",7:"성수기",8:"성수기",9:"평년",10:"평년",11:"평년",12:"성수기" }
  },
  {
    iso2: "CA", slug: "canada", nameKo: "캐나다", flag: "🇨🇦", tz: "America/Toronto",
    lat: 43.6532, lon: -79.3832, climate: "continental",
    seasonTagByMonth: { 1:"비수기",2:"비수기",3:"평년",4:"평년",5:"평년",6:"성수기",7:"성수기",8:"성수기",9:"평년",10:"평년",11:"평년",12:"성수기" }
  },
  {
    iso2: "MX", slug: "mexico", nameKo: "멕시코", flag: "🇲🇽", tz: "America/Mexico_City",
    lat: 19.4326, lon: -99.1332, climate: "arid",
    seasonTagByMonth: { 1:"성수기",2:"건기",3:"건기",4:"건기",5:"우기",6:"우기",7:"우기",8:"우기",9:"우기",10:"우기",11:"건기",12:"성수기" }
  },
  {
    iso2: "GB", slug: "united-kingdom", nameKo: "영국", flag: "🇬🇧", tz: "Europe/London",
    lat: 51.5074, lon: -0.1278, climate: "temperate",
    seasonTagByMonth: { 1:"비수기",2:"비수기",3:"평년",4:"평년",5:"평년",6:"성수기",7:"성수기",8:"성수기",9:"평년",10:"평년",11:"평년",12:"비수기" }
  },
  {
    iso2: "FR", slug: "france", nameKo: "프랑스", flag: "🇫🇷", tz: "Europe/Paris",
    lat: 48.8566, lon: 2.3522, climate: "temperate",
    seasonTagByMonth: { 1:"비수기",2:"비수기",3:"평년",4:"평년",5:"평년",6:"성수기",7:"성수기",8:"성수기",9:"평년",10:"평년",11:"평년",12:"비수기" }
  },
  {
    iso2: "DE", slug: "germany", nameKo: "독일", flag: "🇩🇪", tz: "Europe/Berlin",
    lat: 52.5200, lon: 13.4050, climate: "continental",
    seasonTagByMonth: { 1:"비수기",2:"비수기",3:"평년",4:"평년",5:"평년",6:"성수기",7:"성수기",8:"성수기",9:"평년",10:"평년",11:"평년",12:"비수기" }
  },
  {
    iso2: "IT", slug: "italy", nameKo: "이탈리아", flag: "🇮🇹", tz: "Europe/Rome",
    lat: 41.9028, lon: 12.4964, climate: "mediterranean",
    seasonTagByMonth: { 1:"비수기",2:"비수기",3:"평년",4:"평년",5:"성수기",6:"성수기",7:"성수기",8:"성수기",9:"성수기",10:"평년",11:"평년",12:"비수기" }
  },
  {
    iso2: "ES", slug: "spain", nameKo: "스페인", flag: "🇪🇸", tz: "Europe/Madrid",
    lat: 40.4168, lon: -3.7038, climate: "mediterranean",
    seasonTagByMonth: { 1:"비수기",2:"비수기",3:"평년",4:"평년",5:"성수기",6:"성수기",7:"성수기",8:"성수기",9:"성수기",10:"평년",11:"평년",12:"비수기" }
  },
  {
    iso2: "AU", slug: "australia", nameKo: "호주", flag: "🇦🇺", tz: "Australia/Sydney",
    lat: -33.8688, lon: 151.2093, climate: "temperate",
    seasonTagByMonth: { 1:"성수기",2:"성수기",3:"평년",4:"평년",5:"평년",6:"비수기",7:"비수기",8:"비수기",9:"평년",10:"평년",11:"평년",12:"성수기" }
  },
];

export const COUNTRY_SLUGS = COUNTRIES.map(c => c.slug) as readonly string[];
export const MONTH_SLUGS = [
  "01","02","03","04","05","06","07","08","09","10","11","12",
] as const;

// (선택) 타입 유니온이 필요하면 함께 추가
export type MonthSlug = typeof MONTH_SLUGS[number];

export function findCountryBySlug(slug: string) {
  return COUNTRIES.find(c => c.slug === slug);
}

export function isMonthSlug(v: string): v is MonthSlug {
  // readonly tuple -> string[]로 넓혀서 런타임 체크
  return (MONTH_SLUGS as readonly string[]).includes(v);
}
// countries.ts (하단에 추가)

// 월별 평균 기온 타입
export type MonthlyClimate = {
  /** 12개 요소, 0=1월 … 11=12월 */
  avgMinC: readonly number[];
  avgMaxC: readonly number[];
  /** 참고용 대표 도시 */
  representative?: string;
};

// 나라 슬러그 → 월별 평균 기온(°C)
export const COUNTRY_MONTHLY_CLIMATE: Readonly<Record<string, MonthlyClimate>> = {
  // 아시아
  korea: { // 서울
    representative: "Seoul",
    avgMinC: [-5,-3,1,7,12,17,22,22,17,10,4,-1],
    avgMaxC: [ 2, 4,10,17,22,27,30,31,26,20,12, 4],
  },
  japan: { // 도쿄
    representative: "Tokyo",
    avgMinC: [1,2,4,9,14,18,22,24,21,15,10,5],
    avgMaxC: [10,11,14,19,23,26,30,32,28,22,17,12],
  },
  china: { // 베이징
    representative: "Beijing",
    avgMinC: [-8,-6,0,8,14,20,23,22,16,8,0,-6],
    avgMaxC: [ 2, 5,13,20,26,30,31,30,26,19,10, 3],
  },
  "taiwan": { // 타이베이
    representative: "Taipei",
    avgMinC: [13,13,15,18,21,23,25,25,24,22,19,15],
    avgMaxC: [19,20,22,25,28,31,33,33,31,28,24,21],
  },
  "hong-kong": {
    representative: "Hong Kong",
    avgMinC: [14,15,17,21,24,26,27,27,26,24,20,16],
    avgMaxC: [19,20,23,26,29,31,32,32,31,29,25,21],
  },
  thailand: { // 방콕
    representative: "Bangkok",
    avgMinC: [22,24,26,27,26,25,25,25,25,24,23,21],
    avgMaxC: [32,33,34,35,34,33,32,32,32,32,31,31],
  },
  vietnam: { // 호찌민
    representative: "Ho Chi Minh City",
    avgMinC: [22,23,24,26,26,25,25,25,25,24,24,22],
    avgMaxC: [32,33,34,35,34,33,32,32,32,31,31,31],
  },
  philippines: { // 마닐라
    representative: "Manila",
    avgMinC: [23,23,24,25,25,25,24,24,24,24,24,23],
    avgMaxC: [30,31,32,33,33,32,31,31,31,31,31,30],
  },
  malaysia: { // 쿠알라룸푸르
    representative: "Kuala Lumpur",
    avgMinC: [23,23,23,24,24,24,24,24,24,24,24,23],
    avgMaxC: [32,33,33,33,33,32,32,32,32,32,32,32],
  },
  singapore: {
    representative: "Singapore",
    avgMinC: [24,24,25,25,25,25,25,25,25,25,24,24],
    avgMaxC: [30,31,31,32,32,31,31,31,31,31,31,30],
  },
  indonesia: { // 자카르타
    representative: "Jakarta",
    avgMinC: [24,24,24,24,24,24,24,24,24,24,24,24],
    avgMaxC: [30,31,31,31,31,31,31,31,31,31,31,31],
  },

  // 아메리카
  "united-states": { // 로스앤젤레스
    representative: "Los Angeles",
    avgMinC: [9,10,11,13,15,17,19,19,18,16,12,9],
    avgMaxC: [20,20,21,23,24,27,29,30,29,27,23,20],
  },
  canada: { // 토론토
    representative: "Toronto",
    avgMinC: [-8,-7,-3,3,9,14,17,17,12,6,1,-5],
    avgMaxC: [-1,0,5,12,18,24,27,26,22,15,8,1],
  },
  mexico: { // 멕시코시티
    representative: "Mexico City",
    avgMinC: [6,7,9,10,12,12,11,11,11,9,7,6],
    avgMaxC: [21,23,25,26,26,24,23,23,22,22,22,21],
  },

  // 유럽
  "united-kingdom": { // 런던
    representative: "London",
    avgMinC: [2,2,4,6,9,12,15,15,12,9,5,3],
    avgMaxC: [8,9,12,15,18,21,23,22,20,15,11,9],
  },
  france: { // 파리
    representative: "Paris",
    avgMinC: [2,3,5,7,10,13,16,16,13,10,6,3],
    avgMaxC: [7,9,12,16,19,23,26,26,22,17,11,8],
  },
  germany: { // 베를린
    representative: "Berlin",
    avgMinC: [-2,-1,1,5,9,12,15,15,12,8,3,0],
    avgMaxC: [ 2, 4,8,13,18,22,24,24,19,13,7,3],
  },
  italy: { // 로마
    representative: "Rome",
    avgMinC: [4,5,7,10,13,17,20,20,17,13,9,5],
    avgMaxC: [12,13,16,19,23,28,31,31,27,22,16,13],
  },
  spain: { // 마드리드
    representative: "Madrid",
    avgMinC: [1,2,4,6,10,14,18,18,15,10,6,3],
    avgMaxC: [10,12,16,19,24,30,34,33,28,21,14,10],
  },

  // 오세아니아
  australia: { // 시드니
    representative: "Sydney",
    avgMinC: [19,19,18,15,12,9,8,9,11,14,16,18],
    avgMaxC: [26,26,25,23,20,17,16,17,20,22,24,25],
  },
  "new-zealand": { // 오클랜드
    representative: "Auckland",
    avgMinC: [16,16,15,12,9,7,7,8,10,12,14,15],
    avgMaxC: [23,24,22,20,17,15,14,15,16,18,20,22],
  },

  // 중동
  "united-arab-emirates": { // 두바이
    representative: "Dubai",
    avgMinC: [14,16,18,22,26,29,31,31,28,24,20,16],
    avgMaxC: [24,25,28,33,38,40,41,41,39,35,31,26],
  },

  // 튀르키예
  turkiye: { // 이스탄불
    representative: "Istanbul",
    avgMinC: [3,3,4,8,12,17,19,20,17,13,9,6],
    avgMaxC: [8,9,11,16,21,26,29,29,25,20,15,11],
  },
} as const;

// 헬퍼: 나라 슬러그로 월별 기후 얻기
export function getCountryMonthlyClimate(slug: string): MonthlyClimate | undefined {
  return COUNTRY_MONTHLY_CLIMATE[slug];
}

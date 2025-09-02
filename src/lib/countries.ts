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
    iso2: "KR", slug: "korea", nameKo: "대한민국", flag: "🇰🇷", tz: "Asia/Seoul",
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

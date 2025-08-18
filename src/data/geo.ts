// src/data/geo.ts
export type City = { cityKo: string; cityEn: string; iata: string; lat: number; lon: number };
export type Country = { iso2: string; nameKo: string; nameEn: string; cities: City[] };

export const COUNTRIES: Country[] = [
  {
    iso2: "KR", nameKo: "대한민국", nameEn: "South Korea",
    cities: [
      { cityKo: "서울(인천)", cityEn: "Seoul (Incheon)", iata: "ICN", lat: 37.4602, lon: 126.4407 },
      { cityKo: "서울(김포)", cityEn: "Seoul (Gimpo)", iata: "GMP", lat: 37.5583, lon: 126.7906 },
      { cityKo: "부산", cityEn: "Busan (Gimhae)", iata: "PUS", lat: 35.1796, lon: 128.9381 },
      { cityKo: "제주", cityEn: "Jeju", iata: "CJU", lat: 33.5104, lon: 126.4914 }
    ]
  },
  {
    iso2: "JP", nameKo: "일본", nameEn: "Japan",
    cities: [
      { cityKo: "도쿄(하네다)", cityEn: "Tokyo (Haneda)", iata: "HND", lat: 35.5494, lon: 139.7798 },
      { cityKo: "도쿄(나리타)", cityEn: "Tokyo (Narita)", iata: "NRT", lat: 35.7732, lon: 140.3874 },
      { cityKo: "오사카(간사이)", cityEn: "Osaka (Kansai)", iata: "KIX", lat: 34.4340, lon: 135.2440 },
      { cityKo: "후쿠오카", cityEn: "Fukuoka", iata: "FUK", lat: 33.5859, lon: 130.4500 },
      { cityKo: "삿포로(치토세)", cityEn: "Sapporo (CTS)", iata: "CTS", lat: 42.7752, lon: 141.6923 }
    ]
  },
  {
    iso2: "US", nameKo: "미국", nameEn: "United States",
    cities: [
      { cityKo: "LA", cityEn: "Los Angeles", iata: "LAX", lat: 33.9416, lon: -118.4085 },
      { cityKo: "뉴욕(JFK)", cityEn: "New York (JFK)", iata: "JFK", lat: 40.6413, lon: -73.7781 },
      { cityKo: "샌프란시스코", cityEn: "San Francisco", iata: "SFO", lat: 37.6213, lon: -122.3790 }
    ]
  },
  {
    iso2: "SG", nameKo: "싱가포르", nameEn: "Singapore",
    cities: [
      { cityKo: "싱가포르", cityEn: "Singapore (Changi)", iata: "SIN", lat: 1.3644, lon: 103.9915 }
    ]
  },
  {
    iso2: "GB", nameKo: "영국", nameEn: "United Kingdom",
    cities: [
      { cityKo: "런던(히스로)", cityEn: "London (Heathrow)", iata: "LHR", lat: 51.4700, lon: -0.4543 },
      { cityKo: "런던(개트윅)", cityEn: "London (Gatwick)", iata: "LGW", lat: 51.1537, lon: -0.1821 }
    ]
  }
  // 필요 국가를 계속 추가하면 됩니다.
];

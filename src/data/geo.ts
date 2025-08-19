// src/data/geo.ts
export type City = { cityKo: string; cityEn: string; iata: string; lat: number; lon: number };
export type Country = { iso2: string; nameKo: string; nameEn: string; cities: City[] };

export const COUNTRIES: Country[] = [
  // ----- Korea / Japan / Greater China / SE Asia -----
  {
    iso2: "KR", nameKo: "대한민국", nameEn: "South Korea",
    cities: [
      { cityKo: "서울(인천)", cityEn: "Seoul (Incheon)", iata: "ICN", lat: 37.4602, lon: 126.4407 },
      { cityKo: "서울(김포)", cityEn: "Seoul (Gimpo)", iata: "GMP", lat: 37.5583, lon: 126.7906 },
      { cityKo: "부산(김해)", cityEn: "Busan (Gimhae)", iata: "PUS", lat: 35.1796, lon: 128.9381 },
      { cityKo: "제주", cityEn: "Jeju", iata: "CJU", lat: 33.5104, lon: 126.4914 },
      { cityKo: "대구", cityEn: "Daegu", iata: "TAE", lat: 35.8944, lon: 128.6588 }
    ]
  },
  {
    iso2: "JP", nameKo: "일본", nameEn: "Japan",
    cities: [
      { cityKo: "도쿄(하네다)", cityEn: "Tokyo (Haneda)", iata: "HND", lat: 35.5494, lon: 139.7798 },
      { cityKo: "도쿄(나리타)", cityEn: "Tokyo (Narita)", iata: "NRT", lat: 35.7732, lon: 140.3874 },
      { cityKo: "오사카(간사이)", cityEn: "Osaka (Kansai)", iata: "KIX", lat: 34.4340, lon: 135.2440 },
      { cityKo: "후쿠오카", cityEn: "Fukuoka", iata: "FUK", lat: 33.5859, lon: 130.4500 },
      { cityKo: "삿포로(치토세)", cityEn: "Sapporo (CTS)", iata: "CTS", lat: 42.7752, lon: 141.6923 },
      { cityKo: "나고야(주부)", cityEn: "Nagoya (Chubu)", iata: "NGO", lat: 34.8584, lon: 136.8054 },
      { cityKo: "오키나와(나하)", cityEn: "Okinawa (Naha)", iata: "OKA", lat: 26.2066, lon: 127.6460 }
    ]
  },
  {
    iso2: "HK", nameKo: "홍콩", nameEn: "Hong Kong",
    cities: [{ cityKo: "홍콩", cityEn: "Hong Kong", iata: "HKG", lat: 22.3080, lon: 113.9185 }]
  },
  {
    iso2: "MO", nameKo: "마카오", nameEn: "Macao",
    cities: [{ cityKo: "마카오", cityEn: "Macau", iata: "MFM", lat: 22.1496, lon: 113.5930 }]
  },
  {
    iso2: "TW", nameKo: "대만", nameEn: "Taiwan",
    cities: [
      { cityKo: "타이베이(타오위안)", cityEn: "Taipei (TPE)", iata: "TPE", lat: 25.0777, lon: 121.2328 },
      { cityKo: "가오슝", cityEn: "Kaohsiung", iata: "KHH", lat: 22.5771, lon: 120.3493 },
    ]
  },
  {
    iso2: "CN", nameKo: "중국", nameEn: "China",
    cities: [
      { cityKo: "베이징(PEK)", cityEn: "Beijing (Capital)", iata: "PEK", lat: 40.0799, lon: 116.6031 },
      { cityKo: "상하이(푸둥)", cityEn: "Shanghai (Pudong)", iata: "PVG", lat: 31.1443, lon: 121.8083 },
      { cityKo: "광저우", cityEn: "Guangzhou", iata: "CAN", lat: 23.3924, lon: 113.2988 },
      { cityKo: "선전", cityEn: "Shenzhen", iata: "SZX", lat: 22.6393, lon: 113.8107 },
      { cityKo: "청두", cityEn: "Chengdu (T2/TFU)", iata: "CTU", lat: 30.5785, lon: 103.9470 },
      { cityKo: "시안", cityEn: "Xi'an", iata: "XIY", lat: 34.4471, lon: 108.7516 }
    ]
  },
  {
    iso2: "SG", nameKo: "싱가포르", nameEn: "Singapore",
    cities: [{ cityKo: "싱가포르(창이)", cityEn: "Singapore (Changi)", iata: "SIN", lat: 1.3644, lon: 103.9915 }]
  },
  {
    iso2: "MY", nameKo: "말레이시아", nameEn: "Malaysia",
    cities: [
      { cityKo: "쿠알라룸푸르", cityEn: "Kuala Lumpur", iata: "KUL", lat: 2.7456, lon: 101.7090 },
      { cityKo: "코타키나발루", cityEn: "Kota Kinabalu", iata: "BKI", lat: 5.9372, lon: 116.0510 }
    ]
  },
  {
    iso2: "TH", nameKo: "태국", nameEn: "Thailand",
    cities: [
      { cityKo: "방콕(수완나품)", cityEn: "Bangkok (BKK)", iata: "BKK", lat: 13.6900, lon: 100.7501 },
      { cityKo: "푸켓", cityEn: "Phuket", iata: "HKT", lat: 8.1111, lon: 98.3060 },
      { cityKo: "치앙마이", cityEn: "Chiang Mai", iata: "CNX", lat: 18.7668, lon: 98.9626 }
    ]
  },
  {
    iso2: "VN", nameKo: "베트남", nameEn: "Viet Nam",
    cities: [
      { cityKo: "호치민", cityEn: "Ho Chi Minh City", iata: "SGN", lat: 10.8188, lon: 106.6518 },
      { cityKo: "하노이", cityEn: "Hanoi", iata: "HAN", lat: 21.2142, lon: 105.8069 },
      { cityKo: "다낭", cityEn: "Da Nang", iata: "DAD", lat: 16.0439, lon: 108.1990 }
    ]
  },
  {
    iso2: "ID", nameKo: "인도네시아", nameEn: "Indonesia",
    cities: [
      { cityKo: "발리(덴파사르)", cityEn: "Bali (Denpasar)", iata: "DPS", lat: -8.7481, lon: 115.1670 },
      { cityKo: "자카르타", cityEn: "Jakarta (CGK)", iata: "CGK", lat: -6.1256, lon: 106.6559 }
    ]
  },
  {
    iso2: "PH", nameKo: "필리핀", nameEn: "Philippines",
    cities: [
      { cityKo: "마닐라", cityEn: "Manila", iata: "MNL", lat: 14.5086, lon: 121.0198 },
      { cityKo: "세부", cityEn: "Cebu", iata: "CEB", lat: 10.3133, lon: 123.9828 },
      { cityKo: "보라카이(카틱란)", cityEn: "Boracay (MPH)", iata: "MPH", lat: 11.9276, lon: 121.9530 }
    ]
  },
  {
    iso2: "BN", nameKo: "브루나이", nameEn: "Brunei",
    cities: [{ cityKo: "반다르스리브가완", cityEn: "Bandar Seri Begawan", iata: "BWN", lat: 4.9442, lon: 114.9283 }]
  },
  {
    iso2: "KH", nameKo: "캄보디아", nameEn: "Cambodia",
    cities: [
      { cityKo: "프놈펜", cityEn: "Phnom Penh", iata: "PNH", lat: 11.5466, lon: 104.8442 },
      { cityKo: "시엠레아프", cityEn: "Siem Reap", iata: "SAI", lat: 13.4100, lon: 103.8140 }
    ]
  },
  {
    iso2: "LA", nameKo: "라오스", nameEn: "Lao People's Democratic Republic",
    cities: [{ cityKo: "비엔티안", cityEn: "Vientiane", iata: "VTE", lat: 17.9883, lon: 102.5630 }]
  },
  {
    iso2: "MM", nameKo: "미얀마", nameEn: "Myanmar",
    cities: [{ cityKo: "양곤", cityEn: "Yangon", iata: "RGN", lat: 16.9073, lon: 96.1332 }]
  },

  // ----- South Asia / Oceania -----
  {
    iso2: "IN", nameKo: "인도", nameEn: "India",
    cities: [
      { cityKo: "델리", cityEn: "Delhi", iata: "DEL", lat: 28.5562, lon: 77.1000 },
      { cityKo: "뭄바이", cityEn: "Mumbai", iata: "BOM", lat: 19.0896, lon: 72.8656 },
      { cityKo: "벵갈루루", cityEn: "Bengaluru", iata: "BLR", lat: 13.1986, lon: 77.7066 },
      { cityKo: "첸나이", cityEn: "Chennai", iata: "MAA", lat: 12.9941, lon: 80.1709 }
    ]
  },
  {
    iso2: "LK", nameKo: "스리랑카", nameEn: "Sri Lanka",
    cities: [{ cityKo: "콜롬보", cityEn: "Colombo (CMB)", iata: "CMB", lat: 7.1808, lon: 79.8841 }]
  },
  {
    iso2: "NP", nameKo: "네팔", nameEn: "Nepal",
    cities: [{ cityKo: "카트만두", cityEn: "Kathmandu", iata: "KTM", lat: 27.6966, lon: 85.3591 }]
  },
  {
    iso2: "MV", nameKo: "몰디브", nameEn: "Maldives",
    cities: [{ cityKo: "말레", cityEn: "Malé", iata: "MLE", lat: 4.1918, lon: 73.5291 }]
  },
  {
    iso2: "AU", nameKo: "호주", nameEn: "Australia",
    cities: [
      { cityKo: "시드니", cityEn: "Sydney", iata: "SYD", lat: -33.9399, lon: 151.1753 },
      { cityKo: "멜버른", cityEn: "Melbourne", iata: "MEL", lat: -37.6733, lon: 144.8433 },
      { cityKo: "브리즈번", cityEn: "Brisbane", iata: "BNE", lat: -27.3842, lon: 153.1175 }
    ]
  },
  {
    iso2: "NZ", nameKo: "뉴질랜드", nameEn: "New Zealand",
    cities: [{ cityKo: "오클랜드", cityEn: "Auckland", iata: "AKL", lat: -37.0082, lon: 174.7850 }]
  },
  {
    iso2: "GU", nameKo: "괌(미국령)", nameEn: "Guam",
    cities: [{ cityKo: "괌", cityEn: "Guam", iata: "GUM", lat: 13.4839, lon: 144.7970 }]
  },
  {
    iso2: "MP", nameKo: "사이판(미국령)", nameEn: "Northern Mariana Islands",
    cities: [{ cityKo: "사이판", cityEn: "Saipan", iata: "SPN", lat: 15.1190, lon: 145.7290 }]
  },

  // ----- Middle East -----
  {
    iso2: "AE", nameKo: "아랍에미리트", nameEn: "United Arab Emirates",
    cities: [
      { cityKo: "두바이", cityEn: "Dubai", iata: "DXB", lat: 25.2532, lon: 55.3657 },
      { cityKo: "아부다비", cityEn: "Abu Dhabi", iata: "AUH", lat: 24.4329, lon: 54.6510 }
    ]
  },
  {
    iso2: "QA", nameKo: "카타르", nameEn: "Qatar",
    cities: [{ cityKo: "도하", cityEn: "Doha", iata: "DOH", lat: 25.2736, lon: 51.6089 }]
  },
  {
    iso2: "TR", nameKo: "튀르키예", nameEn: "Türkiye",
    cities: [
      { cityKo: "이스탄불", cityEn: "Istanbul (IST)", iata: "IST", lat: 41.2753, lon: 28.7519 },
      { cityKo: "사비하괵첸", cityEn: "Istanbul (SAW)", iata: "SAW", lat: 40.8986, lon: 29.3092 }
    ]
  },
  {
    iso2: "SA", nameKo: "사우디아라비아", nameEn: "Saudi Arabia",
    cities: [
      { cityKo: "리야드", cityEn: "Riyadh", iata: "RUH", lat: 24.9576, lon: 46.6988 },
      { cityKo: "제다", cityEn: "Jeddah", iata: "JED", lat: 21.6702, lon: 39.1525 }
    ]
  },
  {
    iso2: "IL", nameKo: "이스라엘", nameEn: "Israel",
    cities: [{ cityKo: "텔아비브", cityEn: "Tel Aviv (TLV)", iata: "TLV", lat: 32.0114, lon: 34.8867 }]
  },
  {
    iso2: "JO", nameKo: "요르단", nameEn: "Jordan",
    cities: [{ cityKo: "암만", cityEn: "Amman", iata: "AMM", lat: 31.7226, lon: 35.9932 }]
  },
  {
    iso2: "EG", nameKo: "이집트", nameEn: "Egypt",
    cities: [{ cityKo: "카이로", cityEn: "Cairo", iata: "CAI", lat: 30.1219, lon: 31.4056 }]
  },

  // ----- Europe -----
  {
    iso2: "GB", nameKo: "영국", nameEn: "United Kingdom",
    cities: [
      { cityKo: "런던(히스로)", cityEn: "London (Heathrow)", iata: "LHR", lat: 51.4700, lon: -0.4543 },
      { cityKo: "런던(개트윅)", cityEn: "London (Gatwick)", iata: "LGW", lat: 51.1537, lon: -0.1821 }
    ]
  },
  {
    iso2: "FR", nameKo: "프랑스", nameEn: "France",
    cities: [
      { cityKo: "파리(CDG)", cityEn: "Paris (CDG)", iata: "CDG", lat: 49.0097, lon: 2.5479 },
      { cityKo: "파리(오를리)", cityEn: "Paris (Orly)", iata: "ORY", lat: 48.7262, lon: 2.3652 }
    ]
  },
  {
    iso2: "DE", nameKo: "독일", nameEn: "Germany",
    cities: [
      { cityKo: "프랑크푸르트", cityEn: "Frankfurt", iata: "FRA", lat: 50.0379, lon: 8.5622 },
      { cityKo: "뮌헨", cityEn: "Munich", iata: "MUC", lat: 48.3538, lon: 11.7861 },
      { cityKo: "뒤셀도르프", cityEn: "Düsseldorf", iata: "DUS", lat: 51.2895, lon: 6.7668 }
    ]
  },
  {
    iso2: "NL", nameKo: "네덜란드", nameEn: "Netherlands",
    cities: [{ cityKo: "암스테르담", cityEn: "Amsterdam", iata: "AMS", lat: 52.3105, lon: 4.7683 }]
  },
  {
    iso2: "IT", nameKo: "이탈리아", nameEn: "Italy",
    cities: [
      { cityKo: "로마(피우미치노)", cityEn: "Rome (FCO)", iata: "FCO", lat: 41.8003, lon: 12.2389 },
      { cityKo: "밀라노(말펜사)", cityEn: "Milan (MXP)", iata: "MXP", lat: 45.6301, lon: 8.7255 }
    ]
  },
  {
    iso2: "ES", nameKo: "스페인", nameEn: "Spain",
    cities: [
      { cityKo: "마드리드", cityEn: "Madrid", iata: "MAD", lat: 40.4983, lon: -3.5676 },
      { cityKo: "바르셀로나", cityEn: "Barcelona", iata: "BCN", lat: 41.2974, lon: 2.0833 }
    ]
  },
  {
    iso2: "CH", nameKo: "스위스", nameEn: "Switzerland",
    cities: [
      { cityKo: "취리히", cityEn: "Zurich", iata: "ZRH", lat: 47.4647, lon: 8.5492 },
      { cityKo: "제네바", cityEn: "Geneva", iata: "GVA", lat: 46.2381, lon: 6.1099 }
    ]
  },
  {
    iso2: "AT", nameKo: "오스트리아", nameEn: "Austria",
    cities: [{ cityKo: "비엔나", cityEn: "Vienna", iata: "VIE", lat: 48.1103, lon: 16.5697 }]
  },
  {
    iso2: "SE", nameKo: "스웨덴", nameEn: "Sweden",
    cities: [{ cityKo: "스톡홀름", cityEn: "Stockholm (ARN)", iata: "ARN", lat: 59.6498, lon: 17.9238 }]
  },
  {
    iso2: "NO", nameKo: "노르웨이", nameEn: "Norway",
    cities: [{ cityKo: "오슬로", cityEn: "Oslo", iata: "OSL", lat: 60.1976, lon: 11.1004 }]
  },
  {
    iso2: "DK", nameKo: "덴마크", nameEn: "Denmark",
    cities: [{ cityKo: "코펜하겐", cityEn: "Copenhagen", iata: "CPH", lat: 55.6180, lon: 12.6508 }]
  },
  {
    iso2: "FI", nameKo: "핀란드", nameEn: "Finland",
    cities: [{ cityKo: "헬싱키", cityEn: "Helsinki", iata: "HEL", lat: 60.3172, lon: 24.9633 }]
  },
  {
    iso2: "IE", nameKo: "아일랜드", nameEn: "Ireland",
    cities: [{ cityKo: "더블린", cityEn: "Dublin", iata: "DUB", lat: 53.4213, lon: -6.2701 }]
  },
  {
    iso2: "CZ", nameKo: "체코", nameEn: "Czechia",
    cities: [{ cityKo: "프라하", cityEn: "Prague", iata: "PRG", lat: 50.1008, lon: 14.2600 }]
  },
  {
    iso2: "HU", nameKo: "헝가리", nameEn: "Hungary",
    cities: [{ cityKo: "부다페스트", cityEn: "Budapest", iata: "BUD", lat: 47.4369, lon: 19.2556 }]
  },
  {
    iso2: "PL", nameKo: "폴란드", nameEn: "Poland",
    cities: [{ cityKo: "바르샤바", cityEn: "Warsaw", iata: "WAW", lat: 52.1657, lon: 20.9671 }]
  },
  {
    iso2: "PT", nameKo: "포르투갈", nameEn: "Portugal",
    cities: [{ cityKo: "리스본", cityEn: "Lisbon", iata: "LIS", lat: 38.7742, lon: -9.1342 }]
  },
  {
    iso2: "GR", nameKo: "그리스", nameEn: "Greece",
    cities: [{ cityKo: "아테네", cityEn: "Athens", iata: "ATH", lat: 37.9364, lon: 23.9445 }]
  },

  // ----- North America -----
  {
    iso2: "US", nameKo: "미국", nameEn: "United States",
    cities: [
      { cityKo: "로스앤젤레스", cityEn: "Los Angeles", iata: "LAX", lat: 33.9416, lon: -118.4085 },
      { cityKo: "샌프란시스코", cityEn: "San Francisco", iata: "SFO", lat: 37.6213, lon: -122.3790 },
      { cityKo: "뉴욕(JFK)", cityEn: "New York (JFK)", iata: "JFK", lat: 40.6413, lon: -73.7781 },
      { cityKo: "뉴욕(EWR)", cityEn: "Newark (EWR)", iata: "EWR", lat: 40.6895, lon: -74.1745 },
      { cityKo: "시애틀", cityEn: "Seattle", iata: "SEA", lat: 47.4502, lon: -122.3088 },
      { cityKo: "시카고", cityEn: "Chicago (ORD)", iata: "ORD", lat: 41.9742, lon: -87.9073 },
      { cityKo: "워싱턴D.C.", cityEn: "Washington D.C. (IAD)", iata: "IAD", lat: 38.9531, lon: -77.4565 },
      { cityKo: "보스턴", cityEn: "Boston", iata: "BOS", lat: 42.3656, lon: -71.0096 },
      { cityKo: "애틀랜타", cityEn: "Atlanta", iata: "ATL", lat: 33.6407, lon: -84.4277 },
      { cityKo: "댈러스", cityEn: "Dallas/Fort Worth", iata: "DFW", lat: 32.8998, lon: -97.0403 },
      { cityKo: "휴스턴", cityEn: "Houston (IAH)", iata: "IAH", lat: 29.9902, lon: -95.3368 },
      { cityKo: "마이애미", cityEn: "Miami", iata: "MIA", lat: 25.7959, lon: -80.2871 },
      { cityKo: "라스베이거스", cityEn: "Las Vegas", iata: "LAS", lat: 36.0840, lon: -115.1537 },
      { cityKo: "호놀룰루", cityEn: "Honolulu", iata: "HNL", lat: 21.3245, lon: -157.9251 }
    ]
  },
  {
    iso2: "CA", nameKo: "캐나다", nameEn: "Canada",
    cities: [
      { cityKo: "밴쿠버", cityEn: "Vancouver", iata: "YVR", lat: 49.1951, lon: -123.1779 },
      { cityKo: "토론토", cityEn: "Toronto", iata: "YYZ", lat: 43.6777, lon: -79.6248 },
      { cityKo: "몬트리올", cityEn: "Montréal", iata: "YUL", lat: 45.4657, lon: -73.7455 }
    ]
  },
  {
    iso2: "MX", nameKo: "멕시코", nameEn: "Mexico",
    cities: [
      { cityKo: "멕시코시티", cityEn: "Mexico City", iata: "MEX", lat: 19.4361, lon: -99.0719 },
      { cityKo: "칸쿤", cityEn: "Cancún", iata: "CUN", lat: 21.0365, lon: -86.8769 }
    ]
  },

  // ----- Central/South America (대표) -----
  {
    iso2: "BR", nameKo: "브라질", nameEn: "Brazil",
    cities: [
      { cityKo: "상파울루", cityEn: "São Paulo (GRU)", iata: "GRU", lat: -23.4356, lon: -46.4731 },
      { cityKo: "리우데자네이루", cityEn: "Rio de Janeiro", iata: "GIG", lat: -22.8090, lon: -43.2506 }
    ]
  },
  {
    iso2: "CL", nameKo: "칠레", nameEn: "Chile",
    cities: [{ cityKo: "산티아고", cityEn: "Santiago", iata: "SCL", lat: -33.3930, lon: -70.7858 }]
  },

  // ----- Africa (대표) -----
  {
    iso2: "ZA", nameKo: "남아프리카공화국", nameEn: "South Africa",
    cities: [
      { cityKo: "요하네스버그", cityEn: "Johannesburg", iata: "JNB", lat: -26.1367, lon: 28.2410 },
      { cityKo: "케이프타운", cityEn: "Cape Town", iata: "CPT", lat: -33.9700, lon: 18.5972 }
    ]
  },
  {
    iso2: "KE", nameKo: "케냐", nameEn: "Kenya",
    cities: [{ cityKo: "나이로비", cityEn: "Nairobi", iata: "NBO", lat: -1.3192, lon: 36.9278 }]
  }
];

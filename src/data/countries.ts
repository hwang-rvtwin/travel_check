// countries.ts — 20개 시드(전력/플러그·비자·eSIM·기후 노트)
// 참고 타입: interface CountryMeta { slug: string; nameKo: string; nameEn: string; iso2: string; voltage: number; frequency: 50 | 60; plugTypes: ("A"|"B"|"C"|"D"|"E"|"F"|"G"|"H"|"I"|"J"|"K"|"L"|"M"|"N"|"O")[]; visaNoteKo: string; esimNote: string; climateNote: string }

export type PlugType =
  | 'A'|'B'|'C'|'D'|'E'|'F'|'G'|'H'|'I'|'J'|'K'|'L'|'M'|'N'|'O';

export interface CountryMeta {
  slug: string;
  nameKo: string;
  nameEn: string;
  iso2: string;
  voltage: number;
  frequency: 50 | 60;
  plugTypes: PlugType[];
  visaNoteKo: string;
  esimNote: string;
  climateNote: string;
}

export const COUNTRIES: CountryMeta[] = [
  {
    slug: "japan",
    nameKo: "일본",
    nameEn: "Japan",
    iso2: "JP",
    voltage: 100,
    frequency: 50, // 동부 50Hz / 서부 60Hz 혼재
    plugTypes: ["A", "B"],
    visaNoteKo:
      "한국인 단기 관광은 통상 무비자(변동 가능). 정책 수시 변경이 있어 출국 전 외교부 해외안전여행·주일 한국공관 공지를 반드시 확인하세요.",
    esimNote:
      "eSIM 보편(공항 물리심 대비 가격 경쟁력). 일부 본인확인(SMS) 용도는 로컬 번호 발급 여부 확인 필요.",
    climateNote:
      "6–7월 장마, 8–10월 태풍 가능. 북부는 겨울 한파·강설, 오키나와는 아열대." 
  },
  {
    slug: "thailand",
    nameKo: "태국",
    nameEn: "Thailand",
    iso2: "TH",
    voltage: 230,
    frequency: 50,
    plugTypes: ["A", "B", "C", "F", "O"],
    visaNoteKo:
      "한국인 단기 체류는 통상 무비자 또는 현장/전자 비자 제도 운영(변동 가능). 출국 전 0404.go.kr 및 주태국 한국공관 공지 확인 권장.",
    esimNote:
      "관광지 중심으로 eSIM/현지 심카드 매우 보편. 로밍 대비 가격 우수, 공항 수령/온라인 활성화.",
    climateNote:
      "건기 11–2월(선선·여행적기), 전형적 우기 5–10월(스콜·홍수 유의)."
  },
  {
    slug: "usa",
    nameKo: "미국",
    nameEn: "United States",
    iso2: "US",
    voltage: 120,
    frequency: 60,
    plugTypes: ["A", "B"],
    visaNoteKo:
      "무비자 입국 시 전자여행허가 ESTA 사전 승인 필요. 체류 목적에 따라 별도 비자 필요할 수 있으니 공식 안내 확인 필수.",
    esimNote:
      "대부분 지역 4G/5G 우수. eSIM 요금제 다양(무제한·데이터전용). 본인인증용 문자 수신은 로컬 번호 포함 여부 확인.",
    climateNote:
      "광활한 영토로 지역별 기후 상이: 여름 동남부 고온다습, 서해안 온화, 북부 겨울 한파/설." 
  },
  {
    slug: "united-kingdom",
    nameKo: "영국",
    nameEn: "United Kingdom",
    iso2: "GB",
    voltage: 230,
    frequency: 50,
    plugTypes: ["G"],
    visaNoteKo:
      "단기 관광 무비자(변동 가능). 영국 ETA(전자여행허가) 단계적 도입 진행 — 출발 전 최신 요건 확인.",
    esimNote:
      "eSIM/물리심 보편. 유럽 로밍형 eSIM 요금제가 다국가 여행에 유리.",
    climateNote:
      "연중 온화하나 잦은 비·변덕스러운 날씨. 여름도 선선한 편(에어컨 미설치 숙소 다수)."
  },
  {
    slug: "france",
    nameKo: "프랑스",
    nameEn: "France",
    iso2: "FR",
    voltage: 230,
    frequency: 50,
    plugTypes: ["C", "E"],
    visaNoteKo:
      "셍겐권 단기 무비자. 2026년 말부터 ETIAS(전자여행허가) 시행 예정(세부는 각국 개별 결정) — 최신 공고 확인.",
    esimNote:
      "EU 공통 eSIM 다수(프·이·스 등 묶음). SMS 인증용 로컬번호 필요 시 별도 확인.",
    climateNote:
      "파리 온난습윤, 남부는 지중해성(여름 고온·건조). 7–8월 성수기 혼잡." 
  },
  {
    slug: "germany",
    nameKo: "독일",
    nameEn: "Germany",
    iso2: "DE",
    voltage: 230,
    frequency: 50,
    plugTypes: ["C", "F"],
    visaNoteKo:
      "셍겐권 단기 무비자, ETIAS 예정 — 출발 전 확인.",
    esimNote:
      "도시권 5G 보급. EU 다국가 eSIM 요금제 활용 권장.",
    climateNote:
      "봄·가을 선선, 겨울 영하·강설 가능. 크리스마스 마켓 성수기(11–12월)."
  },
  {
    slug: "italy",
    nameKo: "이탈리아",
    nameEn: "Italy",
    iso2: "IT",
    voltage: 230,
    frequency: 50,
    plugTypes: ["C", "F", "L"],
    visaNoteKo:
      "셍겐권 단기 무비자, ETIAS 예정 — 최신 공지 확인.",
    esimNote:
      "EU eSIM 광범위. 관광지 밀집 지역 공공 Wi‑Fi도 다수.",
    climateNote:
      "북부 대륙성·남부 지중해성. 7–8월 무덥고 혼잡, 봄·가을이 쾌적." 
  },
  {
    slug: "spain",
    nameKo: "스페인",
    nameEn: "Spain",
    iso2: "ES",
    voltage: 230,
    frequency: 50,
    plugTypes: ["C", "F"],
    visaNoteKo:
      "셍겐권 단기 무비자, ETIAS 예정 — 출발 전 확인.",
    esimNote:
      "EU 다국가 eSIM 추천. 남부 지역 여름 이동 시 데이터 사용량 증가 대비.",
    climateNote:
      "여름 고온(특히 안달루시아). 바르셀로나는 습도 높음, 봄·가을이 온화." 
  },
  {
    slug: "australia",
    nameKo: "호주",
    nameEn: "Australia",
    iso2: "AU",
    voltage: 230,
    frequency: 50,
    plugTypes: ["I"],
    visaNoteKo:
      "단기 방문 전자여행허가 ETA/이비자 제도 운용 — 공식 안내에서 요건 확인 필요.",
    esimNote:
      "대도시 5G 양호. 장거리 이동 시 커버리지 간헐 — 이중 유심(eSIM+물리심) 유지 권장.",
    climateNote:
      "남반구: 12–2월 여름, 6–8월 겨울. 북쪽 열대·남쪽 온대, 지역 차 큼." 
  },
  {
    slug: "new-zealand",
    nameKo: "뉴질랜드",
    nameEn: "New Zealand",
    iso2: "NZ",
    voltage: 230,
    frequency: 50,
    plugTypes: ["I"],
    visaNoteKo:
      "단기 입국 시 NZeTA 사전 신청 필요(변동 가능). 자연보호 구역 방문 시 규정 준수.",
    esimNote:
      "도시권 eSIM/5G 보급. 국토 특성상 외곽·트레킹 루트는 신호 약함 — 오프라인 지도 준비.",
    climateNote:
      "서안해양성. 남섬은 겨울 한파·설, 여름에도 일교차 큼." 
  },
  {
    slug: "singapore",
    nameKo: "싱가포르",
    nameEn: "Singapore",
    iso2: "SG",
    voltage: 230,
    frequency: 50,
    plugTypes: ["G"],
    visaNoteKo:
      "한국인 단기 관광은 통상 무비자(변동 가능). 입국 시 체류증명·리턴 티켓 확인될 수 있음.",
    esimNote:
      "eSIM 매우 보편, 도심 밀집 5G 양호. 공항·도심 수령 간편.",
    climateNote:
      "연중 고온다습·스콜 빈번. 실내 냉방 강함 — 겉옷 지참." 
  },
  {
    slug: "malaysia",
    nameKo: "말레이시아",
    nameEn: "Malaysia",
    iso2: "MY",
    voltage: 230,
    frequency: 50,
    plugTypes: ["G"],
    visaNoteKo:
      "한국인 단기 체류는 통상 무비자(변동 가능). 보르네오(사바·사라왁) 입출경 절차 확인.",
    esimNote:
      "도시권 eSIM 보급. 쿠알라룸푸르는 공공 Wi‑Fi도 광범위.",
    climateNote:
      "연중 덥고 습. 서·동말레이시아 몬순 시기 상이 — 우기 폭우 유의." 
  },
  {
    slug: "vietnam",
    nameKo: "베트남",
    nameEn: "Vietnam",
    iso2: "VN",
    voltage: 230,
    frequency: 50,
    plugTypes: ["A", "B", "C"],
    visaNoteKo:
      "전자비자 제도 확대 중 등 정책 수시 변동 — 외교부·현지 공관 최신 공지 확인 필수.",
    esimNote:
      "도시권 eSIM·현지 심 구매 용이. 일부 지역 전력 품질 변동성 — 보조배터리 권장.",
    climateNote:
      "북부 4계절·겨울 한랭, 중부 9–11월 태풍·집중호우, 남부 12–4월 건기/5–11월 우기." 
  },
  {
    slug: "indonesia",
    nameKo: "인도네시아",
    nameEn: "Indonesia",
    iso2: "ID",
    voltage: 230,
    frequency: 50,
    plugTypes: ["C", "F"],
    visaNoteKo:
      "단기 방문은 VOA/eVOA 등 제도 운용(변동 가능). 발리·자카르타 등 지역별 요건 상이 가능 — 공식 확인.",
    esimNote:
      "발리 등 관광지 eSIM 활용 용이. 외곽 섬 이동 시 커버리지 확인 필요.",
    climateNote:
      "(발리 기준) 건기 4–10월, 우기 11–3월. 습도 높아 방수·통풍 의류 권장." 
  },
  {
    slug: "taiwan",
    nameKo: "대만",
    nameEn: "Taiwan",
    iso2: "TW",
    voltage: 110,
    frequency: 60,
    plugTypes: ["A", "B"],
    visaNoteKo:
      "한국인 단기 관광은 통상 무비자(변동 가능). 항공권·숙소 증빙 요구될 수 있음.",
    esimNote:
      "도시권 eSIM 보편, 5G 커버리지 양호. 현지 교통·결제 앱 연동 편리.",
    climateNote:
      "5–6월 장마, 7–10월 태풍 가능. 여름 고온다습 — 실내 냉방 강함." 
  },
  {
    slug: "hong-kong",
    nameKo: "홍콩",
    nameEn: "Hong Kong",
    iso2: "HK",
    voltage: 230,
    frequency: 50,
    plugTypes: ["G"],
    visaNoteKo:
      "한국인 단기 체류 무비자(변동 가능). 입국 시 왕복권·체류 일정 확인될 수 있음.",
    esimNote:
      "eSIM 보편. 본토·마카오 연계 이동 시 로밍 커버리지 확인.",
    climateNote:
      "아열대. 여름 무덥고 습, 5–9월 태풍 가능." 
  },
  {
    slug: "china",
    nameKo: "중국 본토",
    nameEn: "China (Mainland)",
    iso2: "CN",
    voltage: 230,
    frequency: 50,
    plugTypes: ["A", "C", "I"],
    visaNoteKo:
      "비자 정책 변동 잦음(무비자 행사·완화/강화 등). 반드시 출발 전 공식 공지 확인.",
    esimNote:
      "해외 eSIM 사용 시 일부 인터넷 서비스 접속 제한 가능 — 필요 시 합법 범위 내 우회수단·오프라인 지도 준비.",
    climateNote:
      "광활한 영토로 지역차 큼: 북부 겨울 혹한, 동부 여름 무더위, 남부 아열대성." 
  },
  {
    slug: "canada",
    nameKo: "캐나다",
    nameEn: "Canada",
    iso2: "CA",
    voltage: 120,
    frequency: 60,
    plugTypes: ["A", "B"],
    visaNoteKo:
      "항공 입국 시 eTA(전자여행허가) 사전 신청 필요(변경 가능). 육로·해상은 요건 상이.",
    esimNote:
      "대도시 eSIM·5G 양호. 로키 등 산악·시골 지역은 신호 약함 — 오프라인 지도/세컨드 심 권장.",
    climateNote:
      "겨울 한파·폭설, 여름 온화. 서부 건조, 동부는 습윤." 
  },
  {
    slug: "uae",
    nameKo: "아랍에미리트",
    nameEn: "United Arab Emirates",
    iso2: "AE",
    voltage: 230,
    frequency: 50,
    plugTypes: ["G"],
    visaNoteKo:
      "한국인 단기 체류는 통상 무비자(변동 가능). 방문 목적·체류기간에 따라 요건 상이 가능.",
    esimNote:
      "도시권 5G 우수. 일부 통신/VoIP 앱 제약 가능 — 현지 규정 확인.",
    climateNote:
      "5–9월 극심한 더위(야외 활동 제한). 11–3월 온화해 여행 적기." 
  },
  {
    slug: "turkey",
    nameKo: "튀르키예",
    nameEn: "Türkiye (Turkey)",
    iso2: "TR",
    voltage: 230,
    frequency: 50,
    plugTypes: ["C", "F"],
    visaNoteKo:
      "한국인 단기 관광은 통상 무비자(변동 가능). 체류 조건·기간 사전 확인 권장.",
    esimNote:
      "대도시 eSIM 사용 용이. 현지 유심 등록 제도·단말기 IMEI 규정 확인.",
    climateNote:
      "서·남해안 지중해성(여름 덥고 건조), 중앙 내륙은 겨울 한설. 봄·가을 온화." 
  }
];

export default COUNTRIES;

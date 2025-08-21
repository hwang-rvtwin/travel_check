// src/data/geo.ts
// 국가별(iso2) → 대표 국제도시/공항 목록
// nameKo/nameEn/nameCn/nameJp + 각 도시의 다국어/좌표 제공

export type City = {
  cityKo: string;
  cityEn: string;
  cityCn: string;
  cityJp: string;
  iata: string;   // IATA code
  lat: number;
  lon: number;
};

export type Country = {
  iso2: string;
  nameKo: string;
  nameEn: string;
  nameCn: string;
  nameJp: string;
  cities: City[];
};

export const COUNTRIES: Country[] = [
  // ====== 한국 (출발지 포함) ======
  {
    iso2: "KR", nameKo: "대한민국", nameEn: "South Korea", nameCn: "韩国", nameJp: "韓国",
    cities: [
      { cityKo: "서울(인천)", cityEn: "Seoul (Incheon)", cityCn: "首尔（仁川）", cityJp: "ソウル（仁川）", iata: "ICN", lat: 37.4602, lon: 126.4407 },
      { cityKo: "서울(김포)", cityEn: "Seoul (Gimpo)", cityCn: "首尔（金浦）", cityJp: "ソウル（金浦）", iata: "GMP", lat: 37.5583, lon: 126.7906 },
      { cityKo: "부산(김해)", cityEn: "Busan (Gimhae)", cityCn: "釜山（金海）", cityJp: "釜山（金海）", iata: "PUS", lat: 35.1796, lon: 128.9381 },
      { cityKo: "제주", cityEn: "Jeju", cityCn: "济州", cityJp: "済州", iata: "CJU", lat: 33.5104, lon: 126.4914 },
      { cityKo: "대구", cityEn: "Daegu", cityCn: "大邱", cityJp: "大邱", iata: "TAE", lat: 35.8944, lon: 128.6588 }
    ]
  },

  // ====== 일본 ======
  {
    iso2: "JP", nameKo: "일본", nameEn: "Japan", nameCn: "日本", nameJp: "日本",
    cities: [
      { cityKo: "도쿄(나리타)", cityEn: "Tokyo (Narita)", cityCn: "东京（成田）", cityJp: "東京（成田）", iata: "NRT", lat: 35.7767, lon: 140.3189 },
      { cityKo: "도쿄(하네다)", cityEn: "Tokyo (Haneda)", cityCn: "东京（羽田）", cityJp: "東京（羽田）", iata: "HND", lat: 35.5494, lon: 139.7798 },
      { cityKo: "오사카(간사이)", cityEn: "Osaka (Kansai)", cityCn: "大阪（关西）", cityJp: "大阪（関西）", iata: "KIX", lat: 34.4347, lon: 135.2440 },
      { cityKo: "후쿠오카", cityEn: "Fukuoka", cityCn: "福冈", cityJp: "福岡", iata: "FUK", lat: 33.5859, lon: 130.4500 },
      { cityKo: "삿포로(신치토세)", cityEn: "Sapporo (New Chitose)", cityCn: "札幌（新千岁）", cityJp: "札幌（新千歳）", iata: "CTS", lat: 42.7752, lon: 141.6923 },
      { cityKo: "오키나와(나하)", cityEn: "Okinawa (Naha)", cityCn: "冲绳（那霸）", cityJp: "沖縄（那覇）", iata: "OKA", lat: 26.2068, lon: 127.6469 },
      { cityKo: "나고야(중부)", cityEn: "Nagoya (Chubu)", cityCn: "名古屋（中部）", cityJp: "名古屋（中部）", iata: "NGO", lat: 34.8584, lon: 136.8054 }
    ]
  },

  // ====== 홍콩 / 마카오 / 대만 / 중국 ======
  {
    iso2: "HK", nameKo: "홍콩", nameEn: "Hong Kong", nameCn: "香港", nameJp: "香港",
    cities: [
      { cityKo: "홍콩", cityEn: "Hong Kong", cityCn: "香港", cityJp: "香港", iata: "HKG", lat: 22.3080, lon: 113.9185 }
    ]
  },
  {
    iso2: "MO", nameKo: "마카오", nameEn: "Macao", nameCn: "澳门", nameJp: "マカオ",
    cities: [
      { cityKo: "마카오", cityEn: "Macao", cityCn: "澳门", cityJp: "マカオ", iata: "MFM", lat: 22.1496, lon: 113.5925 }
    ]
  },
  {
    iso2: "TW", nameKo: "대만", nameEn: "Taiwan", nameCn: "台湾", nameJp: "台湾",
    cities: [
      { cityKo: "타이베이(타오위안)", cityEn: "Taipei (Taoyuan)", cityCn: "台北（桃园）", cityJp: "台北（桃園）", iata: "TPE", lat: 25.0777, lon: 121.2328 },
      { cityKo: "가오슝", cityEn: "Kaohsiung", cityCn: "高雄", cityJp: "高雄", iata: "KHH", lat: 22.5771, lon: 120.3493 }
    ]
  },
  {
    iso2: "CN", nameKo: "중국", nameEn: "China", nameCn: "中国", nameJp: "中国",
    cities: [
      { cityKo: "상하이(푸둥)", cityEn: "Shanghai (Pudong)", cityCn: "上海（浦东）", cityJp: "上海（浦東）", iata: "PVG", lat: 31.1443, lon: 121.8083 },
      { cityKo: "상하이(홍차오)", cityEn: "Shanghai (Hongqiao)", cityCn: "上海（虹桥）", cityJp: "上海（虹橋）", iata: "SHA", lat: 31.1979, lon: 121.3363 },
      { cityKo: "베이징(수도)", cityEn: "Beijing (Capital)", cityCn: "北京（首都）", cityJp: "北京（首都）", iata: "PEK", lat: 40.0801, lon: 116.5846 },
      { cityKo: "광저우", cityEn: "Guangzhou", cityCn: "广州", cityJp: "広州", iata: "CAN", lat: 23.3924, lon: 113.2988 },
      { cityKo: "선전", cityEn: "Shenzhen", cityCn: "深圳", cityJp: "深圳", iata: "SZX", lat: 22.6393, lon: 113.8107 },
      { cityKo: "칭다오", cityEn: "Qingdao", cityCn: "青岛", cityJp: "青島", iata: "TAO", lat: 36.2661, lon: 120.3740 },
      { cityKo: "다롄", cityEn: "Dalian", cityCn: "大连", cityJp: "大連", iata: "DLC", lat: 38.9657, lon: 121.5395 },
      { cityKo: "선양", cityEn: "Shenyang", cityCn: "沈阳", cityJp: "瀋陽", iata: "SHE", lat: 41.6398, lon: 123.4830 },
      { cityKo: "샤먼", cityEn: "Xiamen", cityCn: "厦门", cityJp: "廈門", iata: "XMN", lat: 24.5440, lon: 118.1280 }
    ]
  },

  // ====== 동남아 ======
  {
    iso2: "SG", nameKo: "싱가포르", nameEn: "Singapore", nameCn: "新加坡", nameJp: "シンガポール",
    cities: [
      { cityKo: "싱가포르(창이)", cityEn: "Singapore (Changi)", cityCn: "新加坡（樟宜）", cityJp: "シンガポール（チャンギ）", iata: "SIN", lat: 1.3644, lon: 103.9915 }
    ]
  },
  {
    iso2: "MY", nameKo: "말레이시아", nameEn: "Malaysia", nameCn: "马来西亚", nameJp: "マレーシア",
    cities: [
      { cityKo: "쿠알라룸푸르", cityEn: "Kuala Lumpur", cityCn: "吉隆坡", cityJp: "クアラルンプール", iata: "KUL", lat: 2.7456, lon: 101.7090 }
    ]
  },
  {
    iso2: "TH", nameKo: "태국", nameEn: "Thailand", nameCn: "泰国", nameJp: "タイ",
    cities: [
      { cityKo: "방콕(수완나품)", cityEn: "Bangkok (Suvarnabhumi)", cityCn: "曼谷（素万那普）", cityJp: "バンコク（スワンナプーム）", iata: "BKK", lat: 13.6900, lon: 100.7501 },
      { cityKo: "방콕(돈므앙)", cityEn: "Bangkok (Don Mueang)", cityCn: "曼谷（廊曼）", cityJp: "バンコク（ドンムアン）", iata: "DMK", lat: 13.9125, lon: 100.6067 },
      { cityKo: "치앙마이", cityEn: "Chiang Mai", cityCn: "清迈", cityJp: "チェンマイ", iata: "CNX", lat: 18.7668, lon: 98.9626 },
      { cityKo: "푸껫", cityEn: "Phuket", cityCn: "普吉", cityJp: "プーケット", iata: "HKT", lat: 8.1132, lon: 98.3160 }
    ]
  },
  {
    iso2: "VN", nameKo: "베트남", nameEn: "Viet Nam", nameCn: "越南", nameJp: "ベトナム",
    cities: [
      { cityKo: "호치민", cityEn: "Ho Chi Minh City", cityCn: "胡志明市", cityJp: "ホーチミン", iata: "SGN", lat: 10.8188, lon: 106.6518 },
      { cityKo: "하노이", cityEn: "Hanoi", cityCn: "河内", cityJp: "ハノイ", iata: "HAN", lat: 21.2187, lon: 105.8049 },
      { cityKo: "다낭", cityEn: "Da Nang", cityCn: "岘港", cityJp: "ダナン", iata: "DAD", lat: 16.0439, lon: 108.1990 },
      { cityKo: "나트랑", cityEn: "Nha Trang", cityCn: "芽庄", cityJp: "ニャチャン", iata: "CXR", lat: 12.2279, lon: 109.1920 }
    ]
  },
  {
    iso2: "ID", nameKo: "인도네시아", nameEn: "Indonesia", nameCn: "印度尼西亚", nameJp: "インドネシア",
    cities: [
      { cityKo: "덴파사르(발리)", cityEn: "Denpasar (Bali)", cityCn: "登巴萨（巴厘岛）", cityJp: "デンパサール（バリ）", iata: "DPS", lat: -8.7482, lon: 115.1670 },
      { cityKo: "자카르타", cityEn: "Jakarta", cityCn: "雅加达", cityJp: "ジャカルタ", iata: "CGK", lat: -6.1256, lon: 106.6559 }
    ]
  },
  {
    iso2: "PH", nameKo: "필리핀", nameEn: "Philippines", nameCn: "菲律宾", nameJp: "フィリピン",
    cities: [
      { cityKo: "마닐라", cityEn: "Manila", cityCn: "马尼拉", cityJp: "マニラ", iata: "MNL", lat: 14.5086, lon: 121.0198 },
      { cityKo: "세부", cityEn: "Cebu", cityCn: "宿务", cityJp: "セブ", iata: "CEB", lat: 10.3076, lon: 123.9790 },
      { cityKo: "클라크", cityEn: "Clark", cityCn: "克拉克", cityJp: "クラーク", iata: "CRK", lat: 15.1858, lon: 120.5600 }
    ]
  },

  // ====== 남아시아 추가 ======
  {
    iso2: "LK", nameKo: "스리랑카", nameEn: "Sri Lanka", nameCn: "斯里兰卡", nameJp: "スリランカ",
    cities: [
      { cityKo: "콜롬보(반다라나이케)", cityEn: "Colombo (Bandaranaike)", cityCn: "科伦坡（班达拉奈克）", cityJp: "コロンボ（バンダラナイケ）", iata: "CMB", lat: 7.1808, lon: 79.8841 }
    ]
  },
  {
    iso2: "NP", nameKo: "네팔", nameEn: "Nepal", nameCn: "尼泊尔", nameJp: "ネパール",
    cities: [
      { cityKo: "카트만두", cityEn: "Kathmandu", cityCn: "加德满都", cityJp: "カトマンズ", iata: "KTM", lat: 27.6953, lon: 85.3591 }
    ]
  },
  {
    iso2: "MM", nameKo: "미얀마", nameEn: "Myanmar", nameCn: "缅甸", nameJp: "ミャンマー",
    cities: [
      { cityKo: "양곤", cityEn: "Yangon", cityCn: "仰光", cityJp: "ヤンゴン", iata: "RGN", lat: 16.9073, lon: 96.1332 }
    ]
  },

  // ====== 인도 / 중동 ======
  {
    iso2: "IN", nameKo: "인도", nameEn: "India", nameCn: "印度", nameJp: "インド",
    cities: [
      { cityKo: "델리", cityEn: "Delhi", cityCn: "新德里", cityJp: "デリー", iata: "DEL", lat: 28.5562, lon: 77.1000 },
      { cityKo: "뭄바이", cityEn: "Mumbai", cityCn: "孟买", cityJp: "ムンバイ", iata: "BOM", lat: 19.0896, lon: 72.8656 }
    ]
  },
  {
    iso2: "AE", nameKo: "아랍에미리트", nameEn: "United Arab Emirates", nameCn: "阿联酋", nameJp: "アラブ首長国連邦",
    cities: [
      { cityKo: "두바이", cityEn: "Dubai", cityCn: "迪拜", cityJp: "ドバイ", iata: "DXB", lat: 25.2532, lon: 55.3657 },
      { cityKo: "아부다비", cityEn: "Abu Dhabi", cityCn: "阿布扎比", cityJp: "アブダビ", iata: "AUH", lat: 24.4330, lon: 54.6470 }
    ]
  },
  {
    iso2: "QA", nameKo: "카타르", nameEn: "Qatar", nameCn: "卡塔尔", nameJp: "カタール",
    cities: [
      { cityKo: "도하", cityEn: "Doha", cityCn: "多哈", cityJp: "ドーハ", iata: "DOH", lat: 25.2731, lon: 51.6085 }
    ]
  },
  {
    iso2: "TR", nameKo: "튀르키예", nameEn: "Türkiye", nameCn: "土耳其", nameJp: "トルコ",
    cities: [
      { cityKo: "이스탄불(신공항)", cityEn: "Istanbul (IST)", cityCn: "伊斯坦布尔（IST）", cityJp: "イスタンブール（IST）", iata: "IST", lat: 41.2753, lon: 28.7519 },
      { cityKo: "이스탄불(사비하)", cityEn: "Istanbul (Sabiha)", cityCn: "伊斯坦布尔（萨比哈）", cityJp: "イスタンブール（サビハ）", iata: "SAW", lat: 40.8986, lon: 29.3092 }
    ]
  },
  {
    iso2: "JO", nameKo: "요르단", nameEn: "Jordan", nameCn: "约旦", nameJp: "ヨルダン",
    cities: [
      { cityKo: "암만", cityEn: "Amman", cityCn: "安曼", cityJp: "アンマン", iata: "AMM", lat: 31.7226, lon: 35.9932 }
    ]
  },
  {
    iso2: "IL", nameKo: "이스라엘", nameEn: "Israel", nameCn: "以色列", nameJp: "イスラエル",
    cities: [
      { cityKo: "텔아비브", cityEn: "Tel Aviv", cityCn: "特拉维夫", cityJp: "テルアビブ", iata: "TLV", lat: 32.0004, lon: 34.8707 }
    ]
  },
  {
    iso2: "SA", nameKo: "사우디아라비아", nameEn: "Saudi Arabia", nameCn: "沙特阿拉伯", nameJp: "サウジアラビア",
    cities: [
      { cityKo: "리야드", cityEn: "Riyadh", cityCn: "利雅得", cityJp: "リヤド", iata: "RUH", lat: 24.9576, lon: 46.6988 }
    ]
  },

  // ====== 유럽 ======
  {
    iso2: "HU", nameKo: "헝가리", nameEn: "Hungary", nameCn: "匈牙利", nameJp: "ハンガリー",
    cities: [
      { cityKo: "부다페스트", cityEn: "Budapest", cityCn: "布达佩斯", cityJp: "ブダペスト", iata: "BUD", lat: 47.4369, lon: 19.2556 }
    ]
  },
  {
    iso2: "GB", nameKo: "영국", nameEn: "United Kingdom", nameCn: "英国", nameJp: "イギリス",
    cities: [
      { cityKo: "런던(히스로)", cityEn: "London (Heathrow)", cityCn: "伦敦（希思罗）", cityJp: "ロンドン（ヒースロー）", iata: "LHR", lat: 51.4700, lon: -0.4543 }
    ]
  },
  {
    iso2: "FR", nameKo: "프랑스", nameEn: "France", nameCn: "法国", nameJp: "フランス",
    cities: [
      { cityKo: "파리(CDG)", cityEn: "Paris (CDG)", cityCn: "巴黎（戴高乐）", cityJp: "パリ（シャルル・ド・ゴール）", iata: "CDG", lat: 49.0097, lon: 2.5479 }
    ]
  },
  {
    iso2: "DE", nameKo: "독일", nameEn: "Germany", nameCn: "德国", nameJp: "ドイツ",
    cities: [
      { cityKo: "프랑크푸르트", cityEn: "Frankfurt", cityCn: "法兰克福", cityJp: "フランクフルト", iata: "FRA", lat: 50.0379, lon: 8.5622 }
    ]
  },
  {
    iso2: "NL", nameKo: "네덜란드", nameEn: "Netherlands", nameCn: "荷兰", nameJp: "オランダ",
    cities: [
      { cityKo: "암스테르담", cityEn: "Amsterdam", cityCn: "阿姆斯特丹", cityJp: "アムステルダム", iata: "AMS", lat: 52.3105, lon: 4.7683 }
    ]
  },
  {
    iso2: "IT", nameKo: "이탈리아", nameEn: "Italy", nameCn: "意大利", nameJp: "イタリア",
    cities: [
      { cityKo: "로마(피우미치노)", cityEn: "Rome (Fiumicino)", cityCn: "罗马（菲乌米奇诺）", cityJp: "ローマ（フィウミチーノ）", iata: "FCO", lat: 41.7999, lon: 12.2462 }
    ]
  },
  {
    iso2: "ES", nameKo: "스페인", nameEn: "Spain", nameCn: "西班牙", nameJp: "スペイン",
    cities: [
      { cityKo: "마드리드", cityEn: "Madrid", cityCn: "马德里", cityJp: "マドリード", iata: "MAD", lat: 40.4722, lon: -3.5608 }
    ]
  },
  {
    iso2: "CH", nameKo: "스위스", nameEn: "Switzerland", nameCn: "瑞士", nameJp: "スイス",
    cities: [
      { cityKo: "취리히", cityEn: "Zurich", cityCn: "苏黎世", cityJp: "チューリッヒ", iata: "ZRH", lat: 47.4581, lon: 8.5555 }
    ]
  },
  {
    iso2: "AT", nameKo: "오스트리아", nameEn: "Austria", nameCn: "奥地利", nameJp: "オーストリア",
    cities: [
      { cityKo: "비엔나", cityEn: "Vienna", cityCn: "维也纳", cityJp: "ウィーン", iata: "VIE", lat: 48.1103, lon: 16.5697 }
    ]
  },
  {
    iso2: "CZ", nameKo: "체코", nameEn: "Czechia", nameCn: "捷克", nameJp: "チェコ",
    cities: [
      { cityKo: "프라하", cityEn: "Prague", cityCn: "布拉格", cityJp: "プラハ", iata: "PRG", lat: 50.1008, lon: 14.2600 }
    ]
  },
  {
    iso2: "PL", nameKo: "폴란드", nameEn: "Poland", nameCn: "波兰", nameJp: "ポーランド",
    cities: [
      { cityKo: "바르샤바", cityEn: "Warsaw", cityCn: "华沙", cityJp: "ワルシャワ", iata: "WAW", lat: 52.1657, lon: 20.9671 }
    ]
  },
  {
    iso2: "PT", nameKo: "포르투갈", nameEn: "Portugal", nameCn: "葡萄牙", nameJp: "ポルトガル",
    cities: [
      { cityKo: "리스본", cityEn: "Lisbon", cityCn: "里斯本", cityJp: "リスボン", iata: "LIS", lat: 38.7742, lon: -9.1342 }
    ]
  },
  {
    iso2: "GR", nameKo: "그리스", nameEn: "Greece", nameCn: "希腊", nameJp: "ギリシャ",
    cities: [
      { cityKo: "아테네", cityEn: "Athens", cityCn: "雅典", cityJp: "アテネ", iata: "ATH", lat: 37.9364, lon: 23.9445 }
    ]
  },
  {
    iso2: "SE", nameKo: "스웨덴", nameEn: "Sweden", nameCn: "瑞典", nameJp: "スウェーデン",
    cities: [
      { cityKo: "스톡홀름", cityEn: "Stockholm", cityCn: "斯德哥尔摩", cityJp: "ストックホルム", iata: "ARN", lat: 59.6498, lon: 17.9238 }
    ]
  },
  {
    iso2: "NO", nameKo: "노르웨이", nameEn: "Norway", nameCn: "挪威", nameJp: "ノルウェー",
    cities: [
      { cityKo: "오슬로", cityEn: "Oslo", cityCn: "奥斯陆", cityJp: "オスロ", iata: "OSL", lat: 60.1939, lon: 11.1004 }
    ]
  },
  {
    iso2: "DK", nameKo: "덴마크", nameEn: "Denmark", nameCn: "丹麦", nameJp: "デンマーク",
    cities: [
      { cityKo: "코펜하겐", cityEn: "Copenhagen", cityCn: "哥本哈根", cityJp: "コペンハーゲン", iata: "CPH", lat: 55.6180, lon: 12.6508 }
    ]
  },
  {
    iso2: "FI", nameKo: "핀란드", nameEn: "Finland", nameCn: "芬兰", nameJp: "フィンランド",
    cities: [
      { cityKo: "헬싱키", cityEn: "Helsinki", cityCn: "赫尔辛基", cityJp: "ヘルシンキ", iata: "HEL", lat: 60.3172, lon: 24.9633 }
    ]
  },
  {
    iso2: "IE", nameKo: "아일랜드", nameEn: "Ireland", nameCn: "爱尔兰", nameJp: "アイルランド",
    cities: [
      { cityKo: "더블린", cityEn: "Dublin", cityCn: "都柏林", cityJp: "ダブリン", iata: "DUB", lat: 53.4273, lon: -6.2436 }
    ]
  },
  {
    iso2: "BE", nameKo: "벨기에", nameEn: "Belgium", nameCn: "比利时", nameJp: "ベルギー",
    cities: [
      { cityKo: "브뤼셀", cityEn: "Brussels", cityCn: "布鲁塞尔", cityJp: "ブリュッセル", iata: "BRU", lat: 50.9010, lon: 4.4844 }
    ]
  },

  // ====== 오세아니아 ======
  {
    iso2: "AU", nameKo: "호주", nameEn: "Australia", nameCn: "澳大利亚", nameJp: "オーストラリア",
    cities: [
      { cityKo: "시드니", cityEn: "Sydney", cityCn: "悉尼", cityJp: "シドニー", iata: "SYD", lat: -33.9399, lon: 151.1753 },
      { cityKo: "멜버른", cityEn: "Melbourne", cityCn: "墨尔本", cityJp: "メルボルン", iata: "MEL", lat: -37.6733, lon: 144.8433 },
      { cityKo: "브리즈번", cityEn: "Brisbane", cityCn: "布里斯班", cityJp: "ブリスベン", iata: "BNE", lat: -27.3842, lon: 153.1175 }
    ]
  },
  {
    iso2: "NZ", nameKo: "뉴질랜드", nameEn: "New Zealand", nameCn: "新西兰", nameJp: "ニュージーランド",
    cities: [
      { cityKo: "오클랜드", cityEn: "Auckland", cityCn: "奥克兰", cityJp: "オークランド", iata: "AKL", lat: -37.0082, lon: 174.7850 }
    ]
  },
  {
    iso2: "MV", nameKo: "몰디브", nameEn: "Maldives", nameCn: "马尔代夫", nameJp: "モルディブ",
    cities: [
      { cityKo: "말레", cityEn: "Malé", cityCn: "马累", cityJp: "マレ", iata: "MLE", lat: 4.1918, lon: 73.5291 }
    ]
  },
  {
    iso2: "GU", nameKo: "괌(미국령)", nameEn: "Guam", nameCn: "关岛", nameJp: "グアム",
    cities: [
      { cityKo: "괌", cityEn: "Guam", cityCn: "关岛", cityJp: "グアム", iata: "GUM", lat: 13.4839, lon: 144.7960 }
    ]
  },
  {
    iso2: "MP", nameKo: "사이판(미국령)", nameEn: "Northern Mariana Islands", nameCn: "北马里亚纳群岛", nameJp: "北マリアナ諸島",
    cities: [
      { cityKo: "사이판", cityEn: "Saipan", cityCn: "塞班", cityJp: "サイパン", iata: "SPN", lat: 15.1190, lon: 145.7290 }
    ]
  },

  // ====== 미주 ======
  {
    iso2: "US", nameKo: "미국", nameEn: "United States", nameCn: "美国", nameJp: "アメリカ合衆国",
    cities: [
      { cityKo: "로스앤젤레스", cityEn: "Los Angeles", cityCn: "洛杉矶", cityJp: "ロサンゼルス", iata: "LAX", lat: 33.9416, lon: -118.4085 },
      { cityKo: "샌프란시스코", cityEn: "San Francisco", cityCn: "旧金山", cityJp: "サンフランシスコ", iata: "SFO", lat: 37.6213, lon: -122.3790 },
      { cityKo: "시애틀", cityEn: "Seattle", cityCn: "西雅图", cityJp: "シアトル", iata: "SEA", lat: 47.4502, lon: -122.3088 },
      { cityKo: "시카고", cityEn: "Chicago", cityCn: "芝加哥", cityJp: "シカゴ", iata: "ORD", lat: 41.9742, lon: -87.9073 },
      { cityKo: "뉴욕(JFK)", cityEn: "New York (JFK)", cityCn: "纽约（JFK）", cityJp: "ニューヨーク（JFK）", iata: "JFK", lat: 40.6413, lon: -73.7781 },
      { cityKo: "워싱턴 D.C.", cityEn: "Washington D.C.", cityCn: "华盛顿", cityJp: "ワシントンD.C.", iata: "IAD", lat: 38.9531, lon: -77.4565 },
      { cityKo: "애틀랜타", cityEn: "Atlanta", cityCn: "亚特兰大", cityJp: "アトランタ", iata: "ATL", lat: 33.6407, lon: -84.4277 },
      { cityKo: "호놀룰루", cityEn: "Honolulu", cityCn: "火奴鲁鲁", cityJp: "ホノルル", iata: "HNL", lat: 21.3187, lon: -157.9220 }
    ]
  },
  {
    iso2: "CA", nameKo: "캐나다", nameEn: "Canada", nameCn: "加拿大", nameJp: "カナダ",
    cities: [
      { cityKo: "밴쿠버", cityEn: "Vancouver", cityCn: "温哥华", cityJp: "バンクーバー", iata: "YVR", lat: 49.1951, lon: -123.1779 },
      { cityKo: "토론토", cityEn: "Toronto", cityCn: "多伦多", cityJp: "トロント", iata: "YYZ", lat: 43.6777, lon: -79.6248 }
    ]
  },
  {
    iso2: "MX", nameKo: "멕시코", nameEn: "Mexico", nameCn: "墨西哥", nameJp: "メキシコ",
    cities: [
      { cityKo: "멕시코시티", cityEn: "Mexico City", cityCn: "墨西哥城", cityJp: "メキシコシティ", iata: "MEX", lat: 19.4361, lon: -99.0719 }
    ]
  },
  {
    iso2: "BR", nameKo: "브라질", nameEn: "Brazil", nameCn: "巴西", nameJp: "ブラジル",
    cities: [
      { cityKo: "상파울루(구아룰류스)", cityEn: "São Paulo (Guarulhos)", cityCn: "圣保罗（瓜鲁柳斯）", cityJp: "サンパウロ（グアルーリョス）", iata: "GRU", lat: -23.4322, lon: -46.4695 }
    ]
  },
  {
    iso2: "AR", nameKo: "아르헨티나", nameEn: "Argentina", nameCn: "阿根廷", nameJp: "アルゼンチン",
    cities: [
      { cityKo: "부에노스아이레스(EZE)", cityEn: "Buenos Aires (EZE)", cityCn: "布宜诺斯艾利斯（EZE）", cityJp: "ブエノスアイレス（EZE）", iata: "EZE", lat: -34.8128, lon: -58.5394 }
    ]
  },
  {
    iso2: "CL", nameKo: "칠레", nameEn: "Chile", nameCn: "智利", nameJp: "チリ",
    cities: [
      { cityKo: "산티아고", cityEn: "Santiago", cityCn: "圣地亚哥", cityJp: "サンティアゴ", iata: "SCL", lat: -33.3929, lon: -70.7858 }
    ]
  },
  {
    iso2: "PE", nameKo: "페루", nameEn: "Peru", nameCn: "秘鲁", nameJp: "ペルー",
    cities: [
      { cityKo: "리마", cityEn: "Lima", cityCn: "利马", cityJp: "リマ", iata: "LIM", lat: -12.0219, lon: -77.1143 }
    ]
  },

  // ====== 아프리카(대표) ======
  {
    iso2: "EG", nameKo: "이집트", nameEn: "Egypt", nameCn: "埃及", nameJp: "エジプト",
    cities: [
      { cityKo: "카이로", cityEn: "Cairo", cityCn: "开罗", cityJp: "カイロ", iata: "CAI", lat: 30.1219, lon: 31.4056 }
    ]
  },
  {
    iso2: "MA", nameKo: "모로코", nameEn: "Morocco", nameCn: "摩洛哥", nameJp: "モロッコ",
    cities: [
      { cityKo: "카사블랑카", cityEn: "Casablanca", cityCn: "卡萨布兰卡", cityJp: "カサブランカ", iata: "CMN", lat: 33.3675, lon: -7.58997 }
    ]
  },
  {
    iso2: "ZA", nameKo: "남아프리카공화국", nameEn: "South Africa", nameCn: "南非", nameJp: "南アフリカ共和国",
    cities: [
      { cityKo: "요하네스버그", cityEn: "Johannesburg", cityCn: "约翰内斯堡", cityJp: "ヨハネスブルグ", iata: "JNB", lat: -26.1337, lon: 28.2420 }
    ]
  },
  {
    iso2: "KE", nameKo: "케냐", nameEn: "Kenya", nameCn: "肯尼亚", nameJp: "ケニア",
    cities: [
      { cityKo: "나이로비", cityEn: "Nairobi", cityCn: "内罗毕", cityJp: "ナイロビ", iata: "NBO", lat: -1.3192, lon: 36.9278 }
    ]
  },
  {
    iso2: "ET", nameKo: "에티오피아", nameEn: "Ethiopia", nameCn: "埃塞俄比亚", nameJp: "エチオピア",
    cities: [
      { cityKo: "아디스아바바", cityEn: "Addis Ababa", cityCn: "亚的斯亚贝巴", cityJp: "アディスアベバ", iata: "ADD", lat: 8.9779, lon: 38.7993 }
    ]
  }
];

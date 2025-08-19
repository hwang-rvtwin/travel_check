// src/data/currency.ts
export type Currency = {
  code: string;
  symbol: string;
  nameEn: string;
  nameKr: string;
  decimals: number;
};

export const CURRENCY_BY_ISO2: Record<string, Currency> = {
  KR: { code: 'KRW', symbol: '₩',  nameEn: 'Korean Won',           nameKr: '대한민국 원',          decimals: 0 },
  JP: { code: 'JPY', symbol: '¥',  nameEn: 'Japanese Yen',         nameKr: '일본 엔',              decimals: 0 },
  US: { code: 'USD', symbol: '$',  nameEn: 'US Dollar',            nameKr: '미국 달러',            decimals: 2 },
  CN: { code: 'CNY', symbol: '¥',  nameEn: 'Chinese Yuan',         nameKr: '중국 위안',            decimals: 2 },
  HK: { code: 'HKD', symbol: '$',  nameEn: 'Hong Kong Dollar',     nameKr: '홍콩 달러',            decimals: 2 },
  MO: { code: 'MOP', symbol: 'MOP$', nameEn: 'Macanese Pataca',    nameKr: '마카오 파타카',        decimals: 2 },
  TW: { code: 'TWD', symbol: 'NT$', nameEn: 'New Taiwan Dollar',   nameKr: '신타이완 달러',        decimals: 0 },
  SG: { code: 'SGD', symbol: 'S$', nameEn: 'Singapore Dollar',     nameKr: '싱가포르 달러',        decimals: 2 },
  MY: { code: 'MYR', symbol: 'RM', nameEn: 'Malaysian Ringgit',    nameKr: '말레이시아 링깃',      decimals: 2 },
  TH: { code: 'THB', symbol: '฿',  nameEn: 'Thai Baht',            nameKr: '태국 바트',            decimals: 2 },
  VN: { code: 'VND', symbol: '₫',  nameEn: 'Vietnamese Dong',      nameKr: '베트남 동',            decimals: 0 },
  ID: { code: 'IDR', symbol: 'Rp', nameEn: 'Indonesian Rupiah',    nameKr: '인도네시아 루피아',    decimals: 0 },
  PH: { code: 'PHP', symbol: '₱',  nameEn: 'Philippine Piso',      nameKr: '필리핀 페소',          decimals: 2 },
  BN: { code: 'BND', symbol: 'B$', nameEn: 'Brunei Dollar',        nameKr: '브루나이 달러',        decimals: 2 },
  KH: { code: 'KHR', symbol: '៛',  nameEn: 'Cambodian Riel',       nameKr: '캄보디아 리엘',        decimals: 0 },
  LA: { code: 'LAK', symbol: '₭',  nameEn: 'Lao Kip',              nameKr: '라오스 킵',            decimals: 0 },
  MM: { code: 'MMK', symbol: 'K',  nameEn: 'Myanmar Kyat',         nameKr: '미얀마 짯',            decimals: 0 },

  IN: { code: 'INR', symbol: '₹',  nameEn: 'Indian Rupee',         nameKr: '인도 루피',            decimals: 2 },
  LK: { code: 'LKR', symbol: 'Rs', nameEn: 'Sri Lankan Rupee',     nameKr: '스리랑카 루피',        decimals: 2 },
  NP: { code: 'NPR', symbol: 'Rs', nameEn: 'Nepalese Rupee',       nameKr: '네팔 루피',            decimals: 2 },
  MV: { code: 'MVR', symbol: 'Rf', nameEn: 'Maldivian Rufiyaa',    nameKr: '몰디브 루피야',        decimals: 2 },

  AU: { code: 'AUD', symbol: 'A$', nameEn: 'Australian Dollar',    nameKr: '호주 달러',            decimals: 2 },
  NZ: { code: 'NZD', symbol: 'NZ$', nameEn: 'New Zealand Dollar',  nameKr: '뉴질랜드 달러',        decimals: 2 },
  GU: { code: 'USD', symbol: '$',  nameEn: 'US Dollar',            nameKr: '미국 달러',            decimals: 2 }, // Guam
  MP: { code: 'USD', symbol: '$',  nameEn: 'US Dollar',            nameKr: '미국 달러',            decimals: 2 }, // Saipan

  AE: { code: 'AED', symbol: 'د.إ', nameEn: 'UAE Dirham',          nameKr: '아랍에미리트 디르함',  decimals: 2 },
  QA: { code: 'QAR', symbol: 'ر.ق', nameEn: 'Qatari Riyal',        nameKr: '카타르 리얄',          decimals: 2 },
  TR: { code: 'TRY', symbol: '₺',  nameEn: 'Turkish Lira',         nameKr: '터키 리라',            decimals: 2 },
  SA: { code: 'SAR', symbol: 'ر.س', nameEn: 'Saudi Riyal',         nameKr: '사우디 리얄',          decimals: 2 },
  IL: { code: 'ILS', symbol: '₪',  nameEn: 'Israeli New Shekel',   nameKr: '이스라엘 신 셰켈',     decimals: 2 },
  JO: { code: 'JOD', symbol: 'JD', nameEn: 'Jordanian Dinar',      nameKr: '요르단 디나르',        decimals: 3 },
  EG: { code: 'EGP', symbol: 'E£', nameEn: 'Egyptian Pound',       nameKr: '이집트 파운드',        decimals: 2 },

  GB: { code: 'GBP', symbol: '£',  nameEn: 'Pound Sterling',       nameKr: '영국 파운드',          decimals: 2 },
  FR: { code: 'EUR', symbol: '€',  nameEn: 'Euro',                 nameKr: '유로',                 decimals: 2 },
  DE: { code: 'EUR', symbol: '€',  nameEn: 'Euro',                 nameKr: '유로',                 decimals: 2 },
  NL: { code: 'EUR', symbol: '€',  nameEn: 'Euro',                 nameKr: '유로',                 decimals: 2 },
  IT: { code: 'EUR', symbol: '€',  nameEn: 'Euro',                 nameKr: '유로',                 decimals: 2 },
  ES: { code: 'EUR', symbol: '€',  nameEn: 'Euro',                 nameKr: '유로',                 decimals: 2 },
  CH: { code: 'CHF', symbol: 'CHF',nameEn: 'Swiss Franc',          nameKr: '스위스 프랑',          decimals: 2 },
  AT: { code: 'EUR', symbol: '€',  nameEn: 'Euro',                 nameKr: '유로',                 decimals: 2 },
  SE: { code: 'SEK', symbol: 'kr', nameEn: 'Swedish Krona',        nameKr: '스웨덴 크로나',        decimals: 2 },
  NO: { code: 'NOK', symbol: 'kr', nameEn: 'Norwegian Krone',      nameKr: '노르웨이 크로네',      decimals: 2 },
  DK: { code: 'DKK', symbol: 'kr', nameEn: 'Danish Krone',         nameKr: '덴마크 크로네',        decimals: 2 },
  FI: { code: 'EUR', symbol: '€',  nameEn: 'Euro',                 nameKr: '유로',                 decimals: 2 },
  IE: { code: 'EUR', symbol: '€',  nameEn: 'Euro',                 nameKr: '유로',                 decimals: 2 },
  CZ: { code: 'CZK', symbol: 'Kč', nameEn: 'Czech Koruna',         nameKr: '체코 코루나',          decimals: 2 },
  HU: { code: 'HUF', symbol: 'Ft', nameEn: 'Hungarian Forint',     nameKr: '헝가리 포린트',        decimals: 0 },
  PL: { code: 'PLN', symbol: 'zł', nameEn: 'Polish Złoty',         nameKr: '폴란드 즈워티',        decimals: 2 },
  PT: { code: 'EUR', symbol: '€',  nameEn: 'Euro',                 nameKr: '유로',                 decimals: 2 },
  GR: { code: 'EUR', symbol: '€',  nameEn: 'Euro',                 nameKr: '유로',                 decimals: 2 },

  CA: { code: 'CAD', symbol: 'C$', nameEn: 'Canadian Dollar',      nameKr: '캐나다 달러',          decimals: 2 },
  MX: { code: 'MXN', symbol: '$',  nameEn: 'Mexican Peso',         nameKr: '멕시코 페소',          decimals: 2 },

  BR: { code: 'BRL', symbol: 'R$', nameEn: 'Brazilian Real',       nameKr: '브라질 헤알',          decimals: 2 },
  CL: { code: 'CLP', symbol: '$',  nameEn: 'Chilean Peso',         nameKr: '칠레 페소',            decimals: 0 },

  ZA: { code: 'ZAR', symbol: 'R',  nameEn: 'South African Rand',   nameKr: '남아프리카 랜드',      decimals: 2 },
  KE: { code: 'KES', symbol: 'KSh',nameEn: 'Kenyan Shilling',      nameKr: '케냐 실링',            decimals: 2 }
};

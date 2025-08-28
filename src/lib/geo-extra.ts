// src/lib/geo-extra.ts
export const TZ_BY_ISO2: Record<string, string> = {
  JP:'Asia/Tokyo', TH:'Asia/Bangkok', US:'America/New_York', GB:'Europe/London',
  FR:'Europe/Paris', DE:'Europe/Berlin', IT:'Europe/Rome', ES:'Europe/Madrid',
  AU:'Australia/Sydney', NZ:'Pacific/Auckland', SG:'Asia/Singapore', MY:'Asia/Kuala_Lumpur',
  VN:'Asia/Ho_Chi_Minh', ID:'Asia/Jakarta', TW:'Asia/Taipei', HK:'Asia/Hong_Kong',
  CN:'Asia/Shanghai', CA:'America/Toronto', AE:'Asia/Dubai', TR:'Europe/Istanbul',
};

export const CCY_BY_ISO2: Record<string, string> = {
  JP:'JPY', TH:'THB', US:'USD', GB:'GBP', FR:'EUR', DE:'EUR', IT:'EUR', ES:'EUR',
  AU:'AUD', NZ:'NZD', SG:'SGD', MY:'MYR', VN:'VND', ID:'IDR', TW:'TWD', HK:'HKD',
  CN:'CNY', CA:'CAD', AE:'AED', TR:'TRY',
};
/*
export const CCY_BY_ISO2: Record<string, string> = {
  JP:'엔', TH:'바트', US:'달러(미국)', GB:'파운드(영국)', FR:'유로', DE:'유로', IT:'유로', ES:'유로',
  AU:'달러(호주)', NZ:'달러(뉴질랜드)', SG:'달러(싱가포르)', MY:'링깃', VN:'동', ID:'루피아', TW:'달러(신타이완)', HK:'달러(홍콩)',
  CN:'위안', CA:'달러(캐나다)', AE:'디르함', TR:'리라',
};
*/

// src/lib/packing.ts
import type { CountryMeta } from "./countries";

export type PackingMonth = typeof import("./countries").MONTH_SLUGS[number];

export interface MonthlyClimateSummary {
  tAvg?: number;    // °C
  rainMm?: number;  // 월강수량
  summary: string;  // "덥고 습함 · 소나기 잦음" 등
}

export interface PackingAdvice {
  tops: string[]; bottoms: string[]; outer: string[]; shoes: string[];
  accessories: string[]; electronics: string[]; health: string[];
  docs: string[]; etc: string[];
  threeLine: [string,string,string];
}

const BAND_BASED_GUIDE: Record<string,(m:number)=>MonthlyClimateSummary> = {
  tropical: (m)=>({ summary: m>=5&&m<=10 ? "덥고 습함 · 소나기 잦음" : "덥고 다습 · 간헐적 비" }),
  temperate: (m)=>({ summary: m>=6&&m<=8 ? "덥고 습함" : (m===4||m===5||m===9||m===10 ? "온화함 · 일교차 유의" : "춥고 건조 · 보온 필요") }),
  arid: (m)=>({ summary: "건조함 · 강한 일사 · 야간 온도 하강" }),
  continental: (m)=>({ summary: m>=6&&m<=8 ? "짧은 여름 · 소나기 유의" : "추움 · 방풍/보온 필요" }),
  mediterranean: (m)=>({ summary: m>=6&&m<=9 ? "덥고 건조 · 자외선 강함" : "온화하고 습윤" }),
};

export function deriveMonthlyClimate(country: CountryMeta, month: number): MonthlyClimateSummary {
  const base = BAND_BASED_GUIDE[country.climate]?.(month);
  return base ?? { summary: "평년 수준 · 기본 복장 권장" };
}

export function buildPackingAdvice(country: CountryMeta, month: number, climate: MonthlyClimateSummary): PackingAdvice {
  const warm = climate.summary.includes("덥");
  const cold = climate.summary.includes("춥") || climate.summary.includes("보온");
  const wet  = climate.summary.includes("비") || climate.summary.includes("소나기") || climate.summary.includes("습");

  const tops = warm ? ["반팔 3~4", "린넨 셔츠 1", "기능성 티 1"] : ["긴팔 2~3", "내복/히트텍 1", "니트 1"];
  const bottoms = warm ? ["얇은 팬츠 1~2", "반바지 1"] : ["두께 있는 팬츠 2", "기모/보온 레깅스 1"];
  const outer = cold ? ["경량 패딩 1", "방풍 자켓 1"] : wet ? ["얇은 방수 자켓 1"] : ["얇은 가디건 1"];
  const shoes = wet ? ["방수 워킹화 1", "샌들 1(선택)"] : warm ? ["워킹화 1", "샌들 1(선택)"] : ["워킹화 1", "부츠(선택)"];
  const accessories = [
    wet ? "우산/우비" : "모자",
    "자외선차단제", "선글라스", wet ? "여벌 양말 1~2" : "양말"
  ];
  const electronics = ["멀티어댑터", "보조배터리", "C타입 케이블"];
  const health = ["상비약(해열/지사/연고)", wet ? "방수밴드" : "밴드", "마스크(선택)"];
  const docs = ["여권", "카드/현금", "여행자보험", "eSIM/로밍"];
  const etc = ["압축팩", "세탁망", "지퍼백", "휴대용 세제(소)"];

  const threeLine: [string,string,string] = [
    `이달의 체감: ${climate.summary}`,
    wet ? "우산·방수 자켓 권장" : (warm ? "통풍 좋은 상의·샌들 선택" : "보온/방풍 아우터 필수"),
    "전원: 멀티어댑터·보조배터리 준비",
  ];

  return { tops, bottoms, outer, shoes, accessories, electronics, health, docs, etc, threeLine };
}

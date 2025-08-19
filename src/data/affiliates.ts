// src/data/affiliates.ts
/**
 * 제휴 링크 저장소(초기엔 쿠팡만).
 * - slug → 너의 "긴 파트너 링크(affId 포함)" 매핑
 * - 지금은 배너 하나만 쓰니 'plug-adapter'만 등록해두면 됨.
 */
export const COUPANG_SLUGS: Record<string, string> = {
  // 예시: 배너와 동일한 링크를 등록 (원하면 여기다 더 추가)
  'plug-adapter': 'https://link.coupang.com/a/cLuMAS'
};

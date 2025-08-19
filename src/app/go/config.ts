// src/app/go/config.ts
export type VendorKey = 'coupang'; // 나중에 airalo, holafly 등 추가 예정

// subParam: 각 벤더가 subId(채널아이디)로 받는 쿼리 키
export const GO_MAP: Record<VendorKey, { base: string; subParam?: string }> = {
  coupang: { base: '', subParam: 'subId' }
};

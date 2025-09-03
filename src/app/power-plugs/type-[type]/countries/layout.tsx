// src/app/power-plugs/type-[type]/countries/layout.tsx
// (반드시 Server Component: 'use client' 절대 금지)
export const runtime = 'nodejs' as const;

export default function SegmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 별도 UI가 필요 없으면 그대로 children만 반환
  return <>{children}</>;
}

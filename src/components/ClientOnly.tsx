// src/components/ClientOnly.tsx
'use client';

import { useEffect, useState, type ReactNode } from 'react';

export default function ClientOnly({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null; // 서버/첫 하이드레이션에서는 렌더하지 않음
  return <>{children}</>;
}

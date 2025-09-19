'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

export default function NavActiveLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isActive =
    pathname === href ||
    pathname.startsWith(href + '/') ||
    (href !== '/' && pathname === href.replace(/\/$/, ''));

  // 공통(모바일/데스크톱) 언더라인 스타일
  const base =
    'relative pb-1 transition-colors after:absolute after:-bottom-[2px] after:left-0 after:h-[2px] after:bg-sky-600/70 after:transition-all';
  const state = isActive
    ? 'text-sky-700 after:w-full'
    : 'hover:text-sky-700 after:w-0 hover:after:w-full';

  return (
    <Link href={href} className={`${base} ${state}`}>
      {children}
    </Link>
  );
}

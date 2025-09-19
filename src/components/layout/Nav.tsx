// src/components/layout/Nav.tsx
// Server Component (no 'use client')
import Link from 'next/link';
import NavActiveLink from './NavActiveLink';

function PlaneMark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        d="M2 16l20-8-8 10-2 4-2-4-8-2z"
        stroke="currentColor"
        strokeWidth="1.6"
        fill="none"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Nav() {
  const items = [
    { href: '/welcome', label: '소개' },
    { href: '/packing', label: '패킹' },
    { href: '/power-plugs', label: '전원 플러그' },
    { href: '/esim', label: 'eSIM' },
    { href: '/destinations', label: '국가별 정보' },
  ];

  // 데스크톱 CTA (텍스트+아이콘, 라운드 풀 파란 버튼)
  const ctaBtnDesktop =
    'inline-flex items-center gap-2 rounded-full bg-[#0D7BD9] px-4 py-2 ' +
    'text-sm font-semibold text-white shadow-sm transition ' +
    'hover:bg-[#0B6EC5] active:scale-[.98]';

  // 모바일 CTA (아이콘 전용, 원형 버튼)
  const ctaBtnMobile =
    'inline-flex h-9 w-9 items-center justify-center rounded-full ' +
    'bg-[#0D7BD9] text-white shadow-sm transition hover:bg-[#0B6EC5] active:scale-[.98]';

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/75 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="pointer-events-none h-0.5 w-full bg-gradient-to-r from-sky-400/20 via-indigo-400/20 to-fuchsia-400/20" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* 상단 바 */}
        <div className="flex h-14 items-center justify-between">
          {/* 브랜드 */}
          <Link href="/" className="group inline-flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600 ring-1 ring-sky-600/20 transition group-hover:bg-sky-500/15">
              <PlaneMark className="h-4.5 w-4.5" />
            </span>
            <span className="font-semibold tracking-tight group-hover:text-slate-900">
              출국 체크허브
            </span>
          </Link>

          {/* 데스크톱 메뉴 */}
          <nav className="hidden md:flex items-center gap-6 text-[0.925rem] text-slate-700">
            {items.map((item) => (
              <NavActiveLink key={item.href} href={item.href}>
                {item.label}
              </NavActiveLink>
            ))}
          </nav>

          {/* 데스크톱 CTA — 텍스트+아이콘 */}
          <div className="hidden md:flex items-center gap-2">
            <Link href="/start" data-gtag="cta_start" className={ctaBtnDesktop}>
              <PlaneMark className="h-3.5 w-3.5 text-white" />
              여행 체크 시작
            </Link>
          </div>
        </div>

        {/* 모바일 내비: 언더라인 메뉴 + 아이콘 전용 CTA */}
        <nav className="-mb-1 overflow-x-auto pb-2 text-sm text-slate-700 md:hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex min-w-max items-center gap-6 pt-1">
            {items.map((item) => (
              <NavActiveLink key={item.href} href={item.href}>
                {item.label}
              </NavActiveLink>
            ))}
            {/* 아이콘만 보이는 모바일 CTA */}
            <Link
              href="/start"
              data-gtag="cta_start"
              aria-label="여행 체크 시작"
              className={ctaBtnMobile}
              title="여행 체크 시작"
            >
              <PlaneMark className="h-4.5 w-4.5 text-white" />
              <span className="sr-only">여행 체크 시작</span>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

// Server Component (no 'use client')
import Link from "next/link";

export function Nav() {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold">출국 체크허브</Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/welcome">소개</Link>
          <Link href="/packing">패킹</Link>
          <Link href="/power-plugs">전원 플러그</Link>
          <Link href="/esim">eSIM</Link>
          <Link href="/destinations">국가별 정보</Link>
        </nav>
        <div className="flex items-center gap-2">
          {/* ✅ 기존 기능 홈(폼)으로 보냄 */}
          <Link
            href="/start"
            className="hidden md:inline-block rounded-xl bg-teal-600 px-3 py-2 text-white text-sm hover:bg-teal-700"
            data-gtag="cta_start"
          >
            여행 체크 시작
          </Link>
        </div>
      </div>
    </header>
  );
}
export default Nav;

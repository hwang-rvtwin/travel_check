// src/components/layout/Footer.tsx
import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-20 border-t">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 text-sm">
        <div>
          <h4 className="font-semibold">제품</h4>
          <ul className="mt-3 space-y-2">
            <li><Link href="/packing">월별 패킹</Link></li>
            <li><Link href="/power-plugs">전원 플러그</Link></li>
            <li><Link href="/esim">eSIM</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold">리소스</h4>
          <ul className="mt-3 space-y-2">
            <li><Link href="/destinations">국가별 정보</Link></li>
            <li><Link href="/about">소개</Link></li>
            <li><Link href="/contact">문의</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold">정책</h4>
          <ul className="mt-3 space-y-2">
            <li><Link href="/privacy">개인정보처리방침</Link></li>
            <li><Link href="/terms">이용약관</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold">고지</h4>
          <p className="mt-3 text-gray-600">
            일부 링크는 제휴 링크이며 <code>rel=&quot;sponsored&quot;</code>를 적용합니다.
          </p>
        </div>
      </div>
      <div className="border-t">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between text-xs text-gray-500">
          <span>© {new Date().getFullYear()} RVTwin. All rights reserved.</span>
          <a href="mailto:administrator@rvtwin.com" className="hover:underline">
            administrator@rvtwin.com
          </a>
        </div>
      </div>
    </footer>
  );
}
export default Footer;

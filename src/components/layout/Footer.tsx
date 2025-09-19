// src/components/layout/Footer.tsx
import Link from "next/link";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        {title}
      </h4>
      <div className="mt-3 text-sm">{children}</div>
    </div>
  );
}

export function Footer() {
  return (
    // ⬇️ flex 컬럼 문맥에서 남는 공간을 소비해 항상 하단에 위치
    <footer className="mt-auto w-full">
      {/* 상단 장식 라인 */}
      <div className="h-0.5 w-full bg-gradient-to-r from-slate-300/40 to-slate-300/40" />
      {/* 글라스 카드 느낌의 본문 */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-white/70 p-6">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* 제품 */}
            <Section title="제품">
              <ul className="space-y-2">
                <li>
                  <Link href="/packing" className="group inline-flex items-center gap-2 hover:text-sky-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-sky-500/60 transition group-hover:bg-sky-600" />
                    월별 패킹
                  </Link>
                </li>
                <li>
                  <Link href="/power-plugs" className="group inline-flex items-center gap-2 hover:text-sky-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-sky-500/60 transition group-hover:bg-sky-600" />
                    전원 플러그
                  </Link>
                </li>
                <li>
                  <Link href="/esim" className="group inline-flex items-center gap-2 hover:text-sky-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-sky-500/60 transition group-hover:bg-sky-600" />
                    eSIM
                  </Link>
                </li>
              </ul>
            </Section>

            {/* 리소스 */}
            <Section title="리소스">
              <ul className="space-y-2">
                <li>
                  <Link href="/destinations" className="group inline-flex items-center gap-2 hover:text-sky-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-sky-500/60 transition group-hover:bg-sky-600" />
                    국가별 정보
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="group inline-flex items-center gap-2 hover:text-sky-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-sky-500/60 transition group-hover:bg-sky-600" />
                    소개
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="group inline-flex items-center gap-2 hover:text-sky-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-sky-500/60 transition group-hover:bg-sky-600" />
                    문의
                  </Link>
                </li>
              </ul>
            </Section>

            {/* 정책 */}
            <Section title="정책">
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy" className="group inline-flex items-center gap-2 hover:text-sky-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-sky-500/60 transition group-hover:bg-sky-600" />
                    개인정보처리방침
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="group inline-flex items-center gap-2 hover:text-sky-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-sky-500/60 transition group-hover:bg-sky-600" />
                    이용약관
                  </Link>
                </li>
              </ul>
            </Section>

            {/* 고지 */}
            <Section title="고지">
              <p className="leading-relaxed text-slate-600">
                일부 링크는 제휴 링크이며{" "}
                <code className="rounded bg-slate-100 px-1 py-0.5 text-[11px]">
                  rel=&quot;sponsored&quot;
                </code>
                를 적용합니다.
              </p>
            </Section>
          </div>

          {/* 하단 바 */}
          <div className="mt-8 border-t border-slate-300/70 pt-4 text-xs text-slate-500 sm:flex sm:items-center sm:justify-between">
            <span>© {new Date().getFullYear()} RVTwin. All rights reserved.</span>
            <a
              href="mailto:administrator@rvtwin.com"
              className="mt-2 inline-block underline-offset-2 hover:text-sky-700 hover:underline sm:mt-0"
            >
              administrator@rvtwin.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

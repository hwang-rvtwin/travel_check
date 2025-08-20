import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from "next/font/google";
import Link from 'next/link';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: '출국 체크허브 ✈️',
    template: '%s · 출국 체크허브',
  },
  description:
    '비자/입국서류·eSIM·전압/플러그·수하물·날씨/기후를 한 번에 확인하는 출국 준비 허브',
  icons: [
    { rel: 'icon', url: '/favicon.ico' },             // (아래 2번과 충돌 안 나게 파일 위치 정리 필요)
    { rel: 'apple-touch-icon', url: '/apple-touch-icon.png' },
  ],
  applicationName: '출국 체크허브',
  // ❌ 여기 있던 themeColor는 제거
  // themeColor: '#ffffff',
  metadataBase: new URL('https://checkhub.rvtwin.com'),
  alternates: { canonical: '/' },   // 정규 URL 지정
};

// ✅ viewport로 이동
export const viewport: Viewport = {
  themeColor: '#ffffff',
  colorScheme: 'light',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const year = new Date().getFullYear();
  return (
    <html lang="ko">
      <body>
        <div className="min-h-dvh flex flex-col">
          

          <main className="flex-1">{children}</main>
          <footer className="border-t bg-white/70">
            <div className="mx-auto max-w-5xl px-4 py-6 text-center text-sm text-gray-600">

              {/* 링크 네비게이션 */}
              <nav className="mb-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
                <Link href="/" className="hover:underline">홈</Link>
                <Link href="/about" className="hover:underline">소개</Link>
                <Link href="/contact" className="hover:underline">문의</Link>
                <Link href="/legal/privacy" className="hover:underline">개인정보처리방침</Link>
                <Link href="/legal/terms" className="hover:underline">이용약관</Link>
              </nav>

              {/* 카피라이트 */}
              <div>© {year} RVTwin. All rights reserved.</div>

              {/* 연락처(고지) */}
              <div className="mt-1">
                제휴 및 기타 건의/문의:{" "}
                <a className="underline" href="mailto:administrator@rvtwin.com">
                  administrator@rvtwin.com
                </a>{" "}
                <span className="opacity-60"></span>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

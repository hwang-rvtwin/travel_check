import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Link from 'next/link';
import Script from 'next/script';
import './globals.css';
import HeaderNav from '@/components/HeaderNav';
import Analytics from "./(providers)/analytics";

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: { default: '출국 체크허브 ✈️', template: '%s · 출국 체크허브' },
  description:
    '비자/입국서류·eSIM·전압/플러그·수하물·날씨/기후를 한 번에 확인하는 출국 준비 허브',
  icons: [
    { rel: 'icon', url: '/favicon.ico' },
    { rel: 'apple-touch-icon', url: '/apple-touch-icon.png' },
  ],
  applicationName: '출국 체크허브',
  metadataBase: new URL('https://checkhub.rvtwin.com'),
  alternates: { canonical: '/' },
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
  colorScheme: 'light',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const year = new Date().getFullYear();
  const adsClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? '';

  return (
    <html lang="ko" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        {/* ✅ 자동광고 확인용 권장 메타 */}
        {adsClient && (
          <>
            <meta name="google-adsense-account" content={adsClient} />
            {/* 성능을 위해 프리커넥트 */}
            <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
            <link rel="preconnect" href="https://www.googletagservices.com" />
          </>
        )}
      </head>
      <body>
        {/* ✅ AdSense 라이브러리 (자동광고/수동유닛 공통) */}
        {adsClient && (
          <Script
            id="adsbygoogle-lib"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsClient}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}

        <div className="min-h-dvh flex flex-col">          
          <HeaderNav />

          <main className="flex-1">{children}</main>

          <footer className="border-t bg-white/70">
            <div className="mx-auto max-w-5xl px-4 py-6 text-center text-sm text-gray-600">
              <nav className="mb-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
                <Link href="/" className="hover:underline">홈</Link>
                {/*<Link href="/destinations" className="hover:underline">국가 인덱스</Link>*/}
                <Link href="/about" className="hover:underline">소개</Link>
                <Link href="/contact" className="hover:underline">문의</Link>
                <Link href="/legal/privacy" className="hover:underline">개인정보처리방침</Link>
                <Link href="/legal/terms" className="hover:underline">이용약관</Link>
              </nav>

              <div>© {year} RVTwin. All rights reserved.</div>
              <div className="mt-1">
                제휴 및 기타 건의/문의:{' '}
                <a className="underline" href="mailto:administrator@rvtwin.com">
                  administrator@rvtwin.com
                </a>{' '}
                <span className="opacity-60"></span>
              </div>
            </div>
          </footer>
        </div>
        <Analytics />
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from "next/font/google";
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
  metadataBase: new URL('https://travel-check-opal.vercel.app'),
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
              <div>© {year} RVTwin. All rights reserved.</div>
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

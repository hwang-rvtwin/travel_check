// Server Component
import type { Metadata } from "next";
import "./globals.css";
import Nav from "../components/layout/Nav";
import Footer from "../components/layout/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://rvtwin.com"),
  title: {
    default: "출국 체크허브 | 여행 전 필수 체크 한 번에",
    template: "%s | 출국 체크허브",
  },
  description:
    "비자·전원 플러그·패킹·eSIM을 한 곳에서. 신뢰 가능한 출처와 PDF 내보내기 지원.",
  alternates: { canonical: "/" },
  openGraph: { type: "website", url: "https://rvtwin.com" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="scroll-smooth">
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        {/* (필요 시) providers/analytics 등 기존 전역 Provider를 여기에 그대로 유지하세요 */}
        <Nav />
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

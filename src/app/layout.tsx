import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "출국 체크허브",
  description: "여행 전 꼭 필요한 체크를 한 번에",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      {/* ✅ 세로 플렉스 컨테이너 + 전체 높이 확보 */}
      <body className="min-h-screen flex flex-col bg-white text-slate-900">
        <Nav />

        {/* ✅ 본문이 남는 공간을 채우도록 해서 Footer를 아래로 밀어냄 */}
        <main className="flex-1">{children}</main>

        <Footer />
      </body>
    </html>
  );
}

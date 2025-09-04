// src/app/start/page.tsx  (Server Component)
import type { Metadata } from "next";
import LegacyHomeForm from "@/components/home/LegacyHomeForm";

export const metadata: Metadata = {
  title: "여행 체크 시작",
  description: "국가/공항/여권/날짜를 선택하고 비자·전원·패킹·eSIM 정보를 확인하세요.",
  alternates: { canonical: "/start" },
};

export default function StartPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="sr-only">여행 체크 시작</h1>
      <LegacyHomeForm />
    </main>
  );
}

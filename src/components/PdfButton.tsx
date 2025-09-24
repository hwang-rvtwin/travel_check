"use client";

import { useState } from "react";

type Props = {
  country: string;        // slug
  month: string;          // "01" ~ "12" 같은 MonthSlug
  className?: string;
};

export default function PdfButton({ country, month, className }: Props) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading) return;
    setLoading(true);
    try {
      // ✅ GET 호출 (서버가 GET/POST 모두 지원)
      const url = `/api/packing-pdf?country=${encodeURIComponent(country)}&month=${encodeURIComponent(month)}`;
      const res = await fetch(url, { method: "GET" });

      if (!res.ok) {
        // 서버가 JSON 에러 메시지 내려줌
        let msg = "PDF 생성에 실패했습니다.";
        try {
          const data = await res.json();
          if (data?.message) msg = data.message;
        } catch {}
        alert(msg);
        return;
      }

      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = `packing-${country}-${month}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);
    } catch (err) {
      console.error("[PdfButton] download error", err);
      alert("네트워크 오류로 PDF를 내려받지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={
        "inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-white shadow hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60 " +
        (className ?? "")
      }
      aria-label="패킹 가이드를 PDF로 저장"
      title="패킹 가이드를 PDF로 저장"
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
        <path d="M4 6h16v12H4z" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M8 10h8M8 14h5" stroke="currentColor" strokeWidth="1.6" />
      </svg>
      <span className="text-sm font-medium">{loading ? "생성 중…" : "PDF 저장"}</span>
    </button>
  );
}

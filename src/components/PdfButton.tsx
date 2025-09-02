// src/components/PdfButton.tsx
"use client";
import { useState } from "react";
import { trackEvent } from "@/lib/analytics";

export default function PdfButton({ country, month }: { country: string; month: string }) {
  const [loading, setLoading] = useState<boolean>(false);

  const onClick = async () => {
    setLoading(true);
    try {
      trackEvent("download_pdf", { country, month, from: "packing" });

      const res = await fetch(`/api/packing-pdf?country=${country}&month=${month}`);
      if (!res.ok) throw new Error(`PDF request failed: ${res.status}`);

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `packing-${country}-${month}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      // TODO: 토스트/알럿 등 사용자 메시지
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={onClick} className="w-full py-3 rounded-xl bg-black text-white" disabled={loading}>
      {loading ? "생성 중..." : "PDF로 저장 (제휴 혜택 포함)"}
    </button>
  );
}

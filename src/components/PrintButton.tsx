'use client';

import * as React from 'react';

/** 01~12 고정 문자열 타입 */
export type MonthSlug =
  | '01' | '02' | '03' | '04' | '05' | '06'
  | '07' | '08' | '09' | '10' | '11' | '12';

type Props = {
  /** 국가 슬러그 (예: 'japan') */
  country: string;
  /** 월 슬러그 (예: '03') */
  month: MonthSlug;
  /** 인쇄할 특정 영역의 DOM id (없으면 페이지 전체 인쇄) */
  targetId?: string;
  className?: string;
};

/**
 * PDF/인쇄 버튼
 * - window.print() 기반 (파일명은 문서 title을 따르므로, 인쇄 직전 임시로 title을 바꿨다가 복구)
 */
export default function PrintButton({
  country,
  month,
  targetId,
  className = '',
}: Props) {
  const onPrint = React.useCallback(() => {
    // (선택) 특정 영역만 인쇄하고 싶다면 body를 일시 교체하는 간단한 방식
    // 기본은 전체 페이지 인쇄
    const originalTitle = document.title;
    const desiredTitle = `packing-${country}-${month}`;

    let restore: (() => void) | null = null;

    if (targetId) {
      const area = document.getElementById(targetId);
      if (area) {
        const originalHtml = document.body.innerHTML;
        document.body.innerHTML = area.outerHTML;
        restore = () => {
          document.body.innerHTML = originalHtml;
        };
      }
    }

    document.title = desiredTitle;
    window.print();

    // title/DOM 복구
    document.title = originalTitle;
    if (restore) restore();
  }, [country, month, targetId]);

  return (
    <button
      type="button"
      onClick={onPrint}
      className={[
        'inline-flex items-center gap-2 rounded-full bg-sky-600 px-4 py-3',
        'text-white shadow-sm hover:bg-sky-700 focus:outline-none focus-visible:ring-2',
        'focus-visible:ring-sky-400 disabled:opacity-50',
        className,
      ].join(' ')}
      aria-label="PDF로 저장 / 인쇄"
      title="PDF로 저장 / 인쇄"
    >
      <SvgPrinter className="h-4 w-4 text-white" />
      <span className="text-sm font-medium">PDF / 인쇄</span>
    </button>
  );
}

/* 아이콘 (작은 프린터) */
function SvgPrinter({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        d="M6 8V4h12v4M6 16v4h12v-4M4 10h16a2 2 0 012 2v4H2v-4a2 2 0 012-2z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

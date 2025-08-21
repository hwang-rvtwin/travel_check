'use client';

import {useEffect, useMemo, useRef, useState} from 'react';
import {format} from 'date-fns';
import {DayPicker} from 'react-day-picker';
import 'react-day-picker/style.css';

type Props = {
  label: string;
  value: string | null;           // 'YYYY-MM-DD' or null
  onChange: (v: string) => void;
  min?: string;                   // 'YYYY-MM-DD'
  max?: string;                   // 'YYYY-MM-DD'
  className?: string;
};

// 'YYYY-MM-DD' -> Date
function parseISODate(v?: string | null): Date | undefined {
  if (!v) return undefined;
  const [y, m, d] = v.split('-').map(Number);
  if (!y || !m || !d) return undefined;
  return new Date(y, m - 1, d);
}
// Date -> 'YYYY-MM-DD'
function toISODate(d: Date) {
  return format(d, 'yyyy-MM-dd');
}

export default function DateField({label, value, onChange, min, max, className = ''}: Props) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selected = useMemo(() => parseISODate(value), [value]);
  const fromDate = useMemo(() => parseISODate(min), [min]);
  const toDate   = useMemo(() => parseISODate(max), [max]);

  // 바깥 클릭 시 닫기
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener('mousedown', onClick);
    return () => window.removeEventListener('mousedown', onClick);
  }, [open]);

  const handlePick = (d?: Date) => {
    if (!d) return;
    onChange(toISODate(d));
    setOpen(false);
  };

  return (
    <div className={`relative min-w-0 ${className}`} ref={wrapperRef}>
      <label className="mb-1 block text-sm opacity-80">{label}</label>

      {/* 트리거 (readOnly 느낌의 버튼) */}
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="h-10 w-full rounded-md border bg-white px-3 text-left text-[16px] dark:bg-zinc-900"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        {selected ? toISODate(selected) : <span className="opacity-60">연-월-일</span>}
      </button>

      {/* 팝업 캘린더 : 모바일 fixed 모달 / 데스크탑 absolute 드롭다운 */}
      {open && (
        <>
          {/* 모바일 백드롭 */}
          <div
            className="fixed inset-0 z-40 bg-black/30 sm:hidden"
            onClick={() => setOpen(false)}
          />

          <div
            className="
              z-50 rounded-md border bg-white p-2 shadow-lg dark:bg-zinc-900
              fixed left-1/2 top-1/2 w-[min(92vw,24rem)] -translate-x-1/2 -translate-y-1/2
              sm:absolute sm:left-0 sm:top-full sm:mt-2 sm:w-[22rem] sm:translate-x-0 sm:translate-y-0
            "
          >
            <DayPicker
              mode="single"
              selected={selected}
              onSelect={handlePick}
              weekStartsOn={1}
              fromDate={fromDate}
              toDate={toDate}
              captionLayout="dropdown"
              styles={{
                caption: { padding: '0.25rem 0.25rem 0' },
                caption_dropdowns: { gap: '0.25rem' },
              }}
            />
            {/* 모바일 닫기 버튼 */}
            <div className="mt-2 flex justify-end sm:hidden">
              <button
                className="rounded-md border px-3 py-1 text-sm"
                onClick={() => setOpen(false)}
              >
                닫기
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

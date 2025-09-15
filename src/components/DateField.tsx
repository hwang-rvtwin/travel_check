// src/components/DateField.tsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

type Props = {
  label: string;
  value: string;                  // '' 또는 'YYYY-MM-DD'
  onChange: (v: string) => void;
  min?: string;                   // 'YYYY-MM-DD'
  max?: string;                   // 'YYYY-MM-DD'
  className?: string;
};

/* ===== 유틸 ===== */
const WD = ['월', '화', '수', '목', '금', '토', '일']; // 월요일 시작
const pad2 = (n: number) => (n < 10 ? `0${n}` : String(n));

function parseISODate(v?: string | null): Date | undefined {
  if (!v) return undefined;
  const [y, m, d] = v.split('-').map(Number);
  if (!y || !m || !d) return undefined;
  const dt = new Date(y, m - 1, d);
  return Number.isNaN(dt.getTime()) ? undefined : dt;
}
function toISODate(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}
function toReadable(d?: Date) {
  if (!d) return '날짜를 선택하세요';
  const w = ['일', '월', '화', '수', '목', '금', '토'][d.getDay()];
  return `${d.getFullYear()}.${pad2(d.getMonth() + 1)}.${pad2(d.getDate())} (${w})`;
}
function isSameDay(a?: Date, b?: Date) {
  if (!a || !b) return false;
  return a.getFullYear() === b.getFullYear() &&
         a.getMonth() === b.getMonth() &&
         a.getDate() === b.getDate();
}
function clampDate(d: Date, min?: Date, max?: Date) {
  if (min && d < min) return min;
  if (max && d > max) return max;
  return d;
}
function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
/** 월요일 시작 그리드 (6주×7칸) */
function buildCalendarGrid(display: Date) {
  const y = display.getFullYear();
  const m = display.getMonth();
  const first = new Date(y, m, 1);
  const firstDayIndex = (first.getDay() + 6) % 7; // 0=Mon..6=Sun
  const dim = daysInMonth(y, m);

  const prevM = m === 0 ? 11 : m - 1, prevY = m === 0 ? y - 1 : y;
  const prevDim = daysInMonth(prevY, prevM);

  const cells: { date: Date; outside: boolean }[] = [];
  for (let i = firstDayIndex - 1; i >= 0; i--) cells.push({ date: new Date(prevY, prevM, prevDim - i), outside: true });
  for (let d = 1; d <= dim; d++) cells.push({ date: new Date(y, m, d), outside: false });
  const rest = 42 - cells.length, nextM = m === 11 ? 0 : m + 1, nextY = m === 11 ? y + 1 : y;
  for (let d = 1; d <= rest; d++) cells.push({ date: new Date(nextY, nextM, d), outside: true });

  const weeks: typeof cells[] = [];
  for (let i = 0; i < 6; i++) weeks.push(cells.slice(i * 7, (i + 1) * 7));
  return weeks;
}

export default function DateField({
  label, value, onChange, min, max, className = '',
}: Props) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const selected = useMemo(() => parseISODate(value), [value]);
  const fromDate = useMemo(() => parseISODate(min), [min]);
  const toDate = useMemo(() => parseISODate(max), [max]);

  const [display, setDisplay] = useState<Date>(() => selected ?? new Date());
  useEffect(() => {
    setDisplay((d) => clampDate(selected ?? d, fromDate, toDate));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [min, max, value]);

  // 바깥 클릭 / ESC 닫기
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('mousedown', onClick);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('mousedown', onClick);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const weeks = useMemo(() => buildCalendarGrid(display), [display]);

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const isDisabled = (d: Date) => (fromDate && d < fromDate) || (toDate && d > toDate);
  const pick = (d: Date) => { if (!isDisabled(d)) { onChange(toISODate(d)); setOpen(false); } };

  /* ===== 포털 위치 계산 ===== */
  const [pos, setPos] = useState<{top: number; left: number; width: number}>({ top: 0, left: 0, width: 320 });
  const updatePos = () => {
    if (!btnRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    const maxW = 416;                                // ≈ 26rem
    const minW = Math.max(300, Math.floor(r.width)); // 트리거보다 살짝 넓게
    const width = Math.min(maxW, minW);
    let left = Math.round(r.left + window.scrollX);
    const spaceRight = window.innerWidth - (left + width);
    if (spaceRight < 8) left = Math.max(8, window.innerWidth - width - 8);
    const top = Math.round(r.bottom + window.scrollY + 8); // 버튼 아래 + 간격
    setPos({ top, left, width });
  };

  useEffect(() => { if (open) { updatePos(); const on = () => updatePos(); window.addEventListener('scroll', on, true); window.addEventListener('resize', on); return () => { window.removeEventListener('scroll', on, true); window.removeEventListener('resize', on); }; } }, [open]);

  return (
    <div className={`relative min-w-0 ${className}`} ref={wrapRef}>
      <label className="mb-1 block text-sm opacity-80">{label}</label>

      {/* 트리거 */}
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="h-10 w-full rounded-md bg-white px-3 text-left text-[16px] focus:ring-2 focus:ring-sky-400"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        {selected ? toISODate(selected) : <span className="opacity-60">연-월-일</span>}
      </button>

      {/* 포털로 오버레이/팝업 렌더 → 항상 최상단 */}
      {open && createPortal(
        <>
          {/* Overlay */}
          <div className="fixed inset-0 z-[9997] bg-transparent" onClick={() => setOpen(false)} />
          {/* Popup */}
          <div
            className="absolute z-[9998]"
            style={{ position: 'absolute', top: pos.top, left: pos.left, width: pos.width }}
          >
            <div
              className="
                rounded-2xl bg-white p-3
                shadow-[0_18px_60px_-12px_rgba(0,0,0,0.45),0_6px_18px_rgba(0,0,0,0.10)]
                ring-1 ring-black/10
                backdrop-blur supports-[backdrop-filter]:backdrop-blur-xl
                max-h-[75vh] overflow-auto w-full
              "
              role="dialog"
              aria-label={`${label} 달력`}
            >
              {/* 헤더 */}
              <div className="p-5 flex items-center justify-between">
                <div className="text-[15px] font-semibold text-sky-900">
                  {display.getFullYear()}년 {display.getMonth() + 1}월
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const y = display.getFullYear(); const m = display.getMonth();
                      setDisplay(new Date(m === 0 ? y - 1 : y, m === 0 ? 11 : m - 1, 1));
                    }}
                    className="h-8 w-8 rounded-full border bg-sky-50 text-sky-700 hover:bg-sky-100"
                    aria-label="이전 달"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const y = display.getFullYear(); const m = display.getMonth();
                      setDisplay(new Date(m === 11 ? y + 1 : y, m === 11 ? 0 : m + 1, 1));
                    }}
                    className="h-8 w-8 rounded-full border bg-sky-50 text-sky-700 hover:bg-sky-100"
                    aria-label="다음 달"
                  >
                    ›
                  </button>
                </div>
              </div>

              {/* 요일 헤더 */}
              <div className="grid grid-cols-7 gap-y-1 pb-1 text-center text-xs font-medium text-slate-500 mb-3">
                {WD.map((w) => <div key={w}>{w}</div>)}
              </div>

              {/* 날짜 그리드 */}
              <div className="grid grid-cols-7 gap-y-2 mb-5">
                {weeks.flat().map(({ date, outside }, i) => {
                  const sel = isSameDay(date, selected);
                  const isToday = isSameDay(date, today);
                  const disabled = isDisabled(date);

                  let cls = 'mx-auto inline-flex h-10 w-10 items-center justify-center rounded-xl transition';
                  if (sel) cls += ' text-white shadow-md';
                  else if (isToday) cls += ' ring-2 ring-sky-400 text-sky-700';
                  else cls += ' hover:bg-sky-50';
                  if (outside) cls += ' text-slate-400';
                  if (disabled) cls += ' opacity-40 cursor-not-allowed';

                  const style = sel
                    ? { background: 'linear-gradient(180deg, rgb(56 189 248) 0%, rgb(2 132 199) 100%)' }
                    : undefined;

                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => pick(date)}
                      disabled={disabled}
                      className={cls}
                      style={style}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>

              {/* 푸터 */}
              <div className="mt-3 flex items-center justify-between">
                <div className="text-xs text-slate-500 m-3">{toReadable(selected)}</div>
                <div className="flex items-center gap-2 m-3">
                  <button
                    type="button"
                    className="rounded-md px-2.5 py-2 text-xs hover:bg-slate-50 shadow-md"
                    onClick={() => {
                      const t = clampDate(new Date(), fromDate, toDate);
                      onChange(toISODate(t)); setOpen(false); setDisplay(t);
                    }}
                  >
                    오늘
                  </button>
                  <button
                    type="button"
                    className="rounded-md px-2.5 py-2 text-xs hover:bg-slate-50 shadow-md"
                    onClick={() => onChange('')}
                  >
                    지움
                  </button>
                  <button
                    type="button"
                    className="rounded-md px-2.5 py-2 text-xs shadow-md bg-black text-white hover:bg-slate-800"
                    onClick={() => setOpen(false)}
                  >
                    닫기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>,
        document.body
      )}
    </div>
  );
}

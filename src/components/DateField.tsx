'use client';

import { useEffect, useMemo, useState } from 'react';

type Props = {
  label: string;
  value: string | null;           // 'YYYY-MM-DD' or null
  onChange: (v: string) => void;
  min?: string;
  max?: string;
  className?: string;
};

function parse(value: string | null) {
  if (!value) return { y: '', m: '', d: '' };
  const [yy, mm, dd] = value.split('-');
  return { y: yy || '', m: mm || '', d: dd || '' };
}

function daysInMonth(y: number, m: number) {
  return new Date(y, m, 0).getDate();
}
const pad2 = (n: number) => String(n).padStart(2, '0');

export default function DateField({
  label,
  value,
  onChange,
  min,
  max,
  className = '',
}: Props) {
  const [isIOS, setIsIOS] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined' && window.navigator) {
      const { userAgent, platform, maxTouchPoints } = window.navigator;
      const isiOSUA = /iPhone|iPad|iPod/i.test(userAgent);
      const isiPadOS = platform === 'MacIntel' && (maxTouchPoints ?? 0) > 1;
      setIsIOS(isiOSUA || isiPadOS);
    }
  }, []);

  // 항상 호출되는 훅
  const now = useMemo(() => new Date(), []);
  const curY = now.getFullYear();
  const range = 4;

  const years = useMemo(
    () => Array.from({ length: range * 2 + 1 }, (_, i) => String(curY - range + i)),
    [curY]
  );
  const months = useMemo(() => Array.from({ length: 12 }, (_, i) => pad2(i + 1)), []);
  const parts = useMemo(() => parse(value), [value]);

  const dim = useMemo(() => {
    const y = parseInt(parts.y || String(curY), 10);
    const m = parseInt(parts.m || '1', 10);
    return daysInMonth(y, m);
  }, [parts.y, parts.m, curY]);

  const days = useMemo(() => Array.from({ length: dim }, (_, i) => pad2(i + 1)), [dim]);

  const commit = (ny?: string, nm?: string, nd?: string) => {
    const y = ny ?? parts.y;
    const m = nm ?? parts.m;
    const d = nd ?? parts.d;
    if (y && m && d) onChange(`${y}-${m}-${d}`);
    else onChange('');
  };

  // 비 iOS: 네이티브 date 인풋 (데스크탑/안드)
  if (!isIOS) {
    return (
      <div className={`min-w-0 ${className}`}>
        <label className="mb-1 block text-sm opacity-80">{label}</label>
        <input
          type="date"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          min={min}
          max={max}
          className="date-native h-10 w-full max-w-full min-w-0 md:min-w-[160px]
                     rounded-md border px-3 bg-white dark:bg-zinc-900"
        />
      </div>
    );
  }

  // iOS: 3분할 셀렉트 (넘침 방지)
  return (
    <div className={`min-w-0 ${className}`}>
      <label className="mb-1 block text-sm opacity-80">{label}</label>
      <div className="grid grid-cols-3 gap-2">
        <select
          className="h-10 w-full md:min-w-[90px] rounded-md border px-2 bg-white dark:bg-zinc-900"
          value={parts.y}
          onChange={(e) => commit(e.target.value, parts.m, parts.d)}
        >
          <option value="">연</option>
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
        <select
          className="h-10 w-full md:min-w-[90px] rounded-md border px-2 bg-white dark:bg-zinc-900"
          value={parts.m}
          onChange={(e) => commit(parts.y, e.target.value, parts.d)}
        >
          <option value="">월</option>
          {months.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <select
          className="h-10 w-full md:min-w-[90px] rounded-md border px-2 bg-white dark:bg-zinc-900"
          value={parts.d}
          onChange={(e) => commit(parts.y, parts.m, e.target.value)}
        >
          <option value="">일</option>
          {days.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

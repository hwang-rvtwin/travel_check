// src/components/LocalTime.tsx
'use client';
import { useEffect, useState } from 'react';

type CorePart = 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second';

function offsetMinutes(tz: string, now = new Date()): number {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const parts = dtf.formatToParts(now);
  const get = (k: CorePart): number => {
    const v = parts.find((p) => p.type === k)?.value;
    return v ? parseInt(v, 10) : 0;
  };
  const asUTC = Date.UTC(
    get('year'), get('month') - 1, get('day'),
    get('hour'), get('minute'), get('second')
  );
  return (asUTC - now.getTime()) / 60000;
}

export default function LocalTime({ tz }: { tz: string }) {
  const [now, setNow] = useState<Date>(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);
  const local = now.toLocaleString('ko-KR', { timeZone: tz });
  const diffH = Math.round((offsetMinutes(tz, now) - offsetMinutes('Asia/Seoul', now)) / 60);
  const pretty = diffH === 0 ? '동일' : `${diffH > 0 ? '+' : '−'}${Math.abs(diffH)}시간`;

  return (
    <div className="text-sm leading-relaxed">
      <div>현지 시각: <b>{local}</b></div>
      <div>한국과 시차: <b>{pretty}</b></div>
    </div>
  );
}

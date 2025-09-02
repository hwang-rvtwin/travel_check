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
    get('year'),
    get('month') - 1,
    get('day'),
    get('hour'),
    get('minute'),
    get('second')
  );
  // 예: 서울(+9)은 -540, 뉴욕(−5 표준)은 +300 반환
  return (asUTC - now.getTime()) / 60000;
}

// 현재 시점에 DST(서머타임) 적용 중인지 추정 (의존성 없이)
function isDSTNow(tz: string, now = new Date()): boolean {
  // 기준일: 1월 1일/7월 1일(UTC 정오) → 양/음반구 모두 커버
  const jan = new Date(Date.UTC(now.getUTCFullYear(), 0, 1, 12, 0, 0));
  const jul = new Date(Date.UTC(now.getUTCFullYear(), 6, 1, 12, 0, 0));
  const cur = offsetMinutes(tz, now);
  const janOff = offsetMinutes(tz, jan);
  const julOff = offsetMinutes(tz, jul);
  if (janOff === julOff) return false;           // DST 자체가 없는 타임존
  const summerOff = Math.min(janOff, julOff);    // 우리 함수에서 ‘여름 오프셋’이 더 작음
  return cur === summerOff;                      // 현재가 여름 오프셋이면 DST 적용 중
}

export default function LocalTime({ tz }: { tz: string }) {
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);

  const local = now.toLocaleString('ko-KR', { timeZone: tz });
  const diffH = Math.round(
    (offsetMinutes(tz, now) - offsetMinutes('Asia/Seoul', now)) / 60
  );
  const pretty = diffH === 0 ? '동일' : `${diffH > 0 ? '+' : '−'}${Math.abs(diffH)}시간`;
  const hasDST = isDSTNow(tz, now);

  return (
    <div className="text-sm leading-relaxed" suppressHydrationWarning>
      <div>현지 시각: <b>{local}</b></div>
      <div>한국과 시차: <b>{pretty}</b></div>
      {/* DST 한 줄 안내 (추가) */}
      <div className="text-xs text-gray-500">
        {hasDST ? '서머타임 적용 기간' : '서머타임 미적용'}
      </div>
    </div>
  );
}

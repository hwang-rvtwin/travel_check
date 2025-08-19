// src/components/PlugPhoto.tsx
'use client';

type Props = {
  type: string;           // "A" | "B" | "C" ...
  labelPosition?: 'below' | 'right';
  size?: number;          // 이미지 px, 기본 64
};

const TYPE_NAME: Record<string, string> = {
  A: 'Type A', B: 'Type B', C: 'Type C', D: 'Type D', E: 'Type E', F: 'Type F',
  G: 'Type G', H: 'Type H', I: 'Type I', J: 'Type J', K: 'Type K', L: 'Type L',
  M: 'Type M', N: 'Type N'
};

export default function PlugPhoto({ type, size = 64, labelPosition = 'below' }: Props) {
  const t = (type || '').toUpperCase().replace(/[^A-Z]/g, '');
  const title = TYPE_NAME[t] || `Type ${t}`;
  // 이미지 경로 규칙: public/images/plugs/A.webp (없으면 png → jpg → placeholder)
  const srcs = [
    `/images/plugs/${t}.webp`,
    `/images/plugs/${t}.png`,
    `/images/plugs/${t}.jpg`,
    `/images/plugs/placeholder.png`
  ];

  return (
    <div className={`flex items-center ${labelPosition === 'below' ? 'flex-col' : 'flex-row gap-2'}`}>
      <img
        src={srcs[0]}
        onError={(e) => { const el = e.currentTarget as HTMLImageElement; const next = srcs.find(s => s !== el.src.replace(location.origin, '')); if (next) el.src = next; }}
        alt={`${title} plug`}
        width={size}
        height={size}
        className="rounded-md border object-cover bg-white"
      />
      <span className="text-xs opacity-80">{title}</span>
    </div>
  );
}

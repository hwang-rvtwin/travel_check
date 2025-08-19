// src/components/PlugPhotos.tsx
'use client';

type Props = {
  type: string;            // e.g. "A", "B", "C" ...
  size?: number;           // 한 이미지 변의 px, 기본 80
  stacked?: boolean;       // true면 세로 배치, 기본 가로 배치
  showLabel?: boolean;     // 타입 라벨 표시 여부
};

const TYPE_NAME: Record<string, string> = {
  A: 'Type A', B: 'Type B', C: 'Type C', D: 'Type D', E: 'Type E', F: 'Type F',
  G: 'Type G', H: 'Type H', I: 'Type I', J: 'Type J', K: 'Type K', L: 'Type L',
  M: 'Type M', N: 'Type N'
};

function nextSrc(current: string, candidates: string[]) {
  const idx = candidates.findIndex(s => current.endsWith(s));
  const next = candidates[idx + 1];
  return next || candidates[candidates.length - 1];
}

export default function PlugPhotos({ type, size = 80, stacked = false, showLabel = true }: Props) {
  const t = (type || '').toUpperCase().replace(/[^A-Z]/g, '');
  const title = TYPE_NAME[t] || `Type ${t}`;

  // 파일 우선순위(있는 것부터 사용). png만 준비되어도 OK
  const base = `/images/plugs/${t}`;
  const cand3D  = [`${t}_3d.webp`, `${t}_3d.png`, `${t}_3d.jpg`, `placeholder_3d.png`].map(s => `/images/plugs/${s}`);
  const candSock = [`${t}_sock.webp`, `${t}_sock.png`, `${t}_sock.jpg`, `placeholder_sock.png`].map(s => `/images/plugs/${s}`);

  const layout = stacked ? 'flex-col' : 'flex-row';

  return (
    <figure className={`flex ${layout} items-center gap-3 rounded-lg border p-2 bg-white`}>
      <img
        src={cand3D[0]}
        alt={`${title} plug (3D)`}
        width={size}
        height={size}
        className="rounded-md object-cover border bg-white"
        onError={(e) => {
          const el = e.currentTarget as HTMLImageElement;
          el.src = nextSrc(el.src.replace(location.origin, ''), cand3D);
        }}
      />
      <img
        src={candSock[0]}
        alt={`${title} socket`}
        width={size}
        height={size}
        className="rounded-md object-cover border bg-white"
        onError={(e) => {
          const el = e.currentTarget as HTMLImageElement;
          el.src = nextSrc(el.src.replace(location.origin, ''), candSock);
        }}
      />
      {showLabel && (
        <figcaption className="text-xs opacity-80 text-center w-full">
          {title}
        </figcaption>
      )}
    </figure>
  );
}

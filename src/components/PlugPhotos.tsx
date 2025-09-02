// src/components/PlugPhotos.tsx
'use client';
import Image from 'next/image';
import { useState, useMemo } from 'react';

type Props = { type: string; size?: number };

export default function PlugPhotos({ type, size = 80 }: Props) {
  const plugSrc0 = `/plugs/${type}_3d.png`;
  const sockSrc0 = `/plugs/${type}_sock.png`;
  const phPlug = '/plugs/placeholder_3d.png';
  const phSock = '/plugs/placeholder_sock.png';

  const [plugSrc, setPlugSrc] = useState(plugSrc0);
  const [sockSrc, setSockSrc] = useState(sockSrc0);

  // 접근성 라벨
  const label = useMemo(() => `Type ${String(type).toUpperCase()}`, [type]);

  return (
    // 컨테이너를 세로 스택으로 바꿔서: 위(아이콘 행) + 아래(경고 박스)
    <div className="rounded-xl border bg-zinc-800/5 p-2">
      {/* 상단: 기존 행 레이아웃 그대로 */}
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-black/5 p-2">
          <Image
            src={plugSrc}
            alt={`${label} plug`}
            width={size}
            height={size}
            onError={() => setPlugSrc(phPlug)}
          />
        </div>
        <div className="rounded-lg bg-black/5 p-2">
          <Image
            src={sockSrc}
            alt={`${label} socket`}
            width={size}
            height={size}
            onError={() => setSockSrc(phSock)}
          />
        </div>
        <div className="ml-1 text-xs opacity-70">
          Type <b>{String(type).toUpperCase()}</b>
        </div>
      </div>      
    </div>
  );
}

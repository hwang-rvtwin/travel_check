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

  // 접근성용 라벨
  const label = useMemo(() => `Type ${type}`, [type]);

  return (
    <div className="flex items-center gap-3 rounded-xl border bg-zinc-800/5 p-2">
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
        Type <b>{type}</b>
      </div>
    </div>
  );
}

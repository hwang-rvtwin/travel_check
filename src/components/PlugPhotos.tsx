// src/components/PlugPhotos.tsx
'use client';
import Image from 'next/image';
import { useState, useMemo } from 'react';

type Props = {
  type: string;                 // plug 타입 알파벳 (a~o)
  size?: number;                // 메인 이미지 한 변(px)
  variant?: 'stack' | 'badge';  // 기존 'stack' + 배지용 'badge'
  showSocket?: boolean;         // ✅ 배지에서도 true면 소켓 썸네일 표시
  className?: string;
};

export default function PlugPhotos({
  type,
  size = 80,
  variant = 'stack',
  showSocket = variant === 'stack',
  className = '',
}: Props) {
  const t = String(type).toLowerCase();
  const plugSrc0 = `/plugs/${t}_3d.png`;
  const sockSrc0 = `/plugs/${t}_sock.png`;
  const phPlug = '/plugs/placeholder_3d.png';
  const phSock = '/plugs/placeholder_sock.png';

  const [plugSrc, setPlugSrc] = useState(plugSrc0);
  const [sockSrc, setSockSrc] = useState(sockSrc0);

  const label = useMemo(() => `Type ${String(type).toUpperCase()}`, [type]);

  // ===== badge 모드 =====
  if (variant === 'badge') {
    // 배지 컨테이너: 상대 배치 → 소켓 썸네일을 우하단에 얹는다
    return (
      <div className={`relative inline-block ${className}`}>
        <Image
          src={plugSrc}
          alt={`${label} plug`}
          width={size}
          height={size}
          className="h-full w-full object-cover"
          onError={() => setPlugSrc(phPlug)}
          priority={false}
        />

        {/* ✅ showSocket=true면 우하단에 소켓 미니 배지 표시 */}
        {showSocket && (
          <span
            className="absolute bottom-1 right-1 inline-flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-white bg-white shadow-sm ring-1 ring-slate-200"
            aria-hidden
          >
            <Image
              src={sockSrc}
              alt={`${label} socket`}
              width={32}
              height={32}
              className="h-full w-full object-cover"
              onError={() => setSockSrc(phSock)}
            />
          </span>
        )}
      </div>
    );
  }

  // ===== 기존 stack 모드(변경 없음) =====
  return (
    <div className={`rounded-xl bg-zinc-800/5 p-3 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-black/5 p-2 shadow-md">
          <Image
            src={plugSrc}
            alt={`${label} plug`}
            width={size}
            height={size}
            onError={() => setPlugSrc(phPlug)}
          />
        </div>
        {showSocket && (
          <div className="rounded-lg bg-black/5 p-2 shadow-md">
            <Image
              src={sockSrc}
              alt={`${label} socket`}
              width={size}
              height={size}
              onError={() => setSockSrc(phSock)}
            />
          </div>
        )}
        <div className="ml-1 text-xs opacity-70">
          Type <b>{String(type).toUpperCase()}</b>
        </div>
      </div>
    </div>
  );
}

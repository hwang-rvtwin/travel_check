'use client';
import Image from 'next/image';
import { useState } from 'react';

type Props = { type: string; size?: number };

export default function PlugPhoto({ type, size = 80 }: Props) {
  const plug0 = `/plugs/${type}_3d.png`;
  const sock0 = `/plugs/${type}_sock.png`;
  const [plug, setPlug] = useState(plug0);
  const [sock, setSock] = useState(sock0);

  return (
    <div className="flex items-center gap-3 rounded-xl border bg-zinc-800/5 p-2">
      <div className="rounded-lg bg-black/5 p-2">
        <Image src={plug} alt={`Type ${type} plug`} width={size} height={size}
               onError={() => setPlug('/plugs/placeholder_3d.png')} />
      </div>
      <div className="rounded-lg bg-black/5 p-2">
        <Image src={sock} alt={`Type ${type} socket`} width={size} height={size}
               onError={() => setSock('/plugs/placeholder_sock.png')} />
      </div>
      <div className="ml-1 text-xs opacity-70">Type <b>{type}</b></div>
    </div>
  );
}

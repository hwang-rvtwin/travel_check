// src/components/HeaderNav.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function HeaderNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-base font-semibold">
          출국 체크허브 ✈️
        </Link>

        <ul className="flex items-center gap-4 text-sm">
          {/* 국가 서브 메뉴 */}
          <li className="relative">
            <button
              onClick={() => setOpen(v => !v)}
              onBlur={() => setTimeout(() => setOpen(false), 120)}
              className="rounded-lg px-2 py-1 hover:bg-gray-50"
              aria-haspopup="menu"
              aria-expanded={open}
            >
              국가
            </button>
            <div
              className={`absolute right-0 mt-2 w-44 rounded-xl border bg-white p-2 text-sm shadow-2xl ${
                open ? 'block' : 'hidden'
              }`}
              role="menu"
            >
              <Link className="block rounded-lg px-3 py-2 hover:bg-gray-50" href="/destinations" role="menuitem">
                국가 인덱스
              </Link>
              {/* 필요하면 허브들 추가
              <Link className="block rounded-lg px-3 py-2 hover:bg-gray-50" href="/power-plugs" role="menuitem">
                플러그/전압 허브
              </Link>
              */}
            </div>
          </li>
        { /*
          <li>
            <Link href="/about" className="rounded-lg px-2 py-1 hover:bg-gray-50">
              소개
            </Link>
          </li>
          <li>
            <Link href="/contact" className="rounded-lg px-2 py-1 hover:bg-gray-50">
              문의
            </Link>
          </li> */ }
        </ul>
      </nav>
    </header>
  );
}

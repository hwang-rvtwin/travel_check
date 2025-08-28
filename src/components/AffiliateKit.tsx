'use client';

import Link from 'next/link';

type Props = { countrySlug?: string };

const COUPANG_KIT: ReadonlyArray<{ title: string; href: string; desc?: string }> = [
  { title: '범용 멀티어댑터', href: 'https://link.coupang.com/...adapter', desc: '전세계 플러그 변환' },
  { title: '휴대용 수하물 저울', href: 'https://link.coupang.com/...scale', desc: '항공 수하물 초과 방지' },
  { title: '고출력 GaN 충전기', href: 'https://link.coupang.com/...gan', desc: '노트북/휴대용 기기 동시 충전' },
];

export default function AffiliateKit({ countrySlug }: Props) {
  return (
    <div className="mt-3">
      <p className="text-xs text-gray-500 mb-2">※ 일부 링크는 제휴 링크일 수 있습니다.</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {COUPANG_KIT.map(item => (
          <Link
            key={item.href}
            href={item.href}
            target="_blank"
            className="rounded-2xl border p-4 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
            aria-label={`${item.title} 제휴 링크로 이동`}
          >
            <div className="font-medium">{item.title}</div>
            {item.desc ? <div className="text-xs text-gray-500 mt-1">{item.desc}</div> : null}
            <div className="text-[11px] text-gray-400 mt-2">Coupang Partners</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

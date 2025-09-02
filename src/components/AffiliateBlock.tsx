// src/components/AffiliateBlock.tsx
import type { CountryMeta } from "@/lib/countries";

interface Props { variant: "country" | "packing"; country: CountryMeta; }

export default function AffiliateBlock({ variant, country }: Props) {
  const items = [
    { key:"esim", label:"eSIM 10초 개통", href:"https://...", desc:`${country.nameKo} 통신사 호환 안내` },
    { key:"visa", label:"비자 간편 확인", href:"https://...", desc:`입국 요건·전자비자 안내` },
    { key:"ins",  label:"여행자보험", href:"https://...", desc:`의료·지연·분실 대비` },
  ];
  return (
    <div className="grid md:grid-cols-3 gap-3">
      {items.map(it=>(
        <a key={it.key} rel="sponsored noopener" target="_blank"
           className="border rounded-xl p-4 hover:bg-gray-50" href={it.href}>
          <div className="font-semibold">{it.label}</div>
          <div className="text-sm text-gray-600">{it.desc}</div>
        </a>
      ))}
    </div>
  );
}

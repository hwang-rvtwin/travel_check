// src/app/destinations/[country]/_PackingQuickLinks.tsx
import { findCountryBySlug } from "@/lib/countries";

export default function PackingQuickLinks({ countrySlug }:{ countrySlug:string }) {
  const c = findCountryBySlug(countrySlug);
  if (!c) return null;
  const now = new Date();
  const months = [0,1,2].map(n=>{
    const d = new Date(now.getFullYear(), now.getMonth()+n, 1);
    const m = String(d.getMonth()+1).padStart(2,"0");
    return { label: `${d.getMonth()+1}월`, href: `/packing/${c.slug}/${m}` };
  });
  return (
    <div className="mt-6 flex gap-2 flex-wrap">
      {months.map(m=>(
        <a key={m.href} className="px-3 py-2 rounded-xl border hover:bg-gray-50" href={m.href}>
          {m.label} 패킹
        </a>
      ))}
      <a className="px-3 py-2 rounded-xl border" href={`/packing/${c.slug}`}>월별 전체 보기</a>
    </div>
  );
}

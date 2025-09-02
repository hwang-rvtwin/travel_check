// src/app/packing/page.tsx
import { COUNTRIES } from "@/lib/countries";

export const metadata = { title: "월별 패킹 가이드 인덱스" };

export default function PackingIndex() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">월별 패킹 가이드</h1>
      <div className="mt-6 space-y-8">
        {COUNTRIES.map(c=>(
          <section key={c.slug}>
            <h2 className="font-semibold mb-2">{c.flag} {c.nameKo}</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {Array.from({length:12},(_,i)=>i+1).map(m=>{
                const mm = String(m).padStart(2,"0");
                return (
                  <a key={mm}
                     className="border rounded-lg py-2 text-center hover:bg-gray-50"
                     href={`/packing/${c.slug}/${mm}`}>
                    {m}월
                  </a>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}

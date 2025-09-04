// Server Component
import Link from "next/link";

export default function Welcome() {
  return (
    <>
      {/* Hero */}
      <section className="pt-16 pb-14 text-center">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
          출국 전, <span className="text-teal-600">한 번에 체크</span>
        </h1>
        <p className="mt-4 text-base md:text-lg text-gray-600">
          비자·전원 플러그·패킹·eSIM을 한 곳에서. PDF로 저장하고 공유하세요.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          {/* ✅ 기능 홈으로 이동 */}
          <Link
            href="/"
            className="rounded-2xl bg-teal-600 px-5 py-3 text-white font-medium hover:bg-teal-700"
            data-gtag="cta_start"
          >
            여행 체크 시작
          </Link>
          <Link href="/power-plugs" className="rounded-2xl border px-5 py-3 font-medium hover:bg-gray-50">
            전원 플러그 보기
          </Link>
        </div>
      </section>

      {/* 빠른 시작 */}
      <section className="py-10">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { title: "월별 패킹", href: "/packing", desc: "옷/신발/겉옷, 이달 체감 날씨" },
            { title: "전원 플러그", href: "/power-plugs", desc: "타입·전압·주파수·주의" },
            { title: "eSIM", href: "/esim", desc: "여행 데이터 준비" },
          ].map((c) => (
            <Link key={c.title} href={c.href} className="rounded-2xl border p-5 hover:shadow-sm transition">
              <h3 className="font-semibold">{c.title}</h3>
              <p className="mt-1 text-sm text-gray-600">{c.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 인기 국가 */}
      <section className="py-6">
        <h2 className="text-xl font-semibold">인기 국가</h2>
        <div className="mt-4 grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
          {[
            { n: "일본", s: "japan" },
            { n: "미국", s: "united-states" },
            { n: "영국", s: "united-kingdom" },
            { n: "싱가포르", s: "singapore" },
            { n: "베트남", s: "vietnam" },
            { n: "호주", s: "australia" },
            { n: "뉴질랜드", s: "new-zealand" },
            { n: "아랍에미리트", s: "united-arab-emirates" },
          ].map((g) => (
            <Link key={g.s} href={`/destinations/${g.s}`} className="rounded-2xl border p-4">
              <span className="font-medium">{g.n}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 작동 방식 */}
      <section className="py-14">
        <h2 className="text-xl font-semibold text-center">어떻게 동작하나요</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            { t: "1) 국가/공항 선택", d: "출국지·도착지를 고르면" },
            { t: "2) 규정·준비물 확인", d: "비자/전원/패킹/통신 체크" },
            { t: "3) PDF로 저장", d: "오프라인/공유도 OK" },
          ].map((s) => (
            <div key={s.t} className="rounded-2xl border p-5">
              <h3 className="font-semibold">{s.t}</h3>
              <p className="mt-1 text-sm text-gray-600">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SEO/설명 + 광고 슬롯(중단) */}
      <section className="py-10">
        <div className="prose max-w-none">
          <h2>여행 체크허브가 필요한 이유</h2>
          <p>입국 규정은 수시로 바뀝니다. 각국 공식 출처를 함께 제시하고 요약해 드려요.</p>
        </div>
        {/* AdSense: 예약 높이로 CLS 방지 */}
        <div className="mt-6 grid place-items-center">
          <div className="w-full max-w-3xl">
            <div style={{ minHeight: 320 }} className="border rounded-2xl">
              {/* <ins class="adsbygoogle" data-ad-slot="xxxx" ... /> */}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ + CTA */}
      <section className="py-14">
        <h2 className="text-xl font-semibold text-center">자주 묻는 질문</h2>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {[
            { q: "정보 출처는 무엇인가요?", a: "정부/대사관/IATA/항공사/공식문서 기반." },
            { q: "광고/제휴 정책?", a: "명시적 표기, sponsored rel 적용." },
          ].map((f) => (
            <details key={f.q} className="rounded-2xl border p-5">
              <summary className="font-medium cursor-pointer">{f.q}</summary>
              <p className="mt-2 text-sm text-gray-600">{f.a}</p>
            </details>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/" className="rounded-2xl bg-teal-600 px-5 py-3 text-white font-medium">
            지금 시작하기
          </Link>
        </div>
      </section>
    </>
  );
}

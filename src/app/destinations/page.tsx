// src/app/destinations/page.tsx
import Link from "next/link";
import type { Metadata } from "next";
import { getAllCountries } from "@/lib/geo";
import SafeImg from "@/components/SafeImg";

type Country = {
  slug: string;
  nameKo: string;
  nameEn?: string;
  iso2?: string;
  voltage?: number | string;
  frequency?: number | string;
  plugTypes?: string[];
};

export const metadata: Metadata = {
  title: "국가별 출국 체크 인덱스 | Travel Check Hub",
  description:
    "전압/플러그·비자·eSIM·기후·수하물 요약. 여행 준비를 국가별로 한눈에 확인하세요.",
  alternates: { canonical: "/destinations" },
  openGraph: {
    title: "국가별 출국 체크 인덱스",
    type: "website",
    url: "/destinations",
  },
  twitter: { card: "summary_large_image", title: "국가별 출국 체크 인덱스" },
};

/** /public/destinations 폴더 내 파일명 후보 생성 (iso2/slug × webp/jpg/jpeg/png) */
function localImageCandidates(c: Country): string[] {
  const base = "/destinations";
  const slug = (c.slug || "").toLowerCase();
  const iso = (c.iso2 || "").toLowerCase();
  const names = Array.from(new Set([iso, slug].filter(Boolean)));
  const exts = ["webp", "jpg", "jpeg", "png"] as const;
  const paths: string[] = [];
  for (const n of names)
    for (const ext of exts) paths.push(`${base}/${n}.${ext}`);
  return paths;
}

export default function DestinationsIndexPage() {
  const countries = getAllCountries() as ReadonlyArray<Country>;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          국가별 출국 체크 인덱스
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          비자·전압/플러그·eSIM·기후·수하물 요약을 한눈에 !
        </p>
      </header>

      <ul className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(240px,1fr))]">
        {countries.map((c) => {
          return (
            <li key={c.slug}>
              <Link
                href={`/destinations/${c.slug}`}
                aria-label={`${c.nameKo} 출국 체크 페이지`}
                className="
                  group block overflow-hidden rounded-2xl
                  shadow-sm bg-white
                  hover:shadow-xl hover:-translate-y-0.5 transition
                  focus-visible:outline focus-visible:outline-sky-400 focus-visible:outline-offset-2
                "
              >
                {/* 이미지: 세로 길이 ↑ (모바일 h-56, 데스크탑 h-64) */}
                <div className="relative h-96 md:h-64 w-full overflow-hidden bg-gradient-to-br from-sky-200 via-blue-200 to-indigo-200">
                  <SafeImg
                    srcs={localImageCandidates(c)}
                    alt={`${c.nameKo} 대표 이미지`}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                </div>

                {/* 본문: 국가명만 표시 */}
                <div className="p-4">
                  <div className="flex items-baseline gap-2">
                    <h3 className="truncate text-base font-bold text-slate-900">
                      {c.nameKo}
                    </h3>
                    {c.nameEn && (
                      <span className="truncate text-xs text-slate-500">
                        {c.nameEn}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}

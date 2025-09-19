// src/app/contact/page.tsx
export const metadata = {
  title: "Contact | 출국 체크허브",
  description: "문의/제휴/피드백 연락처",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Eyebrow */}
      <div className="inline-flex items-center gap-2 px-3 py-1 text-sm text-slate-700">
        <span className="inline-block size-2 rounded-full bg-sky-500" />
        문의
      </div>

      {/* Title / Lead */}
      <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
        문의하기
      </h1>

      <p className="mt-3 text-[15px] leading-7 text-slate-700">
        제휴/피드백/오류 제보는 아래 이메일로 보내주세요. 빠르게 반영하겠습니다.
      </p>

      {/* Card */}
      <section className="mt-8 rounded-xl  border-slate-200 bg-white p-2 px-5 shadow-sm">
        <h2 className="sr-only">연락처</h2>
        <p className="flex items-center gap-3 text-[15px] leading-7 text-slate-800">
          {/* Mail Icon */}
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            className="h-5 w-5 flex-none text-slate-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          >
            <path d="M3 6h18v12H3z" />
            <path d="M3 7l9 7 9-7" />
          </svg>
          {/* 원문 문구/링크 유지 */}
          <span>
            <span className="font-medium text-slate-700">이메일:</span>{" "}
            <a
              className="text-blue-600 underline underline-offset-2 hover:text-blue-700"
              href="mailto:administrator@rvtwin.com"
            >
              administrator@rvtwin.com
            </a>
          </span>
        </p>
      </section>

      {/* Bottom spacer (footer와 간격) */}
      <div className="h-6" />
    </div>
  );
}

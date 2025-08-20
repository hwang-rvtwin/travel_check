export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold">개인정보처리방침</h1>
      <p className="mt-4 text-sm leading-relaxed">
        RVTwin(이하 "회사")는 이용자의 개인정보를 관련 법령에 따라 안전하게 처리합니다.
        본 서비스는 출국 준비에 필요한 정보 제공을 목적으로 하며, 회원가입 없이 이용할 수 있습니다.
      </p>
      <h2 className="mt-6 font-semibold">1. 수집 항목 및 목적</h2>
      <ul className="list-disc pl-5 text-sm">
        <li>필수: 없음 (국가/도시/기간 등 조회값은 브라우저 내에서만 처리)</li>
        <li>선택: 문의 시 이메일 주소</li>
      </ul>
      <h2 className="mt-6 font-semibold">2. 보관 및 파기</h2>
      <p className="text-sm">문의 이메일 외에는 서버에 개인정보를 저장하지 않습니다.</p>
      <h2 className="mt-6 font-semibold">3. 제3자 제공</h2>
      <p className="text-sm">법령에 근거한 경우를 제외하고 제3자에게 제공하지 않습니다.</p>
      <h2 className="mt-6 font-semibold">4. 쿠키/분석/광고</h2>
      <p className="text-sm">
        광고 노출 및 트래픽 분석을 위해 쿠키가 사용될 수 있습니다. 브라우저 설정에서 쿠키를 제한할 수 있습니다.
      </p>
      <h2 className="mt-6 font-semibold">5. 문의</h2>
      <p className="text-sm">
        administrator@rvtwin.com
      </p>
      <p className="mt-6 text-xs opacity-70">시행일: {new Date().toISOString().slice(0,10)}</p>
    </main>
  );
}

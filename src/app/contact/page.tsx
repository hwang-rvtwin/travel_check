export const metadata = {
  title: 'Contact | 출국 체크허브',
  description: '문의/제휴/피드백 연락처',
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="mb-4 text-2xl font-bold">문의하기</h1>
      <p className="leading-7">
        제휴/피드백/오류 제보는 아래 이메일로 보내주세요. 빠르게 반영하겠습니다.
      </p>
      <p className="mt-2 text-lg font-medium">
        이메일: <a className="text-blue-600 underline" href="mailto:administrator@rvtwin.com">
          administrator@rvtwin.com
        </a>
      </p>      
    </main>
  );
}

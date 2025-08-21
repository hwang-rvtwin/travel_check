export const metadata = {
  title: 'About | 출국 체크허브',
  description: '서비스 소개 및 제작 배경',
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="mb-4 text-2xl font-bold">출국 체크허브 소개</h1>
      <p className="leading-7">
        출국 전에 반복 검색해야 하는 핵심 정보(입국/비자, eSIM, 전압/플러그, 수하물, 날씨)를 한 화면에서 확인할 수 있도록 만든
        간단한 도구입니다. IATA/정부/항공사 공지를 기반으로 링크를 제공하고, Open-Meteo 기후/예보 데이터로 여행 준비를 돕습니다.
      </p>
      <h2 className="mt-6 text-xl font-semibold">왜 만들었나요?</h2>
      <ul className="ml-6 list-disc leading-7">
        <li>나라마다 다른 비자/입국 규정 확인을 매번 새로 검색하는 번거로움</li>
        <li>플러그/전압/수하물 규정이 분산된 링크 구조</li>
        <li>14~16일 이내 예보와 월별 기후 평균을 함께 보고 짐을 준비하고 싶음</li>
      </ul>
      <h2 className="mt-6 text-xl font-semibold">데이터 출처</h2>
      <ul className="ml-6 list-disc leading-7">
        <li>IATA Travel Centre, 각국 대사관/정부, 항공사 공식 페이지</li>
        <li>Open-Meteo(기후/예보), WorldStandards(전압/플러그)</li>
      </ul>
    </main>
  );
}

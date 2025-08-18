'use client';

import { useEffect, useMemo, useState } from 'react';
import { COUNTRIES, type Country, type City } from '@/data/geo';
import PlugIcon from '@/components/PlugIcon';

/* ---------- 타입 정의 ---------- */
type VisaInfo = { summary: string; sources?: { title: string; url: string }[]; updatedAt?: string | null };
type ESIMDeal = { name: string; go: string };
type PowerInfo = { plugTypes: string[]; voltage: string; frequency: string; source: string };
type BaggageInfo = { guide: string; airlineLinks: { code: string; title: string; url: string }[] };
type ChecklistItem = { id: string; label: string; checked: boolean };

type ApiResponse = {
  country: string; // ISO2
  passport: string; // ISO2
  from: string;
  to: string;
  visa: VisaInfo;
  esim: { deals: ESIMDeal[] };
  power: PowerInfo;
  baggage: BaggageInfo;
  checklist: ChecklistItem[];
  updatedAt?: string | null;
};

type WeatherDaily = {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_probability_max: number[];
};

/* ---------- 페이지 컴포넌트 ---------- */
export default function Home() {
  /* 상태값 */
  const [country, setCountry] = useState('JP');           // 내부 처리는 ISO2
  const [countryName, setCountryName] = useState('Japan'); // 표시는 영문 국가명
  const [city, setCity] = useState<City | null>(null);     // 공항(도시)
  const [passport, setPassport] = useState('KR');          // ISO2
  const [from, setFrom] = useState('');                    // yyyy-mm-dd
  const [to, setTo] = useState('');
  const [data, setData] = useState<ApiResponse | null>(null);
  const [weather, setWeather] = useState<WeatherDaily | null>(null);

  const selectedCountry: Country | undefined = useMemo(
    () => COUNTRIES.find((c) => c.iso2 === country),
    [country]
  );

  // 체크리스트 저장 키(국가/여권/일정/도시 따라 별도 보관)
  const storageKey = useMemo(
    () => `tc_checklist_${country}_${passport}_${from}_${to}_${city?.iata ?? 'NA'}`,
    [country, passport, from, to, city?.iata]
  );

  /* 유틸 함수 */
  async function fetchWeatherIfPossible() {
    if (!city || !from || !to) {
      setWeather(null);
      return;
    }
    const p = new URLSearchParams({
      lat: String(city.lat),
      lon: String(city.lon),
      from,
      to,
    });
    const r = await fetch(`/api/weather?${p.toString()}`);
    if (r.ok) {
      const j = await r.json();
      setWeather(j.daily as WeatherDaily);
    } else {
      setWeather(null);
    }
  }

  // API 호출(체크리스트 로컬 복원 포함) + 날씨 호출
  async function fetchData() {
    const params = new URLSearchParams({ country, passport, from, to });
    const res = await fetch(`/api/check?${params.toString()}`);
    if (!res.ok) {
      alert('알 수 없는 국가 코드입니다. (예: JP, SG)');
      return;
    }
    const json = (await res.json()) as ApiResponse;

    // localStorage 체크리스트 복원
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const savedMap = new Map<string, boolean>(JSON.parse(saved));
        json.checklist = json.checklist.map((item) => ({
          ...item,
          checked: savedMap.get(item.id) ?? item.checked,
        }));
      }
    } catch {}

    setData(json);
    await fetchWeatherIfPossible();
    // 주소에 현재 선택값 동기화(공유/새로고침 복원)
    syncQueryToUrl();
  }

  function toggleCheck(id: string) {
    if (!data) return;
    const next = {
      ...data,
      checklist: data.checklist.map((it) => (it.id === id ? { ...it, checked: !it.checked } : it)),
    };
    setData(next);
    const mapArr: [string, boolean][] = next.checklist.map((it) => [it.id, it.checked]);
    localStorage.setItem(storageKey, JSON.stringify(mapArr));
  }

  async function copyLink() {
    syncQueryToUrl();
    await navigator.clipboard.writeText(window.location.href);
    alert('링크를 복사했어요!');
  }

  function syncQueryToUrl() {
    const url = new URL(window.location.href);
    url.searchParams.set('country', country);
    url.searchParams.set('passport', passport);
    if (from) url.searchParams.set('from', from);
    else url.searchParams.delete('from');
    if (to) url.searchParams.set('to', to);
    else url.searchParams.delete('to');
    if (city?.iata) url.searchParams.set('city', city.iata);
    else url.searchParams.delete('city');
    window.history.replaceState({}, '', url.toString());
  }

  function printPage() {
    window.print();
  }

  // 최초 진입 시 URL 쿼리 → 상태 복원
  useEffect(() => {
    const u = new URL(window.location.href);
    const qCountry = (u.searchParams.get('country') || 'JP').toUpperCase(); // 초기값 리터럴
    const qPassport = (u.searchParams.get('passport') || 'KR').toUpperCase(); // 초기값 리터럴
    const qFrom = u.searchParams.get('from') || '';
    const qTo = u.searchParams.get('to') || '';
    const qCity = u.searchParams.get('city') || '';

    const cInfo = COUNTRIES.find((x) => x.iso2 === qCountry);
    if (cInfo) {
      setCountry(qCountry);
      setCountryName(cInfo.nameEn);
      if (qCity) {
        const picked = cInfo.cities.find((cc) => cc.iata === qCity) || null;
        setCity(picked);
      }
    }
    setPassport(qPassport);
    setFrom(qFrom);
    setTo(qTo);
    // 의존성 배열은 비워둬도 이제 경고가 없습니다.
  }, []);

  return (
    <main className="mx-auto max-w-4xl p-4">
      {/* 헤더 */}
      <header className="flex flex-col gap-2 py-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-bold">출국 체크허브 ✈️</h1>
        <div className="text-xs opacity-70">
          ※ 본 요약은 참고용입니다. 최종 규정은 항공사·출입국·대사관 공지를 따르며, 최신 정보는 IATA/정부 사이트에서
          확인하세요.
        </div>
      </header>

      {/* 입력 영역 */}
      <section className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-6">
        {/* 나라 선택 */}
        <div className="sm:col-span-2">
          <label className="text-sm">나라 선택</label>
          <select
            className="w-full rounded border p-2"
            value={country}
            onChange={(e) => {
              const iso2 = e.target.value;
              const c = COUNTRIES.find((x) => x.iso2 === iso2)!;
              setCountry(iso2);
              setCountryName(c.nameEn);
              setCity(null);
            }}
          >
            {COUNTRIES.map((c) => (
              <option key={c.iso2} value={c.iso2}>
                {c.nameEn}
              </option>
            ))}
          </select>
        </div>

        {/* 도시/공항 선택 */}
        <div className="sm:col-span-2">
          <label className="text-sm">도시 / 국제공항</label>
          <select
            className="w-full rounded border p-2"
            value={city?.iata || ''}
            onChange={(e) => {
              const iata = e.target.value;
              const pick = selectedCountry?.cities.find((x) => x.iata === iata) || null;
              setCity(pick);
            }}
          >
            <option value="" disabled>
              도시/공항 선택
            </option>
            {(selectedCountry?.cities || []).map((ct) => (
              <option key={ct.iata} value={ct.iata}>
                {ct.cityEn} ({ct.iata})
              </option>
            ))}
          </select>
        </div>

        {/* 출국/귀국일 */}
        <div className="sm:col-span-1">
          <label className="text-sm">출국일</label>
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="w-full rounded border p-2" />
        </div>
        <div className="sm:col-span-1">
          <label className="text-sm">귀국일</label>
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="w-full rounded border p-2" />
        </div>

        {/* 조회 버튼 */}
        <div className="sm:col-span-6 flex items-end justify-end">
          <button onClick={fetchData} className="rounded bg-black px-4 py-2 text-white">
            조회
          </button>
        </div>
      </section>

      {/* 선택 요약 */}
      <section className="mt-4 text-sm text-gray-600">
        <span className="mr-3">국가: <b>{countryName}</b> ({country})</span>
        <span className="mr-3">도시/공항: <b>{city ? `${city.cityEn} (${city.iata})` : '-'}</b></span>
        <span className="mr-3">여권국가: <b>{passport}</b></span>
        <span className="mr-3">여행기간: <b>{from || '—'} ~ {to || '—'}</b></span>
      </section>

      {/* 날씨 카드 */}
      {weather && (
        <article className="mt-6 rounded-2xl border p-4 shadow-sm">
          <h2 className="mb-2 text-lg font-semibold">
            날씨 · {city?.cityEn} {from && to ? `(${from} ~ ${to})` : ''}
          </h2>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
            {weather.time.map((t, i) => (
              <div key={t} className="rounded border p-3 text-sm">
                <div className="font-medium">{t}</div>
                <div>
                  최고 {weather.temperature_2m_max[i]}° / 최저 {weather.temperature_2m_min[i]}°
                </div>
                <div>강수확률 최대 {weather.precipitation_probability_max[i] ?? '-'}%</div>
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs opacity-70">※ Open-Meteo 일별 예보(간략)</p>
        </article>
      )}

      {/* 결과 카드 */}
      {data && (
        <>
          <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* 입국/비자 */}
            <article className="rounded-2xl border p-4 shadow-sm">
              <h2 className="mb-2 text-lg font-semibold">입국 / 비자</h2>
              <p className="text-sm leading-relaxed">{data.visa.summary}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {data.visa.sources?.map((s, i) => (
                  <a key={i} className="text-sm text-blue-600 underline" href={s.url} target="_blank" rel="noreferrer">
                    {s.title}
                  </a>
                ))}
              </div>
              {data.visa.updatedAt && (
                <p className="mt-2 text-xs opacity-70">업데이트(비자 스냅샷): {data.visa.updatedAt}</p>
              )}
            </article>

            {/* eSIM */}
            <article className="rounded-2xl border p-4 shadow-sm">
              <h2 className="mb-2 text-lg font-semibold">eSIM</h2>
              <ul className="list-disc pl-5">
                {data.esim.deals.map((d, i) => (
                  <li key={i} className="text-sm">
                    <a className="text-blue-600 underline" href={d.go}>
                      {d.name}
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-xs opacity-70">일부 링크는 제휴 링크일 수 있어요.</p>
            </article>

            {/* 전압/플러그 */}
            <article className="rounded-2xl border p-4 shadow-sm">
              <h2 className="mb-2 text-lg font-semibold">전압 / 플러그</h2>
              <div className="mb-2">
                {(data.power.plugTypes || []).map((t) => (
                  <PlugIcon key={t} type={t} />
                ))}
              </div>
              <p className="text-sm">
                전압/주파수: <b>{data.power.voltage}</b>, <b>{data.power.frequency}</b>
              </p>
              <a
                className="mt-2 inline-block text-sm text-blue-600 underline"
                href="https://www.worldstandards.eu/electricity/plug-voltage-by-country/"
                target="_blank"
                rel="noreferrer"
              >
                출처: WorldStandards
              </a>
            </article>

            {/* 수하물 */}
            <article className="rounded-2xl border p-4 shadow-sm">
              <h2 className="mb-2 text-lg font-semibold">수하물</h2>
              <p className="text-sm leading-relaxed">{data.baggage.guide}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {data.baggage.airlineLinks?.map((a, i) => (
                  <a key={i} className="text-sm text-blue-600 underline" href={a.url} target="_blank" rel="noreferrer">
                    {a.title}
                  </a>
                ))}
              </div>
            </article>
          </section>

          {/* 체크리스트 */}
          <section className="mt-6 rounded-2xl border p-4 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-lg font-semibold">체크리스트</h2>
              <div className="flex gap-2">
                <button onClick={copyLink} className="rounded border px-3 py-1 text-sm">
                  링크 복사
                </button>
                <button onClick={printPage} className="rounded border px-3 py-1 text-sm">
                  인쇄 / PDF
                </button>
              </div>
            </div>
            <ul className="space-y-2">
              {data.checklist.map((c) => (
                <li key={c.id} className="flex items-center gap-3">
                  <input id={c.id} type="checkbox" checked={c.checked} onChange={() => toggleCheck(c.id)} />
                  <label htmlFor={c.id} className="text-sm">
                    {c.label}
                  </label>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs opacity-70">업데이트(국가 데이터): {data.updatedAt || '—'}</p>
          </section>
        </>
      )}

      {/* 신뢰/면책 푸터 */}
      <footer className="mt-10 rounded-2xl border p-4 text-sm leading-6 opacity-90">
        <div className="font-semibold">신뢰 및 면책 고지</div>
        <ul className="list-disc pl-5">
          <li>
            본 서비스의 정보는 <b>참고용 요약</b>이며, 최종 규정은 <b>항공사·출입국·대사관·정부 공식 공지</b>를 따릅니다.
          </li>
          <li>
            비자/입국 규정은 수시로 변경될 수 있습니다. 반드시{' '}
            <a
              className="text-blue-600 underline"
              target="_blank"
              rel="noreferrer"
              href="https://www.iata.org/en/services/compliance/timatic/travel-documentation/"
            >
              IATA Travel Centre
            </a>{' '}
            와 각국 정부/대사관 공지에서 <b>최신 정보</b>를 확인하세요.
          </li>
          <li>전압·플러그 정보는 지역/시설에 따라 예외가 있을 수 있습니다. 숙소 공지 및 현지 안내를 함께 확인하세요.</li>
          <li>수하물 규정은 항공사/운임 유형/회원 등급에 따라 달라질 수 있으니 <b>항공사 공식 페이지</b>를 확인하세요.</li>
        </ul>
        <div className="mt-2 text-xs opacity-70">
          데이터 출처 예시: IATA Travel Centre / 각국 정부·대사관 / 항공사 공식 페이지 / WorldStandards 등.
        </div>
      </footer>
    </main>
  );
}

'use client';

import { useEffect, useMemo, useState } from 'react';
import { COUNTRIES, type Country, type City } from '@/data/geo';
import PlugIcon from '@/components/PlugIcon';

/* ---------- 타입 ---------- */
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

type ClimateMonthly = {
  time: string[]; // '01'..'12' 같은 12개
  temperature_2m_max: number[]; // 월평균 최고
  temperature_2m_min: number[]; // 월평균 최저
};

/* ---------- 유틸 ---------- */
function daysAhead(dateStr: string) {
  if (!dateStr) return 0;
  const today = new Date();
  const d0 = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const d1 = new Date(dateStr);
  const d1n = new Date(d1.getFullYear(), d1.getMonth(), d1.getDate());
  const ms = d1n.getTime() - d0.getTime();
  return Math.floor(ms / 86400000);
}

function monthsSpan(from: string, to: string): number[] {
  if (!from || !to) return [];
  const s = new Date(from);
  const e = new Date(to);
  const out: number[] = [];
  let y = s.getFullYear();
  let m = s.getMonth(); // 0~11
  while (y < e.getFullYear() || (y === e.getFullYear() && m <= e.getMonth())) {
    out.push(m + 1); // 1~12
    m++;
    if (m > 11) { m = 0; y++; }
  }
  return out;
}

const MONTH_LABELS = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];

/* ---------- 페이지 ---------- */
export default function Home() {
  // 입력/상태
  const [country, setCountry] = useState('JP');            // ISO2 (내부용)
  const [countryName, setCountryName] = useState('Japan'); // 표시용
  const [city, setCity] = useState<City | null>(null);     // 선택 공항(도시)
  const [passport, setPassport] = useState('KR');          // ISO2
  const [from, setFrom] = useState('');                    // yyyy-mm-dd
  const [to, setTo] = useState('');

  const [data, setData] = useState<ApiResponse | null>(null);

  // 날씨(예보) & 기후(평년)
  const [weather, setWeather] = useState<WeatherDaily | null>(null);
  const [weatherNote, setWeatherNote] = useState<string | null>(null); // 오류 안내만 사용
  const [climate, setClimate] = useState<ClimateMonthly | null>(null);
  const [climateNote, setClimateNote] = useState<string | null>(null);

  // 로딩/오류(옵션)
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const selectedCountry: Country | undefined = useMemo(
    () => COUNTRIES.find((c) => c.iso2 === country),
    [country]
  );

  // 체크리스트 저장 키
  const storageKey = useMemo(
    () => `tc_checklist_${country}_${passport}_${from}_${to}_${city?.iata ?? 'NA'}`,
    [country, passport, from, to, city?.iata]
  );

  /* ---------- 데이터 가져오기 ---------- */

  // 예보 API 호출 (서버 라우트 사용)
  async function fetchForecast() {
    if (!city || !from || !to) { setWeather(null); setWeatherNote(null); return { hadData:false, beyond:false }; }

    const lead = daysAhead(from);
    if (lead > 16) {
      // 범위 밖: 예보는 조용히 생략 (에러 문구 없음)
      setWeather(null);
      setWeatherNote(null);
      return { hadData:false, beyond:true };
    }

    const p = new URLSearchParams({ lat: String(city.lat), lon: String(city.lon), from, to });
    try {
      const r = await fetch(`/api/weather?${p.toString()}`);
      const j = (await r.json()) as { daily?: WeatherDaily | null; note?: string | null };

      const daily = j?.daily ?? null;
      if (daily && Array.isArray(daily.time) && daily.time.length > 0) {
        setWeather(daily);
        setWeatherNote(null);
        return { hadData:true, beyond:false };
      } else {
        // note: beyond-range 는 서버에서 올 수 있지만, 여기서는 조용히 무시
        if (j?.note && j.note !== 'beyond-range') {
          setWeatherNote(j.note === 'fetch-error' || String(j.note).startsWith('fetch-failed')
            ? '날씨 API 호출에 실패했어요. 잠시 후 다시 시도해 주세요.'
            : '해당 기간에 대한 예보 데이터를 찾지 못했어요.'
          );
        } else {
          setWeatherNote(null);
        }
        setWeather(null);
        return { hadData:false, beyond: j?.note === 'beyond-range' };
      }
    } catch {
      setWeather(null);
      setWeatherNote('날씨 API 호출에 실패했어요. 잠시 후 다시 시도해 주세요.');
      return { hadData:false, beyond:false };
    }
  }

  // 월별 기후 평균(ERA5, 1991–2020) — Historical(archive) API 호출 후 월평균 계산
  async function fetchClimate() {
    if (!city) { setClimate(null); setClimateNote(null); return; }

    try {
      const u = new URL('https://archive-api.open-meteo.com/v1/archive');
      u.searchParams.set('latitude', String(city.lat));
      u.searchParams.set('longitude', String(city.lon));
      u.searchParams.set('start_date', '1991-01-01');
      u.searchParams.set('end_date', '2020-12-31');
      u.searchParams.set('models', 'ERA5');
      u.searchParams.set('daily', 'temperature_2m_max,temperature_2m_min');
      u.searchParams.set('timezone', 'auto');

      const r = await fetch(u.toString());
      if (!r.ok) {
        setClimate(null);
        setClimateNote('기후 평균 데이터를 불러오지 못했어요.');
        return;
      }

      const j = await r.json() as {
        daily?: {
          time: string[];
          temperature_2m_max: number[];
          temperature_2m_min: number[];
        }
      };

      const d = j?.daily;
      if (!d || !Array.isArray(d.time) || d.time.length === 0) {
        setClimate(null);
        setClimateNote('해당 지역의 월별 기후 평균을 찾지 못했어요.');
        return;
      }

      const sumMax = new Array(12).fill(0);
      const sumMin = new Array(12).fill(0);
      const cnt = new Array(12).fill(0);

      for (let i = 0; i < d.time.length; i++) {
        const t = d.time[i];
        const m = new Date(t).getMonth(); // 0~11
        const tmax = d.temperature_2m_max[i];
        const tmin = d.temperature_2m_min[i];
        if (Number.isFinite(tmax)) sumMax[m] += tmax;
        if (Number.isFinite(tmin)) sumMin[m] += tmin;
        cnt[m] += 1;
      }

      const avgMax = sumMax.map((s, i) => cnt[i] ? s / cnt[i] : NaN);
      const avgMin = sumMin.map((s, i) => cnt[i] ? s / cnt[i] : NaN);

      setClimate({
        time: Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')),
        temperature_2m_max: avgMax,
        temperature_2m_min: avgMin
      });
      setClimateNote(null);
    } catch {
      setClimate(null);
      setClimateNote('기후 평균 데이터를 불러오지 못했어요.');
    }
  }

  // 메인 조회: 항상 기후 먼저 → 예보(가능 시)
  async function fetchData() {
    setLoading(true); setErr(null);
    try {
      // 1) 기본 데이터(/api/check)
      const params = new URLSearchParams({ country, passport, from, to });
      const res = await fetch(`/api/check?${params.toString()}`);
      if (!res.ok) throw new Error('국가 코드를 확인하세요.');
      const json = (await res.json()) as ApiResponse;

      // 체크리스트 복원
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

      // 2) 기후(평년) 먼저 표시
      await fetchClimate();

      // 3) 예보(가능하면 추가 표시)
      await fetchForecast();

      // 4) 쿼리 동기화
      syncQueryToUrl();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : '알 수 없는 오류';
      setErr(msg);
    } finally {
      setLoading(false);
    }
  }

  // 체크리스트 토글
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

  // 링크 복사 & URL 동기화
  function syncQueryToUrl() {
    const url = new URL(window.location.href);
    url.searchParams.set('country', country);
    url.searchParams.set('passport', passport);
    if (from) url.searchParams.set('from', from); else url.searchParams.delete('from');
    if (to) url.searchParams.set('to', to); else url.searchParams.delete('to');
    if (city?.iata) url.searchParams.set('city', city.iata); else url.searchParams.delete('city');
    window.history.replaceState({}, '', url.toString());
  }
  async function copyLink() {
    syncQueryToUrl();
    await navigator.clipboard.writeText(window.location.href);
    alert('링크를 복사했어요!');
  }

  function printPage() {
    window.print();
  }

  /* ---------- 초기 쿼리 복원 ---------- */
  useEffect(() => {
    const u = new URL(window.location.href);
    const qCountry = (u.searchParams.get('country') || 'JP').toUpperCase();
    const qPassport = (u.searchParams.get('passport') || 'KR').toUpperCase();
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
  }, []);

  /* ---------- 렌더 ---------- */
  const tripMonths = monthsSpan(from, to); // 평년 카드에서 강조할 월

  return (
    <main className="mx-auto max-w-4xl p-4">
      {/* 헤더 */}
      <header className="flex flex-col gap-2 py-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-bold">출국 체크허브 ✈️</h1>
        <div className="text-xs opacity-70">
          ※ 본 요약은 참고용입니다. 최종 규정은 항공사·출입국·대사관 공지를 따르며, 최신 정보는 IATA/정부 사이트에서 확인하세요.
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
              <option key={c.iso2} value={c.iso2}>{c.nameEn}</option>
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
            <option value="" disabled>도시/공항 선택</option>
            {(selectedCountry?.cities || []).map((ct) => (
              <option key={ct.iata} value={ct.iata}>{ct.cityEn} ({ct.iata})</option>
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
          <button onClick={fetchData} className="rounded bg-black px-4 py-2 text-white">조회</button>
        </div>
      </section>

      {/* 선택 요약 */}
      <section className="mt-4 text-sm text-gray-600">
        <span className="mr-3">국가: <b>{countryName}</b> ({country})</span>
        <span className="mr-3">도시/공항: <b>{city ? `${city.cityEn} (${city.iata})` : '-'}</b></span>
        <span className="mr-3">여권국가: <b>{passport}</b></span>
        <span className="mr-3">여행기간: <b>{from || '—'} ~ {to || '—'}</b></span>
      </section>

      {/* 상태표시 */}
      {loading && <div className="mt-2 text-sm">불러오는 중…</div>}
      {err && <div className="mt-2 text-sm text-red-600">오류: {err}</div>}

      {/* 기후(평년) — 항상 기본 제공 */}
      {climate && (
        <article className="mt-6 rounded-2xl border p-4 shadow-sm">
          <h2 className="mb-2 text-lg font-semibold">월별 기후 평균 · {city?.cityEn}</h2>
          {tripMonths.length > 0 ? (
            <>
              <p className="mb-2 text-sm opacity-80">
                여행 월 기준으로 평균 <b>최고/최저 기온(1991–2020, ERA5)</b>을 보여드려요.
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
                {tripMonths.map((m) => {
                  const idx = m - 1; // 0-based
                  const tmax = climate.temperature_2m_max[idx];
                  const tmin = climate.temperature_2m_min[idx];
                  return (
                    <div key={m} className="rounded border p-3 text-sm">
                      <div className="font-medium">{MONTH_LABELS[idx]}</div>
                      <div>평균 최고 {Number.isFinite(tmax) ? tmax.toFixed(1) : '-'}° / 평균 최저 {Number.isFinite(tmin) ? tmin.toFixed(1) : '-'}°</div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              <p className="mb-2 text-sm opacity-80">여행 기간이 설정되지 않아 12개월 전체를 보여드려요.</p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {Array.from({ length: 12 }, (_, idx) => (
                  <div key={idx} className="rounded border p-3 text-sm">
                    <div className="font-medium">{MONTH_LABELS[idx]}</div>
                    <div>
                      평균 최고 {Number.isFinite(climate.temperature_2m_max[idx]) ? climate.temperature_2m_max[idx].toFixed(1) : '-'}° / 평균 최저 {Number.isFinite(climate.temperature_2m_min[idx]) ? climate.temperature_2m_min[idx].toFixed(1) : '-'}°
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          <p className="mt-2 text-xs opacity-70">
            ※ 예보는 보통 출발 <b>14~16일 전</b>부터 확인 가능해요. 그 전엔 기후 평균으로 대비하세요.
          </p>
        </article>
      )}
      {!climate && climateNote && (
        <div className="mt-2 text-xs text-red-600">{climateNote}</div>
      )}

      {/* 날씨(예보) — 가능할 때 추가 제공 */}
      {weather && (
        <article className="mt-6 rounded-2xl border p-4 shadow-sm">
          <h2 className="mb-2 text-lg font-semibold">가까운 예보 · {city?.cityEn} {from && to ? `(${from} ~ ${to})` : ''}</h2>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
            {weather.time.map((t, i) => (
              <div key={t} className="rounded border p-3 text-sm">
                <div className="font-medium">{t}</div>
                <div>최고 {weather.temperature_2m_max[i]}° / 최저 {weather.temperature_2m_min[i]}°</div>
                <div>강수확률 최대 {weather.precipitation_probability_max[i] ?? '-'}%</div>
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs opacity-70">※ Open-Meteo 일별 예보(출발 약 14~16일 전부터 제공)</p>
        </article>
      )}
      {weatherNote && (
        <div className="mt-2 text-xs opacity-70">※ {weatherNote}</div>
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
                    <a className="text-blue-600 underline" href={d.go}>{d.name}</a>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-xs opacity-70">일부 링크는 제휴 링크일 수 있어요.</p>
            </article>

            {/* 전압/플러그 */}
            <article className="rounded-2xl border p-4 shadow-sm">
              <h2 className="mb-2 text-lg font-semibold">전압 / 플러그</h2>
              <div className="mb-2">
                {(data.power.plugTypes || []).map((t) => (<PlugIcon key={t} type={t} />))}
              </div>
              <p className="text-sm">전압/주파수: <b>{data.power.voltage}</b>, <b>{data.power.frequency}</b></p>
              <a
                className="mt-2 inline-block text-sm text-blue-600 underline"
                href="https://www.worldstandards.eu/electricity/plug-voltage-by-country/"
                target="_blank" rel="noreferrer"
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
                <button onClick={copyLink} className="rounded border px-3 py-1 text-sm">링크 복사</button>
                <button onClick={printPage} className="rounded border px-3 py-1 text-sm">인쇄 / PDF</button>
              </div>
            </div>
            <ul className="space-y-2">
              {data.checklist.map((c) => (
                <li key={c.id} className="flex items-center gap-3">
                  <input id={c.id} type="checkbox" checked={c.checked} onChange={() => toggleCheck(c.id)} />
                  <label htmlFor={c.id} className="text-sm">{c.label}</label>
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
          <li>본 서비스의 정보는 <b>참고용 요약</b>이며, 최종 규정은 <b>항공사·출입국·대사관·정부 공식 공지</b>를 따릅니다.</li>
          <li>
            비자/입국 규정은 수시로 변경될 수 있습니다. 반드시{' '}
            <a className="text-blue-600 underline" target="_blank" rel="noreferrer"
               href="https://www.iata.org/en/services/compliance/timatic/travel-documentation/">
              IATA Travel Centre
            </a>{' '}와 각국 정부/대사관 공지에서 <b>최신 정보</b>를 확인하세요.
          </li>
          <li>전압·플러그 정보는 지역/시설에 따라 예외가 있을 수 있습니다. 숙소 공지 및 현지 안내를 함께 확인하세요.</li>
          <li>수하물 규정은 항공사/운임 유형/회원 등급에 따라 달라질 수 있으니 <b>항공사 공식 페이지</b>를 확인하세요.</li>
        </ul>
        <div className="mt-2 text-xs opacity-70">
          데이터 출처 예시: IATA Travel Centre / 각국 정부·대사관 / 항공사 공식 페이지 / WorldStandards / Open-Meteo 등.
        </div>
      </footer>
    </main>
  );
}

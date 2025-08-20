'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { COUNTRIES, type Country, type City } from '@/data/geo';
import PlugPhotos from '@/components/PlugPhotos';
import { CURRENCY_BY_ISO2 } from '@/data/currency';
import Image from 'next/image';

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

type FxState = {
  base: string; quote: string; rate: number; inverse: number;
  updated: string; source: string;
} | null;

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
  const router = useRouter();

  function clearQueryString() {
    if (typeof window !== 'undefined') {
      const u = new URL(window.location.href);
      u.search = '';
      window.history.replaceState({}, '', u.pathname);
    }
  }

  function resetAll() {
    // 폼/결과 상태 전부 초기화(프로젝트에 있는 state 이름 기준으로 맞춰주세요)
    setCountry('');         // 국가 초기화
    setCountryName('');     // 국가명 표시용
    setCity(null);          // 공항/도시
    setFrom(''); setTo(''); // 날짜
    setPassport('KR');      // 기본 여권(원래 기본값이 있으면 그 값으로)
    setData(null);          // 결과 묶음
    setClimate(null); //setForecast(null);
    setTzName(null);
    setFx(null); setFxNote(null);
    // 필요시 다른 파생 상태도 초기화

    clearQueryString();
    router.push('/');
  }

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
  
  // 시차
  const [tzName, setTzName] = useState<string | null>(null);
  // 현재 시각(1분 단위로 갱신)
  const [now, setNow] = useState<Date>(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  // 날짜/시간을 타임존에 맞춰 보기 좋게 포맷
  function fmtZoned(d: Date, timeZone: string) {
    return new Intl.DateTimeFormat('ko-KR', {
      timeZone,
      year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short',
      hour: '2-digit', minute: '2-digit', hour12: false
    }).format(d);
  }
  const withinForecastWindow = useMemo(() => !!from && daysAhead(from) <= 16, [from]);  

  const [fx, setFx] = useState<FxState>(null);
  const [fxNote, setFxNote] = useState<string | null>(null);

  function fmtMoney(n: number, code: string) {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: code }).format(n);
  }
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
      const p = new URLSearchParams({
        lat: String(city.lat),
        lon: String(city.lon),
        precision: '2' // 좌표 반올림 자릿수(캐시 적중률↑)
      });
      const r = await fetch(`/api/climate?${p.toString()}`);
      const j = await r.json();

      if (!r.ok || !j?.monthly) {
        if (j?.note) {
          setClimate(null);
          setClimateNote('기후 평균 데이터를 불러오지 못했어요.');
        } else {
          setClimate(null);
          setClimateNote('기후 평균 데이터를 불러오지 못했어요.');
        }
        return;
      }

      const monthly = j.monthly as { time: string[]; tmax: number[]; tmin: number[] };

      setClimate({
        time: monthly.time,
        temperature_2m_max: monthly.tmax,
        temperature_2m_min: monthly.tmin
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

      await fetchTimezoneAndComputeDiff();

      await fetchFx();

      // 4) 쿼리 동기화
      syncQueryToUrl();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : '알 수 없는 오류';
      setErr(msg);
    } finally {
      setLoading(false);
    }
  }

  function getOffsetMinutes(timeZone: string, dateStr?: string) {
    // dateStr 기준(없으면 오늘)으로 해당 TZ의 오프셋을 분 단위로 계산
    const d = dateStr ? new Date(dateStr + 'T12:00:00') : new Date();
    const utc = new Date(d.toLocaleString('en-US', { timeZone: 'UTC' }));
    const tz  = new Date(d.toLocaleString('en-US', { timeZone }));
    // tz - utc = 오프셋(ms)
    return Math.round((tz.getTime() - utc.getTime()) / 60000);
  }

  async function fetchTimezoneAndComputeDiff() {
    if (!city) { setTzName(null); return; }
    try {
      const p = new URLSearchParams({ lat: String(city.lat), lon: String(city.lon) });
      const r = await fetch(`/api/tz?${p.toString()}`);
      const j = await r.json();
      if (r.ok && j?.timezone) {
        setTzName(j.timezone as string);
      } else {
        setTzName(null);
      }
    } catch {
      setTzName(null);
    }
  }

  async function fetchFx() {
    if (!country) { setFx(null); setFxNote(null); return; }
    const c = CURRENCY_BY_ISO2[country];
    if (!c) { setFx(null); setFxNote('지원되지 않는 통화입니다.'); return; }

    try {
      const p = new URLSearchParams({ base: 'KRW', quote: c.code });
      const r = await fetch(`/api/fx?${p.toString()}`);
      const j = await r.json();
      if (r.ok && j?.rate) {
        setFx(j as FxState);
        setFxNote(null);
      } else {
        setFx(null);
        setFxNote('환율 정보를 불러올 수 없어요.');
      }
    } catch {
      setFx(null);
      setFxNote('환율 정보를 불러올 수 없어요.');
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
        <button
          onClick={resetAll}
          className="group inline-flex items-center gap-2 text-2xl font-extrabold mb-4 hover:opacity-80"
          title="초기화하고 홈으로 이동"
        >
          출국 체크허브 ✈️          
        </button>
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
            ※ 예보는 보통 출발 <b>14~16일 전</b>부터 확인 가능해요. 그 외엔 기후 평균으로 대비하세요.
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
      {withinForecastWindow && !weather && !climate && weatherNote && (
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

            {/* 시차 */}
            <article className="rounded-2xl border p-4 shadow-sm">
              <h2 className="mb-2 text-lg font-semibold">시차</h2>
              {tzName ? (
                (() => {
                  const seoulTZ = 'Asia/Seoul';
                  const baseDate = from || new Date().toISOString().slice(0,10); // 시차 계산 기준(출발일)
                  const offDest = getOffsetMinutes(tzName, baseDate);
                  const offSeoul = getOffsetMinutes(seoulTZ, baseDate);
                  const diffMin = offDest - offSeoul; // 목적지 - 서울
                  const sign = diffMin > 0 ? '+' : diffMin < 0 ? '−' : '±';
                  const absMin = Math.abs(diffMin);
                  const h = Math.floor(absMin / 60);
                  const m = absMin % 60;

                  // 현재 시각(실시간)
                  const localNow = fmtZoned(now, tzName);
                  const seoulNow = fmtZoned(now, seoulTZ);

                  return (
                    <div className="text-sm space-y-1">
                      <div className="mb-1">
                        <b>{countryName}{city ? ` · ${city.cityEn}` : ''}</b> 시간대: <b>{tzName}</b>
                      </div>
                      <div>현지 현재 시각: <b>{localNow}</b></div>
                      <div className="opacity-80">한국(Seoul) 현재 시각: {seoulNow}</div>
                      <div>
                        한국(Asia/Seoul) 대비 시차: <b>{sign}{h}시간{m ? ` ${m}분` : ''}</b>
                        <span className="ml-1 opacity-70 text-xs">(출발일 기준)</span>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div className="text-sm opacity-70">도시/공항을 선택하고 조회하면 시차와 현지 시간이 표시됩니다.</div>
              )}
            </article>

            {/* 환율 (풀폭) */}
            <article className="rounded-2xl border p-4 shadow-sm">
              <h2 className="mb-2 text-lg font-semibold">환율</h2>
              {(() => {
                const cur = country ? CURRENCY_BY_ISO2[country] : null;
                if (!cur) return <div className="text-sm opacity-70">해당 국가의 통화를 찾지 못했어요.</div>;
                if (!fx) return <div className="text-sm opacity-70">{fxNote ?? '결과를 조회하면 환율이 표시됩니다.'}</div>;

                // 샘플: 100,000 KRW → 현지통화 / 100 현지통화 → KRW
                const sampleKrw = 100_000;
                const toLocal = sampleKrw * fx.rate;
                const sampleLocal = 100;
                const toKrw = sampleLocal * fx.inverse;

                return (
                  <div className="text-sm space-y-1">
                    <div>
                      기준 통화: <b>KRW</b> → 현지 통화: <b>{cur.code} ({cur.nameKr})</b>
                    </div>
                    <div>환율: <b>1 KRW ≈ {toLocal / sampleKrw < 0.01 ? (fx.rate).toFixed(6) : (fx.rate).toFixed(4)} {cur.code}</b></div>
                    <div className="flex flex-wrap gap-4">
                      <span>예시: <b>{fmtMoney(sampleKrw, 'KRW')}</b> ≈ <b>{fmtMoney(toLocal, cur.code)}</b></span>
                      <span>예시: <b>{fmtMoney(sampleLocal, cur.code)}</b> ≈ <b>{fmtMoney(toKrw, 'KRW')}</b></span>
                    </div>
                    <div className="text-xs opacity-70">
                      업데이트: {fx.updated} · 출처: {fx.source}
                    </div>
                  </div>
                );
              })()}
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
            <article className="rounded-2xl border p-4 shadow-sm sm:col-span-2">
              <h2 className="mb-2 text-lg font-semibold">전압 / 플러그</h2>

              {/* 가로 스크롤 스트립 + 스냅 */}
              <div className="-mx-2 overflow-x-auto snap-x snap-mandatory">
                <div className="flex gap-3 px-2">
                  {(data.power.plugTypes || []).map((t, i) => (
                    <div key={`${t}-${i}`} className="shrink-0 snap-start w-[268px]">
                      <PlugPhotos type={t} size={80} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-3 text-sm">
                전압/주파수: <b>{data.power.voltage}</b>, <b>{data.power.frequency}</b>
              </div>
              {data.power.source && (
                <div className="text-xs mt-1">
                  출처:{' '}
                  <a
                    className="underline"
                    href="https://www.worldstandards.eu/electricity/plugs-and-sockets/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    WorldStandards
                  </a>
                </div>
              )}

              {/* ✅ 쿠팡 파트너스 배너 (next/image 사용) */}
              <div className="mt-4 flex justify-center">
                <a
                  href={`/go/coupang?slug=plug-adapter&country=${country}&city=${city?.cityEn || ''}&from=${from || ''}&to=${to || ''}&placement=power_card_banner`}
                  target="_blank"
                  rel="noopener noreferrer sponsored nofollow"
                  referrerPolicy="unsafe-url"
                  aria-label="쿠팡에서 여행용 멀티 플러그 어댑터 보기"
                  className="block rounded-lg border overflow-hidden"
                >
                  <Image
                    src="https://image3.coupangcdn.com/image/affiliate/banner/454846be3c31a68bceb07da77a387c71@2x.jpg"
                    alt="엘디엑크스 5포트 고속충전 PD45W 해외 여행용 멀티 플러그 어댑터, 화이트, 1개"
                    width={120}
                    height={240}
                    priority={false}
                  />
                </a>
              </div>

              {/* 제휴 고지 */}
              <p className="mt-2 text-xs opacity-70 leading-relaxed">
                * 본 서비스의 일부 배너/링크는 <b>쿠팡 파트너스 제휴 배너/링크</b>입니다.
                해당 배너/링크를 통해 구매하시면 운영자가 일정액의 수수료를 제공받습니다.
              </p>              
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

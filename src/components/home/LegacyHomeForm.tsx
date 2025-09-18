// src/components/home/LegacyHomeForm.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { COUNTRIES, type Country, type City } from "@/data/geo";
import PlugPhotos from "@/components/PlugPhotos";
import { CURRENCY_BY_ISO2 } from "@/data/currency";
import Image from "next/image";
import DateField from "@/components/DateField";
import { sortKo } from "@/lib/sort";

/* ---------- 타입 ---------- */
type VisaInfo = {
  summary: string;
  sources?: { title: string; url: string }[];
  updatedAt?: string | null;
};
type ESIMDeal = { name: string; go: string };
type PowerInfo = {
  plugTypes: string[];
  voltage: string;
  frequency: string;
  source: string;
};
type BaggageInfo = {
  guide: string;
  airlineLinks: { code: string; title: string; url: string }[];
};
type ChecklistItem = { id: string; label: string; checked: boolean };
type AirlineFromCountry = { code: string; name: string; url?: string };
type ExtraLink = { title: string; url: string };

type AirlineObj = {
  code?: string;
  name?: string;
  nameKo?: string;
  nameEn?: string;
  url?: string;
  baggageUrl?: string;
};
type AirlineItem = string | AirlineObj;
function isAirlineObj(a: AirlineItem): a is AirlineObj {
  return typeof a === "object" && a !== null;
}

type ApiResponse = {
  country: string;
  passport: string;
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
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
};
type FxState = {
  base: string;
  quote: string;
  rate: number;
  inverse: number;
  updated: string;
  source: string;
} | null;

/* ---------- 유틸 ---------- */
function daysAhead(dateStr: string) {
  if (!dateStr) return 0;
  const today = new Date();
  const d0 = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const d1 = new Date(dateStr);
  const d1n = new Date(d1.getFullYear(), d1.getMonth(), d1.getDate());
  return Math.floor((d1n.getTime() - d0.getTime()) / 86400000);
}
function monthsSpan(from: string, to: string): number[] {
  if (!from || !to) return [];
  const s = new Date(from);
  const e = new Date(to);
  const out: number[] = [];
  let y = s.getFullYear(),
    m = s.getMonth();
  while (y < e.getFullYear() || (y === e.getFullYear() && m <= e.getMonth())) {
    out.push(m + 1);
    m++;
    if (m > 11) {
      m = 0;
      y++;
    }
  }
  return out;
}
const MONTH_LABELS = [
  "1월",
  "2월",
  "3월",
  "4월",
  "5월",
  "6월",
  "7월",
  "8월",
  "9월",
  "10월",
  "11월",
  "12월",
];

/* ---------- 섹션(아코디언) ---------- */
function Section({
  title,
  icon,
  children,
  defaultOpen = true,
  subtitle,
  openSignal,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  subtitle?: string;
  /** 값이 바뀔 때마다 강제로 펼침 */
  openSignal?: number;
}) {
  const [open, setOpen] = useState(defaultOpen);
  useEffect(() => {
    if (openSignal !== undefined) setOpen(true);
  }, [openSignal]); // 조회 후 모두 펼치기
  return (
    <section className="rounded-2xl bg-white shadow-md backdrop-blur mt-2">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-3 text-left"
      >
        <div className="flex min-w-0 items-center gap-2">
          {icon && <span className="text-sky-600">{icon}</span>}
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold">{title}</h3>
            {subtitle && (
              <p className="truncate text-xs text-slate-600">{subtitle}</p>
            )}
          </div>
        </div>
        <span className={`transition ${open ? "rotate-180" : ""}`}>⌄</span>
      </button>
      {open && (
        <div className="border-t border-t-gray-300 px-4 py-4">{children}</div>
      )}
    </section>
  );
}

/* =================================================================== */

export default function LegacyHomeForm() {
  // 입력/상태
  const [country, setCountry] = useState("JP");
  const [countryName, setCountryName] = useState("Japan");
  const [city, setCity] = useState<City | null>(null);
  const [passport, setPassport] = useState("KR");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  // 결과/보조 데이터
  const [data, setData] = useState<ApiResponse | null>(null);
  const [weather, setWeather] = useState<WeatherDaily | null>(null);
  const [climate, setClimate] = useState<ClimateMonthly | null>(null);
  const [tzName, setTzName] = useState<string | null>(null);
  const [fx, setFx] = useState<FxState>(null);
  const [fxNote, setFxNote] = useState<string | null>(null);
  const [weatherNote, setWeatherNote] = useState<string | null>(null);
  const [climateNote, setClimateNote] = useState<string | null>(null);

  // 로딩/오류
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // "조회 후 모두 펼치기" 신호
  const [openTick, setOpenTick] = useState(0);

  // 현재시각(시차 표시에 사용)
  const [now, setNow] = useState<Date>(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  // 옵션
  const selectedCountry: Country | undefined = useMemo(
    () => COUNTRIES.find((c) => c.iso2 === country),
    [country]
  );
  const countryOptions = useMemo(
    () => COUNTRIES.slice().sort(sortKo((c) => c.nameKo ?? c.nameEn ?? c.iso2)),
    []
  );
  const cityOptions = useMemo(
    () =>
      (selectedCountry?.cities ?? [])
        .slice()
        .sort(
          sortKo(
            (ct) => ct.cityKo ?? ct.cityEn ?? ct.cityJp ?? ct.cityCn ?? ct.iata
          )
        ),
    [selectedCountry]
  );

  // 항공사/수하물 링크
  const [countryAirlines, setCountryAirlines] = useState<AirlineFromCountry[]>(
    []
  );
  const [countryBaggageLinks, setCountryBaggageLinks] = useState<ExtraLink[]>(
    []
  );
  useEffect(() => {
    let abort = false;
    (async () => {
      try {
        const res = await fetch(`/data/country/${country}.json`, {
          cache: "force-cache",
        });
        if (!res.ok) {
          if (!abort) {
            setCountryAirlines([]);
            setCountryBaggageLinks([]);
          }
          return;
        }
        const j = (await res.json()) as {
          baggage?: {
            links?: { code?: string; name?: string; url?: string }[];
          };
          baggageLinks?: { title?: string; url?: string }[];
          airlines?: AirlineItem[];
          airline?: AirlineItem[];
        };

        const bagLinks = Array.isArray(j?.baggage?.links)
          ? j.baggage!.links!
          : [];
        if (bagLinks.length) {
          const list = bagLinks
            .map((b) => ({
              code: String(b?.code ?? "").toUpperCase(),
              name: String(b?.name ?? b?.code ?? "").trim(),
              url: b?.url ? String(b.url) : undefined,
            }))
            .filter((x) => x.code);
          if (!abort) {
            setCountryAirlines(list);
            setCountryBaggageLinks([]);
          }
          return;
        }

        const raw: AirlineItem[] = Array.isArray(j?.airlines)
          ? j!.airlines!
          : Array.isArray(j?.airline)
          ? j!.airline!
          : [];
        const list = raw
          .map<AirlineFromCountry>((a) =>
            isAirlineObj(a)
              ? {
                  code: (a.code || "").toUpperCase(),
                  name: (a.name ?? a.nameKo ?? a.nameEn ?? a.code ?? "").trim(),
                  url: a.url ?? a.baggageUrl,
                }
              : { code: a.toUpperCase(), name: a.toUpperCase() }
          )
          .filter((x) => x.code);
        const extra = Array.isArray(j?.baggageLinks)
          ? j.baggageLinks
              .filter(
                (b): b is { title: string; url: string } =>
                  !!b?.title && !!b?.url
              )
              .map((b) => ({ title: String(b.title), url: String(b.url) }))
          : [];
        if (!abort) {
          setCountryAirlines(list);
          setCountryBaggageLinks(extra);
        }
      } catch {
        if (!abort) {
          setCountryAirlines([]);
          setCountryBaggageLinks([]);
        }
      }
    })();
    return () => {
      abort = true;
    };
  }, [country]);

  // 체크리스트 저장 키
  const storageKey = useMemo(
    () =>
      `tc_checklist_${country}_${passport}_${from}_${to}_${city?.iata ?? "NA"}`,
    [country, passport, from, to, city?.iata]
  );

  // 포맷터
  function fmtZoned(d: Date, timeZone: string) {
    return new Intl.DateTimeFormat("ko-KR", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(d);
  }
  const withinForecastWindow = useMemo(
    () => !!from && daysAhead(from) <= 16,
    [from]
  );
  function getOffsetMinutes(timeZone: string, dateStr?: string) {
    const d = dateStr ? new Date(dateStr + "T12:00:00") : new Date();
    const utc = new Date(d.toLocaleString("en-US", { timeZone: "UTC" }));
    const tz = new Date(d.toLocaleString("en-US", { timeZone }));
    return Math.round((tz.getTime() - utc.getTime()) / 60000);
  }

  // 링크 동기화 & 리셋/인쇄
  function syncQueryToUrl() {
    const url = new URL(window.location.href);
    url.searchParams.set("country", country);
    url.searchParams.set("passport", passport);
    if (from) url.searchParams.set("from", from);
    else url.searchParams.delete("from");
    if (to) url.searchParams.set("to", to);
    else url.searchParams.delete("to");
    if (city?.iata) url.searchParams.set("city", city.iata);
    else url.searchParams.delete("city");
    window.history.replaceState({}, "", url.toString());
  }
  function printPage() {
    window.print();
  }

  // ✅ 초기화: 홈으로 이동 대신 현재 페이지 “새로고침 + 쿼리 제거”
  function resetAll() {
    const { pathname } = window.location;
    window.location.replace(pathname); // 쿼리 제거 후 새로고침
  }

  /* ---------- API ---------- */
  async function fetchForecast() {
    if (!city || !from || !to) {
      setWeather(null);
      setWeatherNote(null);
      return { hadData: false, beyond: false };
    }
    const lead = daysAhead(from);
    if (lead > 16) {
      setWeather(null);
      setWeatherNote(null);
      return { hadData: false, beyond: true };
    }
    try {
      const p = new URLSearchParams({
        lat: String(city.lat),
        lon: String(city.lon),
        from,
        to,
      });
      const r = await fetch(`/api/weather?${p.toString()}`);
      const j = (await r.json()) as {
        daily?: WeatherDaily | null;
        note?: string | null;
      };
      const daily = j?.daily ?? null;
      if (daily && daily.time?.length) {
        setWeather(daily);
        setWeatherNote(null);
        return { hadData: true, beyond: false };
      }
      setWeather(null);
      if (j?.note && j.note !== "beyond-range")
        setWeatherNote("예보 데이터를 찾지 못했습니다.");
      return { hadData: false, beyond: j?.note === "beyond-range" };
    } catch {
      setWeather(null);
      setWeatherNote("날씨 API 호출 실패");
      return { hadData: false, beyond: false };
    }
  }
  async function fetchClimate() {
    if (!city) {
      setClimate(null);
      setClimateNote(null);
      return;
    }
    try {
      const p = new URLSearchParams({
        lat: String(city.lat),
        lon: String(city.lon),
        precision: "2",
      });
      const r = await fetch(`/api/climate?${p.toString()}`);
      const j = await r.json();
      if (!r.ok || !j?.monthly) {
        setClimate(null);
        setClimateNote("기후 평균 데이터를 불러오지 못했어요.");
        return;
      }
      const m = j.monthly as { time: string[]; tmax: number[]; tmin: number[] };
      setClimate({
        time: m.time,
        temperature_2m_max: m.tmax,
        temperature_2m_min: m.tmin,
      });
      setClimateNote(null);
    } catch {
      setClimate(null);
      setClimateNote("기후 평균 데이터를 불러오지 못했어요.");
    }
  }
  async function fetchTimezoneAndComputeDiff() {
    if (!city) {
      setTzName(null);
      return;
    }
    try {
      const p = new URLSearchParams({
        lat: String(city.lat),
        lon: String(city.lon),
      });
      const r = await fetch(`/api/tz?${p.toString()}`);
      const j = await r.json();
      setTzName(r.ok && j?.timezone ? (j.timezone as string) : null);
    } catch {
      setTzName(null);
    }
  }
  async function fetchFx() {
    if (!country) {
      setFx(null);
      setFxNote(null);
      return;
    }
    const cur = CURRENCY_BY_ISO2[country];
    if (!cur) {
      setFx(null);
      setFxNote("통화 미지원");
      return;
    }
    try {
      const p = new URLSearchParams({ base: "KRW", quote: cur.code });
      const r = await fetch(`/api/fx?${p.toString()}`);
      const j = await r.json();
      if (r.ok && j?.rate) {
        setFx(j as FxState);
        setFxNote(null);
      } else {
        setFx(null);
        setFxNote("환율 정보를 불러올 수 없어요.");
      }
    } catch {
      setFx(null);
      setFxNote("환율 정보를 불러올 수 없어요.");
    }
  }
  async function fetchData() {
    setLoading(true);
    setErr(null);
    try {
      const params = new URLSearchParams({ country, passport, from, to });
      const res = await fetch(`/api/check?${params.toString()}`);
      if (!res.ok) throw new Error("국가 코드를 확인하세요.");
      const json = (await res.json()) as ApiResponse;

      // 체크리스트 복원
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const savedMap = new Map<string, boolean>(JSON.parse(saved));
          json.checklist = json.checklist.map((it) => ({
            ...it,
            checked: savedMap.get(it.id) ?? it.checked,
          }));
        }
      } catch {}

      setData(json);
      await fetchClimate();
      await fetchForecast();
      await fetchTimezoneAndComputeDiff();
      await fetchFx();

      // ⬇️ 조회 완료 신호 → 모든 섹션 펼치기
      setOpenTick((t) => t + 1);

      syncQueryToUrl();
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "알 수 없는 오류");
    } finally {
      setLoading(false);
    }
  }

  /* ---------- 초기 쿼리 복원 ---------- */
  useEffect(() => {
    const u = new URL(window.location.href);
    const qCountry = (u.searchParams.get("country") || "JP").toUpperCase();
    const qPassport = (u.searchParams.get("passport") || "KR").toUpperCase();
    const qFrom = u.searchParams.get("from") || "";
    const qTo = u.searchParams.get("to") || "";
    const qCity = u.searchParams.get("city") || "";
    const cInfo = COUNTRIES.find((x) => x.iso2 === qCountry);
    if (cInfo) {
      setCountry(qCountry);
      setCountryName(cInfo.nameEn);
      if (qCity) setCity(cInfo.cities.find((cc) => cc.iata === qCity) || null);
    }
    setPassport(qPassport);
    setFrom(qFrom);
    setTo(qTo);
  }, []);

  /* ---------- 렌더 ---------- */
  const tripMonths = monthsSpan(from, to);

  return (
    <main className="mx-auto max-w-5xl px-4 pb-16 pt-10">
      <header className="text-left">
        <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs text-slate-700 backdrop-blur">
          <span className="inline-block size-2 rounded-full bg-sky-500" />
          여행 체크 · 요약
        </div>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight">
          목적지의 <span className="text-sky-600 bg-clip-text">필수 정보</span>
          를 한 번에
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          비자·수하물·전원·eSIM, 기후/예보와 환율까지 한 화면에서 확인하세요.
          결과는 PDF로 저장할 수 있어요.
        </p>
      </header>

      <div className="text-end">
        <button
          onClick={printPage}
          className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-700"
        >
          인쇄 / PDF
        </button>
      </div>

      {/* 입력 영역 */}
      <section className="relative mt-5 rounded-2xl bg-sky-50 p-5 shadow-md backdrop-blur">
        <div className="grid min-w-0 grid-cols-1 items-end gap-3 sm:grid-cols-6">
          {/* 1행: 나라 / 도시 */}
          <div className="min-w-0 sm:col-span-3">
            <label className="text-xs text-slate-600">나라 선택</label>
            <select
              className="w-full rounded-xl border bg-white px-3 py-2 text-sm"
              value={country}
              onChange={(e) => {
                const iso2 = e.target.value;
                const c = COUNTRIES.find((x) => x.iso2 === iso2)!;
                setCountry(iso2);
                setCountryName(c.nameKo ?? c.nameEn);
                setCity(null);
              }}
            >
              {countryOptions.map((c) => (
                <option key={c.iso2} value={c.iso2}>
                  {c.nameKo ?? c.nameEn}
                </option>
              ))}
            </select>
          </div>
          <div className="min-w-0 sm:col-span-3">
            <label className="text-xs text-slate-600">도시 / 국제공항</label>
            <select
              className="w-full rounded-xl border bg-white px-3 py-2 text-sm"
              value={city?.iata || ""}
              onChange={(e) => {
                const iata = e.target.value;
                setCity(
                  selectedCountry?.cities.find((x) => x.iata === iata) || null
                );
              }}
            >
              <option value="" disabled>
                도시/공항 선택
              </option>
              {cityOptions.map((ct) => (
                <option key={ct.iata} value={ct.iata}>
                  {ct.cityKo} ({ct.iata})
                </option>
              ))}
            </select>
          </div>

          {/* 2행: 출국일 / 귀국일 */}
          <div className="min-w-0 sm:col-span-3">
            <DateField label="출국일" value={from} onChange={setFrom} />
          </div>
          <div className="min-w-0 sm:col-span-3">
            <DateField label="귀국일" value={to} onChange={setTo} />
          </div>

          {/* 버튼 행 */}
          <div className="sm:col-span-6 mt-1 flex flex-wrap items-center justify-end gap-2">
            {/* 링크 복사 버튼 제거됨 */}
            <button
              onClick={resetAll}
              className="rounded-xl bg-white px-4 py-2 text-sm shadow-sm hover:bg-gray-50"
            >
              초기화
            </button>
            <button
              onClick={fetchData}
              className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-700"
            >
              조회
            </button>
          </div>
        </div>
        {loading && (
          <div className="mt-3 text-xs text-slate-600">불러오는 중…</div>
        )}
        {err && <div className="mt-2 text-xs text-red-600">오류: {err}</div>}
      </section>

      {/* 요약 스탯바 (보더/카드 없이, 아이콘 + 텍스트만) */}
      {data && (
        <section className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-700 p-5 mt-5 mb-5 rounded-2xl ring-2 ring-sky-500">
          <span className="inline-flex items-center gap-2">
            <span>🌐</span>
            <b>{countryName}</b> ({country})
          </span>
          <span className="inline-flex items-center gap-2">
            <span>🧭</span>
            {city ? `${city.cityKo} (${city.iata})` : "도시/공항 선택 안 됨"}
          </span>
          <span className="inline-flex items-center gap-2">
            <span>🗓️</span>
            {from || "—"} ~ {to || "—"}
          </span>
          <span className="inline-flex items-center gap-2">
            <span>⏰</span>
            {tzName ?? "시간대 —"}
          </span>
          <span className="inline-flex items-center gap-2">
            <span>💱</span>
            {CURRENCY_BY_ISO2[country]?.code ?? "통화 —"}
          </span>
        </section>
      )}

      {/* 기후(평년) — 조회 후 자동 펼침 */}
      {climate && (
        <Section
          title={`월별 기후 평균 · ${city?.cityEn ?? ""}`}
          icon={<span>🌤️</span>}
          defaultOpen
          openSignal={openTick}
        >
          {tripMonths.length ? (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
              {tripMonths.map((m) => {
                const i = m - 1;
                const tmax = climate.temperature_2m_max[i];
                const tmin = climate.temperature_2m_min[i];
                return (
                  <div key={m} className="rounded-xl shadow-sm p-3 text-sm">
                    <div className="font-medium">{MONTH_LABELS[i]}</div>
                    <div className="mt-0.5">
                      평균 최고 {Number.isFinite(tmax) ? tmax.toFixed(1) : "-"}°
                      / 평균 최저{" "}
                      {Number.isFinite(tmin) ? tmin.toFixed(1) : "-"}°
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {Array.from({ length: 12 }, (_, i) => (
                <div key={i} className="rounded-xl shadow-sm p-3 text-sm">
                  <div className="font-medium">{MONTH_LABELS[i]}</div>
                  <div className="mt-0.5">
                    평균 최고{" "}
                    {Number.isFinite(climate.temperature_2m_max[i])
                      ? climate.temperature_2m_max[i].toFixed(1)
                      : "-"}
                    ° / 평균 최저{" "}
                    {Number.isFinite(climate.temperature_2m_min[i])
                      ? climate.temperature_2m_min[i].toFixed(1)
                      : "-"}
                    °
                  </div>
                </div>
              ))}
            </div>
          )}
          <p className="mt-3 text-xs text-slate-500">
            ※ 예보는 보통 출발 14~16일 전부터 확인 가능합니다.
          </p>
        </Section>
      )}
      {!climate && climateNote && (
        <div className="mt-2 text-xs text-red-600">{climateNote}</div>
      )}

      {/* 날씨(예보) — 조회 후 자동 펼침 */}
      {weather && (
        <Section
          title={`가까운 예보 · ${city?.cityEn ?? ""}`}
          subtitle={from && to ? `${from} ~ ${to}` : undefined}
          icon={<span>☔</span>}
          defaultOpen
          openSignal={openTick}
        >
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
            {weather.time.map((t, i) => (
              <div key={t} className="rounded-xl shadow-sm p-3 text-sm">
                <div className="font-medium">{t}</div>
                <div className="mt-0.5">
                  최고 {weather.temperature_2m_max[i]}° / 최저{" "}
                  {weather.temperature_2m_min[i]}°
                </div>
                <div className="mt-2 text-slate-500">
                  강수확률 최대{" "}
                  {weather.precipitation_probability_max[i] ?? "-"}%
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}
      {withinForecastWindow && !weather && !climate && weatherNote && (
        <div className="mt-2 text-xs text-slate-600">※ {weatherNote}</div>
      )}

      {/* 입국/비자 — 조회 후 자동 펼침 */}
      {data && (
        <Section
          title="입국 / 비자"
          icon={<span>🛂</span>}
          defaultOpen
          openSignal={openTick}
        >
          <p className="text-sm leading-relaxed">{data.visa.summary}</p>
          {data.visa.sources?.length ? (
            <div className="mt-2 flex flex-wrap gap-2">
              {data.visa.sources.map((s, i) => (
                <a
                  key={i}
                  className="inline-flex items-center gap-1 rounded-full border bg-white/70 px-2.5 py-1 text-xs text-sky-700"
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {s.title}
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5">
                    <path
                      d="M7 17l10-10M10 7h7v7"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </svg>
                </a>
              ))}
            </div>
          ) : null}
          {data.visa.updatedAt && (
            <p className="mt-2 text-xs text-slate-500">
              업데이트(비자 스냅샷): {data.visa.updatedAt}
            </p>
          )}
        </Section>
      )}

      {/* 수하물 — 조회 후 자동 펼침 */}
      {data && (
        <Section
          title="수하물"
          icon={<span>🧳</span>}
          defaultOpen
          openSignal={openTick}
        >
          <p className="text-sm leading-relaxed">{data.baggage.guide}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {countryAirlines.map((a) =>
              a.url ? (
                <a
                  key={a.code}
                  className="inline-flex items-center gap-1 rounded-full border bg-white/70 px-2.5 py-1 text-xs text-sky-700"
                  href={a.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {a.name} ({a.code})
                </a>
              ) : (
                <span
                  key={a.code}
                  className="inline-block rounded-full border bg-white/70 px-2.5 py-1 text-xs"
                >
                  {a.name} ({a.code})
                </span>
              )
            )}
            {countryBaggageLinks.map((l, i) => (
              <a
                key={i}
                className="inline-flex items-center gap-1 rounded-full border bg-white/70 px-2.5 py-1 text-xs text-sky-700"
                href={l.url}
                target="_blank"
                rel="noreferrer"
              >
                {l.title}
              </a>
            ))}
            {!countryAirlines.length &&
            !countryBaggageLinks.length &&
            data.baggage.airlineLinks?.length
              ? data.baggage.airlineLinks.map((a, i) => (
                  <a
                    key={i}
                    className="inline-flex items-center gap-1 rounded-full border bg-white/70 px-2.5 py-1 text-xs text-sky-700"
                    href={a.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {a.title}
                  </a>
                ))
              : null}
          </div>
        </Section>
      )}

      {/* 시차 — 조회 후 자동 펼침 */}
      {data && (
        <Section
          title="시차"
          icon={<span>⏰</span>}
          defaultOpen
          openSignal={openTick}
        >
          {tzName ? (
            (() => {
              const seoulTZ = "Asia/Seoul";
              const baseDate = from || new Date().toISOString().slice(0, 10);
              const offDest = getOffsetMinutes(tzName, baseDate);
              const offSeoul = getOffsetMinutes(seoulTZ, baseDate);
              const diffMin = offDest - offSeoul;
              const sign = diffMin > 0 ? "+" : diffMin < 0 ? "−" : "±";
              const h = Math.floor(Math.abs(diffMin) / 60),
                m = Math.abs(diffMin) % 60;
              return (
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 text-sm">
                  <div className="rounded-xl shadow-sm p-3">
                    <div className="text-xs text-slate-500">
                      {countryName}
                      {city ? ` · ${city.cityEn}` : ""}
                    </div>
                    <div className="mt-0.5 font-medium">{tzName}</div>
                    <div className="text-xs text-slate-500">
                      {fmtZoned(now, tzName)}
                    </div>
                  </div>
                  <div className="rounded-xl shadow-sm p-3">
                    <div className="text-xs text-slate-500">한국 (Seoul)</div>
                    <div className="mt-0.5 font-medium">Asia/Seoul</div>
                    <div className="text-xs text-slate-500">
                      {fmtZoned(now, seoulTZ)}
                    </div>
                  </div>
                  <div className="rounded-xl shadow-sm p-3">
                    <div className="text-xs text-slate-500">한국 대비</div>
                    <div className="mt-0.5 text-base font-bold text-sky-600">
                      {sign}
                      {h}시간{m ? ` ${m}분` : ""}
                    </div>
                    <div className="text-xs text-slate-500 font-semibold">
                      ( 출발일 기준 )
                    </div>
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="text-sm text-slate-600">
              도시/공항을 선택하고 조회하면 시차가 표시됩니다.
            </div>
          )}
        </Section>
      )}

      {/* 환율 — 조회 후 자동 펼침 */}
      {data && (
        <Section
          title="환율"
          icon={<span>💱</span>}
          defaultOpen
          openSignal={openTick}
        >
          {(() => {
            const cur = country ? CURRENCY_BY_ISO2[country] : null;
            if (!cur)
              return (
                <div className="text-sm text-slate-600">
                  해당 국가의 통화를 찾지 못했어요.
                </div>
              );
            if (!fx)
              return (
                <div className="text-sm text-slate-600">
                  {fxNote ?? "결과를 조회하면 환율이 표시됩니다."}
                </div>
              );
            const sampleKrw = 100_000,
              sampleLocal = 100;
            const rate = Number(fx.rate);
            const inverse = Number.isFinite(Number(fx.inverse))
              ? Number(fx.inverse)
              : rate > 0
              ? 1 / rate
              : NaN;
            const fmt = (n: number, code: string) =>
              new Intl.NumberFormat("ko-KR", {
                style: "currency",
                currency: code,
              }).format(n);
            return (
              <>
                <div className="mb-2 flex flex-wrap gap-2 text-xs">
                  <span className="inline-block rounded-full shadow-sm bg-sky-100/80 px-2.5 py-1">
                    기준: KRW → {cur.code} ({cur.nameKr})
                  </span>
                  <span className="inline-block rounded-full shadow-sm bg-sky-100/80 px-2.5 py-1">
                    1 KRW ≈ {rate < 0.01 ? rate.toFixed(6) : rate.toFixed(4)}{" "}
                    {cur.code}
                  </span>
                  <span className="inline-block rounded-full shadow-sm px-2.5 py-1">
                    업데이트: {fx.updated}
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 text-sm">
                  <div className="rounded-xl shadow-sm p-3">
                    <div className="text-xs text-slate-500">
                      {fmt(sampleKrw, "KRW")} →
                    </div>
                    <div className="mt-0.5 text-base">
                      {fmt(sampleKrw * rate, cur.code)}
                    </div>
                  </div>
                  <div className="rounded-xl shadow-sm bg-white/70 p-3">
                    <div className="text-xs text-slate-500">
                      {fmt(sampleLocal, cur.code)} →
                    </div>
                    <div className="mt-0.5 text-base">
                      {Number.isFinite(inverse)
                        ? fmt(sampleLocal * inverse, "KRW")
                        : "—"}
                    </div>
                  </div>
                </div>
                <p className="mt-2 text-xs text-slate-500">출처: {fx.source}</p>
              </>
            );
          })()}
        </Section>
      )}

      {/* 전압/플러그 — 조회 후 자동 펼침 */}
      {data && (
        <Section
          title="전압 / 플러그"
          icon={<span>🔌</span>}
          defaultOpen
          openSignal={openTick}
        >
          <div className="-mx-2 overflow-x-auto snap-x snap-mandatory">
            <div className="flex gap-3 px-2 justify-center">
              {(data.power.plugTypes || []).map((t, i) => (
                <div
                  key={`${t}-${i}`}
                  className="w-[300px] shrink-0 snap-start"
                >
                  <PlugPhotos type={t} size={80} />
                </div>
              ))}
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-sm items-center justify-center">
            <span className="inline-block rounded-full shadow-sm bg-sky-100/80 px-2.5 py-1">
              전압: <b>{data.power.voltage}</b>
            </span>
            <span className="inline-block rounded-full shadow-sm bg-sky-100/80 px-2.5 py-1">
              주파수: <b>{data.power.frequency}</b>
            </span>
          </div>
          <div className="flex justify-center mt-2 text-xs text-slate-500">
            {data.power.source && (
              <a
                className="text-xs underline"
                href="https://www.worldstandards.eu/electricity/plugs-and-sockets/"
                target="_blank"
                rel="noreferrer"
              >
                출처: WorldStandards
              </a>
            )}
          </div>

          {/* 배너(예시) */}
          <div className="mt-10 mb-10 flex justify-center">
            <a
              href={`/go/coupang?slug=plug-adapter&country=${country}&city=${
                city?.cityEn || ""
              }&from=${from || ""}&to=${to || ""}&placement=power_card_banner`}
              target="_blank"
              rel="noopener noreferrer sponsored nofollow"
              referrerPolicy="unsafe-url"
              className="block overflow-hidden rounded-lg shadow-lg ring-4 ring-cyan-400 hover:ring-cyan-300"
              aria-label="쿠팡에서 여행용 멀티 플러그 어댑터 보기"
            >
              <Image
                src="https://image3.coupangcdn.com/image/affiliate/banner/454846be3c31a68bceb07da77a387c71@2x.jpg"
                alt="해외 여행용 멀티 플러그 어댑터"
                width={120}
                height={240}
              />
            </a>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            * 이 배너/링크는 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의
            수수료를 제공받습니다.
          </p>
        </Section>
      )}

      {/* eSIM — 조회 후 자동 펼침 */}
      {data && (
        <Section
          title="eSIM"
          icon={<span>📶</span>}
          defaultOpen
          openSignal={openTick}
        >
          <ul className="grid grid-cols-1 gap-2">
            {data.esim.deals.map((d, i) => (
              <li key={i}>
                <a
                  className="inline-flex items-center gap-1 rounded-full border bg-white/70 px-2.5 py-1 text-xs text-sky-700"
                  href={d.go}
                  target="_blank"
                  rel="noreferrer"
                >
                  {d.name}
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5">
                    <path
                      d="M7 17l10-10M10 7h7v7"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-slate-400">
            * 이 배너/링크는 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의
            수수료를 제공받습니다.
          </p>
        </Section>
      )}

      {/* 면책 */}
      <footer className="mt-20 rounded-2xl bg-gray-100 p-4 text-sm leading-6 text-slate-700 shadow-sm">
        <div className="font-bold">신뢰 및 면책 고지</div>
        <ul className="list-disc pl-5">
          <li>
            본 서비스의 정보는 <b>참고용 요약</b>이며, 최종 규정은{" "}
            <b>항공사·출입국·대사관·정부 공식 공지</b>를 따릅니다.
          </li>
          <li>
            비자/입국 규정은 수시로 변경될 수 있습니다. <b>IATA</b>와 각국
            정부/대사관 공지에서 최신 정보를 확인하세요.
          </li>
          <li>
            전압·플러그 정보는 지역/시설에 따라 예외가 있을 수 있습니다. 숙소 및
            현지 안내도 함께 확인하세요.
          </li>
        </ul>
      </footer>

      {/* 전역 z-index 오버라이드: 다양한 DatePicker 라이브러리 대응 */}
      <style jsx global>{`
        /* react-datepicker */
        .react-datepicker-popper,
        .react-datepicker {
          z-index: 70 !important;
        }
        /* react-day-picker (v8+) */
        .rdp {
          z-index: 70 !important;
          position: relative;
        }
        /* react-date-range */
        .rdrDateRangePickerWrapper,
        .rdrCalendarWrapper {
          z-index: 70 !important;
          position: relative;
        }
      `}</style>
    </main>
  );
}

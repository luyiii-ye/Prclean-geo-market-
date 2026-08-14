"use client";

import { useEffect, useMemo, useState } from "react";
import type { CurrencyCode, DashboardData, MapCountry } from "@/types/dashboard";
import { loadDashboardData } from "@/lib/data";
import { CountrySearch } from "@/components/dashboard/CountrySearch";
import { CurrencySwitch } from "@/components/dashboard/CurrencySwitch";
import { ModelInfoPanel } from "@/components/dashboard/ModelInfoPanel";
import { MarketMap, type MapRegionKey } from "@/components/dashboard/MarketMap";
import { CountrySummaryCard } from "@/components/dashboard/CountrySummaryCard";
import { MapLegend } from "@/components/dashboard/MapLegend";
import { PasswordGate } from "@/components/shared/PasswordGate";

const REGION_FILTERS: Array<{ key: MapRegionKey; label: string; regions: string[] | null }> = [
  { key: "欧洲", label: "欧洲", regions: ["欧洲"] },
  { key: "美洲", label: "美洲", regions: ["北美", "南美"] },
  { key: "澳大利亚", label: "澳大利亚", regions: ["澳大利亚"] },
  { key: "西亚及中东", label: "西亚及中东", regions: ["西亚及中东"] },
  { key: "全部", label: "全部", regions: null }
];

const RAW_DATA_DOWNLOAD = {
  href: "/data/current_market_size_summary.xlsx",
  filename: "当前可视化_国家地区市场规模数据汇总.xlsx"
};

export default function HomePage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [currency, setCurrency] = useState<CurrencyCode>("EUR");
  const [selectedRegion, setSelectedRegion] = useState<MapRegionKey>("欧洲");
  const [selectedCountryId, setSelectedCountryId] = useState<string | null>(null);
  const [hoverCountryId, setHoverCountryId] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData()
      .then((loadedData) => {
        setData(loadedData);
        setSelectedCountryId((currentCountryId) => currentCountryId ?? loadedData.countries[0]?.country_id ?? null);
      })
      .catch((error) => console.error(error));
  }, []);

  const handleHoverCountry = (countryId: string | null) => {
    setHoverCountryId(countryId);
    if (countryId) {
      setSelectedCountryId(countryId);
    }
  };

  const activeCountryId = selectedCountryId;
  const selectedRegionConfig = REGION_FILTERS.find((region) => region.key === selectedRegion) ?? REGION_FILTERS[0];
  const visibleCountries = useMemo(() => {
    if (!data) {
      return [];
    }
    if (!selectedRegionConfig.regions) {
      return data.countries;
    }
    return data.countries.filter((country) => selectedRegionConfig.regions?.includes(country["区域大区"]));
  }, [data, selectedRegionConfig]);
  const activeCountry: MapCountry | null = useMemo(() => {
    if (!data) {
      return null;
    }
    return visibleCountries.find((country) => country.country_id === activeCountryId) ?? visibleCountries[0] ?? data.countries[0] ?? null;
  }, [data, visibleCountries, activeCountryId]);
  const activeSummary = data?.customerSummaries.find((item) => item.country_id === activeCountry?.country_id) ?? null;

  const handleRegionChange = (region: MapRegionKey) => {
    setSelectedRegion(region);
    setHoverCountryId(null);
    if (!data) {
      return;
    }
    const regionConfig = REGION_FILTERS.find((item) => item.key === region);
    const nextCountry = regionConfig?.regions
      ? data.countries.find((country) => regionConfig.regions?.includes(country["区域大区"]))
      : data.countries[0];
    setSelectedCountryId(nextCountry?.country_id ?? null);
  };

  const handleCountrySelect = (countryId: string | null) => {
    setSelectedCountryId(countryId);
    if (!countryId) {
      return;
    }
    const country = data?.countries.find((item) => item.country_id === countryId);
    if (!country) {
      return;
    }
    const matchingRegion = REGION_FILTERS.find((region) => region.regions?.includes(country["区域大区"]));
    if (matchingRegion) {
      setSelectedRegion(matchingRegion.key);
    }
  };

  if (!data) {
    return (
      <PasswordGate>
        <main className="flex min-h-screen items-center justify-center bg-dashboard-page text-dashboard-sub">
          正在加载看板数据...
        </main>
      </PasswordGate>
    );
  }

  return (
    <PasswordGate>
      <main className="min-h-screen bg-dashboard-page px-6 py-5">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-dashboard-text md:text-[28px]">
              多区域泳池清洁机器人线下市场机会地图
            </h1>
            <p className="mt-1 text-sm text-dashboard-sub">Market opportunity map across Europe, Americas, Australia, West Asia and Middle East</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <CountrySearch aliases={data.aliases} selectedCountryId={selectedCountryId} onSelect={handleCountrySelect} />
            <CurrencySwitch value={currency} onChange={setCurrency} />
            <div className="rounded-md border border-dashboard-line bg-white px-3 py-2 text-xs text-dashboard-sub">
              JSON data / local version
            </div>
          </div>
        </header>
        <section className="mt-5 grid gap-5 xl:grid-cols-[22%_1fr_22%]">
          <div className="order-3 xl:order-1">
            <ModelInfoPanel
              parameters={data.parameters}
              scenarios={data.scenarios}
              selectedCountryId={activeCountry?.country_id ?? null}
              currency={currency}
            />
          </div>
          <div className="order-1 grid content-start gap-3 xl:order-2">
            <div className="w-full rounded-lg border border-dashboard-line bg-white/95 p-1.5 shadow-sm">
              <div className="grid w-full grid-cols-2 gap-1 sm:grid-cols-5">
                {REGION_FILTERS.map((region) => (
                  <button
                    key={region.key}
                    type="button"
                    className={`min-h-9 rounded-md px-3 py-1.5 text-sm font-medium transition ${
                      selectedRegion === region.key
                        ? "bg-dashboard-orange text-white"
                        : "text-dashboard-sub hover:bg-dashboard-page hover:text-dashboard-text"
                    }`}
                    onClick={() => handleRegionChange(region.key)}
                  >
                    {region.label}
                  </button>
                ))}
              </div>
            </div>
            <MarketMap
              countries={visibleCountries}
              customerSummaries={data.customerSummaries}
              hoveredCountryId={hoverCountryId}
              selectedRegion={selectedRegion}
              currency={currency}
              onHoverCountry={handleHoverCountry}
              onSelectCountry={setSelectedCountryId}
            />
            <MapLegend />
          </div>
          <div className="order-2 grid content-start gap-4 xl:order-3">
            <CountrySummaryCard country={activeCountry} customerSummary={activeSummary} currency={currency} />
            <a
              href={RAW_DATA_DOWNLOAD.href}
              download={RAW_DATA_DOWNLOAD.filename}
              aria-label={`下载${RAW_DATA_DOWNLOAD.filename}`}
              className="group rounded-lg border border-dashboard-line bg-white p-5 shadow-sm transition hover:border-orange-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-dashboard-orange/30"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold text-dashboard-text">下载原始数据</div>
                  <div className="mt-1 text-xs leading-5 text-dashboard-sub">{RAW_DATA_DOWNLOAD.filename}</div>
                </div>
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-orange-50 text-lg font-semibold text-dashboard-orange transition group-hover:bg-dashboard-orange group-hover:text-white">
                  ↓
                </span>
              </div>
            </a>
          </div>
        </section>
      </main>
    </PasswordGate>
  );
}

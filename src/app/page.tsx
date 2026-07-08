"use client";

import { useEffect, useMemo, useState } from "react";
import type { CurrencyCode, DashboardData, MapCountry } from "@/types/dashboard";
import { loadDashboardData } from "@/lib/data";
import { CountrySearch } from "@/components/dashboard/CountrySearch";
import { CurrencySwitch } from "@/components/dashboard/CurrencySwitch";
import { ModelInfoPanel } from "@/components/dashboard/ModelInfoPanel";
import { MarketMap } from "@/components/dashboard/MarketMap";
import { CountrySummaryCard } from "@/components/dashboard/CountrySummaryCard";
import { MapLegend } from "@/components/dashboard/MapLegend";
import { PasswordGate } from "@/components/shared/PasswordGate";

export default function HomePage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [currency, setCurrency] = useState<CurrencyCode>("EUR");
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
  const activeCountry: MapCountry | null = useMemo(() => {
    if (!data) {
      return null;
    }
    return data.countries.find((country) => country.country_id === activeCountryId) ?? data.countries[0] ?? null;
  }, [data, activeCountryId]);
  const activeSummary = data?.customerSummaries.find((item) => item.country_id === activeCountry?.country_id) ?? null;

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
              欧洲泳池清洁机器人线下市场机会地图
            </h1>
            <p className="mt-1 text-sm text-dashboard-sub">Market opportunity map based on calibrated offline market value</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <CountrySearch aliases={data.aliases} selectedCountryId={selectedCountryId} onSelect={setSelectedCountryId} />
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
          <div className="order-1 grid gap-3 xl:order-2">
            <MarketMap
              countries={data.countries}
              customerSummaries={data.customerSummaries}
              hoveredCountryId={hoverCountryId}
              onHoverCountry={handleHoverCountry}
              onSelectCountry={setSelectedCountryId}
            />
            <MapLegend />
          </div>
          <div className="order-2 xl:order-3">
            <CountrySummaryCard country={activeCountry} customerSummary={activeSummary} currency={currency} />
          </div>
        </section>
      </main>
    </PasswordGate>
  );
}

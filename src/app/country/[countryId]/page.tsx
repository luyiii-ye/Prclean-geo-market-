"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { CurrencyCode, CustomerCountrySummary, CustomerLead, MapCountry } from "@/types/dashboard";
import { loadCustomerDetailData } from "@/lib/data";
import { CurrencySwitch } from "@/components/dashboard/CurrencySwitch";
import { CustomerOverviewPanel } from "@/components/customer/CustomerOverviewPanel";
import { CustomerListTable } from "@/components/customer/CustomerListTable";
import { IncompleteDataState } from "@/components/customer/IncompleteDataState";
import { PasswordGate } from "@/components/shared/PasswordGate";

interface DetailData {
  countries: MapCountry[];
  customerSummaries: CustomerCountrySummary[];
  customers: CustomerLead[];
}

export default function CountryDetailPage() {
  const params = useParams<{ countryId: string }>();
  const countryId = decodeURIComponent(params.countryId);
  const [data, setData] = useState<DetailData | null>(null);
  const [currency, setCurrency] = useState<CurrencyCode>("EUR");

  useEffect(() => {
    loadCustomerDetailData().then(setData).catch((error) => console.error(error));
  }, []);

  const country = useMemo(() => data?.countries.find((item) => item.country_id === countryId) ?? null, [data, countryId]);
  const summary = useMemo(() => data?.customerSummaries.find((item) => item.country_id === countryId) ?? null, [data, countryId]);
  const customers = useMemo(
    () => (data?.customers ?? []).filter((item) => item.country_id === countryId && item["是否展示"]),
    [data, countryId]
  );

  if (!data) {
    return (
      <PasswordGate>
        <main className="flex min-h-screen items-center justify-center bg-dashboard-page text-dashboard-sub">
          正在加载客户数据...
        </main>
      </PasswordGate>
    );
  }

  if (!country || !summary) {
    return (
      <PasswordGate>
        <main className="min-h-screen bg-dashboard-page p-6">
          <Link href="/" className="text-sm font-medium text-dashboard-link">← 返回市场地图</Link>
          <div className="mt-6 rounded-lg border border-dashboard-line bg-white p-6">未找到该 country_id 对应的数据。</div>
        </main>
      </PasswordGate>
    );
  }

  const ready = summary.detail_page_status === "ready";

  return (
    <PasswordGate>
      <main className="min-h-screen bg-dashboard-page px-6 py-5">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Link href="/" className="text-sm font-medium text-dashboard-link">← 返回市场地图</Link>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-dashboard-text md:text-[28px]">
              {country["国家/区域中文名"]}客户详情
            </h1>
            <p className="mt-1 text-sm text-dashboard-sub">
              {country["国家/区域英文名"]} / {summary.detail_page_status}
            </p>
          </div>
          <CurrencySwitch value={currency} onChange={setCurrency} />
        </header>
        {ready ? (
          <section className="mt-5 grid gap-5 xl:grid-cols-[30%_1fr]">
            <CustomerOverviewPanel summary={summary} />
            <CustomerListTable customers={customers} />
          </section>
        ) : (
          <div className="mt-5">
            <IncompleteDataState country={country} currency={currency} />
          </div>
        )}
      </main>
    </PasswordGate>
  );
}

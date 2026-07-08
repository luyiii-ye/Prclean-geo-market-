"use client";

import Link from "next/link";
import type { CurrencyCode, CustomerCountrySummary, MapCountry } from "@/types/dashboard";
import { formatMoneyEur, formatNumber } from "@/lib/format";
import { Tag } from "@/components/shared/Tag";

interface CountrySummaryCardProps {
  country: MapCountry | null;
  customerSummary: CustomerCountrySummary | null;
  currency: CurrencyCode;
}

export function CountrySummaryCard({ country, customerSummary, currency }: CountrySummaryCardProps) {
  if (!country) {
    return (
      <aside className="rounded-lg border border-dashboard-line bg-white p-5">
        <div className="text-sm text-dashboard-sub">Hover 或选择一个气泡查看国家摘要。</div>
      </aside>
    );
  }
  const ready = customerSummary?.detail_page_status === "ready";
  return (
    <aside className="rounded-lg border border-dashboard-line bg-white p-5 shadow-sm">
      <div className="text-sm text-dashboard-sub">{country["国家/区域英文名"]}</div>
      <h2 className="mt-1 text-2xl font-semibold text-dashboard-text">{country["国家/区域中文名"]}</h2>
      <div className="mt-5">
        <div className="text-xs font-medium uppercase tracking-wide text-dashboard-weak">Final offline market value</div>
        <div className="mt-2 text-4xl font-semibold tracking-tight text-dashboard-text">
          {formatMoneyEur(country["最终加权校准后线下市场价值"], currency)}
        </div>
      </div>
      <div className="mt-6 grid gap-3 text-sm">
        <div className="flex justify-between gap-3">
          <span className="text-dashboard-sub">泳池保有总量</span>
          <span className="font-medium">{formatNumber(country["泳池保有总量"])}</span>
        </div>
        <div className="flex justify-between gap-3">
          <span className="text-dashboard-sub">年新增泳池</span>
          <span className="font-medium">{formatNumber(country["年新增泳池"])}</span>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <Tag tone={country["气泡边框样式"] === "虚线" ? "orange" : "blue"}>{country["泳池基数属性"]}</Tag>
        <Tag>{country["市场类型"]}</Tag>
      </div>
      <p className="mt-4 text-xs leading-5 text-dashboard-sub">{country["数据口径类型"]}</p>
      <Link
        href={`/country/${country.country_id}`}
        className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-dashboard-orange px-4 py-2.5 text-sm font-semibold text-white hover:bg-dashboard-deepOrange"
      >
        {ready ? "查看客户线索 →" : "客户数据待补充 →"}
      </Link>
    </aside>
  );
}

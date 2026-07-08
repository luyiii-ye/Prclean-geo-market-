"use client";

import type { CurrencyCode, ParameterNote, ScenarioRange } from "@/types/dashboard";
import { formatMoneyEur } from "@/lib/format";
import { Tag } from "@/components/shared/Tag";

interface ModelInfoPanelProps {
  parameters: ParameterNote[];
  scenarios: ScenarioRange[];
  selectedCountryId: string | null;
  currency: CurrencyCode;
}

export function ModelInfoPanel({ parameters, scenarios, selectedCountryId, currency }: ModelInfoPanelProps) {
  const visibleParameters = parameters
    .filter((item) => item["是否展示"] === "是")
    .sort((a, b) => a["展示排序"] - b["展示排序"]);
  const countryScenarios = selectedCountryId
    ? scenarios.filter((item) => item.country_id === selectedCountryId)
    : [];

  return (
    <aside className="grid gap-4">
      <section className="rounded-lg border border-dashboard-line bg-white p-4 shadow-sm">
        <h2 className="text-base font-semibold text-dashboard-text">当前估值口径</h2>
        <p className="mt-2 text-sm leading-6 text-dashboard-sub">模型02最终加权校准后线下市场价值</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {["泳池保有量", "年新增泳池", "住宅渗透率", "替换周期", "ASP", "线下渠道占比", "第三方市场校准"].map((tag) => (
            <Tag key={tag} tone="orange">{tag}</Tag>
          ))}
        </div>
      </section>
      <section className="rounded-lg border border-dashboard-line bg-white p-4 shadow-sm">
        <h2 className="text-base font-semibold text-dashboard-text">估值区间</h2>
        {countryScenarios.length ? (
          <div className="mt-3 grid gap-2">
            {countryScenarios.map((item) => (
              <div key={item["情景"]} className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2">
                <span className="text-sm font-medium">{item["情景"]}</span>
                <span className="text-sm font-semibold text-dashboard-text">
                  {formatMoneyEur(item["加权校准后线下市场价值"], currency)}
                </span>
              </div>
            ))}
            <p className="mt-2 text-xs leading-5 text-dashboard-weak">{countryScenarios[0]["区间口径说明"]}</p>
          </div>
        ) : (
          <p className="mt-3 text-sm text-dashboard-sub">选择国家查看估值区间。</p>
        )}
      </section>
      <section className="rounded-lg border border-dashboard-line bg-white p-4 shadow-sm">
        <h2 className="text-base font-semibold text-dashboard-text">核心模型参数</h2>
        <div className="mt-3 grid gap-3">
          {visibleParameters.map((item) => (
            <div key={item["参数名称"]} className="rounded-md border border-dashboard-line p-3">
              <div className="text-sm font-semibold text-dashboard-text">{item["参数名称"]}</div>
              <p className="mt-1 text-xs leading-5 text-dashboard-sub">{item["参数解释"]}</p>
              <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                <span>保守 {item["保守值"]}</span>
                <span>基准 {item["基准值"]}</span>
                <span>乐观 {item["乐观值"]}</span>
              </div>
              <div className="mt-2 text-xs text-dashboard-weak">{item["影响方向"]}</div>
            </div>
          ))}
        </div>
      </section>
    </aside>
  );
}

import type { CurrencyCode, MapCountry } from "@/types/dashboard";
import { formatMoneyEur, formatNumber } from "@/lib/format";
import { MetricCard } from "@/components/shared/MetricCard";
import { Tag } from "@/components/shared/Tag";

interface IncompleteDataStateProps {
  country: MapCountry;
  currency: CurrencyCode;
}

export function IncompleteDataState({ country, currency }: IncompleteDataStateProps) {
  return (
    <section className="rounded-lg border border-dashboard-line bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-dashboard-text">该地区客户数据待补充</h2>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-dashboard-sub">
        当前已完成一级市场规模估算，但 B 端客户池数据尚未达到展示标准。后续可补充经销商、泳池服务商、
        酒店/度假村、公共泳池等数据后开放客户页面。
      </p>
      <div className="mt-6 grid gap-3 md:grid-cols-3">
        <MetricCard label="最终线下市场价值" value={formatMoneyEur(country["最终加权校准后线下市场价值"], currency)} />
        <MetricCard label="泳池保有总量" value={formatNumber(country["泳池保有总量"])} />
        <MetricCard label="年新增泳池" value={formatNumber(country["年新增泳池"])} />
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <Tag tone="blue">{country["泳池基数属性"]}</Tag>
        <Tag>{country["市场类型"]}</Tag>
      </div>
    </section>
  );
}

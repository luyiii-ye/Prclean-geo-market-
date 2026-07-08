import type { CustomerCountrySummary } from "@/types/dashboard";
import { formatNumber } from "@/lib/format";
import { MetricCard } from "@/components/shared/MetricCard";

interface CustomerOverviewPanelProps {
  summary: CustomerCountrySummary;
}

export function CustomerOverviewPanel({ summary }: CustomerOverviewPanelProps) {
  return (
    <aside className="grid gap-4">
      <section className="rounded-lg border border-dashboard-line bg-white p-5 shadow-sm">
        <h2 className="text-xl font-semibold text-dashboard-text">{summary["国家/区域中文名"]}客户概览</h2>
        <p className="mt-2 text-sm leading-6 text-dashboard-sub">{summary["数据覆盖说明"]}</p>
      </section>
      <div className="grid gap-3">
        <MetricCard label="已识别 B 端客户数" value={formatNumber(summary["已识别B端客户数"])} />
        <MetricCard label="高价值渠道目标数" value={formatNumber(summary["高价值渠道目标数"])} />
        <MetricCard label="销售渠道数" value={formatNumber(summary["销售渠道数"])} />
        <MetricCard label="服务渠道数" value={formatNumber(summary["服务渠道数"])} />
        <MetricCard label="直接使用客户数" value={formatNumber(summary["直接使用客户数"])} />
        <MetricCard
          label="扩展客户池规模"
          value={formatNumber(summary["扩展客户池规模"])}
          note={`已验证 ${formatNumber(summary["扩展客户池已验证数"])}`}
        />
      </div>
    </aside>
  );
}

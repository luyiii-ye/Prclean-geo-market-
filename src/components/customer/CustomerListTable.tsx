import type { CustomerLead } from "@/types/dashboard";
import { splitTags } from "@/lib/format";
import { Tag } from "@/components/shared/Tag";

interface CustomerListTableProps {
  customers: CustomerLead[];
}

export function CustomerListTable({ customers }: CustomerListTableProps) {
  const sorted = [...customers].sort((a, b) => a["展示排序"] - b["展示排序"]);
  return (
    <section className="rounded-lg border border-dashboard-line bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-dashboard-text">可关注客户清单</h2>
        <span className="text-sm text-dashboard-sub">{sorted.length} companies</span>
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-dashboard-line text-xs text-dashboard-sub">
            <tr>
              {["公司名称", "官网", "城市/地区", "客户类型", "渠道角色", "价值标签", "提及品牌", "置信度", "验证状态"].map((head) => (
                <th key={head} className="whitespace-nowrap px-3 py-3 font-semibold">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-dashboard-line">
            {sorted.map((lead) => (
              <tr key={lead.company_id} className="align-top hover:bg-gray-50">
                <td className="px-3 py-3 font-semibold text-dashboard-text">{lead["公司名称"]}</td>
                <td className="px-3 py-3">
                  {lead["官网"] ? (
                    <a className="text-dashboard-link hover:underline" href={lead["官网"]} target="_blank" rel="noreferrer">
                      官网
                    </a>
                  ) : (
                    <span className="text-dashboard-weak">-</span>
                  )}
                </td>
                <td className="px-3 py-3 text-dashboard-sub">{lead["城市/地区"] || "-"}</td>
                <td className="px-3 py-3"><Tag tone="blue">{lead["客户类型"]}</Tag></td>
                <td className="px-3 py-3"><Tag>{lead["渠道角色"]}</Tag></td>
                <td className="px-3 py-3"><Tag tone={lead["价值标签"] === "high_value_channel_target" ? "orange" : "gray"}>{lead["价值标签"]}</Tag></td>
                <td className="px-3 py-3">
                  <div className="flex max-w-56 flex-wrap gap-1">
                    {splitTags(lead["提及品牌"]).slice(0, 4).map((brand) => <Tag key={brand} tone="gray">{brand}</Tag>)}
                  </div>
                </td>
                <td className="px-3 py-3">
                  <div className="w-24">
                    <div className="text-xs font-semibold">{lead["置信度"]}</div>
                    <div className="mt-1 h-1.5 rounded-full bg-gray-100">
                      <div className="h-1.5 rounded-full bg-dashboard-orange" style={{ width: `${Math.min(100, Math.max(0, lead["置信度"]))}%` }} />
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3">
                  <Tag tone={String(lead["验证状态"]).includes("verified") ? "green" : "gray"}>{lead["验证状态"]}</Tag>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

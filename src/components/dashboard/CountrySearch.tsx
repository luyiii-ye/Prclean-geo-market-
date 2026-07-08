"use client";

import { useMemo, useState } from "react";
import type { CountryAlias } from "@/types/dashboard";

interface CountrySearchProps {
  aliases: CountryAlias[];
  selectedCountryId: string | null;
  onSelect: (countryId: string | null) => void;
}

export function CountrySearch({ aliases, selectedCountryId, onSelect }: CountrySearchProps) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) {
      return aliases;
    }
    return aliases.filter((item) => {
      const haystack = [
        item["中文名"],
        item["英文名"],
        item.ISO2 ?? "",
        item.ISO3 ?? "",
        item["常用别名"] ?? "",
        item.country_id
      ].join(" ").toLowerCase();
      return haystack.includes(term.toLowerCase());
    });
  }, [aliases, query]);

  return (
    <div className="flex items-center gap-2">
      <input
        className="h-9 w-52 rounded-md border border-dashboard-line bg-white px-3 text-sm text-dashboard-text outline-none focus:border-dashboard-orange"
        placeholder="输入国家、ISO或别名"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <select
        className="h-9 min-w-48 rounded-md border border-dashboard-line bg-white px-3 text-sm text-dashboard-text outline-none focus:border-dashboard-orange"
        value={selectedCountryId ?? ""}
        onChange={(event) => onSelect(event.target.value || null)}
      >
        <option value="">搜索/选择国家或区域</option>
        {filtered.map((item) => (
          <option key={item.country_id} value={item.country_id}>
            {item["中文名"]} / {item["英文名"]} {item.ISO2 ? `(${item.ISO2})` : ""}
          </option>
        ))}
      </select>
      {selectedCountryId ? (
        <button
          type="button"
          className="rounded-md border border-dashboard-line bg-white px-3 py-2 text-xs font-medium text-dashboard-sub hover:bg-gray-100"
          onClick={() => onSelect(null)}
        >
          清空
        </button>
      ) : null}
    </div>
  );
}

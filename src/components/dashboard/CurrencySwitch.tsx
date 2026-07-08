"use client";

import type { CurrencyCode } from "@/types/dashboard";
import { CURRENCIES } from "@/lib/currency";
import { cx } from "@/lib/format";

interface CurrencySwitchProps {
  value: CurrencyCode;
  onChange: (currency: CurrencyCode) => void;
}

export function CurrencySwitch({ value, onChange }: CurrencySwitchProps) {
  return (
    <div className="inline-flex rounded-md border border-dashboard-line bg-white p-1">
      {CURRENCIES.map((currency) => (
        <button
          key={currency}
          type="button"
          className={cx(
            "rounded px-3 py-1.5 text-xs font-semibold",
            value === currency ? "bg-dashboard-orange text-white" : "text-dashboard-sub hover:bg-gray-100"
          )}
          onClick={() => onChange(currency)}
        >
          {currency}
        </button>
      ))}
    </div>
  );
}

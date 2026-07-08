import type { CurrencyCode } from "@/types/dashboard";
import { convertFromEur } from "@/lib/currency";

export function formatMoneyEur(value: number | null | undefined, currency: CurrencyCode): string {
  const converted = convertFromEur(value, currency);
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: converted >= 1_000_000 ? 1 : 0,
    notation: converted >= 1_000_000 ? "compact" : "standard"
  });
  return formatter.format(converted);
}

export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "-";
  }
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value);
}

export function splitTags(value: string | null | undefined): string[] {
  if (!value) {
    return [];
  }
  return value
    .split(/[;,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

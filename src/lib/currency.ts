import type { CurrencyCode } from "@/types/dashboard";

export const CURRENCIES: CurrencyCode[] = ["EUR", "USD", "CNY"];

export const DISPLAY_EXCHANGE_RATES: Record<CurrencyCode, number> = {
  EUR: Number(process.env.NEXT_PUBLIC_RATE_EUR ?? 1),
  USD: Number(process.env.NEXT_PUBLIC_RATE_USD ?? 1.08),
  CNY: Number(process.env.NEXT_PUBLIC_RATE_CNY ?? 7.8)
};

export function convertFromEur(value: number | null | undefined, currency: CurrencyCode): number {
  if (!value || Number.isNaN(value)) {
    return 0;
  }
  return value * DISPLAY_EXCHANGE_RATES[currency];
}

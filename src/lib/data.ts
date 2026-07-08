import type {
  CountryAlias,
  CustomerCountrySummary,
  CustomerLead,
  DashboardData,
  MapCountry,
  ParameterNote,
  ScenarioRange
} from "@/types/dashboard";

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(path, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to load ${path}`);
  }
  return response.json() as Promise<T>;
}

export async function loadDashboardData(): Promise<DashboardData> {
  const [countries, scenarios, parameters, aliases, customerSummaries, customers] = await Promise.all([
    getJson<MapCountry[]>("/data/map_countries.json"),
    getJson<ScenarioRange[]>("/data/scenario_ranges.json"),
    getJson<ParameterNote[]>("/data/parameter_notes.json"),
    getJson<CountryAlias[]>("/data/country_aliases.json"),
    getJson<CustomerCountrySummary[]>("/data/customer_country_summary.json"),
    getJson<CustomerLead[]>("/data/customer_list.json")
  ]);
  return { countries, scenarios, parameters, aliases, customerSummaries, customers };
}

export async function loadCustomerDetailData() {
  const [countries, customerSummaries, customers] = await Promise.all([
    getJson<MapCountry[]>("/data/map_countries.json"),
    getJson<CustomerCountrySummary[]>("/data/customer_country_summary.json"),
    getJson<CustomerLead[]>("/data/customer_list.json")
  ]);
  return { countries, customerSummaries, customers };
}

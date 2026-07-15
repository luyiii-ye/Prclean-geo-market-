"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { CurrencyCode, CustomerCountrySummary, MapCountry } from "@/types/dashboard";
import { formatMoneyEur } from "@/lib/format";

const ReactECharts = dynamic(() => import("echarts-for-react"), { ssr: false });
const WORLD_MAP_NAME = "dashboard-world-countries-20260715";
const WORLD_MAP_URL = "/maps/world-countries.geo.json?v=20260715";
let worldMapRegistered = false;
type RegisterMapSource = Parameters<typeof import("echarts").registerMap>[1];
export type MapRegionKey = "欧洲" | "美洲" | "澳大利亚" | "西亚及中东" | "全部";

const REGION_VIEW: Record<MapRegionKey, { boundingCoords: [[number, number], [number, number]]; layoutSize: string }> = {
  欧洲: { boundingCoords: [[-12, 35], [42, 59]], layoutSize: "100%" },
  美洲: { boundingCoords: [[-128, -45], [-34, 59]], layoutSize: "100%" },
  澳大利亚: { boundingCoords: [[111, -45], [156, -10]], layoutSize: "100%" },
  "西亚及中东": { boundingCoords: [[28, 5], [128, 53]], layoutSize: "100%" },
  全部: { boundingCoords: [[-128, -45], [142, 59]], layoutSize: "100%" }
};

interface MarketMapProps {
  countries: MapCountry[];
  hoveredCountryId: string | null;
  customerSummaries: CustomerCountrySummary[];
  selectedRegion: MapRegionKey;
  currency: CurrencyCode;
  onHoverCountry: (countryId: string | null) => void;
  onSelectCountry: (countryId: string) => void;
}

interface MapPointData {
  name: string;
  value: [number, number, number];
  countryId: string;
  marketValueLabel: string;
}

function colorFor(value: number, min: number, max: number): string {
  if (max <= min) {
    return "#F59E0B";
  }
  const t = (value - min) / (max - min);
  if (t > 0.66) {
    return "#EA580C";
  }
  if (t > 0.33) {
    return "#F59E0B";
  }
  return "#FDE68A";
}

export function MarketMap({ countries, hoveredCountryId, selectedRegion, currency, onHoverCountry, onSelectCountry }: MarketMapProps) {
  const router = useRouter();
  const [mapReady, setMapReady] = useState(false);
  const shown = countries.filter((country) => country["是否展示"] === "是");
  const values = shown.map((country) => country["最终加权校准后线下市场价值"] ?? 0);
  const min = Math.min(...values);
  const max = Math.max(...values);

  useEffect(() => {
    let cancelled = false;

    async function loadGlobalMap() {
      const response = await fetch(WORLD_MAP_URL, { cache: "no-store" });
      if (!response.ok) {
        throw new Error("Failed to load world country boundaries");
      }
      const geoJson = await response.json();
      const echarts = await import("echarts");
      if (!worldMapRegistered) {
        echarts.registerMap(WORLD_MAP_NAME, geoJson as RegisterMapSource);
        worldMapRegistered = true;
      }
      if (!cancelled) {
        setMapReady(true);
      }
    }

    loadGlobalMap().catch((error) => {
      console.error(error);
      if (!cancelled) {
        setMapReady(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const option = useMemo(() => {
    const regionView = REGION_VIEW[selectedRegion];
    const data = shown.map((country) => {
      const value = country["最终加权校准后线下市场价值"] ?? 0;
      const size = 14 + Math.sqrt(value / Math.max(max, 1)) * 54;
      const isHovered = hoveredCountryId === country.country_id;
      const borderType = country["气泡边框样式"] === "虚线" ? "dashed" : "solid";
      return {
        name: country["国家/区域中文名"],
        value: [country["经度"], country["纬度"], value],
        countryId: country.country_id,
        marketValueLabel: formatMoneyEur(value, currency),
        symbolSize: size,
        itemStyle: {
          color: colorFor(value, min, max),
          borderColor: "#F97316",
          borderWidth: isHovered ? 4 : 2,
          borderType,
          shadowBlur: isHovered ? 24 : 9,
          shadowColor: isHovered ? "rgba(249, 115, 22, 0.35)" : "rgba(249, 115, 22, 0.24)"
        },
        emphasis: {
          scale: 1.16,
          itemStyle: {
            color: colorFor(value, min, max),
            borderColor: "#F97316",
            borderWidth: isHovered ? 4 : 3,
            borderType,
            shadowBlur: 26,
            shadowColor: "rgba(249, 115, 22, 0.35)"
          },
          label: { show: true, formatter: "{b}", color: "#111827", fontWeight: 700 }
        }
      };
    });
    return {
      backgroundColor: "#F7F8FA",
      geo: {
        map: WORLD_MAP_NAME,
        roam: true,
        silent: false,
        boundingCoords: regionView.boundingCoords,
        layoutCenter: ["50%", "50%"],
        layoutSize: regionView.layoutSize,
        scaleLimit: {
          min: 1,
          max: 8
        },
        itemStyle: {
          areaColor: "#E5E7EB",
          borderColor: "#FFFFFF",
          borderWidth: 1
        },
        emphasis: {
          disabled: true,
          itemStyle: {
            areaColor: "#E5E7EB",
            borderColor: "#F8F9FA"
          }
        },
        select: {
          disabled: true
        },
        label: {
          show: false
        }
      },
      tooltip: {
        trigger: "item",
        formatter: (params: { data?: MapPointData }) => {
          if (!params.data) {
            return "";
          }
          return `${params.data.name}<br/>Offline market value: ${params.data.marketValueLabel}`;
        }
      },
      series: [
        {
          type: "scatter",
          coordinateSystem: "geo",
          data,
          zlevel: 2,
          emphasis: {
            scale: 1.16
          },
          label: {
            show: true,
            position: "right",
            formatter: "{b}",
            color: "#374151",
            fontSize: 11
          }
        }
      ]
    };
  }, [shown, min, max, hoveredCountryId, selectedRegion, currency]);

  if (!mapReady) {
    return (
      <div className="relative flex h-[clamp(420px,58vh,680px)] items-center justify-center overflow-hidden rounded-lg border border-dashboard-line bg-dashboard-page text-sm text-dashboard-sub">
        正在加载全球市场地图...
      </div>
    );
  }

  return (
    <div className="relative h-[clamp(420px,58vh,680px)] overflow-hidden rounded-lg border border-dashboard-line bg-dashboard-page">
      <ReactECharts
        key={`${WORLD_MAP_NAME}-${selectedRegion}`}
        option={option}
        notMerge
        style={{ height: "100%" }}
        onEvents={{
          mouseover: (params: { data?: { countryId?: string } }) => onHoverCountry(params.data?.countryId ?? null),
          mouseout: () => onHoverCountry(null),
          click: (params: { data?: { countryId?: string } }) => {
            const countryId = params.data?.countryId;
            if (countryId) {
              onSelectCountry(countryId);
              router.push(`/country/${countryId}`);
            }
          }
        }}
      />
    </div>
  );
}

"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { CustomerCountrySummary, MapCountry } from "@/types/dashboard";

const ReactECharts = dynamic(() => import("echarts-for-react"), { ssr: false });
const EUROPE_MAP_NAME = "dashboard-europe-real-20260708";
const EUROPE_MAP_URL = "/maps/europe-real.geo.json?v=20260708";
let europeMapRegistered = false;
type RegisterMapSource = Parameters<typeof import("echarts").registerMap>[1];

interface MarketMapProps {
  countries: MapCountry[];
  hoveredCountryId: string | null;
  customerSummaries: CustomerCountrySummary[];
  onHoverCountry: (countryId: string | null) => void;
  onSelectCountry: (countryId: string) => void;
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

export function MarketMap({ countries, hoveredCountryId, onHoverCountry, onSelectCountry }: MarketMapProps) {
  const router = useRouter();
  const [mapReady, setMapReady] = useState(false);
  const shown = countries.filter((country) => country["是否展示"] === "是");
  const values = shown.map((country) => country["最终加权校准后线下市场价值"] ?? 0);
  const min = Math.min(...values);
  const max = Math.max(...values);

  useEffect(() => {
    let cancelled = false;

    async function loadEuropeMap() {
      const response = await fetch(EUROPE_MAP_URL, { cache: "no-store" });
      if (!response.ok) {
        throw new Error("Failed to load Europe map");
      }
      const geoJson = await response.json();
      const echarts = await import("echarts");
      if (!europeMapRegistered) {
        echarts.registerMap(EUROPE_MAP_NAME, geoJson as RegisterMapSource);
        europeMapRegistered = true;
      }
      if (!cancelled) {
        setMapReady(true);
      }
    }

    loadEuropeMap().catch((error) => {
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
    const data = shown.map((country) => {
      const value = country["最终加权校准后线下市场价值"] ?? 0;
      const size = 14 + Math.sqrt(value / Math.max(max, 1)) * 54;
      const isHovered = hoveredCountryId === country.country_id;
      const borderType = country["气泡边框样式"] === "虚线" ? "dashed" : "solid";
      return {
        name: country["国家/区域中文名"],
        value: [country["经度"], country["纬度"], value],
        countryId: country.country_id,
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
        map: EUROPE_MAP_NAME,
        roam: false,
        silent: true,
        boundingCoords: [
          [-25, 34],
          [45, 72]
        ],
        layoutCenter: ["50%", "52%"],
        layoutSize: "106%",
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
        formatter: (params: { data: { name: string; value: [number, number, number] } }) =>
          `${params.data.name}<br/>Offline market value: €${Math.round(params.data.value[2]).toLocaleString()}`
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
  }, [shown, min, max, hoveredCountryId]);

  if (!mapReady) {
    return (
      <div className="relative flex h-full min-h-[620px] items-center justify-center overflow-hidden rounded-lg border border-dashboard-line bg-dashboard-page text-sm text-dashboard-sub">
        正在加载欧洲地图...
      </div>
    );
  }

  return (
    <div className="relative h-full min-h-[620px] overflow-hidden rounded-lg border border-dashboard-line bg-dashboard-page">
      <ReactECharts
        key={EUROPE_MAP_NAME}
        option={option}
        notMerge
        style={{ height: "100%", minHeight: 620 }}
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

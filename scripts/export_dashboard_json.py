from __future__ import annotations

import json
from pathlib import Path
from typing import Any

import pandas as pd


ROOT = Path(__file__).resolve().parents[1]
DATA_SOURCE = ROOT.parent / "pool_dashboard_data_source"
PRIMARY_XLSX = DATA_SOURCE / "pool_dashboard_data_source.xlsx"
CUSTOMER_XLSX = DATA_SOURCE / "pool_dashboard_customer_detail_source.xlsx"
OUTPUT_DIR = ROOT / "public" / "data"

EXPORTS = [
    (PRIMARY_XLSX, "地图看板_国家主表", "map_countries.json"),
    (PRIMARY_XLSX, "地图看板_情景区间表", "scenario_ranges.json"),
    (PRIMARY_XLSX, "地图看板_参数说明表", "parameter_notes.json"),
    (PRIMARY_XLSX, "地图看板_国家别名表", "country_aliases.json"),
    (CUSTOMER_XLSX, "客户看板_国家汇总表", "customer_country_summary.json"),
    (CUSTOMER_XLSX, "客户看板_客户清单表", "customer_list.json"),
]


def clean_value(value: Any) -> Any:
    if pd.isna(value):
        return None
    if isinstance(value, (pd.Timestamp,)):
        return value.isoformat()
    if isinstance(value, float):
        return float(value)
    if isinstance(value, int):
        return int(value)
    if isinstance(value, bool):
        return bool(value)
    return value


def dataframe_to_records(df: pd.DataFrame) -> list[dict[str, Any]]:
    records: list[dict[str, Any]] = []
    for row in df.to_dict(orient="records"):
        records.append({str(key): clean_value(value) for key, value in row.items()})
    return records


def export_sheet(xlsx: Path, sheet_name: str, filename: str) -> int:
    if not xlsx.exists():
        raise FileNotFoundError(f"Missing source workbook: {xlsx}")
    df = pd.read_excel(xlsx, sheet_name=sheet_name)
    records = dataframe_to_records(df)
    path = OUTPUT_DIR / filename
    path.write_text(json.dumps(records, ensure_ascii=False, indent=2), encoding="utf-8")
    return len(records)


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    for xlsx, sheet, filename in EXPORTS:
        count = export_sheet(xlsx, sheet, filename)
        print(f"{filename}: {count} rows")


if __name__ == "__main__":
    main()

# Pool Dashboard Web

泳池清洁机器人线下市场机会地图看板第一版前端项目。

本项目只负责前端页面和数据读取层，不修改 Excel 数据源、不重新计算模型、不接数据库。

## 安装依赖

```bash
npm install
```

## 从 Excel 导出 JSON

```bash
npm run export:data
```

导出脚本读取：

- `../pool_dashboard_data_source/pool_dashboard_data_source.xlsx`
- `../pool_dashboard_data_source/pool_dashboard_customer_detail_source.xlsx`

并生成：

- `public/data/map_countries.json`
- `public/data/scenario_ranges.json`
- `public/data/parameter_notes.json`
- `public/data/country_aliases.json`
- `public/data/customer_country_summary.json`
- `public/data/customer_list.json`

Excel 是维护源，前端运行时只读取 JSON。后续更新数据时，先更新 Excel，再运行 `npm run export:data`。

## 本地开发

```bash
npm run dev
```

首页路径：

```text
/
```

二级客户页路径：

```text
/country/[countryId]
```

一级页面和二级页面通过 `country_id` 关联：

```text
一级地图气泡 country_id → 二级客户汇总表 country_id → 二级客户清单表 country_id
```

## 货币展示

数据源中的所有市场价值基础单位为 EUR。货币切换只影响页面展示，不影响模型数据、气泡大小、气泡颜色或排序。

展示层汇率配置位于 `src/lib/currency.ts`，也可用环境变量覆盖：

```text
NEXT_PUBLIC_RATE_EUR
NEXT_PUBLIC_RATE_USD
NEXT_PUBLIC_RATE_CNY
```

## 轻量密码保护

如需开启访问密码，设置：

```text
NEXT_PUBLIC_DASHBOARD_PASSWORD=your-password
```

不设置该环境变量即关闭密码保护。

## 部署到 Vercel

1. 确认已经运行 `npm run export:data`
2. 推送 `pool_dashboard_web` 项目到代码仓库
3. 在 Vercel 中选择该目录作为项目根目录
4. 设置需要的 `NEXT_PUBLIC_*` 展示层环境变量
5. 使用默认 Next.js 构建命令部署

## 外部展示版本提交前检查

当前展示版本依赖以下静态文件，上传 GitHub 前需确认它们已提交：

- `public/data/*.json`
- `public/maps/world-countries.geo.json`
- `src/app/page.tsx`
- `src/components/dashboard/*.tsx`
- `src/types/dashboard.ts`

不要提交以下本地文件或目录：

- `.next/`
- `node_modules/`
- `.env*`
- `.vercel/`
- `.DS_Store`

Vercel 推荐设置：

- Framework Preset: `Next.js`
- Build Command: `npm run build`
- Install Command: `npm install`
- Output Directory: 使用默认值

如果需要外部访问密码，在 Vercel 环境变量中设置 `NEXT_PUBLIC_DASHBOARD_PASSWORD`；不设置则公开访问。

## 后续新增国家或客户数据流程

1. 更新 `pool_dashboard_data_source` 下的 Excel 数据源
2. 运行一级/二级数据源构建脚本
3. 回到本项目运行 `npm run export:data`
4. 前端自动读取新的 JSON，不需要在页面代码里写死国家、客户名单或 ready 状态

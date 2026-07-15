export type CurrencyCode = "EUR" | "USD" | "CNY";
export type SourceCurrencyCode = "EUR" | "USD";

export interface MapCountry {
  country_id: string;
  "国家/区域中文名": string;
  "国家/区域英文名": string;
  ISO2: string | null;
  ISO3: string | null;
  "区域大区": string;
  "是否区域合并项": string;
  "经度": number;
  "纬度": number;
  "最终加权校准后线下市场价值": number;
  base_currency: "EUR";
  source_currency: SourceCurrencyCode;
  "最终加权校准后线下市场价值_source_currency": number;
  fx_to_eur: number;
  "泳池保有总量": number | null;
  "年新增泳池": number | null;
  "泳池基数属性": "住宅家庭泳池" | "公共泳池" | "商业泳池" | "混合";
  "市场类型": string;
  "数据口径类型": string;
  "气泡边框样式": "实线" | "虚线";
  "是否展示": string;
}

export interface ScenarioRange {
  country_id: string;
  "国家/区域中文名": string;
  "情景": "保守" | "基准" | "乐观";
  "底层模型零售市场价值": number;
  "第三方口径调整后市场值": number | null;
  "模型权重": number;
  "第三方权重": number;
  "加权校准后零售市场价值": number;
  "线下渠道占比": number;
  "加权校准后线下市场价值": number;
  base_currency: "EUR";
  source_currency: SourceCurrencyCode;
  "加权校准后线下市场价值_source_currency": number;
  fx_to_eur: number;
  "区间口径说明": string;
}

export interface ParameterNote {
  "参数名称": string;
  "参数解释": string;
  "保守值": string;
  "基准值": string;
  "乐观值": string;
  "影响方向": string;
  "是否展示": string;
  "展示排序": number;
}

export interface CountryAlias {
  country_id: string;
  "中文名": string;
  "英文名": string;
  ISO2: string | null;
  ISO3: string | null;
  "常用别名": string;
  "区域大区": string;
  "是否区域合并项": string;
}

export interface CustomerCountrySummary {
  country_id: string;
  "国家/区域中文名": string;
  "国家/区域英文名": string;
  detail_page_status: "ready" | "data_incomplete";
  "已识别B端客户数": number;
  "高价值渠道目标数": number;
  "销售渠道数": number;
  "服务渠道数": number;
  "直接使用客户数": number;
  "扩展客户池规模": number;
  "扩展客户池已验证数": number;
  "数据覆盖说明": string;
}

export interface CustomerLead {
  country_id: string;
  "国家/区域中文名": string;
  company_id: string;
  "公司名称": string;
  "官网": string | null;
  "城市/地区": string | null;
  "客户类型": string | null;
  "渠道角色": string | null;
  "价值标签": string | null;
  "提及品牌": string | null;
  "置信度": number;
  "验证状态": string | null;
  "是否展示": boolean;
  "展示排序": number;
}

export interface DashboardData {
  countries: MapCountry[];
  scenarios: ScenarioRange[];
  parameters: ParameterNote[];
  aliases: CountryAlias[];
  customerSummaries: CustomerCountrySummary[];
  customers: CustomerLead[];
}

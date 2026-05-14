// ============================================================
// 数据看板 - Mock 数据
// ============================================================

// ---- 7 天趋势数据 ----

export interface TrendDataPoint {
  date: string;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  cpa: number;
  roi: number;
}

export const mockTrendData: TrendDataPoint[] = [
  {
    date: '2026-05-02',
    spend: 98500,
    impressions: 2450000,
    clicks: 78400,
    conversions: 3200,
    cpa: 30.78,
    roi: 2.85,
  },
  {
    date: '2026-05-03',
    spend: 112300,
    impressions: 2780000,
    clicks: 89100,
    conversions: 3650,
    cpa: 30.77,
    roi: 2.92,
  },
  {
    date: '2026-05-04',
    spend: 105800,
    impressions: 2610000,
    clicks: 83500,
    conversions: 3420,
    cpa: 30.94,
    roi: 2.78,
  },
  {
    date: '2026-05-05',
    spend: 128563,
    impressions: 3120000,
    clicks: 99800,
    conversions: 4100,
    cpa: 31.36,
    roi: 3.05,
  },
  {
    date: '2026-05-06',
    spend: 134200,
    impressions: 3280000,
    clicks: 105000,
    conversions: 4350,
    cpa: 30.85,
    roi: 3.12,
  },
  {
    date: '2026-05-07',
    spend: 142800,
    impressions: 3450000,
    clicks: 110400,
    conversions: 4620,
    cpa: 30.91,
    roi: 3.08,
  },
  {
    date: '2026-05-08',
    spend: 156700,
    impressions: 3780000,
    clicks: 121000,
    conversions: 5100,
    cpa: 30.73,
    roi: 3.21,
  },
];

// ---- 账户花费占比 ----

export interface AccountSpendData {
  name: string;
  value: number;
  advertiserId: string;
}

export const mockAccountSpendData: AccountSpendData[] = [
  { name: '品牌投放账户-主', value: 45678, advertiserId: '100001' },
  { name: '效果投放账户-A', value: 52345, advertiserId: '100002' },
  { name: '效果投放账户-B', value: 12345, advertiserId: '100003' },
  { name: '电商投放账户', value: 34567, advertiserId: '100004' },
  { name: '游戏投放账户', value: 0, advertiserId: '100005' },
  { name: '教育投放账户', value: 11765, advertiserId: '100006' },
];

// ---- Top 10 优质广告计划 ----

export interface TopPlan {
  key: string;
  rank: number;
  planId: string;
  name: string;
  accountName: string;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  cpa: number;
  ctr: number;
  roi: number;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
}

export const mockTopPlans: TopPlan[] = [
  {
    key: '1',
    rank: 1,
    planId: 'AD-20260502-001',
    name: '效果转化-搜索-核心词',
    accountName: '效果投放账户-A',
    spend: 28901,
    impressions: 567000,
    clicks: 20400,
    conversions: 1234,
    cpa: 23.42,
    ctr: 3.67,
    roi: 3.85,
    trend: 'up',
    trendValue: 15.3,
  },
  {
    key: '2',
    planId: 'AD-20260503-001',
    name: '电商大促-全渠道-主推',
    accountName: '电商投放账户',
    rank: 2,
    spend: 56789,
    impressions: 1230000,
    clicks: 42400,
    conversions: 2345,
    cpa: 24.22,
    ctr: 3.45,
    roi: 3.62,
    trend: 'up',
    trendValue: 12.8,
  },
  {
    key: '3',
    planId: 'AD-20260502-003',
    name: '效果转化-信息流-通投',
    accountName: '效果投放账户-A',
    rank: 3,
    spend: 34567,
    impressions: 890000,
    clicks: 21800,
    conversions: 1567,
    cpa: 22.06,
    ctr: 2.45,
    roi: 3.55,
    trend: 'up',
    trendValue: 8.7,
  },
  {
    key: '4',
    planId: 'AD-20260501-002',
    name: '品牌曝光-信息流-周末加码',
    accountName: '品牌投放账户-主',
    rank: 4,
    spend: 22346,
    impressions: 678000,
    clicks: 21150,
    conversions: 891,
    cpa: 25.08,
    ctr: 3.12,
    roi: 3.42,
    trend: 'up',
    trendValue: 6.2,
  },
  {
    key: '5',
    planId: 'AD-20260503-002',
    name: '电商大促-全渠道-长尾',
    accountName: '电商投放账户',
    rank: 5,
    spend: 23457,
    impressions: 567000,
    clicks: 15140,
    conversions: 890,
    cpa: 26.36,
    ctr: 2.67,
    roi: 3.35,
    trend: 'stable',
    trendValue: 2.1,
  },
  {
    key: '6',
    planId: 'AD-20260503-003',
    name: '电商拉新-信息流-新客',
    accountName: '电商投放账户',
    rank: 6,
    spend: 19877,
    impressions: 456000,
    clicks: 9670,
    conversions: 678,
    cpa: 29.32,
    ctr: 2.12,
    roi: 3.18,
    trend: 'down',
    trendValue: -3.5,
  },
  {
    key: '7',
    planId: 'AD-20260501-001',
    name: '品牌曝光-信息流-常规投放',
    accountName: '品牌投放账户-主',
    rank: 7,
    spend: 18563,
    impressions: 423000,
    clicks: 9900,
    conversions: 567,
    cpa: 32.74,
    ctr: 2.34,
    roi: 2.95,
    trend: 'down',
    trendValue: -1.8,
  },
  {
    key: '8',
    planId: 'AD-20260505-003',
    name: '教育试听-信息流-体验课',
    accountName: '教育投放账户',
    rank: 8,
    spend: 18765,
    impressions: 378000,
    clicks: 8430,
    conversions: 456,
    cpa: 41.15,
    ctr: 2.23,
    roi: 2.68,
    trend: 'up',
    trendValue: 4.5,
  },
  {
    key: '9',
    planId: 'AD-20260502-002',
    name: '效果转化-搜索-竞品词',
    accountName: '效果投放账户-A',
    rank: 9,
    spend: 21568,
    impressions: 445000,
    clicks: 12860,
    conversions: 789,
    cpa: 27.33,
    ctr: 2.89,
    roi: 2.55,
    trend: 'down',
    trendValue: -5.2,
  },
  {
    key: '10',
    planId: 'AD-20260505-001',
    name: '教育课程-精准定向-高意向',
    accountName: '教育投放账户',
    rank: 10,
    spend: 15679,
    impressions: 289000,
    clicks: 4510,
    conversions: 234,
    cpa: 67.0,
    ctr: 1.56,
    roi: 2.32,
    trend: 'stable',
    trendValue: 0.8,
  },
];

// ---- 核心指标环比 ----

export interface KpiMetric {
  title: string;
  value: number;
  unit?: string;
  prefix?: string;
  changePercent: number; // 环比涨跌幅
  changeAbsolute: number; // 绝对变化值
}

export const mockKpiMetrics: KpiMetric[] = [
  {
    title: '总消耗',
    value: 156700,
    unit: '元',
    prefix: '¥',
    changePercent: 9.73,
    changeAbsolute: 13900,
  },
  {
    title: '总曝光',
    value: 3780000,
    unit: '次',
    changePercent: 9.57,
    changeAbsolute: 330000,
  },
  {
    title: '总转化数',
    value: 5100,
    unit: '个',
    changePercent: 10.39,
    changeAbsolute: 480,
  },
  {
    title: '整体 ROI',
    value: 3.21,
    changePercent: 4.22,
    changeAbsolute: 0.13,
  },
];

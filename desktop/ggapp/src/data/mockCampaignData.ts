// ============================================================
// 组织架构树节点类型
// ============================================================

export type TreeNodeType = 'organization' | 'app' | 'account' | 'campaign' | 'project' | 'adUnit';

export interface OrganizationTreeNode {
  key: string;
  title: string;
  type: TreeNodeType;
  children?: OrganizationTreeNode[];
  // app 级别字段
  appId?: string;
  // 账户级别字段
  advertiserId?: string;
  balance?: number;
  // 广告组级别字段
  campaignId?: string;
  status?: 'active' | 'paused' | 'disabled';
  // 项目级别字段
  projectId?: string;
  // 单元级别字段
  adUnitId?: string;
}

// ============================================================
// 广告计划（Ad）类型
// ============================================================

export type AdStatus = 'running' | 'paused' | 'disabled' | 'pending_review';

export interface AdPlan {
  key: string;
  planId: string;
  name: string;
  accountId: string;
  accountName: string;
  campaignId: string;
  campaignName: string;
  adUnitId?: string;
  status: AdStatus;
  dailyBudget: number;
  spent: number;
  conversions: number;
  cpa: number;
  ctr: number;
  cpm: number;
  ocpm?: number;
}

// ============================================================
// Mock 数据
// ============================================================

export const mockOrgTree: OrganizationTreeNode[] = [
  {
    key: 'org_001',
    title: 'XX科技有限公司（总部）',
    type: 'organization',
    children: [
      {
        key: 'app_001',
        title: '品牌投放App',
        type: 'app',
        appId: 'APP-001',
        children: [
          {
            key: 'acc_001',
            title: '品牌投放账户-主',
            type: 'account',
            advertiserId: '100001',
            balance: 50000,
            children: [
              {
                key: 'camp_001',
                title: '品牌曝光-信息流',
                type: 'campaign',
                campaignId: 'C001',
                status: 'active',
                children: [
                  {
                    key: 'proj_001',
                    title: '品牌曝光项目-Q2',
                    type: 'project',
                    projectId: 'P001',
                    children: [
                      {
                        key: 'unit_001',
                        title: '信息流单元-常规',
                        type: 'adUnit',
                        adUnitId: 'U001',
                        status: 'active',
                      },
                      {
                        key: 'unit_002',
                        title: '信息流单元-周末',
                        type: 'adUnit',
                        adUnitId: 'U002',
                        status: 'active',
                      },
                    ],
                  },
                ],
              },
              {
                key: 'camp_002',
                title: '品牌认知-开屏',
                type: 'campaign',
                campaignId: 'C002',
                status: 'active',
                children: [
                  {
                    key: 'proj_002',
                    title: '品牌认知项目-品牌词',
                    type: 'project',
                    projectId: 'P002',
                    children: [
                      {
                        key: 'unit_003',
                        title: '开屏单元-品牌词',
                        type: 'adUnit',
                        adUnitId: 'U003',
                        status: 'active',
                      },
                    ],
                  },
                ],
              },
              {
                key: 'camp_003',
                title: '品牌搜索-品牌词',
                type: 'campaign',
                campaignId: 'C003',
                status: 'paused',
                children: [
                  {
                    key: 'proj_003',
                    title: '品牌搜索项目-保护',
                    type: 'project',
                    projectId: 'P003',
                    children: [
                      {
                        key: 'unit_004',
                        title: '搜索单元-保护',
                        type: 'adUnit',
                        adUnitId: 'U004',
                        status: 'paused',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        key: 'app_002',
        title: '效果投放App',
        type: 'app',
        appId: 'APP-002',
        children: [
          {
            key: 'acc_002',
            title: '效果投放账户-A',
            type: 'account',
            advertiserId: '100002',
            balance: 30000,
            children: [
              {
                key: 'camp_004',
                title: '效果转化-搜索',
                type: 'campaign',
                campaignId: 'C004',
                status: 'active',
                children: [
                  {
                    key: 'proj_004',
                    title: '效果转化项目-核心词',
                    type: 'project',
                    projectId: 'P004',
                    children: [
                      {
                        key: 'unit_005',
                        title: '搜索单元-核心词',
                        type: 'adUnit',
                        adUnitId: 'U005',
                        status: 'active',
                      },
                      {
                        key: 'unit_006',
                        title: '搜索单元-竞品词',
                        type: 'adUnit',
                        adUnitId: 'U006',
                        status: 'active',
                      },
                    ],
                  },
                ],
              },
              {
                key: 'camp_005',
                title: '效果转化-信息流',
                type: 'campaign',
                campaignId: 'C005',
                status: 'active',
                children: [
                  {
                    key: 'proj_005',
                    title: '效果转化项目-信息流',
                    type: 'project',
                    projectId: 'P005',
                    children: [
                      {
                        key: 'unit_007',
                        title: '信息流单元-通投',
                        type: 'adUnit',
                        adUnitId: 'U007',
                        status: 'active',
                      },
                      {
                        key: 'unit_008',
                        title: '信息流单元-定向',
                        type: 'adUnit',
                        adUnitId: 'U008',
                        status: 'paused',
                      },
                    ],
                  },
                ],
              },
              {
                key: 'camp_006',
                title: '效果转化-展示',
                type: 'campaign',
                campaignId: 'C006',
                status: 'disabled',
                children: [
                  {
                    key: 'proj_006',
                    title: '效果转化项目-展示',
                    type: 'project',
                    projectId: 'P006',
                    children: [
                      {
                        key: 'unit_009',
                        title: '展示单元-重定向',
                        type: 'adUnit',
                        adUnitId: 'U009',
                        status: 'disabled',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        key: 'app_003',
        title: '电商投放App',
        type: 'app',
        appId: 'APP-003',
        children: [
          {
            key: 'acc_003',
            title: '电商投放账户',
            type: 'account',
            advertiserId: '100004',
            balance: 80000,
            children: [
              {
                key: 'camp_007',
                title: '电商大促-全渠道',
                type: 'campaign',
                campaignId: 'C007',
                status: 'active',
                children: [
                  {
                    key: 'proj_007',
                    title: '电商大促项目-主推',
                    type: 'project',
                    projectId: 'P007',
                    children: [
                      {
                        key: 'unit_010',
                        title: '全渠道单元-主推',
                        type: 'adUnit',
                        adUnitId: 'U010',
                        status: 'active',
                      },
                      {
                        key: 'unit_011',
                        title: '全渠道单元-长尾',
                        type: 'adUnit',
                        adUnitId: 'U011',
                        status: 'active',
                      },
                    ],
                  },
                ],
              },
              {
                key: 'camp_008',
                title: '电商拉新-信息流',
                type: 'campaign',
                campaignId: 'C008',
                status: 'active',
                children: [
                  {
                    key: 'proj_008',
                    title: '电商拉新项目-新客',
                    type: 'project',
                    projectId: 'P008',
                    children: [
                      {
                        key: 'unit_012',
                        title: '信息流单元-新客',
                        type: 'adUnit',
                        adUnitId: 'U012',
                        status: 'active',
                      },
                    ],
                  },
                ],
              },
              {
                key: 'camp_009',
                title: '电商召回-搜索',
                type: 'campaign',
                campaignId: 'C009',
                status: 'paused',
                children: [
                  {
                    key: 'proj_009',
                    title: '电商召回项目-老客',
                    type: 'project',
                    projectId: 'P009',
                    children: [
                      {
                        key: 'unit_013',
                        title: '搜索单元-老客',
                        type: 'adUnit',
                        adUnitId: 'U013',
                        status: 'paused',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        key: 'app_004',
        title: '游戏投放App',
        type: 'app',
        appId: 'APP-004',
        children: [
          {
            key: 'acc_004',
            title: '游戏投放账户',
            type: 'account',
            advertiserId: '100005',
            balance: 0,
            children: [
              {
                key: 'camp_010',
                title: '游戏上线-预热',
                type: 'campaign',
                campaignId: 'C010',
                status: 'disabled',
                children: [
                  {
                    key: 'proj_010',
                    title: '游戏上线项目-预热',
                    type: 'project',
                    projectId: 'P010',
                    children: [
                      {
                        key: 'unit_014',
                        title: '预热单元-悬念',
                        type: 'adUnit',
                        adUnitId: 'U014',
                        status: 'disabled',
                      },
                    ],
                  },
                ],
              },
              {
                key: 'camp_011',
                title: '游戏拉新-信息流',
                type: 'campaign',
                campaignId: 'C011',
                status: 'disabled',
                children: [
                  {
                    key: 'proj_011',
                    title: '游戏拉新项目-预约',
                    type: 'project',
                    projectId: 'P011',
                    children: [
                      {
                        key: 'unit_015',
                        title: '信息流单元-预约',
                        type: 'adUnit',
                        adUnitId: 'U015',
                        status: 'disabled',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        key: 'app_005',
        title: '教育投放App',
        type: 'app',
        appId: 'APP-005',
        children: [
          {
            key: 'acc_005',
            title: '教育投放账户',
            type: 'account',
            advertiserId: '100006',
            balance: 45000,
            children: [
              {
                key: 'camp_012',
                title: '教育课程-精准定向',
                type: 'campaign',
                campaignId: 'C012',
                status: 'active',
                children: [
                  {
                    key: 'proj_012',
                    title: '教育课程项目-高意向',
                    type: 'project',
                    projectId: 'P012',
                    children: [
                      {
                        key: 'unit_016',
                        title: '精准定向单元-高意向',
                        type: 'adUnit',
                        adUnitId: 'U016',
                        status: 'active',
                      },
                      {
                        key: 'unit_017',
                        title: '精准定向单元-中意向',
                        type: 'adUnit',
                        adUnitId: 'U017',
                        status: 'active',
                      },
                    ],
                  },
                ],
              },
              {
                key: 'camp_013',
                title: '教育试听-信息流',
                type: 'campaign',
                campaignId: 'C013',
                status: 'active',
                children: [
                  {
                    key: 'proj_013',
                    title: '教育试听项目-体验课',
                    type: 'project',
                    projectId: 'P013',
                    children: [
                      {
                        key: 'unit_018',
                        title: '信息流单元-体验课',
                        type: 'adUnit',
                        adUnitId: 'U018',
                        status: 'active',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

export const mockAdPlans: AdPlan[] = [
  {
    key: 'ad_001',
    planId: 'AD-20260501-001',
    name: '品牌曝光-信息流-常规投放',
    accountId: 'acc_001',
    accountName: '品牌投放账户-主',
    campaignId: 'camp_001',
    campaignName: '品牌曝光-信息流',
    adUnitId: 'unit_001',
    status: 'running',
    dailyBudget: 3000,
    spent: 18563.42,
    conversions: 567,
    cpa: 32.74,
    ctr: 2.34,
    cpm: 45.6,
    ocpm: 48.5,
  },
  {
    key: 'ad_002',
    planId: 'AD-20260501-002',
    name: '品牌曝光-信息流-周末加码',
    accountId: 'acc_001',
    accountName: '品牌投放账户-主',
    campaignId: 'camp_001',
    campaignName: '品牌曝光-信息流',
    adUnitId: 'unit_002',
    status: 'running',
    dailyBudget: 5000,
    spent: 22345.67,
    conversions: 891,
    cpa: 25.08,
    ctr: 3.12,
    cpm: 52.3,
    ocpm: 55.2,
  },
  {
    key: 'ad_003',
    planId: 'AD-20260501-003',
    name: '品牌认知-开屏-品牌词',
    accountId: 'acc_001',
    accountName: '品牌投放账户-主',
    campaignId: 'camp_002',
    campaignName: '品牌认知-开屏',
    adUnitId: 'unit_003',
    status: 'running',
    dailyBudget: 2000,
    spent: 12345.78,
    conversions: 234,
    cpa: 52.76,
    ctr: 1.89,
    cpm: 68.9,
    ocpm: 72.1,
  },
  {
    key: 'ad_004',
    planId: 'AD-20260501-004',
    name: '品牌搜索-品牌词-保护',
    accountId: 'acc_001',
    accountName: '品牌投放账户-主',
    campaignId: 'camp_003',
    campaignName: '品牌搜索-品牌词',
    adUnitId: 'unit_004',
    status: 'paused',
    dailyBudget: 1000,
    spent: 8765.43,
    conversions: 156,
    cpa: 56.19,
    ctr: 4.56,
    cpm: 32.1,
    ocpm: 35.8,
  },
  {
    key: 'ad_005',
    planId: 'AD-20260502-001',
    name: '效果转化-搜索-核心词',
    accountId: 'acc_002',
    accountName: '效果投放账户-A',
    campaignId: 'camp_004',
    campaignName: '效果转化-搜索',
    adUnitId: 'unit_005',
    status: 'running',
    dailyBudget: 4000,
    spent: 28901.23,
    conversions: 1234,
    cpa: 23.42,
    ctr: 3.67,
    cpm: 41.2,
    ocpm: 44.6,
  },
  {
    key: 'ad_006',
    planId: 'AD-20260502-002',
    name: '效果转化-搜索-竞品词',
    accountId: 'acc_002',
    accountName: '效果投放账户-A',
    campaignId: 'camp_004',
    campaignName: '效果转化-搜索',
    adUnitId: 'unit_006',
    status: 'running',
    dailyBudget: 3500,
    spent: 21567.89,
    conversions: 789,
    cpa: 27.33,
    ctr: 2.89,
    cpm: 55.8,
    ocpm: 58.9,
  },
  {
    key: 'ad_007',
    planId: 'AD-20260502-003',
    name: '效果转化-信息流-通投',
    accountId: 'acc_002',
    accountName: '效果投放账户-A',
    campaignId: 'camp_005',
    campaignName: '效果转化-信息流',
    adUnitId: 'unit_007',
    status: 'running',
    dailyBudget: 6000,
    spent: 34567.12,
    conversions: 1567,
    cpa: 22.06,
    ctr: 2.45,
    cpm: 38.7,
    ocpm: 42.1,
  },
  {
    key: 'ad_008',
    planId: 'AD-20260502-004',
    name: '效果转化-信息流-定向',
    accountId: 'acc_002',
    accountName: '效果投放账户-A',
    campaignId: 'camp_005',
    campaignName: '效果转化-信息流',
    adUnitId: 'unit_008',
    status: 'paused',
    dailyBudget: 2500,
    spent: 15678.9,
    conversions: 456,
    cpa: 34.38,
    ctr: 1.98,
    cpm: 42.5,
    ocpm: 45.8,
  },
  {
    key: 'ad_009',
    planId: 'AD-20260502-005',
    name: '效果转化-展示-重定向',
    accountId: 'acc_002',
    accountName: '效果投放账户-A',
    campaignId: 'camp_006',
    campaignName: '效果转化-展示',
    adUnitId: 'unit_009',
    status: 'disabled',
    dailyBudget: 1500,
    spent: 6789.34,
    conversions: 123,
    cpa: 55.2,
    ctr: 1.23,
    cpm: 28.9,
    ocpm: 31.5,
  },
  {
    key: 'ad_010',
    planId: 'AD-20260503-001',
    name: '电商大促-全渠道-主推',
    accountId: 'acc_003',
    accountName: '电商投放账户',
    campaignId: 'camp_007',
    campaignName: '电商大促-全渠道',
    adUnitId: 'unit_010',
    status: 'running',
    dailyBudget: 10000,
    spent: 56789.01,
    conversions: 2345,
    cpa: 24.22,
    ctr: 3.45,
    cpm: 48.6,
    ocpm: 52.3,
  },
  {
    key: 'ad_011',
    planId: 'AD-20260503-002',
    name: '电商大促-全渠道-长尾',
    accountId: 'acc_003',
    accountName: '电商投放账户',
    campaignId: 'camp_007',
    campaignName: '电商大促-全渠道',
    adUnitId: 'unit_011',
    status: 'running',
    dailyBudget: 5000,
    spent: 23456.78,
    conversions: 890,
    cpa: 26.36,
    ctr: 2.67,
    cpm: 35.4,
    ocpm: 38.7,
  },
  {
    key: 'ad_012',
    planId: 'AD-20260503-003',
    name: '电商拉新-信息流-新客',
    accountId: 'acc_003',
    accountName: '电商投放账户',
    campaignId: 'camp_008',
    campaignName: '电商拉新-信息流',
    adUnitId: 'unit_012',
    status: 'running',
    dailyBudget: 4500,
    spent: 19876.54,
    conversions: 678,
    cpa: 29.32,
    ctr: 2.12,
    cpm: 44.1,
    ocpm: 47.5,
  },
  {
    key: 'ad_013',
    planId: 'AD-20260503-004',
    name: '电商召回-搜索-老客',
    accountId: 'acc_003',
    accountName: '电商投放账户',
    campaignId: 'camp_009',
    campaignName: '电商召回-搜索',
    adUnitId: 'unit_013',
    status: 'paused',
    dailyBudget: 2000,
    spent: 8765.43,
    conversions: 345,
    cpa: 25.41,
    ctr: 3.89,
    cpm: 30.2,
    ocpm: 33.4,
  },
  {
    key: 'ad_014',
    planId: 'AD-20260504-001',
    name: '游戏上线-预热-悬念',
    accountId: 'acc_004',
    accountName: '游戏投放账户',
    campaignId: 'camp_010',
    campaignName: '游戏上线-预热',
    adUnitId: 'unit_014',
    status: 'disabled',
    dailyBudget: 3000,
    spent: 0,
    conversions: 0,
    cpa: 0,
    ctr: 0,
    cpm: 0,
    ocpm: 0,
  },
  {
    key: 'ad_015',
    planId: 'AD-20260504-002',
    name: '游戏拉新-信息流-预约',
    accountId: 'acc_004',
    accountName: '游戏投放账户',
    campaignId: 'camp_011',
    campaignName: '游戏拉新-信息流',
    adUnitId: 'unit_015',
    status: 'disabled',
    dailyBudget: 2500,
    spent: 0,
    conversions: 0,
    cpa: 0,
    ctr: 0,
    cpm: 0,
    ocpm: 0,
  },
  {
    key: 'ad_016',
    planId: 'AD-20260505-001',
    name: '教育课程-精准定向-高意向',
    accountId: 'acc_005',
    accountName: '教育投放账户',
    campaignId: 'camp_012',
    campaignName: '教育课程-精准定向',
    adUnitId: 'unit_016',
    status: 'running',
    dailyBudget: 3500,
    spent: 15678.9,
    conversions: 234,
    cpa: 67.0,
    ctr: 1.56,
    cpm: 56.7,
    ocpm: 61.2,
  },
  {
    key: 'ad_017',
    planId: 'AD-20260505-002',
    name: '教育课程-精准定向-中意向',
    accountId: 'acc_005',
    accountName: '教育投放账户',
    campaignId: 'camp_012',
    campaignName: '教育课程-精准定向',
    adUnitId: 'unit_017',
    status: 'running',
    dailyBudget: 2000,
    spent: 8901.23,
    conversions: 123,
    cpa: 72.37,
    ctr: 1.34,
    cpm: 62.3,
    ocpm: 67.1,
  },
  {
    key: 'ad_018',
    planId: 'AD-20260505-003',
    name: '教育试听-信息流-体验课',
    accountId: 'acc_005',
    accountName: '教育投放账户',
    campaignId: 'camp_013',
    campaignName: '教育试听-信息流',
    adUnitId: 'unit_018',
    status: 'running',
    dailyBudget: 4000,
    spent: 18765.43,
    conversions: 456,
    cpa: 41.15,
    ctr: 2.23,
    cpm: 49.8,
    ocpm: 53.6,
  },
];

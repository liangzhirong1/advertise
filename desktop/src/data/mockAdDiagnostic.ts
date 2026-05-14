// ============================================================
// 单元诊断 - Mock 数据（项目维度，跨账户）
// ============================================================

export type DiagnosticConclusion =
  | 'learning_normal'
  | 'bid_insufficient'
  | 'creative_decay'
  | 'quality_low'
  | 'traffic_weak'
  | 'learning_stuck';

export type SuggestionPriority = 'high' | 'medium' | 'low';

export interface DiagnosticMetric {
  name: string;
  value: number;
  unit: string;
  industryAvg: number;
  comparison: 'above' | 'below' | 'equal';
  comparisonPercent: number;
}

export interface RadarDimension {
  name: string;
  value: number;
  industryAvg: number;
}

export interface DiagnosticSuggestion {
  id: string;
  title: string;
  description: string;
  priority: SuggestionPriority;
  action: string;
  actionLabel: string;
  estimatedImpact: string;
}

// ============================================================
// 广告单元（Ad Unit）- 每个项目在每个账户下有一个单元
// ============================================================

export interface AdUnit {
  adId: string;
  adName: string;
  accountId: string;
  accountName: string;
  campaignId: string;
  campaignName: string;
  status: 'running' | 'paused' | 'learning' | 'stuck';
  learningPhase: 'not_started' | 'in_progress' | 'completed' | 'stuck';
  learningPhaseProgress: number;
  conclusions: DiagnosticConclusion[];
  radarData: RadarDimension[];
  metrics: DiagnosticMetric[];
  suggestions: DiagnosticSuggestion[];
}

// ============================================================
// 项目（Project）- 包含多个跨账户的单元（1:1 关系）
// ============================================================

export interface DiagnosticProject {
  projectId: string;
  projectName: string;
  projectType: 'brand' | 'performance' | 'ecommerce' | 'game' | 'education';
  units: AdUnit[]; // 每个账户下一个单元，1:1 关系
  aggregatedMetrics: DiagnosticMetric[]; // 项目级聚合指标
  diagnosticTime: string;
}

// ============================================================
// 诊断结论映射
// ============================================================

export const CONCLUSION_CONFIG: Record<
  DiagnosticConclusion,
  { label: string; color: string; icon: string }
> = {
  learning_normal: { label: '学习期正常', color: 'green', icon: '✓' },
  bid_insufficient: { label: '出价竞争力不足', color: 'orange', icon: '!' },
  creative_decay: { label: '素材衰退', color: 'red', icon: '↓' },
  quality_low: { label: '落地页质量偏低', color: 'orange', icon: '!' },
  traffic_weak: { label: '流量竞争力弱', color: 'orange', icon: '!' },
  learning_stuck: { label: '学习期停滞', color: 'red', icon: '⚠' },
};

// ============================================================
// Mock 项目数据（跨账户）
// ============================================================

export const mockDiagnosticProjects: DiagnosticProject[] = [
  {
    projectId: 'proj_001',
    projectName: '618大促品牌曝光项目',
    projectType: 'brand',
    diagnosticTime: '2026-05-08 15:30:00',
    aggregatedMetrics: [
      { name: '预估 CTR', value: 2.67, unit: '%', industryAvg: 2.8, comparison: 'below', comparisonPercent: 4.6 },
      { name: '预估 CVR', value: 4.12, unit: '%', industryAvg: 3.8, comparison: 'above', comparisonPercent: 8.4 },
      { name: '今日消耗', value: 67890, unit: '元', industryAvg: 50000, comparison: 'above', comparisonPercent: 35.8 },
      { name: '转化成本', value: 29.85, unit: '元', industryAvg: 28.5, comparison: 'below', comparisonPercent: 4.7 },
    ],
    units: [
      {
        adId: 'AD-20260501-001',
        adName: '品牌曝光-信息流-常规投放',
        accountId: '100001',
        accountName: '品牌投放账户-主',
        campaignId: 'C001',
        campaignName: '品牌曝光-信息流',
        status: 'learning',
        learningPhase: 'in_progress',
        learningPhaseProgress: 65,
        conclusions: ['bid_insufficient', 'creative_decay'],
        radarData: [
          { name: '出价竞争力', value: 58, industryAvg: 75 },
          { name: '素材吸引力', value: 72, industryAvg: 80 },
          { name: '落地页质量', value: 85, industryAvg: 78 },
          { name: '定向精准度', value: 63, industryAvg: 70 },
          { name: '历史转化表现', value: 70, industryAvg: 72 },
        ],
        metrics: [
          { name: '预估 CTR', value: 2.34, unit: '%', industryAvg: 2.8, comparison: 'below', comparisonPercent: 16.4 },
          { name: '预估 CVR', value: 4.56, unit: '%', industryAvg: 3.8, comparison: 'above', comparisonPercent: 20.0 },
          { name: '今日消耗', value: 18563, unit: '元', industryAvg: 15000, comparison: 'above', comparisonPercent: 23.8 },
          { name: '转化成本', value: 32.74, unit: '元', industryAvg: 28.5, comparison: 'below', comparisonPercent: 14.9 },
        ],
        suggestions: [
          {
            id: 'sug_001',
            title: '建议提高出价至 35 元',
            description: '当前出价竞争力处于行业后 30%，建议将目标出价从 30 元提高至 35 元，提升竞价胜率约 15%。',
            priority: 'high',
            action: 'update_bid',
            actionLabel: '一键提价',
            estimatedImpact: '预计提升曝光量 15-20%',
          },
          {
            id: 'sug_002',
            title: '建议更换视频素材',
            description: '当前素材已投放 12 天，CTR 从 3.2% 下降至 2.3%，出现明显衰退。建议更换为"产品功能演示-15s"素材。',
            priority: 'high',
            action: 'replace_creative',
            actionLabel: '更换素材',
            estimatedImpact: '预计 CTR 提升至 3.0%+',
          },
        ],
      },
      {
        adId: 'AD-20260502-001',
        adName: '品牌曝光-信息流-效果投放',
        accountId: '100002',
        accountName: '效果投放账户-A',
        campaignId: 'C004',
        campaignName: '效果转化-搜索',
        status: 'running',
        learningPhase: 'completed',
        learningPhaseProgress: 100,
        conclusions: ['learning_normal'],
        radarData: [
          { name: '出价竞争力', value: 78, industryAvg: 75 },
          { name: '素材吸引力', value: 82, industryAvg: 80 },
          { name: '落地页质量', value: 76, industryAvg: 78 },
          { name: '定向精准度', value: 71, industryAvg: 70 },
          { name: '历史转化表现', value: 85, industryAvg: 72 },
        ],
        metrics: [
          { name: '预估 CTR', value: 3.67, unit: '%', industryAvg: 2.8, comparison: 'above', comparisonPercent: 31.1 },
          { name: '预估 CVR', value: 4.23, unit: '%', industryAvg: 3.8, comparison: 'above', comparisonPercent: 11.3 },
          { name: '今日消耗', value: 28901, unit: '元', industryAvg: 15000, comparison: 'above', comparisonPercent: 92.7 },
          { name: '转化成本', value: 23.42, unit: '元', industryAvg: 28.5, comparison: 'above', comparisonPercent: 17.8 },
        ],
        suggestions: [
          {
            id: 'sug_003',
            title: '建议扩量定向',
            description: '当前定向覆盖人群约 125 万，建议放宽年龄范围至 18-45 岁，预计可覆盖人群增加至 280 万。',
            priority: 'medium',
            action: 'expand_targeting',
            actionLabel: '扩量定向',
            estimatedImpact: '预计曝光量提升 30%',
          },
        ],
      },
      {
        adId: 'AD-20260503-001',
        adName: '品牌曝光-信息流-电商投放',
        accountId: '100004',
        accountName: '电商投放账户',
        campaignId: 'C007',
        campaignName: '电商大促-全渠道',
        status: 'learning',
        learningPhase: 'in_progress',
        learningPhaseProgress: 45,
        conclusions: ['traffic_weak'],
        radarData: [
          { name: '出价竞争力', value: 65, industryAvg: 75 },
          { name: '素材吸引力', value: 78, industryAvg: 80 },
          { name: '落地页质量', value: 72, industryAvg: 78 },
          { name: '定向精准度', value: 55, industryAvg: 70 },
          { name: '历史转化表现', value: 68, industryAvg: 72 },
        ],
        metrics: [
          { name: '预估 CTR', value: 2.89, unit: '%', industryAvg: 2.8, comparison: 'above', comparisonPercent: 3.2 },
          { name: '预估 CVR', value: 3.45, unit: '%', industryAvg: 3.8, comparison: 'below', comparisonPercent: 9.2 },
          { name: '今日消耗', value: 20426, unit: '元', industryAvg: 15000, comparison: 'above', comparisonPercent: 36.2 },
          { name: '转化成本', value: 24.22, unit: '元', industryAvg: 28.5, comparison: 'above', comparisonPercent: 15.0 },
        ],
        suggestions: [
          {
            id: 'sug_004',
            title: '建议优化落地页加载速度',
            description: '落地页首屏加载时间 3.2s，高于行业均值 2.1s。建议压缩图片资源，启用 CDN 加速。',
            priority: 'medium',
            action: 'optimize_landing_page',
            actionLabel: '查看详情',
            estimatedImpact: '预计 CVR 提升 10-15%',
          },
        ],
      },
    ],
  },
  {
    projectId: 'proj_002',
    projectName: '教育课程精准获客项目',
    projectType: 'education',
    diagnosticTime: '2026-05-08 14:20:00',
    aggregatedMetrics: [
      { name: '预估 CTR', value: 1.95, unit: '%', industryAvg: 2.2, comparison: 'below', comparisonPercent: 11.4 },
      { name: '预估 CVR', value: 3.89, unit: '%', industryAvg: 3.5, comparison: 'above', comparisonPercent: 11.1 },
      { name: '今日消耗', value: 34444, unit: '元', industryAvg: 25000, comparison: 'above', comparisonPercent: 37.8 },
      { name: '转化成本', value: 54.67, unit: '元', industryAvg: 45.0, comparison: 'below', comparisonPercent: 21.5 },
    ],
    units: [
      {
        adId: 'AD-20260505-001',
        adName: '教育课程-精准定向-高意向',
        accountId: '100006',
        accountName: '教育投放账户',
        campaignId: 'C012',
        campaignName: '教育课程-精准定向',
        status: 'running',
        learningPhase: 'completed',
        learningPhaseProgress: 100,
        conclusions: ['quality_low'],
        radarData: [
          { name: '出价竞争力', value: 70, industryAvg: 75 },
          { name: '素材吸引力', value: 75, industryAvg: 80 },
          { name: '落地页质量', value: 58, industryAvg: 78 },
          { name: '定向精准度', value: 82, industryAvg: 70 },
          { name: '历史转化表现', value: 72, industryAvg: 72 },
        ],
        metrics: [
          { name: '预估 CTR', value: 1.56, unit: '%', industryAvg: 2.2, comparison: 'below', comparisonPercent: 29.1 },
          { name: '预估 CVR', value: 4.23, unit: '%', industryAvg: 3.5, comparison: 'above', comparisonPercent: 20.9 },
          { name: '今日消耗', value: 15679, unit: '元', industryAvg: 12000, comparison: 'above', comparisonPercent: 30.7 },
          { name: '转化成本', value: 67.0, unit: '元', industryAvg: 45.0, comparison: 'below', comparisonPercent: 48.9 },
        ],
        suggestions: [
          {
            id: 'sug_005',
            title: '建议优化落地页质量',
            description: '落地页质量评分 58 分，低于行业均值 78 分。建议增加用户证言、优化首屏布局、添加 CTAs。',
            priority: 'high',
            action: 'optimize_landing_page',
            actionLabel: '优化落地页',
            estimatedImpact: '预计 CVR 提升 20-25%',
          },
        ],
      },
      {
        adId: 'AD-20260505-003',
        adName: '教育试听-信息流-体验课',
        accountId: '100006',
        accountName: '教育投放账户',
        campaignId: 'C013',
        campaignName: '教育试听-信息流',
        status: 'learning',
        learningPhase: 'in_progress',
        learningPhaseProgress: 72,
        conclusions: ['bid_insufficient'],
        radarData: [
          { name: '出价竞争力', value: 52, industryAvg: 75 },
          { name: '素材吸引力', value: 80, industryAvg: 80 },
          { name: '落地页质量', value: 74, industryAvg: 78 },
          { name: '定向精准度', value: 68, industryAvg: 70 },
          { name: '历史转化表现', value: 75, industryAvg: 72 },
        ],
        metrics: [
          { name: '预估 CTR', value: 2.23, unit: '%', industryAvg: 2.2, comparison: 'above', comparisonPercent: 1.4 },
          { name: '预估 CVR', value: 3.55, unit: '%', industryAvg: 3.5, comparison: 'above', comparisonPercent: 1.4 },
          { name: '今日消耗', value: 18765, unit: '元', industryAvg: 12000, comparison: 'above', comparisonPercent: 56.4 },
          { name: '转化成本', value: 41.15, unit: '元', industryAvg: 45.0, comparison: 'above', comparisonPercent: 8.6 },
        ],
        suggestions: [
          {
            id: 'sug_006',
            title: '建议提高出价至 45 元',
            description: '当前出价竞争力处于行业后 40%，建议将目标出价从 40 元提高至 45 元，提升竞价胜率约 12%。',
            priority: 'high',
            action: 'update_bid',
            actionLabel: '一键提价',
            estimatedImpact: '预计提升曝光量 12-18%',
          },
          {
            id: 'sug_007',
            title: '建议增加预算分配',
            description: '当前计划消耗速度较慢，日预算使用率仅 58%。建议将日预算从 4000 元提高至 5500 元。',
            priority: 'low',
            action: 'increase_budget',
            actionLabel: '提高预算',
            estimatedImpact: '预计消耗提升 35%',
          },
        ],
      },
    ],
  },
  {
    projectId: 'proj_003',
    projectName: '电商大促全渠道推广项目',
    projectType: 'ecommerce',
    diagnosticTime: '2026-05-08 13:45:00',
    aggregatedMetrics: [
      { name: '预估 CTR', value: 3.06, unit: '%', industryAvg: 2.8, comparison: 'above', comparisonPercent: 9.3 },
      { name: '预估 CVR', value: 3.87, unit: '%', industryAvg: 3.8, comparison: 'above', comparisonPercent: 1.8 },
      { name: '今日消耗', value: 80243, unit: '元', industryAvg: 60000, comparison: 'above', comparisonPercent: 33.7 },
      { name: '转化成本', value: 25.29, unit: '元', industryAvg: 28.5, comparison: 'above', comparisonPercent: 11.2 },
    ],
    units: [
      {
        adId: 'AD-20260503-001',
        adName: '电商大促-全渠道-主推',
        accountId: '100004',
        accountName: '电商投放账户',
        campaignId: 'C007',
        campaignName: '电商大促-全渠道',
        status: 'running',
        learningPhase: 'completed',
        learningPhaseProgress: 100,
        conclusions: ['learning_normal'],
        radarData: [
          { name: '出价竞争力', value: 82, industryAvg: 75 },
          { name: '素材吸引力', value: 88, industryAvg: 80 },
          { name: '落地页质量', value: 80, industryAvg: 78 },
          { name: '定向精准度', value: 76, industryAvg: 70 },
          { name: '历史转化表现', value: 90, industryAvg: 72 },
        ],
        metrics: [
          { name: '预估 CTR', value: 3.45, unit: '%', industryAvg: 2.8, comparison: 'above', comparisonPercent: 23.2 },
          { name: '预估 CVR', value: 4.12, unit: '%', industryAvg: 3.8, comparison: 'above', comparisonPercent: 8.4 },
          { name: '今日消耗', value: 56789, unit: '元', industryAvg: 30000, comparison: 'above', comparisonPercent: 89.3 },
          { name: '转化成本', value: 24.22, unit: '元', industryAvg: 28.5, comparison: 'above', comparisonPercent: 15.0 },
        ],
        suggestions: [
          {
            id: 'sug_008',
            title: '建议增加预算分配',
            description: '当前计划表现优秀，日预算使用率已达 95%。建议将日预算从 10000 元提高至 15000 元。',
            priority: 'high',
            action: 'increase_budget',
            actionLabel: '提高预算',
            estimatedImpact: '预计消耗提升 50%，转化量提升 40%',
          },
        ],
      },
      {
        adId: 'AD-20260503-003',
        adName: '电商拉新-信息流-新客',
        accountId: '100004',
        accountName: '电商投放账户',
        campaignId: 'C008',
        campaignName: '电商拉新-信息流',
        status: 'learning',
        learningPhase: 'stuck',
        learningPhaseProgress: 35,
        conclusions: ['learning_stuck', 'creative_decay'],
        radarData: [
          { name: '出价竞争力', value: 48, industryAvg: 75 },
          { name: '素材吸引力', value: 62, industryAvg: 80 },
          { name: '落地页质量', value: 70, industryAvg: 78 },
          { name: '定向精准度', value: 55, industryAvg: 70 },
          { name: '历史转化表现', value: 60, industryAvg: 72 },
        ],
        metrics: [
          { name: '预估 CTR', value: 1.89, unit: '%', industryAvg: 2.8, comparison: 'below', comparisonPercent: 32.5 },
          { name: '预估 CVR', value: 2.34, unit: '%', industryAvg: 3.8, comparison: 'below', comparisonPercent: 38.4 },
          { name: '今日消耗', value: 23454, unit: '元', industryAvg: 30000, comparison: 'below', comparisonPercent: 21.8 },
          { name: '转化成本', value: 34.6, unit: '元', industryAvg: 28.5, comparison: 'below', comparisonPercent: 21.4 },
        ],
        suggestions: [
          {
            id: 'sug_009',
            title: '建议更换创意素材',
            description: '当前素材 CTR 持续走低，且学习期已停滞。建议更换为"电商大促素材包-横图"或"促销活动Banner"素材。',
            priority: 'high',
            action: 'replace_creative',
            actionLabel: '更换素材',
            estimatedImpact: '预计 CTR 提升至 2.5%+，学习期突破',
          },
          {
            id: 'sug_010',
            title: '建议提高出价至 32 元',
            description: '当前出价竞争力严重不足，建议将目标出价从 25 元提高至 32 元，帮助突破学习期。',
            priority: 'high',
            action: 'update_bid',
            actionLabel: '一键提价',
            estimatedImpact: '预计突破学习期，曝光量提升 50%+',
          },
        ],
      },
    ],
  },
];

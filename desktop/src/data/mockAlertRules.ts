// ============================================================
// 告警规则 - Mock 数据
// ============================================================

export type MonitorScopeType = 'all' | 'specific';

export type AlertMetric =
  | 'balance'
  | 'cpa'
  | 'impressions'
  | 'clicks'
  | 'conversions'
  | 'spend'
  | 'ctr'
  | 'daily_budget_usage';

export type Comparator = '>' | '<' | '=' | '>=' | '<=';

export type NotificationChannel = 'feishu' | 'dingtalk' | 'email';

export interface TriggerCondition {
  metric: AlertMetric;
  comparator: Comparator;
  threshold: number;
}

export interface AlertRule {
  key: string;
  ruleName: string;
  monitorScope: MonitorScopeType;
  targetAccounts?: string[]; // 账户名称列表
  conditions: TriggerCondition[];
  notifyChannels: NotificationChannel[];
  autoCircuitBreaker: boolean;
  enabled: boolean;
  createdAt: string;
  triggerCount: number;
}

// ============================================================
// 指标映射
// ============================================================

export const METRIC_LABELS: Record<AlertMetric, string> = {
  balance: '账户余额',
  cpa: '转化成本',
  impressions: '展现量',
  clicks: '点击数',
  conversions: '转化数',
  spend: '消耗金额',
  ctr: '点击率',
  daily_budget_usage: '日预算使用率',
};

export const COMPARATOR_LABELS: Record<Comparator, string> = {
  '>': '大于 (>)',
  '<': '小于 (<)',
  '=': '等于 (=)',
  '>=': '大于等于 (>=)',
  '<=': '小于等于 (<=)',
};

export const CHANNEL_LABELS: Record<NotificationChannel, string> = {
  feishu: '飞书',
  dingtalk: '钉钉',
  email: '邮件',
};

// ============================================================
// Mock 告警规则
// ============================================================

export const mockAlertRules: AlertRule[] = [
  {
    key: 'rule_001',
    ruleName: '账户余额不足预警',
    monitorScope: 'all',
    conditions: [
      { metric: 'balance', comparator: '<', threshold: 5000 },
    ],
    notifyChannels: ['feishu', 'dingtalk', 'email'],
    autoCircuitBreaker: false,
    enabled: true,
    createdAt: '2026-04-15 10:00',
    triggerCount: 12,
  },
  {
    key: 'rule_002',
    ruleName: 'CPA 超标告警',
    monitorScope: 'specific',
    targetAccounts: ['品牌投放账户-主', '效果投放账户-A', '电商投放账户'],
    conditions: [
      { metric: 'cpa', comparator: '>', threshold: 50 },
    ],
    notifyChannels: ['feishu', 'email'],
    autoCircuitBreaker: true,
    enabled: true,
    createdAt: '2026-04-20 14:30',
    triggerCount: 8,
  },
  {
    key: 'rule_003',
    ruleName: '日预算消耗过快',
    monitorScope: 'specific',
    targetAccounts: ['品牌投放账户-主', '电商投放账户'],
    conditions: [
      { metric: 'daily_budget_usage', comparator: '>', threshold: 80 },
    ],
    notifyChannels: ['dingtalk'],
    autoCircuitBreaker: false,
    enabled: true,
    createdAt: '2026-05-01 09:00',
    triggerCount: 5,
  },
  {
    key: 'rule_004',
    ruleName: '展现量骤降监控',
    monitorScope: 'all',
    conditions: [
      { metric: 'impressions', comparator: '<', threshold: 10000 },
    ],
    notifyChannels: ['feishu', 'dingtalk'],
    autoCircuitBreaker: false,
    enabled: false,
    createdAt: '2026-05-03 11:20',
    triggerCount: 0,
  },
  {
    key: 'rule_005',
    ruleName: '高消耗 + 高 CPA 复合告警',
    monitorScope: 'specific',
    targetAccounts: ['效果投放账户-A', '效果投放账户-B'],
    conditions: [
      { metric: 'spend', comparator: '>', threshold: 30000 },
      { metric: 'cpa', comparator: '>', threshold: 40 },
    ],
    notifyChannels: ['feishu', 'dingtalk', 'email'],
    autoCircuitBreaker: true,
    enabled: true,
    createdAt: '2026-05-05 16:45',
    triggerCount: 3,
  },
  {
    key: 'rule_006',
    ruleName: 'CTR 低于阈值告警',
    monitorScope: 'all',
    conditions: [
      { metric: 'ctr', comparator: '<', threshold: 1.0 },
    ],
    notifyChannels: ['email'],
    autoCircuitBreaker: false,
    enabled: false,
    createdAt: '2026-05-06 08:30',
    triggerCount: 2,
  },
];

// ============================================================
// 账户选项（用于监控对象选择）
// ============================================================

export const alertAccountOptions = [
  { value: 'acc_001', label: '品牌投放账户-主' },
  { value: 'acc_002', label: '效果投放账户-A' },
  { value: 'acc_003', label: '效果投放账户-B' },
  { value: 'acc_004', label: '电商投放账户' },
  { value: 'acc_005', label: '游戏投放账户' },
  { value: 'acc_006', label: '教育投放账户' },
];

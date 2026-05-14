// ============================================================
// 事件与监测管理 - Mock 数据
// ============================================================

export type TrackingType = 'api' | 'link';
export type EventStatus = 'active' | 'disabled';
export type DebugStatus = 'not_started' | 'in_progress' | 'success' | 'failed';

// ============================================================
// 监测链接
// ============================================================

export interface TrackingLink {
  id: string;
  name: string;
  url: string;
  macros: string[]; // 宏参数列表
  createdAt: string;
}

// ============================================================
// 事件资产
// ============================================================

export interface EventAsset {
  id: string;
  name: string;
  appId: string;
  appName: string;
  assetId: string;
  trackingType: TrackingType;
  status: EventStatus;
  createdAt: string;
  debugStatus: DebugStatus;
  debugStep: number; // 当前联调步骤 (0-3)
  sharedTo: string[]; // 已共享的账户ID列表
  clickLinks: TrackingLink[];
  impressionLinks: TrackingLink[];
}

// ============================================================
// 共享账户
// ============================================================

export interface SharedAccount {
  key: string;
  title: string;
  description: string;
  disabled: boolean;
}

// ============================================================
// 常量配置
// ============================================================

export const TRACKING_TYPE_CONFIG: Record<TrackingType, { label: string; color: string }> = {
  api: { label: 'API回传', color: 'blue' },
  link: { label: '监测链接', color: 'green' },
};

export const STATUS_CONFIG: Record<EventStatus, { label: string; color: string }> = {
  active: { label: '启用', color: 'green' },
  disabled: { label: '停用', color: 'default' },
};

export const DEBUG_STATUS_CONFIG: Record<DebugStatus, { label: string; color: string }> = {
  not_started: { label: '未联调', color: 'default' },
  in_progress: { label: '联调中', color: 'blue' },
  success: { label: '联调成功', color: 'green' },
  failed: { label: '联调失败', color: 'red' },
};

export const DEBUG_STEPS = [
  { title: '未联调', description: '尚未开始联调' },
  { title: '联调中', description: '正在验证数据上报' },
  { title: '联调成功', description: '数据上报正常' },
  { title: '联调失败', description: '数据上报异常' },
];

// ============================================================
// Mock 数据
// ============================================================

const mockClickLinks: TrackingLink[] = [
  {
    id: 'link_001',
    name: '主链接-默认',
    url: 'https://click.example.com/track?event={event_id}&uid={user_id}&ts={timestamp}',
    macros: ['{event_id}', '{user_id}', '{timestamp}'],
    createdAt: '2026-04-15 10:00',
  },
  {
    id: 'link_002',
    name: '备用链接-备用',
    url: 'https://click-backup.example.com/track?event={event_id}&uid={user_id}',
    macros: ['{event_id}', '{user_id}'],
    createdAt: '2026-04-20 14:30',
  },
];

const mockImpressionLinks: TrackingLink[] = [
  {
    id: 'link_003',
    name: '展现监测-默认',
    url: 'https://impression.example.com/track?event={event_id}&aid={ad_id}&pos={position}',
    macros: ['{event_id}', '{ad_id}', '{position}'],
    createdAt: '2026-04-15 10:00',
  },
];

export const mockEventAssets: EventAsset[] = [
  {
    id: 'event_001',
    name: '购买转化事件',
    appId: 'app_001',
    appName: 'XX购物APP',
    assetId: 'EVT-20260415-001',
    trackingType: 'api',
    status: 'active',
    createdAt: '2026-04-15 10:00',
    debugStatus: 'success',
    debugStep: 2,
    sharedTo: ['app_002', 'app_003'],
    clickLinks: mockClickLinks,
    impressionLinks: mockImpressionLinks,
  },
  {
    id: 'event_002',
    name: '注册转化事件',
    appId: 'app_001',
    appName: 'XX购物APP',
    assetId: 'EVT-20260416-002',
    trackingType: 'api',
    status: 'active',
    createdAt: '2026-04-16 14:30',
    debugStatus: 'success',
    debugStep: 2,
    sharedTo: ['app_002'],
    clickLinks: mockClickLinks,
    impressionLinks: mockImpressionLinks,
  },
  {
    id: 'event_003',
    name: '加购转化事件',
    appId: 'app_001',
    appName: 'XX购物APP',
    assetId: 'EVT-20260417-003',
    trackingType: 'link',
    status: 'active',
    createdAt: '2026-04-17 09:15',
    debugStatus: 'in_progress',
    debugStep: 1,
    sharedTo: [],
    clickLinks: mockClickLinks,
    impressionLinks: mockImpressionLinks,
  },
  {
    id: 'event_004',
    name: '页面访问事件',
    appId: 'app_002',
    appName: 'YY工具APP',
    assetId: 'EVT-20260418-004',
    trackingType: 'link',
    status: 'active',
    createdAt: '2026-04-18 11:20',
    debugStatus: 'not_started',
    debugStep: 0,
    sharedTo: ['app_001'],
    clickLinks: mockClickLinks,
    impressionLinks: mockImpressionLinks,
  },
  {
    id: 'event_005',
    name: '付费转化事件',
    appId: 'app_002',
    appName: 'YY工具APP',
    assetId: 'EVT-20260419-005',
    trackingType: 'api',
    status: 'disabled',
    createdAt: '2026-04-19 16:45',
    debugStatus: 'failed',
    debugStep: 3,
    sharedTo: [],
    clickLinks: mockClickLinks,
    impressionLinks: mockImpressionLinks,
  },
  {
    id: 'event_006',
    name: '订阅转化事件',
    appId: 'app_003',
    appName: 'ZZ内容APP',
    assetId: 'EVT-20260420-006',
    trackingType: 'link',
    status: 'active',
    createdAt: '2026-04-20 08:30',
    debugStatus: 'success',
    debugStep: 2,
    sharedTo: ['app_001', 'app_002'],
    clickLinks: mockClickLinks,
    impressionLinks: mockImpressionLinks,
  },
  {
    id: 'event_007',
    name: '分享转化事件',
    appId: 'app_003',
    appName: 'ZZ内容APP',
    assetId: 'EVT-20260421-007',
    trackingType: 'api',
    status: 'active',
    createdAt: '2026-04-21 13:10',
    debugStatus: 'in_progress',
    debugStep: 1,
    sharedTo: [],
    clickLinks: mockClickLinks,
    impressionLinks: mockImpressionLinks,
  },
  {
    id: 'event_008',
    name: '下载完成事件',
    appId: 'app_004',
    appName: 'AA游戏APP',
    assetId: 'EVT-20260422-008',
    trackingType: 'link',
    status: 'active',
    createdAt: '2026-04-22 15:55',
    debugStatus: 'not_started',
    debugStep: 0,
    sharedTo: ['app_001'],
    clickLinks: mockClickLinks,
    impressionLinks: mockImpressionLinks,
  },
];

export const mockSharedAccounts: SharedAccount[] = [
  {
    key: 'app_001',
    title: 'XX购物APP',
    description: '电商类应用 · 已授权',
    disabled: false,
  },
  {
    key: 'app_002',
    title: 'YY工具APP',
    description: '工具类应用 · 已授权',
    disabled: false,
  },
  {
    key: 'app_003',
    title: 'ZZ内容APP',
    description: '内容类应用 · 已授权',
    disabled: false,
  },
  {
    key: 'app_004',
    title: 'AA游戏APP',
    description: '游戏类应用 · 已授权',
    disabled: false,
  },
  {
    key: 'app_005',
    title: 'BB社交APP',
    description: '社交类应用 · 未授权',
    disabled: true,
  },
];

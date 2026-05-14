// ============================================================
// 批量新建计划 - Mock 数据
// ============================================================

// ---- 视频素材 ----

export interface VideoMaterial {
  id: string;
  title: string;
  duration: string;
  size: string;
  thumbnail: string; // 渐变色占位
}

export const mockVideos: VideoMaterial[] = [
  {
    id: 'vid_001',
    title: '品牌宣传片-30s',
    duration: '0:30',
    size: '156MB',
    thumbnail: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  {
    id: 'vid_002',
    title: '产品功能演示-15s',
    duration: '0:15',
    size: '78MB',
    thumbnail: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  },
  {
    id: 'vid_003',
    title: '用户证言-60s',
    duration: '1:00',
    size: '234MB',
    thumbnail: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  },
  {
    id: 'vid_004',
    title: '促销活动-30s',
    duration: '0:30',
    size: '145MB',
    thumbnail: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  },
  {
    id: 'vid_005',
    title: '品牌故事-45s',
    duration: '0:45',
    size: '198MB',
    thumbnail: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  },
  {
    id: 'vid_006',
    title: '新品发布-20s',
    duration: '0:20',
    size: '92MB',
    thumbnail: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
  },
  {
    id: 'vid_007',
    title: '教育课程介绍-30s',
    duration: '0:30',
    size: '134MB',
    thumbnail: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
  },
  {
    id: 'vid_008',
    title: '游戏实录-25s',
    duration: '0:25',
    size: '167MB',
    thumbnail: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
  },
];

// ---- 受众包 ----

export interface AudiencePackage {
  value: string;
  label: string;
  description: string;
  size: string;
}

export const mockAudiencePackages: AudiencePackage[] = [
  {
    value: 'aud_001',
    label: '高价值用户包',
    description: '近30天有购买行为的高价值用户',
    size: '125,000',
  },
  {
    value: 'aud_002',
    label: '兴趣人群-科技',
    description: '对科技产品感兴趣的用户群体',
    size: '2,340,000',
  },
  {
    value: 'aud_003',
    label: '兴趣人群-教育',
    description: '关注教育内容的用户群体',
    size: '1,890,000',
  },
  {
    value: 'aud_004',
    label: '电商活跃用户',
    description: '近7天有电商浏览行为的用户',
    size: '567,000',
  },
  {
    value: 'aud_005',
    label: '游戏爱好者',
    description: '对游戏内容高度活跃的用户',
    size: '3,450,000',
  },
  {
    value: 'aud_006',
    label: '品牌认知人群',
    description: '近90天接触过品牌广告的用户',
    size: '890,000',
  },
];

// ---- 出价方式 ----

export type BiddingMethod = 'ocpc' | 'ocpm' | 'cpm' | 'cpc' | 'ocpx';

export interface BiddingOption {
  value: BiddingMethod;
  label: string;
  description: string;
  minBid: number;
  recommendedBid: number;
}

export const mockBiddingOptions: BiddingOption[] = [
  {
    value: 'ocpc',
    label: 'oCPC - 目标转化出价',
    description: '系统智能优化，按转化目标出价',
    minBid: 5,
    recommendedBid: 30,
  },
  {
    value: 'ocpm',
    label: 'oCPM - 千次曝光转化出价',
    description: '系统智能优化，按千次曝光转化出价',
    minBid: 10,
    recommendedBid: 50,
  },
  {
    value: 'cpm',
    label: 'CPM - 千次曝光出价',
    description: '按千次曝光出价，适合品牌曝光',
    minBid: 5,
    recommendedBid: 25,
  },
  {
    value: 'cpc',
    label: 'CPC - 点击出价',
    description: '按点击出价，适合引流场景',
    minBid: 0.2,
    recommendedBid: 1.5,
  },
  {
    value: 'ocpx',
    label: 'oCPX - 智能出价',
    description: '系统自动优化出价策略',
    minBid: 10,
    recommendedBid: 40,
  },
];

// ---- 账户选择（用于 Transfer） ----

export interface TransferAccountItem {
  key: string;
  title: string;
  disabled: boolean;
  advertiserId: string;
  balance: number;
}

export const mockTransferAccounts: TransferAccountItem[] = [
  {
    key: 'acc_001',
    title: '品牌投放账户-主',
    disabled: false,
    advertiserId: '100001',
    balance: 50000,
  },
  {
    key: 'acc_002',
    title: '效果投放账户-A',
    disabled: false,
    advertiserId: '100002',
    balance: 30000,
  },
  {
    key: 'acc_003',
    title: '效果投放账户-B',
    disabled: false,
    advertiserId: '100003',
    balance: 5000,
  },
  {
    key: 'acc_004',
    title: '电商投放账户',
    disabled: false,
    advertiserId: '100004',
    balance: 80000,
  },
  {
    key: 'acc_005',
    title: '游戏投放账户',
    disabled: true,
    advertiserId: '100005',
    balance: 0,
  },
  {
    key: 'acc_006',
    title: '教育投放账户',
    disabled: false,
    advertiserId: '100006',
    balance: 45000,
  },
];

// ---- 预览生成的计划 ----

export interface GeneratedPlanPreview {
  key: string;
  planId: string;
  accountName: string;
  videoTitle: string;
  textTitle: string;
  audienceName: string;
  biddingMethod: string;
  targetBid: number;
  dailyBudget: number;
  estimatedImpressions: number;
  estimatedClicks: number;
}

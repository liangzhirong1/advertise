// ============================================================
// 企业素材库 - Mock 数据
// ============================================================

export type AssetType = 'video' | 'image';
export type AssetTag = '节日' | '产品线-A' | '产品线-B' | '产品线-C' | '品牌' | '效果' | '电商' | '教育' | '游戏' | '促销' | '新品' | '季节';

export interface AssetItem {
  key: string;
  name: string;
  type: AssetType;
  thumbnail: string; // 渐变色占位
  duration?: string; // 视频时长
  resolution?: string; // 分辨率
  size: string; // 文件大小
  format: string; // 文件格式
  md5: string;
  tags: AssetTag[];
  uploadedAt: string;
  uploadedBy: string;
  pushCount: number; // 推送次数
  totalSpend: number; // 聚合消耗
  sparkline: number[]; // 7天消耗趋势数据
}

// ============================================================
// 素材列表
// ============================================================

export const mockAssets: AssetItem[] = [
  {
    key: 'asset_001',
    name: '品牌宣传片-30s',
    type: 'video',
    thumbnail: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    duration: '0:30',
    resolution: '1920x1080',
    size: '156MB',
    format: 'MP4',
    md5: 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6',
    tags: ['品牌', '产品线-A'],
    uploadedAt: '2026-05-01',
    uploadedBy: '赵六',
    pushCount: 5,
    totalSpend: 45678,
    sparkline: [5200, 6100, 5800, 7200, 6900, 7500, 8100],
  },
  {
    key: 'asset_002',
    name: '产品功能演示-15s',
    type: 'video',
    thumbnail: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    duration: '0:15',
    resolution: '1080x1920',
    size: '78MB',
    format: 'MP4',
    md5: 'b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7',
    tags: ['效果', '产品线-B'],
    uploadedAt: '2026-05-02',
    uploadedBy: '钱七',
    pushCount: 8,
    totalSpend: 67890,
    sparkline: [8200, 9100, 8800, 10200, 9900, 11500, 12100],
  },
  {
    key: 'asset_003',
    name: '用户证言-60s',
    type: 'video',
    thumbnail: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    duration: '1:00',
    resolution: '1920x1080',
    size: '234MB',
    format: 'MP4',
    md5: 'c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8',
    tags: ['品牌', '季节'],
    uploadedAt: '2026-05-03',
    uploadedBy: '赵六',
    pushCount: 3,
    totalSpend: 23456,
    sparkline: [3200, 3100, 3800, 4200, 3900, 4500, 4100],
  },
  {
    key: 'asset_004',
    name: '促销活动Banner-主图',
    type: 'image',
    thumbnail: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    resolution: '1200x628',
    size: '2.4MB',
    format: 'PNG',
    md5: 'd4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9',
    tags: ['促销', '节日', '电商'],
    uploadedAt: '2026-05-04',
    uploadedBy: '钱七',
    pushCount: 12,
    totalSpend: 89012,
    sparkline: [12200, 13100, 12800, 14200, 13900, 15500, 16100],
  },
  {
    key: 'asset_005',
    name: '品牌故事-45s',
    type: 'video',
    thumbnail: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    duration: '0:45',
    resolution: '1920x1080',
    size: '198MB',
    format: 'MP4',
    md5: 'e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0',
    tags: ['品牌', '产品线-A'],
    uploadedAt: '2026-05-05',
    uploadedBy: '王五',
    pushCount: 4,
    totalSpend: 34567,
    sparkline: [4200, 4100, 4800, 5200, 4900, 5500, 5100],
  },
  {
    key: 'asset_006',
    name: '新品发布海报',
    type: 'image',
    thumbnail: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    resolution: '800x800',
    size: '1.8MB',
    format: 'JPG',
    md5: 'f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1',
    tags: ['新品', '产品线-B'],
    uploadedAt: '2026-05-06',
    uploadedBy: '李四',
    pushCount: 6,
    totalSpend: 56789,
    sparkline: [7200, 8100, 7800, 9200, 8900, 10500, 11100],
  },
  {
    key: 'asset_007',
    name: '教育课程介绍-30s',
    type: 'video',
    thumbnail: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    duration: '0:30',
    resolution: '1080x1920',
    size: '134MB',
    format: 'MP4',
    md5: 'a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2',
    tags: ['教育', '产品线-C'],
    uploadedAt: '2026-05-06',
    uploadedBy: '孙八',
    pushCount: 2,
    totalSpend: 12345,
    sparkline: [1200, 1100, 1800, 2200, 1900, 2500, 2100],
  },
  {
    key: 'asset_008',
    name: '游戏角色展示-25s',
    type: 'video',
    thumbnail: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    duration: '0:25',
    resolution: '1920x1080',
    size: '167MB',
    format: 'MP4',
    md5: 'b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3',
    tags: ['游戏', '新品'],
    uploadedAt: '2026-05-07',
    uploadedBy: '赵六',
    pushCount: 1,
    totalSpend: 5678,
    sparkline: [500, 600, 700, 800, 900, 1000, 1178],
  },
  {
    key: 'asset_009',
    name: '电商大促素材包-横图',
    type: 'image',
    thumbnail: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    resolution: '1200x628',
    size: '3.2MB',
    format: 'PNG',
    md5: 'c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4',
    tags: ['电商', '促销', '节日'],
    uploadedAt: '2026-05-07',
    uploadedBy: '钱七',
    pushCount: 10,
    totalSpend: 78901,
    sparkline: [10200, 11100, 10800, 12200, 11900, 13500, 14100],
  },
  {
    key: 'asset_010',
    name: '品牌Logo动画-10s',
    type: 'video',
    thumbnail: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    duration: '0:10',
    resolution: '1920x1080',
    size: '45MB',
    format: 'MP4',
    md5: 'd0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5',
    tags: ['品牌', '产品线-A'],
    uploadedAt: '2026-05-08',
    uploadedBy: '李四',
    pushCount: 0,
    totalSpend: 0,
    sparkline: [0, 0, 0, 0, 0, 0, 0],
  },
  {
    key: 'asset_011',
    name: '季节限定海报-春季',
    type: 'image',
    thumbnail: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    resolution: '1080x1920',
    size: '2.1MB',
    format: 'JPG',
    md5: 'e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6',
    tags: ['季节', '品牌'],
    uploadedAt: '2026-05-08',
    uploadedBy: '王五',
    pushCount: 3,
    totalSpend: 23456,
    sparkline: [3200, 3100, 3800, 4200, 3900, 4500, 4100],
  },
  {
    key: 'asset_012',
    name: '效果转化素材-竖版',
    type: 'image',
    thumbnail: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    resolution: '1080x1920',
    size: '1.5MB',
    format: 'PNG',
    md5: 'f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7',
    tags: ['效果', '产品线-B'],
    uploadedAt: '2026-05-08',
    uploadedBy: '赵六',
    pushCount: 7,
    totalSpend: 56789,
    sparkline: [7200, 8100, 7800, 9200, 8900, 10500, 11100],
  },
];

// ============================================================
// 所有标签
// ============================================================

export const allAssetTags: AssetTag[] = [
  '节日', '产品线-A', '产品线-B', '产品线-C',
  '品牌', '效果', '电商', '教育', '游戏',
  '促销', '新品', '季节',
];

// ============================================================
// 推送目标账户
// ============================================================

export interface PushTargetAccount {
  advertiserId: string;
  advertiserName: string;
  entityId: string;
  entityName: string;
}

export const mockPushTargetAccounts: PushTargetAccount[] = [
  { advertiserId: '100001', advertiserName: '品牌投放账户-主', entityId: 'ent_001', entityName: 'XX科技有限公司' },
  { advertiserId: '100002', advertiserName: '效果投放账户-A', entityId: 'ent_001', entityName: 'XX科技有限公司' },
  { advertiserId: '100003', advertiserName: '效果投放账户-B', entityId: 'ent_001', entityName: 'XX科技有限公司' },
  { advertiserId: '100004', advertiserName: '电商投放账户', entityId: 'ent_002', entityName: 'YY电子商务集团' },
  { advertiserId: '100006', advertiserName: '教育投放账户', entityId: 'ent_003', entityName: 'ZZ教育科技' },
  { advertiserId: '100007', advertiserName: '电商子账户-华东', entityId: 'ent_002', entityName: 'YY电子商务集团' },
];

// ============================================================
// 推送结果
// ============================================================

export interface PushResult {
  advertiserId: string;
  advertiserName: string;
  success: boolean;
  message?: string;
}

// ============================================================
// 素材诊断修复 - Mock 数据
// ============================================================

export type DiagnosticItemType =
  | 'quality'
  | 'audio'
  | 'compliance'
  | 'brightness'
  | 'watermark';

export type DiagnosticStatus = 'pending' | 'checking' | 'issue' | 'passed';

export interface DiagnosticItem {
  id: string;
  type: DiagnosticItemType;
  title: string;
  description: string;
  status: DiagnosticStatus;
  score?: number; // 评分（0-100）
  severity?: 'high' | 'medium' | 'low'; // 严重程度
  fixable: boolean;
  fixed: boolean;
}

export interface AssetDiagnosticResult {
  assetId: string;
  assetName: string;
  checkedAt: string;
  overallScore: number;
  items: DiagnosticItem[];
  beforePreview: string; // 原版预览（渐变色）
  afterPreview: string;  // 修复后预览（渐变色）
}

// ============================================================
// 诊断类型配置
// ============================================================

export const DIAGNOSTIC_TYPE_CONFIG: Record<
  DiagnosticItemType,
  { label: string; icon: string; color: string }
> = {
  quality: { label: '画质评分', icon: '📺', color: '#1890ff' },
  audio: { label: '音频检测', icon: '🔊', color: '#722ed1' },
  compliance: { label: '合规性', icon: '📋', color: '#fa8c16' },
  brightness: { label: '亮度检测', icon: '☀️', color: '#faad14' },
  watermark: { label: '水印检测', icon: '💧', color: '#13c2c2' },
};

// ============================================================
// Mock 诊断结果
// ============================================================

export const mockDiagnosticResults: Record<string, AssetDiagnosticResult> = {
  asset_001: {
    assetId: 'asset_001',
    assetName: '品牌宣传片-30s',
    checkedAt: '2026-05-08 14:30:00',
    overallScore: 74,
    beforePreview: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    afterPreview: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%) brightness(1.15) contrast(1.1)',
    items: [
      {
        id: 'diag_001',
        type: 'quality',
        title: '画质评分',
        description: '当前画质评分 74 分，低于推荐值 80 分。建议提升分辨率或优化编码参数。',
        status: 'issue',
        score: 74,
        severity: 'medium',
        fixable: true,
        fixed: false,
      },
      {
        id: 'diag_002',
        type: 'audio',
        title: '音量异常检测',
        description: '检测到 00:12-00:15 存在静音片段，可能影响用户体验。建议添加背景音乐或调整音量。',
        status: 'issue',
        severity: 'high',
        fixable: true,
        fixed: false,
      },
      {
        id: 'diag_003',
        type: 'compliance',
        title: '合规性风险',
        description: '检测到文案中包含"最佳"、"第一"等夸大宣传词汇，可能违反广告法。建议修改为"优质"、"领先"。',
        status: 'issue',
        severity: 'high',
        fixable: true,
        fixed: false,
      },
      {
        id: 'diag_004',
        type: 'brightness',
        title: '亮度检测',
        description: '画面整体亮度偏暗，平均亮度值 42%，建议提升至 55% 以上。',
        status: 'issue',
        severity: 'low',
        fixable: true,
        fixed: false,
      },
      {
        id: 'diag_005',
        type: 'watermark',
        title: '水印检测',
        description: '未检测到第三方水印，符合投放规范。',
        status: 'passed',
        fixable: false,
        fixed: false,
      },
    ],
  },
  asset_002: {
    assetId: 'asset_002',
    assetName: '产品功能演示-15s',
    checkedAt: '2026-05-08 15:00:00',
    overallScore: 88,
    beforePreview: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    afterPreview: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    items: [
      {
        id: 'diag_006',
        type: 'quality',
        title: '画质评分',
        description: '画质评分 88 分，达到优质标准。',
        status: 'passed',
        score: 88,
        fixable: false,
        fixed: false,
      },
      {
        id: 'diag_007',
        type: 'audio',
        title: '音频检测',
        description: '音频质量良好，无异常。',
        status: 'passed',
        fixable: false,
        fixed: false,
      },
      {
        id: 'diag_008',
        type: 'compliance',
        title: '合规性检测',
        description: '未发现违规内容。',
        status: 'passed',
        fixable: false,
        fixed: false,
      },
    ],
  },
  asset_003: {
    assetId: 'asset_003',
    assetName: '用户证言-60s',
    checkedAt: '2026-05-08 15:15:00',
    overallScore: 62,
    beforePreview: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    afterPreview: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%) saturate(1.2)',
    items: [
      {
        id: 'diag_009',
        type: 'quality',
        title: '画质评分',
        description: '画质评分 62 分，存在明显噪点。建议使用降噪算法优化。',
        status: 'issue',
        score: 62,
        severity: 'high',
        fixable: true,
        fixed: false,
      },
      {
        id: 'diag_010',
        type: 'compliance',
        title: '合规性风险',
        description: '检测到用户证言中缺少"效果因人而异"免责声明。',
        status: 'issue',
        severity: 'high',
        fixable: true,
        fixed: false,
      },
      {
        id: 'diag_011',
        type: 'watermark',
        title: '水印检测',
        description: '检测到第三方平台水印，建议去除后重新上传。',
        status: 'issue',
        severity: 'medium',
        fixable: true,
        fixed: false,
      },
    ],
  },
};

// ============================================================
// 灵感中心 - Mock 数据
// ============================================================

export interface InspirationTag {
  id: string;
  label: string;
  category: 'style' | 'audience' | 'format' | 'trend' | 'emotion';
  count: number; // 使用次数
  trend: 'up' | 'down' | 'stable';
  trendPercent: number;
}

export const mockInspirationTags: InspirationTag[] = [
  { id: 't_001', label: '快节奏剪辑', category: 'style', count: 345, trend: 'up', trendPercent: 25.3 },
  { id: 't_002', label: '剧情反转', category: 'trend', count: 289, trend: 'up', trendPercent: 18.7 },
  { id: 't_003', label: '男性受众', category: 'audience', count: 567, trend: 'stable', trendPercent: 2.1 },
  { id: 't_004', label: '15秒短视频', category: 'format', count: 892, trend: 'up', trendPercent: 32.5 },
  { id: 't_005', label: '情感共鸣', category: 'emotion', count: 456, trend: 'up', trendPercent: 15.8 },
  { id: 't_006', label: '产品展示', category: 'style', count: 678, trend: 'stable', trendPercent: -1.2 },
  { id: 't_007', label: '女性受众', category: 'audience', count: 723, trend: 'up', trendPercent: 12.4 },
  { id: 't_008', label: '对比评测', category: 'trend', count: 234, trend: 'down', trendPercent: -8.5 },
  { id: 't_009', label: 'UGC风格', category: 'style', count: 445, trend: 'up', trendPercent: 28.9 },
  { id: 't_010', label: '悬念开头', category: 'trend', count: 312, trend: 'up', trendPercent: 22.1 },
  { id: 't_011', label: '幽默搞笑', category: 'emotion', count: 534, trend: 'up', trendPercent: 16.3 },
  { id: 't_012', label: '30秒中视频', category: 'format', count: 456, trend: 'down', trendPercent: -5.7 },
  { id: 't_013', label: '知识科普', category: 'trend', count: 289, trend: 'up', trendPercent: 19.8 },
  { id: 't_014', label: 'Z世代', category: 'audience', count: 678, trend: 'up', trendPercent: 24.6 },
  { id: 't_015', label: '温馨治愈', category: 'emotion', count: 345, trend: 'stable', trendPercent: 3.2 },
  { id: 't_016', label: '竖屏适配', category: 'format', count: 789, trend: 'up', trendPercent: 35.2 },
  { id: 't_017', label: '挑战赛', category: 'trend', count: 198, trend: 'up', trendPercent: 42.1 },
  { id: 't_018', label: '品牌故事', category: 'style', count: 267, trend: 'stable', trendPercent: -0.8 },
  { id: 't_019', label: '35-45岁', category: 'audience', count: 412, trend: 'down', trendPercent: -3.4 },
  { id: 't_020', label: '震撼视觉', category: 'emotion', count: 378, trend: 'up', trendPercent: 14.7 },
];

export const CATEGORY_COLORS: Record<string, string> = {
  style: '#6366f1',
  audience: '#10b981',
  format: '#f59e0b',
  trend: '#ef4444',
  emotion: '#8b5cf6',
};

export const CATEGORY_LABELS: Record<string, string> = {
  style: '风格',
  audience: '受众',
  format: '格式',
  trend: '趋势',
  emotion: '情感',
};

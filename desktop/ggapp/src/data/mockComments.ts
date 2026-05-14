// ============================================================
// 评论管理 - Mock 数据
// ============================================================

export type SentimentType = 'positive' | 'neutral' | 'negative';

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string; // 渐变色占位
  content: string;
  createdAt: string;
  sentiment: SentimentType;
  isPinned: boolean;
  isHidden: boolean;
  isDeleted: boolean;
  replyTo?: string; // 回复的评论ID
  materialPreview?: string; // 关联素材预览
  planId: string;
}

export interface AdPlanComment {
  planId: string;
  planName: string;
  accountName: string;
  coverThumbnail: string;
  totalComments: number;
  unreadComments: number;
  comments: Comment[];
}

// ============================================================
// Mock 数据
// ============================================================

export const mockAdPlanComments: AdPlanComment[] = [
  {
    planId: 'plan_001',
    planName: '品牌曝光-信息流-常规投放',
    accountName: '品牌投放账户-主',
    coverThumbnail: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    totalComments: 12,
    unreadComments: 3,
    comments: [
      {
        id: 'c_001',
        userId: 'u_001',
        userName: '小明同学',
        userAvatar: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        content: '这个产品真的很好用，已经推荐给朋友了！',
        createdAt: '2026-05-08 14:30',
        sentiment: 'positive',
        isPinned: true,
        isHidden: false,
        isDeleted: false,
        planId: 'plan_001',
      },
      {
        id: 'c_002',
        userId: 'u_002',
        userName: '数码达人',
        userAvatar: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        content: '价格有点贵，但是质量确实不错。',
        createdAt: '2026-05-08 13:15',
        sentiment: 'neutral',
        isPinned: false,
        isHidden: false,
        isDeleted: false,
        planId: 'plan_001',
      },
      {
        id: 'c_003',
        userId: 'u_003',
        userName: '消费者A',
        userAvatar: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        content: '物流太慢了，等了5天才收到，体验很差！',
        createdAt: '2026-05-08 12:45',
        sentiment: 'negative',
        isPinned: false,
        isHidden: false,
        isDeleted: false,
        planId: 'plan_001',
      },
      {
        id: 'c_004',
        userId: 'u_004',
        userName: '忠实粉丝',
        userAvatar: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        content: '第三次购买了，每次都很满意！',
        createdAt: '2026-05-08 11:20',
        sentiment: 'positive',
        isPinned: false,
        isHidden: false,
        isDeleted: false,
        planId: 'plan_001',
      },
      {
        id: 'c_005',
        userId: 'u_005',
        userName: '路人甲',
        userAvatar: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
        content: '感觉一般般吧，没有宣传的那么好。',
        createdAt: '2026-05-08 10:05',
        sentiment: 'negative',
        isPinned: false,
        isHidden: false,
        isDeleted: false,
        planId: 'plan_001',
      },
    ],
  },
  {
    planId: 'plan_002',
    planName: '效果转化-搜索-核心词',
    accountName: '效果投放账户-A',
    coverThumbnail: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    totalComments: 8,
    unreadComments: 2,
    comments: [
      {
        id: 'c_006',
        userId: 'u_006',
        userName: '科技爱好者',
        userAvatar: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
        content: '功能很强大，操作简单易懂。',
        createdAt: '2026-05-08 15:30',
        sentiment: 'positive',
        isPinned: false,
        isHidden: false,
        isDeleted: false,
        planId: 'plan_002',
      },
      {
        id: 'c_007',
        userId: 'u_007',
        userName: '专业用户',
        userAvatar: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
        content: '客服态度不好，问题一直解决不了，差评！',
        createdAt: '2026-05-08 14:10',
        sentiment: 'negative',
        isPinned: false,
        isHidden: false,
        isDeleted: false,
        planId: 'plan_002',
      },
      {
        id: 'c_008',
        userId: 'u_008',
        userName: '新用户',
        userAvatar: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        content: '刚入手，感觉还不错，期待后续使用体验。',
        createdAt: '2026-05-08 13:45',
        sentiment: 'positive',
        isPinned: false,
        isHidden: false,
        isDeleted: false,
        planId: 'plan_002',
      },
    ],
  },
  {
    planId: 'plan_003',
    planName: '电商大促-全渠道-主推',
    accountName: '电商投放账户',
    coverThumbnail: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    totalComments: 25,
    unreadComments: 7,
    comments: [
      {
        id: 'c_009',
        userId: 'u_009',
        userName: '购物达人',
        userAvatar: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        content: '大促价格确实便宜，买到了心仪的商品！',
        createdAt: '2026-05-08 16:20',
        sentiment: 'positive',
        isPinned: true,
        isHidden: false,
        isDeleted: false,
        planId: 'plan_003',
      },
      {
        id: 'c_010',
        userId: 'u_010',
        userName: '理智消费者',
        userAvatar: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        content: '先涨价再降价，套路太深了。',
        createdAt: '2026-05-08 15:50',
        sentiment: 'negative',
        isPinned: false,
        isHidden: false,
        isDeleted: false,
        planId: 'plan_003',
      },
      {
        id: 'c_011',
        userId: 'u_011',
        userName: '品牌粉丝',
        userAvatar: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
        content: '品质一如既往的好，支持！',
        createdAt: '2026-05-08 14:35',
        sentiment: 'positive',
        isPinned: false,
        isHidden: false,
        isDeleted: false,
        planId: 'plan_003',
      },
      {
        id: 'c_012',
        userId: 'u_012',
        userName: '对比达人',
        userAvatar: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
        content: '和竞品比性价比一般，但品牌信任度高。',
        createdAt: '2026-05-08 13:15',
        sentiment: 'neutral',
        isPinned: false,
        isHidden: false,
        isDeleted: false,
        planId: 'plan_003',
      },
    ],
  },
  {
    planId: 'plan_004',
    planName: '教育课程-精准定向-高意向',
    accountName: '教育投放账户',
    coverThumbnail: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    totalComments: 15,
    unreadComments: 4,
    comments: [
      {
        id: 'c_013',
        userId: 'u_013',
        userName: '家长代表',
        userAvatar: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
        content: '课程质量很高，孩子进步明显，感谢老师！',
        createdAt: '2026-05-08 17:00',
        sentiment: 'positive',
        isPinned: false,
        isHidden: false,
        isDeleted: false,
        planId: 'plan_004',
      },
      {
        id: 'c_014',
        userId: 'u_014',
        userName: '犹豫家长',
        userAvatar: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        content: '价格有点超预算，再考虑一下。',
        createdAt: '2026-05-08 16:30',
        sentiment: 'neutral',
        isPinned: false,
        isHidden: false,
        isDeleted: false,
        planId: 'plan_004',
      },
      {
        id: 'c_015',
        userId: 'u_015',
        userName: '投诉用户',
        userAvatar: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        content: '虚假宣传！说的和实际完全不符，要求退款！',
        createdAt: '2026-05-08 15:45',
        sentiment: 'negative',
        isPinned: false,
        isHidden: false,
        isDeleted: false,
        planId: 'plan_004',
      },
    ],
  },
];

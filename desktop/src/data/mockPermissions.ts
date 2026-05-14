// ============================================================
// RBAC 权限管理 - Mock 数据
// ============================================================

export type RoleType = 'admin' | 'team_lead' | 'optimizer' | 'analyst';

export interface Permission {
  key: string;
  label: string;
  category: string;
  description: string;
}

export interface Role {
  key: RoleType;
  name: string;
  description: string;
  permissions: string[];
  users: string[];
  color: string;
}

export interface RBACUser {
  key: string;
  name: string;
  email: string;
  phone: string;
  role: RoleType;
  assignedAccounts: string[];
  status: 'active' | 'disabled';
  lastLogin: string;
}

// ============================================================
// 权限定义
// ============================================================

export const allPermissions: Permission[] = [
  // 数据报表
  { key: 'dashboard_view', label: '查看数据看板', category: '数据报表', description: '可查看全局数据看板' },
  { key: 'report_view', label: '查看报表', category: '数据报表', description: '可查看各类投放报表' },
  { key: 'report_export', label: '导出报表', category: '数据报表', description: '可导出报表数据为 Excel' },
  { key: 'data_analysis', label: '数据分析', category: '数据报表', description: '可进行多维数据分析' },
  // 投放管理
  { key: 'plan_view', label: '查看计划', category: '投放管理', description: '可查看广告计划列表' },
  { key: 'plan_create', label: '创建计划', category: '投放管理', description: '可新建广告计划' },
  { key: 'plan_edit', label: '编辑计划', category: '投放管理', description: '可编辑已有广告计划' },
  { key: 'plan_pause', label: '启停计划', category: '投放管理', description: '可启停广告计划' },
  { key: 'plan_batch', label: '批量操作', category: '投放管理', description: '可执行批量启停/改预算' },
  // 账户管理
  { key: 'account_view', label: '查看账户', category: '账户管理', description: '可查看广告账户信息' },
  { key: 'account_auth', label: '授权管理', category: '账户管理', description: '可管理 OAuth 授权' },
  { key: 'account_recharge', label: '充值管理', category: '账户管理', description: '可进行账户充值' },
  // 素材管理
  { key: 'asset_view', label: '查看素材', category: '素材管理', description: '可查看素材库内容' },
  { key: 'asset_upload', label: '上传素材', category: '素材管理', description: '可上传新素材' },
  { key: 'asset_push', label: '推送素材', category: '素材管理', description: '可将素材推送至账户' },
  { key: 'asset_delete', label: '删除素材', category: '素材管理', description: '可删除素材库内容' },
  // 权限管理
  { key: 'role_manage', label: '角色管理', category: '权限管理', description: '可管理角色权限配置' },
  { key: 'user_manage', label: '用户管理', category: '权限管理', description: '可管理用户账号' },
  { key: 'entity_manage', label: '主体管理', category: '权限管理', description: '可管理 OAuth 主体应用' },
];

// ============================================================
// 角色定义
// ============================================================

export const mockRoles: Role[] = [
  {
    key: 'admin',
    name: '系统管理员',
    description: '拥有全部权限，可管理所有配置',
    color: '#ff4d4f',
    permissions: allPermissions.map((p) => p.key),
    users: ['张三'],
  },
  {
    key: 'team_lead',
    name: '团队主管',
    description: '可查看数据、管理团队、管理素材',
    color: '#faad14',
    permissions: [
      'dashboard_view', 'report_view', 'report_export', 'data_analysis',
      'plan_view', 'plan_create', 'plan_edit', 'plan_pause', 'plan_batch',
      'account_view', 'asset_view', 'asset_upload', 'asset_push',
    ],
    users: ['李四', '王五'],
  },
  {
    key: 'optimizer',
    name: '优化师',
    description: '可查看和编辑计划，推送素材',
    color: '#1890ff',
    permissions: [
      'dashboard_view', 'report_view', 'report_export',
      'plan_view', 'plan_create', 'plan_edit', 'plan_pause',
      'account_view',
      'asset_view', 'asset_upload', 'asset_push',
    ],
    users: ['赵六', '钱七', '孙八'],
  },
  {
    key: 'analyst',
    name: '数据分析师',
    description: '仅可查看报表和数据分析',
    color: '#52c41a',
    permissions: [
      'dashboard_view', 'report_view', 'report_export', 'data_analysis',
      'plan_view', 'account_view',
    ],
    users: ['周九'],
  },
];

// ============================================================
// 用户列表
// ============================================================

export const mockRBACUsers: RBACUser[] = [
  {
    key: 'user_001',
    name: '张三',
    email: 'zhangsan@company.com',
    phone: '138****1234',
    role: 'admin',
    assignedAccounts: ['all'],
    status: 'active',
    lastLogin: '2026-05-08 09:30',
  },
  {
    key: 'user_002',
    name: '李四',
    email: 'lisi@company.com',
    phone: '139****5678',
    role: 'team_lead',
    assignedAccounts: ['all'],
    status: 'active',
    lastLogin: '2026-05-08 08:45',
  },
  {
    key: 'user_003',
    name: '王五',
    email: 'wangwu@company.com',
    phone: '137****9012',
    role: 'team_lead',
    assignedAccounts: ['all'],
    status: 'active',
    lastLogin: '2026-05-07 17:20',
  },
  {
    key: 'user_004',
    name: '赵六',
    email: 'zhaoliu@company.com',
    phone: '136****3456',
    role: 'optimizer',
    assignedAccounts: ['100001', '100002'],
    status: 'active',
    lastLogin: '2026-05-08 10:00',
  },
  {
    key: 'user_005',
    name: '钱七',
    email: 'qianqi@company.com',
    phone: '135****7890',
    role: 'optimizer',
    assignedAccounts: ['100004', '100007'],
    status: 'active',
    lastLogin: '2026-05-08 09:15',
  },
  {
    key: 'user_006',
    name: '孙八',
    email: 'sunba@company.com',
    phone: '134****2345',
    role: 'optimizer',
    assignedAccounts: ['100006'],
    status: 'disabled',
    lastLogin: '2026-04-20 14:00',
  },
  {
    key: 'user_007',
    name: '周九',
    email: 'zhoujiu@company.com',
    phone: '133****6789',
    role: 'analyst',
    assignedAccounts: ['all'],
    status: 'active',
    lastLogin: '2026-05-08 07:50',
  },
];

// ============================================================
// 账户树数据（用于 TreeSelect）
// ============================================================

export const mockAccountTreeOptions = [
  {
    title: 'XX科技有限公司',
    value: 'ent_001',
    key: 'ent_001',
    children: [
      { title: '品牌投放账户-主 (100001)', value: '100001', key: '100001' },
      { title: '效果投放账户-A (100002)', value: '100002', key: '100002' },
      { title: '效果投放账户-B (100003)', value: '100003', key: '100003' },
      { title: '品牌子账户-华南 (100008)', value: '100008', key: '100008' },
    ],
  },
  {
    title: 'YY电子商务集团',
    value: 'ent_002',
    key: 'ent_002',
    children: [
      { title: '电商投放账户 (100004)', value: '100004', key: '100004' },
      { title: '电商子账户-华东 (100007)', value: '100007', key: '100007' },
    ],
  },
  {
    title: 'ZZ教育科技',
    value: 'ent_003',
    key: 'ent_003',
    children: [
      { title: '教育投放账户 (100006)', value: '100006', key: '100006' },
    ],
  },
  {
    title: 'AA游戏互动',
    value: 'ent_004',
    key: 'ent_004',
    children: [
      { title: '游戏投放账户 (100005)', value: '100005', key: '100005' },
    ],
  },
];

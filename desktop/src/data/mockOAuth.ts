// ============================================================
// OAuth 授权 - Mock 数据
// ============================================================

export type AuthStatus = 'authorized' | 'expired' | 'revoked';
export type QualificationStatus = 'passed' | 'pending' | 'rejected';

export interface OAuthEntity {
  key: string;
  entityName: string;
  developerId: string;
  appSecret: string;
  createdAt: string;
  authorizedAccounts: number;
  totalAccounts: number;
  status: 'active' | 'inactive';
}

export interface OAuthAccount {
  key: string;
  advertiserId: string;
  advertiserName: string;
  entityId: string;
  entityName: string;
  authStatus: AuthStatus;
  tokenExpiresAt: string;
  balance: number;
  qualificationStatus: QualificationStatus;
  qualificationProgress: number;
  lastAuthAt: string;
}

export const mockOAuthEntities: OAuthEntity[] = [
  {
    key: 'ent_001',
    entityName: 'XX科技有限公司',
    developerId: 'cli_a8f3k29d1m5x7p4q',
    appSecret: 'sk_****7f2a9b3c8d1e6f0a',
    createdAt: '2025-12-15',
    authorizedAccounts: 8,
    totalAccounts: 10,
    status: 'active',
  },
  {
    key: 'ent_002',
    entityName: 'YY电子商务集团',
    developerId: 'cli_b7e2j18c0l4w6o3r',
    appSecret: 'sk_****6e1a8b2c7d0e5f9a',
    createdAt: '2026-01-20',
    authorizedAccounts: 5,
    totalAccounts: 6,
    status: 'active',
  },
  {
    key: 'ent_003',
    entityName: 'ZZ教育科技',
    developerId: 'cli_c6d1i07b9k3v5n2s',
    appSecret: 'sk_****5d0a7b1c6e9d4f8a',
    createdAt: '2026-03-05',
    authorizedAccounts: 3,
    totalAccounts: 4,
    status: 'active',
  },
  {
    key: 'ent_004',
    entityName: 'AA游戏互动',
    developerId: 'cli_d5c0h96a8j2u4m1t',
    appSecret: 'sk_****4c9a6b0c5e8d3f7a',
    createdAt: '2026-04-10',
    authorizedAccounts: 0,
    totalAccounts: 2,
    status: 'inactive',
  },
];

export const mockOAuthAccounts: OAuthAccount[] = [
  {
    key: 'oa_001',
    advertiserId: '100001',
    advertiserName: '品牌投放账户-主',
    entityId: 'ent_001',
    entityName: 'XX科技有限公司',
    authStatus: 'authorized',
    tokenExpiresAt: '2026-06-08 10:00',
    balance: 50000,
    qualificationStatus: 'passed',
    qualificationProgress: 100,
    lastAuthAt: '2026-05-08 10:00',
  },
  {
    key: 'oa_002',
    advertiserId: '100002',
    advertiserName: '效果投放账户-A',
    entityId: 'ent_001',
    entityName: 'XX科技有限公司',
    authStatus: 'authorized',
    tokenExpiresAt: '2026-06-05 14:30',
    balance: 30000,
    qualificationStatus: 'passed',
    qualificationProgress: 100,
    lastAuthAt: '2026-05-05 14:30',
  },
  {
    key: 'oa_003',
    advertiserId: '100003',
    advertiserName: '效果投放账户-B',
    entityId: 'ent_001',
    entityName: 'XX科技有限公司',
    authStatus: 'expired',
    tokenExpiresAt: '2026-05-01 09:00',
    balance: 5000,
    qualificationStatus: 'pending',
    qualificationProgress: 60,
    lastAuthAt: '2026-04-01 09:00',
  },
  {
    key: 'oa_004',
    advertiserId: '100004',
    advertiserName: '电商投放账户',
    entityId: 'ent_002',
    entityName: 'YY电子商务集团',
    authStatus: 'authorized',
    tokenExpiresAt: '2026-06-10 16:00',
    balance: 80000,
    qualificationStatus: 'passed',
    qualificationProgress: 100,
    lastAuthAt: '2026-05-10 16:00',
  },
  {
    key: 'oa_005',
    advertiserId: '100005',
    advertiserName: '游戏投放账户',
    entityId: 'ent_004',
    entityName: 'AA游戏互动',
    authStatus: 'revoked',
    tokenExpiresAt: '2026-04-10 08:00',
    balance: 0,
    qualificationStatus: 'rejected',
    qualificationProgress: 30,
    lastAuthAt: '2026-03-10 08:00',
  },
  {
    key: 'oa_006',
    advertiserId: '100006',
    advertiserName: '教育投放账户',
    entityId: 'ent_003',
    entityName: 'ZZ教育科技',
    authStatus: 'authorized',
    tokenExpiresAt: '2026-06-12 11:00',
    balance: 45000,
    qualificationStatus: 'passed',
    qualificationProgress: 100,
    lastAuthAt: '2026-05-12 11:00',
  },
  {
    key: 'oa_007',
    advertiserId: '100007',
    advertiserName: '电商子账户-华东',
    entityId: 'ent_002',
    entityName: 'YY电子商务集团',
    authStatus: 'authorized',
    tokenExpiresAt: '2026-06-08 09:30',
    balance: 35000,
    qualificationStatus: 'passed',
    qualificationProgress: 100,
    lastAuthAt: '2026-05-08 09:30',
  },
  {
    key: 'oa_008',
    advertiserId: '100008',
    advertiserName: '品牌子账户-华南',
    entityId: 'ent_001',
    entityName: 'XX科技有限公司',
    authStatus: 'expired',
    tokenExpiresAt: '2026-04-28 17:00',
    balance: 12000,
    qualificationStatus: 'pending',
    qualificationProgress: 45,
    lastAuthAt: '2026-03-28 17:00',
  },
];

// ============================================================
// OAuth 授权 URL 模拟
// ============================================================

export const mockOAuthUrl = (entityId: string): string =>
  `https://open.oceanengine.com/oauth/authorize?client_id=cli_xxx&redirect_uri=https://ggapp.com/callback&state=${entityId}&scope=ad::read,ad::write`;

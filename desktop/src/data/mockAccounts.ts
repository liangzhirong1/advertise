export interface Account {
  value: string;
  label: string;
  advertiserId: string;
}

export const mockAccounts: Account[] = [
  { value: 'acc_001', label: '品牌投放账户-主', advertiserId: '100001' },
  { value: 'acc_002', label: '效果投放账户-A', advertiserId: '100002' },
  { value: 'acc_003', label: '效果投放账户-B', advertiserId: '100003' },
  { value: 'acc_004', label: '电商投放账户', advertiserId: '100004' },
  { value: 'acc_005', label: '游戏投放账户', advertiserId: '100005' },
  { value: 'acc_006', label: '教育投放账户', advertiserId: '100006' },
];

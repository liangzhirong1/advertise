import React, { useState } from 'react';
import {
  Card,
  Table,
  Tag,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  Progress,
  message,
  Divider,
  Badge,
  Popconfirm,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  PlusOutlined,
  ThunderboltOutlined,
  KeyOutlined,
  SyncOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  StopOutlined,
  LinkOutlined,
  CopyOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  mockOAuthEntities,
  mockOAuthAccounts,
  mockOAuthUrl,
  type OAuthEntity,
  type OAuthAccount,
  type AuthStatus,
  type QualificationStatus,
} from '../data/mockOAuth';
import { useResponsive } from '../hooks/useResponsive';

// ============================================================
// 常量
// ============================================================

const AUTH_STATUS_CONFIG: Record<AuthStatus, { label: string; color: string; icon: React.ReactNode }> = {
  authorized: { label: '正常', color: 'green', icon: <CheckCircleOutlined /> },
  expired: { label: '已过期', color: 'red', icon: <ClockCircleOutlined /> },
  revoked: { label: '已撤销', color: 'default', icon: <StopOutlined /> },
};

const QUALIFICATION_CONFIG: Record<QualificationStatus, { label: string; color: string }> = {
  passed: { label: '已通过', color: 'green' },
  pending: { label: '审核中', color: 'orange' },
  rejected: { label: '已驳回', color: 'red' },
};

// ============================================================
// 主组件
// ============================================================

const AccountManagement: React.FC = () => {
  const { isMobile } = useResponsive();
  const [entities, setEntities] = useState<OAuthEntity[]>(mockOAuthEntities);
  const [accounts, setAccounts] = useState<OAuthAccount[]>(mockOAuthAccounts);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [entityModalVisible, setEntityModalVisible] = useState(false);
  const [oauthModalVisible, setOauthModalVisible] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<OAuthEntity | null>(null);
  const [entityForm] = Form.useForm();
  const [entityFilter, setEntityFilter] = useState<string | undefined>(undefined);
  const [authStatusFilter, setAuthStatusFilter] = useState<AuthStatus | undefined>(undefined);

  // ---- 新建主体 ----
  const handleCreateEntity = async () => {
    try {
      const values = await entityForm.validateFields();
      const newEntity: OAuthEntity = {
        key: `ent_${Date.now()}`,
        entityName: values.entityName,
        developerId: values.developerId,
        appSecret: `sk_****${values.appSecret.slice(-8)}`,
        createdAt: new Date().toISOString().slice(0, 10),
        authorizedAccounts: 0,
        totalAccounts: 0,
        status: 'active',
      };
      setEntities((prev) => [newEntity, ...prev]);
      setEntityModalVisible(false);
      entityForm.resetFields();
      message.success('主体应用已创建');
    } catch {
      // validation error
    }
  };

  // ---- 批量授权 ----
  const handleBatchAuthorize = (entity: OAuthEntity) => {
    setSelectedEntity(entity);
    setOauthModalVisible(true);
  };

  // ---- 复制授权 URL ----
  const copyOAuthUrl = () => {
    if (!selectedEntity) return;
    const url = mockOAuthUrl(selectedEntity.key);
    navigator.clipboard?.writeText(url);
    message.success('授权 URL 已复制到剪贴板');
  };

  // ---- 批量刷新 Token ----
  const handleRefreshTokens = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要刷新的账户');
      return;
    }
    setAccounts((prev) =>
      prev.map((acc) =>
        selectedRowKeys.includes(acc.key)
          ? {
              ...acc,
              authStatus: 'authorized' as AuthStatus,
              tokenExpiresAt: '2026-06-08 10:00',
              lastAuthAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
            }
          : acc
      )
    );
    message.success(`成功刷新 ${selectedRowKeys.length} 个账户的授权 Token`);
    setSelectedRowKeys([]);
  };

  // ---- 单个刷新 Token ----
  const handleRefreshSingleToken = (record: OAuthAccount) => {
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.key === record.key
          ? {
              ...acc,
              authStatus: 'authorized' as AuthStatus,
              tokenExpiresAt: '2026-06-08 10:00',
              lastAuthAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
            }
          : acc
      )
    );
    message.success(`已刷新「${record.advertiserName}」的 Token`);
  };

  // ---- 余额颜色 ----
  const getBalanceColor = (balance: number): string => {
    if (balance >= 30000) return '#52c41a';
    if (balance >= 10000) return '#1890ff';
    if (balance > 0) return '#faad14';
    return '#ff4d4f';
  };

  // ---- 资质进度颜色 ----
  const getQualificationColor = (status: QualificationStatus): string => {
    return QUALIFICATION_CONFIG[status].color;
  };

  // ---- 过滤后的账户 ----
  const filteredAccounts = accounts.filter((acc) => {
    if (entityFilter && acc.entityId !== entityFilter) return false;
    if (authStatusFilter && acc.authStatus !== authStatusFilter) return false;
    return true;
  });

  // ---- 主体选项 ----
  const entityOptions = entities.map((e) => ({
    value: e.key,
    label: e.entityName,
  }));

  // ---- 表格行样式 ----
  const rowClassName = (record: OAuthAccount) => {
    if (record.authStatus === 'expired') return 'expired-row';
    return '';
  };

  // ---- 表格列定义 ----
  const columns: ColumnsType<OAuthAccount> = [
    {
      title: '账户名称/ID',
      key: 'advertiser',
      width: 200,
      fixed: 'left',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500, marginBottom: 2 }}>{record.advertiserName}</div>
          <div style={{ fontSize: 11, color: '#bfbfbf', fontFamily: 'monospace' }}>
            {record.advertiserId}
          </div>
        </div>
      ),
    },
    {
      title: '所属主体',
      dataIndex: 'entityName',
      key: 'entityName',
      width: 150,
      render: (name: string) => (
        <Tag color="purple" style={{ fontSize: 11 }}>
          {name}
        </Tag>
      ),
    },
    {
      title: '授权状态',
      dataIndex: 'authStatus',
      key: 'authStatus',
      width: 110,
      render: (status: AuthStatus) => {
        const cfg = AUTH_STATUS_CONFIG[status];
        return (
          <Tag icon={cfg.icon} color={cfg.color}>
            {cfg.label}
          </Tag>
        );
      },
    },
    {
      title: 'Token 过期时间',
      dataIndex: 'tokenExpiresAt',
      key: 'tokenExpiresAt',
      width: 160,
      render: (val: string, record: OAuthAccount) => (
        <span style={{ color: record.authStatus === 'expired' ? '#ff4d4f' : '#8c8c8c', fontSize: 12 }}>
          {val}
        </span>
      ),
    },
    {
      title: '实时余额',
      dataIndex: 'balance',
      key: 'balance',
      width: 120,
      sorter: (a, b) => a.balance - b.balance,
      render: (val: number) => (
        <span style={{ fontWeight: 700, color: getBalanceColor(val), fontSize: 15 }}>
          ¥{val.toLocaleString()}
        </span>
      ),
    },
    {
      title: '资质状态',
      key: 'qualification',
      width: 160,
      render: (_, record: OAuthAccount) => (
        <div>
          <div style={{ marginBottom: 4 }}>
            <Tag color={getQualificationColor(record.qualificationStatus)} style={{ fontSize: 11 }}>
              {QUALIFICATION_CONFIG[record.qualificationStatus].label}
            </Tag>
          </div>
          <Progress
            percent={record.qualificationProgress}
            size="small"
            strokeColor={getQualificationColor(record.qualificationStatus)}
            style={{ marginBottom: 0 }}
          />
        </div>
      ),
    },
    {
      title: '最后授权时间',
      dataIndex: 'lastAuthAt',
      key: 'lastAuthAt',
      width: 150,
      render: (val: string) => (
        <span style={{ fontSize: 12, color: '#8c8c8c' }}>{val}</span>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 140,
      fixed: 'right',
      render: (_, record: OAuthAccount) => (
        <Space>
          {record.authStatus === 'expired' && (
            <Button
              type="link"
              size="small"
              icon={<SyncOutlined />}
              onClick={() => handleRefreshSingleToken(record)}
            >
              刷新
            </Button>
          )}
          <Button type="link" size="small">详情</Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* ==================== 主体应用卡片区 ==================== */}
      <Card
        bordered={false}
        style={{ borderRadius: 12 }}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ThunderboltOutlined style={{ color: '#722ed1' }} />
            <span style={{ fontSize: 15 }}>主体应用管理</span>
            <Badge count={entities.length} style={{ backgroundColor: '#722ed1' }} />
          </div>
        }
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setEntityModalVisible(true)}
          >
            新增主体应用
          </Button>
        }
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: isMobile ? 12 : 16,
          }}
        >
          {entities.map((entity) => (
            <Card
              key={entity.key}
              hoverable
              size="small"
              style={{
                borderRadius: 12,
                borderLeft: `4px solid ${entity.status === 'active' ? '#722ed1' : '#d9d9d9'}`,
              }}
              bodyStyle={{ padding: 16 }}
            >
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>
                  {entity.entityName}
                </div>
                <div style={{ fontSize: 11, color: '#8c8c8c', fontFamily: 'monospace', marginBottom: 8 }}>
                  <KeyOutlined style={{ marginRight: 4 }} />
                  {entity.developerId}
                </div>
                <div style={{ fontSize: 11, color: '#8c8c8c', fontFamily: 'monospace', marginBottom: 8 }}>
                  <KeyOutlined style={{ marginRight: 4 }} />
                  {entity.appSecret}
                </div>
                <div style={{ fontSize: 12, color: '#8c8c8c' }}>
                  创建于 {entity.createdAt}
                </div>
              </div>

              <Divider style={{ margin: '8px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: '#1a1a1a' }}>
                    {entity.authorizedAccounts}
                  </div>
                  <div style={{ fontSize: 11, color: '#8c8c8c' }}>已授权</div>
                </div>
                <div style={{ width: 1, height: 32, background: '#f0f0f0' }} />
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: '#1a1a1a' }}>
                    {entity.totalAccounts}
                  </div>
                  <div style={{ fontSize: 11, color: '#8c8c8c' }}>总账户</div>
                </div>
              </div>

              <Button
                type="primary"
                block
                icon={<LinkOutlined />}
                onClick={() => handleBatchAuthorize(entity)}
                disabled={entity.status === 'inactive'}
              >
                批量接入账户
              </Button>
            </Card>
          ))}
        </div>
      </Card>

      {/* ==================== 账户列表表格 ==================== */}
      <Card
        bordered={false}
        style={{ borderRadius: 12 }}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <UserOutlined style={{ color: '#1890ff' }} />
            <span style={{ fontSize: 15 }}>广告账户列表</span>
            <Badge count={accounts.length} style={{ backgroundColor: '#1890ff' }} />
          </div>
        }
      >
        {/* 筛选栏 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16,
            flexWrap: 'wrap',
            gap: isMobile ? 8 : 12,
          }}
        >
          <Space wrap>
            <Select
              allowClear
              placeholder="按主体筛选"
              style={{ width: isMobile ? '100%' : 180 }}
              size="small"
              value={entityFilter}
              onChange={setEntityFilter}
              options={entityOptions}
            />
            <Select
              allowClear
              placeholder="授权状态"
              style={{ width: isMobile ? '100%' : 130 }}
              size="small"
              value={authStatusFilter}
              onChange={setAuthStatusFilter}
              options={Object.entries(AUTH_STATUS_CONFIG).map(([value, cfg]) => ({
                value,
                label: cfg.label,
              }))}
            />
          </Space>
          <Popconfirm
            title="确认刷新"
            description="将刷新所有选中账户的 OAuth Token"
            onConfirm={handleRefreshTokens}
          >
            <Button icon={<SyncOutlined />} disabled={selectedRowKeys.length === 0}>
              批量刷新 Token
            </Button>
          </Popconfirm>
        </div>

        {/* 表格 */}
        <Table<OAuthAccount>
          columns={columns}
          dataSource={filteredAccounts}
          rowClassName={rowClassName}
          rowSelection={{
            selectedRowKeys,
            onChange: (keys) => setSelectedRowKeys(keys),
          }}
          pagination={{
            pageSize: isMobile ? 5 : 10,
            showTotal: (total) => `共 ${total} 个账户`,
          }}
          scroll={{ x: 1300 }}
          size={isMobile ? 'small' : 'middle'}
        />
      </Card>

      {/* ==================== 新建主体 Modal ==================== */}
      <Modal
        title="新增主体应用"
        open={entityModalVisible}
        onOk={handleCreateEntity}
        onCancel={() => {
          setEntityModalVisible(false);
          entityForm.resetFields();
        }}
        okText="创建"
        cancelText="取消"
        destroyOnClose
      >
        <Form form={entityForm} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item label="主体名称" name="entityName" rules={[{ required: true, message: '请输入主体名称' }]}>
            <Input placeholder="例如：XX科技有限公司" size="large" />
          </Form.Item>
          <Form.Item
            label="Developer App ID"
            name="developerId"
            rules={[
              { required: true, message: '请输入 Developer App ID' },
              { pattern: /^cli_[a-z0-9]{16}$/, message: '格式应为 cli_ 开头 + 16位小写字母数字' },
            ]}
          >
            <Input placeholder="cli_xxxxxxxxxxxxxxxx" size="large" />
          </Form.Item>
          <Form.Item
            label="App Secret"
            name="appSecret"
            rules={[
              { required: true, message: '请输入 App Secret' },
              { pattern: /^sk_[a-f0-9]{32}$/, message: '格式应为 sk_ 开头 + 32位十六进制' },
            ]}
          >
            <Input.Password placeholder="sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" size="large" />
          </Form.Item>
        </Form>
      </Modal>

      {/* ==================== OAuth 授权模拟 Modal ==================== */}
      <Modal
        title="OAuth 2.0 授权流程"
        open={oauthModalVisible}
        onCancel={() => setOauthModalVisible(false)}
        destroyOnClose
        footer={[
          <Button key="copy" icon={<CopyOutlined />} onClick={copyOAuthUrl}>
            复制授权 URL
          </Button>,
          <Button
            key="simulate"
            type="primary"
            icon={<LinkOutlined />}
            onClick={() => {
              message.success('已模拟完成 OAuth 授权跳转');
              setOauthModalVisible(false);
            }}
          >
            模拟授权跳转
          </Button>,
        ]}
      >
        {selectedEntity && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <Tag color="purple">{selectedEntity.entityName}</Tag>
              <span style={{ marginLeft: 8, color: '#8c8c8c' }}>
                Developer ID: {selectedEntity.developerId}
              </span>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, color: '#8c8c8c', marginBottom: 8 }}>
                授权 URL（巨量引擎 OAuth 2.0）：
              </div>
              <Input
                value={mockOAuthUrl(selectedEntity.key)}
                readOnly
                size="large"
                style={{ fontFamily: 'monospace', fontSize: 12 }}
              />
            </div>
            <div style={{ padding: 16, background: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: 8, fontSize: 13, color: '#52c41a' }}>
              <CheckCircleOutlined style={{ marginRight: 8 }} />
              授权流程说明：
              <ol style={{ margin: '8px 0 0 20px', lineHeight: 1.8 }}>
                <li>用户点击「模拟授权跳转」将跳转至巨量引擎授权页面</li>
                <li>用户在授权页面同意权限申请</li>
                <li>巨量引擎回调 redirect_uri 并返回 authorization_code</li>
                <li>服务端使用 code 换取 access_token 和 refresh_token</li>
                <li>token 有效期 30 天，可使用 refresh_token 自动续期</li>
              </ol>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AccountManagement;

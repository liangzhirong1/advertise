import React, { useState } from 'react';
import {
  Card,
  Tabs,
  Checkbox,
  List,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Tag,
  TreeSelect,
  message,
  Popconfirm,
  Badge,
  Avatar,
} from 'antd';
import {
  ThunderboltOutlined,
  UserAddOutlined,
  KeyOutlined,
  SwapOutlined,
  SafetyOutlined,
} from '@ant-design/icons';
import {
  mockRoles,
  mockRBACUsers,
  allPermissions,
  mockAccountTreeOptions,
  type RoleType,
  type RBACUser,
} from '../data/mockPermissions';
import { useResponsive } from '../hooks/useResponsive';

// ============================================================
// 常量
// ============================================================

const ROLE_KEYS: RoleType[] = ['admin', 'team_lead', 'optimizer', 'analyst'];

const ROLE_ICONS = {
  admin: <SafetyOutlined />,
  team_lead: <ThunderboltOutlined />,
  optimizer: <SwapOutlined />,
  analyst: <SafetyOutlined />,
};

// ============================================================
// 主组件
// ============================================================

const PermissionCenter: React.FC = () => {
  const { isMobile } = useResponsive();
  // ---- 状态 ----
  const [roles, setRoles] = useState(mockRoles);
  const [users, setUsers] = useState<RBACUser[]>(mockRBACUsers);
  const [activeRole, setActiveRole] = useState<RoleType>('admin');
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [accountModalVisible, setAccountModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<RBACUser | null>(null);
  const [userForm] = Form.useForm();
  const [accountForm] = Form.useForm();

  // ---- 权限分类 ----
  const permissionCategories = Array.from(new Set(allPermissions.map((p) => p.category)));

  // ---- 当前角色 ----
  const currentRole = roles.find((r) => r.key === activeRole)!;

  // ---- 当前角色下的用户 ----
  const roleUsers = users.filter((u) => u.role === activeRole);

  // ---- 切换权限 ----
  const handlePermissionChange = (checkedValues: string[]) => {
    setRoles((prev) =>
      prev.map((r) => (r.key === activeRole ? { ...r, permissions: checkedValues } : r))
    );
    message.success('权限已更新');
  };

  // ---- 打开新建用户弹窗 ----
  const openCreateUser = () => {
    setEditingUser(null);
    userForm.resetFields();
    userForm.setFieldsValue({ role: activeRole, status: 'active' });
    setUserModalVisible(true);
  };

  // ---- 打开编辑用户弹窗 ----
  const openEditUser = (user: RBACUser) => {
    setEditingUser(user);
    userForm.setFieldsValue(user);
    setUserModalVisible(true);
  };

  // ---- 提交用户表单 ----
  const handleUserSubmit = async () => {
    try {
      const values = await userForm.validateFields();
      if (editingUser) {
        setUsers((prev) =>
          prev.map((u) => (u.key === editingUser.key ? { ...u, ...values } : u))
        );
        message.success('用户已更新');
      } else {
        const newUser: RBACUser = {
          key: `user_${Date.now()}`,
          ...values,
          assignedAccounts: values.role === 'optimizer' ? [] : ['all'],
          lastLogin: '-',
        };
        setUsers((prev) => [newUser, ...prev]);
        message.success('用户已创建');
      }
      setUserModalVisible(false);
    } catch {
      // validation error
    }
  };

  // ---- 重置密码 ----
  const handleResetPassword = (user: RBACUser) => {
    message.success(`已重置用户「${user.name}」的密码为默认密码`);
  };

  // ---- 切换角色 ----
  const handleChangeRole = (user: RBACUser) => {
    setEditingUser(user);
    userForm.setFieldsValue({ role: user.role });
    Modal.confirm({
      title: '修改用户角色',
      content: (
        <Form layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item label="新角色" name="role">
            <Select
              options={ROLE_KEYS.map((k) => {
                const role = roles.find((r) => r.key === k)!;
                return { value: k, label: role.name };
              })}
            />
          </Form.Item>
        </Form>
      ),
      onOk: () => {
        message.success(`已将「${user.name}」的角色修改`);
      },
    });
  };

  // ---- 关联账户（优化师） ----
  const openAccountAssign = (user: RBACUser) => {
    setEditingUser(user);
    accountForm.setFieldsValue({ assignedAccounts: user.assignedAccounts });
    setAccountModalVisible(true);
  };

  const handleAccountAssign = async () => {
    try {
      const values = await accountForm.validateFields();
      if (editingUser) {
        setUsers((prev) =>
          prev.map((u) =>
            u.key === editingUser.key ? { ...u, assignedAccounts: values.assignedAccounts } : u
          )
        );
        message.success('账户关联已更新');
      }
      setAccountModalVisible(false);
    } catch {
      // validation error
    }
  };

  // ---- Tabs 项 ----
  const tabItems = ROLE_KEYS.map((key) => {
    const role = roles.find((r) => r.key === key)!;
    const userCount = users.filter((u) => u.role === key).length;
    return {
      key,
      label: (
        <span>
          {ROLE_ICONS[key]}
          {role.name}
          <Badge count={userCount} style={{ marginLeft: 8, backgroundColor: role.color }} />
        </span>
      ),
    };
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* ==================== 角色权限配置 ==================== */}
      <Card
        bordered={false}
        style={{ borderRadius: 12 }}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <SafetyOutlined style={{ color: '#722ed1' }} />
            <span style={{ fontSize: 15 }}>角色权限配置</span>
          </div>
        }
      >
        <Tabs
          activeKey={activeRole}
          onChange={(key) => setActiveRole(key as RoleType)}
          items={tabItems}
          tabBarStyle={{ marginBottom: 24 }}
        />

        {/* 角色描述 */}
        <div
          style={{
            padding: 16,
            background: `${currentRole.color}10`,
            borderLeft: `4px solid ${currentRole.color}`,
            borderRadius: 8,
            marginBottom: 24,
          }}
        >
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>
            {currentRole.name}
          </div>
          <div style={{ fontSize: 13, color: '#8c8c8c' }}>
            {currentRole.description}
          </div>
        </div>

        {/* 权限矩阵 */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))', gap: isMobile ? 12 : 24 }}>
          {permissionCategories.map((category) => {
            const categoryPermissions = allPermissions.filter((p) => p.category === category);
            const checkedValues = currentRole.permissions.filter((pk) =>
              categoryPermissions.some((cp) => cp.key === pk)
            );

            return (
              <div
                key={category}
                style={{
                  padding: 16,
                  border: '1px solid #f0f0f0',
                  borderRadius: 8,
                }}
              >
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: 14,
                    marginBottom: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>{category}</span>
                  <span style={{ fontSize: 12, color: '#8c8c8c' }}>
                    {checkedValues.length}/{categoryPermissions.length}
                  </span>
                </div>
                <Checkbox.Group
                  value={currentRole.permissions}
                  onChange={handlePermissionChange}
                  style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
                >
                  {categoryPermissions.map((perm) => (
                    <div
                      key={perm.key}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 8,
                        padding: '6px 8px',
                        borderRadius: 6,
                        background: currentRole.permissions.includes(perm.key) ? '#e6f7ff' : '#fafafa',
                        transition: 'background 0.2s',
                      }}
                    >
                      <Checkbox value={perm.key} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 500, fontSize: 13 }}>{perm.label}</div>
                        <div style={{ fontSize: 11, color: '#8c8c8c' }}>{perm.description}</div>
                      </div>
                    </div>
                  ))}
                </Checkbox.Group>
              </div>
            );
          })}
        </div>
      </Card>

      {/* ==================== 用户管理 ==================== */}
      <Card
        bordered={false}
        style={{ borderRadius: 12 }}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 15 }}>
              {currentRole.name} - 用户列表
            </span>
          </div>
        }
        extra={
          <Button type="primary" icon={<UserAddOutlined />} onClick={openCreateUser}>
            新增用户
          </Button>
        }
      >
        <List
          dataSource={roleUsers}
          renderItem={(user) => (
            <List.Item
              style={{
                padding: '16px 24px',
                background: user.status === 'disabled' ? '#fafafa' : '#fff',
                borderRadius: 8,
                marginBottom: 8,
              }}
              actions={[
                <Button key="edit" type="link" size="small" onClick={() => openEditUser(user)}>
                  编辑
                </Button>,
                <Popconfirm
                  key="reset"
                  title="确认重置密码"
                  onConfirm={() => handleResetPassword(user)}
                >
                  <Button key="resetBtn" type="link" size="small" icon={<KeyOutlined />}>
                    重置密码
                  </Button>
                </Popconfirm>,
                <Button key="role" type="link" size="small" onClick={() => handleChangeRole(user)}>
                  切换角色
                </Button>,
                user.role === 'optimizer' && (
                  <Button
                    key="account"
                    type="link"
                    size="small"
                    icon={<SwapOutlined />}
                    onClick={() => openAccountAssign(user)}
                  >
                    关联账户
                  </Button>
                ),
              ].filter(Boolean)}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    style={{
                      backgroundColor:
                        user.status === 'disabled' ? '#d9d9d9' : currentRole.color,
                    }}
                  >
                    {user.name.charAt(0)}
                  </Avatar>
                }
                title={
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 500 }}>{user.name}</span>
                    <Tag color={user.status === 'active' ? 'green' : 'default'} style={{ fontSize: 11 }}>
                      {user.status === 'active' ? '在职' : '离职'}
                    </Tag>
                  </div>
                }
                description={
                  <div style={{ display: 'flex', gap: 24, fontSize: 12, color: '#8c8c8c' }}>
                    <span>{user.email}</span>
                    <span>{user.phone}</span>
                    <span>最后登录: {user.lastLogin}</span>
                    {user.role === 'optimizer' && (
                      <span>
                        负责账户:{' '}
                        {user.assignedAccounts.includes('all') ? (
                          <Tag color="blue" style={{ fontSize: 11 }}>全部</Tag>
                        ) : (
                          user.assignedAccounts.map((id) => (
                            <Tag key={id} style={{ fontSize: 11 }}>{id}</Tag>
                          ))
                        )}
                      </span>
                    )}
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Card>

      {/* ==================== 新建/编辑用户 Modal ==================== */}
      <Modal
        title={editingUser ? '编辑用户' : '新增用户'}
        open={userModalVisible}
        onOk={handleUserSubmit}
        onCancel={() => {
          setUserModalVisible(false);
          userForm.resetFields();
        }}
        okText="保存"
        cancelText="取消"
        destroyOnClose
      >
        <Form form={userForm} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item label="姓名" name="name" rules={[{ required: true, message: '请输入姓名' }]}>
            <Input placeholder="请输入姓名" size="large" />
          </Form.Item>
          <Form.Item
            label="邮箱"
            name="email"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' },
            ]}
          >
            <Input placeholder="user@company.com" size="large" />
          </Form.Item>
          <Form.Item label="手机号" name="phone" rules={[{ required: true, message: '请输入手机号' }]}>
            <Input placeholder="请输入手机号" size="large" maxLength={11} />
          </Form.Item>
          <Form.Item label="角色" name="role" rules={[{ required: true, message: '请选择角色' }]}>
            <Select
              options={ROLE_KEYS.map((k) => {
                const role = roles.find((r) => r.key === k)!;
                return { value: k, label: role.name };
              })}
              size="large"
            />
          </Form.Item>
          <Form.Item label="状态" name="status" valuePropName="checked" getValueFromEvent={(checked) => (checked ? 'active' : 'disabled')}>
            <Select
              options={[
                { value: 'active', label: '在职' },
                { value: 'disabled', label: '离职' },
              ]}
              size="large"
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* ==================== 关联账户 Modal ==================== */}
      <Modal
        title={`为「${editingUser?.name}」分配账户`}
        open={accountModalVisible}
        onOk={handleAccountAssign}
        onCancel={() => {
          setAccountModalVisible(false);
          accountForm.resetFields();
        }}
        okText="确认分配"
        cancelText="取消"
        destroyOnClose
      >
        <Form form={accountForm} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            label="选择账户"
            name="assignedAccounts"
            rules={[{ required: true, message: '请至少选择一个账户' }]}
            extra="选择该优化师可管理的广告账户，留空表示无权限"
          >
            <TreeSelect
              treeData={mockAccountTreeOptions}
              placeholder="搜索并选择账户"
              multiple
              treeCheckable
              showSearch
              filterTreeNode={(input, node) =>
                (node.title as string)?.toLowerCase().includes(input.toLowerCase())
              }
              size="large"
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PermissionCenter;

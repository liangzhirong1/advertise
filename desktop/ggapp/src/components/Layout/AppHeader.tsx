import React from 'react';
import { Layout, Select, Badge, Avatar, Breadcrumb } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import { routes } from '../../routes/config';
import { mockAccounts } from '../../data/mockAccounts';

const { Header } = Layout;

interface AppHeaderProps {
  collapsed: boolean;
  onCollapse: () => void;
  isMobile: boolean;
}

const getBreadcrumbItems = (pathname: string) => {
  const route = routes.find((r) => r.path === pathname);
  if (!route) return [];
  return [
    { title: '首页' },
    { title: route.label },
  ];
};

const AppHeader: React.FC<AppHeaderProps> = ({ collapsed, onCollapse, isMobile }) => {
  const location = useLocation();
  const [selectedAccounts, setSelectedAccounts] = React.useState<string[]>(['acc_001']);

  const breadcrumbItems = getBreadcrumbItems(location.pathname);

  return (
    <Header
      style={{
        background: '#fff',
        padding: isMobile ? '0 12px' : '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #f0f0f0',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        flexWrap: isMobile ? 'wrap' : 'nowrap',
        minHeight: isMobile ? 'auto' : 64,
        height: isMobile ? 'auto' : 64,
      }}
    >
      {/* Left: Toggle + Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 8 : 16, flexShrink: 0 }}>
        <button
          onClick={onCollapse}
          style={{
            background: 'none',
            border: 'none',
            fontSize: 18,
            cursor: 'pointer',
            color: '#595959',
            padding: 4,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </button>

        {!isMobile && breadcrumbItems.length > 0 && (
          <Breadcrumb items={breadcrumbItems} />
        )}
        {isMobile && breadcrumbItems.length > 0 && (
          <span style={{ fontSize: 14, fontWeight: 500, color: '#1a1a1a' }}>
            {breadcrumbItems[breadcrumbItems.length - 1]?.title || ''}
          </span>
        )}
      </div>

      {/* Right: Account Switcher + Notifications + User */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: isMobile ? 12 : 20,
          flexShrink: 0,
        }}
      >
        {/* Account Switcher - hidden on mobile */}
        {!isMobile && (
          <Select
            mode="multiple"
            allowClear
            style={{ minWidth: 200, maxWidth: 280 }}
            placeholder="选择广告账户"
            value={selectedAccounts}
            onChange={(value) => setSelectedAccounts(value)}
            options={mockAccounts.map((acc) => ({
              value: acc.value,
              label: acc.label,
            }))}
            dropdownRender={(menu) => (
              <>
                <div style={{ padding: '8px 12px', fontSize: 12, color: '#8c8c8c' }}>
                  已选 {selectedAccounts.length} 个账户
                </div>
                {menu}
              </>
            )}
          />
        )}

        {/* Notification Bell */}
        <Badge count={isMobile ? 5 : undefined} size={isMobile ? 'small' : 'default'} offset={isMobile ? [-4, 4] : [-6, 6]}>
          <BellOutlined
            style={{ fontSize: isMobile ? 16 : 18, color: '#595959', cursor: 'pointer' }}
          />
        </Badge>

        {/* User Avatar */}
        <Avatar
          style={{
            backgroundColor: '#667eea',
            cursor: 'pointer',
            width: isMobile ? 28 : 32,
            height: isMobile ? 28 : 32,
          }}
          icon={<UserOutlined />}
          size={isMobile ? 'small' : 'default'}
        />
      </div>
    </Header>
  );
};

export default AppHeader;

import React from 'react';
import { Layout, Menu, type MenuProps, Drawer } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { menuItems } from '../../routes/config';
import { CloseOutlined } from '@ant-design/icons';

const { Sider } = Layout;

interface AppSidebarProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
  mobileOpen: boolean;
  isMobile: boolean;
}

const AppSidebar: React.FC<AppSidebarProps> = ({
  collapsed,
  onCollapse,
  mobileOpen,
  isMobile,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    navigate(key);
    if (isMobile) {
      onCollapse(true); // 移动端点击菜单后关闭
    }
  };

  const menuContent = (
    <>
      {/* Logo 区域 */}
      <div
        style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          padding: collapsed ? '0 16px' : '0 24px',
          borderBottom: '1px solid #f0f0f0',
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 6,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 'bold',
              fontSize: 14,
              flexShrink: 0,
            }}
          >
            巨
          </div>
          {!collapsed && (
            <span
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: '#1a1a1a',
                whiteSpace: 'nowrap',
              }}
            >
              巨量引擎
            </span>
          )}
        </div>
        {/* 移动端关闭按钮 */}
        {isMobile && (
          <button
            onClick={() => onCollapse(true)}
            style={{
              position: 'absolute',
              right: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              fontSize: 16,
              cursor: 'pointer',
              color: '#8c8c8c',
              padding: 4,
            }}
          >
            <CloseOutlined />
          </button>
        )}
      </div>

      {/* 菜单 */}
      <Menu
        theme="light"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={handleMenuClick}
        style={{ borderRight: 'none', paddingTop: 8 }}
      />
    </>
  );

  // 移动端：使用 Drawer 覆盖层
  if (isMobile) {
    return (
      <Drawer
        open={mobileOpen}
        onClose={() => onCollapse(true)}
        width={260}
        placement="left"
        closable={false}
        destroyOnClose
        styles={{
          body: { padding: 0 },
          mask: { backgroundColor: 'rgba(0,0,0,0.3)' },
        }}
      >
        {menuContent}
      </Drawer>
    );
  }

  // 桌面端：使用 Sider
  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      theme="light"
      width={220}
      collapsedWidth={80}
      style={{
        borderRight: '1px solid #f0f0f0',
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflow: 'auto',
        flexShrink: 0,
      }}
    >
      {menuContent}
    </Sider>
  );
};

export default AppSidebar;

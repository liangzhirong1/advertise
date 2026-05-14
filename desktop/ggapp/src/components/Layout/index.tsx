import React, { useState } from 'react';
import { Layout } from 'antd';
import AppSidebar from './AppSidebar';
import AppHeader from './AppHeader';
import { useResponsive } from '../../hooks/useResponsive';

const { Content } = Layout;

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { isMobile } = useResponsive();
  const [collapsed, setCollapsed] = useState(isMobile);
  const [mobileOpen, setMobileOpen] = useState(false);

  // 当屏幕尺寸变化时自动调整 collapsed 状态
  React.useEffect(() => {
    if (isMobile) {
      setCollapsed(true);
      setMobileOpen(false);
    }
  }, [isMobile]);

  const handleCollapse = (newCollapsed: boolean) => {
    setCollapsed(newCollapsed);
    if (isMobile) {
      setMobileOpen(!newCollapsed);
    }
  };

  const handleMobileToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AppSidebar
        collapsed={isMobile ? false : collapsed}
        onCollapse={handleCollapse}
        mobileOpen={mobileOpen}
        isMobile={isMobile}
      />
      <Layout>
        <AppHeader
          collapsed={collapsed}
          onCollapse={handleMobileToggle}
          isMobile={isMobile}
        />
        <Content
          style={{
            padding: isMobile ? 12 : 24,
            background: '#f5f5f5',
            minHeight: 'calc(100vh - 64px)',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;

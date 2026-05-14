import React, { lazy, type ComponentType } from 'react';
import {
  DashboardOutlined,
  TeamOutlined,
  FolderOutlined,
  RocketOutlined,
  AlertOutlined,
  SafetyOutlined,
  SearchOutlined,
  CommentOutlined,
  LinkOutlined,
} from '@ant-design/icons';

export interface RouteItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  component: ComponentType;
}

export const menuItems = [
  { key: '/dashboard', label: '数据看板', icon: <DashboardOutlined /> },
  { key: '/accounts', label: '账户管理', icon: <TeamOutlined /> },
  { key: '/assets', label: '资产库', icon: <FolderOutlined /> },
  { key: '/campaigns', label: '批量投放', icon: <RocketOutlined /> },
  { key: '/alerts', label: '监控告警', icon: <AlertOutlined /> },
  { key: '/permissions', label: '权限中心', icon: <SafetyOutlined /> },
  { key: '/diagnostic', label: '单元诊断', icon: <SearchOutlined /> },
  { key: '/comments', label: '评论管理', icon: <CommentOutlined /> },
  { key: '/events', label: '事件与监测', icon: <LinkOutlined /> },
];

export const routes: RouteItem[] = [
  {
    key: '/dashboard',
    label: '数据看板',
    icon: <DashboardOutlined />,
    path: '/dashboard',
    component: lazy(() => import('../pages/Dashboard')),
  },
  {
    key: '/accounts',
    label: '账户管理',
    icon: <TeamOutlined />,
    path: '/accounts',
    component: lazy(() => import('../pages/AccountManagement')),
  },
  {
    key: '/assets',
    label: '资产库',
    icon: <FolderOutlined />,
    path: '/assets',
    component: lazy(() => import('../pages/AssetLibrary')),
  },
  {
    key: '/campaigns',
    label: '批量投放',
    icon: <RocketOutlined />,
    path: '/campaigns',
    component: lazy(() => import('../pages/CampaignOperations')),
  },
  {
    key: '/alerts',
    label: '监控告警',
    icon: <AlertOutlined />,
    path: '/alerts',
    component: lazy(() => import('../pages/RiskAlerts')),
  },
  {
    key: '/permissions',
    label: '权限中心',
    icon: <SafetyOutlined />,
    path: '/permissions',
    component: lazy(() => import('../pages/PermissionCenter')),
  },
  {
    key: '/diagnostic',
    label: '单元诊断',
    icon: <SearchOutlined />,
    path: '/diagnostic',
    component: lazy(() => import('../pages/AdDiagnostic')),
  },
  {
    key: '/comments',
    label: '评论管理',
    icon: <CommentOutlined />,
    path: '/comments',
    component: lazy(() => import('../pages/CommentManagement')),
  },
  {
    key: '/events',
    label: '事件与监测',
    icon: <LinkOutlined />,
    path: '/events',
    component: lazy(() => import('../pages/EventManagement')),
  },
];

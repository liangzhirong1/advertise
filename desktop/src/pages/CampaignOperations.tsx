import React, { useState, useMemo, useCallback } from 'react';
import {
  Card,
  Tree,
  Input,
  Select,
  Button,
  Space,
  Table,
  Switch,
  InputNumber,
  Tooltip,
  Tag,
  Divider,
  message,
  Modal,
  Popconfirm,
  Badge,
  Dropdown,
  type MenuProps,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
  BankOutlined,
  RocketOutlined,
  StopOutlined,
  FilterOutlined,
  ExclamationCircleOutlined,
  BarChartOutlined,
  DollarOutlined,
  RiseOutlined,
  FallOutlined,
  DownOutlined,
} from '@ant-design/icons';
import type { DataNode } from 'antd/es/tree';
import type { ColumnsType } from 'antd/es/table';
import {
  mockOrgTree,
  mockAdPlans,
  type OrganizationTreeNode,
  type AdPlan,
  type AdStatus,
} from '../data/mockCampaignData';
import BatchCreatePlanModal from '../components/BatchCreatePlanModal';
import { useResponsive } from '../hooks/useResponsive';

// ============================================================
// 常量
// ============================================================

const STATUS_CONFIG: Record<
  AdStatus,
  { label: string; color: string; icon: React.ReactNode }
> = {
  running: { label: '投放中', color: 'green', icon: <RocketOutlined /> },
  paused: { label: '已暂停', color: 'orange', icon: <StopOutlined /> },
  disabled: { label: '已停止', color: 'default', icon: <StopOutlined /> },
  pending_review: { label: '审核中', color: 'blue', icon: <FilterOutlined /> },
};

/** 树节点状态配置 (OrganizationTreeNode.status) */
const TREE_NODE_STATUS_CONFIG: Record<
  'active' | 'paused' | 'disabled',
  { label: string; color: string }
> = {
  active: { label: '投放中', color: 'green' },
  paused: { label: '已暂停', color: 'orange' },
  disabled: { label: '已停止', color: 'default' },
};

// ============================================================
// 工具函数
// ============================================================

/** 递归获取所有 campaign key */
function getAllCampaignKeys(nodes: OrganizationTreeNode[]): string[] {
  const keys: string[] = [];
  const traverse = (list: OrganizationTreeNode[]) => {
    list.forEach((node) => {
      if (node.type === 'campaign') {
        keys.push(node.key);
      }
      if (node.children) {
        traverse(node.children);
      }
    });
  };
  traverse(nodes);
  return keys;
}

/** 根据选中的 campaign key 过滤广告计划 */
function filterAdPlansByCampaigns(
  plans: AdPlan[],
  selectedKeys: string[]
): AdPlan[] {
  if (selectedKeys.length === 0) return plans;
  return plans.filter((plan) => selectedKeys.includes(plan.campaignId));
}

// ============================================================
// 主组件
// ============================================================

const CampaignOperations: React.FC = () => {
  const { isMobile, isTablet } = useResponsive();

  // ---- 左侧树状态 ----
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([
    'org_001',
    'acc_001',
    'acc_002',
  ]);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [treeSearchValue, setTreeSearchValue] = useState('');

  // ---- 右侧表格状态 ----
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [editingKey, setEditingKey] = useState<string>('');
  const [editValue, setEditValue] = useState<number>(0);
  const [tableSearch, setTableSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<AdStatus | undefined>(undefined);
  const [budgetModalVisible, setBudgetModalVisible] = useState(false);
  const [batchBudgetValue, setBatchBudgetValue] = useState<number | null>(null);
  const [createModalVisible, setCreateModalVisible] = useState(false);

  // ---- 树数据转换（支持搜索高亮） ----
  const treeData: DataNode[] = useMemo(() => {
    const highlightTitle = (title: string, value: string) => {
      if (!value) return title;
      const idx = title.toLowerCase().indexOf(value.toLowerCase());
      if (idx === -1) return title;
      return (
        <>
          {title.slice(0, idx)}
          <span style={{ color: '#1890ff', fontWeight: 600 }}>
            {title.slice(idx, idx + value.length)}
          </span>
          {title.slice(idx + value.length)}
        </>
      );
    };

    const filterAndTransform = (
      nodes: OrganizationTreeNode[]
    ): DataNode[] => {
      return nodes
        .map((node) => {
          const transformed: DataNode = {
            key: node.key,
            title: highlightTitle(node.title, treeSearchValue),
            icon:
              node.type === 'organization' ? (
                <BankOutlined style={{ color: '#722ed1' }} />
              ) : node.type === 'account' ? (
                <DollarOutlined style={{ color: '#1890ff' }} />
              ) : (
                <RocketOutlined style={{ color: '#52c41a' }} />
              ),
          };

          // 搜索时过滤
          if (treeSearchValue) {
            const matchSelf = node.title
              .toLowerCase()
              .includes(treeSearchValue.toLowerCase());
            const matchChildren = node.children
              ? node.children.some((child) =>
                  child.title
                    .toLowerCase()
                    .includes(treeSearchValue.toLowerCase())
                )
              : false;

            if (!matchSelf && !matchChildren) return null;
          }

          if (node.children) {
            const filteredChildren = filterAndTransform(node.children);
            if (filteredChildren.length > 0) {
              transformed.children = filteredChildren;
            }
          }

          // 账户节点显示余额
          if (node.type === 'account' && node.balance !== undefined) {
            transformed.title = (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {highlightTitle(node.title, treeSearchValue)}
                <Tag
                  color={node.balance > 10000 ? 'green' : node.balance > 0 ? 'orange' : 'red'}
                  style={{ fontSize: 11 }}
                >
                  ¥{node.balance.toLocaleString()}
                </Tag>
              </div>
            );
          }

          // 广告组节点显示状态
          if (node.type === 'campaign' && node.status) {
            const cfg = TREE_NODE_STATUS_CONFIG[node.status];
            transformed.title = (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {highlightTitle(node.title, treeSearchValue)}
                <Tag color={cfg.color} style={{ fontSize: 11 }}>
                  {cfg.label}
                </Tag>
              </div>
            );
          }

          return transformed;
        })
        .filter(Boolean) as DataNode[];
    };

    return filterAndTransform(mockOrgTree);
  }, [treeSearchValue]);

  // ---- 过滤后的广告计划 ----
  const filteredAdPlans = useMemo(() => {
    let plans = filterAdPlansByCampaigns(mockAdPlans, checkedKeys as string[]);

    // 搜索过滤
    if (tableSearch) {
      plans = plans.filter(
        (p) =>
          p.name.toLowerCase().includes(tableSearch.toLowerCase()) ||
          p.planId.toLowerCase().includes(tableSearch.toLowerCase()) ||
          p.accountName.toLowerCase().includes(tableSearch.toLowerCase())
      );
    }

    // 状态过滤
    if (statusFilter) {
      plans = plans.filter((p) => p.status === statusFilter);
    }

    return plans;
  }, [checkedKeys, tableSearch, statusFilter]);

  // ---- 树事件 ----
  const onExpand = useCallback((keys: React.Key[]) => {
    setExpandedKeys(keys);
    setAutoExpandParent(false);
  }, []);

  const onCheck = useCallback(
    (checked: React.Key[] | { checked: React.Key[]; halfChecked: React.Key[] }) => {
      // 只保留 campaign 级别的 key
      const allCampaignKeys = getAllCampaignKeys(mockOrgTree);
      const checkedArray = Array.isArray(checked) ? checked : checked.checked;
      const campaignKeys = checkedArray.filter((k) =>
        allCampaignKeys.includes(k as string)
      );
      setCheckedKeys(campaignKeys);
    },
    []
  );

  // ---- 表格行选择 ----
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
    getCheckboxProps: (record: AdPlan) => ({
      disabled: record.status === 'disabled',
      name: record.name,
    }),
  };

  // ---- 行内编辑预算 ----
  const startEditing = (record: AdPlan) => {
    setEditingKey(record.key);
    setEditValue(record.dailyBudget);
  };

  const saveEditing = () => {
    message.success(`日预算已更新为 ¥${editValue.toLocaleString()}`);
    setEditingKey('');
  };

  const cancelEditing = () => {
    setEditingKey('');
  };

  // ---- 批量启停 ----
  const handleBatchStatusChange = (targetStatus: 'running' | 'paused') => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要操作的计划');
      return;
    }
    Modal.confirm({
      title: '确认批量操作',
      icon: <ExclamationCircleOutlined />,
      content: `确定要将选中的 ${selectedRowKeys.length} 个计划${targetStatus === 'running' ? '启动' : '暂停'}吗？`,
      onOk: () => {
        message.success(
          `成功${targetStatus === 'running' ? '启动' : '暂停'} ${selectedRowKeys.length} 个计划`
        );
        setSelectedRowKeys([]);
      },
    });
  };

  // ---- 批量修改预算 ----
  const handleBatchBudget = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要修改的计划');
      return;
    }
    setBatchBudgetValue(null);
    setBudgetModalVisible(true);
  };

  // ---- 统一调整预算 (OCPM) ----
  const handleBudgetAdjust = (percent: number, direction: 'up' | 'down') => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要调整的计划');
      return;
    }
    const action = direction === 'up' ? '提高' : '降低';
    Modal.confirm({
      title: `确认${action}OCPM预算`,
      icon: <ExclamationCircleOutlined />,
      content: `确定将选中的 ${selectedRowKeys.length} 个计划的OCPM预算${action} ${percent}% 吗？`,
      onOk: () => {
        message.success(`成功${action} ${selectedRowKeys.length} 个计划的OCPM预算 ${percent}%`);
        setSelectedRowKeys([]);
      },
    });
  };

  const budgetAdjustMenu: MenuProps['items'] = [
    {
      key: 'up_10',
      label: '提高 10%',
      icon: <RiseOutlined style={{ color: '#52c41a' }} />,
      onClick: () => handleBudgetAdjust(10, 'up'),
    },
    {
      key: 'up_5',
      label: '提高 5%',
      icon: <RiseOutlined style={{ color: '#52c41a' }} />,
      onClick: () => handleBudgetAdjust(5, 'up'),
    },
    {
      key: 'up_1',
      label: '提高 1%',
      icon: <RiseOutlined style={{ color: '#52c41a' }} />,
      onClick: () => handleBudgetAdjust(1, 'up'),
    },
    { type: 'divider' },
    {
      key: 'down_10',
      label: '降低 10%',
      icon: <FallOutlined style={{ color: '#ff4d4f' }} />,
      onClick: () => handleBudgetAdjust(10, 'down'),
    },
    {
      key: 'down_5',
      label: '降低 5%',
      icon: <FallOutlined style={{ color: '#ff4d4f' }} />,
      onClick: () => handleBudgetAdjust(5, 'down'),
    },
    {
      key: 'down_1',
      label: '降低 1%',
      icon: <FallOutlined style={{ color: '#ff4d4f' }} />,
      onClick: () => handleBudgetAdjust(1, 'down'),
    },
  ];

  // ---- 统计信息 ----
  const stats = useMemo(() => {
    const running = filteredAdPlans.filter((p) => p.status === 'running').length;
    const paused = filteredAdPlans.filter((p) => p.status === 'paused').length;
    const totalSpent = filteredAdPlans.reduce((sum, p) => sum + p.spent, 0);
    const totalConversions = filteredAdPlans.reduce(
      (sum, p) => sum + p.conversions,
      0
    );
    const avgCpa =
      totalConversions > 0 ? totalSpent / totalConversions : 0;
    return { running, paused, totalSpent, totalConversions, avgCpa };
  }, [filteredAdPlans]);

  // ---- 表格列定义 ----
  const columns: ColumnsType<AdPlan> = [
    {
      title: '计划名称',
      dataIndex: 'name',
      key: 'name',
      width: 260,
      fixed: 'left',
      render: (name: string, record: AdPlan) => (
        <div>
          <div style={{ fontWeight: 500, marginBottom: 2 }}>{name}</div>
          <div style={{ fontSize: 12, color: '#8c8c8c' }}>
            {record.planId}
          </div>
        </div>
      ),
    },
    {
      title: '所属账户',
      dataIndex: 'accountName',
      key: 'accountName',
      width: 140,
      render: (name: string) => (
        <Tag color="blue" style={{ fontSize: 12 }}>
          {name}
        </Tag>
      ),
    },
    {
      title: '广告组',
      dataIndex: 'campaignName',
      key: 'campaignName',
      width: 140,
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: AdStatus, record: AdPlan) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Switch
            checked={status === 'running'}
            onChange={() => {
              message.info(
                `计划 "${record.name}" 已${status === 'running' ? '暂停' : '启动'}`
              );
            }}
            size="small"
          />
          <Tag
            icon={STATUS_CONFIG[status].icon}
            color={STATUS_CONFIG[status].color}
            style={{ fontSize: 12 }}
          >
            {STATUS_CONFIG[status].label}
          </Tag>
        </div>
      ),
    },
    {
      title: '日预算',
      dataIndex: 'dailyBudget',
      key: 'dailyBudget',
      width: 140,
      render: (value: number, record: AdPlan) => {
        if (editingKey === record.key) {
          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <InputNumber
                value={editValue}
                onChange={(val) => setEditValue(val || 0)}
                size="small"
                style={{ width: 90 }}
                min={0}
                step={100}
                precision={0}
                addonBefore="¥"
                onPressEnter={saveEditing}
              />
              <Button
                type="text"
                size="small"
                icon={<CheckOutlined />}
                onClick={saveEditing}
                style={{ color: '#52c41a' }}
              />
              <Button
                type="text"
                size="small"
                icon={<CloseOutlined />}
                onClick={cancelEditing}
                style={{ color: '#ff4d4f' }}
              />
            </div>
          );
        }
        return (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              cursor: 'pointer',
            }}
            onClick={() => startEditing(record)}
          >
            <span>¥{value.toLocaleString()}</span>
            <Tooltip title="点击编辑">
              <EditOutlined
                style={{ fontSize: 12, color: '#1890ff', opacity: 0.6 }}
              />
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: '消耗',
      dataIndex: 'spent',
      key: 'spent',
      width: 120,
      sorter: (a, b) => a.spent - b.spent,
      render: (value: number) => (
        <span style={{ color: '#cf1322' }}>¥{value.toLocaleString()}</span>
      ),
    },
    {
      title: '转化数',
      dataIndex: 'conversions',
      key: 'conversions',
      width: 90,
      sorter: (a, b) => a.conversions - b.conversions,
      render: (value: number) => (
        <span style={{ fontWeight: 500 }}>{value.toLocaleString()}</span>
      ),
    },
    {
      title: '转化成本',
      dataIndex: 'cpa',
      key: 'cpa',
      width: 110,
      sorter: (a, b) => a.cpa - b.cpa,
      render: (value: number) => (
        <span style={{ color: value > 50 ? '#faad14' : '#52c41a' }}>
          ¥{value.toFixed(2)}
        </span>
      ),
    },
    {
      title: 'CTR',
      dataIndex: 'ctr',
      key: 'ctr',
      width: 80,
      render: (value: number) => `${value.toFixed(2)}%`,
    },
    {
      title: 'CPM',
      dataIndex: 'cpm',
      key: 'cpm',
      width: 80,
      render: (value: number) => `¥${value.toFixed(1)}`,
    },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? 12 : 16,
        height: isMobile ? 'auto' : 'calc(100vh - 112px)',
        minHeight: isMobile ? 'auto' : 500,
      }}
    >
      {/* ==================== 左侧面板 ==================== */}
      <Card
        bordered={false}
        style={{
          width: isMobile ? '100%' : isTablet ? '35%' : '25%',
          minWidth: isMobile ? 'auto' : 260,
          borderRadius: 12,
          display: 'flex',
          flexDirection: 'column',
        }}
        bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 12px 12px' }}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <BankOutlined />
            <span>组织架构</span>
            <Badge
              count={checkedKeys.length}
              style={{ backgroundColor: '#52c41a' }}
              showZero
            />
          </div>
        }
      >
        {/* 树搜索 */}
        <div style={{ marginBottom: 12 }}>
          <Input
            placeholder="搜索组织/账户/广告组"
            prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
            allowClear
            value={treeSearchValue}
            onChange={(e) => setTreeSearchValue(e.target.value)}
            size="small"
          />
        </div>

        {/* 树 */}
        <div
          style={{
            flex: 1,
            overflow: 'auto',
            border: '1px solid #f0f0f0',
            borderRadius: 8,
            padding: '8px 0',
          }}
        >
          <Tree
            checkable
            checkedKeys={checkedKeys}
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
            onExpand={onExpand}
            onCheck={onCheck}
            treeData={treeData}
            blockNode
            showIcon
            style={{ fontSize: 13 }}
          />
        </div>

        {/* 底部统计 */}
        <div
          style={{
            marginTop: 12,
            padding: '8px 12px',
            background: '#fafafa',
            borderRadius: 8,
            fontSize: 12,
            color: '#8c8c8c',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>已选 {checkedKeys.length} 个广告组</span>
            {checkedKeys.length > 0 && (
              <a
                style={{ color: '#1890ff' }}
                onClick={() => setCheckedKeys([])}
              >
                清空
              </a>
            )}
          </div>
        </div>
      </Card>

      {/* ==================== 右侧面板 ==================== */}
      <Card
        bordered={false}
        style={{ flex: 1, borderRadius: 12 }}
        bodyStyle={{ display: 'flex', flexDirection: 'column', padding: 0 }}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 8 : 16, flexWrap: 'wrap' }}>
            <span>广告计划管理</span>
            {!isMobile && <Divider type="vertical" />}
            <Tag color="green">投放中 {stats.running}</Tag>
            <Tag color="orange">已暂停 {stats.paused}</Tag>
            {!isMobile && (
              <Tag icon={<BarChartOutlined />} color="blue">
                总消耗 ¥{stats.totalSpent.toLocaleString()}
              </Tag>
            )}
          </div>
        }
      >
        {/* ---- 顶部操作栏 ---- */}
        <div
          style={{
            padding: isMobile ? '12px' : '16px 24px',
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          {/* 左侧按钮 */}
          <Space wrap>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateModalVisible(true)}>
              新建计划
            </Button>
            <Popconfirm
              title={`确认启动 ${selectedRowKeys.length || 0} 个计划？`}
              onConfirm={() => handleBatchStatusChange('running')}
              disabled={selectedRowKeys.length === 0}
            >
              <Button
                icon={<RocketOutlined />}
                disabled={selectedRowKeys.length === 0}
              >
                批量启动
              </Button>
            </Popconfirm>
            <Popconfirm
              title={`确认暂停 ${selectedRowKeys.length || 0} 个计划？`}
              onConfirm={() => handleBatchStatusChange('paused')}
              disabled={selectedRowKeys.length === 0}
            >
              <Button
                icon={<StopOutlined />}
                disabled={selectedRowKeys.length === 0}
              >
                批量暂停
              </Button>
            </Popconfirm>
            <Button
              icon={<DollarOutlined />}
              onClick={handleBatchBudget}
              disabled={selectedRowKeys.length === 0}
            >
              批量修改预算
            </Button>
            <Dropdown
              menu={{ items: budgetAdjustMenu }}
              disabled={selectedRowKeys.length === 0}
              placement="bottomLeft"
            >
              <Button icon={<DollarOutlined />}>
                统一调整OCPM <DownOutlined />
              </Button>
            </Dropdown>
          </Space>

          {/* 右侧筛选 */}
          <Space wrap>
            <Input
              placeholder="搜索计划名称 / ID / 账户"
              prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
              allowClear
              style={{ width: isMobile ? '100%' : 240 }}
              size="small"
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
            />
            <Select
              placeholder="状态筛选"
              allowClear
              style={{ width: isMobile ? '100%' : 130 }}
              size="small"
              value={statusFilter}
              onChange={setStatusFilter}
              options={Object.entries(STATUS_CONFIG).map(([value, cfg]) => ({
                value,
                label: cfg.label,
              }))}
            />
          </Space>
        </div>

        {/* ---- 表格 ---- */}
        <div style={{ flex: 1, overflow: 'auto', padding: '0 24px 16px' }}>
          <Table<AdPlan>
            columns={columns}
            dataSource={filteredAdPlans}
            rowSelection={rowSelection}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条计划`,
              pageSizeOptions: ['10', '20', '50'],
            }}
            scroll={{ x: 1400 }}
            size="middle"
            rowClassName={(record) =>
              editingKey === record.key ? 'editing-row' : ''
            }
          />
        </div>
      </Card>

      {/* ==================== 批量修改预算弹窗 ==================== */}
      <Modal
        title="批量修改日预算"
        open={budgetModalVisible}
        onOk={() => {
          if (batchBudgetValue === null || batchBudgetValue <= 0) {
            message.warning('请输入有效的预算金额');
            return;
          }
          message.success(
            `成功将 ${selectedRowKeys.length} 个计划的日预算修改为 ¥${batchBudgetValue.toLocaleString()}`
          );
          setBudgetModalVisible(false);
          setSelectedRowKeys([]);
        }}
        onCancel={() => setBudgetModalVisible(false)}
        okText="确认修改"
        cancelText="取消"
        destroyOnClose
      >
        <div style={{ padding: '16px 0' }}>
          <p style={{ marginBottom: 12, color: '#8c8c8c' }}>
            将选中的{' '}
            <strong style={{ color: '#1890ff' }}>
              {selectedRowKeys.length}
            </strong>{' '}
            个计划的日预算统一修改为：
          </p>
          <InputNumber
            style={{ width: '100%' }}
            size="large"
            addonBefore="¥"
            placeholder="请输入日预算金额"
            value={batchBudgetValue}
            onChange={(val) => setBatchBudgetValue(val)}
            min={0}
            step={100}
            precision={0}
          />
        </div>
      </Modal>

      {/* ==================== 批量新建计划弹窗 ==================== */}
      <BatchCreatePlanModal
        open={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        onSuccess={() => {
          message.success('批量新建计划成功');
        }}
      />
    </div>
  );
};

export default CampaignOperations;

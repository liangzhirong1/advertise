import React, { useState } from 'react';
import {
  Card,
  Table,
  Tag,
  Button,
  Space,
  Switch,
  Drawer,
  Form,
  Input,
  Radio,
  Select,
  InputNumber,
  Checkbox,
  Divider,
  Tooltip,
  Badge,
  message,
  Popconfirm,
} from 'antd';
import type { RadioChangeEvent } from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  BellOutlined,
  WarningOutlined,
  ThunderboltOutlined,
  StopOutlined,
  EditOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import {
  mockAlertRules,
  alertAccountOptions,
  METRIC_LABELS,
  COMPARATOR_LABELS,
  CHANNEL_LABELS,
  type AlertRule,
  type MonitorScopeType,
  type AlertMetric,
  type NotificationChannel,
  type TriggerCondition,
} from '../data/mockAlertRules';
import { useResponsive } from '../hooks/useResponsive';

// ============================================================
// 常量
// ============================================================

const METRIC_OPTIONS = Object.entries(METRIC_LABELS).map(([value, label]) => ({
  value,
  label,
}));

const COMPARATOR_OPTIONS = Object.entries(COMPARATOR_LABELS).map(
  ([value, label]) => ({ value, label })
);

const CHANNEL_OPTIONS = Object.entries(CHANNEL_LABELS).map(([value, label]) => ({
  value,
  label,
}));

const METRIC_UNITS: Record<AlertMetric, string> = {
  balance: '元',
  cpa: '元',
  impressions: '次',
  clicks: '次',
  conversions: '个',
  spend: '元',
  ctr: '%',
  daily_budget_usage: '%',
};

// ============================================================
// 主组件
// ============================================================

const RiskAlerts: React.FC = () => {
  const { isMobile } = useResponsive();
  const [rules, setRules] = useState<AlertRule[]>(mockAlertRules);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingRule, setEditingRule] = useState<AlertRule | null>(null);
  const [form] = Form.useForm();

  // ---- 打开新建抽屉 ----
  const openCreateDrawer = () => {
    setEditingRule(null);
    form.resetFields();
    form.setFieldsValue({
      monitorScope: 'all',
      targetAccounts: [],
      conditions: [{ metric: 'balance', comparator: '<', threshold: 5000 }],
      notifyChannels: ['feishu'],
      autoCircuitBreaker: false,
      enabled: true,
    });
    setDrawerVisible(true);
  };

  // ---- 打开编辑抽屉 ----
  const openEditDrawer = (rule: AlertRule) => {
    setEditingRule(rule);
    form.setFieldsValue(rule);
    setDrawerVisible(true);
  };

  // ---- 提交表单 ----
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingRule) {
        // 编辑
        setRules((prev) =>
          prev.map((r) =>
            r.key === editingRule.key ? { ...r, ...values } : r
          )
        );
        message.success('告警规则已更新');
      } else {
        // 新建
        const newRule: AlertRule = {
          key: `rule_${Date.now()}`,
          ...values,
          createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
          triggerCount: 0,
        };
        setRules((prev) => [newRule, ...prev]);
        message.success('告警规则已创建');
      }
      setDrawerVisible(false);
    } catch {
      // 表单验证失败
    }
  };

  // ---- 切换规则状态 ----
  const toggleRuleEnabled = (key: string, enabled: boolean) => {
    setRules((prev) =>
      prev.map((r) => (r.key === key ? { ...r, enabled } : r))
    );
    message.success(enabled ? '规则已启用' : '规则已暂停');
  };

  // ---- 删除规则 ----
  const deleteRule = (key: string) => {
    setRules((prev) => prev.filter((r) => r.key !== key));
    message.success('规则已删除');
  };

  // ---- 条件描述渲染 ----
  const renderConditions = (conditions: TriggerCondition[]) => {
    return conditions.map((cond, index) => (
      <Tag
        key={index}
        color={index === 0 ? 'blue' : 'geekblue'}
        style={{ marginBottom: 4 }}
      >
        {METRIC_LABELS[cond.metric]} {COMPARATOR_LABELS[cond.comparator]}{' '}
        {cond.threshold} {METRIC_UNITS[cond.metric]}
      </Tag>
    ));
  };

  // ---- 通知方式渲染 ----
  const renderChannels = (channels: NotificationChannel[]) => {
    return channels.map((ch) => (
      <Tag key={ch} color="cyan" style={{ marginBottom: 4 }}>
        {CHANNEL_LABELS[ch]}
      </Tag>
    ));
  };

  // ---- 表格列定义 ----
  const columns: ColumnsType<AlertRule> = [
    {
      title: '规则名称',
      dataIndex: 'ruleName',
      key: 'ruleName',
      width: 200,
      fixed: 'left',
      render: (name: string, record: AlertRule) => (
        <div>
          <div style={{ fontWeight: 500, marginBottom: 2 }}>{name}</div>
          <div style={{ fontSize: 11, color: '#bfbfbf' }}>
            创建于 {record.createdAt}
          </div>
        </div>
      ),
    },
    {
      title: '监控范围',
      dataIndex: 'monitorScope',
      key: 'monitorScope',
      width: 180,
      render: (scope: MonitorScopeType, record: AlertRule) => {
        if (scope === 'all') {
          return (
            <Tag color="purple" icon={<ThunderboltOutlined />}>
              所有账户
            </Tag>
          );
        }
        return (
          <div>
            <Tag color="purple" icon={<ThunderboltOutlined />}>
              特定账户 ({record.targetAccounts?.length || 0})
            </Tag>
            <div style={{ marginTop: 4 }}>
              {(record.targetAccounts || []).map((acc) => (
                <Tag key={acc} style={{ fontSize: 10, marginBottom: 2 }}>
                  {acc}
                </Tag>
              ))}
            </div>
          </div>
        );
      },
    },
    {
      title: '触发条件',
      dataIndex: 'conditions',
      key: 'conditions',
      width: 280,
      render: (conditions: TriggerCondition[]) => (
        <div>
          {renderConditions(conditions)}
          {conditions.length > 1 && (
            <div style={{ fontSize: 11, color: '#8c8c8c', marginTop: 4 }}>
              （AND 逻辑：所有条件同时满足时触发）
            </div>
          )}
        </div>
      ),
    },
    {
      title: '通知方式',
      dataIndex: 'notifyChannels',
      key: 'notifyChannels',
      width: 160,
      render: (channels: NotificationChannel[]) => renderChannels(channels),
    },
    {
      title: '自动熔断',
      dataIndex: 'autoCircuitBreaker',
      key: 'autoCircuitBreaker',
      width: 100,
      render: (enabled: boolean) => (
        <Tooltip title={enabled ? '已开启：触发后自动暂停计划' : '已关闭'}>
          <Tag
            icon={<StopOutlined />}
            color={enabled ? 'red' : 'default'}
            style={{ margin: 0 }}
          >
            {enabled ? '开启' : '关闭'}
          </Tag>
        </Tooltip>
      ),
    },
    {
      title: '触发次数',
      dataIndex: 'triggerCount',
      key: 'triggerCount',
      width: 90,
      sorter: (a, b) => a.triggerCount - b.triggerCount,
      render: (count: number) => (
        <Badge
          count={count}
          style={{
            backgroundColor: count > 5 ? '#ff4d4f' : count > 0 ? '#faad14' : '#d9d9d9',
          }}
        />
      ),
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      key: 'enabled',
      width: 90,
      render: (enabled: boolean, record: AlertRule) => (
        <Switch
          checked={enabled}
          onChange={(checked) => toggleRuleEnabled(record.key, checked)}
          size="small"
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 140,
      fixed: 'right',
      render: (_: unknown, record: AlertRule) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => openEditDrawer(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确认删除"
            description={`确定要删除规则「${record.ruleName}」吗？`}
            onConfirm={() => deleteRule(record.key)}
            okText="删除"
            cancelText="取消"
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // ---- 监控范围变化处理 ----
  const handleScopeChange = (e: RadioChangeEvent) => {
    const value = e.target.value as MonitorScopeType;
    if (value === 'all') {
      form.setFieldValue('targetAccounts', []);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 12 : 20 }}>
      {/* ==================== 顶部操作栏 ==================== */}
      <Card
        bordered={false}
        style={{ borderRadius: 12 }}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <BellOutlined style={{ color: '#1890ff' }} />
            <span style={{ fontSize: isMobile ? 14 : 15 }}>告警规则管理</span>
          </div>
        }
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreateDrawer}>
            新建告警规则
          </Button>
        }
      >
        {/* 统计摘要 */}
        <div
          style={{
            display: 'flex',
            gap: isMobile ? 12 : 24,
            padding: isMobile ? '8px 0' : '12px 0',
            borderBottom: '1px solid #f0f0f0',
            marginBottom: 16,
            overflowX: isMobile ? 'auto' : 'visible',
          }}
        >
          <div style={{ flex: 1, textAlign: 'center', minWidth: isMobile ? 80 : 'auto' }}>
            <div style={{ fontSize: isMobile ? 18 : 24, fontWeight: 700, color: '#1a1a1a' }}>
              {rules.length}
            </div>
            <div style={{ fontSize: isMobile ? 11 : 12, color: '#8c8c8c' }}>规则总数</div>
          </div>
          <div style={{ flex: 1, textAlign: 'center', minWidth: isMobile ? 80 : 'auto' }}>
            <div style={{ fontSize: isMobile ? 18 : 24, fontWeight: 700, color: '#52c41a' }}>
              {rules.filter((r) => r.enabled).length}
            </div>
            <div style={{ fontSize: isMobile ? 11 : 12, color: '#8c8c8c' }}>已启用</div>
          </div>
          <div style={{ flex: 1, textAlign: 'center', minWidth: isMobile ? 80 : 'auto' }}>
            <div style={{ fontSize: isMobile ? 18 : 24, fontWeight: 700, color: '#faad14' }}>
              {rules.filter((r) => r.triggerCount > 0).length}
            </div>
            <div style={{ fontSize: isMobile ? 11 : 12, color: '#8c8c8c' }}>已触发</div>
          </div>
          <div style={{ flex: 1, textAlign: 'center', minWidth: isMobile ? 80 : 'auto' }}>
            <div style={{ fontSize: isMobile ? 18 : 24, fontWeight: 700, color: '#ff4d4f' }}>
              {rules.filter((r) => r.autoCircuitBreaker).length}
            </div>
            <div style={{ fontSize: isMobile ? 11 : 12, color: '#8c8c8c' }}>自动熔断</div>
          </div>
        </div>

        {/* 规则表格 */}
        <Table<AlertRule>
          columns={columns}
          dataSource={rules}
          pagination={{
            pageSize: isMobile ? 5 : 10,
            showTotal: (total) => `共 ${total} 条规则`,
          }}
          scroll={{ x: 1200 }}
          size={isMobile ? 'small' : 'middle'}
        />
      </Card>

      {/* ==================== 新建/编辑规则抽屉 ==================== */}
      <Drawer
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {editingRule ? (
              <EditOutlined />
            ) : (
              <PlusOutlined />
            )}
            <span>{editingRule ? '编辑告警规则' : '新建告警规则'}</span>
          </div>
        }
        width={isMobile ? '100%' : 640}
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        destroyOnClose
        extra={
          <Space>
            <Button onClick={() => setDrawerVisible(false)}>取消</Button>
            <Button type="primary" onClick={handleSubmit}>
              {editingRule ? '保存修改' : '创建规则'}
            </Button>
          </Space>
        }
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            monitorScope: 'all',
            targetAccounts: [],
            conditions: [{ metric: 'balance', comparator: '<', threshold: 5000 }],
            notifyChannels: ['feishu'],
            autoCircuitBreaker: false,
            enabled: true,
          }}
        >
          {/* 规则名称 */}
          <Form.Item
            label="规则名称"
            name="ruleName"
            rules={[{ required: true, message: '请输入规则名称' }]}
          >
            <Input
              placeholder="例如：账户余额不足预警"
              maxLength={50}
              showCount
              size="large"
            />
          </Form.Item>

          <Divider style={{ margin: '16px 0' }} />

          {/* 监控对象 */}
          <Form.Item
            label="监控对象"
            name="monitorScope"
            rules={[{ required: true, message: '请选择监控对象' }]}
          >
            <Radio.Group onChange={handleScopeChange} size="large">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Radio
                  value="all"
                  style={{
                    padding: '12px 16px',
                    border: '1px solid #f0f0f0',
                    borderRadius: 8,
                    width: '100%',
                  }}
                >
                  <div style={{ fontWeight: 500 }}>
                    <ThunderboltOutlined style={{ marginRight: 8, color: '#722ed1' }} />
                    所有账户
                  </div>
                  <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 4 }}>
                    监控全部广告账户的指标变化
                  </div>
                </Radio>
                <Radio
                  value="specific"
                  style={{
                    padding: '12px 16px',
                    border: '1px solid #f0f0f0',
                    borderRadius: 8,
                    width: '100%',
                  }}
                >
                  <div style={{ fontWeight: 500 }}>
                    <ThunderboltOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                    特定账户
                  </div>
                  <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 4 }}>
                    仅监控选中的广告账户
                  </div>
                </Radio>
              </Space>
            </Radio.Group>
          </Form.Item>

          {/* 特定账户选择（条件显示） */}
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.monitorScope !== currentValues.monitorScope
            }
          >
            {({ getFieldValue }) => {
              const scope = getFieldValue('monitorScope');
              if (scope !== 'specific') return null;
              return (
                <Form.Item
                  label="选择账户"
                  name="targetAccounts"
                  rules={[
                    {
                      validator: (_, value) =>
                        value && value.length > 0
                          ? Promise.resolve()
                          : Promise.reject(new Error('请至少选择一个账户')),
                    },
                  ]}
                >
                  <Select
                    mode="multiple"
                    placeholder="选择要监控的账户"
                    size="large"
                    options={alertAccountOptions}
                    maxTagCount="responsive"
                  />
                </Form.Item>
              );
            }}
          </Form.Item>

          <Divider style={{ margin: '16px 0' }} />

          {/* 触发条件（Form.List 动态表单） */}
          <Form.List name="conditions">
            {(fields, { add, remove }) => (
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 12,
                  }}
                >
                  <label style={{ fontWeight: 500, fontSize: 14 }}>
                    <WarningOutlined style={{ marginRight: 6, color: '#faad14' }} />
                    触发条件
                  </label>
                  <Button
                    type="dashed"
                    icon={<PlusOutlined />}
                    onClick={() =>
                      add({ metric: 'balance', comparator: '<', threshold: 0 })
                    }
                    size="small"
                  >
                    添加条件
                  </Button>
                </div>

                {fields.map((field, index) => (
                  <div
                    key={field.key}
                    style={{
                      padding: 16,
                      border: '1px solid #f0f0f0',
                      borderRadius: 8,
                      marginBottom: 12,
                      backgroundColor: '#fafafa',
                      position: 'relative',
                    }}
                  >
                    {/* 条件序号 */}
                    <div
                      style={{
                        position: 'absolute',
                        top: -10,
                        left: 12,
                        background: '#1890ff',
                        color: '#fff',
                        fontSize: 11,
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: 10,
                      }}
                    >
                      条件 {index + 1}
                    </div>

                    {/* AND 连接符 */}
                    {index > 0 && (
                      <div
                        style={{
                          textAlign: 'center',
                          marginBottom: 8,
                          color: '#8c8c8c',
                          fontSize: 12,
                        }}
                      >
                        ── AND ──
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      {/* 指标 */}
                      <Form.Item
                        {...field}
                        name={[field.name, 'metric']}
                        style={{ flex: 2, marginBottom: 0 }}
                        rules={[{ required: true, message: '请选择指标' }]}
                      >
                        <Select
                          placeholder="选择指标"
                          size="large"
                          options={METRIC_OPTIONS}
                        />
                      </Form.Item>

                      {/* 比较符 */}
                      <Form.Item
                        {...field}
                        name={[field.name, 'comparator']}
                        style={{ flex: 1.5, marginBottom: 0 }}
                        rules={[{ required: true, message: '请选择比较符' }]}
                      >
                        <Select
                          placeholder="比较符"
                          size="large"
                          options={COMPARATOR_OPTIONS}
                        />
                      </Form.Item>

                      {/* 阈值 */}
                      <Form.Item
                        {...field}
                        name={[field.name, 'threshold']}
                        style={{ flex: 1.5, marginBottom: 0 }}
                        rules={[{ required: true, message: '请输入阈值' }]}
                      >
                        <Form.Item
                          noStyle
                          shouldUpdate={(prev, curr) => {
                            const prevMetric = prev.conditions?.[field.name]?.metric;
                            const currMetric = curr.conditions?.[field.name]?.metric;
                            return prevMetric !== currMetric;
                          }}
                        >
                          {({ getFieldValue }) => {
                            const metric =
                              getFieldValue(['conditions', field.name, 'metric']) as
                              | AlertMetric
                              | undefined;
                            const unit = metric ? METRIC_UNITS[metric] : '';
                            return (
                              <InputNumber
                                placeholder="阈值"
                                size="large"
                                style={{ width: '100%' }}
                                addonAfter={unit}
                                min={0}
                                precision={metric === 'ctr' ? 2 : 0}
                                step={metric === 'ctr' ? 0.1 : 100}
                              />
                            );
                          }}
                        </Form.Item>
                      </Form.Item>

                      {/* 删除按钮 */}
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => remove(field.name)}
                        disabled={fields.length <= 1}
                        style={{ marginTop: 4 }}
                      />
                    </div>
                  </div>
                ))}

                {fields.length > 1 && (
                  <div
                    style={{
                      fontSize: 12,
                      color: '#8c8c8c',
                      textAlign: 'center',
                      marginTop: 4,
                    }}
                  >
                    ℹ️ 多个条件之间为 AND 逻辑，所有条件同时满足时触发告警
                  </div>
                )}
              </div>
            )}
          </Form.List>

          <Divider style={{ margin: '16px 0' }} />

          {/* 执行动作 */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontWeight: 500, fontSize: 14, marginBottom: 12, display: 'block' }}>
              <BellOutlined style={{ marginRight: 6, color: '#1890ff' }} />
              通知方式
            </label>
            <Form.Item name="notifyChannels" noStyle>
              <Checkbox.Group>
                <Space size={24}>
                  {CHANNEL_OPTIONS.map((opt) => (
                    <Checkbox key={opt.value} value={opt.value} style={{ fontSize: 14 }}>
                      {opt.label}
                    </Checkbox>
                  ))}
                </Space>
              </Checkbox.Group>
            </Form.Item>
          </div>

          {/* 自动熔断 */}
          <div
            style={{
              padding: 16,
              border: '1px solid #fff1f0',
              borderRadius: 8,
              backgroundColor: '#fff6f6',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <StopOutlined style={{ color: '#ff4d4f' }} />
                  自动熔断
                </div>
                <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 4 }}>
                  开启后，当触发条件满足时自动暂停相关投放计划，防止损失扩大
                </div>
              </div>
              <Form.Item name="autoCircuitBreaker" noStyle>
                <Switch
                  checkedChildren="开启"
                  unCheckedChildren="关闭"
                  style={{ backgroundColor: '#f5222d' }}
                />
              </Form.Item>
            </div>
          </div>

          {/* 启用开关 */}
          <Divider style={{ margin: '16px 0' }} />
          <Form.Item name="enabled" valuePropName="checked" style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontWeight: 500 }}>规则状态</span>
              <Switch checkedChildren="启用" unCheckedChildren="暂停" />
              <span style={{ fontSize: 12, color: '#8c8c8c' }}>
                暂停后规则不会触发告警
              </span>
            </div>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default RiskAlerts;

import React, { useState, useMemo, useCallback } from 'react';
import {
  Card,
  Table,
  Input,
  Select,
  Button,
  Space,
  Tag,
  Drawer,
  Tabs,
  Steps,
  Transfer,
  Modal,
  Input as AntInput,
  message,
  Badge,
  Descriptions,
  Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  SearchOutlined,
  EyeOutlined,
  ShareAltOutlined,
  EditOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  LinkOutlined,
} from '@ant-design/icons';
import {
  mockEventAssets,
  mockSharedAccounts,
  TRACKING_TYPE_CONFIG,
  STATUS_CONFIG,
  DEBUG_STATUS_CONFIG,
  DEBUG_STEPS,
  type EventAsset,
  type TrackingLink,
  type DebugStatus,
  type TrackingType,
  type EventStatus,
} from '../data/mockEvents';
import { useResponsive } from '../hooks/useResponsive';

const { Text } = Typography;

// ============================================================
// 常量
// ============================================================

const APP_OPTIONS = Array.from(new Set(mockEventAssets.map((a) => a.appId))).map((appId) => {
  const asset = mockEventAssets.find((a) => a.appId === appId)!;
  return { value: appId, label: asset.appName };
});

// ============================================================
// 链接编辑 Modal 组件
// ============================================================

interface LinkEditModalProps {
  visible: boolean;
  links: TrackingLink[];
  onOk: (updatedLinks: TrackingLink[]) => void;
  onCancel: () => void;
}

const LinkEditModal: React.FC<LinkEditModalProps> = ({ visible, links, onOk, onCancel }) => {
  const [editMode, setEditMode] = useState<'batch' | 'individual'>('individual');
  const [batchJson, setBatchJson] = useState('');
  const [editLinks, setEditLinks] = useState<TrackingLink[]>([]);

  React.useEffect(() => {
    if (visible) {
      setEditLinks(JSON.parse(JSON.stringify(links)));
      setEditMode('individual');
      setBatchJson('');
    }
  }, [visible, links]);

  const handleBatchSubmit = () => {
    try {
      const parsed = JSON.parse(batchJson);
      if (!Array.isArray(parsed)) {
        message.error('JSON 格式错误，应为数组');
        return;
      }
      onOk(parsed);
      message.success('批量更新成功');
    } catch {
      message.error('JSON 格式错误，请检查');
    }
  };

  const handleIndividualSave = () => {
    onOk(editLinks);
    message.success('链接更新成功');
  };

  const updateLinkUrl = (index: number, url: string) => {
    setEditLinks((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], url };
      return next;
    });
  };

  return (
    <Modal
      title="更新监测链接"
      open={visible}
      onCancel={onCancel}
      onOk={() => {
        if (editMode === 'batch') {
          handleBatchSubmit();
        } else {
          handleIndividualSave();
        }
      }}
      width={720}
      okText="保存"
      cancelText="取消"
      destroyOnClose
    >
      <div style={{ marginBottom: 16 }}>
        <Tag.CheckableTag
          checked={editMode === 'individual'}
          onChange={() => setEditMode('individual')}
        >
          逐条编辑
        </Tag.CheckableTag>
        <Tag.CheckableTag
          checked={editMode === 'batch'}
          onChange={() => setEditMode('batch')}
        >
          批量导入 JSON
        </Tag.CheckableTag>
      </div>

      {editMode === 'batch' ? (
        <AntInput.TextArea
          rows={12}
          placeholder='[{"id": "link_001", "url": "https://..."}]'
          value={batchJson}
          onChange={(e) => setBatchJson(e.target.value)}
          style={{ fontFamily: 'monospace', fontSize: 12 }}
        />
      ) : (
        <div style={{ maxHeight: 400, overflow: 'auto' }}>
          {editLinks.map((link, index) => (
            <div
              key={link.id}
              style={{
                padding: 12,
                border: '1px solid #f0f0f0',
                borderRadius: 8,
                marginBottom: 12,
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: 8 }}>
                {index + 1}. {link.name}
              </div>
              <AntInput
                value={link.url}
                onChange={(e) => updateLinkUrl(index, e.target.value)}
                style={{ fontFamily: 'monospace', fontSize: 12 }}
              />
              <div style={{ marginTop: 4, fontSize: 11, color: '#8c8c8c' }}>
                宏参数: {link.macros.join(', ')}
              </div>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
};

// ============================================================
// 主组件
// ============================================================

const EventManagement: React.FC = () => {
  const { isMobile } = useResponsive();

  // ---- 状态 ----
  const [assets, setAssets] = useState<EventAsset[]>(mockEventAssets);
  const [searchText, setSearchText] = useState('');
  const [appFilter, setAppFilter] = useState<string | undefined>(undefined);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<EventAsset | null>(null);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [shareAsset, setShareAsset] = useState<EventAsset | null>(null);
  const [sharedKeys, setSharedKeys] = useState<string[]>([]);
  const [linkEditVisible, setLinkEditVisible] = useState(false);
  const [linkEditType, setLinkEditType] = useState<'click' | 'impression'>('click');

  // ---- 过滤后的资产列表 ----
  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      if (appFilter && asset.appId !== appFilter) return false;
      if (searchText) {
        const lower = searchText.toLowerCase();
        return (
          asset.name.toLowerCase().includes(lower) ||
          asset.appName.toLowerCase().includes(lower) ||
          asset.assetId.toLowerCase().includes(lower)
        );
      }
      return true;
    });
  }, [assets, appFilter, searchText]);

  // ---- 打开详情 ----
  const handleOpenDetail = useCallback((asset: EventAsset) => {
    setSelectedAsset(asset);
    setDetailVisible(true);
  }, []);

  // ---- 打开共享弹窗 ----
  const handleOpenShare = useCallback((asset: EventAsset) => {
    setShareAsset(asset);
    setSharedKeys(asset.sharedTo);
    setShareModalVisible(true);
  }, []);

  // ---- 保存共享 ----
  const handleSaveShare = useCallback(() => {
    if (!shareAsset) return;
    setAssets((prev) =>
      prev.map((a) =>
        a.id === shareAsset.id ? { ...a, sharedTo: sharedKeys } : a
      )
    );
    message.success(`已共享至 ${sharedKeys.length} 个账户`);
    setShareModalVisible(false);
    if (selectedAsset?.id === shareAsset.id) {
      setSelectedAsset((prev) =>
        prev ? { ...prev, sharedTo: sharedKeys } : null
      );
    }
  }, [shareAsset, sharedKeys, selectedAsset]);

  // ---- 更新链接 ----
  const handleUpdateLinks = useCallback(
    (updatedLinks: TrackingLink[]) => {
      if (!selectedAsset) return;
      setAssets((prev) =>
        prev.map((a) => {
          if (a.id !== selectedAsset.id) return a;
          return {
            ...a,
            clickLinks: linkEditType === 'click' ? updatedLinks : a.clickLinks,
            impressionLinks:
              linkEditType === 'impression' ? updatedLinks : a.impressionLinks,
          };
        })
      );
      setSelectedAsset((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          clickLinks: linkEditType === 'click' ? updatedLinks : prev.clickLinks,
          impressionLinks:
            linkEditType === 'impression' ? updatedLinks : prev.impressionLinks,
        };
      });
      setLinkEditVisible(false);
    },
    [selectedAsset, linkEditType]
  );

  // ---- 切换状态 ----
  const handleToggleStatus = useCallback((assetId: string) => {
    setAssets((prev) =>
      prev.map((a) => {
        if (a.id !== assetId) return a;
        const newStatus = a.status === 'active' ? 'disabled' : 'active';
        message.success(`已${newStatus === 'active' ? '启用' : '停用'}事件`);
        return { ...a, status: newStatus };
      })
    );
    setSelectedAsset((prev) => {
      if (!prev || prev.id !== assetId) return prev;
      const newStatus = prev.status === 'active' ? 'disabled' : 'active';
      return { ...prev, status: newStatus };
    });
  }, []);

  // ---- 表格列定义 ----
  const columns: ColumnsType<EventAsset> = [
    {
      title: '资产名称',
      dataIndex: 'name',
      key: 'name',
      width: 160,
      fixed: !isMobile ? 'left' : undefined,
      render: (name: string, record: EventAsset) => (
        <div>
          <div style={{ fontWeight: 500 }}>{name}</div>
          <div style={{ fontSize: 11, color: '#8c8c8c' }}>{record.assetId}</div>
        </div>
      ),
    },
    {
      title: '关联APP',
      dataIndex: 'appName',
      key: 'appName',
      width: 130,
      render: (name: string) => (
        <Tag color="purple" style={{ fontSize: 11 }}>
          {name}
        </Tag>
      ),
    },
    {
      title: '资产ID',
      dataIndex: 'assetId',
      key: 'assetId',
      width: 160,
      render: (id: string) => (
        <Text copyable style={{ fontFamily: 'monospace', fontSize: 12 }}>
          {id}
        </Text>
      ),
    },
    {
      title: '追踪类型',
      dataIndex: 'trackingType',
      key: 'trackingType',
      width: 110,
      render: (type: TrackingType) => {
        const cfg = TRACKING_TYPE_CONFIG[type];
        return <Tag color={cfg.color}>{cfg.label}</Tag>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 90,
      render: (status: EventStatus, record: EventAsset) => {
        const cfg = STATUS_CONFIG[status];
        return (
          <Tag
            color={cfg.color}
            style={{ cursor: 'pointer' }}
            onClick={() => handleToggleStatus(record.id)}
          >
            {cfg.label}
          </Tag>
        );
      },
    },
    {
      title: '联调状态',
      dataIndex: 'debugStatus',
      key: 'debugStatus',
      width: 110,
      render: (status: DebugStatus) => {
        const cfg = DEBUG_STATUS_CONFIG[status];
        const icon =
          status === 'success' ? (
            <CheckCircleOutlined />
          ) : status === 'failed' ? (
            <CloseCircleOutlined />
          ) : status === 'in_progress' ? (
            <ClockCircleOutlined />
          ) : null;
        return <Tag icon={icon} color={cfg.color}>{cfg.label}</Tag>;
      },
    },
    {
      title: '共享',
      key: 'shared',
      width: 100,
      render: (_: unknown, record: EventAsset) => {
        const count = record.sharedTo.length;
        return count > 0 ? (
          <Tag color="blue">已共享至 {count} 个账户</Tag>
        ) : (
          <Tag>未共享</Tag>
        );
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (time: string) => (
        <span style={{ fontSize: 12, color: '#8c8c8c' }}>{time}</span>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 160,
      fixed: !isMobile ? 'right' : undefined,
      render: (_: unknown, record: EventAsset) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleOpenDetail(record)}
          >
            详情
          </Button>
          <Button
            type="link"
            size="small"
            icon={<ShareAltOutlined />}
            onClick={() => handleOpenShare(record)}
          >
            共享
          </Button>
        </Space>
      ),
    },
  ];

  // ---- 当前选中资产的链接列表 ----
  const currentClickLinks = selectedAsset?.clickLinks || [];
  const currentImpressionLinks = selectedAsset?.impressionLinks || [];

  // ---- 联调步骤状态 ----
  const getDebugStepsStatus = (status: DebugStatus): 'wait' | 'process' | 'finish' | 'error' => {
    switch (status) {
      case 'not_started':
        return 'wait';
      case 'in_progress':
        return 'process';
      case 'success':
        return 'finish';
      case 'failed':
        return 'error';
      default:
        return 'wait';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 12 : 20 }}>
      {/* ==================== 事件资产列表 ==================== */}
      <Card
        bordered={false}
        style={{ borderRadius: 12 }}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <LinkOutlined style={{ color: '#1890ff' }} />
            <span style={{ fontSize: isMobile ? 14 : 15 }}>事件资产列表</span>
            <Badge count={assets.length} style={{ backgroundColor: '#1890ff' }} />
          </div>
        }
      >
        {/* 筛选栏 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 16,
            flexWrap: 'wrap',
          }}
        >
          <Input
            placeholder="搜索资产名称 / APP名称 / 资产ID"
            prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
            allowClear
            style={{ width: isMobile ? '100%' : 300 }}
            size="small"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Select
            allowClear
            placeholder="按应用筛选"
            style={{ width: isMobile ? '100%' : 160 }}
            size="small"
            value={appFilter}
            onChange={setAppFilter}
            options={APP_OPTIONS}
          />
        </div>

        {/* 表格 */}
        <Table<EventAsset>
          columns={columns}
          dataSource={filteredAssets}
          rowKey="id"
          pagination={{
            pageSize: isMobile ? 5 : 10,
            showTotal: (total) => `共 ${total} 条事件`,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '20'],
          }}
          size={isMobile ? 'small' : 'middle'}
          scroll={{ x: isMobile ? 800 : 1100 }}
        />
      </Card>

      {/* ==================== 详情 Drawer ==================== */}
      <Drawer
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <LinkOutlined />
            <span>事件详情 - {selectedAsset?.name || ''}</span>
          </div>
        }
        width={isMobile ? '100%' : 720}
        open={detailVisible}
        onClose={() => {
          setDetailVisible(false);
          setSelectedAsset(null);
          setLinkEditVisible(false);
        }}
        destroyOnClose
        extra={
          <Space>
            <Button
              icon={<ShareAltOutlined />}
              onClick={() => selectedAsset && handleOpenShare(selectedAsset)}
            >
              共享
            </Button>
          </Space>
        }
      >
        {selectedAsset && (
          <>
            {/* 基本信息 */}
            <Descriptions
              bordered
              size="small"
              column={isMobile ? 1 : 2}
              style={{ marginBottom: 24 }}
            >
              <Descriptions.Item label="资产名称">
                {selectedAsset.name}
              </Descriptions.Item>
              <Descriptions.Item label="资产ID">
                <Text copyable style={{ fontFamily: 'monospace' }}>
                  {selectedAsset.assetId}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="关联APP">
                <Tag color="purple">{selectedAsset.appName}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="追踪类型">
                <Tag color={TRACKING_TYPE_CONFIG[selectedAsset.trackingType].color}>
                  {TRACKING_TYPE_CONFIG[selectedAsset.trackingType].label}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag
                  color={STATUS_CONFIG[selectedAsset.status].color}
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleToggleStatus(selectedAsset.id)}
                >
                  {STATUS_CONFIG[selectedAsset.status].label}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="创建时间">
                {selectedAsset.createdAt}
              </Descriptions.Item>
              <Descriptions.Item label="共享账户数" span={isMobile ? 1 : 2}>
                <Tag color="blue">
                  已共享至 {selectedAsset.sharedTo.length} 个账户
                </Tag>
              </Descriptions.Item>
            </Descriptions>

            {/* 联调状态 */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontWeight: 600, marginBottom: 12, fontSize: 14 }}>
                联调进度
              </div>
              <Steps
                current={selectedAsset.debugStep}
                status={getDebugStepsStatus(selectedAsset.debugStatus)}
                items={DEBUG_STEPS.map((step) => ({
                  title: step.title,
                  description: step.description,
                }))}
                size={isMobile ? 'small' : 'default'}
              />
            </div>

            {/* 监测链接组 Tabs */}
            <Tabs
              defaultActiveKey="click"
              items={[
                {
                  key: 'click',
                  label: (
                    <span>
                      <LinkOutlined /> 点击监测链接组 ({currentClickLinks.length})
                    </span>
                  ),
                  children: (
                    <div>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'flex-end',
                          marginBottom: 12,
                        }}
                      >
                        <Button
                          type="primary"
                          size="small"
                          icon={<EditOutlined />}
                          onClick={() => {
                            setLinkEditType('click');
                            setLinkEditVisible(true);
                          }}
                        >
                          更新链接
                        </Button>
                      </div>
                      {currentClickLinks.map((link, index) => (
                        <div
                          key={link.id}
                          style={{
                            padding: 12,
                            border: '1px solid #f0f0f0',
                            borderRadius: 8,
                            marginBottom: 12,
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              marginBottom: 8,
                            }}
                          >
                            <span style={{ fontWeight: 600 }}>
                              {index + 1}. {link.name}
                            </span>
                            <span style={{ fontSize: 11, color: '#8c8c8c' }}>
                              {link.createdAt}
                            </span>
                          </div>
                          <div
                            style={{
                              fontSize: 12,
                              fontFamily: 'monospace',
                              color: '#1890ff',
                              wordBreak: 'break-all',
                              marginBottom: 8,
                              padding: 8,
                              background: '#f6f8fa',
                              borderRadius: 4,
                            }}
                          >
                            {link.url}
                          </div>
                          <div style={{ fontSize: 11, color: '#8c8c8c' }}>
                            宏参数:{' '}
                            {link.macros.map((m) => (
                              <Tag key={m} color="blue" style={{ fontSize: 10, margin: 0 }}>
                                {m}
                              </Tag>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ),
                },
                {
                  key: 'impression',
                  label: (
                    <span>
                      <EyeOutlined /> 展现监测链接组 ({currentImpressionLinks.length})
                    </span>
                  ),
                  children: (
                    <div>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'flex-end',
                          marginBottom: 12,
                        }}
                      >
                        <Button
                          type="primary"
                          size="small"
                          icon={<EditOutlined />}
                          onClick={() => {
                            setLinkEditType('impression');
                            setLinkEditVisible(true);
                          }}
                        >
                          更新链接
                        </Button>
                      </div>
                      {currentImpressionLinks.map((link, index) => (
                        <div
                          key={link.id}
                          style={{
                            padding: 12,
                            border: '1px solid #f0f0f0',
                            borderRadius: 8,
                            marginBottom: 12,
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              marginBottom: 8,
                            }}
                          >
                            <span style={{ fontWeight: 600 }}>
                              {index + 1}. {link.name}
                            </span>
                            <span style={{ fontSize: 11, color: '#8c8c8c' }}>
                              {link.createdAt}
                            </span>
                          </div>
                          <div
                            style={{
                              fontSize: 12,
                              fontFamily: 'monospace',
                              color: '#1890ff',
                              wordBreak: 'break-all',
                              marginBottom: 8,
                              padding: 8,
                              background: '#f6f8fa',
                              borderRadius: 4,
                            }}
                          >
                            {link.url}
                          </div>
                          <div style={{ fontSize: 11, color: '#8c8c8c' }}>
                            宏参数:{' '}
                            {link.macros.map((m) => (
                              <Tag key={m} color="blue" style={{ fontSize: 10, margin: 0 }}>
                                {m}
                              </Tag>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ),
                },
              ]}
            />
          </>
        )}
      </Drawer>

      {/* ==================== 共享 Modal ==================== */}
      <Modal
        title={`共享事件资产 - ${shareAsset?.name || ''}`}
        open={shareModalVisible}
        onOk={handleSaveShare}
        onCancel={() => setShareModalVisible(false)}
        okText="保存"
        cancelText="取消"
        width={640}
        destroyOnClose
      >
        <div style={{ padding: '16px 0' }}>
          <div style={{ marginBottom: 12, fontSize: 13, color: '#8c8c8c' }}>
            选择要共享到的账户，右侧为已共享的账户列表
          </div>
          <Transfer
            dataSource={mockSharedAccounts}
            targetKeys={sharedKeys}
            onChange={(keys) => setSharedKeys(keys as string[])}
            render={(item) => (
              <div style={{ padding: '4px 0' }}>
                <div style={{ fontWeight: 500 }}>{item.title}</div>
                <div style={{ fontSize: 11, color: '#8c8c8c' }}>
                  {item.description}
                </div>
              </div>
            )}
            listStyle={{
              width: 280,
              height: 300,
            }}
            operations={['加入', '移除']}
          />
        </div>
      </Modal>

      {/* ==================== 链接编辑 Modal ==================== */}
      <LinkEditModal
        visible={linkEditVisible}
        links={linkEditType === 'click' ? currentClickLinks : currentImpressionLinks}
        onOk={handleUpdateLinks}
        onCancel={() => setLinkEditVisible(false)}
      />
    </div>
  );
};

export default EventManagement;

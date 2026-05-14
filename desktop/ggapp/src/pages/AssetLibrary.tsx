import React, { useState } from 'react';
import {
  Card,
  Input,
  Select,
  DatePicker,
  Button,
  Space,
  Tag,
  Modal,
  Checkbox,
  Tooltip,
  message,
  Popconfirm,
  Statistic,
  Row,
  Col,
} from 'antd';
import {
  SearchOutlined,
  VideoCameraOutlined,
  PictureOutlined,
  TagOutlined,
  UploadOutlined,
  DeleteOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  SendOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import {
  mockAssets,
  allAssetTags,
  type AssetItem,
  type AssetType,
  type AssetTag,
} from '../data/mockAssets';
import AssetDetailModal from '../components/AssetDetailModal';
import AssetPushModal from '../components/AssetPushModal';
import AssetDiagnosticDrawer from '../components/AssetDiagnosticDrawer';
import InspirationCenter from '../components/InspirationCenter';
import { useResponsive } from '../hooks/useResponsive';
import type { InspirationTag } from '../data/mockAssetDiagnostics';

const { Search } = Input;

// ============================================================
// 常量
// ============================================================

const TYPE_OPTIONS = [
  { value: 'video', label: '视频' },
  { value: 'image', label: '图片' },
];

// ============================================================
// 主组件
// ============================================================

const AssetLibrary: React.FC = () => {
  const { isMobile } = useResponsive();
  // ---- 状态 ----
  const [assets, setAssets] = useState<AssetItem[]>(mockAssets);
  const [typeFilter, setTypeFilter] = useState<AssetType | undefined>(undefined);
  const [tagFilter, setTagFilter] = useState<AssetTag[]>([]);
  const [searchText, setSearchText] = useState('');
  const [selectedAssets, setSelectedAssets] = useState<React.Key[]>([]);
  const [tagModalVisible, setTagModalVisible] = useState(false);
  const [selectedTags, setSelectedTags] = useState<AssetTag[]>([]);
  const [detailVisible, setDetailVisible] = useState(false);
  const [detailAsset, setDetailAsset] = useState<AssetItem | null>(null);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [pushModalVisible, setPushModalVisible] = useState(false);
  const [diagnosticVisible, setDiagnosticVisible] = useState(false);
  const [diagnosticAsset, setDiagnosticAsset] = useState<AssetItem | null>(null);

  // ---- 过滤后的素材 ----
  const filteredAssets = assets.filter((asset) => {
    if (typeFilter && asset.type !== typeFilter) return false;
    if (tagFilter.length > 0 && !tagFilter.some((t) => asset.tags.includes(t))) return false;
    if (searchText) {
      const lower = searchText.toLowerCase();
      return (
        asset.name.toLowerCase().includes(lower) ||
        asset.md5.toLowerCase().includes(lower) ||
        asset.tags.some((t) => t.toLowerCase().includes(lower))
      );
    }
    return true;
  });

  // ---- 统计 ----
  const stats = {
    total: assets.length,
    videos: assets.filter((a) => a.type === 'video').length,
    images: assets.filter((a) => a.type === 'image').length,
    totalPush: assets.reduce((sum, a) => sum + a.pushCount, 0),
  };

  // ---- MD5 去重模拟 ----
  const simulateUpload = () => {
    const mockMD5 = 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6'; // 与 asset_001 相同
    const existing = assets.find((a) => a.md5 === mockMD5);
    if (existing) {
      Modal.warning({
        title: '素材已存在',
        icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
        content: (
          <div>
            <p>MD5 值 <code style={{ background: '#f5f5f5', padding: '2px 6px', borderRadius: 4 }}>{mockMD5}</code> 已存在于素材库中</p>
            <p>已存在素材：<strong>{existing.name}</strong></p>
            <p style={{ color: '#52c41a' }}>
              <CheckCircleOutlined style={{ marginRight: 4 }} />
              已自动关联历史数据，跳过重复上传
            </p>
          </div>
        ),
        okText: '知道了',
      });
    }
    setUploadModalVisible(false);
  };

  // ---- 批量打标签 ----
  const handleBatchTag = () => {
    if (selectedAssets.length === 0) {
      message.warning('请先选择素材');
      return;
    }
    setTagModalVisible(true);
  };

  const confirmBatchTag = () => {
    if (selectedTags.length === 0) {
      message.warning('请至少选择一个标签');
      return;
    }
    setAssets((prev) =>
      prev.map((asset) => {
        if (selectedAssets.includes(asset.key)) {
          const newTags = [...new Set([...asset.tags, ...selectedTags])];
          return { ...asset, tags: newTags };
        }
        return asset;
      })
    );
    message.success(`已为 ${selectedAssets.length} 个素材添加标签`);
    setTagModalVisible(false);
    setSelectedTags([]);
    setSelectedAssets([]);
  };

  // ---- 删除素材 ----
  const handleDeleteAssets = () => {
    setAssets((prev) => prev.filter((a) => !selectedAssets.includes(a.key)));
    message.success(`已删除 ${selectedAssets.length} 个素材`);
    setSelectedAssets([]);
  };

  // ---- 查看详情 ----
  const handleViewDetail = (asset: AssetItem) => {
    setDetailAsset(asset);
    setDetailVisible(true);
  };

  // ---- 推送素材 ----
  const handlePushAssets = () => {
    if (selectedAssets.length === 0) {
      message.warning('请先选择素材');
      return;
    }
    setPushModalVisible(true);
  };

  // ---- 诊断修复 ----
  const handleDiagnostic = (asset: AssetItem) => {
    setDiagnosticAsset(asset);
    setDiagnosticVisible(true);
  };

  // ---- 灵感标签应用 ----
  const handleApplyTags = (tags: InspirationTag[]) => {
    message.success(`已选择 ${tags.length} 个灵感标签，将自动填充至新建计划`);
    // 这里可以通过路由 state 或 Context 传递给批量建计划页面
    // 简单演示：直接跳转到批量投放页面
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 12 : 20 }}>
      {/* ==================== 统计摘要 ==================== */}
      <Row gutter={[isMobile ? 8 : 16, isMobile ? 8 : 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: 12, textAlign: 'center' }}>
            <Statistic title="素材总数" value={stats.total} prefix={<TagOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: 12, textAlign: 'center' }}>
            <Statistic
              title="视频素材"
              value={stats.videos}
              prefix={<VideoCameraOutlined style={{ color: '#722ed1' }} />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: 12, textAlign: 'center' }}>
            <Statistic
              title="图片素材"
              value={stats.images}
              prefix={<PictureOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: 12, textAlign: 'center' }}>
            <Statistic
              title="总推送次数"
              value={stats.totalPush}
              prefix={<SendOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* ==================== 灵感中心 ==================== */}
      <InspirationCenter onApplyTags={handleApplyTags} />

      {/* ==================== 搜索与过滤 ==================== */}
      <Card bordered={false} style={{ borderRadius: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 8 : 12, flexWrap: 'wrap' }}>
          <Search
            placeholder="搜索素材名称 / MD5 / 标签"
            prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
            allowClear
            style={{ width: isMobile ? '100%' : 300 }}
            size="large"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Select
            allowClear
            placeholder="素材类型"
            style={{ width: isMobile ? '100%' : 120 }}
            size="large"
            value={typeFilter}
            onChange={setTypeFilter}
            options={TYPE_OPTIONS}
          />
          <Select
            mode="multiple"
            allowClear
            placeholder="素材标签"
            style={{ width: isMobile ? '100%' : 220 }}
            size="large"
            value={tagFilter}
            onChange={setTagFilter}
            options={allAssetTags.map((tag) => ({ value: tag, label: tag }))}
            maxTagCount="responsive"
          />
          {!isMobile && <DatePicker size="large" picker="date" placeholder="上传日期" style={{ width: 160 }} />}
          <div style={{ flex: 1 }} />
          <Button type="primary" icon={<UploadOutlined />} onClick={() => setUploadModalVisible(true)}>
            上传素材
          </Button>
        </div>
      </Card>

      {/* ==================== 批量操作条 ==================== */}
      {selectedAssets.length > 0 && (
        <Card
          bordered={false}
          style={{
            borderRadius: 12,
            background: '#e6f7ff',
            border: '1px solid #91d5ff',
          }}
          bodyStyle={{ padding: '8px 16px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 14 }}>
              已选择 <strong style={{ color: '#1890ff' }}>{selectedAssets.length}</strong> 个素材
            </span>
            <Space>
              <Button icon={<TagOutlined />} onClick={handleBatchTag}>
                批量打标签
              </Button>
              <Button icon={<SendOutlined />} onClick={handlePushAssets}>
                一键推送至账户
              </Button>
              <Popconfirm
                title="确认删除"
                description={`确定要删除选中的 ${selectedAssets.length} 个素材吗？`}
                onConfirm={handleDeleteAssets}
              >
                <Button danger icon={<DeleteOutlined />}>
                  批量删除
                </Button>
              </Popconfirm>
            </Space>
          </div>
        </Card>
      )}

      {/* ==================== 素材媒体墙 ==================== */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: isMobile ? 8 : 16,
        }}
      >
        {filteredAssets.map((asset) => (
          <Card
            key={asset.key}
            hoverable
            size="small"
            style={{
              borderRadius: 12,
              overflow: 'hidden',
              border: selectedAssets.includes(asset.key)
                ? '2px solid #1890ff'
                : '2px solid #f0f0f0',
              transition: 'all 0.2s',
            }}
            bodyStyle={{ padding: 0 }}
            onClick={() => handleViewDetail(asset)}
          >
            {/* 缩略图 */}
            <div
              style={{
                width: '100%',
                aspectRatio: asset.type === 'video' ? '16/9' : '1/1',
                background: asset.thumbnail,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              {asset.type === 'video' ? (
                <VideoCameraOutlined
                  style={{ fontSize: 36, color: 'rgba(255,255,255,0.9)', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
                />
              ) : (
                <PictureOutlined
                  style={{ fontSize: 36, color: 'rgba(255,255,255,0.9)', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
                />
              )}

              {/* 视频时长 */}
              {asset.duration && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: 8,
                    right: 8,
                    background: 'rgba(0,0,0,0.7)',
                    color: '#fff',
                    fontSize: 11,
                    padding: '2px 8px',
                    borderRadius: 4,
                  }}
                >
                  {asset.duration}
                </div>
              )}

              {/* 类型标签 */}
              <div
                style={{
                  position: 'absolute',
                  top: 8,
                  left: 8,
                }}
              >
                <Tag
                  color={asset.type === 'video' ? 'purple' : 'blue'}
                  style={{ margin: 0, fontSize: 11 }}
                >
                  {asset.type === 'video' ? '视频' : '图片'}
                </Tag>
              </div>

              {/* 选中对勾 */}
              {selectedAssets.includes(asset.key) && (
                <div
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    background: '#1890ff',
                    borderRadius: '50%',
                    width: 24,
                    height: 24,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CheckCircleOutlined style={{ color: '#fff', fontSize: 16 }} />
                </div>
              )}
            </div>

            {/* 信息区 */}
            <div style={{ padding: '8px 12px' }}>
              <div
                style={{
                  fontWeight: 500,
                  fontSize: 13,
                  marginBottom: 6,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {asset.name}
              </div>

              {/* 标签 */}
              <div style={{ marginBottom: 6, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {asset.tags.slice(0, 3).map((tag) => (
                  <Tag key={tag} style={{ fontSize: 10, margin: 0 }}>
                    {tag}
                  </Tag>
                ))}
                {asset.tags.length > 3 && (
                  <Tag style={{ fontSize: 10, margin: 0 }}>+{asset.tags.length - 3}</Tag>
                )}
              </div>

              {/* 元信息 */}
              <div style={{ fontSize: 11, color: '#8c8c8c', display: 'flex', justifyContent: 'space-between' }}>
                <span>{asset.size}</span>
                <span>{asset.format}</span>
              </div>

              {/* MD5 */}
              <Tooltip title={asset.md5}>
                <div
                  style={{
                    fontSize: 10,
                    color: '#bfbfbf',
                    fontFamily: 'monospace',
                    marginTop: 4,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  MD5: {asset.md5.slice(0, 16)}...
                </div>
              </Tooltip>

              {/* 底部操作 */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 8,
                  paddingTop: 8,
                  borderTop: '1px solid #f0f0f0',
                }}
              >
                <Checkbox
                  checked={selectedAssets.includes(asset.key)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedAssets((prev) => [...prev, asset.key]);
                    } else {
                      setSelectedAssets((prev) => prev.filter((k) => k !== asset.key));
                    }
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <span style={{ fontSize: 11 }}>选择</span>
                </Checkbox>
                <Space size={4}>
                  <Tooltip title="查看详情">
                    <Button
                      type="text"
                      size="small"
                      icon={<EyeOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetail(asset);
                      }}
                    />
                  </Tooltip>
                  <Tooltip title="诊断修复">
                    <Button
                      type="text"
                      size="small"
                      icon={<ThunderboltOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDiagnostic(asset);
                      }}
                    />
                  </Tooltip>
                </Space>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* ==================== 批量打标签 Modal ==================== */}
      <Modal
        title="批量添加标签"
        open={tagModalVisible}
        onOk={confirmBatchTag}
        onCancel={() => {
          setTagModalVisible(false);
          setSelectedTags([]);
        }}
        okText="确认添加"
        cancelText="取消"
        destroyOnClose
      >
        <div style={{ padding: '8px 0' }}>
          <p style={{ marginBottom: 12, color: '#8c8c8c' }}>
            为选中的 <strong style={{ color: '#1890ff' }}>{selectedAssets.length}</strong> 个素材添加标签：
          </p>
          <Checkbox.Group
            value={selectedTags}
            onChange={setSelectedTags}
            style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}
          >
            {allAssetTags.map((tag) => (
              <Checkbox key={tag} value={tag}>
                <Tag color="cyan" style={{ margin: 0, padding: '4px 12px', fontSize: 13 }}>
                  {tag}
                </Tag>
              </Checkbox>
            ))}
          </Checkbox.Group>
        </div>
      </Modal>

      {/* ==================== 上传模拟 Modal ==================== */}
      <Modal
        title="上传素材"
        open={uploadModalVisible}
        onCancel={() => setUploadModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setUploadModalVisible(false)}>
            取消
          </Button>,
          <Button key="simulate" type="primary" onClick={simulateUpload}>
            模拟上传（触发 MD5 去重）
          </Button>,
        ]}
        destroyOnClose
      >
        <div
          style={{
            border: '2px dashed #d9d9d9',
            borderRadius: 8,
            padding: 40,
            textAlign: 'center',
            background: '#fafafa',
          }}
        >
          <UploadOutlined style={{ fontSize: 48, color: '#bfbfbf' }} />
          <div style={{ marginTop: 12, color: '#8c8c8c' }}>
            拖拽文件到此处，或点击选择文件
          </div>
          <div style={{ marginTop: 8, fontSize: 12, color: '#bfbfbf' }}>
            支持 MP4、JPG、PNG 格式，最大 500MB
          </div>
        </div>
        <div style={{ marginTop: 16, padding: 12, background: '#f6ffed', borderRadius: 8, fontSize: 12, color: '#52c41a' }}>
          <CheckCircleOutlined style={{ marginRight: 4 }} />
          上传时将自动计算文件 MD5 值，如库中已存在相同素材将自动关联历史数据
        </div>
      </Modal>

      {/* ==================== 素材详情 Modal ==================== */}
      <AssetDetailModal
        visible={detailVisible}
        asset={detailAsset}
        onClose={() => {
          setDetailVisible(false);
          setDetailAsset(null);
        }}
      />

      {/* ==================== 素材推送 Modal ==================== */}
      <AssetPushModal
        visible={pushModalVisible}
        selectedAssetKeys={selectedAssets}
        onClose={() => setPushModalVisible(false)}
        onSuccess={() => {
          message.success('素材推送成功');
          setSelectedAssets([]);
        }}
      />

      {/* ==================== 素材诊断修复 Drawer ==================== */}
      <AssetDiagnosticDrawer
        visible={diagnosticVisible}
        asset={diagnosticAsset}
        onClose={() => {
          setDiagnosticVisible(false);
          setDiagnosticAsset(null);
        }}
      />
    </div>
  );
};

export default AssetLibrary;

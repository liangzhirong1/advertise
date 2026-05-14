import React, { useState, useCallback } from 'react';
import {
  Modal,
  Steps,
  Transfer,
  Tag,
  Form,
  Select,
  Radio,
  InputNumber,
  Divider,
  Alert,
  Table,
  Button,
  Space,
  Input,
  Tooltip,
  Badge,
  message,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { TransferItem } from 'antd/es/transfer';
import {
  mockVideos,
  mockAudiencePackages,
  mockBiddingOptions,
  mockTransferAccounts,
  type VideoMaterial,
  type BiddingMethod,
  type GeneratedPlanPreview,
} from '../data/mockBatchCreate';
import { useResponsive } from '../hooks/useResponsive';

// ============================================================
// 常量
// ============================================================

const BID_METHOD_LABELS: Record<BiddingMethod, string> = {
  ocpc: 'oCPC',
  ocpm: 'oCPM',
  cpm: 'CPM',
  cpc: 'CPC',
  ocpx: 'oCPX',
};

// ============================================================
// 工具函数
// ============================================================

/** 生成模拟计划预览数据 */
function generatePlanPreviews(
  selectedAccounts: string[],
  selectedVideos: VideoMaterial[],
  titles: string[],
  audienceId: string,
  biddingMethod: BiddingMethod,
  targetBid: number
): GeneratedPlanPreview[] {
  const accountNames = mockTransferAccounts
    .filter((a) => selectedAccounts.includes(a.key))
    .map((a) => a.title);

  const audience = mockAudiencePackages.find((p) => p.value === audienceId);
  const audienceName = audience ? audience.label : '未选择';

  const plans: GeneratedPlanPreview[] = [];
  let planIndex = 0;

  accountNames.forEach((accName) => {
    selectedVideos.forEach((video) => {
      titles.forEach((title) => {
        planIndex++;
        plans.push({
          key: `preview_${planIndex}`,
          planId: `BP-${Date.now()}-${String(planIndex).padStart(4, '0')}`,
          accountName: accName,
          videoTitle: video.title,
          textTitle: title,
          audienceName,
          biddingMethod: BID_METHOD_LABELS[biddingMethod],
          targetBid,
          dailyBudget: Math.round(targetBid * 100 * (0.8 + Math.random() * 0.4)),
          estimatedImpressions: Math.round(
            (targetBid * 1000) / (20 + Math.random() * 30)
          ),
          estimatedClicks: Math.round(
            ((targetBid * 1000) / (20 + Math.random() * 30)) *
              (0.01 + Math.random() * 0.03)
          ),
        });
      });
    });
  });

  return plans;
}

// ============================================================
// 主组件
// ============================================================

interface BatchCreatePlanModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const BatchCreatePlanModal: React.FC<BatchCreatePlanModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const { isMobile } = useResponsive();
  // ---- Steps 状态 ----
  const [currentStep, setCurrentStep] = useState(0);

  // ---- Step 1: 账户选择 ----
  const [selectedAccountKeys, setSelectedAccountKeys] = useState<string[]>([]);

  // ---- Step 2: 基础定向 ----
  const [audienceId, setAudienceId] = useState<string>('');
  const [biddingMethod, setBiddingMethod] = useState<BiddingMethod>('ocpc');
  const [targetBid, setTargetBid] = useState<number>(30);

  // ---- Step 3: 素材与文案 ----
  const [selectedVideoIds, setSelectedVideoIds] = useState<string[]>([]);
  const [titles, setTitles] = useState<string[]>(['']);

  // ---- Form 实例 ----
  const [form] = Form.useForm();

  // ---- 重置表单 ----
  const resetForm = useCallback(() => {
    setCurrentStep(0);
    setSelectedAccountKeys([]);
    setAudienceId('');
    setBiddingMethod('ocpc');
    setTargetBid(30);
    setSelectedVideoIds([]);
    setTitles(['']);
    form.resetFields();
  }, [form]);

  // ---- 关闭弹窗 ----
  const handleClose = () => {
    resetForm();
    onClose();
  };

  // ---- Step 1 渲染 ----
  const renderStep1 = () => {
    const transferDataSource: TransferItem[] = mockTransferAccounts.map(
      (acc) => ({
        key: acc.key,
        title: acc.title,
        disabled: acc.disabled,
        description: `ID: ${acc.advertiserId} | 余额: ¥${acc.balance.toLocaleString()}`,
      })
    );

    const renderTransferItem = (item: TransferItem) => {
      const acc = mockTransferAccounts.find((a) => a.key === item.key);
      if (!acc) return null;

      const balanceColor =
        acc.balance > 10000
          ? '#52c41a'
          : acc.balance > 0
          ? '#faad14'
          : '#ff4d4f';

      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '4px 0',
          }}
        >
          <div>
            <div style={{ fontWeight: 500, fontSize: 13 }}>{acc.title}</div>
            <div style={{ fontSize: 11, color: '#8c8c8c', marginTop: 2 }}>
              ID: {acc.advertiserId}
            </div>
          </div>
          <Tag
            color={balanceColor}
            style={{ fontSize: 11, margin: 0 }}
          >
            ¥{acc.balance.toLocaleString()}
          </Tag>
        </div>
      );
    };

    return (
      <div>
        <Alert
          message="选择目标广告账户"
          description="将在此步骤选中的所有账户下，各生成一套相同的投放计划。余额为 0 或冻结的账户不可选。"
          type="info"
          showIcon
          icon={<InfoCircleOutlined />}
          style={{ marginBottom: 16 }}
        />

        <Transfer
          dataSource={transferDataSource}
          targetKeys={selectedAccountKeys}
          onChange={(keys) => setSelectedAccountKeys(keys as string[])}
          render={renderTransferItem}
          titles={['可用账户', '已选账户']}
          listStyle={{ width: 320, height: 360 }}
          operations={['→', '←']}
          showSearch
          filterOption={(inputValue, item) =>
            (item?.title ?? '').includes(inputValue)
          }
        />

        {selectedAccountKeys.length > 0 && (
          <div
            style={{
              marginTop: 12,
              padding: '8px 12px',
              background: '#f6ffed',
              border: '1px solid #b7eb8f',
              borderRadius: 6,
              fontSize: 13,
              color: '#52c41a',
            }}
          >
            ✓ 已选择 <strong>{selectedAccountKeys.length}</strong> 个账户
          </div>
        )}
      </div>
    );
  };

  // ---- Step 2 渲染 ----
  const renderStep2 = () => {
    const currentBidding = mockBiddingOptions.find(
      (b) => b.value === biddingMethod
    );

    return (
      <Form form={form} layout="vertical" style={{ maxWidth: 500 }}>
        {/* 受众包选择 */}
        <Form.Item
          label={
            <span>
              受众包选择{' '}
              <Tooltip title="选择目标受众群体，系统将基于此受众包进行投放">
                <InfoCircleOutlined style={{ color: '#1890ff', cursor: 'pointer' }} />
              </Tooltip>
            </span>
          }
          required
        >
          <Select
            placeholder="请选择受众包"
            value={audienceId}
            onChange={setAudienceId}
            size="large"
            options={mockAudiencePackages.map((pkg) => ({
              value: pkg.value,
              label: (
                <div>
                  <div style={{ fontWeight: 500 }}>{pkg.label}</div>
                  <div
                    style={{ fontSize: 11, color: '#8c8c8c' }}
                  >
                    {pkg.description} · {pkg.size} 人
                  </div>
                </div>
              ),
            }))}
            dropdownRender={(menu) => (
              <>
                <div
                  style={{
                    padding: '8px 12px',
                    fontSize: 12,
                    color: '#8c8c8c',
                    borderBottom: '1px solid #f0f0f0',
                  }}
                >
                  共 {mockAudiencePackages.length} 个受众包可选
                </div>
                {menu}
              </>
            )}
          />
        </Form.Item>

        <Divider style={{ margin: '16px 0' }} />

        {/* 出价方式 */}
        <Form.Item label="出价方式" required>
          <Radio.Group
            value={biddingMethod}
            onChange={(e) => {
              setBiddingMethod(e.target.value);
              const opt = mockBiddingOptions.find(
                (b) => b.value === e.target.value
              );
              if (opt) setTargetBid(opt.recommendedBid);
            }}
            style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
          >
            {mockBiddingOptions.map((opt) => (
              <Radio
                key={opt.value}
                value={opt.value}
                style={{
                  padding: '12px 16px',
                  border:
                    biddingMethod === opt.value
                      ? '2px solid #1890ff'
                      : '1px solid #f0f0f0',
                  borderRadius: 8,
                  backgroundColor:
                    biddingMethod === opt.value ? '#e6f7ff' : '#fff',
                }}
              >
                <div style={{ fontWeight: 500 }}>{opt.label}</div>
                <div style={{ fontSize: 12, color: '#8c8c8c' }}>
                  {opt.description}
                </div>
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>

        <Divider style={{ margin: '16px 0' }} />

        {/* 目标出价 */}
        <Form.Item
          label={
            <span>
              目标出价（{currentBidding?.label.split(' - ')[0]}）{' '}
              <Tooltip title={`最低出价: ¥${currentBidding?.minBid}`}>
                <InfoCircleOutlined style={{ color: '#1890ff', cursor: 'pointer' }} />
              </Tooltip>
            </span>
          }
          required
        >
          <InputNumber
            style={{ width: '100%' }}
            size="large"
            addonBefore="¥"
            addonAfter="元"
            value={targetBid}
            onChange={(val) => setTargetBid(val || 0)}
            min={currentBidding?.minBid}
            step={biddingMethod === 'cpc' ? 0.1 : 1}
            precision={biddingMethod === 'cpc' ? 2 : 0}
          />
          {currentBidding && (
            <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 4 }}>
              建议出价: ¥{currentBidding.recommendedBid} | 最低出价: ¥
              {currentBidding.minBid}
            </div>
          )}
        </Form.Item>
      </Form>
    );
  };

  // ---- Step 3 渲染 ----
  const renderStep3 = () => {
    return (
      <div>
        {/* 视频素材区域 */}
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 12,
            }}
          >
            <h4 style={{ margin: 0, fontSize: 14 }}>
              视频素材{' '}
              <Badge
                count={selectedVideoIds.length}
                style={{ backgroundColor: '#1890ff', marginLeft: 8 }}
              />
            </h4>
            <span style={{ fontSize: 12, color: '#8c8c8c' }}>
              已选 {selectedVideoIds.length} / 8 个
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 12,
            }}
          >
            {mockVideos.map((video) => {
              const isSelected = selectedVideoIds.includes(video.id);
              return (
                <div
                  key={video.id}
                  onClick={() => {
                    setSelectedVideoIds((prev) =>
                      prev.includes(video.id)
                        ? prev.filter((id) => id !== video.id)
                        : [...prev, video.id]
                    );
                  }}
                  style={{
                    cursor: 'pointer',
                    border: isSelected
                      ? '2px solid #1890ff'
                      : '2px solid #f0f0f0',
                    borderRadius: 8,
                    overflow: 'hidden',
                    transition: 'all 0.2s',
                    backgroundColor: isSelected ? '#e6f7ff' : '#fff',
                    position: 'relative',
                  }}
                >
                  {/* 缩略图 */}
                  <div
                    style={{
                      width: '100%',
                      aspectRatio: '16/9',
                      background: video.thumbnail,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                    }}
                  >
                    <PlayCircleOutlined
                      style={{
                        fontSize: 28,
                        color: 'rgba(255,255,255,0.9)',
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                      }}
                    />
                    {/* 时长标签 */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 4,
                        right: 4,
                        background: 'rgba(0,0,0,0.6)',
                        color: '#fff',
                        fontSize: 10,
                        padding: '2px 6px',
                        borderRadius: 3,
                      }}
                    >
                      {video.duration}
                    </div>
                    {/* 选中对勾 */}
                    {isSelected && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          background: '#1890ff',
                          borderRadius: '50%',
                          width: 20,
                          height: 20,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <CheckCircleOutlined
                          style={{ color: '#fff', fontSize: 14 }}
                        />
                      </div>
                    )}
                  </div>
                  {/* 信息 */}
                  <div style={{ padding: '6px 8px' }}>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 500,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {video.title}
                    </div>
                    <div style={{ fontSize: 10, color: '#8c8c8c' }}>
                      {video.size}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <Divider style={{ margin: '24px 0' }} />

        {/* 标题文案区域 */}
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 12,
            }}
          >
            <h4 style={{ margin: 0, fontSize: 14 }}>
              标题文案{' '}
              <Badge
                count={titles.filter((t) => t.trim()).length}
                style={{ backgroundColor: '#52c41a', marginLeft: 8 }}
              />
            </h4>
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={() => setTitles([...titles, ''])}
              disabled={titles.length >= 10}
            >
              添加标题
            </Button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {titles.map((title, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span
                  style={{
                    minWidth: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: '#1890ff',
                    color: '#fff',
                    fontSize: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {index + 1}
                </span>
                <Input
                  placeholder={`请输入标题文案 ${index + 1}`}
                  value={title}
                  onChange={(e) => {
                    const newTitles = [...titles];
                    newTitles[index] = e.target.value;
                    setTitles(newTitles);
                  }}
                  size="large"
                  maxLength={30}
                  showCount
                />
                {titles.length > 1 && (
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() =>
                      setTitles(titles.filter((_, i) => i !== index))
                    }
                  />
                )}
              </div>
            ))}
          </div>
          <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 8 }}>
            每个标题最多 30 个字符，最多添加 10 个标题
          </div>
        </div>
      </div>
    );
  };

  // ---- Step 4 渲染 ----
  const renderStep4 = () => {
    const validTitles = titles.filter((t) => t.trim());
    const selectedVideos = mockVideos.filter((v) =>
      selectedVideoIds.includes(v.id)
    );
    const audience = mockAudiencePackages.find((p) => p.value === audienceId);
    const bidding = mockBiddingOptions.find((b) => b.value === biddingMethod);

    const previewPlans = generatePlanPreviews(
      selectedAccountKeys,
      selectedVideos,
      validTitles,
      audienceId,
      biddingMethod,
      targetBid
    );

    const totalPlans = previewPlans.length;
    const plansPerAccount =
      selectedAccountKeys.length > 0
        ? Math.round(totalPlans / selectedAccountKeys.length)
        : 0;

    const columns: ColumnsType<GeneratedPlanPreview> = [
      {
        title: '序号',
        key: 'index',
        width: 60,
        render: (_: unknown, __: GeneratedPlanPreview, index: number) => (
          <span style={{ color: '#8c8c8c' }}>{index + 1}</span>
        ),
      },
      {
        title: '计划ID',
        dataIndex: 'planId',
        key: 'planId',
        width: 160,
        render: (id: string) => (
          <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#8c8c8c' }}>
            {id}
          </span>
        ),
      },
      {
        title: '所属账户',
        dataIndex: 'accountName',
        key: 'accountName',
        width: 140,
        fixed: 'left',
      },
      {
        title: '视频素材',
        dataIndex: 'videoTitle',
        key: 'videoTitle',
        width: 140,
        ellipsis: true,
      },
      {
        title: '标题文案',
        dataIndex: 'textTitle',
        key: 'textTitle',
        width: 140,
        ellipsis: true,
      },
      {
        title: '受众包',
        dataIndex: 'audienceName',
        key: 'audienceName',
        width: 120,
      },
      {
        title: '出价方式',
        dataIndex: 'biddingMethod',
        key: 'biddingMethod',
        width: 80,
        render: (method: string) => <Tag color="blue">{method}</Tag>,
      },
      {
        title: '目标出价',
        dataIndex: 'targetBid',
        key: 'targetBid',
        width: 90,
        render: (val: number) => `¥${val.toFixed(biddingMethod === 'cpc' ? 2 : 0)}`,
      },
      {
        title: '日预算',
        dataIndex: 'dailyBudget',
        key: 'dailyBudget',
        width: 100,
        render: (val: number) => `¥${val.toLocaleString()}`,
      },
      {
        title: '预估展示',
        dataIndex: 'estimatedImpressions',
        key: 'estimatedImpressions',
        width: 100,
        render: (val: number) => val.toLocaleString(),
      },
      {
        title: '预估点击',
        dataIndex: 'estimatedClicks',
        key: 'estimatedClicks',
        width: 90,
        render: (val: number) => val.toLocaleString(),
      },
    ];

    return (
      <div>
        {/* 生成摘要 */}
        <Alert
          message={
            <span style={{ fontSize: 14 }}>
              <ThunderboltOutlined style={{ marginRight: 8, color: '#faad14' }} />
              计划生成预览
            </span>
          }
          description={
            <div style={{ fontSize: 13, lineHeight: 1.8 }}>
              <p style={{ marginBottom: 8 }}>
                根据您的配置（
                <Tag color="blue">
                  {audience ? audience.label : '未选择受众'}
                </Tag>{' '}
                ×{' '}
                <Tag color="purple">
                  {selectedVideos.length} 个视频
                </Tag>{' '}
                ×{' '}
                <Tag color="green">
                  {validTitles.length} 个标题
                </Tag>
                ），系统将在选中的{' '}
                <strong style={{ color: '#1890ff' }}>
                  {selectedAccountKeys.length}
                </strong>{' '}
                个账户下，各生成{' '}
                <strong style={{ color: '#1890ff' }}>
                  {plansPerAccount}
                </strong>{' '}
                条计划，总计生成{' '}
                <strong style={{ color: '#ff4d4f', fontSize: 16 }}>
                  {totalPlans}
                </strong>{' '}
                条计划。
              </p>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <div>
                  <span style={{ color: '#8c8c8c' }}>出价方式：</span>
                  <Tag color="blue">
                    {bidding?.label.split(' - ')[0]}
                  </Tag>
                </div>
                <div>
                  <span style={{ color: '#8c8c8c' }}>目标出价：</span>
                  <Tag color="orange">¥{targetBid.toFixed(biddingMethod === 'cpc' ? 2 : 0)}</Tag>
                </div>
                <div>
                  <span style={{ color: '#8c8c8c' }}>目标账户：</span>
                  {selectedAccountKeys.map((key) => {
                    const acc = mockTransferAccounts.find(
                      (a) => a.key === key
                    );
                    return acc ? (
                      <Tag key={key} color="cyan">
                        {acc.title}
                      </Tag>
                    ) : null;
                  })}
                </div>
              </div>
            </div>
          }
          type="success"
          showIcon
          style={{ marginBottom: 16 }}
        />

        {/* 预览表格 */}
        <div
          style={{
            border: '1px solid #f0f0f0',
            borderRadius: 8,
            overflow: 'auto',
            maxHeight: 360,
          }}
        >
          <Table<GeneratedPlanPreview>
            columns={columns}
            dataSource={previewPlans}
            pagination={false}
            size="small"
            scroll={{ x: 1400 }}
            rowClassName={() => 'preview-row'}
          />
        </div>
      </div>
    );
  };

  // ---- 步骤内容 ----
  const stepContents = [renderStep1, renderStep2, renderStep3, renderStep4];

  // ---- 验证 ----
  const validateStep = (): boolean => {
    switch (currentStep) {
      case 0:
        if (selectedAccountKeys.length === 0) {
          message.warning('请至少选择一个目标账户');
          return false;
        }
        return true;
      case 1:
        if (!audienceId) {
          message.warning('请选择受众包');
          return false;
        }
        if (targetBid <= 0) {
          message.warning('请输入有效的目标出价');
          return false;
        }
        return true;
      case 2:
        if (selectedVideoIds.length === 0) {
          message.warning('请至少选择一个视频素材');
          return false;
        }
        const validTitles = titles.filter((t) => t.trim());
        if (validTitles.length === 0) {
          message.warning('请至少填写一个标题文案');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  // ---- 下一步 ----
  const handleNext = () => {
    if (!validateStep()) return;
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  // ---- 上一步 ----
  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // ---- 提交 ----
  const handleSubmit = () => {
    if (!validateStep()) return;
    message.success(
      `成功创建 ${
        generatePlanPreviews(
          selectedAccountKeys,
          mockVideos.filter((v) => selectedVideoIds.includes(v.id)),
          titles.filter((t) => t.trim()),
          audienceId,
          biddingMethod,
          targetBid
        ).length
      } 条投放计划`
    );
    handleClose();
    onSuccess();
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ThunderboltOutlined style={{ color: '#faad14' }} />
          <span>批量新建投放计划</span>
        </div>
      }
      open={open}
      onCancel={handleClose}
      width={isMobile ? '95vw' : 960}
      maskClosable={false}
      destroyOnClose
      footer={
        currentStep < 3 ? (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button onClick={handleClose}>取消</Button>
            <Space>
              {currentStep > 0 && (
                <Button onClick={handlePrev}>上一步</Button>
              )}
              <Button type="primary" onClick={handleNext}>
                下一步
              </Button>
            </Space>
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button onClick={handlePrev}>上一步</Button>
            <Space>
              <Button onClick={handleClose}>取消</Button>
              <Button type="primary" onClick={handleSubmit}>
                确认生成
              </Button>
            </Space>
          </div>
        )
      }
    >
      {/* Steps 步骤条 */}
      <Steps
        current={currentStep}
        items={[
          { title: '选择账户', description: '目标广告账户' },
          { title: '基础定向', description: '受众与出价' },
          { title: '素材文案', description: '视频与标题' },
          { title: '预览确认', description: '计划预览' },
        ]}
        style={{ marginBottom: 32 }}
      />

      {/* 步骤内容 */}
      <div style={{ minHeight: 400 }}>
        {stepContents[currentStep]()}
      </div>
    </Modal>
  );
};

export default BatchCreatePlanModal;

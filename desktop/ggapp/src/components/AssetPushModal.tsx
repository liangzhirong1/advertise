import React, { useState } from 'react';
import {
  Modal,
  Steps,
  Radio,
  TreeSelect,
  Alert,
  Table,
  Tag,
  Spin,
  Button,
  message,
  Result,
} from 'antd';
import {
  ThunderboltOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import {
  mockPushTargetAccounts,
  type PushResult,
} from '../data/mockAssets';
import { useResponsive } from '../hooks/useResponsive';

interface AssetPushModalProps {
  visible: boolean;
  selectedAssetKeys: React.Key[];
  onClose: () => void;
  onSuccess: () => void;
}

// ============================================================
// 常量
// ============================================================

const entityOptions = Array.from(new Set(mockPushTargetAccounts.map((a) => a.entityId))).map(
  (entityId) => {
    const acc = mockPushTargetAccounts.find((a) => a.entityId === entityId)!;
    return {
      value: entityId,
      label: acc.entityName,
      accounts: mockPushTargetAccounts.filter((a) => a.entityId === entityId),
    };
  }
);

// ============================================================
// 主组件
// ============================================================

const AssetPushModal: React.FC<AssetPushModalProps> = ({
  visible,
  selectedAssetKeys,
  onClose,
  onSuccess,
}) => {
  const { isMobile } = useResponsive();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedEntity, setSelectedEntity] = useState<string>('');
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [pushing, setPushing] = useState(false);
  const [pushResults, setPushResults] = useState<PushResult[]>([]);

  // ---- 当前选中的实体 ----
  const currentEntity = entityOptions.find((e) => e.value === selectedEntity);

  // ---- 当前实体的账户 ----
  const entityAccounts = currentEntity?.accounts || [];

  // ---- 下一步 ----
  const handleNext = () => {
    if (currentStep === 0 && !selectedEntity) {
      message.warning('请选择目标应用主体');
      return;
    }
    if (currentStep === 1 && selectedAccounts.length === 0) {
      message.warning('请至少选择一个目标账户');
      return;
    }
    if (currentStep === 2) {
      // 执行推送
      handlePush();
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  // ---- 执行推送 ----
  const handlePush = () => {
    setPushing(true);

    // 模拟推送过程
    setTimeout(() => {
      const results: PushResult[] = entityAccounts
        .filter((acc) => selectedAccounts.includes(acc.advertiserId))
        .map((acc) => {
          // 模拟：余额为 0 的账户推送失败
          const success = acc.advertiserId !== '100005';
          return {
            advertiserId: acc.advertiserId,
            advertiserName: acc.advertiserName,
            success,
            message: success
              ? undefined
              : 'ERR_PERMISSION_DENIED: 该账户未授权或资质审核未通过，无法推送素材',
          };
        });

      setPushResults(results);
      setPushing(false);
      setCurrentStep(3);
    }, 2000);
  };

  // ---- 重置 ----
  const handleReset = () => {
    setCurrentStep(0);
    setSelectedEntity('');
    setSelectedAccounts([]);
    setPushResults([]);
    onClose();
  };

  // ---- 推送结果表格列 ----
  const resultColumns: ColumnsType<PushResult> = [
    {
      title: '账户名称',
      dataIndex: 'advertiserName',
      key: 'advertiserName',
      width: 180,
    },
    {
      title: '账户ID',
      dataIndex: 'advertiserId',
      key: 'advertiserId',
      width: 100,
      render: (id: string) => (
        <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#8c8c8c' }}>{id}</span>
      ),
    },
    {
      title: '结果',
      dataIndex: 'success',
      key: 'success',
      width: 100,
      render: (success: boolean) =>
        success ? (
          <Tag icon={<CheckCircleOutlined />} color="green">
            成功
          </Tag>
        ) : (
          <Tag icon={<CloseCircleOutlined />} color="red">
            失败
          </Tag>
        ),
    },
    {
      title: '错误信息',
      dataIndex: 'message',
      key: 'message',
      render: (msg?: string) =>
        msg ? (
          <span style={{ fontSize: 12, color: '#ff4d4f' }}>{msg}</span>
        ) : (
          <span style={{ color: '#bfbfbf' }}>-</span>
        ),
    },
  ];

  const successCount = pushResults.filter((r) => r.success).length;
  const failCount = pushResults.filter((r) => !r.success).length;
  const selectedAssetCount = selectedAssetKeys.length;

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ThunderboltOutlined style={{ color: '#faad14' }} />
          <span>素材跨账户推送</span>
          {selectedAssetCount > 0 && (
            <Tag color="blue" style={{ marginLeft: 8 }}>
              {selectedAssetCount} 个素材
            </Tag>
          )}
        </div>
      }
      open={visible}
      onCancel={handleReset}
      width={isMobile ? '95vw' : 720}
      maskClosable={!pushing}
      destroyOnClose
      footer={
        currentStep < 3
          ? [
              <Button key="cancel" onClick={handleReset}>
                取消
              </Button>,
              <Button key="next" type="primary" onClick={handleNext} loading={pushing}>
                {currentStep === 2 ? '开始推送' : '下一步'}
              </Button>,
            ]
          : [
              <Button key="reset" onClick={handleReset}>
                关闭
              </Button>,
              <Button
                key="success"
                type="primary"
                onClick={() => {
                  onSuccess();
                  handleReset();
                }}
              >
                完成
              </Button>,
            ]
      }
    >
      {/* Steps */}
      <Steps
        current={currentStep}
        items={[
          { title: '选择应用主体' },
          { title: '选择目标账户' },
          { title: '权限校验' },
          { title: '推送结果' },
        ]}
        style={{ marginBottom: 32 }}
      />

      {/* Step 0: 选择应用主体 */}
      {currentStep === 0 && (
        <div>
          <Alert
            message="选择目标应用主体"
            description="素材将推送到所选应用主体下的广告账户。跨应用推送需要进行合规校验。"
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
          <Radio.Group
            value={selectedEntity}
            onChange={(e) => {
              setSelectedEntity(e.target.value);
              setSelectedAccounts([]);
            }}
            style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
          >
            {entityOptions.map((entity) => {
              const accountCount = entity.accounts.length;
              return (
                <Radio
                  key={entity.value}
                  value={entity.value}
                  style={{
                    padding: 16,
                    border: selectedEntity === entity.value ? '2px solid #1890ff' : '1px solid #f0f0f0',
                    borderRadius: 8,
                    backgroundColor: selectedEntity === entity.value ? '#e6f7ff' : '#fff',
                  }}
                >
                  <div style={{ fontWeight: 500, fontSize: 15 }}>{entity.label}</div>
                  <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 4 }}>
                    包含 {accountCount} 个广告账户
                  </div>
                </Radio>
              );
            })}
          </Radio.Group>
        </div>
      )}

      {/* Step 1: 选择目标账户 */}
      {currentStep === 1 && (
        <div>
          <Alert
            message={`目标应用：${currentEntity?.label || ''}`}
            description="选择要推送素材的具体广告账户，支持多选。"
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
          <TreeSelect
            treeData={entityAccounts.map((acc) => ({
              title: `${acc.advertiserName} (${acc.advertiserId})`,
              value: acc.advertiserId,
              key: acc.advertiserId,
            }))}
            treeCheckable
            value={selectedAccounts}
            onChange={(keys) => setSelectedAccounts(keys as string[])}
            placeholder="选择目标账户"
            showSearch
            style={{ width: '100%' }}
            size="large"
            maxTagCount="responsive"
          />
          {selectedAccounts.length > 0 && (
            <div style={{ marginTop: 12, fontSize: 13, color: '#52c41a' }}>
              ✓ 已选择 {selectedAccounts.length} 个账户
            </div>
          )}
        </div>
      )}

      {/* Step 2: 权限校验 */}
      {currentStep === 2 && (
        <div>
          <Alert
            message="推送预览"
            description={
              <div>
                <p>
                  将 <strong>{selectedAssetCount}</strong> 个素材推送至{' '}
                  <strong>{selectedAccounts.length}</strong> 个账户
                </p>
                <p>
                  目标应用：<Tag color="purple">{currentEntity?.label}</Tag>
                </p>
              </div>
            }
            type="warning"
            showIcon
            style={{ marginBottom: 16 }}
          />

          <div style={{ padding: 24, textAlign: 'center' }}>
            <Spin size="large" />
            <div style={{ marginTop: 16, fontSize: 14, color: '#8c8c8c' }}>
              <LoadingOutlined style={{ marginRight: 8 }} />
              合规校验中...
            </div>
            <div style={{ marginTop: 8, fontSize: 12, color: '#bfbfbf' }}>
              正在验证账户授权状态与素材推送权限
            </div>
          </div>
        </div>
      )}

      {/* Step 3: 推送结果 */}
      {currentStep === 3 && (
        <div>
          <Result
            status={failCount === 0 ? 'success' : 'warning'}
            title={
              failCount === 0
                ? '推送完成'
                : `推送完成（部分失败）`
            }
            subTitle={
              <div>
                <span>
                  成功推送 <strong style={{ color: '#52c41a' }}>{successCount}</strong> 个账户
                </span>
                {failCount > 0 && (
                  <span style={{ marginLeft: 16 }}>
                    失败 <strong style={{ color: '#ff4d4f' }}>{failCount}</strong> 个账户
                  </span>
                )}
              </div>
            }
            extra={[
              <Button
                key="retry"
                icon={<SyncOutlined />}
                disabled
                style={{ display: 'none' }}
              >
                重试失败
              </Button>,
            ]}
          />

          <Table<PushResult>
            columns={resultColumns}
            dataSource={pushResults}
            pagination={false}
            size="small"
            style={{ marginTop: 16 }}
          />
        </div>
      )}
    </Modal>
  );
};

export default AssetPushModal;

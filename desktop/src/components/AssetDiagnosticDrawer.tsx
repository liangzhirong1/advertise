import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Drawer,
  Button,
  Tag,
  Spin,
  Alert,
  Tooltip,
  message,
  Divider,
  Space,
} from 'antd';
import {
  PlayCircleOutlined,
  ReloadOutlined,
  RocketOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import {
  mockDiagnosticResults,
  DIAGNOSTIC_TYPE_CONFIG,
} from '../data/mockAssetDiagnostics';
import type { AssetDiagnosticResult, DiagnosticItem } from '../data/mockAssetDiagnostics';
import type { AssetItem } from '../data/mockAssets';
import { useResponsive } from '../hooks/useResponsive';

interface AssetDiagnosticDrawerProps {
  visible: boolean;
  asset: AssetItem | null;
  onClose: () => void;
}

// ============================================================
// 检测项卡片组件
// ============================================================

const DiagnosticItemCard: React.FC<{
  item: DiagnosticItem;
  onFix: (item: DiagnosticItem) => void;
  isFixing: boolean;
  isMobile?: boolean;
}> = ({ item, onFix, isFixing, isMobile }) => {
  const typeCfg = DIAGNOSTIC_TYPE_CONFIG[item.type];

  const severityTag =
    item.severity === 'high' ? (
      <Tag color="red" style={{ fontSize: 10, margin: 0 }}>
        严重
      </Tag>
    ) : item.severity === 'medium' ? (
      <Tag color="orange" style={{ fontSize: 10, margin: 0 }}>
        中等
      </Tag>
    ) : item.severity === 'low' ? (
      <Tag color="blue" style={{ fontSize: 10, margin: 0 }}>
        轻微
      </Tag>
    ) : null;

  return (
    <div
      style={{
        padding: isMobile ? '10px 12px' : '14px 16px',
        background: item.status === 'passed' ? '#f6ffed' : '#fffbe6',
        border: `1px solid ${item.status === 'passed' ? '#b7eb8f' : '#ffe58f'}`,
        borderRadius: 8,
        marginBottom: 12,
      }}
    >
      {/* 头部 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: isMobile ? 6 : 8,
          gap: 8,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 16 }}>{typeCfg.icon}</span>
          <span style={{ fontWeight: 600, fontSize: isMobile ? 13 : 14, color: '#1a1a1a' }}>
            {item.title}
          </span>
          {severityTag}
          {item.status === 'passed' && (
            <Tag color="green" style={{ fontSize: 10, margin: 0 }}>
              通过
            </Tag>
          )}
          {item.fixed && (
            <Tag color="blue" style={{ fontSize: 10, margin: 0 }}>
              已修复
            </Tag>
          )}
        </div>
        {item.score !== undefined && (
          <Tooltip title={`评分: ${item.score}/100`}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background:
                  item.score >= 80
                    ? '#f6ffed'
                    : item.score >= 60
                    ? '#fffbe6'
                    : '#fff2f0',
                border: `2px solid ${
                  item.score >= 80 ? '#52c41a' : item.score >= 60 ? '#faad14' : '#ff4d4f'
                }`,
              }}
            >
              <span
                style={{
                  fontSize: isMobile ? 12 : 14,
                  fontWeight: 700,
                  color:
                    item.score >= 80
                      ? '#52c41a'
                      : item.score >= 60
                      ? '#faad14'
                      : '#ff4d4f',
                }}
              >
                {item.score}
              </span>
            </div>
          </Tooltip>
        )}
      </div>

      {/* 描述 */}
      <p
        style={{
          fontSize: isMobile ? 12 : 13,
          color: '#595959',
          lineHeight: 1.5,
          margin: `0 0 ${isMobile ? 8 : 12}px`,
        }}
      >
        {item.description}
      </p>

      {/* 操作按钮 */}
      {item.fixable && item.status === 'issue' && !item.fixed && (
        <Button
          type="primary"
          size={isMobile ? 'small' : 'middle'}
          icon={<RocketOutlined />}
          loading={isFixing}
          onClick={() => onFix(item)}
          style={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            border: 'none',
          }}
        >
          修复此问题
        </Button>
      )}
    </div>
  );
};

// ============================================================
// 主组件
// ============================================================

const AssetDiagnosticDrawer: React.FC<AssetDiagnosticDrawerProps> = ({
  visible,
  asset,
  onClose,
}) => {
  const { isMobile } = useResponsive();

  // 使用 ref 跟踪组件是否已挂载，防止异步回调更新已卸载组件
  const mountedRef = useRef(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const [checking, setChecking] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState<AssetDiagnosticResult | null>(null);
  const [fixingItems, setFixingItems] = useState<Set<string>>(new Set());
  const [showComparison, setShowComparison] = useState(false);

  // ---- 安全的 setTimeout 封装 ----
  const safeSetTimeout = useCallback((callback: () => void, delay: number) => {
    const timerId = setTimeout(() => {
      if (mountedRef.current) {
        callback();
      }
    }, delay);
    timersRef.current.push(timerId);
    return timerId;
  }, []);

  // ---- 清理所有定时器 ----
  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  // ---- 组件挂载/卸载生命周期 ----
  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      clearAllTimers();
    };
  }, [clearAllTimers]);

  // ---- Drawer 关闭时立即重置所有状态（关键修复） ----
  useEffect(() => {
    if (!visible) {
      // 立即重置，不延迟
      setChecking(false);
      setDiagnosticResult(null);
      setFixingItems(new Set());
      setShowComparison(false);
      clearAllTimers();
    }
  }, [visible, clearAllTimers]);

  // ---- 封装关闭逻辑，确保在动画开始前重置状态 ----
  const handleClose = useCallback(() => {
    // 先重置内部状态
    setChecking(false);
    setDiagnosticResult(null);
    setFixingItems(new Set());
    setShowComparison(false);
    clearAllTimers();
    // 再通知父组件关闭
    onClose();
  }, [onClose, clearAllTimers]);

  // ---- 一键检测 ----
  const handleDetect = useCallback(() => {
    if (!asset || !mountedRef.current) return;

    clearAllTimers();
    setChecking(true);
    setDiagnosticResult(null);
    setShowComparison(false);

    safeSetTimeout(() => {
      if (!mountedRef.current) return;

      const result = mockDiagnosticResults[asset.key];
      if (result) {
        setDiagnosticResult({ ...result });
      } else {
        setDiagnosticResult({
          assetId: asset.key,
          assetName: asset.name,
          checkedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
          overallScore: 85,
          beforePreview: asset.thumbnail,
          afterPreview: asset.thumbnail,
          items: [
            {
              id: 'diag_default',
              type: 'quality',
              title: '画质评分',
              description: '画质评分 85 分，达到优质标准。',
              status: 'passed',
              score: 85,
              fixable: false,
              fixed: false,
            },
          ],
        });
      }
      setChecking(false);
    }, 2000);
  }, [asset, clearAllTimers, safeSetTimeout]);

  // ---- 修复单个问题 ----
  const handleFix = useCallback(
    (item: DiagnosticItem) => {
      if (!diagnosticResult || !mountedRef.current) return;

      clearAllTimers();
      setFixingItems((prev) => new Set(prev).add(item.id));

      safeSetTimeout(() => {
        if (!mountedRef.current) return;

        setDiagnosticResult((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            items: prev.items.map((i) =>
              i.id === item.id ? { ...i, status: 'passed' as const, fixed: true } : i
            ),
          };
        });
        setFixingItems((prev) => {
          const next = new Set(prev);
          next.delete(item.id);
          return next;
        });
        message.success(`已修复: ${item.title}`);

        // 检查是否所有问题都已修复
        safeSetTimeout(() => {
          if (!mountedRef.current) return;
          setDiagnosticResult((prev) => {
            if (!prev) return prev;
            const allFixed = prev.items.every((i) => i.status === 'passed' || i.fixed);
            if (allFixed) {
              setShowComparison(true);
              message.success('所有问题已修复，可查看对比预览');
            }
            return prev;
          });
        }, 100);
      }, 1500);
    },
    [diagnosticResult, clearAllTimers, safeSetTimeout]
  );

  // ---- 计算总体评分 ----
  const overallScore = diagnosticResult?.overallScore || 0;
  const issueCount = diagnosticResult?.items.filter((i) => i.status === 'issue').length || 0;
  const fixedCount = diagnosticResult?.items.filter((i) => i.fixed).length || 0;

  const scoreColor =
    overallScore >= 80 ? '#52c41a' : overallScore >= 60 ? '#faad14' : '#ff4d4f';

  return (
    <Drawer
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ThunderboltOutlined style={{ color: '#faad14' }} />
          <span>诊断修复 - {asset?.name || ''}</span>
        </div>
      }
      width={isMobile ? '100%' : 680}
      open={visible}
      onClose={handleClose}
      destroyOnClose
      extra={
        <Button icon={<ReloadOutlined />} onClick={handleDetect} loading={checking}>
          重新检测
        </Button>
      }
    >
      {/* 视频预览区 */}
      <div
        style={{
          width: '100%',
          aspectRatio: '16/9',
          background: asset?.thumbnail || '#f0f0f0',
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 20,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <PlayCircleOutlined
          style={{
            fontSize: 48,
            color: 'rgba(255,255,255,0.9)',
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
          }}
        />
        {checking && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <Spin size="large" />
            <span style={{ color: '#fff', fontSize: 14 }}>正在检测素材...</span>
          </div>
        )}
      </div>

      {/* 一键检测按钮 */}
      {!diagnosticResult && !checking && (
        <Button
          type="primary"
          size="large"
          icon={<ThunderboltOutlined />}
          onClick={handleDetect}
          block
          style={{
            height: 48,
            fontSize: 16,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            border: 'none',
            marginBottom: 20,
          }}
        >
          一键检测
        </Button>
      )}

      {/* 检测结果 */}
      {diagnosticResult && (
        <>
          {/* 总体评分 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              background: '#fafafa',
              borderRadius: 8,
              marginBottom: 16,
              flexWrap: 'wrap',
              gap: 8,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: `${scoreColor}15`,
                  border: `3px solid ${scoreColor}`,
                }}
              >
                <span style={{ fontSize: 20, fontWeight: 700, color: scoreColor }}>
                  {overallScore}
                </span>
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 15, color: '#1a1a1a' }}>
                  综合评分
                </div>
                <div style={{ fontSize: 12, color: '#8c8c8c' }}>
                  检测时间: {diagnosticResult.checkedAt}
                </div>
              </div>
            </div>
            <Space>
              <Tag color={issueCount > 0 ? 'orange' : 'green'}>
                {issueCount > 0 ? `${issueCount} 个问题` : '全部通过'}
              </Tag>
              {fixedCount > 0 && (
                <Tag color="blue">已修复 {fixedCount} 个</Tag>
              )}
            </Space>
          </div>

          {/* 对比预览 */}
          {showComparison && (
            <Alert
              message="修复完成 - 对比预览"
              description="左侧为原版，右侧为修复后版本"
              type="success"
              showIcon
              style={{ marginBottom: 16 }}
            />
          )}

          {showComparison && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 12,
                marginBottom: 16,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 12,
                    color: '#8c8c8c',
                    marginBottom: 4,
                    textAlign: 'center',
                  }}
                >
                  原版
                </div>
                <div
                  style={{
                    width: '100%',
                    aspectRatio: '16/9',
                    background: diagnosticResult.beforePreview,
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <PlayCircleOutlined
                    style={{ fontSize: 28, color: 'rgba(255,255,255,0.8)' }}
                  />
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: 12,
                    color: '#52c41a',
                    marginBottom: 4,
                    textAlign: 'center',
                    fontWeight: 500,
                  }}
                >
                  修复后 ✓
                </div>
                <div
                  style={{
                    width: '100%',
                    aspectRatio: '16/9',
                    background: diagnosticResult.afterPreview,
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid #52c41a',
                  }}
                >
                  <PlayCircleOutlined
                    style={{ fontSize: 28, color: 'rgba(255,255,255,0.8)' }}
                  />
                </div>
              </div>
            </div>
          )}

          <Divider style={{ margin: '16px 0' }} />

          {/* 检测项列表 */}
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: '#1a1a1a' }}>
            检测详情
          </div>
          {diagnosticResult.items.map((item) => (
            <DiagnosticItemCard
              key={item.id}
              item={item}
              onFix={handleFix}
              isFixing={fixingItems.has(item.id)}
              isMobile={isMobile}
            />
          ))}
        </>
      )}
    </Drawer>
  );
};

export default AssetDiagnosticDrawer;

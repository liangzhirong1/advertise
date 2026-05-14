import React from 'react';
import { Modal, Descriptions, Tag, Statistic, Row, Col, Card } from 'antd';
import {
  VideoCameraOutlined,
  PictureOutlined,
  SendOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import type { AssetItem } from '../data/mockAssets';
import { useResponsive } from '../hooks/useResponsive';

interface AssetDetailModalProps {
  visible: boolean;
  asset: AssetItem | null;
  onClose: () => void;
}

// ============================================================
// Sparkline 组件（迷你折线图）
// ============================================================

const Sparkline: React.FC<{ data: number[]; color?: string }> = ({ data, color = '#1890ff' }) => {
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const width = 160;
  const height = 40;
  const padding = 4;

  const points = data.map((val, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((val - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  });

  const areaPoints = [
    `${padding},${height - padding}`,
    ...points,
    `${width - padding},${height - padding}`,
  ];

  const isUp = data[data.length - 1] > data[0];

  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      <defs>
        <linearGradient id={`sparkGrad_${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints.join(' ')} fill={`url(#sparkGrad_${color.replace('#', '')})`} />
      <polyline
        points={points.join(' ')}
        fill="none"
        stroke={isUp ? '#52c41a' : '#faad14'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {data.map((val, i) => {
        const x = padding + (i / (data.length - 1)) * (width - padding * 2);
        const y = height - padding - ((val - min) / range) * (height - padding * 2);
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={i === data.length - 1 ? 3 : 1.5}
            fill={isUp ? '#52c41a' : '#faad14'}
          />
        );
      })}
    </svg>
  );
};

// ============================================================
// 主组件
// ============================================================

const AssetDetailModal: React.FC<AssetDetailModalProps> = ({ visible, asset, onClose }) => {
  const { isMobile } = useResponsive();
  if (!asset) return null;

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {asset.type === 'video' ? (
            <VideoCameraOutlined style={{ color: '#722ed1' }} />
          ) : (
            <PictureOutlined style={{ color: '#1890ff' }} />
          )}
          <span>{asset.name}</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      width={isMobile ? '95vw' : 720}
      footer={null}
      destroyOnClose
    >
      {/* 预览区 */}
      <div
        style={{
          width: '100%',
          aspectRatio: asset.type === 'video' ? '16/9' : '1/1',
          background: asset.thumbnail,
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 24,
        }}
      >
        {asset.type === 'video' ? (
          <VideoCameraOutlined
            style={{ fontSize: 64, color: 'rgba(255,255,255,0.9)', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}
          />
        ) : (
          <PictureOutlined
            style={{ fontSize: 64, color: 'rgba(255,255,255,0.9)', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}
          />
        )}
      </div>

      {/* 基本信息 */}
      <Descriptions
        bordered
        size="small"
        column={2}
        style={{ marginBottom: 24 }}
      >
        <Descriptions.Item label="素材类型">
          <Tag color={asset.type === 'video' ? 'purple' : 'blue'}>
            {asset.type === 'video' ? '视频' : '图片'}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="文件格式">
          {asset.format} {asset.resolution && `· ${asset.resolution}`}
        </Descriptions.Item>
        <Descriptions.Item label="文件大小">{asset.size}</Descriptions.Item>
        {asset.duration && <Descriptions.Item label="时长">{asset.duration}</Descriptions.Item>}
        <Descriptions.Item label="上传日期">{asset.uploadedAt}</Descriptions.Item>
        <Descriptions.Item label="上传人">{asset.uploadedBy}</Descriptions.Item>
        <Descriptions.Item label="MD5 值" span={2}>
          <code style={{ fontSize: 11, color: '#8c8c8c' }}>{asset.md5}</code>
        </Descriptions.Item>
        <Descriptions.Item label="标签" span={2}>
          {asset.tags.map((tag) => (
            <Tag key={tag} color="cyan" style={{ margin: '2px' }}>
              {tag}
            </Tag>
          ))}
        </Descriptions.Item>
      </Descriptions>

      {/* 效果统计 */}
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <SendOutlined style={{ color: '#52c41a' }} />
            <span>推送与效果数据</span>
          </div>
        }
        bordered={false}
        style={{ borderRadius: 12 }}
      >
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Statistic
              title="推送次数"
              value={asset.pushCount}
              prefix={<SendOutlined />}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="聚合消耗"
              value={asset.totalSpend}
              prefix={<DollarOutlined />}
              precision={0}
              suffix="元"
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="最近 7 天趋势"
              value={0}
              prefix={
                asset.sparkline[asset.sparkline.length - 1] > asset.sparkline[0] ? (
                  <span style={{ color: '#52c41a' }}>↑</span>
                ) : (
                  <span style={{ color: '#faad14' }}>→</span>
                )
              }
            />
          </Col>
        </Row>

        {/* Sparkline 图表 */}
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 8 }}>
            近 7 天消耗趋势（元）
          </div>
          <Sparkline data={asset.sparkline} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#bfbfbf', marginTop: 4 }}>
            <span>05-02</span>
            <span>05-03</span>
            <span>05-04</span>
            <span>05-05</span>
            <span>05-06</span>
            <span>05-07</span>
            <span>05-08</span>
          </div>
        </div>
      </Card>
    </Modal>
  );
};

export default AssetDetailModal;

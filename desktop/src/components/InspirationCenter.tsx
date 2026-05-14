import React, { useState } from 'react';
import { Card, Tag, Button, message, Tooltip, Badge } from 'antd';
import {
  BulbOutlined,
  RocketOutlined,
  RiseOutlined,
  FallOutlined,
  MinusOutlined,
} from '@ant-design/icons';
import {
  mockInspirationTags,
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  type InspirationTag,
} from '../data/mockAssetDiagnostics';
import { useResponsive } from '../hooks/useResponsive';

interface InspirationCenterProps {
  onApplyTags?: (tags: InspirationTag[]) => void;
}

// ============================================================
// 主组件
// ============================================================

const InspirationCenter: React.FC<InspirationCenterProps> = ({ onApplyTags }) => {
  const { isMobile } = useResponsive();
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

  // ---- 切换标签选中 ----
  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      if (next.has(tagId)) {
        next.delete(tagId);
      } else {
        next.add(tagId);
      }
      return next;
    });
  };

  // ---- 一键应用 ----
  const handleApply = () => {
    if (selectedTags.size === 0) {
      message.warning('请先选择标签');
      return;
    }
    const selected = mockInspirationTags.filter((t) => selectedTags.has(t.id));
    onApplyTags?.(selected);
  };

  // ---- 趋势图标 ----
  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <RiseOutlined style={{ color: '#52c41a', fontSize: 10 }} />;
      case 'down':
        return <FallOutlined style={{ color: '#ff4d4f', fontSize: 10 }} />;
      default:
        return <MinusOutlined style={{ color: '#8c8c8c', fontSize: 10 }} />;
    }
  };

  // ---- 标签云样式 ----
  const getTagStyle = (tag: InspirationTag, isSelected: boolean) => {
    const baseStyle: React.CSSProperties = {
      cursor: 'pointer',
      transition: 'all 0.2s',
      margin: isMobile ? '3px' : '4px',
      padding: isMobile ? '3px 10px' : '4px 12px',
      fontSize: isMobile ? 11 : 12,
      borderRadius: 20,
      border: isSelected ? `2px solid ${CATEGORY_COLORS[tag.category]}` : '2px solid transparent',
      background: isSelected
        ? `${CATEGORY_COLORS[tag.category]}20`
        : 'rgba(0,0,0,0.02)',
      color: isSelected ? CATEGORY_COLORS[tag.category] : '#595959',
      fontWeight: isSelected ? 600 : 400,
    };

    // 根据使用次数调整字体大小
    if (tag.count > 600) {
      baseStyle.fontSize = (isMobile ? 13 : 14) as number;
      baseStyle.fontWeight = 600;
    } else if (tag.count > 400) {
      baseStyle.fontSize = (isMobile ? 12 : 13) as number;
    }

    return baseStyle;
  };

  // ---- 按分类分组 ----
  const groupedTags: Record<string, InspirationTag[]> = {};
  mockInspirationTags.forEach((tag) => {
    if (!groupedTags[tag.category]) {
      groupedTags[tag.category] = [];
    }
    groupedTags[tag.category].push(tag);
  });

  return (
    <Card
      bordered={false}
      style={{ borderRadius: 12 }}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <BulbOutlined style={{ color: '#faad14' }} />
          <span style={{ fontSize: isMobile ? 14 : 15 }}>灵感中心</span>
          <Badge
            count={selectedTags.size}
            style={{ backgroundColor: '#6366f1' }}
            showZero
          />
        </div>
      }
      extra={
        <Button
          type="primary"
          icon={<RocketOutlined />}
          onClick={handleApply}
          disabled={selectedTags.size === 0}
          size={isMobile ? 'small' : 'middle'}
          style={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            border: 'none',
          }}
        >
          一键应用至新建计划
        </Button>
      }
      bodyStyle={{ padding: isMobile ? 12 : 20 }}
    >
      <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 12 }}>
        点击标签选中，选中的标签将自动填充至新建计划的素材/受众偏好字段
      </div>

      {/* 按分类展示 */}
      {Object.entries(groupedTags).map(([category, tags]) => (
        <div key={category} style={{ marginBottom: 16 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: CATEGORY_COLORS[category],
              marginBottom: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: CATEGORY_COLORS[category],
              }}
            />
            {CATEGORY_LABELS[category]}
          </div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: isMobile ? 4 : 6,
            }}
          >
            {tags.map((tag) => {
              const isSelected = selectedTags.has(tag.id);
              return (
                <Tooltip
                  key={tag.id}
                  title={`${tag.count} 次使用 · ${CATEGORY_LABELS[tag.category]}`}
                >
                  <Tag
                    style={getTagStyle(tag, isSelected)}
                    onClick={() => toggleTag(tag.id)}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      {tag.label}
                      {getTrendIcon(tag.trend)}
                      <span
                        style={{
                          fontSize: 10,
                          opacity: 0.7,
                        }}
                      >
                        {tag.trendPercent > 0 ? '+' : ''}
                        {tag.trendPercent}%
                      </span>
                    </span>
                  </Tag>
                </Tooltip>
              );
            })}
          </div>
        </div>
      ))}
    </Card>
  );
};

export default InspirationCenter;

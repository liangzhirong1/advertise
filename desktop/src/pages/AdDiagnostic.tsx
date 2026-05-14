import React, { useRef, useEffect, useMemo, useState } from 'react';
import {
  Card,
  Tag,
  Button,
  Timeline,
  Progress,
  message,
  Popconfirm,
  Row,
  Col,
  Select,
  Badge,
  Space,
} from 'antd';
import {
  WarningOutlined,
  RiseOutlined,
  ThunderboltOutlined,
  BulbOutlined,
  RocketOutlined,
  EditOutlined,
  PictureOutlined,
  ExpandOutlined,
  DollarOutlined,
  ReloadOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import * as echarts from 'echarts';
import {
  mockDiagnosticProjects,
  CONCLUSION_CONFIG,
  type AdUnit,
  type DiagnosticSuggestion,
  type SuggestionPriority,
} from '../data/mockAdDiagnostic';
import { useResponsive } from '../hooks/useResponsive';

// ============================================================
// 常量
// ============================================================

const PRIORITY_CONFIG: Record<SuggestionPriority, { label: string; color: string }> = {
  high: { label: '高优先级', color: 'red' },
  medium: { label: '中优先级', color: 'orange' },
  low: { label: '低优先级', color: 'blue' },
};

const STATUS_CONFIG = {
  running: { label: '投放中', color: 'green' },
  paused: { label: '已暂停', color: 'orange' },
  learning: { label: '学习中', color: '#1890ff' },
  stuck: { label: '学习停滞', color: '#ff4d4f' },
};

const LEARNING_PHASE_CONFIG = {
  not_started: { label: '未开始', color: '#d9d9d9' },
  in_progress: { label: '进行中', color: '#1890ff' },
  completed: { label: '已完成', color: '#52c41a' },
  stuck: { label: '已停滞', color: '#ff4d4f' },
};

const PROJECT_TYPE_CONFIG: Record<string, { label: string; color: string }> = {
  brand: { label: '品牌', color: '#722ed1' },
  performance: { label: '效果', color: '#1890ff' },
  ecommerce: { label: '电商', color: '#fa8c16' },
  game: { label: '游戏', color: '#eb2f96' },
  education: { label: '教育', color: '#13c2c2' },
};

// ============================================================
// 雷达图组件
// ============================================================

const RadarChart: React.FC<{ data: AdUnit['radarData']; isMobile?: boolean }> = ({
  data,
  isMobile,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    const chart = chartInstance.current;

    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(255,255,255,0.96)',
        borderColor: '#f0f0f0',
        borderWidth: 1,
        textStyle: { color: '#333', fontSize: 12 },
        formatter: (params: unknown) => {
          const p = params as { name: string; value: number; seriesName: string };
          const dim = data.find((d) => d.name === p.name);
          if (!dim) return '';
          const diff = dim.value - dim.industryAvg;
          const isAbove = diff >= 0;
          return `<div style="font-weight:600;margin-bottom:4px">${p.name}</div>
            <div>当前得分: <strong>${dim.value}</strong> 分</div>
            <div>行业均值: <strong>${dim.industryAvg}</strong> 分</div>
            <div style="color:${isAbove ? '#52c41a' : '#ff4d4f'}">
              ${isAbove ? '↑' : '↓'} ${Math.abs(diff)} 分 ${isAbove ? '高于' : '低于'}行业均值
            </div>`;
        },
      },
      legend: {
        data: ['当前得分', '行业均值'],
        top: 0,
        textStyle: { fontSize: 11, color: '#8c8c8c' },
        itemWidth: 10,
        itemHeight: 10,
      },
      radar: {
        indicator: data.map((d) => ({ name: d.name, max: 100 })),
        shape: 'polygon',
        radius: isMobile ? '50%' : '60%',
        center: ['50%', '55%'],
        splitNumber: 4,
        axisName: {
          color: '#666',
          fontSize: isMobile ? 10 : 11,
        },
        splitLine: {
          lineStyle: { color: 'rgba(0,0,0,0.06)' },
        },
        splitArea: {
          show: true,
          areaStyle: {
            color: [
              'rgba(99,102,241,0.02)',
              'rgba(99,102,241,0.04)',
              'rgba(99,102,241,0.06)',
              'rgba(99,102,241,0.08)',
            ],
          },
        },
        axisLine: {
          lineStyle: { color: 'rgba(0,0,0,0.06)' },
        },
      },
      series: [
        {
          type: 'radar',
          data: [
            {
              name: '当前得分',
              value: data.map((d) => d.value),
              lineStyle: { color: '#6366f1', width: 2 },
              itemStyle: { color: '#6366f1' },
              areaStyle: { color: 'rgba(99,102,241,0.15)' },
              symbol: 'circle',
              symbolSize: 5,
            },
            {
              name: '行业均值',
              value: data.map((d) => d.industryAvg),
              lineStyle: { color: '#d9d9d9', width: 1, type: 'dashed' },
              itemStyle: { color: '#d9d9d9' },
              areaStyle: { color: 'rgba(217,217,217,0.05)' },
              symbol: 'circle',
              symbolSize: 3,
            },
          ],
        },
      ],
    };

    chart.setOption(option);

    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.dispose();
      chartInstance.current = null;
    };
  }, [data, isMobile]);

  return <div ref={chartRef} style={{ width: '100%', height: isMobile ? 200 : 260 }} />;
};

// ============================================================
// 建议操作按钮映射
// ============================================================

const ACTION_ICONS: Record<string, React.ReactNode> = {
  update_bid: <DollarOutlined />,
  replace_creative: <PictureOutlined />,
  expand_targeting: <ExpandOutlined />,
  optimize_landing_page: <EditOutlined />,
  increase_budget: <ThunderboltOutlined />,
};

// ============================================================
// 单元卡片组件
// ============================================================

const UnitCard: React.FC<{
  unit: AdUnit;
  isMobile?: boolean;
}> = ({ unit, isMobile }) => {
  const conclusionTags = unit.conclusions.map((c) => {
    const cfg = CONCLUSION_CONFIG[c];
    return (
      <Tag key={c} color={cfg.color} style={{ fontSize: 11, margin: 0 }}>
        {cfg.icon} {cfg.label}
      </Tag>
    );
  });

  return (
    <Card
      size="small"
      style={{ borderRadius: 10, borderLeft: '4px solid #6366f1' }}
      bodyStyle={{ padding: isMobile ? 10 : 14 }}
    >
      {/* 单元头部 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: isMobile ? 8 : 12,
          gap: 8,
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 4,
              flexWrap: 'wrap',
            }}
          >
            <span
              style={{
                fontWeight: 600,
                fontSize: isMobile ? 13 : 14,
                color: '#1a1a1a',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {unit.adName}
            </span>
            <Tag color={STATUS_CONFIG[unit.status].color} style={{ fontSize: 10, margin: 0 }}>
              {STATUS_CONFIG[unit.status].label}
            </Tag>
          </div>
          <div style={{ fontSize: 11, color: '#8c8c8c', marginBottom: 4 }}>
            <TeamOutlined style={{ marginRight: 4 }} />
            {unit.accountName} · {unit.campaignName}
          </div>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>{conclusionTags}</div>
        </div>
      </div>

      {/* 学习期进度 */}
      <div style={{ marginBottom: isMobile ? 8 : 12 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 4,
          }}
        >
          <span style={{ fontSize: 11, color: '#8c8c8c' }}>学习期</span>
          <Tag
            color={LEARNING_PHASE_CONFIG[unit.learningPhase].color}
            style={{ fontSize: 10, margin: 0 }}
          >
            {LEARNING_PHASE_CONFIG[unit.learningPhase].label}
          </Tag>
        </div>
        <Progress
          percent={unit.learningPhaseProgress}
          strokeColor={
            unit.learningPhase === 'completed'
              ? '#52c41a'
              : unit.learningPhase === 'stuck'
              ? '#ff4d4f'
              : '#1890ff'
          }
          size="small"
          style={{ marginBottom: 0 }}
        />
      </div>

      {/* 雷达图 */}
      <RadarChart data={unit.radarData} isMobile={isMobile} />
    </Card>
  );
};

// ============================================================
// 主组件
// ============================================================

const AdDiagnostic: React.FC = () => {
  const { isMobile } = useResponsive();
  const [selectedProjectId, setSelectedProjectId] = useState<string>(mockDiagnosticProjects[0].projectId);
  const [applyingSuggestions, setApplyingSuggestions] = useState<Set<string>>(new Set());

  // ---- 当前项目 ----
  const currentProject = useMemo(
    () => mockDiagnosticProjects.find((p) => p.projectId === selectedProjectId)!,
    [selectedProjectId]
  );

  // ---- 项目选项 ----
  const projectOptions = mockDiagnosticProjects.map((p) => ({
    value: p.projectId,
    label: p.projectName,
  }));

  // ---- 项目级聚合指标 ----
  const aggregatedMetrics = currentProject.aggregatedMetrics;

  // ---- 收集所有单元的所有建议 ----
  const allSuggestions = useMemo(() => {
    const result: (DiagnosticSuggestion & { unitName: string; accountName: string })[] = [];
    currentProject.units.forEach((unit) => {
      unit.suggestions.forEach((suggestion) => {
        result.push({
          ...suggestion,
          unitName: unit.adName,
          accountName: unit.accountName,
        });
      });
    });
    // 按优先级排序
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return result.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  }, [currentProject]);

  // ---- 应用建议 ----
  const handleApplySuggestion = (suggestion: DiagnosticSuggestion) => {
    setApplyingSuggestions((prev) => new Set(prev).add(suggestion.id));
    setTimeout(() => {
      setApplyingSuggestions((prev) => {
        const next = new Set(prev);
        next.delete(suggestion.id);
        return next;
      });
      message.success(`已采纳建议：${suggestion.title}`);
    }, 1500);
  };

  // ---- 优先级图标 ----
  const getPriorityIcon = (priority: SuggestionPriority) => {
    switch (priority) {
      case 'high':
        return <WarningOutlined style={{ color: '#ff4d4f' }} />;
      case 'medium':
        return <WarningOutlined style={{ color: '#faad14' }} />;
      case 'low':
        return <BulbOutlined style={{ color: '#1890ff' }} />;
    }
  };

  const projectTypeCfg = PROJECT_TYPE_CONFIG[currentProject.projectType];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 12 : 20 }}>
      {/* ==================== ① 项目选择 + 状态面板 ==================== */}
      <Card
        bordered={false}
        style={{ borderRadius: 12 }}
        bodyStyle={{ padding: isMobile ? 16 : 24 }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: isMobile ? 'flex-start' : 'center',
            gap: isMobile ? 12 : 0,
          }}
        >
          {/* 左侧：项目信息 */}
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: isMobile ? 8 : 16,
                marginBottom: isMobile ? 8 : 12,
                flexWrap: 'wrap',
              }}
            >
              <Select
                value={selectedProjectId}
                onChange={setSelectedProjectId}
                options={projectOptions}
                style={{ width: isMobile ? '100%' : 280 }}
                size="large"
              />
              <Tag color={projectTypeCfg.color} style={{ fontSize: isMobile ? 11 : 13, margin: 0 }}>
                {projectTypeCfg.label}项目
              </Tag>
              <Badge
                count={currentProject.units.length}
                style={{ backgroundColor: '#6366f1' }}
                text={
                  <span style={{ fontSize: isMobile ? 12 : 13, color: '#8c8c8c' }}>
                    {currentProject.units.length} 个单元
                  </span>
                }
              />
            </div>

            {/* 项目级聚合指标 */}
            <Row gutter={[isMobile ? 8 : 16, isMobile ? 8 : 16]}>
              {aggregatedMetrics.map((metric, index) => (
                <Col xs={12} sm={6} key={index}>
                  <div
                    style={{
                      textAlign: 'center',
                      padding: isMobile ? '6px 4px' : '8px 8px',
                      background: '#fafafa',
                      borderRadius: 8,
                    }}
                  >
                    <div style={{ fontSize: isMobile ? 11 : 12, color: '#8c8c8c', marginBottom: 4 }}>
                      {metric.name}
                    </div>
                    <div
                      style={{
                        fontSize: isMobile ? 16 : 20,
                        fontWeight: 700,
                        color:
                          metric.comparison === 'above' ? '#52c41a' : metric.comparison === 'below' ? '#ff4d4f' : '#1a1a1a',
                      }}
                    >
                      {metric.value}
                      {metric.unit}
                    </div>
                    <div
                      style={{
                        fontSize: isMobile ? 10 : 11,
                        color: metric.comparison === 'above' ? '#52c41a' : '#ff4d4f',
                      }}
                    >
                      {metric.comparison === 'above' ? '↑' : metric.comparison === 'below' ? '↓' : '—'}{' '}
                      {metric.comparisonPercent}% vs 行业均值
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </div>

          {/* 右侧：诊断时间 */}
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: isMobile ? 11 : 12, color: '#8c8c8c' }}>诊断时间</div>
            <div style={{ fontSize: isMobile ? 12 : 13, color: '#595959', fontWeight: 500 }}>
              {currentProject.diagnosticTime}
            </div>
          </div>
        </div>
      </Card>

      {/* ==================== ② 跨账户单元卡片 ==================== */}
      <Card
        bordered={false}
        style={{ borderRadius: 12 }}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <TeamOutlined style={{ color: '#6366f1' }} />
            <span style={{ fontSize: isMobile ? 14 : 15 }}>跨账户单元诊断</span>
          </div>
        }
        bodyStyle={{ padding: isMobile ? 12 : 24 }}
      >
        <Row gutter={[isMobile ? 8 : 16, isMobile ? 8 : 16]}>
          {currentProject.units.map((unit) => (
            <Col xs={24} sm={12} lg={8} key={unit.adId}>
              <UnitCard unit={unit} isMobile={isMobile} />
            </Col>
          ))}
        </Row>
      </Card>

      {/* ==================== ③ 优化建议时间轴 ==================== */}
      <Card
        bordered={false}
        style={{ borderRadius: 12 }}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <BulbOutlined style={{ color: '#faad14' }} />
            <span style={{ fontSize: isMobile ? 14 : 15 }}>优化建议</span>
            <Tag color="orange" style={{ fontSize: isMobile ? 10 : 11, margin: 0 }}>
              {allSuggestions.length} 条建议
            </Tag>
          </div>
        }
        bodyStyle={{ padding: isMobile ? 12 : 24 }}
      >
        <Timeline
          items={allSuggestions.map((suggestion) => {
            const priorityCfg = PRIORITY_CONFIG[suggestion.priority];
            const isApplying = applyingSuggestions.has(suggestion.id);

            return {
              key: suggestion.id,
              color:
                suggestion.priority === 'high'
                  ? 'red'
                  : suggestion.priority === 'medium'
                  ? 'orange'
                  : 'blue',
              children: (
                <div
                  style={{
                    padding: isMobile ? '10px 12px' : '14px 16px',
                    background: '#fafafa',
                    borderRadius: 8,
                    border: '1px solid #f0f0f0',
                  }}
                >
                  {/* 标题 + 优先级 + 来源 */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: isMobile ? 6 : 8,
                      flexWrap: 'wrap',
                      gap: 8,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      {getPriorityIcon(suggestion.priority)}
                      <span
                        style={{
                          fontSize: isMobile ? 13 : 14,
                          fontWeight: 600,
                          color: '#1a1a1a',
                        }}
                      >
                        {suggestion.title}
                      </span>
                    </div>
                    <Space size={4} wrap>
                      <Tag color={priorityCfg.color} style={{ fontSize: 10, margin: 0 }}>
                        {priorityCfg.label}
                      </Tag>
                      <Tag style={{ fontSize: 10, margin: 0 }}>
                        <TeamOutlined style={{ marginRight: 2 }} />
                        {suggestion.accountName}
                      </Tag>
                    </Space>
                  </div>

                  {/* 来源单元 */}
                  <div
                    style={{
                      fontSize: isMobile ? 11 : 12,
                      color: '#8c8c8c',
                      marginBottom: isMobile ? 6 : 8,
                    }}
                  >
                    来源单元: <strong style={{ color: '#595959' }}>{suggestion.unitName}</strong>
                  </div>

                  {/* 描述 */}
                  <p
                    style={{
                      fontSize: isMobile ? 12 : 13,
                      color: '#595959',
                      lineHeight: 1.6,
                      margin: `0 0 ${isMobile ? 8 : 12}px`,
                    }}
                  >
                    {suggestion.description}
                  </p>

                  {/* 预估影响 */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: isMobile ? 11 : 12,
                      color: '#52c41a',
                      marginBottom: isMobile ? 8 : 12,
                      padding: '4px 8px',
                      background: '#f6ffed',
                      borderRadius: 4,
                      width: 'fit-content',
                    }}
                  >
                    <RiseOutlined />
                    {suggestion.estimatedImpact}
                  </div>

                  {/* 操作按钮 */}
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <Popconfirm
                      title={`确认执行：${suggestion.actionLabel}？`}
                      description={suggestion.description}
                      onConfirm={() => handleApplySuggestion(suggestion)}
                      okText="确认"
                      cancelText="取消"
                    >
                      <Button
                        type="primary"
                        size={isMobile ? 'small' : 'middle'}
                        icon={ACTION_ICONS[suggestion.action] || <RocketOutlined />}
                        loading={isApplying}
                      >
                        {suggestion.actionLabel}
                      </Button>
                    </Popconfirm>
                    <Button size={isMobile ? 'small' : 'middle'} icon={<ReloadOutlined />}>
                      忽略
                    </Button>
                  </div>
                </div>
              ),
            };
          })}
        />
      </Card>
    </div>
  );
};

export default AdDiagnostic;

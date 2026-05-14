import React, { useRef, useEffect, useMemo } from 'react';
import { Card, Row, Col, DatePicker, Select, Tag, Table, Tooltip, Space } from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import * as echarts from 'echarts';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  DollarOutlined,
  EyeOutlined,
  SwapOutlined,
  TrophyOutlined,
  RiseOutlined,
  FallOutlined,
} from '@ant-design/icons';
import {
  mockKpiMetrics,
  mockTrendData,
  mockAccountSpendData,
  mockTopPlans,
  type KpiMetric,
  type TopPlan,
} from '../data/mockDashboard';
import { useResponsive } from '../hooks/useResponsive';

const { RangePicker } = DatePicker;

// ============================================================
// 常量
// ============================================================

const KPI_COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981'];

const KPI_ICONS: React.ReactNode[] = [
  <DollarOutlined style={{ fontSize: 20 }} />,
  <EyeOutlined style={{ fontSize: 20 }} />,
  <SwapOutlined style={{ fontSize: 20 }} />,
  <TrophyOutlined style={{ fontSize: 20 }} />,
];

// ============================================================
// 工具函数
// ============================================================

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toLocaleString();
}

// ============================================================
// KPI 指标卡片
// ============================================================

const KpiCard: React.FC<{ metric: KpiMetric; index: number; isMobile?: boolean }> = ({ metric, index, isMobile }) => {
  const isUp = metric.changePercent >= 0;

  return (
    <Card
      bordered={false}
      style={{
        borderRadius: 16,
        background: `linear-gradient(135deg, ${KPI_COLORS[index]}15 0%, ${KPI_COLORS[index]}05 100%)`,
        borderLeft: `4px solid ${KPI_COLORS[index]}`,
        transition: 'all 0.3s',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: isMobile ? 12 : 13, color: '#8c8c8c', marginBottom: isMobile ? 4 : 8 }}>
            {metric.title}
          </div>
          <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, color: '#1a1a1a', lineHeight: 1.2 }}>
            {metric.prefix}
            {metric.value.toLocaleString()}
            {metric.unit && (
              <span style={{ fontSize: isMobile ? 12 : 14, fontWeight: 400, color: '#8c8c8c', marginLeft: 4 }}>
                {metric.unit}
              </span>
            )}
          </div>
          <div
            style={{
              marginTop: isMobile ? 6 : 12,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 12,
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 2,
                color: isUp ? '#52c41a' : '#ff4d4f',
                fontWeight: 500,
              }}
            >
              {isUp ? (
                <ArrowUpOutlined style={{ fontSize: 12 }} />
              ) : (
                <ArrowDownOutlined style={{ fontSize: 12 }} />
              )}
              {Math.abs(metric.changePercent).toFixed(2)}%
            </span>
            <span style={{ color: '#bfbfbf' }}>较昨日</span>
            {!isMobile && (
              <span style={{ color: '#bfbfbf', marginLeft: 4 }}>
                ({isUp ? '+' : ''}
                {metric.changeAbsolute.toLocaleString()})
              </span>
            )}
          </div>
        </div>
        <div
          style={{
            width: isMobile ? 36 : 48,
            height: isMobile ? 36 : 48,
            borderRadius: 12,
            background: `${KPI_COLORS[index]}20`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: KPI_COLORS[index],
            flexShrink: 0,
          }}
        >
          {KPI_ICONS[index]}
        </div>
      </div>
    </Card>
  );
};

// ============================================================
// 趋势折线图（双 Y 轴）
// ============================================================

const TrendChart: React.FC<{ isMobile?: boolean }> = ({ isMobile }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    const chart = chartInstance.current;

    const dates = mockTrendData.map((d) => d.date.slice(5));
    const spends = mockTrendData.map((d) => d.spend);
    const conversions = mockTrendData.map((d) => d.conversions);

    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255,255,255,0.96)',
        borderColor: '#f0f0f0',
        borderWidth: 1,
        textStyle: { color: '#333', fontSize: 12 },
        axisPointer: {
          type: 'cross',
          crossStyle: { color: '#999' },
          lineStyle: { color: '#999', type: 'dashed' },
        },
        formatter: (params: unknown) => {
          const p = params as { marker: string; name: string; value: number; seriesName: string }[];
          if (!Array.isArray(p) || p.length === 0) return '';
          let html = `<div style="font-weight:600;margin-bottom:6px">${p[0].name}</div>`;
          p.forEach((item) => {
            html += `<div style="display:flex;align-items:center;gap:6px;margin:3px 0">
              ${item.marker} ${item.seriesName}: 
              <strong>${item.value.toLocaleString()}</strong>
            </div>`;
          });
          return html;
        },
      },
      legend: {
        data: ['消耗', '转化数'],
        top: 0,
        textStyle: { fontSize: 11, color: '#8c8c8c' },
      },
      grid: {
        left: isMobile ? 50 : 60,
        right: isMobile ? 50 : 60,
        top: 36,
        bottom: 24,
      },
      xAxis: {
        type: 'category',
        data: dates,
        axisLine: { lineStyle: { color: '#e8e8e8' } },
        axisLabel: { color: '#8c8c8c', fontSize: 11 },
        axisTick: { show: false },
      },
      yAxis: [
        {
          type: 'value',
          name: '消耗',
          nameTextStyle: { color: '#8c8c8c', fontSize: 10 },
          axisLine: { show: false },
          axisLabel: {
            color: '#8c8c8c',
            fontSize: 10,
            formatter: (v: number) => formatNumber(v),
          },
          splitLine: { lineStyle: { color: '#f5f5f5', type: 'dashed' } },
        },
        {
          type: 'value',
          name: '转化数',
          nameTextStyle: { color: '#8c8c8c', fontSize: 10 },
          axisLine: { show: false },
          axisLabel: {
            color: '#8c8c8c',
            fontSize: 10,
            formatter: (v: number) => formatNumber(v),
          },
          splitLine: { show: false },
        },
      ],
      series: [
        {
          name: '消耗',
          type: 'line',
          yAxisIndex: 0,
          data: spends,
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: { width: 2, color: '#6366f1' },
          itemStyle: { color: '#6366f1', borderWidth: 2 },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(99,102,241,0.25)' },
              { offset: 1, color: 'rgba(99,102,241,0.02)' },
            ]),
          },
        },
        {
          name: '转化数',
          type: 'line',
          yAxisIndex: 1,
          data: conversions,
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: { width: 2, color: '#10b981' },
          itemStyle: { color: '#10b981', borderWidth: 2 },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(16,185,129,0.25)' },
              { offset: 1, color: 'rgba(16,185,129,0.02)' },
            ]),
          },
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
  }, [isMobile]);

  return <div ref={chartRef} style={{ width: '100%', height: isMobile ? 260 : 360 }} />;
};

// ============================================================
// 账户花费占比饼图
// ============================================================

const AccountPieChart: React.FC<{ isMobile?: boolean }> = ({ isMobile }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    const chart = chartInstance.current;

    const activeData = mockAccountSpendData.filter((d) => d.value > 0);

    const colors = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(255,255,255,0.96)',
        borderColor: '#f0f0f0',
        borderWidth: 1,
        textStyle: { color: '#333', fontSize: 12 },
        formatter: (params: unknown) => {
          const p = params as { name: string; value: number; percent: number; marker: string };
          return `<div style="font-weight:600;margin-bottom:4px">${p.marker} ${p.name}</div>
            <div>消耗: <strong>¥${p.value.toLocaleString()}</strong></div>
            <div>占比: <strong>${p.percent.toFixed(1)}%</strong></div>`;
        },
      },
      legend: {
        orient: isMobile ? 'horizontal' : 'vertical',
        bottom: isMobile ? 0 : undefined,
        top: isMobile ? undefined : 'center',
        right: isMobile ? undefined : 10,
        textStyle: { fontSize: 11, color: '#8c8c8c' },
        itemWidth: 10,
        itemHeight: 10,
        itemGap: 8,
      },
      series: [
        {
          type: 'pie',
          radius: isMobile ? ['35%', '65%'] : ['42%', '70%'],
          center: isMobile ? ['50%', '42%'] : ['38%', '52%'],
          avoidLabelOverlap: true,
          itemStyle: {
            borderRadius: 4,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: {
            show: !isMobile,
            formatter: '{b}\n{d}%',
            fontSize: 10,
            color: '#666',
            lineHeight: 14,
          },
          labelLine: {
            lineStyle: { color: '#ccc' },
            length: 8,
            length2: 12,
          },
          emphasis: {
            label: { show: true, fontSize: 12, fontWeight: 'bold' },
            itemStyle: { shadowBlur: 12, shadowOffsetX: 0, shadowColor: 'rgba(0,0,0,0.15)' },
          },
          data: activeData.map((d, i) => ({
            name: d.name,
            value: d.value,
            itemStyle: { color: colors[i % colors.length] },
          })),
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
  }, [isMobile]);

  return <div ref={chartRef} style={{ width: '100%', height: isMobile ? 260 : 360 }} />;
};

// ============================================================
// Top 10 优质计划表格
// ============================================================

const TopPlansTable: React.FC<{ isMobile?: boolean }> = ({ isMobile }) => {
  const columns: ColumnsType<TopPlan> = [
    {
      title: '排名',
      dataIndex: 'rank',
      key: 'rank',
      width: isMobile ? 40 : 60,
      fixed: !isMobile ? 'left' : undefined,
      render: (rank: number) => {
        const rankColors: Record<number, string> = {
          1: '#fbbf24',
          2: '#94a3b8',
          3: '#d97706',
        };
        const bgColor = rankColors[rank] || '#e5e7eb';
        const textColor = rank <= 3 ? '#fff' : '#6b7280';
        return (
          <div
            style={{
              width: isMobile ? 22 : 28,
              height: isMobile ? 22 : 28,
              borderRadius: '50%',
              background: bgColor,
              color: textColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: isMobile ? 11 : 13,
            }}
          >
            {rank}
          </div>
        );
      },
    },
    {
      title: '计划名称',
      dataIndex: 'name',
      key: 'name',
      width: isMobile ? 140 : 220,
      fixed: !isMobile ? 'left' : undefined,
      ellipsis: true,
      render: (name: string, record: TopPlan) => (
        <div>
          <div style={{ fontWeight: 500, marginBottom: 2, fontSize: isMobile ? 12 : 13 }}>{name}</div>
          {!isMobile && (
            <div style={{ fontSize: 11, color: '#bfbfbf', fontFamily: 'monospace' }}>
              {record.planId}
            </div>
          )}
        </div>
      ),
    },
    {
      title: '所属账户',
      dataIndex: 'accountName',
      key: 'accountName',
      width: isMobile ? 100 : 130,
      ellipsis: true,
      render: (name: string) => (
        <Tag color="blue" style={{ fontSize: 10, margin: 0 }}>
          {name}
        </Tag>
      ),
    },
    {
      title: '消耗',
      dataIndex: 'spend',
      key: 'spend',
      width: isMobile ? 80 : 100,
      sorter: (a, b) => a.spend - b.spend,
      render: (val: number) => (
        <span style={{ fontWeight: 500, fontSize: isMobile ? 12 : 13 }}>¥{val.toLocaleString()}</span>
      ),
    },
    {
      title: '转化数',
      dataIndex: 'conversions',
      key: 'conversions',
      width: isMobile ? 70 : 80,
      sorter: (a, b) => a.conversions - b.conversions,
      render: (val: number) => (
        <span style={{ fontWeight: 600, color: '#10b981', fontSize: isMobile ? 12 : 13 }}>{val.toLocaleString()}</span>
      ),
    },
    {
      title: '转化成本',
      dataIndex: 'cpa',
      key: 'cpa',
      width: isMobile ? 70 : 100,
      sorter: (a, b) => a.cpa - b.cpa,
      render: (val: number) => (
        <Tooltip title={`CPA: ¥${val.toFixed(2)}`}>
          <span
            style={{
              fontWeight: 500,
              color: val <= 30 ? '#52c41a' : val <= 50 ? '#faad14' : '#ff4d4f',
              fontSize: isMobile ? 12 : 13,
            }}
          >
            ¥{val.toFixed(2)}
          </span>
        </Tooltip>
      ),
    },
    {
      title: 'CTR',
      dataIndex: 'ctr',
      key: 'ctr',
      width: isMobile ? 60 : 80,
      render: (val: number) => (
        <span style={{ color: val >= 3 ? '#52c41a' : val >= 2 ? '#faad14' : '#ff4d4f', fontSize: isMobile ? 11 : 12 }}>
          {val.toFixed(2)}%
        </span>
      ),
    },
    {
      title: 'ROI',
      dataIndex: 'roi',
      key: 'roi',
      width: isMobile ? 60 : 80,
      sorter: (a, b) => a.roi - b.roi,
      render: (val: number) => (
        <span style={{ fontWeight: 600, color: val >= 3 ? '#52c41a' : '#faad14', fontSize: isMobile ? 12 : 13 }}>
          {val.toFixed(2)}
        </span>
      ),
    },
    {
      title: '趋势',
      dataIndex: 'trend',
      key: 'trend',
      width: isMobile ? 70 : 90,
      render: (trend: 'up' | 'down' | 'stable', record: TopPlan) => {
        const isUp = trend === 'up';
        const isStable = trend === 'stable';
        return (
          <Tooltip title={`${isUp ? '上升' : isStable ? '持平' : '下降'} ${Math.abs(record.trendValue).toFixed(1)}%`}>
            <Tag
              icon={isUp ? <RiseOutlined /> : isStable ? null : <FallOutlined />}
              color={isUp ? 'green' : isStable ? 'default' : 'red'}
              style={{ fontSize: 10, margin: 0 }}
            >
              {isUp ? '+' : ''}
              {record.trendValue.toFixed(1)}%
            </Tag>
          </Tooltip>
        );
      },
    },
  ];

  return (
    <Table<TopPlan>
      columns={columns}
      dataSource={mockTopPlans}
      pagination={isMobile ? { pageSize: 5, size: 'small' } : { pageSize: 10 }}
      size={isMobile ? 'small' : 'middle'}
      scroll={{ x: isMobile ? 600 : 1100 }}
      rowClassName={(_record, index) =>
        index !== mockTopPlans.length - 1 ? 'border-bottom-row' : ''
      }
    />
  );
};

// ============================================================
// 主组件
// ============================================================

const Dashboard: React.FC = () => {
  const { isMobile } = useResponsive();

  const defaultDateRange = useMemo<[ReturnType<typeof dayjs>, ReturnType<typeof dayjs>]>(() => {
    const end = dayjs('2026-05-08');
    const start = dayjs('2026-05-02');
    return [start, end];
  }, []);

  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    return current ? current.isAfter(dayjs('2026-05-08'), 'day') : false;
  };

  const accountOptions = useMemo(
    () =>
      mockAccountSpendData
        .filter((d) => d.value > 0)
        .map((d) => ({
          value: d.advertiserId,
          label: `${d.name} (¥${formatNumber(d.value)})`,
        })),
    []
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 12 : 20 }}>
      {/* ==================== 顶部筛选区 ==================== */}
      <Card bordered={false} style={{ borderRadius: 12, padding: 0 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: isMobile ? 'flex-start' : 'space-between',
            flexWrap: 'wrap',
            gap: isMobile ? 8 : 16,
            padding: isMobile ? '8px 12px' : '12px 24px',
          }}
        >
          <Space size={isMobile ? 8 : 16} wrap>
            <span style={{ fontSize: isMobile ? 13 : 14, fontWeight: 500, color: '#595959' }}>
              数据周期
            </span>
            <RangePicker
              value={defaultDateRange}
              disabledDate={disabledDate}
              size="small"
              style={{ borderRadius: 8 }}
            />
          </Space>

          {!isMobile && (
            <Space size={16}>
              <span style={{ fontSize: 14, fontWeight: 500, color: '#595959' }}>
                账户筛选
              </span>
              <Select
                mode="multiple"
                allowClear
                placeholder="选择广告账户"
                style={{ minWidth: 220 }}
                size="small"
                defaultValue={['100001', '100002', '100004']}
                options={accountOptions}
                maxTagCount="responsive"
              />
            </Space>
          )}
        </div>
      </Card>

      {/* ==================== 核心指标卡片 ==================== */}
      <Row gutter={[isMobile ? 8 : 16, isMobile ? 8 : 16]}>
        {mockKpiMetrics.map((metric, index) => (
          <Col xs={24} sm={12} lg={6} key={metric.title}>
            <KpiCard metric={metric} index={index} isMobile={isMobile} />
          </Col>
        ))}
      </Row>

      {/* ==================== 图表区域 ==================== */}
      <Row gutter={[isMobile ? 8 : 16, isMobile ? 8 : 16]}>
        {/* 左侧：趋势折线图 */}
        <Col xs={24} lg={16}>
          <Card
            bordered={false}
            style={{ borderRadius: 12 }}
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <RiseOutlined style={{ color: '#6366f1' }} />
                <span style={{ fontSize: isMobile ? 14 : 15 }}>消耗与转化趋势</span>
              </div>
            }
            extra={
              <Space size={isMobile ? 4 : 8}>
                <Tag color="purple" style={{ fontSize: 10 }}>消耗</Tag>
                <Tag color="green" style={{ fontSize: 10 }}>转化数</Tag>
              </Space>
            }
          >
            <TrendChart isMobile={isMobile} />
          </Card>
        </Col>

        {/* 右侧：账户花费占比饼图 */}
        <Col xs={24} lg={8}>
          <Card
            bordered={false}
            style={{ borderRadius: 12 }}
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <TrophyOutlined style={{ color: '#8b5cf6' }} />
                <span style={{ fontSize: isMobile ? 14 : 15 }}>账户花费占比</span>
              </div>
            }
          >
            <AccountPieChart isMobile={isMobile} />
          </Card>
        </Col>
      </Row>

      {/* ==================== Top 10 优质计划 ==================== */}
      <Card
        bordered={false}
        style={{ borderRadius: 12 }}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <TrophyOutlined style={{ color: '#f59e0b' }} />
            <span style={{ fontSize: isMobile ? 14 : 15 }}>Top 10 优质广告计划</span>
            <Tag color="orange" style={{ fontSize: 10, margin: 0 }}>
              按转化成本排序
            </Tag>
          </div>
        }
        extra={
          <span style={{ color: '#8c8c8c', fontSize: isMobile ? 11 : 12 }}>
            共 {mockTopPlans.length} 条计划
          </span>
        }
      >
        <TopPlansTable isMobile={isMobile} />
      </Card>
    </div>
  );
};

export default Dashboard;

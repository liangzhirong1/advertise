import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import {
  Card,
  Input,
  Button,
  Space,
  Tag,
  message,
  Popconfirm,
  Badge,
  Switch,
  Avatar,
  Image,
} from 'antd';
import {
  SearchOutlined,
  PushpinOutlined,
  EyeInvisibleOutlined,
  DeleteOutlined,
  MessageOutlined,
  CheckOutlined,
  CloseOutlined,
  FilterOutlined,
  CommentOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import {
  mockAdPlanComments,
  type AdPlanComment,
  type SentimentType,
} from '../data/mockComments';
import { useResponsive } from '../hooks/useResponsive';

// ============================================================
// 常量
// ============================================================

const SENTIMENT_CONFIG: Record<SentimentType, { label: string; color: string }> = {
  positive: { label: '好评', color: 'green' },
  neutral: { label: '中评', color: 'default' },
  negative: { label: '差评', color: 'red' },
};

// ============================================================
// 主组件
// ============================================================

const CommentManagement: React.FC = () => {
  const { isMobile } = useResponsive();

  // ---- 状态 ----
  const [plans, setPlans] = useState<AdPlanComment[]>(mockAdPlanComments);
  const [selectedPlanId, setSelectedPlanId] = useState<string>(mockAdPlanComments[0].planId);
  const [searchText, setSearchText] = useState('');
  const [sensitiveFilter, setSensitiveFilter] = useState(false);
  const [selectedComments, setSelectedComments] = useState<Set<string>>(new Set());
  const [replyingCommentId, setReplyingCommentId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // ---- 拖拽分割线 ----
  const [leftWidth, setLeftWidth] = useState(30);
  const isDragging = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // ---- 鼠标拖拽逻辑 ----
  const handleMouseDown = useCallback(() => {
    isDragging.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
      const clampedWidth = Math.max(20, Math.min(50, newWidth));
      setLeftWidth(clampedWidth);
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // ---- 过滤后的计划列表 ----
  const filteredPlans = useMemo(() => {
    if (!searchText) return plans;
    const lower = searchText.toLowerCase();
    return plans.filter(
      (p) =>
        p.planName.toLowerCase().includes(lower) ||
        p.accountName.toLowerCase().includes(lower)
    );
  }, [plans, searchText]);

  // ---- 当前选中的计划 ----
  const currentPlan = useMemo(
    () => plans.find((p) => p.planId === selectedPlanId),
    [plans, selectedPlanId]
  );

  // ---- 当前计划的评论（按时间倒序） ----
  const currentComments = useMemo(() => {
    if (!currentPlan) return [];
    return [...currentPlan.comments].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [currentPlan]);

  // ---- 切换计划 ----
  const handleSelectPlan = (planId: string) => {
    setSelectedPlanId(planId);
    setSelectedComments(new Set());
    setReplyingCommentId(null);
    setReplyText('');

    // 标记为已读
    setPlans((prev) =>
      prev.map((p) => (p.planId === planId ? { ...p, unreadComments: 0 } : p))
    );
  };

  // ---- 评论操作 ----
  const handlePinComment = (commentId: string) => {
    setPlans((prev) =>
      prev.map((p) =>
        p.planId === selectedPlanId
          ? {
              ...p,
              comments: p.comments.map((c) =>
                c.id === commentId ? { ...c, isPinned: !c.isPinned } : c
              ),
            }
          : p
      )
    );
    message.success('已更新置顶状态');
  };

  const handleHideComment = (commentId: string) => {
    setPlans((prev) =>
      prev.map((p) =>
        p.planId === selectedPlanId
          ? {
              ...p,
              comments: p.comments.map((c) =>
                c.id === commentId ? { ...c, isHidden: !c.isHidden } : c
              ),
            }
          : p
      )
    );
    message.success('已更新隐藏状态');
  };

  const handleDeleteComment = (commentId: string) => {
    setPlans((prev) =>
      prev.map((p) =>
        p.planId === selectedPlanId
          ? {
              ...p,
              comments: p.comments.map((c) =>
                c.id === commentId ? { ...c, isDeleted: true } : c
              ),
            }
          : p
      )
    );
    message.success('评论已删除');
  };

  const handleReply = (_commentId: string) => {
    if (!replyText.trim()) {
      message.warning('请输入回复内容');
      return;
    }
    message.success(`已回复评论: ${replyText}`);
    setReplyingCommentId(null);
    setReplyText('');
  };

  // ---- 批量操作 ----
  const handleBatchHide = () => {
    if (selectedComments.size === 0) {
      message.warning('请先选择评论');
      return;
    }
    setPlans((prev) =>
      prev.map((p) =>
        p.planId === selectedPlanId
          ? {
              ...p,
              comments: p.comments.map((c) =>
                selectedComments.has(c.id) ? { ...c, isHidden: true } : c
              ),
            }
          : p
      )
    );
    message.success(`已隐藏 ${selectedComments.size} 条评论`);
    setSelectedComments(new Set());
  };

  const handleBatchDelete = () => {
    if (selectedComments.size === 0) {
      message.warning('请先选择评论');
      return;
    }
    setPlans((prev) =>
      prev.map((p) =>
        p.planId === selectedPlanId
          ? {
              ...p,
              comments: p.comments.map((c) =>
                selectedComments.has(c.id) ? { ...c, isDeleted: true } : c
              ),
            }
          : p
      )
    );
    message.success(`已删除 ${selectedComments.size} 条评论`);
    setSelectedComments(new Set());
  };

  // ---- 敏感词过滤 ----
  const displayComments = useMemo(() => {
    if (!sensitiveFilter) return currentComments;
    return currentComments.filter((c) => c.sentiment !== 'negative');
  }, [currentComments, sensitiveFilter]);

  // ---- 统计 ----
  const totalComments = plans.reduce((sum, p) => sum + p.totalComments, 0);
  const totalUnread = plans.reduce((sum, p) => sum + p.unreadComments, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 12 : 20 }}>
      {/* ==================== 顶部统计 ==================== */}
      <Card bordered={false} style={{ borderRadius: 12 }}>
        <div style={{ display: 'flex', gap: isMobile ? 12 : 24, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: isMobile ? 18 : 24, fontWeight: 700, color: '#1a1a1a' }}>
              {totalComments}
            </div>
            <div style={{ fontSize: 12, color: '#8c8c8c' }}>总评论数</div>
          </div>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: isMobile ? 18 : 24, fontWeight: 700, color: '#ff4d4f' }}>
              {totalUnread}
            </div>
            <div style={{ fontSize: 12, color: '#8c8c8c' }}>未读评论</div>
          </div>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: isMobile ? 18 : 24, fontWeight: 700, color: '#1890ff' }}>
              {plans.length}
            </div>
            <div style={{ fontSize: 12, color: '#8c8c8c' }}>监控计划</div>
          </div>
        </div>
      </Card>

      {/* ==================== 主体区域（左右分栏） ==================== */}
      <div
        ref={containerRef}
        style={{
          display: 'flex',
          flex: 1,
          minHeight: isMobile ? 500 : 600,
          gap: 0,
          borderRadius: 12,
          overflow: 'hidden',
        }}
      >
        {/* ---- 左侧：计划列表 ---- */}
        <div
          style={{
            width: `${leftWidth}%`,
            minWidth: 200,
            background: '#fff',
            borderRight: '1px solid #f0f0f0',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* 搜索框 */}
          <div style={{ padding: '12px 12px 8px' }}>
            <Input
              placeholder="搜索计划名称 / 账户"
              prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
              allowClear
              size="small"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          {/* 计划列表 */}
          <div style={{ flex: 1, overflow: 'auto', padding: '0 8px 8px' }}>
            {filteredPlans.map((plan) => {
              const isSelected = plan.planId === selectedPlanId;
              return (
                <div
                  key={plan.planId}
                  onClick={() => handleSelectPlan(plan.planId)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 8,
                    marginBottom: 8,
                    cursor: 'pointer',
                    background: isSelected ? '#e6f7ff' : '#fafafa',
                    border: isSelected ? '2px solid #1890ff' : '2px solid transparent',
                    transition: 'all 0.2s',
                  }}
                >
                  {/* 头部 */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 13, color: '#1a1a1a', marginBottom: 2 }}>
                        {plan.planName}
                      </div>
                      <div style={{ fontSize: 11, color: '#8c8c8c' }}>
                        <TeamOutlined style={{ marginRight: 4 }} />
                        {plan.accountName}
                      </div>
                    </div>
                    <Badge
                      count={plan.unreadComments}
                      style={{
                        backgroundColor: plan.unreadComments > 0 ? '#ff4d4f' : '#d9d9d9',
                        marginLeft: 8,
                      }}
                    />
                  </div>

                  {/* 封面缩略图 */}
                  <div
                    style={{
                      width: '100%',
                      height: 60,
                      background: plan.coverThumbnail,
                      borderRadius: 6,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 6,
                    }}
                  >
                    <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
                      封面预览
                    </span>
                  </div>

                  {/* 底部统计 */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#8c8c8c' }}>
                    <span>
                      <CommentOutlined style={{ marginRight: 4 }} />
                      {plan.totalComments} 条评论
                    </span>
                    {plan.unreadComments > 0 && (
                      <span style={{ color: '#ff4d4f' }}>
                        {plan.unreadComments} 条未读
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ---- 拖拽分割线 ---- */}
        <div
          onMouseDown={handleMouseDown}
          style={{
            width: 6,
            cursor: 'col-resize',
            background: '#f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 2,
              height: 40,
              background: '#d9d9d9',
              borderRadius: 1,
            }}
          />
        </div>

        {/* ---- 右侧：评论流 ---- */}
        <div style={{ flex: 1, background: '#f5f5f5', display: 'flex', flexDirection: 'column' }}>
          {/* 顶部工具栏 */}
          <div
            style={{
              padding: '12px 16px',
              background: '#fff',
              borderBottom: '1px solid #f0f0f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 8,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontWeight: 600, fontSize: 14 }}>
                {currentPlan?.planName || '请选择计划'}
              </span>
              <Tag color="blue">
                {displayComments.length} 条评论
              </Tag>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <FilterOutlined style={{ color: '#8c8c8c', fontSize: 12 }} />
                <span style={{ fontSize: 12, color: '#595959' }}>敏感词过滤</span>
                <Switch
                  size="small"
                  checked={sensitiveFilter}
                  onChange={setSensitiveFilter}
                />
              </div>
              {selectedComments.size > 0 && (
                <Space>
                  <Popconfirm
                    title={`确认隐藏 ${selectedComments.size} 条评论？`}
                    onConfirm={handleBatchHide}
                  >
                    <Button size="small" icon={<EyeInvisibleOutlined />}>
                      批量隐藏
                    </Button>
                  </Popconfirm>
                  <Popconfirm
                    title={`确认删除 ${selectedComments.size} 条评论？`}
                    onConfirm={handleBatchDelete}
                  >
                    <Button size="small" danger icon={<DeleteOutlined />}>
                      批量删除
                    </Button>
                  </Popconfirm>
                </Space>
              )}
            </div>
          </div>

          {/* 评论流 */}
          <div style={{ flex: 1, overflow: 'auto', padding: '12px 16px' }}>
            {displayComments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40, color: '#bfbfbf' }}>
                暂无评论
              </div>
            ) : (
              displayComments.map((comment) => {
                const isNegative = comment.sentiment === 'negative';
                const isHidden = comment.isHidden;
                const isDeleted = comment.isDeleted;
                const isSelected = selectedComments.has(comment.id);
                const isReplying = replyingCommentId === comment.id;

                return (
                  <div
                    key={comment.id}
                    style={{
                      padding: '12px 16px',
                      background: isNegative && sensitiveFilter ? '#fff2f0' : '#fff',
                      border: isSelected
                        ? '2px solid #1890ff'
                        : isNegative && sensitiveFilter
                        ? '2px solid #ffccc7'
                        : '2px solid #f0f0f0',
                      borderRadius: 8,
                      marginBottom: 12,
                      opacity: isHidden || isDeleted ? 0.5 : 1,
                      transition: 'all 0.2s',
                    }}
                  >
                    {/* 头部 */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      {/* 复选框 */}
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          setSelectedComments((prev) => {
                            const next = new Set(prev);
                            if (e.target.checked) {
                              next.add(comment.id);
                            } else {
                              next.delete(comment.id);
                            }
                            return next;
                          });
                        }}
                        style={{ cursor: 'pointer' }}
                      />

                      {/* 头像 */}
                      <Avatar
                        style={{
                          background: comment.userAvatar,
                          flexShrink: 0,
                        }}
                        size="small"
                      >
                        {comment.userName.charAt(0)}
                      </Avatar>

                      {/* 用户名 + 时间 */}
                      <div style={{ flex: 1 }}>
                        <span style={{ fontWeight: 600, fontSize: 13, color: '#1a1a1a' }}>
                          {comment.userName}
                        </span>
                        <span style={{ fontSize: 11, color: '#8c8c8c', marginLeft: 8 }}>
                          {comment.createdAt}
                        </span>
                      </div>

                      {/* 标签 */}
                      {comment.isPinned && (
                        <Tag icon={<PushpinOutlined />} color="red" style={{ fontSize: 10, margin: 0 }}>
                          置顶
                        </Tag>
                      )}
                      <Tag
                        color={SENTIMENT_CONFIG[comment.sentiment].color}
                        style={{ fontSize: 10, margin: 0 }}
                      >
                        {SENTIMENT_CONFIG[comment.sentiment].label}
                      </Tag>
                      {isHidden && (
                        <Tag color="default" style={{ fontSize: 10, margin: 0 }}>
                          已隐藏
                        </Tag>
                      )}
                      {isDeleted && (
                        <Tag color="default" style={{ fontSize: 10, margin: 0 }}>
                          已删除
                        </Tag>
                      )}
                    </div>

                    {/* 评论内容 */}
                    <div
                      style={{
                        fontSize: 14,
                        color: isNegative && sensitiveFilter ? '#cf1322' : '#333',
                        lineHeight: 1.6,
                        marginBottom: 8,
                        paddingLeft: 32,
                      }}
                    >
                      {comment.content}
                    </div>

                    {/* 关联素材预览 */}
                    {comment.materialPreview && (
                      <div style={{ paddingLeft: 32, marginBottom: 8 }}>
                        <Image
                          width={120}
                          src={comment.materialPreview}
                          style={{ borderRadius: 6 }}
                          fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
                        />
                      </div>
                    )}

                    {/* 操作按钮 */}
                    <div style={{ display: 'flex', gap: 8, paddingLeft: 32, flexWrap: 'wrap' }}>
                      <Button
                        type="text"
                        size="small"
                        icon={<MessageOutlined />}
                        onClick={() => {
                          setReplyingCommentId(isReplying ? null : comment.id);
                          setReplyText('');
                        }}
                      >
                        回复
                      </Button>
                      <Button
                        type="text"
                        size="small"
                        icon={<PushpinOutlined />}
                        onClick={() => handlePinComment(comment.id)}
                      >
                        {comment.isPinned ? '取消置顶' : '置顶'}
                      </Button>
                      <Popconfirm
                        title={`确认${comment.isHidden ? '显示' : '隐藏'}此评论？`}
                        onConfirm={() => handleHideComment(comment.id)}
                      >
                        <Button
                          type="text"
                          size="small"
                          icon={<EyeInvisibleOutlined />}
                        >
                          {comment.isHidden ? '显示' : '隐藏'}
                        </Button>
                      </Popconfirm>
                      <Popconfirm
                        title="确认删除此评论？此操作不可恢复。"
                        onConfirm={() => handleDeleteComment(comment.id)}
                      >
                        <Button type="text" size="small" danger icon={<DeleteOutlined />}>
                          删除
                        </Button>
                      </Popconfirm>
                    </div>

                    {/* 回复输入框 */}
                    {isReplying && (
                      <div
                        style={{
                          marginTop: 8,
                          paddingLeft: 32,
                          display: 'flex',
                          gap: 8,
                          alignItems: 'center',
                        }}
                      >
                        <Input
                          placeholder={`回复 @${comment.userName}...`}
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          onPressEnter={() => handleReply(comment.id)}
                          size="small"
                          style={{ flex: 1 }}
                        />
                        <Button
                          type="primary"
                          size="small"
                          icon={<CheckOutlined />}
                          onClick={() => handleReply(comment.id)}
                        >
                          发送
                        </Button>
                        <Button
                          size="small"
                          icon={<CloseOutlined />}
                          onClick={() => {
                            setReplyingCommentId(null);
                            setReplyText('');
                          }}
                        >
                          取消
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentManagement;

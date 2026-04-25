'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Plus, Trash2, Edit3, Check, X, Eye, ThumbsUp, ThumbsDown, AlertCircle, RefreshCw } from 'lucide-react'

interface Question {
  id: number
  title: string
  category: string
  enabled: boolean
  order: number
}

interface Feedback {
  id: number
  question: string
  type: string
  errorType?: string
  correctInfo?: string
  contactInfo?: string
  createdAt: string
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [activeTab, setActiveTab] = useState<'questions' | 'feedbacks'>('questions')

  // 问题管理
  const [questions, setQuestions] = useState<Question[]>([])
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState({ title: '', category: '' })
  const [newQuestion, setNewQuestion] = useState({ title: '', category: '' })

  // 反馈数据
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])

  // 简单密码验证（生产环境请用更安全的方式）
  const handleLogin = () => {
    if (password === 'admin123') {
      setIsAuthenticated(true)
    } else {
      alert('密码错误，默认密码：admin123')
    }
  }

  // 加载数据
  const loadData = async () => {
    try {
      const [questionsRes, feedbacksRes] = await Promise.all([
        fetch('/api/data?type=all'),
        fetch('/api/data?type=feedbacks'),
      ])
      const allData = await questionsRes.json()
      const feedbacksData = await feedbacksRes.json()
      setQuestions(allData.questions || [])
      setFeedbacks(feedbacksData || [])
    } catch (e) {
      console.error('加载数据失败:', e)
    }
  }

  // 初始加载
  useEffect(() => {
    if (isAuthenticated) {
      loadData()
    }
  }, [isAuthenticated])

  // 添加问题
  const handleAddQuestion = async () => {
    if (!newQuestion.title.trim()) return
    await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'question',
        title: newQuestion.title,
        category: newQuestion.category || '默认分类',
      }),
    })
    setNewQuestion({ title: '', category: '' })
    loadData()
  }

  // 更新问题
  const handleUpdateQuestion = async (id: number) => {
    await fetch('/api/data', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'update-question',
        id,
        updates: editForm,
      }),
    })
    setEditingId(null)
    loadData()
  }

  // 删除问题
  const handleDeleteQuestion = async (id: number) => {
    if (!confirm('确定删除这个问题吗？')) return
    await fetch('/api/data', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete-question', id }),
    })
    loadData()
  }

  // 切换启用状态
  const toggleEnabled = async (id: number, enabled: boolean) => {
    await fetch('/api/data', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'update-question',
        id,
        updates: { enabled: !enabled },
      }),
    })
    loadData()
  }

  // 未登录 - 显示登录界面
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">🔐 后台管理</CardTitle>
            <p className="text-muted-foreground text-sm mt-2">请输入管理员密码</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="password"
              placeholder="输入密码..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              className="h-12"
            />
            <Button onClick={handleLogin} className="w-full h-12" size="lg">
              登录
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              默认密码：admin123（可在代码中修改）
            </p>
          </CardContent>
        </Card>
      </main>
    )
  }

  // 已登录 - 显示管理界面
  return (
    <main className="min-h-screen bg-secondary/30 p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        {/* 顶部栏 */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-foreground">📊 数据管理中心</h1>
          <Button variant="outline" onClick={() => window.location.href = '/'}>
            返回首页
          </Button>
        </div>

        {/* Tab 切换 */}
        <div className="flex gap-2 mb-6">
          <button
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'questions'
                ? 'bg-primary text-primary-foreground'
                : 'bg-card hover:bg-secondary'
            }`}
            onClick={() => setActiveTab('questions')}
          >
            📋 推荐问题 ({questions.length})
          </button>
          <button
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'feedbacks'
                ? 'bg-primary text-primary-foreground'
                : 'bg-card hover:bg-secondary'
            }`}
            onClick={() => setActiveTab('feedbacks')}
          >
            💬 用户反馈 ({feedbacks.length})
          </button>
          <Button variant="outline" onClick={loadData} className="ml-auto">
            <RefreshCw className="w-4 h-4 mr-2" />
            刷新
          </Button>
        </div>

        {/* 推荐问题管理 */}
        {activeTab === 'questions' && (
          <>
            {/* 添加新问题 */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">+ 新增推荐问题</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3 flex-col sm:flex-row">
                  <Input
                    placeholder="问题标题..."
                    value={newQuestion.title}
                    onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
                    className="flex-1"
                  />
                  <Input
                    placeholder="分类标签..."
                    value={newQuestion.category}
                    onChange={(e) => setNewQuestion({ ...newQuestion, category: e.target.value })}
                    className="sm:w-40"
                  />
                  <Button onClick={handleAddQuestion} disabled={!newQuestion.title.trim()}>
                    <Plus className="w-4 h-4 mr-1" />
                    添加
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 问题列表 */}
            <div className="space-y-3">
              {questions.map((q) => (
                <Card key={q.id} className={`${!q.enabled ? 'opacity-50' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {/* 序号 */}
                      <span className="text-lg font-bold text-muted-foreground w-8">
                        #{q.order || q.id}
                      </span>

                      {/* 内容 */}
                      <div className="flex-1 min-w-0">
                        {editingId === q.id ? (
                          <div className="flex gap-2 flex-col sm:flex-row">
                            <Input
                              defaultValue={q.title}
                              onChange={(e) =>
                                setEditForm({ ...editForm, title: e.target.value })
                              }
                              className="flex-1"
                            />
                            <Input
                              defaultValue={q.category}
                              onChange={(e) =>
                                setEditForm({ ...editForm, category: e.target.value })
                              }
                              className="sm:w-32"
                            />
                            <Button size="sm" onClick={() => handleUpdateQuestion(q.id)}>
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setEditingId(null)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium">{q.title}</span>
                            <Badge variant="secondary">{q.category}</Badge>
                          </div>
                        )}
                      </div>

                      {/* 操作按钮 */}
                      {editingId !== q.id && (
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditingId(q.id)
                              setEditForm({ title: q.title, category: q.category })
                            }}
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant={q.enabled ? 'default' : 'outline'}
                            onClick={() => toggleEnabled(q.id, q.enabled)}
                            className={`px-3 ${q.enabled ? '' : 'opacity-50'}`}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            {q.enabled ? '显示' : '隐藏'}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="hover:bg-red-50 hover:text-red-600"
                            onClick={() => handleDeleteQuestion(q.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {questions.length === 0 && (
                <Card>
                  <CardContent className="p-12 text-center text-muted-foreground">
                    暂无推荐问题，点击上方添加
                  </CardContent>
                </Card>
              )}
            </div>
          </>
        )}

        {/* 反馈数据 */}
        {activeTab === 'feedbacks' && (
          <div className="space-y-3">
            {feedbacks.map((fb) => (
              <Card key={fb.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {/* 类型图标 */}
                    <div className={`p-2 rounded-lg ${
                      fb.type === 'useful'
                        ? 'bg-green-50'
                        : fb.type === 'useless'
                        ? 'bg-red-50'
                        : 'bg-blue-50'
                    }`}>
                      {fb.type === 'useful' ? (
                        <ThumbsUp className="w-5 h-5 text-green-600" />
                      ) : fb.type === 'useless' ? (
                        <ThumbsDown className="w-5 h-5 text-red-600" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-blue-600" />
                      )}
                    </div>

                    {/* 详情 */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{fb.question}</p>
                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                        <Badge variant={
                          fb.type === 'useful' ? 'default' :
                          fb.type === 'useless' ? 'destructive' : 'secondary'
                        }>
                          {fb.type === 'useful' ? '有用' :
                           fb.type === 'useless' ? '无用' : '反馈表单'}
                        </Badge>
                        {fb.errorType && <span>原因：{fb.errorType}</span>}
                        <span className="text-xs text-muted-foreground">
                          {new Date(fb.createdAt).toLocaleString('zh-CN')}
                        </span>
                      </div>
                      {(fb.correctInfo || fb.contactInfo) && (
                        <div className="mt-2 text-sm text-muted-foreground">
                          {fb.correctInfo && <p>正确信息：{fb.correctInfo}</p>}
                          {fb.contactInfo && <p>联系方式：{fb.contactInfo}</p>}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {feedbacks.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center text-muted-foreground">
                  暂无用户反馈数据
                </CardContent>
              </Card>
            )}

            {/* 统计信息 */}
            {feedbacks.length > 0 && (
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-4">
                  <div className="flex gap-6 justify-center text-sm">
                    <span>📊 总反馈：<strong>{feedbacks.length}</strong></span>
                    <span>👍 有用：<strong>{feedbacks.filter(f => f.type === 'useful').length}</strong></span>
                    <span>👎 无用：<strong>{feedbacks.filter(f => f.type === 'useless').length}</strong></span>
                    <span>📝 表单反馈：<strong>{feedbacks.filter(f => f.type !== 'useful' && f.type !== 'useless').length}</strong></span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </main>
  )
}

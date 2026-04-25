'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { ChevronLeft, ExternalLink, Calendar, Building2, CheckCircle, FileText, AlertCircle, Clock } from 'lucide-react'

interface PolicyItem {
  id: string
  name: string
  department: string
  date: string
  status: 'effective' | 'expired' | 'pending'
  content?: string
  score?: number
  link?: string
}

interface PolicyDetailProps {
  policy: PolicyItem
  onBack: () => void
}

const statusConfig = {
  effective: {
    label: '现行有效',
    color: 'bg-green-50 text-green-700 border-green-200',
    icon: CheckCircle,
  },
  expired: {
    label: '已废止',
    color: 'bg-red-50 text-red-700 border-red-200',
    icon: AlertCircle,
  },
  pending: {
    label: '待生效',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: Clock,
  },
}

export function PolicyDetail({ policy, onBack }: PolicyDetailProps) {
  const status = statusConfig[policy.status]
  const StatusIcon = status.icon

  return (
    <main className="flex flex-col min-h-screen bg-background">
      {/* 顶部栏 */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-14 gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm font-medium">返回结果页</span>
            </button>
          </div>
        </div>
      </header>

      {/* 内容区域 */}
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* 政策标题卡片 */}
        <Card className="p-6 sm:p-8 mb-6 shadow-sm">
          <div className="space-y-6">
            {/* 标题和状态 */}
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-3 leading-relaxed">
                {policy.name}
              </h1>
              <Badge className={`${status.color} px-3 py-1`}>
                <StatusIcon className="w-4 h-4 mr-1" />
                {status.label}
              </Badge>
            </div>

            {/* 元信息网格 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-start gap-3 p-4 bg-secondary/30 rounded-lg">
                <Building2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">发布单位</p>
                  <p className="font-semibold text-foreground">{policy.department}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-secondary/30 rounded-lg">
                <Calendar className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">发布日期</p>
                  <p className="font-semibold text-foreground">{policy.date}</p>
                </div>
              </div>

              {policy.score !== undefined && (
                <div className="flex items-start gap-3 p-4 bg-secondary/30 rounded-lg">
                  <FileText className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">匹配度</p>
                    <p className="font-semibold text-foreground">{(policy.score * 100).toFixed(0)}%</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* 摘要内容 */}
        {policy.content && (
          <Card className="p-6 sm:p-8 mb-6 shadow-sm">
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              文件摘要
            </h2>
            <div className="bg-secondary/10 rounded-lg p-5 border border-secondary/20">
              <p className="text-base leading-relaxed text-foreground whitespace-pre-wrap">
                {policy.content}
              </p>
            </div>
          </Card>
        )}

        {/* 操作按钮区 */}
        <Card className="p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4">
            {policy.link ? (
              <Button
                onClick={() => window.open(policy.link, '_blank')}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                size="lg"
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                查看原文链接
              </Button>
            ) : (
              <Button
                variant="outline"
                size="lg"
                className="flex-1 cursor-not-allowed opacity-50"
                disabled
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                原文暂不可用
              </Button>
            )}

            <Button
              onClick={onBack}
              variant="outline"
              size="lg"
              className="flex-1"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              返回搜索结果
            </Button>
          </div>
        </Card>
      </div>
    </main>
  )
}

'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { ExternalLink, CheckCircle2, FileText, Building2, Calendar, TrendingUp } from 'lucide-react'

interface PolicyItem {
  id: string
  name: string
  department: string
  date: string
  status: 'effective' | 'expired' | 'pending'
  link?: string
  content?: string
  score?: number
}

interface PoliciesSectionProps {
  policies: PolicyItem[]
  onPolicyClick?: (policy: PolicyItem) => void
}

const statusConfig = {
  effective: {
    label: '现行有效',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
    icon: CheckCircle2,
    colorClass: 'text-emerald-600',
  },
  expired: {
    label: '已过期',
    className: 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100',
    icon: FileText,
    colorClass: 'text-gray-500',
  },
  pending: {
    label: '待生效',
    className: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
    icon: FileText,
    colorClass: 'text-blue-600',
  },
}

export function PoliciesSection({ policies, onPolicyClick }: PoliciesSectionProps) {
  if (!policies || policies.length === 0) {
    return (
      <div className="py-10 border-t border-stroke-border">
        <h2 className="text-xl font-bold text-stripe-navy mb-6 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          政策来源
        </h2>
        <div className="text-center py-12 bg-stripe-bg-subtle/50 rounded-xl border border-dashed border-stroke-border">
          <FileText className="w-12 h-12 mx-auto mb-4 text-stroke-blue-gray/40" />
          <p className="text-stroke-blue-gray">暂无相关政策来源信息</p>
        </div>
      </div>
    )
  }

  return (
    <div className="py-10 border-t border-stroke-border">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold text-stripe-navy flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-accent">
            <FileText className="w-5 h-5 text-stroke-purple" />
          </div>
          政策来源
        </h2>
        <span className="text-sm font-medium text-stroke-blue-gray bg-accent px-3 py-1 rounded-full">
          共 {policies.length} 条
        </span>
      </div>

      {/* Policy Cards */}
      <div className="grid gap-4">
        {policies.map((policy) => {
          const status = statusConfig[policy.status]
          const StatusIcon = status.icon

          return (
            <Card
              key={policy.id}
              onClick={() => onPolicyClick?.(policy)}
              className="group cursor-pointer p-6 bg-white border border-stroke-border stripe-card-hover hover:border-stroke-purple/30"
            >
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1 min-w-0">
                  {/* Policy Title */}
                  <h3 className="text-lg font-semibold text-stripe-navy group-hover:text-stroke-purple transition-colors duration-200 mb-4 leading-snug pr-12">
                    {policy.name}
                  </h3>

                  {/* Meta Information Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                    {/* Department */}
                    <div className="flex items-center gap-2.5 text-sm">
                      <Building2 className="w-4 h-4 text-stroke-blue-gray flex-shrink-0" />
                      <span className="font-medium text-stripe-navy truncate">{policy.department}</span>
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-2.5 text-sm">
                      <Calendar className="w-4 h-4 text-stroke-blue-gray flex-shrink-0" />
                      <span className="text-stroke-blue-gray">{policy.date}</span>
                    </div>

                    {/* Score (if available) */}
                    {policy.score && (
                      <div className="flex items-center gap-2.5 text-sm">
                        <TrendingUp className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span className="font-medium text-emerald-600">
                          匹配度 {(policy.score * 100).toFixed(0)}%
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content Preview (if available) */}
                  {policy.content && (
                    <p className="text-sm text-stroke-blue-gray leading-relaxed line-clamp-2 bg-stripe-bg-subtle/50 p-3 rounded-md border border-stroke-border/30">
                      {policy.content}
                    </p>
                  )}

                  {/* Status Badge & Actions */}
                  <div className="flex items-center gap-3 mt-5 pt-4 border-t border-stroke-border/60">
                    <StatusIcon className={`w-4 h-4 ${status.colorClass}`} />
                    <Badge variant="outline" className={status.className}>
                      {status.label}
                    </Badge>
                    {policy.link && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-auto text-stroke-purple hover:text-stroke-purple-dark hover:bg-accent"
                        onClick={(e) => {
                          e.stopPropagation()
                          window.open(policy.link, '_blank')
                        }}
                      >
                        查看原文
                        <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

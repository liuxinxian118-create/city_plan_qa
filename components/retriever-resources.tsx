'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText, ExternalLink } from 'lucide-react'

interface RetrieverResource {
  document_id?: string
  document_name?: string
  segment_id?: string
  position?: number
  content?: string
  metadata?: Record<string, any>
  hit_count?: number
}

interface RetrieverResourcesProps {
  resources?: RetrieverResource[]
}

export function RetrieverResources({ resources = [] }: RetrieverResourcesProps) {
  if (!resources || resources.length === 0) {
    return null
  }

  return (
    <div className="py-8">
      <h2 className="text-lg font-semibold text-foreground mb-4">
        知识库来源
      </h2>
      <div className="space-y-3">
        {resources.map((resource, index) => (
          <Card key={`${resource.document_id}-${index}`} className="border border-border hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                {/* 文件图标 */}
                <FileText className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                
                {/* 文档信息 */}
                <div className="flex-1 min-w-0">
                  {/* 文档名称 */}
                  {resource.document_name && (
                    <p className="font-semibold text-foreground text-sm mb-2">
                      {resource.document_name}
                    </p>
                  )}
                  
                  {/* 文档内容 */}
                  {resource.content && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {resource.content}
                    </p>
                  )}
                  
                  {/* 元数据信息 */}
                  {resource.metadata && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {Object.entries(resource.metadata).map(([key, value]) => (
                        <Badge key={key} variant="secondary" className="text-xs">
                          {key}: {String(value).substring(0, 30)}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* 位置和计数 */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {resource.position !== undefined && (
                      <span>位置: {resource.position}</span>
                    )}
                    {resource.hit_count !== undefined && (
                      <span>•</span>
                    )}
                    {resource.hit_count !== undefined && (
                      <span>匹配度: {resource.hit_count}</span>
                    )}
                  </div>
                </div>

                {/* 外链图标 */}
                {resource.document_id && (
                  <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

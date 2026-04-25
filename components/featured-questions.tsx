'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { ChevronRight, ArrowRight } from 'lucide-react'

interface Question {
  id: number
  title: string
  category: string
}

interface FeaturedQuestionsProps {
  onQuestionSelect: (question: string) => void
}

export function FeaturedQuestions({ onQuestionSelect }: FeaturedQuestionsProps) {
  const [questions, setQuestions] = useState<Question[]>([])

  // 从 API 加载推荐问题
  useEffect(() => {
    fetch('/api/data?type=questions')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setQuestions(data)
        }
        if (!Array.isArray(data) || data.length === 0) {
          setQuestions([
            { id: 1, title: '三区三线划定标准是什么？', category: '土地规划' },
            { id: 2, title: '基本农田内能否修建农村道路？', category: '农业政策' },
            { id: 3, title: '城镇开发边界调整由谁审批？', category: '行政审批' },
            { id: 4, title: '2024版用地用海分类有哪些变化？', category: '用地分类' },
          ])
        }
      })
      .catch(() => {
        setQuestions([
          { id: 1, title: '三区三线划定标准是什么？', category: '土地规划' },
          { id: 2, title: '基本农田内能否修建农村道路？', category: '农业政策' },
          { id: 3, title: '城镇开发边界调整由谁审批？', category: '行政审批' },
          { id: 4, title: '2024版用地用海分类有哪些变化？', category: '用地分类' },
        ])
      })
  }, [])

  const handleQuestionClick = (question: Question) => {
    onQuestionSelect(question.title)
  }

  return (
    <section className="w-full bg-white py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 flex items-end justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-stripe-navy mb-3 tracking-tight">
              热门问题推荐
            </h2>
            <p className="text-stroke-blue-gray text-lg">
              查看用户最常问的问题及解答
            </p>
          </div>
          <a
            href="#"
            className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-stroke-purple hover:text-stroke-purple-dark transition-colors group"
          >
            查看全部
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>

        {/* Questions Grid */}
        <div className="space-y-4">
          {questions.map((question, index) => (
            <Card
              key={question.id}
              onClick={() => handleQuestionClick(question)}
              className="group cursor-pointer border border-stripe-border bg-white stripe-card-hover hover:border-stroke-purple/30"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1 min-w-0">
                    {/* Question Number & Category */}
                    <div className="flex items-center gap-3 mb-4">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-accent text-stroke-purple font-semibold text-sm font-mono shadow-sm">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wide bg-stripe-bg-subtle text-stroke-blue-gray border border-stroke-border/50">
                        {question.category}
                      </span>
                    </div>

                    {/* Question Title */}
                    <h3 className="text-lg font-semibold text-stripe-navy group-hover:text-stroke-purple transition-colors duration-200 leading-snug">
                      {question.title}
                    </h3>
                  </div>

                  {/* Arrow Icon */}
                  <div className="flex-shrink-0 mt-1.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    <ChevronRight className="w-5 h-5 text-stroke-purple" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

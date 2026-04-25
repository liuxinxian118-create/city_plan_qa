'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Sparkles } from 'lucide-react'

interface SearchSectionProps {
  onSearch: (question: string) => void
  isLoading?: boolean
}

export function SearchSection({ onSearch, isLoading = false }: SearchSectionProps) {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const handleSearch = () => {
    if (!query.trim()) return
    onSearch(query)
    setQuery('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSearch()
    }
  }

  return (
    <section className="w-full relative overflow-hidden stripe-gradient">
      {/* 装饰性背景元素（可选） */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-stripe-purple/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-stripe-purple-light/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative z-10">
        {/* Title */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-stripe-border shadow-stripe-sm mb-6">
            <Sparkles className="w-4 h-4 text-stripe-purple" />
            <span className="text-sm font-medium text-stripe-blue-gray">
              AI 驱动的智能政策问答
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-bold text-stripe-navy mb-6 leading-tight tracking-tight">
            城市发展政策解答
          </h1>

          <p className="text-lg sm:text-xl text-stroke-blue-gray max-w-2xl mx-auto leading-relaxed">
            专业、快速、准确的政策咨询服务
          </p>
        </div>

        {/* Search Bar */}
        <div
          className={`flex gap-3 p-2 bg-white rounded-xl transition-all duration-300 ${
            isFocused
              ? 'shadow-stripe-purple ring-4 ring-stripe-purple/10'
              : 'shadow-stripe-lg'
          }`}
        >
          <div className="flex-1 relative">
            <Search
              className={`absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${
                isFocused ? 'text-stripe-purple' : 'text-stroke-blue-gray'
              }`}
            />
            <Input
              type="text"
              placeholder="例如：基本农田可以转为建设用地吗？"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              disabled={isLoading}
              className={`pl-12 h-14 text-base border-transparent bg-transparent focus:border-transparent focus:ring-0 focus:outline-none placeholder:text-stroke-blue-gray/60 disabled:opacity-50 transition-all duration-200`}
            />
          </div>
          <Button
            onClick={handleSearch}
            disabled={isLoading || !query.trim()}
            className="stripe-btn-gradient h-12 px-8 text-primary-foreground font-semibold text-base self-center disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                加载中
              </div>
            ) : (
              '提问'
            )}
          </Button>
        </div>

        {/* Helper Text & Quick Links */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-stroke-blue-gray">
          <p>输入您关心的政策问题</p>
          <div className="hidden sm:block w-px h-4 bg-stroke-border" />
          <div className="flex gap-3 flex-wrap justify-center">
            {['土地管理', '规划审批', '征收补偿'].map((tag) => (
              <button
                key={tag}
                onClick={() => onSearch(tag)}
                className="hover:text-stripe-purple hover:bg-accent px-3 py-1 rounded-md transition-colors duration-200"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

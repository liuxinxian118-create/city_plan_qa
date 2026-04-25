'use client'

import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

interface AnswerTopBarProps {
  onBackHome: () => void
}

export function AnswerTopBar({ onBackHome }: AnswerTopBarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Back Button */}
          <div className="flex items-center gap-6">
            <Button
              variant="ghost"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity p-0 h-auto"
              onClick={onBackHome}
            >
              <ChevronLeft className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground">返回首页</span>
            </Button>
          </div>

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 relative">
              <Image
                src="/logo.png"
                alt="智慧城市政策问答助手"
                width={40}
                height={40}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <span className="text-lg font-bold text-foreground">智慧城市</span>
          </div>

          {/* Empty space for alignment */}
          <div className="w-24"></div>
        </div>
      </div>
    </header>
  )
}

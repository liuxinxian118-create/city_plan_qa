'use client'

import Image from 'next/image'

export function Footer() {
  return (
    <footer className="w-full bg-background border-t border-border py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
          {/* Left: Brand Info */}
          <div className="flex flex-col items-center sm:items-start gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 relative">
                <Image
                  src="/logo.png"
                  alt="智慧城市政策问答助手"
                  width={32}
                  height={32}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-lg font-bold text-foreground">智慧城市政策问答</span>
            </div>
            <p className="text-sm text-muted-foreground">
              为城市发展提供专业政策指导
            </p>
          </div>

          {/* Right: Links */}
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
            <button className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              查看全部政策
            </button>
            <div className="hidden sm:block w-px h-6 bg-border"></div>
            <button className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              意见反馈
            </button>
          </div>
        </div>

        {/* Bottom: Copyright */}
        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">
            © 2024 智慧城市政策问答助手。版权所有。
          </p>
        </div>
      </div>
    </footer>
  )
}

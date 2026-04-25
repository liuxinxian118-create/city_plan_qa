'use client'

import { Button } from '@/components/ui/button'
import Image from 'next/image'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-stripe-border bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 relative rounded-lg overflow-hidden shadow-stripe-sm transition-transform duration-200 group-hover:scale-105">
              <Image
                src="/logo.png"
                alt="智慧城市政策问答助手"
                width={40}
                height={40}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-semibold text-stripe-navy tracking-tight">
                智慧城市
              </span>
              <span className="text-[10px] text-stripe-blue-gray -mt-1 tracking-wide uppercase font-medium">
                Policy Q&A
              </span>
            </div>
          </div>

          {/* Right Menu */}
          <nav className="flex items-center gap-6">
            <a
              href="#"
              className="text-sm font-medium text-stripe-blue-gray hover:text-stripe-purple transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-stripe-purple after:transition-all hover:after:w-full"
            >
              帮助
            </a>
            <Button
              variant="outline"
              size="sm"
              className="border-stripe-border text-stripe-navy bg-white hover:bg-stripe-bg-subtle hover:border-stripe-purple/30 transition-all duration-200 shadow-stripe-sm font-medium"
            >
              登录
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}

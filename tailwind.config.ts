import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Stripe 品牌色
        stripe: {
          purple: '#533afd',
          'purple-dark': '#4434d4',
          'purple-light': '#7a6cff',
          navy: '#061b31',
          'blue-gray': '#64748d',
          border: '#e5edf5',
          'bg-subtle': '#f6f8fc',
        },
        // 语义化颜色（保持与 globals.css 一致）
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: 'var(--card)',
        'card-foreground': 'var(--card-foreground)',
        popover: 'var(--popover)',
        'popover-foreground': 'var(--popover-foreground)',
        primary: 'var(--primary)',
        'primary-foreground': 'var(--primary-foreground)',
        secondary: 'var(--secondary)',
        'secondary-foreground': 'var(--secondary-foreground)',
        muted: 'var(--muted)',
        'muted-foreground': 'var(--muted-foreground)',
        accent: 'var(--accent)',
        'accent-foreground': 'var(--accent-foreground)',
        destructive: 'var(--destructive)',
        'destructive-foreground': 'var(--destructive-foreground)',
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        chart: {
          1: 'var(--chart-1)',
          2: 'var(--chart-2)',
          3: 'var(--chart-3)',
          4: 'var(--chart-4)',
          5: 'var(--chart-5)',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      boxShadow: {
        // Stripe 蓝色调多层阴影
        'stripe-sm': '0 0.3px 0.9px rgba(50, 50, 93, 0.08), 0 1.6px 3.6px rgba(50, 50, 93, 0.07)',
        'stripe-md': '0 0.3px 0.9px rgba(50, 50, 93, 0.08), 0 1.6px 3.6px rgba(50, 50, 93, 0.07), 0 3.2px 7.2px rgba(50, 50, 93, 0.07), 0 6.4px 14.4px rgba(50, 50, 93, 0.06)',
        'stripe-lg': '0 0.3px 0.9px rgba(50, 50, 93, 0.08), 0 1.6px 3.6px rgba(50, 50, 93, 0.07), 0 3.2px 7.2px rgba(50, 50, 93, 0.07), 0 6.4px 14.4px rgba(50, 50, 93, 0.06), 0 12.8px 28.8px rgba(50, 50, 93, 0.05)',
        'stripe-xl': '0 0.3px 0.9px rgba(50, 50, 93, 0.08), 0 1.6px 3.6px rgba(50, 50, 93, 0.07), 0 3.2px 7.2px rgba(50, 50, 93, 0.07), 0 6.4px 14.4px rgba(50, 50, 93, 0.06), 0 12.8px 28.8px rgba(50, 50, 93, 0.05), 0 25.6px 57.6px rgba(50, 50, 93, 0.04)',
        // Stripe 紫色按钮阴影
        'stripe-purple': '0 4px 14px 0 rgba(83, 58, 253, 0.25), 0 2px 6px 0 rgba(50, 50, 93, 0.15)',
        'stripe-purple-hover': '0 6px 20px 0 rgba(83, 58, 253, 0.35), 0 4px 10px 0 rgba(50, 50, 93, 0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-subtle': 'pulseSubtle 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        },
      },
    },
  },
  plugins: [],
}

export default config

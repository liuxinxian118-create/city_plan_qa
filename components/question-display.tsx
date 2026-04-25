'use client'

interface QuestionDisplayProps {
  question: string
  timestamp?: string
}

export function QuestionDisplay({ question, timestamp }: QuestionDisplayProps) {
  return (
    <div className="py-8 border-b border-border">
      <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
        {question}
      </h1>
      {timestamp && (
        <p className="text-sm text-muted-foreground">
          提问时间：{timestamp}
        </p>
      )}
    </div>
  )
}

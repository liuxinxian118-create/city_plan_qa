'use client'

interface AnswerContentProps {
  content: string
}

export function AnswerContent({ content }: AnswerContentProps) {
  return (
    <div className="py-8 border-b border-border">
      <h2 className="text-xl font-semibold text-foreground mb-4">
        答案
      </h2>
      <div className="bg-secondary/10 rounded-lg p-6 border border-secondary/20">
        <p className="text-base leading-relaxed text-foreground whitespace-pre-wrap">
          {content}
        </p>
      </div>
    </div>
  )
}

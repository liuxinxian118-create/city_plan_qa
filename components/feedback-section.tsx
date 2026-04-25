'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ThumbsUp, ThumbsDown } from 'lucide-react'

interface FeedbackSectionProps {
  initialUpvotes?: number
  initialDownvotes?: number
  onDislike?: () => void
  onVote?: (type: 'useful' | 'useless') => void
}

export function FeedbackSection({
  initialUpvotes = 0,
  initialDownvotes = 0,
  onDislike,
  onVote,
}: FeedbackSectionProps) {
  const [upvotes, setUpvotes] = useState(initialUpvotes)
  const [downvotes, setDownvotes] = useState(initialDownvotes)
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null)

  const handleUpvote = () => {
    if (userVote === 'up') {
      setUpvotes(upvotes - 1)
      setUserVote(null)
    } else {
      if (userVote === 'down') {
        setDownvotes(downvotes - 1)
      }
      setUpvotes(upvotes + 1)
      setUserVote('up')
      onVote?.('useful')
    }
  }

  const handleDownvote = () => {
    if (userVote === 'down') {
      setDownvotes(downvotes - 1)
      setUserVote(null)
    } else {
      if (userVote === 'up') {
        setUpvotes(upvotes - 1)
      }
      setDownvotes(downvotes + 1)
      setUserVote('down')
      onVote?.('useless')
      // 触发 onDislike 回调
      if (onDislike) {
        onDislike()
      }
    }
  }

  return (
    <div className="py-8">
      <h2 className="text-lg font-semibold text-foreground mb-6">
        这个回答对您有帮助吗？
      </h2>
      <div className="flex items-center gap-4">
        <Button
          variant={userVote === 'up' ? 'default' : 'outline'}
          size="lg"
          className="flex items-center gap-2"
          onClick={handleUpvote}
        >
          <ThumbsUp className="w-5 h-5" />
          <span>有用</span>
          <span className="text-sm ml-2 opacity-70">({upvotes})</span>
        </Button>
        <Button
          variant={userVote === 'down' ? 'default' : 'outline'}
          size="lg"
          className="flex items-center gap-2"
          onClick={handleDownvote}
        >
          <ThumbsDown className="w-5 h-5" />
          <span>无用</span>
          <span className="text-sm ml-2 opacity-70">({downvotes})</span>
        </Button>
      </div>
    </div>
  )
}

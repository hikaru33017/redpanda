'use client'

import { useState } from 'react'
import type { Comment } from './types'

const STORAGE_KEY = 'nishiyama-comments'

function loadComments(targetId: string): Comment[] {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return []
  try {
    const all = JSON.parse(stored) as Comment[]
    return all.filter((c) => c.targetId === targetId)
  } catch {
    return []
  }
}

export function useComments(targetId: string) {
  const [comments, setComments] = useState<Comment[]>(() => loadComments(targetId))

  function addComment(comment: Omit<Comment, 'id' | 'createdAt' | 'targetId'>) {
    const newComment: Comment = {
      ...comment,
      id: `c-${Date.now()}`,
      targetId,
      createdAt: new Date().toISOString(),
    }
    const stored = localStorage.getItem(STORAGE_KEY)
    let all: Comment[] = []
    if (stored) {
      try {
        all = JSON.parse(stored) as Comment[]
      } catch {
        all = []
      }
    }
    const next = [...all, newComment]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    setComments(next.filter((c) => c.targetId === targetId))
  }

  return { comments, addComment }
}

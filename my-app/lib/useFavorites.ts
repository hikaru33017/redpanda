'use client'

import { useState } from 'react'

const STORAGE_KEY = 'nishiyama-favorites'

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    if (typeof window === 'undefined') return new Set()
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return new Set()
    try {
      return new Set(JSON.parse(stored) as string[])
    } catch {
      return new Set()
    }
  })

  function toggleFavorite(id: string) {
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]))
      return next
    })
  }

  return { favorites, toggleFavorite }
}

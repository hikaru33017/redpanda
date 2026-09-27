'use client'

import { useRef, useState, useEffect, type ReactNode } from 'react'

interface BottomSheetProps {
  children: ReactNode
  peekHeight?: number
  maxHeight?: number
}

export function BottomSheet({ children, peekHeight = 120, maxHeight = 600 }: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [startY, setStartY] = useState(0)
  const [currentY, setCurrentY] = useState(0)

  const height = isExpanded ? maxHeight : peekHeight

  useEffect(() => {
    if (!isDragging) return

    function handleMove(e: MouseEvent | TouchEvent) {
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
      setCurrentY(clientY)
    }

    function handleEnd() {
      if (!isDragging) return
      const deltaY = currentY - startY

      // If dragged down more than 50px, collapse
      // If dragged up more than 50px, expand
      if (deltaY > 50) {
        setIsExpanded(false)
      } else if (deltaY < -50) {
        setIsExpanded(true)
      }

      setIsDragging(false)
      setStartY(0)
      setCurrentY(0)
    }

    window.addEventListener('mousemove', handleMove)
    window.addEventListener('touchmove', handleMove, { passive: true })
    window.addEventListener('mouseup', handleEnd)
    window.addEventListener('touchend', handleEnd)

    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('touchmove', handleMove)
      window.removeEventListener('mouseup', handleEnd)
      window.removeEventListener('touchend', handleEnd)
    }
  }, [isDragging, currentY, startY])

  function handleStart(e: React.MouseEvent | React.TouchEvent) {
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    setIsDragging(true)
    setStartY(clientY)
    setCurrentY(clientY)
  }

  function handleToggle() {
    setIsExpanded((prev) => !prev)
  }

  const dragOffset = isDragging ? currentY - startY : 0
  const clampedOffset = Math.max(0, dragOffset) // Only allow dragging down when collapsed, up when expanded

  return (
    <div
      ref={sheetRef}
      className="fixed bottom-0 left-0 right-0 z-30 rounded-t-3xl overflow-hidden transition-all"
      style={{
        height: isDragging ? height + clampedOffset : height,
        background: 'rgba(255,251,245,0.96)',
        backdropFilter: 'blur(16px)',
        borderTop: '1.5px solid rgba(8,176,163,0.2)',
        boxShadow: '0 -4px 24px rgba(8,176,163,0.15)',
        transitionProperty: isDragging ? 'none' : 'height',
        transitionDuration: '0.3s',
        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* Handle */}
      <div
        className="flex items-center justify-center py-3 cursor-pointer select-none"
        onMouseDown={handleStart}
        onTouchStart={handleStart}
        onClick={handleToggle}
      >
        <div
          className="w-12 h-1.5 rounded-full"
          style={{ background: 'rgba(8,176,163,0.3)' }}
        />
      </div>

      {/* Content */}
      <div className="overflow-y-auto px-4 pb-4" style={{ height: 'calc(100% - 40px)' }}>
        {children}
      </div>
    </div>
  )
}

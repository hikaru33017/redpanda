'use client'

import Image from 'next/image'
import type { MascotVariant } from '@/lib/spawnSchedule'

export type MascotMood = 'welcome' | 'guide' | 'happy' | 'worried' | 'excited'
export type { MascotVariant }

interface MascotProps {
  mood?: MascotMood
  size?: number
  className?: string
  animate?: boolean
  variant?: MascotVariant
}

const MOOD_IMAGE: Record<MascotMood, string> = {
  welcome: '/mascot/mood_welcome.png',
  guide:   '/mascot/mood_guide.png',
  happy:   '/mascot/mood_happy.png',
  worried: '/mascot/mood_worried.png',
  excited: '/mascot/mood_excited.png',
}

const MOOD_LABELS: Record<MascotMood, string> = {
  welcome: 'ようこそ表情のレッサーパンダ',
  guide:   '案内中のレッサーパンダ',
  happy:   '喜んでいるレッサーパンダ',
  worried: '困り顔のレッサーパンダ',
  excited: 'ワクワクしているレッサーパンダ',
}

export function Mascot({ mood = 'guide', size = 80, className = '', animate = true, variant = 'normal' }: MascotProps) {
  const src = variant === 'rare' ? '/mascot/mood_rare.png' : MOOD_IMAGE[mood]
  const label = variant === 'rare' ? 'レア個体のレッサーパンダ' : MOOD_LABELS[mood]

  return (
    <div
      className={`inline-flex items-center justify-center ${animate ? 'animate-float' : ''} ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label={label}
    >
      <Image
        src={src}
        alt={label}
        width={size}
        height={size}
        style={{ objectFit: 'contain', filter: 'drop-shadow(0 4px 8px rgba(61,43,31,0.18))' }}
      />
    </div>
  )
}

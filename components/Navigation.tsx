'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/', label: 'ホーム', emoji: '🏡' },
  { href: '/plan', label: '観光プラン', emoji: '🗺️' },
  { href: '/pandas', label: 'レッサーパンダ', emoji: '🐼' },
  { href: '/pandas/family-tree', label: '家系図', emoji: '🌳' },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 glass shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-[var(--color-primary-dark)]">
          <span>🐾</span>
          <span className="hidden sm:inline">西山公園ガイド</span>
          <span className="sm:hidden">西山公園</span>
        </Link>

        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                pathname === item.href
                  ? 'bg-[var(--color-primary)] text-white shadow-sm'
                  : 'text-[var(--color-foreground)] hover:bg-[var(--color-sand-light)]'
              )}
            >
              <span className="text-base leading-none">{item.emoji}</span>
              <span className="hidden md:inline">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}

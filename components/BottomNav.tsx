'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/', label: 'ホーム', icon: '/icons/panda-face-laugh.png' },
  { href: '/plan', icon: '/icons/panda-face-smile.png', label: '観光プラン' },
  { href: '/stamps', label: 'スタンプ', icon: '/icons/panda-face-wink.png' },
  { href: '/collection', label: 'コレクション', icon: '/icons/panda-face-surprised.png' },
  { href: '/pandas', label: 'レッサーパンダ', icon: '/icons/panda-face-peek-paws.png' },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t"
      style={{
        background: 'rgba(255,251,245,0.95)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderColor: 'rgba(8,176,163,0.18)',
        boxShadow: '0 -2px 16px rgba(8,176,163,0.08)',
      }}
    >
      <div className="flex items-center justify-around px-1 py-2 max-w-lg mx-auto">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl transition-all duration-200',
                active ? 'scale-110' : 'opacity-55 hover:opacity-80'
              )}
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200"
                style={{
                  background: active ? 'rgba(8,176,163,0.15)' : 'transparent',
                }}
              >
                <Image
                  src={item.icon}
                  alt={item.label}
                  width={28}
                  height={28}
                  style={{
                    filter: active ? 'none' : 'grayscale(60%) opacity(0.7)',
                    transition: 'filter 0.2s ease',
                  }}
                />
              </div>
              <span
                className="text-[10px] font-extrabold"
                style={{ color: active ? 'var(--color-teal-dark)' : 'var(--color-bark)' }}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

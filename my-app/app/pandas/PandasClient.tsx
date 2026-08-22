'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { LesserPanda } from '@/lib/types'
import { useFavorites } from '@/lib/useFavorites'
import { cn } from '@/lib/utils'

interface Props {
  pandas: LesserPanda[]
}

export function PandasClient({ pandas }: Props) {
  const { favorites, toggleFavorite } = useFavorites()

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {pandas.map((panda) => (
        <div
          key={panda.id}
          className="card-soft flex flex-col overflow-hidden rounded-3xl"
        >
          <div className="relative h-44 overflow-hidden" style={{ background: 'linear-gradient(135deg, #E0F7F5, #EAF5E2)' }}>
            {panda.photoUrl ? (
              <Image
                src={panda.photoUrl}
                alt={panda.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Image src="/icons/lesser-panda.png" alt={panda.name} width={80} height={80} />
              </div>
            )}
            <div className="absolute top-2 right-2">
              <span
                className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                style={{ background: 'rgba(255,255,255,0.88)', color: 'var(--color-teal-dark)', backdropFilter: 'blur(4px)' }}
              >
                {panda.gender === 'male' ? '♂ オス' : '♀ メス'}
              </span>
            </div>
          </div>

          <div className="p-3.5 flex flex-col flex-1">
            <div className="flex items-start justify-between mb-1.5">
              <div className="min-w-0 flex-1">
                <h2 className="text-base font-extrabold text-[var(--color-foreground)] truncate">{panda.name}</h2>
                <p className="text-[10px] text-[var(--color-teal-dark)] font-bold truncate">{panda.nameEn}</p>
              </div>
              <button
                onClick={() => toggleFavorite(panda.id)}
                className={cn(
                  'flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200',
                  favorites.has(panda.id)
                    ? 'bg-[#FEF0E8] scale-110'
                    : 'opacity-35 hover:opacity-70'
                )}
                aria-label={favorites.has(panda.id) ? 'お気に入りを解除' : 'お気に入りに追加'}
              >
                <Image src="/icons/apple.svg" alt="お気に入り" width={22} height={22} />
              </button>
            </div>

            <p className="text-xs text-[var(--color-bark)] leading-relaxed mb-3 flex-1 line-clamp-2">
              {panda.personality}
            </p>

            <Link
              href={`/pandas/${panda.id}`}
              className="block text-center py-2 rounded-2xl text-white text-xs font-extrabold btn-bounce"
              style={{ background: 'linear-gradient(135deg, var(--color-teal), var(--color-teal-dark))' }}
            >
              プロフィールを見る
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}

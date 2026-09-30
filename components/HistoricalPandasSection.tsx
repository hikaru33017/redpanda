'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { HistoricalPanda } from '@/lib/types'
import { getHistoricalPandaPhoto } from '@/lib/historicalPandaPhotoMapping'
import { getHistoricalPandasWithId } from '@/lib/historicalPandaData'
import { LESSER_PANDAS } from '@/lib/pandaData'
import { ANCESTOR_PANDAS } from '@/lib/ancestorPandaData'

interface HistoricalPandasSectionProps {
  pandas: HistoricalPanda[]
}

export function HistoricalPandasSection({ pandas }: HistoricalPandasSectionProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const pandasWithId = getHistoricalPandasWithId()

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '不明'
    const date = new Date(dateStr)
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
  }

  const formatYearRange = (birthDate: string, deathDate: string | null) => {
    const birthYear = new Date(birthDate).getFullYear()
    if (deathDate) {
      const deathYear = new Date(deathDate).getFullYear()
      return `${birthYear}〜${deathYear}`
    }
    return `${birthYear}〜`
  }

  const getPandaId = (pandaName: string) => {
    // 優先順位: LESSER_PANDAS > ANCESTOR_PANDAS > 歴代パンダ
    const lesserPanda = LESSER_PANDAS.find(p => p.name === pandaName)
    if (lesserPanda) return lesserPanda.id

    const ancestorPanda = ANCESTOR_PANDAS.find(p => p.name === pandaName)
    if (ancestorPanda) return ancestorPanda.id

    return pandasWithId.find(p => p.name === pandaName)?.id
  }

  return (
    <div className="mt-8">
      <div className="text-center mb-6">
        <h2 className="text-xl font-extrabold text-[var(--color-foreground)] mb-2">
          歴代飼育したレッサーパンダ
        </h2>
        <p className="text-xs text-[var(--color-teal-dark)] font-bold">
          西山動物園で過去に飼育された{pandas.length}頭のパンダたち
        </p>
      </div>

      <div className="space-y-2">
        {pandas.map((panda, index) => (
          <div
            key={index}
            className="rounded-xl overflow-hidden transition-all"
            style={{
              background: expandedIndex === index
                ? 'rgba(255,255,255,0.95)'
                : 'rgba(255,255,255,0.7)',
              border: '2px solid rgba(8,176,163,0.15)',
            }}
          >
            {/* 一覧表示（常に表示） */}
            <div className="flex items-stretch">
              <button
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                className="flex-1 px-4 py-3 flex items-center gap-3 text-left hover:bg-[rgba(8,176,163,0.05)] transition-colors"
              >
              {getHistoricalPandaPhoto(panda.name) && (
                <div className="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden bg-[var(--color-teal-pale)]">
                  <Image
                    src={getHistoricalPandaPhoto(panda.name)!}
                    alt={panda.name}
                    width={96}
                    height={96}
                    quality={95}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <p className="font-extrabold text-[var(--color-foreground)] text-sm">
                  {panda.name}
                </p>
                <p className="text-[10px] text-[var(--color-teal-dark)] mt-0.5">
                  {panda.gender === 'オス' ? '♂' : '♀'} {formatYearRange(panda.birthDate, panda.deathDate)}
                  {panda.statusLabel && (
                    <span className="ml-2 px-1.5 py-0.5 rounded text-[9px] bg-[rgba(8,176,163,0.1)]">
                      {panda.statusLabel}
                    </span>
                  )}
                </p>
              </div>
                <div
                  className="flex-shrink-0 transition-transform"
                  style={{ transform: expandedIndex === index ? 'rotate(180deg)' : 'rotate(0deg)' }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--color-teal)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </button>

              {getPandaId(panda.name) && (
                <Link
                  href={`/pandas/${getPandaId(panda.name)}`}
                  className="px-4 py-3 flex items-center border-l border-[rgba(8,176,163,0.1)] hover:bg-[rgba(8,176,163,0.05)] transition-colors"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--color-teal)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Link>
              )}
            </div>

            {/* 詳細表示（展開時のみ） */}
            {expandedIndex === index && (
              <div className="px-4 pb-4 space-y-3 border-t border-[rgba(8,176,163,0.1)] pt-3">
                {getHistoricalPandaPhoto(panda.name) && (
                  <div className="flex justify-center mb-3">
                    <div className="w-32 h-32 rounded-2xl overflow-hidden bg-[var(--color-teal-pale)]">
                      <Image
                        src={getHistoricalPandaPhoto(panda.name)!}
                        alt={panda.name}
                        width={256}
                        height={256}
                        quality={95}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-[10px] text-[var(--color-teal-dark)] font-bold mb-0.5">性別</p>
                    <p className="text-[var(--color-foreground)] font-bold">{panda.gender || '不明'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[var(--color-teal-dark)] font-bold mb-0.5">誕生日</p>
                    <p className="text-[var(--color-foreground)] font-bold">{formatDate(panda.birthDate)}</p>
                  </div>
                </div>

                {panda.deathDate && (
                  <div>
                    <p className="text-[10px] text-[var(--color-teal-dark)] font-bold mb-0.5">永眠日</p>
                    <p className="text-[var(--color-foreground)] font-bold text-xs">
                      {formatDate(panda.deathDate)} （{panda.ageAtDeathOrLastRecord}歳）
                    </p>
                  </div>
                )}

                {panda.transferDate && panda.transferDestination && (
                  <div>
                    <p className="text-[10px] text-[var(--color-teal-dark)] font-bold mb-0.5">移動先</p>
                    <p className="text-[var(--color-foreground)] font-bold text-xs">
                      {panda.transferDestination} （{formatDate(panda.transferDate)}）
                    </p>
                  </div>
                )}

                {panda.arrivalDate && (
                  <div>
                    <p className="text-[10px] text-[var(--color-teal-dark)] font-bold mb-0.5">来園日</p>
                    <p className="text-[var(--color-foreground)] font-bold text-xs">{formatDate(panda.arrivalDate)}</p>
                  </div>
                )}

                {panda.arrivalOrigin && (
                  <div>
                    <p className="text-[10px] text-[var(--color-teal-dark)] font-bold mb-0.5">来園元</p>
                    <p className="text-[var(--color-foreground)] font-bold text-xs">{panda.arrivalOrigin}</p>
                  </div>
                )}

                {(panda.father || panda.mother) && (
                  <div>
                    <p className="text-[10px] text-[var(--color-teal-dark)] font-bold mb-0.5">両親</p>
                    <p className="text-[var(--color-foreground)] font-bold text-xs">
                      {panda.father && `父: ${panda.father}`}
                      {panda.father && panda.mother && ' / '}
                      {panda.mother && `母: ${panda.mother}`}
                    </p>
                  </div>
                )}

                {panda.partners && panda.partners.length > 0 && (
                  <div>
                    <p className="text-[10px] text-[var(--color-teal-dark)] font-bold mb-0.5">パートナー</p>
                    <p className="text-[var(--color-foreground)] font-bold text-xs">
                      {panda.partners.join('、')}
                    </p>
                  </div>
                )}

                {panda.personality && (
                  <div>
                    <p className="text-[10px] text-[var(--color-teal-dark)] font-bold mb-0.5">性格</p>
                    <p className="text-[var(--color-foreground)] font-bold text-xs">{panda.personality}</p>
                  </div>
                )}

                {panda.notes && (
                  <div>
                    <p className="text-[10px] text-[var(--color-teal-dark)] font-bold mb-0.5">備考</p>
                    <p className="text-[var(--color-foreground)] font-bold text-xs">{panda.notes}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

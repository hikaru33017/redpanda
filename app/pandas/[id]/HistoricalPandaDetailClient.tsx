'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { HistoricalPandaWithId } from '@/lib/types'
import { getHistoricalPandaPhoto } from '@/lib/historicalPandaPhotoMapping'
import { OpenDataCredit } from '@/components/OpenDataCredit'

interface HistoricalPandaDetailClientProps {
  panda: HistoricalPandaWithId
}

export function HistoricalPandaDetailClient({ panda }: HistoricalPandaDetailClientProps) {
  const photoUrl = getHistoricalPandaPhoto(panda.name)

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '不明'
    const date = new Date(dateStr)
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #E0F7F5 0%, #FFFBF5 25%, #FEF6ED 100%)' }}>
      <div className="page-header">
        <div className="max-w-lg mx-auto">
          <Link href="/pandas" className="text-sm text-[var(--color-teal)] font-bold">
            ← 一覧に戻る
          </Link>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6">
        {/* パンダカード */}
        <div
          className="rounded-3xl overflow-hidden mb-6"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85))',
            border: '3px solid rgba(8,176,163,0.2)',
          }}
        >
          {/* 写真エリア */}
          {photoUrl && (
            <div className="flex justify-center pt-6 pb-4">
              <div className="w-48 h-48 rounded-2xl overflow-hidden bg-[var(--color-teal-pale)]">
                <Image
                  src={photoUrl}
                  alt={panda.name}
                  width={384}
                  height={384}
                  quality={95}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* 基本情報 */}
          <div className="px-6 pb-6">
            <div className="text-center mb-4">
              <h1 className="text-2xl font-extrabold text-[var(--color-foreground)] mb-1">
                {panda.name}
              </h1>
              <div className="flex items-center justify-center gap-2 text-sm">
                <span className="px-3 py-1 rounded-full bg-[rgba(8,176,163,0.1)] text-[var(--color-teal-dark)] font-bold">
                  {panda.statusLabel}
                </span>
              </div>
            </div>

            {/* 詳細情報 */}
            <div className="space-y-3 mt-6">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-[var(--color-teal-dark)] font-bold mb-1">性別</p>
                  <p className="text-sm text-[var(--color-foreground)] font-bold">
                    {panda.gender === 'オス' ? '♂ オス' : '♀ メス'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[var(--color-teal-dark)] font-bold mb-1">誕生日</p>
                  <p className="text-sm text-[var(--color-foreground)] font-bold">
                    {formatDate(panda.birthDate)}
                  </p>
                </div>
              </div>

              {panda.arrivalDate && (
                <div>
                  <p className="text-xs text-[var(--color-teal-dark)] font-bold mb-1">来園日</p>
                  <p className="text-sm text-[var(--color-foreground)] font-bold">
                    {formatDate(panda.arrivalDate)}
                  </p>
                </div>
              )}

              {panda.arrivalOrigin && (
                <div>
                  <p className="text-xs text-[var(--color-teal-dark)] font-bold mb-1">来園元</p>
                  <p className="text-sm text-[var(--color-foreground)] font-bold">
                    {panda.arrivalOrigin}
                  </p>
                </div>
              )}

              {panda.deathDate && (
                <div>
                  <p className="text-xs text-[var(--color-teal-dark)] font-bold mb-1">永眠日</p>
                  <p className="text-sm text-[var(--color-foreground)] font-bold">
                    {formatDate(panda.deathDate)} （{panda.ageAtDeathOrLastRecord}歳）
                  </p>
                </div>
              )}

              {panda.transferDate && panda.transferDestination && (
                <div>
                  <p className="text-xs text-[var(--color-teal-dark)] font-bold mb-1">移動先</p>
                  <p className="text-sm text-[var(--color-foreground)] font-bold">
                    {panda.transferDestination} （{formatDate(panda.transferDate)}）
                  </p>
                </div>
              )}

              {(panda.father || panda.mother) && (
                <div>
                  <p className="text-xs text-[var(--color-teal-dark)] font-bold mb-1">両親</p>
                  <p className="text-sm text-[var(--color-foreground)] font-bold">
                    {panda.father && `父: ${panda.father}`}
                    {panda.father && panda.mother && ' / '}
                    {panda.mother && `母: ${panda.mother}`}
                  </p>
                </div>
              )}

              {panda.partners && panda.partners.length > 0 && (
                <div>
                  <p className="text-xs text-[var(--color-teal-dark)] font-bold mb-1">パートナー</p>
                  <p className="text-sm text-[var(--color-foreground)] font-bold">
                    {panda.partners.join('、')}
                  </p>
                </div>
              )}

              {panda.personality && (
                <div>
                  <p className="text-xs text-[var(--color-teal-dark)] font-bold mb-1">性格</p>
                  <p className="text-sm text-[var(--color-foreground)] font-bold">
                    {panda.personality}
                  </p>
                </div>
              )}

              {panda.notes && (
                <div>
                  <p className="text-xs text-[var(--color-teal-dark)] font-bold mb-1">備考</p>
                  <p className="text-sm text-[var(--color-foreground)] font-bold">
                    {panda.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 家系図へのリンク */}
        <div className="text-center mb-4">
          <Link
            href="/pandas/family-tree"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-extrabold text-white btn-bounce"
            style={{ background: 'linear-gradient(135deg, var(--color-teal), var(--color-teal-dark))' }}
          >
            <Image src="/icons/heart.svg" alt="" width={16} height={16} />
            家系図を見る
          </Link>
        </div>

        <OpenDataCredit className="text-center" />
      </div>
    </div>
  )
}

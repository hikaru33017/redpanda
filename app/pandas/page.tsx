'use client'

import Link from 'next/link'
import Image from 'next/image'
import { LESSER_PANDAS } from '@/lib/pandaData'
import { getHistoricalPandas } from '@/lib/historicalPandaData'
import { ANCESTOR_PANDAS } from '@/lib/ancestorPandaData'
import { PandasClient } from './PandasClient'
import { HistoricalPandasSection } from '@/components/HistoricalPandasSection'
import { OpenDataCredit } from '@/components/OpenDataCredit'
import { useState, useMemo } from 'react'
import { normalizeToHiragana } from '@/lib/searchUtils'
import type { LesserPanda, HistoricalPanda, AncestorPanda } from '@/lib/types'

export default function PandasPage() {
  const historicalPandas = getHistoricalPandas()
  const [searchQuery, setSearchQuery] = useState('')

  // 検索結果候補を計算
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null

    const normalizedQuery = normalizeToHiragana(searchQuery.trim())

    // 現在飼育中・過去飼育個体の検索
    const lesserPandas = LESSER_PANDAS.filter((p) => {
      const normalizedName = normalizeToHiragana(p.name)
      return normalizedName.includes(normalizedQuery)
    }).map(p => {
      const type = p.status === 'transferred' || p.status === 'deceased' ? 'historical' : 'current'
      return { ...p, type: type as 'historical' | 'current' }
    })

    // 歴代パンダ（家系図データ）の検索
    const ancestorMatches = ANCESTOR_PANDAS.filter((p) => {
      const normalizedName = normalizeToHiragana(p.name)
      return normalizedName.includes(normalizedQuery)
    }).map(p => ({ ...p, type: 'ancestor' as const }))

    // 歴代パンダ（historicalPandas）の検索
    const historicalMatches = historicalPandas.filter((p) => {
      const normalizedName = normalizeToHiragana(p.name)
      return normalizedName.includes(normalizedQuery)
    }).map(p => ({ ...p, type: 'historical' as const }))

    return {
      lesserPandas,
      ancestor: ancestorMatches,
      historical: historicalMatches,
      total: lesserPandas.length + ancestorMatches.length + historicalMatches.length
    }
  }, [searchQuery, historicalPandas])

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #E0F7F5 0%, #FFFBF5 25%, #FEF6ED 100%)' }}>
      <div className="page-header">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <div className="animate-float">
            <Image src="/icons/lesser-panda.png" alt="レッサーパンダ" width={52} height={52} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-[var(--color-foreground)]">レッサーパンダたち</h1>
            <p className="text-xs text-[var(--color-teal-dark)] font-bold mt-0.5">西山動物園の仲間たちをご紹介</p>
          </div>
        </div>
        <div className="max-w-lg mx-auto mt-4">
          <Link
            href="/pandas/family-tree"
            className="inline-flex items-center gap-1.5 text-sm px-4 py-2 rounded-full font-extrabold btn-bounce text-white"
            style={{ background: 'linear-gradient(135deg, var(--color-teal), var(--color-teal-dark))' }}
          >
            <Image src="/icons/heart.svg" alt="" width={14} height={14} />
            家系図を見る
          </Link>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6">
        {/* 検索ボックス */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="名前で検索（ひらがな・カタカナOK）"
              className="w-full px-4 py-3 pr-10 rounded-2xl text-sm font-bold border-2 transition-colors"
              style={{
                background: 'rgba(255,255,255,0.9)',
                borderColor: searchQuery ? 'var(--color-teal)' : 'rgba(8,176,163,0.2)',
                color: 'var(--color-foreground)',
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full transition-colors"
                style={{ background: 'rgba(8,176,163,0.1)', color: 'var(--color-teal-dark)' }}
                aria-label="検索をクリア"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M9 3L3 9M3 3l6 6" />
                </svg>
              </button>
            )}
          </div>

          {/* 検索結果候補表示 */}
          {searchQuery && searchResults && (
            <div className="mt-3 rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.95)', border: '2px solid rgba(8,176,163,0.2)' }}>
              {searchResults.total === 0 ? (
                <p className="text-sm text-[var(--color-bark)] p-4 text-center">
                  該当するレッサーパンダが見つかりません
                </p>
              ) : (
                <div className="divide-y divide-[rgba(8,176,163,0.1)]">
                  {searchResults.lesserPandas.map((panda) => (
                    <Link
                      key={panda.id}
                      href={`/pandas/${panda.id}`}
                      className="block px-4 py-3 hover:bg-[rgba(8,176,163,0.05)] transition-colors"
                      onClick={() => setSearchQuery('')}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-extrabold text-sm text-[var(--color-foreground)]">{panda.name}</p>
                          <p className="text-[10px] text-[var(--color-teal-dark)] mt-0.5">
                            {panda.status === 'deceased' ? 'お空組' : panda.status === 'transferred' ? '移動' : '飼育中'}
                          </p>
                        </div>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-teal)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </div>
                    </Link>
                  ))}
                  {searchResults.ancestor.map((panda) => (
                    <Link
                      key={panda.id}
                      href={`/pandas/${panda.id}`}
                      className="block px-4 py-3 hover:bg-[rgba(8,176,163,0.05)] transition-colors"
                      onClick={() => setSearchQuery('')}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-extrabold text-sm text-[var(--color-foreground)]">{panda.name}</p>
                          <p className="text-[10px] text-[var(--color-teal-dark)] mt-0.5">
                            {panda.deceasedDate ? 'お空組' : panda.transferDate ? '移動' : '歴代'}
                          </p>
                        </div>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-teal)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 検索中でない場合のみ、一覧を表示 */}
        {!searchQuery && (
          <>
            <PandasClient pandas={LESSER_PANDAS} />
            <HistoricalPandasSection pandas={historicalPandas} />
          </>
        )}

        <OpenDataCredit className="mt-4 text-center" />
      </div>
    </div>
  )
}

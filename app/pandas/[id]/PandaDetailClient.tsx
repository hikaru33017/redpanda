'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { LesserPanda } from '@/lib/types'
import { OpenDataCredit } from '@/components/OpenDataCredit'

interface Props {
  panda: LesserPanda
  parents: LesserPanda[]
  pandaChildren: LesserPanda[]
  partner?: LesserPanda
}

function buildSnsQuery(pandaName: string): string {
  // 全角スペースを保持した「レッサーパンダ　個体名」
  return `レッサーパンダ\u3000${pandaName}`
}

export function PandaDetailClient({ panda, parents, pandaChildren, partner }: Props) {
  const snsQuery = buildSnsQuery(panda.name)

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
          {panda.photoUrl ? (
            <div className="relative h-64 w-full overflow-hidden">
              <Image
                src={panda.photoUrl}
                alt={panda.name}
                fill
                className="object-cover"
                style={{ objectPosition: panda.photoPosition ?? 'center' }}
                sizes="(max-width: 672px) 100vw, 672px"
                priority
              />
              <div className="absolute bottom-2 right-2">
                <OpenDataCredit />
              </div>
            </div>
          ) : null}

          {/* 基本情報 */}
          <div className="px-6 pb-6 pt-5">
            <div className="mb-4">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-extrabold text-[var(--color-foreground)]">
                  {panda.name}
                </h1>
                <span
                  className="px-2.5 py-0.5 rounded-full text-xs font-bold"
                  style={{ background: 'rgba(8,176,163,0.12)', color: 'var(--color-teal-dark)' }}
                >
                  飼育中
                </span>
              </div>
              <p className="text-sm text-[var(--color-bark)] font-medium">{panda.nameEn}</p>
            </div>

            {/* SNSリンク */}
            <div className="flex gap-2 mb-5">
              <a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(snsQuery)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors"
                style={{ background: 'rgba(239,68,68,0.1)', color: '#b91c1c' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                YouTube
              </a>
              <a
                href={`https://www.instagram.com/explore/search/keyword/?q=${encodeURIComponent(snsQuery)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors"
                style={{ background: 'rgba(219,39,119,0.1)', color: '#9d174d' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                Instagram
              </a>
              <a
                href={`https://x.com/search?q=${encodeURIComponent(snsQuery)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors"
                style={{ background: 'rgba(14,165,233,0.1)', color: '#0369a1' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                X
              </a>
            </div>

            {/* 詳細情報 */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-[var(--color-teal-dark)] font-bold mb-1">性別</p>
                  <p className="text-sm text-[var(--color-foreground)] font-bold">
                    {panda.gender === 'male' ? '♂ オス' : '♀ メス'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[var(--color-teal-dark)] font-bold mb-1">誕生日</p>
                  <p className="text-sm text-[var(--color-foreground)] font-bold">
                    {panda.birthDate}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-[var(--color-teal-dark)] font-bold mb-1">出身地</p>
                <p className="text-sm text-[var(--color-foreground)] font-bold">{panda.birthPlace}</p>
              </div>

              <div>
                <p className="text-xs text-[var(--color-teal-dark)] font-bold mb-1">好きな食べ物</p>
                <p className="text-sm text-[var(--color-foreground)] font-bold">{panda.favoriteFood}</p>
              </div>

              <div>
                <p className="text-xs text-[var(--color-teal-dark)] font-bold mb-1">趣味</p>
                <p className="text-sm text-[var(--color-foreground)] font-bold">{panda.hobby}</p>
              </div>

              <div>
                <p className="text-xs text-[var(--color-teal-dark)] font-bold mb-1">性格</p>
                <p className="text-sm text-[var(--color-foreground)] font-bold">{panda.personality}</p>
              </div>

              <div className="pt-2 border-t" style={{ borderColor: 'rgba(8,176,163,0.15)' }}>
                <p className="text-sm text-[var(--color-foreground)] leading-relaxed" style={{ opacity: 0.8 }}>
                  {panda.bio}
                </p>
              </div>

              {/* 家族 */}
              {(parents.length > 0 || pandaChildren.length > 0 || partner) && (
                <div className="pt-2 border-t" style={{ borderColor: 'rgba(8,176,163,0.15)' }}>
                  <p className="text-xs text-[var(--color-teal-dark)] font-bold mb-3">家族</p>
                  <div className="space-y-2">
                    {parents.length > 0 && (
                      <div>
                        <p className="text-xs text-[var(--color-bark)] mb-1.5">両親</p>
                        <div className="flex gap-2 flex-wrap">
                          {parents.map((p) => (
                            <PandaChip key={p.id} panda={p} />
                          ))}
                        </div>
                      </div>
                    )}
                    {partner && (
                      <div>
                        <p className="text-xs text-[var(--color-bark)] mb-1.5">パートナー</p>
                        <div className="flex gap-2 flex-wrap">
                          <PandaChip panda={partner} />
                        </div>
                      </div>
                    )}
                    {pandaChildren.length > 0 && (
                      <div>
                        <p className="text-xs text-[var(--color-bark)] mb-1.5">子供</p>
                        <div className="flex gap-2 flex-wrap">
                          {pandaChildren.map((p) => (
                            <PandaChip key={p.id} panda={p} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
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
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            家系図を見る
          </Link>
        </div>

        <OpenDataCredit className="text-center" />
      </div>
    </div>
  )
}

function PandaChip({ panda }: { panda: LesserPanda }) {
  return (
    <Link
      href={`/pandas/${panda.id}`}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold transition-colors"
      style={{
        background: 'rgba(8,176,163,0.08)',
        color: 'var(--color-teal-dark)',
        border: '1px solid rgba(8,176,163,0.2)',
      }}
    >
      {panda.name}
    </Link>
  )
}

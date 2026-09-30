'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { LesserPanda } from '@/lib/types'
import type { SeasonalRecommendation } from '@/lib/seasonalRecommendations'
import { IllustMap } from '@/components/IllustMap'

const STORAGE_KEY = 'home-view-mode'

// ツツジ画像（鯖江市オープンデータ CC-BY 2.1 JP）
const TSUTSUJI_IMAGE = 'https://ckan.odp.jig.jp/dataset/5485cc00-e0ff-4d75-b620-9402ed08a823/resource/2f205454-50ec-4f2c-8b72-a8b893cca4d1/download/2.jpg'

interface Props {
  seasonalRec: SeasonalRecommendation
  featuredPanda: LesserPanda
  pandas: LesserPanda[]
}

export function HomeClient({ seasonalRec, featuredPanda, pandas }: Props) {
  const [mode, setMode] = useState<'guide' | 'map'>('guide')

  // ローカルストレージからモードを復元
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'map' || saved === 'guide') setMode(saved)
  }, [])

  function switchMode(next: 'guide' | 'map') {
    setMode(next)
    localStorage.setItem(STORAGE_KEY, next)
  }

  return (
    <div className="min-h-screen bg-page">

      <div className={`relative z-10 max-w-lg mx-auto ${mode === 'map' ? 'px-0 pt-0 pb-0' : 'px-4 pt-5 pb-6'}`}>

        {/* ガイドモード時のヘッダー */}
        {mode === 'guide' && (
          <header className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-bold mb-0.5 text-[var(--color-teal-dark)]">福井県鯖江市</p>
              <h1 className="text-2xl font-extrabold text-[var(--color-foreground)]">西山公園ガイド</h1>
            </div>
            <div className="w-24 h-24 flex items-center justify-center">
              <Image src="/illustrations/panda-peek-log.png" alt="レッサーパンダ" width={96} height={96} style={{ objectFit: 'contain' }} />
            </div>
          </header>
        )}

        {/* モード切替タブ */}
        {mode === 'guide' ? (
          <div
            className="flex gap-1 p-1 rounded-2xl mb-5"
            style={{ background: 'rgba(8,176,163,0.08)', border: '1.5px solid rgba(8,176,163,0.2)' }}
          >
            <button
              onClick={() => switchMode('guide')}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-extrabold transition-all"
              style={{ background: 'var(--color-teal)', color: 'white', boxShadow: '0 2px 8px rgba(8,176,163,0.35)' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              ガイド
            </button>
            <button
              onClick={() => switchMode('map')}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-extrabold transition-all text-[var(--color-teal-dark)]"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
                <line x1="9" y1="3" x2="9" y2="18" />
                <line x1="15" y1="6" x2="15" y2="21" />
              </svg>
              イラストマップ
            </button>
          </div>
        ) : (
          /* マップモード時：右上にフローティングピルタブ */
          <div
            className="absolute top-3 right-3 z-20 flex rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(255,251,248,0.92)',
              backdropFilter: 'blur(12px)',
              border: '1.5px solid rgba(8,176,163,0.25)',
              boxShadow: '0 2px 12px rgba(8,176,163,0.15)',
            }}
          >
            <button
              onClick={() => switchMode('guide')}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold transition-all text-[var(--color-teal-dark)]"
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              ガイド
            </button>
            <div style={{ width: 1, background: 'rgba(8,176,163,0.2)', margin: '6px 0' }} />
            <button
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-extrabold"
              style={{ background: 'var(--color-teal)', color: 'white' }}
              disabled
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
                <line x1="9" y1="3" x2="9" y2="18" />
                <line x1="15" y1="6" x2="15" y2="21" />
              </svg>
              マップ
            </button>
          </div>
        )}

        {/* ── ガイドモード ── */}
        {mode === 'guide' && (
          <>
            {/* ── ツツジヒーローセクション ── */}
            <section className="mb-5 rounded-2xl overflow-hidden card-white">
              <div className="relative h-44">
                <Image
                  src={TSUTSUJI_IMAGE}
                  alt="西山公園のツツジ"
                  fill
                  style={{ objectFit: 'cover' }}
                  unoptimized
                />
                {/* オーバーレイ */}
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(30,15,5,0.65) 0%, transparent 55%)' }} />
                {/* バッジ */}
                <div className="absolute top-3 left-3">
                  <span className="badge-primary text-[11px] px-2.5 py-1">見頃：4月下旬〜5月上旬</span>
                </div>
                {/* テキスト */}
                <div className="absolute bottom-0 left-0 right-0 px-4 pb-3">
                  <p className="text-white font-extrabold text-base leading-tight drop-shadow">西山公園のつつじ</p>
                  <p className="text-white text-xs opacity-90 mt-0.5 drop-shadow">約5万株が山肌を彩る、日本海側随一の名所</p>
                </div>
              </div>
              <div className="px-4 py-3">
                <p className="text-xs text-[var(--color-bark)] leading-relaxed">
                  毎年5月上旬の「さばえつつじまつり」には多くの人が訪れます。この時期だけ出会える特別なレッサーパンダがいるかも。
                </p>
                <p className="text-[10px] text-[var(--color-teal-dark)] opacity-70 mt-2">
                  写真提供：鯖江市オープンデータ（CC BY 2.1 JP）
                </p>
              </div>
            </section>

            {/* ── 季節のおすすめ（吹き出し） ── */}
            <div className="mb-5">
              <div className="flex items-end gap-3">
                <div className="w-20 h-20 flex-shrink-0 animate-float-slow drop-shadow">
                  <Image src="/illustrations/panda-sitting-curious.png" alt="レッサーパンダ" width={80} height={80} style={{ objectFit: 'contain' }} />
                </div>
                <div className="speech-bubble px-4 py-3 flex-1">
                  <p className="text-sm font-extrabold text-[var(--color-teal-dark)]">
                    {seasonalRec.title}
                  </p>
                  <p className="text-xs text-[var(--color-bark)] mt-0.5 leading-relaxed">
                    {seasonalRec.description}
                  </p>
                </div>
              </div>
            </div>

            {/* ── イラストマップ導線バナー ── */}
            <section className="mb-5">
              <button
                onClick={() => switchMode('map')}
                className="w-full text-left focus:outline-none"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <div
                  className="relative rounded-2xl overflow-hidden"
                  style={{
                    border: '1.5px solid rgba(200,92,46,0.2)',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                    height: 110,
                  }}
                >
                  {/* 背景：イラストマップ画像をトリミング */}
                  <Image
                    src="/images/nishiyama-park-illustration.png"
                    alt=""
                    fill
                    style={{ objectFit: 'cover', objectPosition: 'center 20%' }}
                    unoptimized
                  />
                  {/* 暗めオーバーレイ */}
                  <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(120deg, rgba(30,15,5,0.62) 0%, rgba(30,15,5,0.38) 60%, rgba(30,15,5,0.15) 100%)' }}
                  />
                  {/* コンテンツ */}
                  <div className="absolute inset-0 flex items-center px-5 gap-3">
                    {/* テキスト */}
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-extrabold text-sm leading-tight drop-shadow">
                        西山公園をイラストマップで探検しよう
                      </p>
                      <p className="text-white text-xs opacity-80 mt-1 drop-shadow">
                        スポットをタップして詳細を確認できます
                      </p>
                    </div>
                    {/* レッサーパンダイラスト（左右反転） */}
                    <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center">
                      <Image
                        src="/illustrations/panda-lying-peek.png"
                        alt="レッサーパンダ"
                        width={56}
                        height={56}
                        style={{ objectFit: 'contain', transform: 'scaleX(-1)', filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.4))' }}
                      />
                    </div>
                  </div>
                </div>
              </button>
            </section>

            {/* ── レッサーパンダ ── */}
            <section className="mb-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-extrabold text-[var(--color-foreground)] flex items-center gap-1.5">
                  <Image src="/icons/lesser-panda.png" alt="" width={16} height={16} style={{ objectFit: 'contain' }} />
                  レッサーパンダ
                </h2>
                <Link href="/pandas" className="text-xs font-bold text-[var(--color-teal-dark)] flex items-center gap-0.5">
                  みんなに会う
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                </Link>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
                {pandas.map((panda) => (
                  <Link key={panda.id} href={`/pandas/${panda.id}`} className="flex-shrink-0 text-center">
                    <div
                      className="w-16 h-16 rounded-2xl mb-1.5 overflow-hidden border"
                      style={{ background: 'white', borderColor: 'rgba(8,176,163,0.2)' }}
                    >
                      <Image src={panda.photoUrl} alt={panda.name} width={64} height={64} className="object-cover w-full h-full" />
                    </div>
                    <p className="text-[11px] font-bold text-[var(--color-foreground)] w-16 truncate">{panda.name}</p>
                  </Link>
                ))}
              </div>
            </section>

            {/* ── 今日の主役パンダ ── */}
            <section className="mb-5">
              <Link href={`/pandas/${featuredPanda.id}`}>
                <div className="glass-card rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    <h2 className="font-extrabold text-sm text-[var(--color-foreground)]">今日の主役パンダ</h2>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-18 h-18 rounded-xl overflow-hidden flex-shrink-0 border" style={{ width: 72, height: 72, borderColor: 'rgba(200,92,46,0.2)' }}>
                      <Image src={featuredPanda.photoUrl} alt={featuredPanda.name} width={72} height={72} className="object-cover w-full h-full" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-lg font-extrabold text-[var(--color-foreground)]">{featuredPanda.name}</p>
                      <p className="text-xs font-bold text-[var(--color-teal-dark)] mt-0.5">{featuredPanda.nameEn}</p>
                      <p className="text-xs text-[var(--color-bark)] mt-1 leading-relaxed line-clamp-2">{featuredPanda.personality}</p>
                    </div>
                  </div>
                </div>
              </Link>
            </section>

            {/* ── アクセス ── */}
            <section className="mb-5">
              <div className="glass-card rounded-2xl p-4">
                <h2 className="font-extrabold text-sm text-[var(--color-foreground)] mb-3 flex items-center gap-1.5">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--color-teal)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                  </svg>
                  アクセス
                </h2>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  {[
                    { svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-teal)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3H8"/><path d="M12 3v4"/><circle cx="8" cy="17" r="1"/><circle cx="16" cy="17" r="1"/></svg>, title: '電車', body: 'JR鯖江駅\nバス10分' },
                    { svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-teal)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v9a2 2 0 0 1-2 2h-2"/><circle cx="9" cy="17" r="2"/><circle cx="19" cy="17" r="2"/></svg>, title: '車', body: '鯖江IC\n約10分' },
                    { svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>, title: '入園料', body: '無料', highlight: true },
                  ].map((item) => (
                    <div key={item.title} className="rounded-xl p-3 bg-[var(--color-teal-pale)]">
                      <div className="flex justify-center mb-1.5">{item.svg}</div>
                      <p className="font-extrabold text-[var(--color-foreground)]">{item.title}</p>
                      <p className="mt-0.5 whitespace-pre-line leading-snug text-[var(--color-bark)]" style={{ fontWeight: item.highlight ? 800 : 400, color: item.highlight ? 'var(--color-primary)' : undefined }}>
                        {item.body}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        {/* ── イラストマップモード ── */}
        {mode === 'map' && (
          <div className="relative" style={{ minHeight: '100svh' }}>
            <IllustMap />
          </div>
        )}
      </div>
    </div>
  )
}


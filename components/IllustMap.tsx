'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

// ── スポットデータ（unified_spots_master.jsonのIDに合わせる）──────────────
// illustrationMapPosition は lat/lng とは別に、イラストマップ専用の配置値（TASK28の表に従う）
const SPOTS = [
  {
    id: 'observatory-love-bell',
    name: '展望台広場',
    short: '愛の鐘',
    desc: '西山の頂上。鯖江市街を一望できる絶景ポイント。愛の鐘も。',
    mins: 15,
    lat: 35.952420, lng: 136.180997,
    link: '/plan',
    illustrationMapPosition: { xPercent: 16, yPercent: 7 },
  },
  {
    id: 'panda-land',
    name: 'パンダらんど',
    short: 'アスレチック',
    desc: '14種類の遊具があるアスレチックフィールド。子供に大人気。',
    mins: 40,
    lat: 35.952229, lng: 136.182753,
    link: '/plan',
    illustrationMapPosition: { xPercent: 52, yPercent: 14 },
  },
  {
    id: 'manabe-hall',
    name: 'まなべの館',
    short: '博物館',
    desc: '西山公園内の博物館。鯖江の歴史や自然を学べる。',
    mins: 30,
    lat: 35.952100, lng: 136.185800,
    link: '/plan',
    illustrationMapPosition: { xPercent: 88, yPercent: 19 },
  },
  {
    id: 'nishiyama-zoo',
    name: '西山動物園',
    short: 'レッサーパンダの家',
    desc: 'レッサーパンダやシロテナガザル、リスザルなどが無料で会える動物園。',
    mins: 45,
    lat: 35.950668, lng: 136.180943,
    link: '/pandas',
    illustrationMapPosition: { xPercent: 16, yPercent: 35 },
  },
  {
    id: 'inori-no-michi',
    name: '祈りの道',
    short: '石像の道',
    desc: '約400基の石像が並ぶ厳かな参道。静かな散策が楽しめる。',
    mins: 20,
    lat: 35.951800, lng: 136.182000,
    link: '/plan',
    illustrationMapPosition: { xPercent: 46, yPercent: 30 },
  },
  {
    id: 'kyoyo-teien',
    name: '嚮陽庭園',
    short: '日本庭園',
    desc: '鯖江藩ゆかりの落ち着いた庭園。四季折々の花が楽しめる。',
    mins: 30,
    lat: 35.951350, lng: 136.184500,
    link: '/plan',
    illustrationMapPosition: { xPercent: 85, yPercent: 42 },
  },
  {
    id: 'lawn-plaza',
    name: '芝生広場',
    short: 'お祭り広場',
    desc: '広々した芝生でピクニックや子供の遊び場に最適。',
    mins: 20,
    lat: 35.950563, lng: 136.182293,
    link: '/plan',
    illustrationMapPosition: { xPercent: 52, yPercent: 52 },
  },
  {
    id: 'musubi-chime',
    name: '結びの広場',
    short: '結びのチャイム',
    desc: '縁結びのスポット。チャイムが心地よく響く癒しの場所。',
    mins: 10,
    lat: 35.949902, lng: 136.181123,
    link: '/plan',
    illustrationMapPosition: { xPercent: 18, yPercent: 58 },
  },
  {
    id: 'big-fountain',
    name: '大噴水',
    short: 'エントランス',
    desc: 'エントランス広場にある大噴水。待ち合わせの目印にも。',
    mins: 10,
    lat: 35.950114, lng: 136.181969,
    link: '/plan',
    illustrationMapPosition: { xPercent: 52, yPercent: 68 },
  },
  {
    id: 'megane-clock',
    name: '眼鏡モニュメント',
    short: '時計',
    desc: 'さばえライオンズクラブ寄贈のフォトスポット。眼鏡の聖地・鯖江らしい。',
    mins: 5,
    lat: 35.950200, lng: 136.181800,
    link: '/plan',
    illustrationMapPosition: { xPercent: 48, yPercent: 83 },
  },
  {
    id: 'michinoeki-nishiyama',
    name: '道の駅',
    short: '西山公園',
    desc: '地元野菜・眼鏡・漆器などのお土産が揃う道の駅。',
    mins: 40,
    lat: 35.948765, lng: 136.180423,
    link: '/plan',
    illustrationMapPosition: { xPercent: 16, yPercent: 88 },
  },
  {
    id: 'nishiyama-bridge',
    name: '西山橋',
    short: '橋',
    desc: '公園内を流れる小川に架かる橋。のどかな景観が美しい。',
    mins: 10,
    lat: 35.951249, lng: 136.183228,
    link: '/plan',
    illustrationMapPosition: { xPercent: 93, yPercent: 90 },
  },
] as const

type SpotId = (typeof SPOTS)[number]['id']
type Spot = (typeof SPOTS)[number]

// ── レッサーパンダピンアイコン ────────────────────────────────────────────────
function PandaPin({ selected }: { selected: boolean }) {
  const size = selected ? 38 : 32
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: selected ? 'rgba(192,68,10,0.15)' : 'rgba(255,255,255,0.9)',
        border: `2px solid ${selected ? '#C0440A' : '#D4622A'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: selected
          ? '0 4px 12px rgba(192,68,10,0.4)'
          : '0 2px 6px rgba(0,0,0,0.18)',
        transition: 'all 0.2s ease',
      }}
    >
      <Image
        src="/icons/panda-icon.png"
        alt="レッサーパンダ"
        width={selected ? 26 : 22}
        height={selected ? 26 : 22}
        style={{ objectFit: 'contain' }}
      />
    </div>
  )
}

// ── メインコンポーネント ──────────────────────────────────────────────────────
export function IllustMap() {
  const [selectedId, setSelectedId] = useState<SpotId | null>(null)
  const selected: Spot | null = SPOTS.find((s) => s.id === selectedId) ?? null

  function handlePin(id: SpotId) {
    setSelectedId((prev) => (prev === id ? null : id))
  }

  function handleClose() {
    setSelectedId(null)
  }

  return (
    <div className="relative w-full" style={{ userSelect: 'none' }}>
      {/* ── マップ本体 ── */}
      <div
        className="relative rounded-2xl overflow-hidden w-full"
        style={{
          border: '1.5px solid #FFB8E3',
          boxShadow: '0 2px 16px rgba(255,107,157,0.1)',
        }}
      >
        {/* 背景イラスト画像 */}
        <Image
          src="/images/nishiyama-park-illustration.png"
          alt="西山公園イラストマップ"
          width={800}
          height={1000}
          style={{ width: '100%', height: 'auto', display: 'block' }}
          priority
        />

        {/* ピンのオーバーレイ */}
        <div
          className="absolute inset-0"
          onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}
        >
          {SPOTS.map((spot) => {
            const { xPercent, yPercent } = spot.illustrationMapPosition
            const isSelected = selectedId === spot.id
            return (
              <button
                key={spot.id}
                onClick={(e) => { e.stopPropagation(); handlePin(spot.id) }}
                className="absolute"
                style={{
                  left: `${xPercent}%`,
                  top: `${yPercent}%`,
                  transform: 'translate(-50%, -50%)',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  zIndex: isSelected ? 20 : 10,
                }}
                aria-label={spot.name}
              >
                <PandaPin selected={isSelected} />
              </button>
            )
          })}
        </div>
      </div>

      {/* ── ボトムシート（ピン選択時） ── */}
      {selected && (
        <>
          {/* オーバーレイ（マップ外タップで閉じる） */}
          <div
            className="fixed inset-0 z-30"
            style={{ background: 'transparent' }}
            onClick={handleClose}
          />
          {/* ボトムシート本体 */}
          <div
            className="fixed bottom-0 left-0 right-0 z-40 rounded-t-3xl"
            style={{
              background: 'rgba(255,251,248,0.97)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 -4px 32px rgba(255,107,157,0.2)',
              border: '1.5px solid rgba(255,184,227,0.5)',
              animation: 'slideUpSheet 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {/* ドラッグハンドル */}
            <div className="flex justify-center pt-2 pb-1">
              <div
                className="w-10 h-1 rounded-full"
                style={{ background: '#FFB8E3' }}
              />
            </div>

            <div className="px-5 pb-5 pt-1">
              {/* ヘッダー */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex-shrink-0">
                    <PandaPin selected={false} />
                  </div>
                  <div>
                    <p className="font-extrabold text-base leading-tight" style={{ color: '#FF6B9D' }}>
                      {selected.name}
                    </p>
                    <p className="text-xs font-bold mt-0.5" style={{ color: '#9C6BAE' }}>
                      {selected.short}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className="text-[11px] px-2.5 py-1 rounded-full font-bold"
                    style={{ background: '#FFF0F5', color: '#9C6BAE' }}
                  >
                    約{selected.mins}分
                  </span>
                  <button
                    onClick={handleClose}
                    className="w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ background: '#FFE8F5', color: '#FF6B9D' }}
                    aria-label="閉じる"
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* 説明文 */}
              <p className="text-sm text-[var(--color-bark)] leading-relaxed mb-4">
                {selected.desc}
              </p>

              {/* アクションボタン */}
              <div className="flex gap-2">
                <Link
                  href={selected.link}
                  className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-2xl font-bold text-sm"
                  style={{ background: 'linear-gradient(135deg, #FF6B9D, #FF9DC0)', color: 'white' }}
                  onClick={handleClose}
                >
                  詳しく見る
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Link>
                {selected.id === 'nishiyama-zoo' && (
                  <Link
                    href="/stamps"
                    className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-2xl font-bold text-sm"
                    style={{ background: '#FFE8F5', color: '#FF6B9D', border: '1.5px solid #FFB8E3' }}
                    onClick={handleClose}
                  >
                    スタンプ
                  </Link>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* アニメーション定義 */}
      <style>{`
        @keyframes slideUpSheet {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

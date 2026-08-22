'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import type { LesserPanda, KeeperDiary, PandaBlog } from '@/lib/types'
import { useFavorites } from '@/lib/useFavorites'
import { useComments } from '@/lib/useComments'
import { cn } from '@/lib/utils'

interface Props {
  panda: LesserPanda
  parents: LesserPanda[]
  pandaChildren: LesserPanda[]
  partner?: LesserPanda
  diaries: KeeperDiary[]
  blogs: PandaBlog[]
}

type Tab = 'profile' | 'diary' | 'blog' | 'comments'

export function PandaDetailClient({ panda, parents, pandaChildren, partner, diaries, blogs }: Props) {
  const { favorites, toggleFavorite } = useFavorites()
  const { comments, addComment } = useComments(panda.id)
  const [activeTab, setActiveTab] = useState<Tab>('profile')
  const [commentName, setCommentName] = useState('')
  const [commentText, setCommentText] = useState('')

  function handleSubmitComment(e: React.FormEvent) {
    e.preventDefault()
    if (!commentText.trim()) return
    addComment({
      targetType: 'panda',
      authorName: commentName.trim() || '匿名',
      content: commentText.trim(),
    })
    setCommentName('')
    setCommentText('')
  }

  const TABS: { id: Tab; label: string; emoji: string }[] = [
    { id: 'profile', label: 'プロフィール', emoji: '🐼' },
    { id: 'diary', label: '飼育員日誌', emoji: '📓' },
    { id: 'blog', label: 'ブログ', emoji: '✏️' },
    { id: 'comments', label: 'コメント', emoji: '💬' },
  ]

  return (
    <div className="section-gradient min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <Link
          href="/pandas"
          className="inline-flex items-center gap-2 text-sm text-[var(--color-primary)] hover:underline mb-6"
        >
          ← レッサーパンダ一覧に戻る
        </Link>

        <div className="glass rounded-3xl overflow-hidden mb-6">
          <div className="bg-gradient-to-br from-[var(--color-sand-light)] to-[var(--color-cream)] h-64 relative overflow-hidden">
            {panda.photoUrl ? (
              <Image
                src={panda.photoUrl}
                alt={panda.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 672px"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-[120px] leading-none">🐼</span>
              </div>
            )}
          </div>

          <div className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-[var(--color-primary-dark)]">{panda.name}</h1>
                <p className="text-[var(--color-bark)]">{panda.nameEn}</p>
                <span className="text-sm text-[var(--color-bark)]">
                  {panda.gender === 'male' ? '♂ オス' : '♀ メス'}
                </span>
              </div>
              <button
                onClick={() => toggleFavorite(panda.id)}
                className={cn(
                  'text-3xl transition-all hover:scale-110',
                  favorites.has(panda.id) ? 'opacity-100' : 'opacity-25'
                )}
                aria-label={favorites.has(panda.id) ? 'お気に入りを解除' : 'お気に入りに追加'}
              >
                🍎
              </button>
            </div>

            <div className="flex gap-3 mt-4">
              <a
                href={`https://www.youtube.com/results?search_query=西山動物園+レッサーパンダ+${panda.name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-100 text-red-700 text-xs font-medium hover:bg-red-200 transition-colors"
              >
                ▶ YouTube
              </a>
              <a
                href={`https://www.instagram.com/explore/tags/西山動物園レッサーパンダ/`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-pink-100 text-pink-700 text-xs font-medium hover:bg-pink-200 transition-colors"
              >
                📸 Instagram
              </a>
              <a
                href={`https://x.com/search?q=西山動物園+レッサーパンダ`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-sky-100 text-sky-700 text-xs font-medium hover:bg-sky-200 transition-colors"
              >
                𝕏 X
              </a>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all',
                activeTab === tab.id
                  ? 'bg-[var(--color-primary)] text-white shadow-sm'
                  : 'glass text-[var(--color-foreground)] hover:bg-[var(--color-sand-light)]'
              )}
            >
              {tab.emoji} {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'profile' && (
          <div className="glass rounded-3xl p-6 space-y-4 animate-fade-in">
            <h2 className="font-bold text-[var(--color-primary-dark)] text-lg mb-4">基本情報</h2>
            <InfoRow label="🎂 誕生日" value={panda.birthDate} />
            <InfoRow label="🏠 出身地" value={panda.birthPlace} />
            <InfoRow label="🍽️ 好きな食べ物" value={panda.favoriteFood} />
            <InfoRow label="🎮 趣味" value={panda.hobby} />
            <div className="pt-4 border-t border-[var(--color-sand-light)]">
              <p className="text-sm text-[var(--color-foreground)] opacity-80 leading-relaxed">{panda.bio}</p>
            </div>

            {(parents.length > 0 || pandaChildren.length > 0 || partner) && (
              <div className="pt-4 border-t border-[var(--color-sand-light)]">
                <h3 className="font-semibold text-[var(--color-primary-dark)] mb-3">👨‍👩‍👧 家族</h3>
                {parents.length > 0 && (
                  <div className="mb-2">
                    <p className="text-xs text-[var(--color-bark)] mb-1">両親</p>
                    <div className="flex gap-2 flex-wrap">
                      {parents.map((p) => (
                        <PandaChip key={p.id} panda={p} />
                      ))}
                    </div>
                  </div>
                )}
                {partner && (
                  <div className="mb-2">
                    <p className="text-xs text-[var(--color-bark)] mb-1">パートナー</p>
                    <PandaChip panda={partner} />
                  </div>
                )}
                {pandaChildren.length > 0 && (
                  <div>
                    <p className="text-xs text-[var(--color-bark)] mb-1">子供</p>
                    <div className="flex gap-2 flex-wrap">
                      {pandaChildren.map((p) => (
                        <PandaChip key={p.id} panda={p} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'diary' && (
          <div className="space-y-4 animate-fade-in">
            {diaries.length === 0 ? (
              <div className="glass rounded-3xl p-8 text-center text-[var(--color-foreground)] opacity-50">
                日誌がまだありません
              </div>
            ) : (
              diaries.map((diary) => (
                <div key={diary.id} className="glass rounded-3xl p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[var(--color-bark)]">{diary.date}</span>
                    <span className="text-xs bg-[var(--color-sand-light)] px-2 py-1 rounded-lg text-[var(--color-bark)]">
                      {diary.authorName}
                    </span>
                  </div>
                  <h3 className="font-bold text-[var(--color-primary-dark)] mb-2">{diary.title}</h3>
                  <p className="text-sm text-[var(--color-foreground)] opacity-80 leading-relaxed">{diary.content}</p>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'blog' && (
          <div className="space-y-4 animate-fade-in">
            {blogs.length === 0 ? (
              <div className="glass rounded-3xl p-8 text-center text-[var(--color-foreground)] opacity-50">
                ブログがまだありません
              </div>
            ) : (
              blogs.map((blog) => (
                <div key={blog.id} className="glass rounded-3xl p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[var(--color-bark)]">{blog.date}</span>
                    <span className="text-2xl">{blog.mood}</span>
                  </div>
                  <h3 className="font-bold text-[var(--color-primary-dark)] mb-2">{blog.title}</h3>
                  <p className="text-sm text-[var(--color-foreground)] opacity-80 leading-relaxed">{blog.content}</p>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'comments' && (
          <div className="space-y-4 animate-fade-in">
            <form onSubmit={handleSubmitComment} className="glass rounded-3xl p-6 space-y-3">
              <h3 className="font-bold text-[var(--color-primary-dark)]">💬 コメントを書く</h3>
              <input
                type="text"
                placeholder="お名前（任意）"
                value={commentName}
                onChange={(e) => setCommentName(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-[var(--color-sand)] bg-white/80 text-sm outline-none focus:border-[var(--color-primary)]"
              />
              <textarea
                placeholder={`${panda.name}へのメッセージを書いてね！`}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 rounded-xl border border-[var(--color-sand)] bg-white/80 text-sm outline-none focus:border-[var(--color-primary)] resize-none"
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                className={cn(
                  'px-6 py-2 rounded-xl text-sm font-semibold transition-all',
                  commentText.trim()
                    ? 'btn-primary'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                )}
              >
                送信する
              </button>
            </form>

            {comments.length === 0 ? (
              <div className="glass rounded-3xl p-8 text-center text-[var(--color-foreground)] opacity-50">
                まだコメントがありません。最初のコメントを書いてみよう！
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="glass rounded-3xl p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-sm text-[var(--color-primary-dark)]">
                      {comment.authorName}
                    </span>
                    <span className="text-xs text-[var(--color-bark)]">
                      {new Date(comment.createdAt).toLocaleDateString('ja-JP')}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--color-foreground)] opacity-80 leading-relaxed">{comment.content}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4 text-sm">
      <span className="text-[var(--color-bark)] w-36 flex-shrink-0">{label}</span>
      <span className="text-[var(--color-foreground)]">{value}</span>
    </div>
  )
}

function PandaChip({ panda }: { panda: LesserPanda }) {
  return (
    <Link
      href={`/pandas/${panda.id}`}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--color-sand-light)] text-sm text-[var(--color-primary-dark)] hover:bg-[var(--color-sand)] transition-colors"
    >
      🐼 {panda.name}
    </Link>
  )
}

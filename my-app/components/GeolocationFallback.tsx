'use client'

import { Mascot } from './Mascot'
import type { GeolocationStatus } from '@/lib/useGeolocation'

interface GeolocationFallbackProps {
  status: GeolocationStatus
  error: string | null
  onRetry: () => void
}

export function GeolocationFallback({ status, error, onRetry }: GeolocationFallbackProps) {
  if (status === 'requesting') {
    return (
      <div className="flex flex-col items-center justify-center gap-5 py-12 px-6 text-center">
        <Mascot mood="excited" size={80} />
        <div>
          <p className="font-extrabold text-[var(--color-foreground)] text-base">
            現在地を確認中…
          </p>
          <p className="text-sm text-[var(--color-bark)] mt-1">
            位置情報の許可をお願いします
          </p>
        </div>
        <div className="loading-dots flex gap-2">
          <span />
          <span />
          <span />
        </div>
      </div>
    )
  }

  if (status === 'denied') {
    return (
      <div className="flex flex-col items-center justify-center gap-5 py-12 px-6 text-center">
        <Mascot mood="worried" size={80} animate={false} />
        <div className="speech-bubble px-5 py-4 max-w-xs">
          <p className="font-extrabold text-[var(--color-primary)] text-base">
            迷子になっちゃった…
          </p>
          <p className="text-sm text-[var(--color-bark)] mt-2 leading-relaxed">
            {error}
          </p>
        </div>
        <div
          className="rounded-2xl p-4 max-w-xs text-left text-sm"
          style={{ background: 'var(--color-teal-pale)', border: '1px solid rgba(8,176,163,0.2)' }}
        >
          <p className="font-bold text-[var(--color-teal-dark)] mb-2">許可の手順</p>
          <ol className="space-y-1 text-[var(--color-bark)] list-decimal list-inside leading-relaxed">
            <li>ブラウザのアドレスバー横の🔒アイコンをタップ</li>
            <li>「位置情報」を「許可」に変更</li>
            <li>ページを再読み込み</li>
          </ol>
        </div>
        <button
          onClick={onRetry}
          className="px-8 py-3 text-white font-extrabold btn-bounce rounded-full"
          style={{ background: 'linear-gradient(135deg, var(--color-teal), var(--color-teal-dark))' }}
        >
          もう一度試す
        </button>
      </div>
    )
  }

  if (status === 'unavailable') {
    return (
      <div className="flex flex-col items-center justify-center gap-5 py-12 px-6 text-center">
        <Mascot mood="worried" size={80} animate={false} />
        <div className="speech-bubble px-5 py-4 max-w-xs">
          <p className="font-extrabold text-[var(--color-primary)] text-base">
            電波が届かないよ…
          </p>
          <p className="text-sm text-[var(--color-bark)] mt-2 leading-relaxed">
            {error}
          </p>
        </div>
        <button
          onClick={onRetry}
          className="px-8 py-3 text-white font-extrabold btn-bounce rounded-full"
          style={{ background: 'linear-gradient(135deg, var(--color-teal), var(--color-teal-dark))' }}
        >
          もう一度試す
        </button>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center gap-5 py-12 px-6 text-center">
        <Mascot mood="worried" size={80} animate={false} />
        <div className="speech-bubble px-5 py-4 max-w-xs">
          <p className="font-extrabold text-[var(--color-primary)] text-base">
            うーん、なんか変だな…
          </p>
          <p className="text-sm text-[var(--color-bark)] mt-2 leading-relaxed">
            {error}
          </p>
        </div>
        <button
          onClick={onRetry}
          className="px-8 py-3 text-white font-extrabold btn-bounce rounded-full"
          style={{ background: 'linear-gradient(135deg, var(--color-teal), var(--color-teal-dark))' }}
        >
          もう一度試す
        </button>
      </div>
    )
  }

  return null
}

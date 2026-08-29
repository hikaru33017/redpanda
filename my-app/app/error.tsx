'use client'

import { Mascot } from '@/components/Mascot'

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center" style={{ background: 'linear-gradient(180deg, #FEF6E4 0%, #FFFBF5 100%)' }}>
      <div className="animate-wiggle">
        <Mascot mood="worried" size={88} animate={false} />
      </div>
      <div className="speech-bubble px-6 py-4 max-w-xs">
        <p className="font-extrabold text-[var(--color-primary)] text-lg">うーん、なんか</p>
        <p className="font-extrabold text-[var(--color-primary)] text-lg">うまくいかないな…</p>
        <p className="text-sm text-[var(--color-bark)] mt-2 opacity-70">
          もう一度試してみてね
        </p>
      </div>
      <button
        onClick={reset}
        className="px-8 py-3 text-white font-extrabold btn-bounce rounded-full"
        style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))' }}
      >
        もう一度試す
      </button>
    </div>
  )
}

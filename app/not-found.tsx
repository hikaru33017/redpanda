import Link from 'next/link'
import Image from 'next/image'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center" style={{ background: 'linear-gradient(180deg, #E0F7F5 0%, #FFFBF5 100%)' }}>
      <div className="animate-float">
        <Image src="/icons/lesser-panda.png" alt="レッサーパンダ" width={96} height={96} />
      </div>
      <div className="speech-bubble px-6 py-4 max-w-xs">
        <p className="font-extrabold text-[var(--color-teal-dark)] text-lg">あれ、迷子に</p>
        <p className="font-extrabold text-[var(--color-teal-dark)] text-lg">なっちゃったみたい…</p>
        <p className="text-sm text-[var(--color-bark)] mt-2 opacity-70">
          このページは見つかりませんでした
        </p>
      </div>
      <Link
        href="/"
        className="px-8 py-3 text-white font-extrabold btn-bounce rounded-full"
        style={{ background: 'linear-gradient(135deg, var(--color-teal), var(--color-teal-dark))' }}
      >
        ホームに戻る
      </Link>
    </div>
  )
}

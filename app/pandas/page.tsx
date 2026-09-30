import Link from 'next/link'
import Image from 'next/image'
import { LESSER_PANDAS } from '@/lib/pandaData'
import { getHistoricalPandas } from '@/lib/historicalPandaData'
import { PandasClient } from './PandasClient'
import { HistoricalPandasSection } from '@/components/HistoricalPandasSection'
import { OpenDataCredit } from '@/components/OpenDataCredit'

export const metadata = {
  title: 'レッサーパンダ | 西山公園ガイド',
  description: '西山動物園のレッサーパンダたちのプロフィールをご紹介します。',
}

export default function PandasPage() {
  const historicalPandas = getHistoricalPandas()

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
        <PandasClient pandas={LESSER_PANDAS} />
        <HistoricalPandasSection pandas={historicalPandas} />
        <OpenDataCredit className="mt-4 text-center" />
      </div>
    </div>
  )
}

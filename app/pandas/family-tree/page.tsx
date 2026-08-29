import Link from 'next/link'
import Image from 'next/image'
import { LESSER_PANDAS } from '@/lib/pandaData'
import type { LesserPanda } from '@/lib/types'
import { OpenDataCredit } from '@/components/OpenDataCredit'

export const metadata = {
  title: 'レッサーパンダ家系図 | 西山公園ガイド',
  description: '西山動物園のレッサーパンダたちの家系図です。',
}

function buildRoots(pandas: LesserPanda[]): LesserPanda[] {
  return pandas.filter((p) => p.parentIds.length === 0)
}

function buildChildren(parentId: string, pandas: LesserPanda[]): LesserPanda[] {
  return pandas.filter((p) => p.parentIds[0] === parentId)
}

function PandaCard({ panda }: { panda: LesserPanda }) {
  return (
    <Link href={`/pandas/${panda.id}`}>
      <div
        className="flex flex-col items-center p-3 rounded-2xl transition-all duration-200 hover:scale-105 w-28"
        style={{ background: panda.gender === 'male' ? '#E6F4FA' : '#FFF0F5', border: '1.5px solid', borderColor: panda.gender === 'male' ? '#B8DDED' : '#F9C8DC' }}
      >
        <div className="w-14 h-14 rounded-full mb-1.5 overflow-hidden" style={{ background: '#E0F7F5' }}>
          {panda.photoUrl ? (
            <Image src={panda.photoUrl} alt={panda.name} width={56} height={56} className="object-cover w-full h-full" />
          ) : (
            <Image src="/icons/lesser-panda.png" alt={panda.name} width={56} height={56} />
          )}
        </div>
        <p className="font-extrabold text-xs text-[var(--color-foreground)] text-center truncate w-full">{panda.name}</p>
        <p className="text-[10px] font-bold" style={{ color: panda.gender === 'male' ? '#5BA8D4' : '#E8607A' }}>
          {panda.gender === 'male' ? '♂ オス' : '♀ メス'}
        </p>
      </div>
    </Link>
  )
}

function FamilyNode({ panda, pandas, depth = 0 }: { panda: LesserPanda; pandas: LesserPanda[]; depth?: number }) {
  const children = buildChildren(panda.id, pandas)
  const partner = panda.partnerId ? pandas.find((p) => p.id === panda.partnerId) : undefined

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-2">
        <PandaCard panda={panda} />

        {partner && depth === 0 && (
          <>
            <div className="flex items-center gap-1">
              <div className="w-4 h-0.5 bg-[var(--color-sand)]" />
              <Image src="/icons/heart.svg" alt="パートナー" width={16} height={16} />
              <div className="w-4 h-0.5 bg-[var(--color-sand)]" />
            </div>
            <PandaCard panda={partner} />
          </>
        )}
      </div>

      {children.length > 0 && (
        <div className="flex flex-col items-center mt-1">
          <div className="w-0.5 h-5 bg-[var(--color-sand)]" />
          <div className="flex gap-4 items-start">
            {children.map((child) => (
              <div key={child.id} className="flex flex-col items-center">
                <div className="w-0.5 h-5 bg-[var(--color-sand)]" />
                <FamilyNode panda={child} pandas={pandas} depth={depth + 1} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function FamilyTreePage() {
  const roots = buildRoots(LESSER_PANDAS)
  const processedIds = new Set<string>()

  const families: LesserPanda[] = []
  for (const root of roots) {
    if (processedIds.has(root.id)) continue
    processedIds.add(root.id)
    if (root.partnerId) {
      processedIds.add(root.partnerId)
    }
    families.push(root)
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #E0F7F5 0%, #FFFBF5 30%, #FEF6ED 100%)' }}>
      <div className="page-header">
        <div className="flex items-center gap-3 max-w-2xl mx-auto">
          <div className="animate-float">
            <Image src="/icons/lesser-panda.png" alt="レッサーパンダ" width={48} height={48} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-[var(--color-foreground)]">レッサーパンダ家系図</h1>
            <p className="text-xs text-[var(--color-teal-dark)] font-bold mt-0.5">西山動物園のみんなの家族関係</p>
          </div>
        </div>
        <div className="max-w-2xl mx-auto mt-3">
          <Link href="/pandas" className="text-sm text-[var(--color-teal)] font-bold">
            ← 一覧に戻る
          </Link>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <div
          className="rounded-3xl p-5 overflow-x-auto scrollbar-hide"
          style={{ background: 'white', border: '1.5px solid rgba(8,176,163,0.15)', boxShadow: '0 4px 20px rgba(8,176,163,0.08)' }}
        >
          <div className="flex gap-10 justify-start min-w-max pb-2">
            {families.map((root, i) => (
              <div key={i} className="flex flex-col items-center">
                <FamilyNode panda={root} pandas={LESSER_PANDAS} />
              </div>
            ))}
          </div>
        </div>

        <div
          className="rounded-3xl p-5"
          style={{ background: 'white', border: '1.5px solid rgba(8,176,163,0.15)', boxShadow: '0 4px 20px rgba(8,176,163,0.08)' }}
        >
          <h2 className="font-extrabold text-[var(--color-foreground)] mb-4 flex items-center gap-2">
            <Image src="/icons/lesser-panda.png" alt="" width={20} height={20} />
            全メンバー一覧
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {LESSER_PANDAS.map((panda) => (
              <Link
                key={panda.id}
                href={`/pandas/${panda.id}`}
                className="flex items-center gap-3 p-3 rounded-2xl transition-all duration-200 hover:scale-[1.02]"
                style={{ background: panda.gender === 'male' ? '#E6F4FA' : '#FFF0F5', border: '1.5px solid', borderColor: panda.gender === 'male' ? '#C8E8F5' : '#F9C8DC' }}
              >
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0" style={{ background: '#E0F7F5' }}>
                  {panda.photoUrl ? (
                    <Image src={panda.photoUrl} alt={panda.name} width={40} height={40} className="object-cover w-full h-full" />
                  ) : (
                    <Image src="/icons/lesser-panda.png" alt={panda.name} width={40} height={40} />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-extrabold text-sm text-[var(--color-foreground)] truncate">{panda.name}</p>
                  <p className="text-[10px] font-bold" style={{ color: panda.gender === 'male' ? '#5BA8D4' : '#E8607A' }}>
                    {panda.gender === 'male' ? '♂ オス' : '♀ メス'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-2xl mx-auto px-4 pb-6">
        <OpenDataCredit className="text-center" />
      </div>
    </div>
  )
}

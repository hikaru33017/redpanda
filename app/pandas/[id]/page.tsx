import { notFound } from 'next/navigation'
import { LESSER_PANDAS } from '@/lib/pandaData'
import { ANCESTOR_PANDAS } from '@/lib/ancestorPandaData'
import { findHistoricalPandaById, getHistoricalPandasWithId } from '@/lib/historicalPandaData'
import { PandaDetailClient } from './PandaDetailClient'
import { HistoricalPandaDetailClient } from './HistoricalPandaDetailClient'
import { AncestorPandaDetailClient } from './AncestorPandaDetailClient'

export function generateStaticParams() {
  const currentPandas = LESSER_PANDAS.map((p) => ({ id: p.id }))
  const ancestorPandas = ANCESTOR_PANDAS.map((p) => ({ id: p.id }))
  const historicalPandas = getHistoricalPandasWithId().map((p) => ({ id: p.id }))
  return [...currentPandas, ...ancestorPandas, ...historicalPandas]
}

export async function generateMetadata(props: PageProps<'/pandas/[id]'>) {
  const { id } = await props.params
  const panda = LESSER_PANDAS.find((p) => p.id === id)
  if (panda) return { title: `${panda.name} | 西山公園ガイド` }

  const ancestorPanda = ANCESTOR_PANDAS.find((p) => p.id === id)
  if (ancestorPanda) return { title: `${ancestorPanda.name} | 西山公園ガイド` }

  const historicalPanda = findHistoricalPandaById(id)
  if (historicalPanda) return { title: `${historicalPanda.name} | 西山公園ガイド` }

  return { title: '見つかりません' }
}

export default async function PandaDetailPage(props: PageProps<'/pandas/[id]'>) {
  const { id } = await props.params

  // 現在飼育中のパンダをチェック
  const panda = LESSER_PANDAS.find((p) => p.id === id)
  if (panda) {
    const parents = LESSER_PANDAS.filter((p) => panda.parentIds.includes(p.id))
    const pandaChildren = LESSER_PANDAS.filter((p) => panda.childrenIds.includes(p.id))
    const partner = panda.partnerId ? LESSER_PANDAS.find((p) => p.id === panda.partnerId) : undefined

    return (
      <PandaDetailClient
        panda={panda}
        parents={parents}
        pandaChildren={pandaChildren}
        partner={partner}
      />
    )
  }

  // 先祖パンダをチェック
  const ancestorPanda = ANCESTOR_PANDAS.find((p) => p.id === id)
  if (ancestorPanda) {
    return <AncestorPandaDetailClient panda={ancestorPanda} />
  }

  // 歴代パンダをチェック
  const historicalPanda = findHistoricalPandaById(id)
  if (historicalPanda) {
    return <HistoricalPandaDetailClient panda={historicalPanda} />
  }

  notFound()
}

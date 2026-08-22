import { notFound } from 'next/navigation'
import { LESSER_PANDAS, KEEPER_DIARIES, PANDA_BLOGS } from '@/lib/pandaData'
import { PandaDetailClient } from './PandaDetailClient'

export function generateStaticParams() {
  return LESSER_PANDAS.map((p) => ({ id: p.id }))
}

export async function generateMetadata(props: PageProps<'/pandas/[id]'>) {
  const { id } = await props.params
  const panda = LESSER_PANDAS.find((p) => p.id === id)
  if (!panda) return { title: '見つかりません' }
  return { title: `${panda.name} | 西山公園ガイド` }
}

export default async function PandaDetailPage(props: PageProps<'/pandas/[id]'>) {
  const { id } = await props.params
  const panda = LESSER_PANDAS.find((p) => p.id === id)
  if (!panda) notFound()

  const parents = LESSER_PANDAS.filter((p) => panda.parentIds.includes(p.id))
  const pandaChildren = LESSER_PANDAS.filter((p) => panda.childrenIds.includes(p.id))
  const partner = panda.partnerId ? LESSER_PANDAS.find((p) => p.id === panda.partnerId) : undefined

  const diaries = KEEPER_DIARIES.filter((d) => d.pandaIds.includes(panda.id))
  const blogs = PANDA_BLOGS.filter((b) => b.pandaId === panda.id)

  return (
    <PandaDetailClient
      panda={panda}
      parents={parents}
      pandaChildren={pandaChildren}
      partner={partner}
      diaries={diaries}
      blogs={blogs}
    />
  )
}

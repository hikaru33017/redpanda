import { PlanClient } from './PlanClient'

export const metadata = {
  title: '観光プラン生成 | 西山公園ガイド',
  description: '滞在時間・人数・興味から西山公園の観光プランを自動生成します。',
}

export default function PlanPage() {
  return <PlanClient />
}

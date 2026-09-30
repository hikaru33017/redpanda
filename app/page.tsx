import { LESSER_PANDAS } from '@/lib/pandaData'
import { getTodaysRecommendation } from '@/lib/seasonalRecommendations'
import { getTodaysFeaturedPanda } from '@/lib/dailyPanda'
import { HomeClient } from '@/components/HomeClient'

export default function Home() {
  const seasonalRec = getTodaysRecommendation()
  const featuredPanda = getTodaysFeaturedPanda()
  const pandas = LESSER_PANDAS.filter((p) => !p.status || p.status === 'active').slice(0, 7)

  return (
    <HomeClient
      seasonalRec={seasonalRec}
      featuredPanda={featuredPanda}
      pandas={pandas}
    />
  )
}

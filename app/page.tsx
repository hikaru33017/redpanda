import Link from 'next/link'
import Image from 'next/image'
import { LESSER_PANDAS } from '@/lib/pandaData'
import { getTodaysRecommendation } from '@/lib/seasonalRecommendations'
import { getTodaysFeaturedPanda } from '@/lib/dailyPanda'

const SPOTS = [
  {
    icon: '/icons/lesser-panda.png',
    name: '西山動物園',
    desc: 'レッサーパンダに無料で会える！',
    color: '#FFE8F5',
    borderColor: '#FFB8E3'
  },
  {
    icon: '/icons/cherry-blossom.svg',
    name: '嚮陽庭園',
    desc: '四季折々の花が楽しめる日本庭園',
    color: '#FFF0F5',
    borderColor: '#F9C8DC'
  },
  {
    icon: '/icons/bamboo.svg',
    name: 'パンダランド 冒険の森',
    desc: '遊具がいっぱいの森の遊び場',
    color: '#E8F5E9',
    borderColor: '#B8E0A0'
  },
]

export default function Home() {
  const seasonalRec = getTodaysRecommendation()
  const featuredPanda = getTodaysFeaturedPanda()

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #FFF0F9 0%, #FFFBF5 30%, #FFF5F0 100%)' }}>
      <PageBackground />

      <div className="relative z-10 max-w-lg mx-auto px-4 pt-6 pb-4">

        <header className="flex items-center justify-between mb-5">
          <div>
            <p className="text-xs font-bold mb-0.5" style={{ color: '#9C6BAE' }}>福井県鯖江市</p>
            <h1 className="text-2xl font-extrabold" style={{ color: '#FF6B9D' }}>西山公園ガイド</h1>
          </div>
          <div className="w-12 h-12 animate-wiggle">
            <Image src="/icons/paw.svg" alt="足跡" width={48} height={48} />
          </div>
        </header>

        <div className="mb-6">
          <div className="flex items-end gap-3">
            <div className="w-24 h-24 flex-shrink-0 animate-float-slow drop-shadow-lg">
              <Image src="/illustrations/panda-sitting-curious.png" alt="レッサーパンダ" width={96} height={96} style={{ objectFit: 'contain' }} />
            </div>
            <div className="speech-bubble px-4 py-3 flex-1">
              <p className="text-sm font-extrabold" style={{ color: '#FF6B9D' }}>
                {seasonalRec.emoji} {seasonalRec.title}
              </p>
              <p className="text-xs text-[var(--color-bark)] mt-0.5 leading-relaxed">
                {seasonalRec.description}
              </p>
            </div>
          </div>
        </div>

        <section className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-extrabold flex items-center gap-1.5" style={{ color: '#FF6B9D' }}>
              <Image src="/icons/map.svg" alt="" width={18} height={18} />
              おすすめスポット
            </h2>
            <Link href="/plan" className="text-xs font-bold flex items-center gap-0.5" style={{ color: '#FF6B9D' }}>
              プランを作る →
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
            {SPOTS.map((spot) => (
              <Link key={spot.name} href="/plan" className="flex-shrink-0 w-40">
                <div
                  className="rounded-3xl p-4 h-40 flex flex-col justify-between card-soft"
                  style={{ backgroundColor: spot.color, border: `2px solid ${spot.borderColor}` }}
                >
                  <div className="w-12 h-12">
                    <Image src={spot.icon} alt={spot.name} width={48} height={48} />
                  </div>
                  <div>
                    <p className="font-extrabold text-sm" style={{ color: '#FF6B9D' }}>{spot.name}</p>
                    <p className="text-xs text-[var(--color-bark)] mt-0.5 leading-tight">{spot.desc}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-extrabold flex items-center gap-1.5" style={{ color: '#FF6B9D' }}>
              <Image src="/icons/lesser-panda.png" alt="" width={18} height={18} />
              レッサーパンダ
            </h2>
            <Link href="/pandas" className="text-xs font-bold" style={{ color: '#FF6B9D' }}>
              みんなに会う →
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
            {LESSER_PANDAS.filter((p) => !p.status || p.status === 'active').slice(0, 7).map((panda) => (
              <Link key={panda.id} href={`/pandas/${panda.id}`} className="flex-shrink-0 text-center">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-1.5 border-2 overflow-hidden"
                  style={{ background: '#FFF', borderColor: '#FFB8E3' }}
                >
                  <Image
                    src={panda.photoUrl}
                    alt={panda.name}
                    width={64}
                    height={64}
                    className="object-cover w-full h-full"
                  />
                </div>
                <p className="text-xs font-bold text-[var(--color-foreground)] w-16 truncate">{panda.name}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-6">
          <Link href={`/pandas/${featuredPanda.id}`}>
            <div
              className="rounded-3xl p-5 card-soft"
              style={{ background: 'linear-gradient(135deg, #FFE8F5, #FFFBF5)', border: '1.5px solid #FFB8E3' }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Image src="/icons/star.svg" alt="スター" width={20} height={20} />
                <h2 className="font-extrabold text-sm" style={{ color: '#FF6B9D' }}>今日の主役パンダ</h2>
              </div>
              <div className="flex items-center gap-4">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden"
                  style={{ background: '#FFF', border: '2px solid #FFB8E3' }}
                >
                  <Image
                    src={featuredPanda.photoUrl}
                    alt={featuredPanda.name}
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xl font-extrabold" style={{ color: '#FF6B9D' }}>{featuredPanda.name}</p>
                  <p className="text-xs font-bold" style={{ color: '#9C6BAE' }}>{featuredPanda.nameEn}</p>
                  <p className="text-xs text-[var(--color-bark)] mt-1 leading-relaxed line-clamp-2">{featuredPanda.personality}</p>
                </div>
              </div>
            </div>
          </Link>
        </section>

        <section className="mb-6">
          <div className="rounded-3xl p-5" style={{ background: 'white', border: '2px solid #FFE8F5', boxShadow: '0 4px 16px rgba(255,107,157,0.1)' }}>
            <h2 className="font-extrabold text-sm mb-4 flex items-center gap-1.5" style={{ color: '#FF6B9D' }}>
              <Image src="/icons/map.svg" alt="" width={16} height={16} />
              アクセス
            </h2>
            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              {[
                { icon: '🚃', title: '電車', body: 'JR鯖江駅\nバス10分' },
                { icon: '🚗', title: '車', body: '鯖江IC\n約10分' },
                { icon: '🎟️', title: '入園料', body: '無料！', highlight: true },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl p-3" style={{ background: '#FFF5FA' }}>
                  <div className="text-2xl mb-1">{item.icon}</div>
                  <p className="font-extrabold" style={{ color: '#FF6B9D' }}>{item.title}</p>
                  <p
                    className="mt-0.5 whitespace-pre-line leading-snug"
                    style={{ color: item.highlight ? '#FF6B9D' : 'var(--color-bark)', fontWeight: item.highlight ? 800 : 400 }}
                  >
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="text-center text-[10px] text-[var(--color-bark)] opacity-50 pb-2">
          イラスト: OpenMoji (CC BY-SA 4.0, openmoji.org)
        </div>
      </div>
    </div>
  )
}

function PageBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <svg className="absolute top-0 left-0 w-full" viewBox="0 0 400 130" preserveAspectRatio="none">
        <path d="M0,90 Q50,55 100,72 Q150,88 200,58 Q250,28 300,58 Q350,88 400,65 L400,0 L0,0 Z"
          fill="#FF6B9D" opacity="0.08" />
        <path d="M0,100 Q60,70 120,85 Q180,100 240,72 Q300,44 360,68 Q385,78 400,72 L400,0 L0,0 Z"
          fill="#9C6BAE" opacity="0.05" />
      </svg>

      <svg className="absolute top-0 left-0 w-20 h-48 opacity-8" viewBox="0 0 80 200">
        <ellipse cx="20" cy="60" rx="18" ry="55" fill="#FFB8E3" transform="rotate(-10 20 60)" />
        <rect x="16" y="110" width="8" height="80" fill="#FFE8D6" rx="4" />
        <ellipse cx="55" cy="80" rx="14" ry="42" fill="#FFB8E3" transform="rotate(12 55 80)" />
        <rect x="51" y="120" width="6" height="60" fill="#FFE8D6" rx="3" />
      </svg>

      <svg className="absolute top-0 right-0 w-20 h-48 opacity-8" viewBox="0 0 80 200">
        <ellipse cx="60" cy="60" rx="18" ry="55" fill="#FFB8E3" transform="rotate(10 60 60)" />
        <rect x="56" y="110" width="8" height="80" fill="#FFE8D6" rx="4" />
        <ellipse cx="25" cy="75" rx="14" ry="42" fill="#FFB8E3" transform="rotate(-12 25 75)" />
        <rect x="21" y="115" width="6" height="65" fill="#FFE8D6" rx="3" />
      </svg>

      <svg className="absolute bottom-20 left-0 w-full opacity-5" viewBox="0 0 400 60" preserveAspectRatio="none">
        <path d="M0,40 Q40,15 80,30 Q120,45 160,22 Q200,0 240,25 Q280,50 320,30 Q360,10 400,35 L400,60 L0,60 Z"
          fill="#FFB8E3" />
      </svg>
    </div>
  )
}

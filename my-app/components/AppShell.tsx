'use client'

import { useState } from 'react'
import { Onboarding } from './Onboarding'
import { BottomNav } from './BottomNav'
import { Mascot } from './Mascot'

const ONBOARDING_KEY = 'nishiyama-onboarding-done'

export function AppShell({ children }: { children: React.ReactNode }) {
  const [{ mounted, showOnboarding }, setState] = useState(() => {
    if (typeof window === 'undefined') return { mounted: false, showOnboarding: false }
    const done = localStorage.getItem(ONBOARDING_KEY)
    return { mounted: true, showOnboarding: !done }
  })

  function handleOnboardingComplete() {
    localStorage.setItem(ONBOARDING_KEY, '1')
    setState({ mounted: true, showOnboarding: false })
  }


  if (!mounted) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[var(--color-cream)]">
        <div className="text-center space-y-4">
          <Mascot mood="excited" size={72} />
          <p className="text-[var(--color-bark)]">レッサーパンダが道を調べています…</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {showOnboarding && <Onboarding onComplete={handleOnboardingComplete} />}
      <main className="flex-1 pb-20">{children}</main>
      <BottomNav />
    </>
  )
}

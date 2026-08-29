import { Mascot } from '@/components/Mascot'

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6" style={{ background: 'linear-gradient(180deg, #E0F7F5 0%, #FFFBF5 100%)' }}>
      <div className="animate-walk">
        <Mascot mood="excited" size={80} animate={false} />
      </div>
      <div className="text-center">
        <p className="text-[var(--color-foreground)] font-extrabold text-lg">レッサーパンダが</p>
        <p className="text-[var(--color-foreground)] font-extrabold text-lg">道を調べています…</p>
      </div>
      <div className="loading-dots flex gap-2">
        <span />
        <span />
        <span />
      </div>
    </div>
  )
}

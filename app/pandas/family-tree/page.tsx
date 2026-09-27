'use client'

import Link from 'next/link'
import { FamilyTreeViewer } from '@/components/FamilyTreeViewer'
import { OpenDataCredit } from '@/components/OpenDataCredit'

export default function FamilyTreePage() {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #E0F7F5 0%, #FFFBF5 30%, #FEF6ED 100%)' }}>
      <div className="page-header">
        <div className="flex items-center gap-3 max-w-2xl mx-auto">
          <div>
            <h1 className="text-2xl font-extrabold text-[var(--color-foreground)]">レッサーパンダ家系図</h1>
            <p className="text-xs text-[var(--color-teal-dark)] font-bold mt-0.5">
              父親・母親から子へ、左→右に読む系譜図
            </p>
          </div>
        </div>
        <div className="max-w-2xl mx-auto mt-3">
          <Link href="/pandas" className="text-sm text-[var(--color-teal)] font-bold">
            ← 一覧に戻る
          </Link>
        </div>
      </div>

      <FamilyTreeViewer />

      <div className="max-w-2xl mx-auto px-4 pb-6">
        <OpenDataCredit className="text-center" />
      </div>
    </div>
  )
}

import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { AppShell } from '@/components/AppShell'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: '西山公園ガイド | 鯖江市の観光＆レッサーパンダ',
  description: '福井県鯖江市の西山公園の観光プランとレッサーパンダ情報をご提供します。',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="ja" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[var(--color-cream)]">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}

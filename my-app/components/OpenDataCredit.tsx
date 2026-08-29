interface OpenDataCreditProps {
  className?: string
}

export function OpenDataCredit({ className = '' }: OpenDataCreditProps) {
  return (
    <p
      className={`text-[10px] leading-relaxed text-[var(--color-bark)] opacity-50 ${className}`}
    >
      写真提供：
      <a
        href="https://ckan.odp.jig.jp/organization/jp-fukui-sabae"
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-2"
      >
        鯖江市データシティ鯖江ポータルサイト
      </a>
      （CC BY 4.0）
    </p>
  )
}

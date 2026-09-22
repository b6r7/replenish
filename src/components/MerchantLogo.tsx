// ---------------------------------------------------------------------------
// Small circular brand mark used throughout the app for plan / merchant
// affordances. Uses the SVG assets under /public/plans-assets when available
// and falls back to a monogram avatar for merchants without a bundled logo.
// ---------------------------------------------------------------------------

import Image from "next/image"
import { cn } from "@/lib/format"

type MerchantVariant = "apple" | "amazon" | "bonobos" | "bestbuy" | "nike"

const assetMap: Partial<Record<MerchantVariant, string>> = {
  apple: "/plans-assets/apple.svg",
  amazon: "/plans-assets/amazon.svg",
  bonobos: "/plans-assets/bonobos.svg"
}

type Props = {
  variant: MerchantVariant
  merchant: string
  size?: number
  className?: string
}

const MerchantLogo = ({ variant, merchant, size = 36, className }: Props) => {
  const asset = assetMap[variant]
  if (asset) {
    return (
      <div
        className={cn("shrink-0 rounded-full overflow-hidden bg-white flex items-center justify-center", className)}
        style={{ width: size, height: size }}
      >
        <Image src={asset} alt="" width={size} height={size} className="w-full h-full object-contain" />
      </div>
    )
  }
  return (
    <div
      className={cn(
        "shrink-0 rounded-full bg-surface-inset border border-border-subtle flex items-center justify-center",
        className
      )}
      style={{ width: size, height: size }}
    >
      <span className="text-[10px] font-semibold text-ink-secondary tracking-wide">
        {merchant.slice(0, 2).toUpperCase()}
      </span>
    </div>
  )
}

export default MerchantLogo
export type { MerchantVariant }

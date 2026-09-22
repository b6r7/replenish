// Simple wordmark used in headers and receipt emails.

import { cn } from "@/lib/format"

const AffirmMark = ({ className, tone = "brand" }: { className?: string; tone?: "brand" | "on-brand" }) => {
  const color = tone === "brand" ? "text-brand" : "text-brand-on"
  return (
    <span
      className={cn(
        "font-display text-h-sm font-semibold lowercase tracking-tight",
        color,
        className
      )}
    >
      affirm
    </span>
  )
}

export default AffirmMark

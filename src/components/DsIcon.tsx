// ---------------------------------------------------------------------------
// DsIcon
//
// Renders any icon from /public/ds-icons/ (mirrored 1:1 from
// @affirm/design-system/src/core/Icon/icons/*.svg).
//
// Uses CSS mask so the icon inherits its color from the parent's
// `color` value — meaning `text-brand-link`, `text-ink`, `text-signal-error`
// etc. all "just work", exactly like an inline SVG with `fill="currentColor"`.
//
// This keeps our components pixel-identical to production without needing
// to add SVGR, next-svg, or any build tooling.
// ---------------------------------------------------------------------------

import { cn } from "@/lib/format"

// Canonical list of DS icons available in /public/ds-icons.
// Extend as we pull more. Keeping this typed means TypeScript catches
// typos and dead references.
export type DsIconName =
  | "close"
  | "calendar"
  | "arrow-down"
  | "arrow-up-right"
  | "arrow-left"
  | "arrow-right"
  | "disclosure-right"
  | "disclosure-left"
  | "disclosure-down"
  | "disclosure-up"
  | "card"
  | "bank"
  | "edit"
  | "home"
  | "message"
  | "settings"
  | "warning"
  | "linked"
  | "checkmark"
  | "checkmark-small"
  | "circle-checkmark"
  | "circle-info"
  | "alerts"
  | "shield"
  | "bolt"
  | "bolt-filled"
  | "clock"
  | "refresh"
  | "activity"
  | "shop"
  | "bag"
  | "money"
  | "percent"
  | "menu"
  | "bell"
  | "autopay"
  | "apple-pay"
  | "amazon-pay"
  | "tag"
  | "store"

type Props = {
  name: DsIconName
  size?: number
  className?: string
  ariaLabel?: string
}

// Next.js prepends `basePath` to <Link> hrefs and `next/image` sources, but
// NOT to raw URLs baked into inline styles like our mask-image reference.
// We prefix it manually so the SVGs resolve correctly under Quickhost's
// `/viewer/<id>/` prefix. Kept as `NEXT_PUBLIC_*` so it's inlined into the
// client bundle at build time.
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ""

const DsIcon = ({ name, size = 24, className, ariaLabel }: Props) => {
  const url = `url(${BASE_PATH}/ds-icons/${name}.svg)`
  return (
    <span
      role={ariaLabel ? "img" : undefined}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
      className={cn("inline-block bg-current shrink-0", className)}
      style={{
        width: size,
        height: size,
        WebkitMaskImage: url,
        maskImage: url,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskSize: "contain",
        maskSize: "contain"
      }}
    />
  )
}

export default DsIcon
